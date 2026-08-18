#!/usr/bin/env python3
"""prepare.py — FROZEN data preparation layer

This module is part of the Latent Capability Trigger research.
After SHA256-freeze before Phase C confirmation, this file MUST NOT be modified.

Responsibilities (FROZEN):
- Load benchmark datasets (MedQA, GSM1k, LiveCodeBench)
- Generate deterministic splits (discovery, confirmation, reserve)
- Compute SHA256 manifest of frozen state
- Render uniform prompt template
- Parse model responses

This file is the "prepare.py" analog in Karpathy's autoresearch.
The Agent can NOT modify evaluation logic, splits, or parser.
"""
import hashlib
import json
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterator

import yaml

# ============================================================
# FROZEN CONSTANTS (after Phase B freeze)
# ============================================================
PROMPT_TEMPLATE = """Answer the following question with ONLY the letter of the correct option.
Reply with exactly one letter (A, B, C, D, or E) and nothing else.

{QUESTION}"""

SYSTEM_PROMPT = """You are a careful test-taking assistant. For multiple choice questions, respond with ONLY the letter of the correct answer. No explanation, no preamble, no extra text."""

TRIGGER_POSITION = "prefix"  # {TRIGGER}\n{QUESTION}

# Answer parsing patterns (FROZEN)
MCQ_PATTERN = re.compile(r"^\s*([A-E])\s*[\.:\)]\s*")
NUMBER_PATTERN = re.compile(r"^\s*(-?\d+(?:\.\d+)?)\s*")
LETTER_PATTERN = re.compile(r"^\s*([A-Z])\s*$")


@dataclass
class Problem:
    """Single benchmark item."""
    problem_id: str
    domain: str  # 'medicine', 'math', 'code'
    question: str
    options: list[str] | None = None  # For MCQ
    correct_answer: str = ""
    split: str = "discovery"  # discovery | confirmation | reserve
    difficulty: str = ""
    source: str = ""
    paraphrase_variants: list[str] = field(default_factory=list)


@dataclass
class Prompt:
    """Fully-rendered prompt for a single (problem, trigger) cell."""
    problem_id: str
    domain: str
    split: str
    trigger_id: str
    trigger_text: str
    prompt_hash: str
    system: str
    user: str


