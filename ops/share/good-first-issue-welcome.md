# Good First Issue Welcome Comment

> Auto-post as a comment on new issues labeled "good first issue".
> Use gh CLI to post.

## Comment Template (Markdown)

```markdown
👋 Thanks for picking this up!

This is a **Good First Issue** — designed for new contributors. Here's everything you need to get started:

## 📋 Issue Summary

<!-- Replace with the issue-specific summary -->

## 🛠️ What You Need to Do

<!-- 1-3 concrete bullet points -->

## 📚 Where to Start

1. Read [`docs/CONTRIBUTING.md`](../../docs/CONTRIBUTING.md) — explains our workflow
2. Look at the relevant term file:
   - `website/data/terms-L1.json` (paradigm)
   - `website/data/terms-L2.json` (methodology)
   - `website/data/terms-L3.json` (technical)
   - `website/data/terms-L4.json` (tools)
   - `website/data/terms-L5.json` (quality)
   - `website/data/terms-L6.json` (risks)
   - `website/data/terms-L7.json` (prompt)
   - `website/data/terms-L8.json` (scenarios)
3. Make your edit (add 1 line, fix 1 link, etc.)
4. Run `cd website && python3 -m http.server 8765` and open `http://localhost:8765/term.html?id=<your-term>` to verify
5. Open a Pull Request referencing this issue (`Closes #N`)

## ❓ Questions?

- **General questions**: Comment on this issue
- **Real-time chat**: [project Discussions link]
- **Maintainer tag**: @xiangbianpangde

## 📜 Style Guide

- English: neutral, factual, citation-first
- One commit per logical change
- Always include `Closes #<this-issue-number>` in PR description

## 🎁 Recognition

Contributors will be:
- Added to README's Contributors section
- Mentioned in next release notes
- Given **Good First Issue Hunter** badge in our community

Looking forward to your PR! 🚀
```

## How to Post via gh CLI

```bash
# After creating the issue
gh issue create --label "good first issue" --title "..." --body "..."
# Get issue number
gh issue list --label "good first issue" --state open --json number --limit 1

# Post welcome comment
ISSUE_NUM=1
gh issue comment $ISSUE_NUM --body-file ops/share/good-first-issue-welcome.md
```

## How to Post Manually

1. Open the issue URL
2. Click "Comment"
3. Paste the template above
4. Replace `<!-- 1-3 concrete bullet points -->` with issue-specific steps
5. Submit
