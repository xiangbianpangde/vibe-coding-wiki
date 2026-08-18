# Next Hypothesis (Round 1)

## Hypothesis
> Some domain-specific surface strings (e.g., `differential diagnosis` for Medicine, `invariant` for Math) produce reproducible positive paired accuracy effect (≥ +5pp) on confirmation split, beating both baseline and matched random controls, with Holm-Bonferroni adjusted p < 0.05.

## Rationale (from /sol design)
1. Latent Capability Trigger Hypothesis is plausible based on:
   - Chain-of-Thought prompting literature (Wei et al., 2022)
   - Function vector research (Todd et al., 2023)
   - Activation steering work (Li et al., 2023)
2. Domain-specific terms (e.g., `differential diagnosis`) co-occur with structured reasoning patterns in training data
3. Bare lexical cues may steer model into corresponding reasoning strategy
4. Effect should:
   - Replicate across paraphrased problems
   - Beat matched random controls (`banana`, `mivora`, `xqz17`)
   - Show domain specificity (med triggers don't help math, vice versa)

## Test Plan
1. Run discovery (Phase A) with anchor model on:
   - MedQA: 150 discovery items × ~27 conditions (19 triggers + 8 controls)
   - GSM1k: 120 discovery items × ~27 conditions
   - Total: ~7,290 calls
2. Analyze results to find promising triggers:
   - Effect ≥ +5pp
   - Beats matched controls
   - Domain-specificity hint
3. Freeze promising triggers + statistical plan (Phase B)
4. Confirmation (Phase C) on frozen confirmation split (~600 items × ~8 conditions/domain)
5. Replication (Phase D) across 2 additional models + low/medium/high effort

## Expected Outcomes
- **H1 supported**: +5-10pp trigger improvement with proper controls
- **H0 supported**: no trigger improves over baseline+matched controls
- **Mixed**: some triggers help, some don't (most likely outcome)

## Pre-registration Requirements (FROZEN)
- preregistration.yaml: complete with 21 sections
- Hard gates: 20 validation rules
- Statistical plan: Holm-Bonferroni, McNemar, bootstrap CI

## Decision Rule (Frozen Before Confirmation)
> Do NOT select triggers merely because they produced the highest observed raw score. Use the preregistered selection rule (e.g., top-K by Δ AND beats ≥1 matched control AND domain-specific).

## Stop Conditions
- **Discovery**: stop when budget exhausted (no extending because "almost significant")
- **Confirmation**: stop only after all preregistered cells completed
- **Replication**: stop after Week 3 (do NOT extend to "search 1000 more words")

## Status

- [ ] Anchor model selected
- [ ] API key configured
- [ ] Real datasets downloaded (MedQA, GSM1k)
- [ ] Phase B freeze committed + SHA256
- [ ] Discovery run executed

## Current Step

Infrastructure complete (Phase 0). Awaiting API key holder.