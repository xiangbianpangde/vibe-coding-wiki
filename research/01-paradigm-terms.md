# L1 · 范式层术语 (Paradigm Layer)

> 描述"vibe coding"作为软件开发范式的顶层概念。

---

## Vibe Coding

**定义（Karpathy, 2025-02）**：软件开发者用自然语言提示 LLM，由 LLM 自动生成源码，且开发者接受 AI 生成代码、不深究代码本身的开发风格。

**Karpathy 原话**：
> "There's a new kind of coding I call 'vibe coding', where you fully give in to the vibes, embrace exponentials, and forget that the code even exists."

**核心动作**：
- 描述项目 → LLM 写代码
- 试运行 → 出错就把错误贴回去
- 反复迭代 → "Accept All"
- 不读 diff

**同义词**：none（已成为范畴术语）
**反义词**：Hand-coding / Traditional Development
**Collins Word of the Year 2025**、**Merriam-Webster Slang (March 2025)**

---

## Agentic Programming

**定义（Martin Fowler）**：程序员用 LLM 写所有代码，但**仍然关心并审查代码**，关注其内部结构。

**Fowler 的关键区分**：
> "Vibe coding 和 Agentic Programming 常被混淆，但**它们的使用方式和后果完全不同**。"

**与 Vibe Coding 的边界**：
| 维度 | Vibe Coding | Agentic Programming |
|---|---|---|
| 是否看代码 | 否 | 是 |
| 是否审查 diff | 否 | 是 |
| 是否关注结构 | 否 | 是 |
| 适用场景 | 一次性 / 一次性 demo | 生产代码 / 可维护系统 |

**关键术语**：Semantic Diffusion（语义扩散，混淆两者的现象）

---

## AI-Assisted Software Development

**广义术语**：所有使用 AI 辅助的软件开发活动的总称，包含 vibe coding / agentic programming / copilot-style completion 等。

**Wikipedia 范畴**：vibe coding 是 AI-assisted software development 的一个**子集**。

---

## Prompt-Driven Development (PDD)

**定义**：以 prompt 为主要驱动力、prompt 即规格的开发风格。

**Karpathy 2023**：
> "The hottest new programming language is English."

**派生术语**：
- Natural Language Programming
- Literate Programming (Knuth, 1984，先驱概念)

---

## 上位 / 下位 / 相关

- **上位**：Software Engineering / Automatic Programming (1950s-)
- **下位**：Spec-Driven Development / Context Engineering
- **平行**：No-Code Development Platform / End-User Computing
- **新词**：Software for One (Kevin Roose, NYT) —— 个人定制软件

---

## 来源

- en.wikipedia.org/wiki/Vibe_coding
- martinfowler.com/bliki/VibeCoding.html
- simonwillison.net/2025/Mar/19/vibe-coding/
- cacm.acm.org/news/catching-the-vibe-of-vibe-coding/