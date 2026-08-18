# Latent Capability Trigger Research Program

> 研究问题：短小的 lexical cue 是否能可靠地改变 LLM 在特定垂直领域任务上的准确率？
> **Sol-recommended scope**: 2-3 周，MedQA + Math，Coding 作为 replication/appendix
> **Author note**: 我（audit / leader）没 LLM API 实际跑实验的能力。这个 program.md 是给真人研究员（key holder）准备的 SOP。

---

## Primary Research Question

> Do short, minimally informative lexical cues produce reproducible, domain-selective gains in LLM task accuracy **beyond semantic paraphrases, generic reasoning prompts, and matched random controls**?

## Hypothesis Statement

**H0**: For any problem i, P(Yᵢ=1 | T=t) = P(Yᵢ=1 | T=∅). Triggers do not change accuracy.

**H1**: There exists some trigger t such that:
- Δ_t = P(Y=1|t) - P(Y=1|∅) > 0
- Effect replicates on untouched holdout
- Effect > matched random controls
- Effect NOT due to additional tokens alone
- Effect persists under problem paraphrasing
- Effect is stable across runs
- Effect ideally shows domain specificity

**Naming boundary**: Experiment unit = `surface-string trigger` (not token-level), because identical strings tokenize differently across models.

---

## Scope

### Primary Domains (P0)
1. **Medicine**: MedQA-USMLE (1,273 test items)
2. **Mathematics**: GSM1k + answer-preserving perturbations

### Replication Domain (P1)
3. **AI Coding**: LiveCodeBench (unit tests = strong ground truth)

### Excluded from v1
- Mechanistic interpretation (requires open-weight model — v2)
- Multi-model wide coverage (v1: 1 anchor + 2 replication models)
- Continuous discovery → confirmation (single confirmation only)

---

## Experimental Phases

### Phase A — Discovery (Week 1)
**Purpose**: screen trigger candidates, estimate discordance, identify promising trigger families, perform exploratory ablations.

**Discovery results MAY be inspected.** No confirmatory claims from discovery data.

**Methods**:
- Theory-driven triggers (hand-curated per domain)
- Corpus-derived triggers (PMI between domain corpus and English baseline)
- Model-generated candidates (LLM generates, but **never sees benchmark**)

### Phase B — Freeze (Before Confirmation)
**Before confirmation, freeze**:
- Trigger list
- Trigger selection rule
- Prompt templates
- Model IDs (exact snapshots)
- Model parameters (temperature, max_tokens, reasoning effort)
- Problem IDs (confirmation split)
- Answer parser
- Metrics
- Statistical tests (α, multiplicity correction)
- Primary hypothesis (pre-registration)

Commit and SHA256-hash all frozen files.

### Phase C — Confirmation (Week 2)
**Run frozen experiment ONCE on confirmation split.**

- No trigger modification after confirmation responses inspected
- All preregistered conditions run
- All preregistered contrasts reported (regardless of direction/significance)
- Failed confirmatory hypotheses remain in final report

### Phase D — Replication (Week 3)
- Additional model families
- Reasoning-effort levels (low/medium/high)
- 10% repeatability runs

**Stop here.** Do NOT extend to "search 1000 more words" — that's leaderboard hacking.

---

## Editable Files (Discovery Phase Only)

During **discovery**, the experiment agent MAY modify:
- `train.py`
- `triggers/candidate.yaml`
- `next_hypothesis.md`

The agent MAY append to:
- `results.tsv`
- `research.md`

## Frozen Files (NEVER Modify)

The experiment agent MUST NOT modify:
- `prepare.py` (dataset, splits, prompt renderer, parser, eval)
- `runner.py` (API call orchestration)
- `evaluate.py` (metrics)
- `preregistration.yaml` after freeze
- `data/frozen_manifest.jsonl`
- `data/frozen_manifest.sha256`
- Confirmation split IDs
- Scoring logic
- Provider adapters during active run

Any modification invalidates the run.

---

## Allowed Trigger Slot

Every primary prompt must have the form:

```
SYSTEM:
Answer the following question.
Return only the final answer in the required format.

USER:
{TRIGGER}
{QUESTION}
```

**Only `{TRIGGER}` may vary across experimental conditions.**

Empty `{TRIGGER}` = baseline condition.

DO NOT use instructional triggers like "Use differential diagnosis to carefully reason..." as primary — that's an instruction, not a lexical cue.

---

## Trigger Families (Theory-Driven Start)

