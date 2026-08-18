# Latent Capability Trigger Research

> **Investigating whether short lexical cues can systematically elicit latent LLM capabilities in specific vertical domains.**

## TL;DR

Following Karpathy's `autoresearch` paradigm, we test the hypothesis that LLM training data distribution creates "latent mode selectors" — tokens/phrases whose presence in a prompt can switch the model into a more capable internal state without changing model weights.

This repo contains the **research infrastructure** (preparation, runner, evaluation, hard gates, statistics). Actual LLM API calls require an API key holder (not in this repo).

## Quick Start (for API key holder)

```bash
# Install dependencies
pip install openai anthropic google-cloud-aiplatform transformers torch

# Set environment
export OPENAI_API_KEY="sk-..."
export ANTHROPIC_API_KEY="sk-ant-..."
# (no keys needed for mock provider dry-run)

# Verify infrastructure
python prepare.py --dry-run
python runner.py --mock --trigger baseline --limit 5
python evaluate.py --run runs/discovery/test.jsonl

# Run discovery (Phase A)
python runner.py --phase discovery --model gpt-4o --domain medicine

# Freeze for confirmation (Phase B)
git add -A
git commit -m "freeze: pre-confirmation state"
sha256sum preregistration.yaml triggers/selected.yaml data/frozen_manifest.jsonl > data/frozen_manifest.sha256

# Run confirmation (Phase C — once only!)
python runner.py --phase confirmation --model gpt-4o --domain medicine
# DO NOT inspect results before completing full confirmation

# Replication (Phase D)
python runner.py --phase replication --model claude-3-5-sonnet --domain medicine --effort-levels low,medium,high
```

## Architecture (autoresearch-style)

```
┌─────────────────────────────────────────────────────────────┐
│ program.md              # Research policy (frozen)             │
│ preregistration.yaml    # Hypotheses + statistical plan       │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
┌────────────────────┐    ┌────────────────────┐
│ prepare.py         │    │ train.py           │
│ FROZEN             │    │ EDITABLE           │
│                    │    │ (discovery only)   │
│ • data loading     │    │ • trigger registry│
│ • prompt renderer  │    │ • ablation design │
│ • split IDs        │    │                    │
│ • answer parser    │    │                    │
│ • eval function    │    │                    │
└────────┬───────────┘    └────────┬───────────┘
         │                         │
         └────────────┬────────────┘
                      ▼
         ┌────────────────────┐
         │ runner.py           │
         │ FROZEN              │
         │ • API calls        │
         │ • randomization    │
         │ • retry policy     │
         │ • request logging  │
         └────────┬───────────┘
                  ▼
         ┌────────────────────┐
         │ evaluate.py         │
         │ FROZEN              │
         │ • paired accuracy  │
         │ • bootstrap CI      │
         │ • McNemar test      │
         │ • Holm correction   │
         └────────┬───────────┘
                  ▼
         results.tsv (append-only)
         runs/{discovery,confirmation,replication}/raw.jsonl
         stats.json
         report.md
```

## Research Phases

| Phase | Goal | Modifiable | Outcome |
|-------|------|-----------|---------|
| **A. Discovery** | Find promising triggers | `train.py`, trigger candidates | Exploratory results, no claims |
| **B. Freeze** | Lock all parameters | Nothing (commit + hash) | Frozen SHA256 of all configs |
| **C. Confirmation** | Run once on confirmation split | Nothing | Confirmatory results |
| **D. Replication** | Cross-model + effort | Nothing | Final report |

**Critical**: Discovery can autoresearch. Confirmation MUST NOT.

## Statistical Rigor

- **Primary metric**: paired exact accuracy difference (percentage points)
- **Confidence interval**: paired bootstrap 95% CI (resample by `problem_id`)
- **Significance test**: Exact McNemar (paired binary)
- **Multiplicity**: Holm-Bonferroni for confirmation (FWER α=0.05), BH-FDR for discovery (q=0.10)
- **Sample size**: N ≥ 600 per domain for confirmation (can detect +5pp with q=0.30)

## Hard Gates (INVALID if violated)

See `preregistration.yaml` §18 for full list of 20 hard gates. Key ones:

- Frozen file hash mismatch → invalid
- Confirmation items inspected during trigger selection → invalid
- Trigger-specific retries → invalid
- LLM-as-judge as primary correctness → invalid
- Confirmation triggers selected using confirmation results → invalid
- Only favorable subgroups reported → invalid

## Scientific Claim Levels

| Level | Claim | Evidence Required |
|-------|-------|-------------------|
| 0 | Association | One benchmark + one model improvement |
| 1 | Replicated Behavioral Trigger | Untouched holdout + beats matched controls |
| 2 | Domain-Selective Trigger | Preregistered interaction + paraphrased problems |
| 3 | Mechanistic Latent Selector | Activation probing / causal intervention (open-weight only) |

**Black-box accuracy alone MUST NOT be described as Level 3.**

## Project Status

- [x] /sol design complete (job `8497c08c-77b2-4893-89c3-97237224a50b`)
- [x] `program.md` written (Sol-recommended scope)
- [x] `preregistration.yaml` written (all 21 sections)
- [ ] `prepare.py` (audit/leader writes)
- [ ] `runner.py` (audit/leader writes)
- [ ] `evaluate.py` (audit/leader writes)
- [ ] Mock provider for dry-run (audit/leader writes)
- [ ] Trigger registry schema (audit/leader writes)
- [ ] Hard gate validator (audit/leader writes)
- [ ] Discovery run (API key holder)
- [ ] Confirmation freeze commit (joint)
- [ ] Confirmation run (API key holder)
- [ ] Cross-model replication (API key holder)
- [ ] Reasoning-effort experiment (API key holder)
- [ ] Final stats + report (joint)

## Roles

| Role | Responsibilities |
|------|------------------|
| **Audit / Leader** | Write program.md, preregistration.yaml, prepare.py, runner.py, evaluate.py, hard gates, mock provider, reproducibility README. SHA256-freeze before confirmation. |
| **API Key Holder** | Configure provider keys, freeze trigger set per preregistered rule (NOT by accuracy), execute discovery/confirmation/replication runs, save raw API responses + manifest. |

## Limitations

This repo is **research infrastructure only**. It does NOT include:
- LLM API credentials
- Actual experiment results
- Pre-trained models

To run the experiment, you need:
- API keys for OpenAI / Anthropic / Google / open-weight models
- API budget for ~15,000-20,000 requests
- 2-3 weeks of compute time

## License

MIT

## References

- Karpathy autoresearch (the inspiration): https://github.com/karpathy/autoresearch
- Original autoresearch `program.md` research policy
- MedQA: Jin et al., 2021
- GSM1k: Zhang et al., 2024 (constructed to address GSM8K contamination)
- LiveCodeBench: Jain et al., 2024
- Function Vectors: Todd et al., 2023 (mechanistic plausibility)
- Activation Steering: Li et al., 2023 (mechanistic plausibility)