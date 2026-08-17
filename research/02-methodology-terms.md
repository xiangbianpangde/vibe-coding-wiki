# L2 · 方法论层术语 (Methodology Layer)

> 把 vibe coding 从"玩票"变成"工程"所需的方法论体系。

---

## Specification-Driven Development (SDD)

**定义**：以**规格文档**（spec.md）作为人、AI Agent、测试、审查者之间**共享契约**的开发方法。

**核心观点**：
> "A good spec.md is not a prompt wrapper. It is the shared contract that lets humans, AI agents, tests, and reviewers agree on what the change means." — spec-coding.dev

**GitHub Spec Kit**（2025）：微软 / GitHub 推出的开源 SDD 工具链，包含：
- `/specify` 命令
- `/plan` 命令
- `/tasks` 命令
- 三阶段：`Specify → Plan → Tasks`

**派生工具**：cospec、spec-kit、Claude Code SDD 插件

---

## Spec.md as Contract

**定义**：把 spec.md 当成**唯一真相源（Single Source of Truth）**，所有 agent 都读同一份规格。

**实践要点**：
1. 用自然语言而非代码描述意图
2. 让**未来的 reviewer** 能理解"为什么这次变更存在"
3. 每个 coding agent 都得到同一份 spec

---

## Context Engineering

**定义**：管理进入 LLM 上下文窗口（context window）的**所有信息**——指令、工具定义、对话历史、文件读取、搜索结果、当前任务——的工程学科。

**核心引述**：
> "The agent loop rebuilds context each turn. Instructions, tool definitions, conversation history, file reads, search results, and your current task — everything enters the same window, and the model predicts from all of it."

**与 Prompt Engineering 的关系**：
- Prompt Engineering = 优化**指令文本**
- Context Engineering = 优化**整个上下文窗口**

---

## Plan-Verify-Build Loop

**定义**：AI agent 的核心循环——规划、执行、验证三段式。

```
Plan   → 任务分解、子任务列表、依赖图
Verify → 编译、测试、diff review、guardrail 检查
Build  → 写代码、运行命令、调用工具
```

**派生实践**：
- **Test-Driven Development (TDD) with AI**：先写测试再让 AI 写实现
- **Plan mode vs Build mode**：Claude Code 等工具的分阶段模式

---

## Iterative Refinement

**定义**：通过**多轮 prompt 调整**让代码逐步逼近目标的实践。

**典型节奏**：
1. 第一轮：实现功能
2. 第二轮：fix bug（粘贴错误信息）
3. 第三轮：refactor / add feature
4. ... 直至满足 acceptance criteria

---

## Acceptance Criteria

**定义**：事先约定的、可机械验证的"完成标准"，让 agent 不再"open-ended"地猜意图。

**最佳实践**：
- 用 checklist 形式
- 每条都应可被编译 / 测试 / 静态检查验证
- 不要写"代码优雅"这种主观标准

---

## Iterative Development using Specs as Planning Checkpoints

**定义**：把 spec 当成"规划检查点"，每完成一阶段就回到 spec 校准。

> "Specs as Planning Checkpoints" — specdd.ai

---

## 来源

- github.github.io/spec-kit/
- github.github.io/spec-kit/concepts/sdd.html
- spec-coding.dev/spec-md-template-for-ai-agents
- developer.microsoft.com/blog/spec-driven-development-ai-native-engineering/
- specdd.ai/articles/hacking-specdd-iterative-development-using-specs-as-planning-checkpoints/