| Family | Examples |
|--------|----------|
| Domain knowledge cue | `differential diagnosis`, `pathophysiology`, `Hamiltonian`, `amortized analysis` |
| Reasoning-strategy cue | `differential`, `rule out`, `dimensional analysis`, `invariant`, `counterexample` |
| Role/distribution cue | `radiologist`, `olympiad mathematician` |
| Abbreviation | `DDx`, `Dx`, `WLOG` |
| Generic reasoning control | `think carefully`, `reason step by step` |
| Unrelated real word control | `banana`, `harbor` |
| Nonce/gibberish control | `mivora`, `talnix`, `xqz17`, `vnr42` |

---

## Required Controls (5+ minimum)

| Control | Example | Controls for |
|---------|---------|--------------|
| baseline | `""` | No trigger |
| generic reasoning | `think carefully` | General prompt benefit |
| unrelated real word | `banana`, `harbor` | Any English word |
| nonce word | `mivora`, `talnix` | No pre-existing semantics |
| matched gibberish | `xqz17`, `vnr42` | Token/length effect |
| semantic paraphrase | `consider alternative possible diagnoses` | Pure semantic effect |

**Every claimed trigger must be compared against baseline AND ≥1 matched control.**

---

## Ablation Protocol

For each candidate trigger (e.g., `differential diagnosis`), test:
- `[none]`
- `differential diagnosis`
- `Differential diagnosis` (capitalization)
- `DDx`
- `differential` (single word)
- `consider alternative diagnoses` (semantic paraphrase)
- `diagnosis differential` (reordered)
- `d1fferential diagnosis` (typo)
- `mivora` (nonce)
- `banana` (real word)

Distinguishes:
- **Instruction** effect (vs semantic paraphrase)
- **Lexical** sensitivity (vs nonce control)
- **Casing** effect (vs lowercase)

---

## Dataset Freeze

### Math (1000 items)
- 120 discovery
- 700 confirmation
- 180 reserve (only for reviewer replication or bug fix)

### Medicine (~1,273 test items)
- 150 discovery
- 800 confirmation
- 323 reserve

### Reserve Rule
Reserve items used ONLY for:
- Reviewer-requested replication
- Bug that invalidates confirmation
- Paper revision stage 2

---

## Primary Metric

**Primary endpoint**: paired exact accuracy difference

```
Δ = Accuracy(trigger) - Accuracy(baseline)
```

All comparisons must use **identical problem IDs**.

## Secondary Metrics

- Paired bootstrap 95% confidence interval (problem-level resampling)
- Exact McNemar test
- Format compliance rate
- Abstention rate
- Input tokens
- Output tokens
- Reasoning-token usage (when available)
- Latency
- API cost (estimated)
- Run-to-run consistency (10% problems × 3 repeats)

---

## Statistical Tests

### Effect Size
- Primary: paired risk difference (percentage points)
- NOT Cohen's d (we have binary outcomes)

### Confidence Interval
- Paired bootstrap 95% CI
- Bootstrap resamples by `problem_id`, not by independent response

### Significance
- **Exact McNemar test** (paired binary)
- More appropriate than independent proportions test

### Multiplicity Correction
- **Discovery**: BH-FDR q=0.10 OR mark as exploratory
- **Confirmation**: Holm-Bonferroni, FWER α=0.05

---

## Sample Size Requirements

Power calculation (α=.05, power=.80):

| True effect | Discordant q | N needed |
|-------------|--------------|----------|
| +10 pp | 0.20 | ~150 |
| +10 pp | 0.30 | ~230 |
| +10 pp | 0.40 | ~310 |
| +5 pp | 0.20 | ~620 |
| +5 pp | 0.30 | ~935 |
| +5 pp | 0.40 | ~1250 |

**Implication**: N=150 insufficient for +5pp effects.

**Recommendation**:
- Discovery: N ≥ 150 (per estimate)
- Confirmation: N ≥ 400/domain minimum, 600-800 better

---

## Reasoning-Effort Experiment (Phase D)

Within each model, evaluate:
- `effort ∈ {low, medium, high}` (when natively supported)

**Primary interaction**:
```
I = Δ_trigger(low) - Δ_trigger(high)
```

**Important caveats**:
- Don't assume effort labels represent equivalent compute across providers
- OpenAI reasoning.effort is model-dependent
- Anthropic has adaptive thinking + effort
- Compare within-model: low → medium → high

**Equivalence claim** (e.g., "low+trigger ≈ high+baseline"):
- Use preregistered equivalence margin (e.g., ±2pp)
- Test |Acc(low,T) - Acc(high,B)| < margin
- NOT "failed to reject difference"

