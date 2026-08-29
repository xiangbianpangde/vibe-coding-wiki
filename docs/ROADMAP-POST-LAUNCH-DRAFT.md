# What's Next for Vibe Coding Wiki · Post-Launch Roadmap (Draft)

> 📌 **Status**: IN EXECUTION — committed 2026-08-28, execution log below.
> Purpose: coordinator + audit to review and decide what lands in v3.0+.

## Execution log (coordinator)

| Task | Content | Status (2026-08-28) |
|---|---|---|
| R2 | `seeAlso.lastVerified` schema + 90-day stale audit script | ✅ merged (`b453a88`) — 295/295 citations stamped; first `--check` scan found 35×4xx + 4×DNS-dead → spawned R6 |
| R4 | EN-first pilot, 10 core terms | ✅ merged (`f722f90` → `9e3ebc0`) — observation period starts; scale decision waits for community signal |
| R5 | example compile CI | ✅ merged (`46043e1` → `2e89130`) — report-only guardrail; immediately caught 3 real python syntax errors (fixed in `4a42ae0`) |
| R6 | dead-link citation repair (from first audit) | 🔨 in flight (`feat/deadlink-repair`) |
| R7 | dual-track pending badge + demo term | 🔨 in flight (`feat/pending-terms`) |
| R8 | weekly citation-audit cron workflow + "how to verify" note | 🔨 in flight (`feat/verify-note`) |
| R1 | content scale wave (L8 first) | ⏸️ deferred per "observation first" — no expansion before week-4 signal |
| R3 | good-first-issue triage | ✅ done in Round 6d (templates + labels) |

---

## Where we are (launch snapshot)

| Pillar | State |
|---|---|
| Terms | 178 · 8 layers · 14 scenarios |
| Bilingual | 178/178 (zh-CN ↔ en) |
| Performance | Round 1 async loading + Round 2 SW offline |
| Quality | WebScore 93 (target 95) · citation red-teamed |
| Deployment | GH Pages live, 40+ commits, 11 topics |
| Stars | 0 → watch first 24-48h post-launch |

## North star

Keep "**the canonical, community-trustworthy glossary**" positioning:
- primary sources verified (no second-hand claims)
- every term has at least 1 executable example + real quote
- bilingual quality rises together (no zh-only / en-only islands)

---

## v3.0 (first 1-2 months post-launch)

> **Direction shift** (per /sol): v3.0 is **NOT** "v2.2 continued expansion". It's "**validate post-launch real needs**". 178→250 should be a *result*, not a *goal*. First observe: search queries, PR/Issue themes, citation clicks, high-traffic terms. Then decide what to expand.

### 1. Observation first (weeks 1-4)
- Set up: top-searched terms, top-cited terms, top-PR-suggested terms dashboards
- Wait 4 weeks for launch signal to mature before deciding what to expand
- Avoid the trap of pre-committing to "250 terms" before seeing real demand

### 2. Per-citation `lastVerified` timestamp (favorited)
- Each citation gets a `lastVerified` date in the term JSON
- Quarterly audit script lists citations not re-checked in 90 days → priority for human + model-assisted re-check
- Trust signal: a citation re-verified yesterday >> one sitting untouched for a year
- Auto-flag stale citations on the rendered term page (small badge)

### 3. Term submission: dual-track (per /sol)
- **Free proposal** — anyone can submit a new term via PR / issue
- **Verified promotion gate** — must pass source / definition / example / review → only then promoted to formal taxonomy
- Preserves quality moat (canonical + trustworthy) while opening contribution funnel
- New "pending" badge for proposed-not-yet-verified terms

### 4. Citation / quality hardening
- **Per-citation quarterly audit** (not full-site monthly) — focuses on the ~50 highest-traffic terms first
- Each audit round: rerun the original primary source URL, mark `lastVerified` if still correct, fix if not
- Add "how to verify" note on each terminology page

### 5. EN-first writing pilot (10-20 terms, weeks 2-4)
- Pick the 10-20 highest-traffic core terms
- Write them EN-first (vs current zh-first-then-translate)
- Compare: quality, international readability, authoring cost
- **Trigger to switch fully**: international traffic >40% OR English users repeatedly raise wording issues
- **End state**: core terms EN-first, long-tail terms zh-first

---

## v3.5 (3-6 months)

- **250+ terms · < 2h stale-flags**
- Example audit: every example runnable (paste-run → output consistent)
- EN-only edge polish: English descriptions for edge-cases (en context)
- Analytics: which terms are read most → prioritize those for depth
- Star-growth milestones review: 100 / 500 / 1000 gates

---

## Open questions (need coordinator + audit decision)

1. **Bilingual writing model**: translate from zh or write EN-first? Current files are zh-derived; EN-first is better for international readers but doubles authoring cost.
2. **Term add-rule**: users can submit new terms — do we accept all with "pending review" badge, or only curated?
3. **Ownership of example code**: examples are pseudo-real; should we run a "example compile check" in CI?
4. **Donation / sponsorship?** Probably not until 500 stars.

---

## Draft tasks → see Execution log above (R1 deferred, R2-R8 dispatched/done)

---

*Draft end. Awaiting review.*