#!/usr/bin/env python3
"""runner.py — FROZEN experiment runner

This module is part of the Latent Capability Trigger research.
After SHA256-freeze before Phase C confirmation, this file MUST NOT be modified.

Responsibilities (FROZEN):
- Orchestrate API calls to OpenAI / Anthropic / Google / open-weight
- Enforce request randomization
- Implement retry policy (transport failures only, identical payload)
- Save raw responses to runs/{phase}/raw.jsonl
- Track all metadata: model, trigger, problem, latency, tokens, retry count

This is the "runner" analog in Karpathy's autoresearch.
The Agent CANNOT modify API orchestration, retry policy, or metadata schema.
"""
import argparse
import asyncio
import hashlib
import json
import os
import random
import time
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Optional

# Provider-agnostic imports (graceful if missing)
try:
    import openai
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False

try:
    import anthropic
    HAS_ANTHROPIC = True
except ImportError:
    HAS_ANTHROPIC = False

try:
    from google import genai
    HAS_GOOGLE = True
except ImportError:
    HAS_GOOGLE = False

from prepare import (
    Problem,
    Prompt,
    load_preregistration,
    load_triggers,
    render_prompt,
    parse_answer,
    check_answer,
)


# ============================================================
# FROZEN CONSTANTS (after Phase B freeze)
# ============================================================
FROZEN_SEED = 42
DEFAULT_TIMEOUT = 90
MAX_OUTPUT_TOKENS = 32
TEMPERATURE = 0.0
RETRY_ON_TRANSPORT = 1
RETRY_ON_SEMANTIC = 0  # Triggers MUST NOT retry semantically


@dataclass
class RunRecord:
    """Single API call result (FROZEN schema)."""
    run_id: str
    problem_id: str
    domain: str
    split: str
    trigger_id: str
    trigger_text: str
    model: str
    effort: str  # low/medium/high or n/a
    prompt_hash: str
    response: str
    parsed_answer: str
    correct: bool
    input_tokens: int
    output_tokens: int
    reasoning_tokens: Optional[int] = None
    latency_ms: int = 0
    api_cost_usd: float = 0.0
    retry_count: int = 0
    error: Optional[str] = None
    timestamp: str = ""


# ============================================================
# Provider Adapters (FROZEN during active run)
# ============================================================
class ProviderError(Exception):
    """ transportError: network / API / rate-limit failures. May retry with identical payload. """
    pass


class SemanticError(Exception):
    """ semanticError: model produced invalid output. MUST NOT retry. """
    pass


async def call_openai(prompt: Prompt, model: str, effort: str = "medium") -> dict:
    """Call OpenAI API. (FROZEN during active run.)"""
    if not HAS_OPENAI:
        raise ProviderError("openai library not installed")
    if not os.environ.get("OPENAI_API_KEY"):
        raise ProviderError("OPENAI_API_KEY not set")

    client = openai.AsyncOpenAI()

    # Map effort to OpenAI reasoning_effort
    effort_map = {"low": "low", "medium": "medium", "high": "high", "n/a": "medium"}
    reasoning_effort = effort_map.get(effort, "medium")

    kwargs = {
        "model": model,
        "messages": [
            {"role": "system", "content": prompt.system},
            {"role": "user", "content": prompt.user},
        ],
        "max_completion_tokens": MAX_OUTPUT_TOKENS,
        "temperature": TEMPERATURE,
    }
    # Only add reasoning_effort for reasoning models
    if any(m in model for m in ["o1", "o3", "o4", "gpt-5"]):
        kwargs["reasoning_effort"] = reasoning_effort

    start = time.time()
    try:
        resp = await asyncio.wait_for(
            client.chat.completions.create(**kwargs),
            timeout=DEFAULT_TIMEOUT,
        )
    except (openai.APIError, openai.APITimeoutError, asyncio.TimeoutError) as e:
        raise ProviderError(f"OpenAI error: {e}")
    except Exception as e:
        raise ProviderError(f"Unexpected OpenAI error: {e}")

    latency = int((time.time() - start) * 1000)

    usage = resp.usage
    return {
        "response": resp.choices[0].message.content,
        "input_tokens": usage.prompt_tokens,
        "output_tokens": usage.completion_tokens,
        "reasoning_tokens": getattr(usage, "reasoning_tokens", None),
        "latency_ms": latency,
    }


