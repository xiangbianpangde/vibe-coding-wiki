# Twitter Thread · Launch Day (7 tweets)

> **timing**: T+1h (after HN post)
> **format**: 7 tweets, 5min interval between
> **must be posted by**: real human account (not AI bot)

---

## Tweet 1 / 7 (Hook)

```
I built 178-term bilingual wiki for AI coding terminology.

Why? Because "vibe coding", "agentic coding", "context engineering", "MCP", "guardrails" — they're everywhere but no one shows how they relate.

So I made a taxonomy, not another list. 🧵👇
```

## Tweet 2 / 7 (Problem)

```
The problem:
- "Vibe coding" was coined Feb 2025
- "Agentic engineering" emerged ~1 year later
- "Cognitive debt" is floating around
- "Lethal trifecta" threat model for AI agents

These are NOT all the same thing. But they read like synonyms in most posts.
```

## Tweet 3 / 7 (Solution)

```
What I built:
- 178 terms · 8 layers (Paradigm → Methodology → Tech → Tools → Quality → Risk → Prompting → Scenario)
- Each term: definition · code examples · primary-source quotes · related terms · external refs
- 100% bilingual (zh-CN ↔ en)
- Fully static site (no backend, no build, no npm runtime deps)
```

## Tweet 4 / 7 (Stats)

```
Coverage stats:
- 137/178 (77%) with code examples
- 135/178 (76%) with primary-source quotes
- 140/178 (79%) with external references
- 178/178 (100%) with English translation

The 4 bugs we fixed before launch:
- summary section not translated
- section titles not translated
- pages/*.html ../js/ 404
- terms-loader.js DATA_PATH
```

## Tweet 5 / 7 (Technical)

```
Architecture:
- Per-layer async loading (initial JS <30KB)
- Service Worker offline cache
- 9 routes, all 200
- WCAG 2.1 AA target · ARIA · skip-link · keyboard nav
- JSON-LD structured data
- 11 GitHub topics

All documentation: docs/CONTRIBUTING.md, docs/STYLE.md, docs/ARCHITECTURE.md
```

## Tweet 6 / 7 (Asks)

```
What I'd love feedback on:
1. Terms that are missing (especially L7 prompting, L8 scenarios)
2. Classifications you disagree with
3. Attributions that are wrong
4. Terminology that shouldn't be a separate entry

Just open an issue. Or PR a fix.
```

## Tweet 7 / 7 (CTA)

```
178 terms. 8 layers. 100% bilingual. Open source.

Live: https://xiangbianpangde.github.io/vibe-coding-wiki/

MIT licensed. Contributions welcome.

If you find this useful, ⭐ it.
If you spot errors, open an issue.
If you want to argue about the taxonomy, that's the actual point. 🔥
```

---

## Posting notes

- 间隔 5 min between tweets
- Pin tweet 1 to profile after posting
- Engage with every reply in first 60 min
- Don't auto-schedule — manual posting only
- Add hashtags: #AItools #LLM #vibecoding #developer #knowledge (sparingly)
- After thread: visual preview image (use og-image.svg)