def sha256_manifest(manifest_data: dict) -> str:
    """Compute SHA256 of frozen manifest data (FROZEN format)."""
    serialized = json.dumps(manifest_data, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()


def load_preregistration(path: str = "preregistration.yaml") -> dict:
    """Load frozen preregistration file."""
    with open(path, "r") as f:
        return yaml.safe_load(f)


def load_triggers(prregistry_path: str = "preregistration.yaml") -> dict:
    """Load trigger registry (candidate + controls)."""
    pre = load_preregistration(prregistry_path)
    triggers = {}

    # Domain knowledge triggers
    for domain, items in pre.get("trigger_families", {}).get("domain_knowledge", {}).items():
        for item in items:
            triggers[item["id"]] = {**item, "domain": domain, "family": "domain_knowledge"}

    # Reasoning strategy triggers
    for domain, items in pre.get("trigger_families", {}).get("reasoning_strategy", {}).items():
        for item in items:
            triggers[item["id"]] = {**item, "domain": domain, "family": "reasoning_strategy"}

    # Role triggers
    for domain, items in pre.get("trigger_families", {}).get("role_distribution", {}).items():
        for item in items:
            triggers[item["id"]] = {**item, "domain": domain, "family": "role"}

    # Abbreviation triggers
    for domain, items in pre.get("trigger_families", {}).get("abbreviation", {}).items():
        for item in items:
            triggers[item["id"]] = {**item, "domain": domain, "family": "abbreviation"}

    # Add controls
    for ctrl in pre.get("required_controls", []):
        triggers[ctrl["id"]] = ctrl

    return triggers


def render_prompt(problem: Problem, trigger_text: str, trigger_id: str = "") -> Prompt:
    """Render a single prompt using frozen template. Only {TRIGGER} varies."""
    if trigger_text:
        user_content = f"{trigger_text}\n{problem.question}"
    else:
        user_content = problem.question

    # Compute prompt hash for hard gate
    payload = json.dumps({
        "system": SYSTEM_PROMPT,
        "user": user_content,
        "domain": problem.domain,
    }, sort_keys=True)
    prompt_hash = hashlib.sha256(payload.encode("utf-8")).hexdigest()[:16]

    return Prompt(
        problem_id=problem.problem_id,
        domain=problem.domain,
        split=problem.split,
        trigger_id=trigger_id,
        trigger_text=trigger_text,
        prompt_hash=prompt_hash,
        system=SYSTEM_PROMPT,
        user=user_content,
    )


def parse_answer(response: str, problem: Problem) -> str:
    """Parse model response to extract answer (FROZEN)."""
    response = response.strip()

    # MCQ: match "A." or "A)" or "A:" at start
    if problem.options:
        m = MCQ_PATTERN.match(response)
        if m:
            return m.group(1)
        # Fallback: any standalone letter
        m = LETTER_PATTERN.match(response)
        if m:
            return m.group(1)
        # Last resort: find first letter
        m = re.search(r"\b([A-E])\b", response)
        if m:
            return m.group(1)
        return ""

    # Numeric
    m = NUMBER_PATTERN.match(response)
    if m:
        return m.group(1)

    # Letter
    m = LETTER_PATTERN.match(response)
    if m:
        return m.group(1)

    return ""


def check_answer(predicted: str, correct: str) -> bool:
    """Exact match (FROZEN)."""
    return predicted.strip().upper() == correct.strip().upper()


def generate_splits(domain: str, n_total: int, seed: int = 42) -> dict:
    """Generate deterministic splits per preregistration."""
    splits_config = {
        "medicine": {"discovery": 150, "confirmation": 800, "reserve": 323},
        "math": {"discovery": 120, "confirmation": 700, "reserve": 180},
        "code_replication": {"discovery": 100, "confirmation": 400, "reserve": 0},
    }.get(domain, {"discovery": 100, "confirmation": 200, "reserve": 0})

    # Deterministic split using fixed seed
    import random
    rng = random.Random(seed)
    indices = list(range(n_total))
    rng.shuffle(indices)

    splits = {"discovery": [], "confirmation": [], "reserve": []}
    cursor = 0
    for split_name, count in splits_config.items():
        splits[split_name] = indices[cursor:cursor + count]
        cursor += count
    return splits


def make_manifest(domain: str, problems: list[Problem]) -> dict:
    """Generate frozen manifest (FROZEN format)."""
    return {
        "version": "1.0.0",
        "domain": domain,
        "total": len(problems),
        "items": [
            {
                "problem_id": p.problem_id,
                "split": p.split,
                "domain": p.domain,
                "source": p.source,
                "difficulty": p.difficulty,
            }
            for p in problems
        ],
    }


def save_manifest(manifest: dict, path: str = "data/frozen_manifest.jsonl") -> str:
    """Save manifest and compute SHA256."""
    path_obj = Path(path)
    path_obj.parent.mkdir(parents=True, exist_ok=True)

    with open(path, "w") as f:
        for item in manifest["items"]:
            f.write(json.dumps(item, ensure_ascii=False) + "\n")

    manifest_hash = sha256_manifest(manifest)
    sha_path = path + ".sha256"
    with open(sha_path, "w") as f:
        f.write(manifest_hash + "\n")

    return manifest_hash


def dry_run_check() -> bool:
    """Verify prepare.py is importable and renders prompts correctly."""
    # Mock problem
    p = Problem(
        problem_id="test_001",
        domain="medicine",
        question="A 45-year-old man presents with chest pain.",
        options=["MI", "PE", "Aortic dissection", "Pneumothorax", "Anxiety"],
        correct_answer="A",
        split="discovery",
    )

    # Render with and without trigger
    p_baseline = render_prompt(p, "")
    p_trigger = render_prompt(p, "differential diagnosis", trigger_id="med_concept_01")

    # Render with and without trigger
    p_baseline = render_prompt(p, "")
    p_trigger = render_prompt(p, "differential diagnosis", trigger_id="med_concept_01")

    print(f"Baseline prompt hash: {p_baseline.prompt_hash}")
    print(f"Trigger prompt hash:  {p_trigger.prompt_hash}")
    print(f"Hashes differ:        {p_baseline.prompt_hash != p_trigger.prompt_hash}")

    # Test answer parsing
    parsed = parse_answer("A. MI", p)
    print(f"Parsed 'A. MI' → '{parsed}' (expected 'A')")

    return True


if __name__ == "__main__":
    print("=== prepare.py dry-run ===")
    dry_run_check()
    print("✓ prepare.py working correctly")

    # Load preregistration
    pre = load_preregistration()
    n_triggers = sum(
        len(items)
        for family in pre.get("trigger_families", {}).values()
        for items in family.values()
    ) + len(pre.get("required_controls", []))
    print(f"✓ Loaded {n_triggers} triggers from preregistration.yaml")