---

## Hard Gates (INVALID if violated)

A run is INVALID if any of:

1. frozen-file hash mismatch
2. confirmation items inspected during trigger selection
3. prompt text differs outside allowed trigger slot
4. question text changes across conditions
5. answer-choice order changes across conditions
6. model snapshot or model ID changes inside comparison
7. reasoning-effort config changes unexpectedly
8. output-token budget differs between trigger conditions
9. temperature/sampling config differs between conditions
10. responses share conversational state across conditions
11. answer parser changes after results seen
12. failed items silently removed
13. trigger-specific retries performed
14. semantic retries / self-correction retries
15. LLM-as-judge used as primary correctness metric
16. confirmation triggers selected using confirmation results
17. only favorable subgroups reported
18. raw responses or request metadata unavailable
19. request ordering not randomized
20. duplicate or missing problem-condition cells unexplained

Transport failures may retry ONLY with identical request payload, logged.

---

## Request Independence

Every problem × trigger condition = independent API request.

Do NOT reuse:
- Conversation history
- Assistant state
- Scratchpads
- Previous responses

**Randomize execution order** over (problem × trigger × model × effort) with frozen random seed.

---

## Scientific Claim Levels

| Level | Claim | Evidence Required |
|-------|-------|-------------------|
| 0 | Association | One benchmark/model trigger improvement |
| 1 | Replicated Behavioral Trigger | Effect on untouched holdout + beats matched controls |
| 2 | Domain-Selective Trigger | Preregistered trigger × domain interaction + paraphrased problems |
| 3 | Mechanistic Latent Selector | Requires activation probing / causal intervention / activation patching |

**Black-box accuracy alone MUST NOT be described as Level 3.**

Closed APIs may have:
- Provider routing
- Hidden system prompting
- Adaptive reasoning allocation
- Tokenizer differences

So behavioral evidence is the floor, not the ceiling.

---

## Audit / Leader Responsibilities

- Freeze research question & claim boundary
- Write `program.md` (this file)
- Write `preregistration.yaml`
- Implement `prepare.py` (frozen)
- Implement dataset split
- Implement frozen manifest hash
- Implement uniform prompt renderer
- Write trigger registry schema
- Write random/nonce control generator
- Implement provider-agnostic `runner.py`
- Provide mock provider for API-less dry-run
- Implement answer parser
- Implement exact accuracy evaluator
- Implement paired bootstrap
- Implement McNemar test
- Implement Holm correction
- Implement effort interaction statistic
- Implement request randomization
- Implement hard-gate validation
- Implement append-only `results.tsv`
- Save all raw responses
- Write reproducibility README
- **Commit + tag + SHA256 freeze BEFORE confirmation**

---

## API Key Holder / Execution Researcher Responsibilities

- Configure provider API keys (NEVER commit to Git)
- Confirm exact model snapshot / model ID
- Confirm reasoning-effort support per provider
- Run smoke test
- Check usage/latency metadata recording
- Execute discovery run (no confirmation split access)
- **Freeze trigger set per preregistered selection rule (NOT by accuracy)**
- Create confirmation freeze commit
- Execute full confirmation run (transport failures only retry)
- Execute cross-model replication
- Execute reasoning-effort experiment
- Save raw API responses + run manifest

---

## Joint Audit Responsibilities

- Check frozen hashes
- Check missing cells
- Check no trigger-specific retries
- Check model version consistency
- Check all preregistered hypotheses reported
- Holm correction BEFORE significance claims
- Report effect size + CI
- Distinguish exploratory vs confirmatory in final report
- Failed results NOT deleted
- Publish complete trigger registry, problem IDs, code, statistical methods

---

## Interpretation Hierarchy (Sol-provided)

If you find +5–10pp, do NOT immediately claim "discovered latent mode selector".

| Level | Evidence Pattern | Claim |
|-------|------------------|-------|
| A | All paraphrases also help | Prompt/instruction effect |
| B | Paraphrase + DDx both help, banana/banana don't | Semantic strategy |
| C | Only specific lexical form, nonce 0 | Lexical sensitivity (interesting) |
| D | MedQA only, not Math | Domain-selective trigger |

**Cross-domain trigger** interpretation:
- If `audit` helps Medicine, Math, AND Coding uniformly:
  - More likely a **generic metacognitive cue** (more caution, more checking)
  - NOT "universal latent capability token"
