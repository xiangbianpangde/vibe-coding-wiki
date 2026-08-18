# Pull Request

Thanks for contributing! Please fill out the sections below.

## What this PR changes

**Short summary** (1-2 sentences):

---

## Type of change

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] 📚 New term (adds to formal taxonomy after review)
- [ ] 📖 Term enrichment (adds examples / quotes / seeAlso to existing term)
- [ ] 🔍 Citation fix (corrects attribution or source)
- [ ] 🌐 Translation improvement
- [ ] 🛠️ Build / scripts change (enrich-*, rebuild-*, inject-*)
- [ ] 🎨 Style / docs change (CSS, README, docs/)
- [ ] ⚙️ Other (describe)

---

## Term(s) affected

List the term IDs (one per line) that this PR touches:

- (e.g. `vibe-coding`, `mcp`, `cursor`)

---

## Authoring language

- [ ] zh-first (current default)
- [ ] en-first (pilot terms only — see docs/BILINGUAL-PILOT-DRAFT.md)

---

## Source verification checklist

For each term touched, I've verified the following:

- [ ] Primary source URL(s) are accessible (no 404)
- [ ] Quotes are verbatim from source (not paraphrased without flag)
- [ ] Attribution is accurate (verified via search if uncertain)
- [ ] Examples are runnable OR marked as pseudo-code
- [ ] `seeAlso` URLs are first-party (official docs / arXiv / original post)

---

## Testing

- [ ] I ran `node website/scripts/rebuild-terms.cjs` locally and checked output
- [ ] I ran `node website/scripts/rebuild-index.cjs` to update the index
- [ ] I read `docs/STYLE.md` and followed the conventions
- [ ] I read `docs/CONTRIBUTING.md` (English planned v3.0)
- [ ] I checked the term page renders correctly (if browser available)

---

## Related issues

Closes / relates to:

- #

---

## Checklist for author

- [ ] My changes don't break existing terms (no `id` renames, no schema breaks)
- [ ] My commit message follows the repo's convention (`feat(scope): ...` or `fix(scope): ...`)
- [ ] I've added `Co-authored-by: 01a00fb1-0116 (队员)` if instructed to
- [ ] I've previewed the diff and it looks clean
- [ ] I've explained *why* this change (not just *what*)

---

## For maintainers

When reviewing this PR:

- [ ] Source verification (primary URL is real, attribution is accurate)
- [ ] Content quality (matches STYLE.md bar)
- [ ] Build still works (`rebuild-terms.cjs` produces clean terms.js)
- [ ] No format breakage (the JSON files parse cleanly)
- [ ] CI passes (tests workflow if applicable)

Review SLA target: first response < 24h, merge (or detailed comment) < 72h.