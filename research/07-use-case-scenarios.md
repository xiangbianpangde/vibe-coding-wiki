# L7 · 使用场景术语 (Use Case Scenarios)

> 按**使用场景**组织术语——这是用户请求的核心维度。

---

## 场景 1 · 一次性原型 (Throwaway Prototype)

**典型活动**：
- 一个晚上从零到一个能 demo 的应用
- 周末 hackathon 项目
- 内部工具 / 个人脚本

**推荐术语组合**：
- Vibe Coding ✓
- Cursor Composer ✓
- Lovable / Replit Agent ✓
- Iterative Refinement ✓
- Acceptance Criteria（宽松）

**风险**：低（不进入生产）

---

## 场景 2 · 个人工具 (Software for One)

**典型活动**：
- 个人自动化脚本
- 一次性数据处理

**推荐术语组合**：
- Vibe Coding ✓
- YOLO Mode（可接受）
- 软件 for one 心态

**风险**：低（仅自己用）

---

## 场景 3 · 生产代码维护 (Production Maintenance)

**典型活动**：
- 修改既有系统
- 加 feature、修 bug
- 性能优化

**推荐术语组合**：
- Agentic Programming（非 vibe coding）
- Mechanical Verification Pipeline
- Guardrails
- Specification-Driven Development
- Acceptance Criteria（严格）
- Code Review / Diff Review

**风险**：高，需**完全不同于 Vibe Coding** 的工作流

---

## 场景 4 · 大规模重构 (Large-Scale Refactoring)

**典型活动**：
- 跨文件、跨模块改动
- 接口升级

**推荐术语组合**：
- Subagent（拆分任务）
- Plan-Verify-Build Loop
- Context Engineering（注入 refactor plan）
- Safety Net Testing

**风险**：中——AI 倾向"重写而不重构"

---

## 场景 5 · 安全敏感代码 (Security-Sensitive Code)

**典型活动**：
- 认证 / 授权
- 支付 / 加密
- 数据隐私

**推荐术语组合**：
- 严格避免 Vibe Coding / YOLO Mode
- Veracode / Snyk / Semgrep 扫描
- Lethal Trifecta 检查清单
- LLM 安全 prompt injection 防护

**风险**：**最高**，需要专门的安全 review

---

## 场景 6 · 学习与探索 (Learning)

**典型活动**：
- 学新技术 / 新语言
- 探索性编程
- 教学示例

**推荐术语组合**：
- Vibe Coding ✓
- Few-Shot Prompting
- Few-Shot 教学示例
- Iteration

**风险**：低

---

## 场景 7 · 团队协作 (Team Collaboration)

**典型活动**：
- 多开发者共享代码
- PR 流程

**推荐术语组合**：
- GitHub Copilot / Cursor（团队版）
- CodeRabbit（PR 审查）
- Spec.md as Contract（团队共享）
- Diff Review 文化

**风险**：中——需要团队约定 prompt 风格、guardrails

---

## 场景 8 · 测试编写 (Test Writing)

**典型活动**：
- 为已有代码补测试
- TDD 流程

**推荐术语组合**：
- TDD with AI
- Safety Net Testing
- Test Suite as Referee
- Mechanical Verification Pipeline

**风险**：低——AI 写测试是相对安全的任务

---

## 场景 9 · 调试 / 排错 (Debugging)

**典型活动**：
- bug 复现
- 修复复杂错误

**推荐术语组合**：
- Iterative Refinement（贴错误信息）
- Failure Mode Analysis
- Acceptance Criteria（"bug 修复"的可验证定义）

**风险**：中——AI 倾向"治标不治本"

---

## 场景 9 · 文档与注释 (Documentation)

**典型活动**：
- 写 README
- 生成 API 文档
- 代码注释

**推荐术语组合**：
- Few-Shot Prompting（输出格式示例）
- Spec.md as Contract

**风险**：低

---

## 场景矩阵（决策表）

| 场景 | Vibe 强度 | 推荐 guardrails | 推荐工具 |
|---|---|---|---|
| 一次性原型 | ★★★★★ | 几乎无 | Cursor / Lovable |
| 个人工具 | ★★★★★ | YOLO 可接受 | Cursor / Replit |
| 生产维护 | ★ | 全套 | Claude Code + Copilot |
| 大型重构 | ★★ | 强 | Claude Code (Plan mode) |
| 安全敏感 | ✘ | 极致 | 限制 AI 使用 |
| 学习 | ★★★★ | 弱 | Cursor |
| 团队协作 | ★★★ | 中 | Cursor / Copilot |
| 测试 | ★★ | 中 | Cursor / Copilot |
| 调试 | ★★★ | 中 | Claude Code |
| 文档 | ★★★★ | 弱 | 任何 |

---

## 来源

- martinfowler.com/bliki/VibeCoding.html
- en.wikipedia.org/wiki/Vibe_coding
- spec-coding.dev/start-here
- github.github.io/spec-kit/