async def call_anthropic(prompt: Prompt, model: str, effort: str = "medium") -> dict:
    """Call Anthropic API. (FROZEN during active run.)"""
    if not HAS_ANTHROPIC:
        raise ProviderError("anthropic library not installed")
    if not os.environ.get("ANTHROPIC_API_KEY"):
        raise ProviderError("ANTHROPIC_API_KEY not set")

    client = anthropic.AsyncAnthropic()

    # Map effort to Anthropic thinking parameter
    thinking_budget = {"low": 1024, "medium": 4096, "high": 16384, "n/a": None}[effort]

    kwargs = {
        "model": model,
        "max_tokens": MAX_OUTPUT_TOKENS,
        "temperature": TEMPERATURE,
        "system": prompt.system,
        "messages": [{"role": "user", "content": prompt.user}],
    }
    if thinking_budget is not None:
        kwargs["thinking"] = {"type": "enabled", "budget_tokens": thinking_budget}

    start = time.time()
    try:
        resp = await asyncio.wait_for(
            client.messages.create(**kwargs),
            timeout=DEFAULT_TIMEOUT,
        )
    except (anthropic.APIError, anthropic.APITimeoutError, asyncio.TimeoutError) as e:
        raise ProviderError(f"Anthropic error: {e}")
    except Exception as e:
        raise ProviderError(f"Unexpected Anthropic error: {e}")

    latency = int((time.time() - start) * 1000)

    # Extract content (skip thinking blocks)
    response_text = ""
    reasoning_tokens = None
    for block in resp.content:
        if hasattr(block, "thinking"):
            reasoning_tokens = (reasoning_tokens or 0) + len(block.thinking.split())
        elif hasattr(block, "text"):
            response_text += block.text

    return {
        "response": response_text,
        "input_tokens": resp.usage.input_tokens,
        "output_tokens": resp.usage.output_tokens,
        "reasoning_tokens": reasoning_tokens,
        "latency_ms": latency,
    }


async def call_google(prompt: Prompt, model: str, effort: str = "medium") -> dict:
    """Call Google API. (FROZEN during active run.)"""
    if not HAS_GOOGLE:
        raise ProviderError("google-cloud-aiplatform not installed")
    if not os.environ.get("GOOGLE_API_KEY"):
        raise ProviderError("GOOGLE_API_KEY not set")

    client = genai.Client()

    start = time.time()
    try:
        resp = await asyncio.wait_for(
            client.aio.models.generate_content(
                model=model,
                contents=[prompt.system + "\n\n" + prompt.user],
                config={"max_output_tokens": MAX_OUTPUT_TOKENS, "temperature": TEMPERATURE},
            ),
            timeout=DEFAULT_TIMEOUT,
        )
    except Exception as e:
        raise ProviderError(f"Google error: {e}")

    latency = int((time.time() - start) * 1000)

    usage = resp.usage_metadata
    return {
        "response": resp.text,
        "input_tokens": usage.prompt_token_count,
        "output_tokens": usage.candidates_token_count,
        "reasoning_tokens": getattr(usage, "thoughts_token_count", None),
        "latency_ms": latency,
    }


async def call_mock(prompt: Prompt, model: str, effort: str = "n/a") -> dict:
    """Mock provider for dry-run / testing (NOT for real experiment)."""
    # Deterministic mock answer: pick first letter / first number
    await asyncio.sleep(0.01)  # Simulate latency

    # Heuristic: pick answer based on prompt content
    response = "A" if "diagnosis" in prompt.user.lower() else "B"
    return {
        "response": response,
        "input_tokens": len(prompt.user.split()),
        "output_tokens": 1,
        "reasoning_tokens": 0,
        "latency_ms": 10,
    }


PROVIDERS = {
    "openai": call_openai,
    "anthropic": call_anthropic,
    "google": call_google,
    "mock": call_mock,
}


# ============================================================
# Single cell execution (FROZEN)
# ============================================================
async def execute_cell(
    prompt: Prompt,
    model: str,
    provider: str,
    effort: str = "medium",
) -> RunRecord:
    """Execute ONE (problem, trigger) cell with frozen retry policy."""
    call_fn = PROVIDERS.get(provider)
    if not call_fn:
        raise ValueError(f"Unknown provider: {provider}")

    timestamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    run_id = f"{prompt.problem_id}_{prompt.trigger_id}_{int(time.time()*1000)}"

    retry_count = 0
    last_error = None

    for attempt_n in range(RETRY_ON_TRANSPORT + 1):
        try:
            result = await call_fn(prompt, model, effort)
            return RunRecord(
                run_id=run_id,
                problem_id=prompt.problem_id,
                domain=prompt.domain,
                split=prompt.split,
                trigger_id=prompt.trigger_id,
                trigger_text=prompt.trigger_text,
                model=model,
                effort=effort,
                prompt_hash=prompt.prompt_hash,
                response=result["response"],
                parsed_answer="",  # Set by caller after parsing against ground truth
                correct=False,  # Set by caller
                input_tokens=result["input_tokens"],
                output_tokens=result["output_tokens"],
                reasoning_tokens=result.get("reasoning_tokens"),
                latency_ms=result["latency_ms"],
                api_cost_usd=0.0,  # TODO: cost calculator per provider
                retry_count=retry_count,
                error=None,
                timestamp=timestamp,
            )
        except ProviderError as e:
            last_error = str(e)
            retry_count += 1
            if attempt_n < RETRY_ON_TRANSPORT:
                continue  # Retry with identical payload
            else:
                # Return failed record (do NOT silently drop)
                return RunRecord(
                    run_id=run_id,
                    problem_id=prompt.problem_id,
                    domain=prompt.domain,
                    split=prompt.split,
                    trigger_id=prompt.trigger_id,
                    trigger_text=prompt.trigger_text,
                    model=model,
                    effort=effort,
                    prompt_hash=prompt.prompt_hash,
                    response="",
                    parsed_answer="",
                    correct=False,
                    input_tokens=0,
                    output_tokens=0,
                    reasoning_tokens=None,
                    latency_ms=0,
                    api_cost_usd=0.0,
                    retry_count=retry_count,
                    error=last_error,
                    timestamp=timestamp,
                )
        except SemanticError as e:
            # MUST NOT retry
            return RunRecord(
                run_id=run_id,
                problem_id=prompt.problem_id,
                domain=prompt.domain,
                split=prompt.split,
                trigger_id=prompt.trigger_id,
                trigger_text=prompt.trigger_text,
                model=model,
                effort=effort,
                prompt_hash=prompt.prompt_hash,
                response="",
                parsed_answer="",
                correct=False,
                input_tokens=0,
                output_tokens=0,
                reasoning_tokens=None,
                latency_ms=0,
                api_cost_usd=0.0,
                retry_count=retry_count,
                error=f"SEMANTIC: {e}",
                timestamp=timestamp,
            )


