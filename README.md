# Vibe Coding Wiki

> **The taxonomy problem behind AI-assisted programming.**

<p align="center">
  <a href="https://github.com/xiangbianpangde/vibe-coding-wiki/actions"><img src="https://img.shields.io/badge/deploy-GitHub%20Pages-success" alt="Deploy"></a>
  <a href="https://github.com/xiangbianpangde/vibe-coding-wiki/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="License"></a>
  <a href="https://github.com/xiangbianpangde/vibe-coding-wiki/stargazers"><img src="https://img.shields.io/github/stars/xiangbianpangde/vibe-coding-wiki?style=social" alt="Stars"></a>
  <a href="https://github.com/xiangbianpangde/vibe-coding-wiki/releases"><img src="https://img.shields.io/github/v0.x-release/xiangbianpangde/vibe-coding-wiki" alt="Latest Release"></a>
  <a href="https://github.com/xiangbianpangde/vibe-coding-wiki/actions"><img src="https://img.shields.io/badge/pages%20build-passing-brightgreen" alt="Pages Build"></a>
  <a href="https://xiangbianpangde.github.io/vibe-coding-wiki/sitemap.xml"><img src="https://img.shields.io/badge/sitemap-186%20URLs-blue" alt="Sitemap"></a>
  <a href="https://xiangbianpangde.github.io/vibe-coding-wiki/rss.xml"><img src="https://img.shields.io/badge/RSS-feed-orange" alt="RSS"></a>
  <a href="https://github.com/xiangbianpangde/vibe-coding-wiki/blob/main/website/manifest.webmanifest"><img src="https://img.shields.io/badge/PWA-installable-purple" alt="PWA"></a>
  <a href="https://github.com/xiangbianpangde/vibe-coding-wiki/issues"><img src="https://img.shields.io/badge/contributions-welcome-brightgreen" alt="Contributions"></a>
</p>

AI coding doesn't have a vocabulary problem. It has a **taxonomy problem**.

