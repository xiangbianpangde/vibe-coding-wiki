# Vibe Coding 分类树

> 按层级与场景两个维度组织术语。

---

## 按层级（Layer）

```
L1 范式层（Paradigm）
├── Vibe Coding                 ← Karpathy 2025
├── Agentic Programming          ← Fowler 区分
├── AI-Assisted Software Dev     ← 广义总称
├── Prompt-Driven Development    ← "English as programming language"
├── Software for One             ← Kevin Roose
└── No-Code / Low-Code           ← 相邻范式

L2 方法论层（Methodology）
├── Specification-Driven Dev (SDD)
├── Spec.md as Contract
├── Context Engineering
├── Plan-Verify-Build Loop
├── Iterative Refinement
├── Acceptance Criteria
└── TDD with AI

L3 技术概念层（Technical）
├── LLM / Frontier Model / Code Model
├── Context Window / Tokens
├── Hallucination / Non-determinism
├── Agent Loop / Subagent
├── Tool Use / Function Calling
├── MCP (Model Context Protocol)
└── Pass@k Metric

L4 工具与平台层（Tools & Platforms）
├── IDE 增强型：Cursor / Windsurf / Cody / Continue.dev
├── CLI Agent 型：Claude Code / Aider / Gemini CLI
├── 云端 IDE 型：Replit Agent / Lovable / v0 / Bolt
├── 补全型：GitHub Copilot / Tabnine / Codeium
├── 独立 Agent 型：Cline / Roo Code / Devin / OpenHands
├── 代码审查型：CodeRabbit / Graphite Reviewer
└── 安全扫描型：Veracode / Snyk / Semgrep

L5 质量与治理层（Quality & Governance）
├── Guardrails
├── Mechanical Verification Pipeline
├── YOLO Mode vs Responsible Vibe Coding
├── Safety Net Testing
├── Code Review / Diff Review
├── Compiler as Referee / Test Suite as Referee
└── Failure Mode Analysis

L6 风险与度量层（Risks & Metrics）
├── Technical Debt / Code Churn / Code Duplication
├── Vibe Slop / Vibe Coding Hangover / Development Hell
├── Lethal Trifecta / Homogenization of Software
├── Eternal September / Software for One / Vibe Valuation
└── 实证研究：METR / CodeRabbit / Veracode

L7 Prompt Engineering for Coding
├── System Prompt Engineering
├── Few-Shot Prompting
├── Chain-of-Thought Prompting
├── Re-prompt / Iterative Refinement
├── Negative Prompting
├── Task Decomposition
├── Constrained Decoding
└── Prompt Injection（风险）

L8 场景层（Scenarios）
├── 一次性原型
├── 个人工具（Software for One）
├── 生产代码维护
├── 大规模重构
├── 安全敏感代码
├── 学习与探索
├── 团队协作
├── 测试编写
├── 调试/排错
└── 文档与注释
```

---

## 按场景（Scenarios）

### 场景 1：一次性原型 / Throwaway Prototype

**目标**：从 0 到可 demo 的应用，一晚上搞定

**术语组合**：
```
Vibe Coding ✓
Cursor / Lovable ✓
Iterative Refinement ✓
Acceptance Criteria（宽松）
```

### 场景 2：个人工具 / Software for One

**目标**：只为个人用，不进入团队

**术语组合**：
```
Vibe Coding ✓
YOLO Mode（可接受）
Few-Shot Prompting
```

### 场景 3：生产代码维护 / Production Maintenance

**目标**：可演进、可被他人理解

**术语组合**：
```
Agentic Programming（非 vibe coding）
Mechanical Verification Pipeline
Guardrails
Specification-Driven Development
Acceptance Criteria（严格）
Code Review
Compiler as Referee
```

### 场景 4：大规模重构 / Large-Scale Refactoring

**目标**：跨文件、跨模块改动，不引入 regression

**术语组合**：
```
Subagent（任务拆分）
Plan-Verify-Build Loop
Context Engineering
Safety Net Testing
TDD with AI
```

### 场景 5：安全敏感代码 / Security-Sensitive

**目标**：认证/支付/加密，不能出错

**术语组合**：
```
禁止 Vibe Coding / YOLO Mode
Mechanical Verification Pipeline
Veracode / Snyk / Semgrep
Lethal Trifecta 检查
Prompt Injection 防护
```

### 场景 6：学习与探索 / Learning

**目标**：学新技术，零成本试错

**术语组合**：
```
Vibe Coding ✓
Few-Shot Prompting
Chain-of-Thought
```

### 场景 7：团队协作 / Team Collaboration

**目标**：多人共享代码风格和约定

**术语组合**：
```
GitHub Copilot / Cursor（团队版）
CodeRabbit
Spec.md as Contract
Diff Review
```

### 场景 8：测试编写 / Test Writing

**目标**：为已有代码补测试

**术语组合**：
```
TDD with AI
Safety Net Testing
Test Suite as Referee
```

### 场景 9：调试 / Debugging

**目标**：复现 + 修复

**术语组合**：
```
Iterative Refinement（贴错误信息）
Failure Mode Analysis
Acceptance Criteria（bug 修复的可验证定义）
```

### 场景 10：文档与注释 / Documentation

**目标**：自动生成 README、API 文档

**术语组合**：
```
Few-Shot Prompting（输出格式）
Spec.md as Contract
```

---

## 场景 × 术语 决策矩阵

| 场景 / 术语 | Vibe | Agentic | SDD | Guardrails | YOLO | Few-Shot | CoT |
|---|---|---|---|---|---|---|---|
| 一次性原型 | ★★★★★ | ★ | ★ | ✘ | ✓ | ✓ | ✘ |
| 个人工具 | ★★★★★ | ★ | ✘ | ✘ | ✓ | ✓ | ✘ |
| 生产维护 | ★ | ★★★★★ | ★★★★★ | ★★★★★ | ✘ | ✓ | ✓ |
| 大型重构 | ★★ | ★★★★ | ★★★★★ | ★★★★ | ✘ | ✓ | ✓ |
| 安全敏感 | ✘ | ★★★ | ★★★★★ | ★★★★★ | ✘ | ✓ | ✓ |
| 学习 | ★★★★ | ★★ | ✘ | ★ | ✓ | ✓ | ✓ |
| 团队 | ★★★ | ★★★★ | ★★★★ | ★★★★ | ✘ | ✓ | ✘ |
| 测试 | ★★ | ★★★★ | ★★★ | ★★★★ | ✘ | ✓ | ✘ |
| 调试 | ★★★ | ★★★★ | ★★★ | ★★★ | ✘ | ✓ | ✓ |
| 文档 | ★★★★ | ★★ | ★★ | ★ | ✘ | ✓ | ✘ |

---

## 来源

- martinfowler.com/bliki/VibeCoding.html
- en.wikipedia.org/wiki/Vibe_coding
- spec-coding.dev/start-here
- github.github.io/spec-kit/