# L8 · Prompt Engineering for Coding 术语

> vibe coding 中 prompt 的具体工程化技术。

---

## System Prompt Engineering

**定义**：为 vibe coding 工具设计**系统级 prompt**——把项目规范、编码风格、工具列表一次注入。

**典型内容**：
- 项目背景
- 编码规范（PEP8 / ESLint / 项目风格）
- 工具使用策略
- 错误处理偏好
- 测试要求

---

## Few-Shot Prompting

**定义**：在 prompt 中提供**几个示例**让 LLM 学会输出格式。

**vibe coding 例子**：
```
示例 1：
- Input: "Add a button"
- Output: 写一个 <button onClick={handler}> 组件
示例 2：
- Input: "Add a form"
- Output: 写一个 <form onSubmit={handler}> 组件
现在请按同样风格为 Input: "Add a modal" 输出代码
```

---

## Chain-of-Thought (CoT) Prompting

**定义**：让 LLM "**先思考再输出**"，给出推理过程。

**vibe coding 用法**：
> "在写代码前先分析问题，列出 3 个可能的实现方案，逐一比较，再选择最佳方案写代码。"

---

## Re-prompt / Iterative Refinement

**定义**：把**错误信息**或**不满意的结果**贴回 LLM，让其修正。

**典型节奏**：
1. "写一个 function"
2. 跑测试 → 失败
3. 贴错误："TypeError: ..."
4. "这个错误，fix"
5. 跑 → 通过

---

## Negative Prompting

**定义**：明确告诉 LLM **不要做什么**。

**例子**：
- "不要用 jQuery"
- "不要修改 tests/ 目录"
- "不要用 eval"

---

## Decomposition / Task Decomposition

**定义**：把**大任务拆成小任务**，逐个让 LLM 完成。

**vibe coding 实践**：
- 让 LLM 先列任务清单
- 每个子任务独立 prompt
- 最后汇总

---

## Spec-driven Prompting

**定义**：把 **spec.md 内容**作为 prompt 的核心，prompt 不再是"想法"而是"规格"。

---

## Context Stuffing / Anti-pattern

**定义**：把**大量无关内容**塞进 context，结果 LLM 注意力分散、产生幻觉。

**反模式**：
- 把整个 codebase 塞进 prompt
- 把所有历史对话都带上
- 不区分 signal / noise

**正确做法**：context engineering

---

## Constrained Decoding

**定义**：用 grammar / JSON schema **限制 LLM 输出格式**。

**vibe coding 用法**：
- 让 LLM 输出特定 JSON 格式的"代码补丁"
- 用 OpenAI structured outputs / Anthropic tool use

---

## Prompt Injection（风险）

**定义**：恶意内容被注入 LLM 输入流，操纵其行为。

**vibe coding 风险**：
- 读了一个包含恶意指令的网页 / 文件
- LLM 误把指令当 prompt 执行

**防护**：
- 隔离 untrusted content 与 instructions
- 审查工具返回值

---

## Tool Description Engineering

**定义**：为每个工具写**清晰的 description**，让 LLM 知道何时调用。

**最佳实践**：
- 一句话说清工具干什么
- 列举何时使用 vs 不使用
- 给参数命名清晰的 schema

---

## Self-Review Prompting

**定义**：让 LLM **先自查**再输出。

**模板**：
> "请先列出你这个方案可能的 3 个 bug，再写代码。"

---

## 来源

- spec-coding.dev/spec-md-template-for-ai-agents
- operatordiary.com/articles/claude-code-vs-cursor-vs-windsurf/
- 模型卡 / Anthropic prompt engineering guide / OpenAI best practices