[`vibe coding`](https://xiangbianpangde.github.io/vibe-coding-wiki/term.html?id=vibe-coding), agentic coding, context engineering, MCP, spec-driven development, cognitive debt, guardrails, YOLO mode — the terms are spreading across blog posts, documentation, papers, and tool communities, but I couldn't find one place that shows how they relate.

So I built a taxonomy rather than another list.

---

## What's inside

- 📚 **178 terms** organized into **8 layers**:
  1. **Paradigms** (L1) — vibe coding, agentic engineering, vibe engineering
  2. **Methodologies** (L2) — SDD, context engineering, plan-verify-build
  3. **Technologies** (L3) — LLM, MCP, RAG, LoRA, MoE, attention
  4. **Tools** (L4) — Claude Code, Cursor, LangChain, Aider
  5. **Quality** (L5) — guardrails, MVP, hallucination checks
  6. **Risks** (L6) — Lethal Trifecta, technical debt, vibe slop
  7. **Prompting** (L7) — CoT, ReAct, few-shot
  8. **Scenarios** (L8) — throwaway prototype, production maintenance, security-sensitive

- 🌐 **Bilingual** — 178/178 terms translated to English; one-click language switch
- 🔍 **Full-text search** with categorized ranking
- 📊 **8-layer relationship graph** (Mermaid)
- ⚖️ **5-paradigm comparison** — vibe coding vs responsible VC vs vibe engineering vs agentic engineering vs traditional engineering
- 📈 **Data dashboard** — Stack Overflow 2025, METR, CodeRabbit, Veracode, GitClear
- 🛤️ **Term detail pages** with definitions, examples, primary-source quotes, related terms, evolution timeline, misconceptions, learning path
- ⚡ **Performance** — per-layer async loading (<30KB initial JS), Service Worker offline cache
- 🎨 **Chinese traditional color design system** — paper background, serif type, sharp corners

## Coverage

Each term targets high-quality content:

| Field | Coverage |
|---|---|
| `examples` (code samples) | 158 / 178 (88%) |
| `quotes` (primary-source citations) | 155 / 178 (87%) |
| `seeAlso` (external references) | 161 / 178 (90%) |
| `enShortDesc` / `enLongDesc` | 178 / 178 (100%) |

Plus trust mechanics: every `seeAlso` citation carries a `lastVerified` date with 90-day re-audit, and all code examples pass syntax checks (CI guardrail).

## Try it

🌐 **Live**: https://xiangbianpangde.github.io/vibe-coding-wiki/

- **Browse the layers** → [Layers](https://xiangbianpangde.github.io/vibe-coding-wiki/pages/layers.html)
- **Search 178 terms** → press `⌘K` from any page
- **Compare paradigms** → [Compare](https://xiangbianpangde.github.io/vibe-coding-wiki/pages/compare.html)
- **See relationships** → [Graph](https://xiangbianpangde.github.io/vibe-coding-wiki/pages/graph.html)
- **Pick a scenario** → [Scenarios](https://xiangbianpangde.github.io/vibe-coding-wiki/pages/scenarios.html)

## Source

- 📦 **GitHub**: https://github.com/xiangbianpangde/vibe-coding-wiki
- 📄 **LICENSE**: [MIT](./LICENSE)
- 📚 **Docs**: [CONTRIBUTING](./docs/CONTRIBUTING.md) · [STYLE](./docs/STYLE.md) · [ARCHITECTURE](./docs/ARCHITECTURE.md)

## Architecture

```
178 terms → 8 layer JSON files → terms-loader.js (async fetch)
                          ↓
            glossary / layers / scenarios / scenarios pages
                          ↓
         search.js (full-text) ← term.js (detail renderer)
                          ↓
        Service Worker (offline cache) + i18n.js (zh ↔ en)
```

- **No backend**, **no npm runtime deps** — 100% static files
- **per-layer async loading** — initial JS < 30KB
- **Vitest 24/24** pass + **Playwright e2e** specs
- **CI/CD** via GitHub Actions

## Current limitations (feedback wanted)

I'm especially looking for feedback on:

- **Terms that are missing** — what's not here but should be?
- **Classifications you disagree with** — is `claude-code` L4 tool or L3 tech?
- **Incorrect attribution or sources** — quote attributions need verification
- **Terminology that shouldn't be a separate entry** — merge candidates?

The Chinese original was written first; the English is recent. Primary-source citations (76% coverage) are from author blogs, official docs, and original papers — the first citation red team round is complete (R6: 14 fabricated citations purged, 34 dead links repaired), backed by a weekly automated citation audit cron with an allowlist, and citations carry `lastVerified` dates for 90-day re-checks.

Contributions and corrections welcome — see [CONTRIBUTING.md](./docs/CONTRIBUTING.md).

## Roadmap

### v2.2 (current · launch freeze)
- ✅ 178 terms, 8 layers, 14 scenarios
- ✅ Bilingual (zh-CN ↔ en)
- ✅ Async per-layer loading
- ✅ Service Worker offline cache
- ✅ A11y (WCAG 2.1 AA target)
- ✅ SEO + JSON-LD + sitemap
- ✅ Citation Red Team (Karpathy / Anthropic / Willison / Fowler attributions audit)
- ✅ GitHub Topics + Homepage + good first issue (launch packaging)

### v3.0 (post-launch)
- Content scale to 250+ terms
- Continued primary-source verification
- Community contributions + first issue triage
- Source tracking (last-verified dates)

## Star history

[![Star History Chart](https://api.star-history.com/svg?repos=xiangbianpangde/vibe-coding-wiki&type=Date)](https://star-history.com/#xiangbianpangde/vibe-coding-wiki&Date)

---

**v2.2 · 2026-08-17 · 178 terms · 8 layers · 14 scenarios · 100% bilingual**

_Built by an AI agent team (3 roles: coordinator, data enricher, auditor) over a single working session. Original research / primary-source citations / Karpathy X posts / Anthropic / OpenAI docs / Claude Code docs / Stack Overflow 2025 / METR / CodeRabbit / Veracode / GitClear._
