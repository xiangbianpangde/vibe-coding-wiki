# Bilingual Pilot · Top 10 EN-first Candidates (Draft)

> 📌 **Status**: DRAFT — prepared during launch freeze (2026-08-18). Not committed.
> Purpose: pre-identify the 10 terms to write EN-first for the v3.5 bilingual pilot.

---

## Pilot scope (per /sol consultation)

- **10 terms** (out of 178) written EN-first
- Pick the highest-impact ones — these are the terms international readers will hit first
- Compare quality vs zh-first-then-translate (current model)
- **Trigger to switch fully**: international traffic >40% OR English users repeatedly raise wording issues

## Selection criteria

1. **High traffic probability**: terms likely searched first by English readers
2. **Foundational**: defines a concept used by many other terms
3. **Has primary source in English**: no need to translate to original
4. **Current translation is weakest**: where zh-first produced the most "translation-ese"

## Top 10 candidates (by heuristic score)

> Heuristic: L1 paradigm (everyone starts here) + L3/L4 most-searched + content-richness score

### Tier 1 — must-write (5)

| # | id | layer | why |
|---|---|---|---|
| 1 | **vibe-coding** | L1 | Karpathy-coined origin; the central term; highest search intent |
| 2 | **agentic-engineering** | L1 | Karpathy 2026 replacement term; fast-evolving; needs crisp EN definition |
| 3 | **claude-code** | L4 | Anthropic's flagship tool; English audience expects this exact phrasing |
| 4 | **rag** | L3 | Foundational concept; used in 10+ other terms; English-dominated discourse |
| 5 | **mcp** | L3 | New protocol, English-first community discussion |

### Tier 2 — high-value (5)

| # | id | layer | why |
|---|---|---|---|
| 6 | **cursor** | L4 | Most-searched AI IDE; primary users in EN community |
| 7 | **agentic-programming** | L1 | Martin Fowler origin (English speaker); clear EN equivalent |
| 8 | **llm** | L3 | Most fundamental concept; EN jargon dominates |
| 9 | **context-engineering** | L2 | Anthropic-coined; EN phrasing already canonical |
| 10 | **aider** | L4 | Open source tool; EN-native community |

## What "EN-first" means here

1. **Write shortDesc in English first**, only summarize to zh after
2. **Source quotes in original English** (Karpathy tweet, Anthropic docs, etc.)
3. **Examples keep API call syntax in original** (no translation of code)
4. **EN longDesc is the source of truth**, zh is the summary

## Pilot workflow

```
1. Pick these 10 terms' current JSON files
2. Draft new shortDesc + longDesc in EN first (target: native-quality, no translation-ese)
3. Use /sol to red-team each (catch awkward wording, jargon mismatches)
4. Compare against existing zh-first translations (which is better?)
5. Commit decision: keep EN-first, revert, or hybrid
```

## Success criteria

- [ ] All 10 terms written EN-first with /sol review pass
- [ ] A/B compare: EN-native readers rate EN-first ≥ zh-first on clarity/naturalness
- [ ] Total authoring time per term ≤ 30 min (must scale to 178)
- [ ] At least 1 international user (HN/Twitter/Reddit) gives positive feedback on quality

## Open: who does the writing

- **Option A**: I write + Sol red-teams (1-2 sessions, ~3h)
- **Option B**: External English-speaking contributor (need to recruit)
- **Option C**: Sol writes drafts, I edit (cheapest, may lose nuance)

Recommend **Option A** for first 10 terms; expand to C for scale.

---

*Draft end. Awaiting launch completion + community signal before activating pilot.*