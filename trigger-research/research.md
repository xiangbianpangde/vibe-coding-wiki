# Latent Capability Trigger Research — Long-term Memory

> Maintained per autoresearch-style memory pattern. Each experiment reads this file before proposing hypotheses.

---

## Project State

### Phase: Pre-Discovery (Infrastructure Build)

### Sol Design
- Job ID: `8497c08c-77b2-4893-89c3-97237224a50b`
- Sol-recommended scope: 2-3 weeks, MedQA + Math, Coding as replication
- Model: GPT-5.6 Sol High (thinking_extended)
- Status: ✅ Complete

### Author Constraints
- I (audit / leader) have no LLM API access
- Actual experiment execution requires API key holder
- All code is **dry-run tested** with mock provider
- No real LLM calls have been made

---

## Repository

```
trigger-research/
├── program.md              # Research policy (frozen)
├── preregistration.yaml    # Hypotheses + statistical plan
├── README.md               # Reproduction guide
├── prepare.py              # FROZEN: data, splits, prompt renderer
├── runner.py               # FROZEN: API orchestration
├── evaluate.py             # FROZEN: metrics + statistics
├── data/
│   ├── frozen_manifest.jsonl         # TODO: real data
│   ├── frozen_manifest.sha256        # TODO: hash after freeze
│   └── splits/
│       ├── discovery.json            # TODO: real split IDs
│       ├── confirmation.json         # TODO: real split IDs
│       └── reserve.json               # TODO: real split IDs
├── triggers/
│   ├── candidate.yaml     # 19 triggers from preregistration
│   ├── controls.yaml      # TODO: extract from preregistration
│   └── selected.yaml      # FROZEN after Phase B
├── runs/
│   ├── discovery/raw.jsonl          # Generated during dry-run
│   ├── confirmation/raw.jsonl       # FROZEN conditions
│   └── replication/raw.jsonl
├── results.tsv              # append-only experiment log
├── research.md              # this file
├── next_hypothesis.md       # current candidate hypothesis
└── stats.json               # computed statistics
```

---

## Decisions Made

### Phase A: Discovery (Pre-run)

#### Hypothesis 0 (current)
> Some domain-specific surface strings may produce reproducible positive paired accuracy effect on MedQA / GSM1k vs baseline and matched controls.

#### Methodology
- Two domains: Medicine (MedQA) + Math (GSM1k)
- 19 candidate triggers (5 families) + 8 controls
- N=150-600 per cell, depending on effect size
- Anchor model: 1 (e.g., GPT-4o)
- Cross-model replication: 2 additional models
- Reasoning-effort: low/medium/high × trigger interaction

#### Open Decisions
- [ ] Anchor model selection: which model? (recommend GPT-4o for cost / capability tradeoff)
- [ ] Dataset fetch: how to download MedQA / GSM1k
- [ ] Trigger generation: corpus-derived (PMI) — needs implementation
- [ ] Mock provider limitations: does not match real provider latency / cost

---

## Open Questions

1. **Anchor model**: GPT-4o (cheap, widely-used) or GPT-5 (latest) or Claude-3.5-Sonnet (cross-vendor comparison)?
2. **Open-weight replication**: should v2 include Llama / Qwen for mechanistic layer (Level 3)?
3. **Token budget**: how to fix max_output_tokens per domain (32 for MedQA but GSM1k might need more for explanation)?
4. **Trigger sourcing**: theory-driven only, or also corpus-derived (PMI) for v1?

---

## References

- Karpathy autoresearch: https://github.com/karpathy/autoresearch
- MedQA: Jin et al., 2021
- GSM1k: Zhang et al., 2024
- LiveCodeBench: Jain et al., 2024
- Function Vectors: Todd et al., 2023
- Activation Steering: Li et al., 2023
- Sol design: /tmp/oracle-8497c08c-77b2-4893-89c3-97237224a50b/response.md