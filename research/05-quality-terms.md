# L5 · 质量与治理层术语 (Quality & Governance Layer)

> 把 vibe coding 风险关进笼子的工程实践。

---

## Guardrails

**定义**：**自动化检查**，专门捕捉 AI 易犯的错误，廉价运行、失败响亮。

**核心引述**：
> "Not gates. Not roadblocks. Not a six-person review board for every PR. Guardrails are automated checks that catch the specific kinds of mistakes AI tends to make, run cheaply on every change, and fail loud enough that nobody — human or AI — can ignore them." — nazarboyko.com

**典型 guardrails**：
- 编译 / 类型检查
- Lint
- 单元 / 集成测试
- 安全扫描（Semgrep / Snyk）
- 依赖审计（npm audit / cargo audit）
- Diff size 阈值

**派生模板**：python-ai-guardrails-template（tortastudios）

---

## Mechanical Verification Pipeline

**定义**：用**机械手段**（编译器、diff、测试套件）做裁判，让 AI 代码被客观验证。

**核心引述**：
> "The reliable approach for a developer reviewing AI-generated code is a mechanical verification pipeline in which the compiler, the diff, and the test suite act as the referee, because a loop that runs unattended also makes mistakes unattended."

**验证层级金字塔**：
```
1. 编译器 / 类型检查        → 最快、最严格
2. Lint / 静态分析         → 风格、潜在 bug
3. 单元测试                → 行为正确
4. 集成测试 / E2E          → 系统级
5. 安全扫描                → 漏洞
6. Code review (人)        → 设计、可维护性
```

---

## YOLO Mode

**定义**：**关闭所有审批提示**，让 agent 编辑文件、跑命令、安装东西都**不停下来问**。

**典型场景**：
- 设一个任务 → 吃饭 → 回来 → 任务完成

**风险**：
- 删库（Replit 事件）
- 装错依赖
- 写错文件路径
- 把 secrets commit 到 git

**与 Responsible Vibe Coding 的对比**：
| 维度 | YOLO Mode | Responsible Vibe Coding |
|---|---|---|
| 用户审查 | 无 | 持续 |
| 适用场景 | 一次性 demo | 生产 |
| 风险 | 极高 | 可控 |

---

## Safety Net Testing

**定义**：建立**测试安全网**——充分的单元 / 集成 / E2E 测试——让 AI 改动不破坏既有行为。

**最佳实践**：
- 在 vibe coding 前**先写好测试**
- 测试覆盖率 > 80% 是底线
- 测试要"先红后绿"——AI 让它变绿

---

## Code Review / Diff Review

**定义**：在 vibe coding 流程中**强制 AI 输出 diff 并人工 review**。

**关键术语**：
- **"Accept All" without reading diffs** —— Karpathy 原话中提到的反模式
- **PR Review**：把 AI commit 走标准 PR 流程

---

## Compiler as Referee

**定义**：把编译器当作"第一道审查者"，所有 AI 代码必须先过编译。

---

## Test Suite as Referee

**定义**：把测试套件当作"终审"，所有改动必须不破坏既有测试 + 满足新测试。

---

## Acceptance Criteria

**定义**：详见 L2 方法论层。在治理语境下，它是"完成"的客观定义。

---

## Failure Mode Analysis

**定义**：分析 agent 可能失败的模式，针对性加防护。

**典型失败模式**：
- 幻觉 API / 库
- 改坏无关代码（non-determinism）
- 删错文件
- 装错依赖
- 把测试也改了（让假绿）

---

## 来源

- nazarboyko.com/articles/building-ai-guardrails-into-development-workflows
- github.com/tortastudios/python-ai-guardrails-template
- en.wikipedia.org/wiki/Vibe_coding
- spec-coding.dev/start-here