# ============================================================
# Run orchestration (FROZEN)
# ============================================================
def randomize_execution_order(
    cells: list[tuple[Prompt, str]], seed: int = FROZEN_SEED
) -> list[tuple[Prompt, str]]:
    """Randomize execution order with frozen seed (FROZEN)."""
    rng = random.Random(seed)
    cells_copy = list(cells)
    rng.shuffle(cells_copy)
    return cells_copy


def save_run_record(record: RunRecord, output_dir: str):
    """Append run record to raw.jsonl (FROZEN schema)."""
    path = Path(output_dir) / "raw.jsonl"
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "a") as f:
        f.write(json.dumps(asdict(record), ensure_ascii=False) + "\n")


async def run_phase(
    problems: list[Problem],
    triggers: dict,
    phase: str,
    model: str,
    provider: str,
    effort: str = "medium",
    seed: int = FROZEN_SEED,
):
    """Run all (problem × trigger) cells for one phase."""
    # Filter problems by split
    split_filter = {
        "discovery": "discovery",
        "confirmation": "confirmation",
        "replication": "confirmation",  # Same split, different model
    }.get(phase, "discovery")

    filtered_problems = [p for p in problems if p.split == split_filter]
    print(f"Phase {phase}: {len(filtered_problems)} problems × {len(triggers)} triggers = {len(filtered_problems)*len(triggers)} cells")

    # Build cells
    cells = []
    for problem in filtered_problems:
        for trigger_id, trigger_info in triggers.items():
            # Skip if trigger domain doesn't match problem domain (except controls)
            if "domain" in trigger_info and trigger_info["domain"] != problem.domain:
                continue
            prompt = render_prompt(problem, trigger_info["text"], trigger_id)
            cells.append((prompt, problem))

    # Randomize
    cells = randomize_execution_order(cells, seed)

    output_dir = f"runs/{phase}"
    print(f"Saving to {output_dir}/raw.jsonl")

    for i, (prompt, problem) in enumerate(cells):
        if i % 10 == 0:
            print(f"  [{i+1}/{len}] {prompt.problem_id} × {prompt.trigger_id}")
        record = await execute_cell(prompt, model, provider, effort)
        # Check correctness (need problem for parse_answer)
        record.parsed_answer = parse_answer(record.response, problem)
        from prepare import check_answer
        record.correct = check_answer(record.parsed_answer, problem.correct_answer)
        save_run_record(record, output_dir)


# ============================================================
# CLI
# ============================================================
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--phase", choices=["discovery", "confirmation", "replication"], required=True)
    parser.add_argument("--provider", choices=list(PROVIDERS.keys()), default="mock")
    parser.add_argument("--model", default="gpt-4o")
    parser.add_argument("--domain", default="medicine")
    parser.add_argument("--effort", default="medium")
    parser.add_argument("--limit", type=int, default=None, help="Limit number of problems (for testing)")
    args = parser.parse_args()

    # Load triggers
    triggers = load_triggers()
    print(f"Loaded {len(triggers)} triggers")

    # Load problems (mock for now; real loader would fetch from MedQA/GSM1k)
    from prepare import Problem, generate_splits

    # Generate mock problems for testing
    mock_problems = []
    for i in range(args.limit or 10):
        p = Problem(
            problem_id=f"mock_{args.domain}_{i:03d}",
            domain=args.domain,
            question=f"Sample question {i}?",
            options=["A", "B", "C", "D", "E"] if args.domain == "medicine" else None,
            correct_answer="A" if i % 2 == 0 else "B",
            split="discovery" if args.phase == "discovery" else "confirmation",
        )
        mock_problems.append(p)

    # Run
    asyncio.run(run_phase(
        mock_problems,
        triggers,
        args.phase,
        args.model,
        args.provider,
        args.effort,
    ))


if __name__ == "__main__":
    main()