- Check reasoning_tokens / latency / output_tokens
- If they also increase by 40%: it's an **implicit effort cue**

---

## Reasoning-Effort × Trigger Interpretation

If `Acc(low,T) ≈ Acc(high,∅)` AND `Acc(low,∅) ≪ Acc(high,∅)`:

| Explanation | Implication |
|-------------|-------------|
| 1. Trigger changes search policy (not compute) | Most interesting — same compute, better path |
| 2. Trigger implicitly increases compute | Implicit compute-allocation trigger |
| 3. High effort saturates the same strategy | Trigger × Effort negative interaction — beautiful result |

---

## 3 Critical Traps

### Trap 1: Confusing instruction with trigger
"Use differential diagnosis to carefully reason..." is instructional — not lexical cue. Bare cue must be the test.

### Trap 2: autoresearch pollutes benchmark
Discovery can autoresearch; Confirmation MUST NOT.

### Trap 3: Black-box accuracy → internal mechanism claim
Even with +10pp, p<0.001, 3 model replications:
- You prove prompt-conditioned behavioral capability shift
- NOT "discrete MEDICAL_EXPERT_MODE = ON"
- Closed APIs may have provider routing / hidden prompts

**Safest paper title**: "Latent Capability Trigger Hypothesis — behavioral evidence"
NOT: "we discovered internal latent modes"

---

## Project Roadmap (Sol-recommended 2-3 weeks)

### Week 1: Freeze infrastructure
- `prepare.py`, `runner.py`, `evaluate.py`
- Trigger registry, control generator
- Pre-registration
- Hard gates
- Dry-run (mock provider)
- Complete discovery

### Week 2: Main experiment
- Freeze candidate triggers
- Freeze confirmation IDs
- Freeze statistics
- Freeze models
- Execute Medicine + Math confirmation

### Week 3: Replication
- Cross-model
- Reasoning effort
- Ablation
- 10% repeatability
- Stats + report

**THEN STOP.** Do not extend.

---

## File Structure

```
trigger-research/
├── program.md                      # this file (frozen intent)
├── preregistration.yaml            # frozen hypotheses
├── README.md                       # reproduction guide
├── prepare.py                      # FROZEN (dataset, splits, prompt renderer)
├── runner.py                       # FROZEN (API orchestration)
├── evaluate.py                     # FROZEN (metrics)
├── providers/
│   ├── openai.py
│   ├── anthropic.py
│   ├── google.py
│   └── open_model.py
├── data/
│   ├── medqa_manifest.jsonl
│   ├── gsm1k_manifest.jsonl
│   ├── frozen_manifest.jsonl       # FROZEN
│   ├── frozen_manifest.sha256      # FROZEN
│   └── splits/
│       ├── discovery.json
│       ├── confirmation.json        # FROZEN
│       └── reserve.json
├── triggers/
│   ├── candidate.yaml              # EDITABLE (discovery only)
│   ├── controls.yaml               # 5+ controls
│   └── selected.yaml               # FROZEN (after Phase B)
├── runs/
│   ├── discovery/
│   │   └── raw.jsonl               # all raw responses
│   ├── confirmation/
│   │   └── raw.jsonl               # FROZEN condition
│   └── replication/
│       └── raw.jsonl
├── results.tsv                      # append-only experiment log
├── research.md                      # long-term memory
├── next_hypothesis.md               # current candidate
├── stats.json                        # computed statistics
└── report.md                        # final write-up
```

---

## Status

- [x] /sol design complete (job 8497c08c)
- [ ] prepare.py (audit/leader writes)
- [ ] runner.py (audit/leader writes)
- [ ] evaluate.py (audit/leader writes)
- [ ] preregistration.yaml (audit/leader writes)
- [ ] Mock provider for dry-run (audit/leader writes)
- [ ] Trigger registry schema (audit/leader writes)
- [ ] Hard gate validation (audit/leader writes)
- [ ] API key holder runs discovery (key holder does)
- [ ] Confirmation freeze commit (joint)
- [ ] Confirmation run (key holder does)
- [ ] Cross-model replication (key holder does)
- [ ] Stats + report (joint)

---

## Final Word

> "Latent Capability Trigger Hypothesis — behavioral evidence"
> 不是 "discovered internal latent modes"

Black-box accuracy evidence is necessary but NOT sufficient for mechanistic claims.

If results are strong, v2 = open-weight activation intervention (steer by adding trigger direction vector). That's the upgrade from "behavioral phenomenon" to "mechanistic research".