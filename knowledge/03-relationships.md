# Vibe Coding 关系矩阵

> 术语间关系详解。

---

## 一、边界关系（最重要）

### Vibe Coding ↔ Agentic Programming

| 维度 | Vibe Coding | Agentic Programming |
|---|---|---|
| 是否看代码 | ❌ 否 | ✅ 是 |
| 是否审查 diff | ❌ 否 | ✅ 是 |
| 是否关注结构 | ❌ 否 | ✅ 是 |
| 是否维护 | ❌ 否 | ✅ 是 |
| 适用 | 一次性 / 一次性 demo | 生产代码 / 长期项目 |
| 风险 | 高 | 中 |
| 速度 | 极快 | 中等 |

**Simon Willison 判据**：
> "If an LLM wrote every line of your code, but you've reviewed, tested, and understood it all, that's not vibe coding in my book—that's using an LLM as a typing assistant."

**Fowler 的 Semantic Diffusion 警告**：这两个术语被广泛混淆，需要保持区分。

---

## 二、组成关系

### Vibe Coding = Karpathy 描述 + LLM + Iterative Refinement + Acceptance Criteria

```
Vibe Coding
├── Karpathy 的"forget that the code exists"哲学
├── 引擎：LLM (通常 Frontier Model)
├── 工具：Cursor / Claude Code / Lovable
├── 流程：Iterative Refinement
└── 约束：Acceptance Criteria（可选）
```

---

## 三、因果关系

### Vibe Coding → Technical Debt → Development Hell

```
频繁使用 Vibe Coding
  ↓
缺乏 Refactoring + 缺乏 Spec
  ↓
Technical Debt 累积
  ↓
Code Duplication ↑ / Code Churn ↑
  ↓
Vibe Coding Hangover
  ↓
Development Hell
```

**反向阻断**：用 Guardrails + SDD + Mechanical Verification Pipeline 切断链路。

---

### YOLO Mode → 安全事件

```
YOLO Mode
  ↓
无审批 / 无 diff review
  ↓
  ├─→ Replit 删库事件
  ├─→ Lovable PII 泄漏
  └─→ 任意 Lethal Trifecta 触发
```

---

### Context Engineering → Hallucination ↓

```
Context Engineering
  ↓
只把相关 / 校验过的内容注入 context
  ↓
LLM 注意力集中
  ↓
Hallucination 显著减少
```

---

### Specification-Driven Dev → Agent Loop 效率 ↑

```
Spec.md 清晰
  ↓
Agent Plan 阶段输出高质量任务清单
  ↓
Verify 阶段验收标准明确
  ↓
Build 阶段少返工
```

---

## 四、并行关系

| Term A | Term B | 关系 |
|---|---|---|
| Vibe Coding | No-Code / Low-Code | 相邻范式 |
| Vibe Coding | Software for One | 强相关 |
| Vibe Coding Hangover | Development Hell | 演进路径 |
| Vibe Slop | Technical Debt | 现象 vs 机制 |
| Vibe Valuation | Vibe Slop | 跨域类比（金融 vs 软件） |
| Software for One | Eternal September | 用户 vs 社区视角 |
| Few-Shot Prompting | Chain-of-Thought | 不同 prompt 技巧 |
| Cursor | Windsurf | 同类工具竞争 |
| Claude Code | Cursor | 不同集成层级 |

---

## 五、上下位关系

```
Software Engineering
└── AI-Assisted Software Development
    ├── Vibe Coding
    │   ├── Software for One
    │   └── YOLO Mode
    └── Agentic Programming
        ├── Specification-Driven Development
        └── Test-Driven Development (TDD with AI)
```

```
LLM
├── Frontier Model
├── Code Model
└── Specialized Models (vision, audio, ...)
```

```
Verification
├── Compiler as Referee
├── Test Suite as Referee
└── Code Review (Human / AI)
```

---

## 六、关键术语的"决定性区分"一览

| 区分 | A | B | 决定点 |
|---|---|---|---|
| 是否 vibe？ | Vibe Coding | Agentic Programming | **是否审查代码** |
| 是否 YOLO？ | YOLO Mode | Responsible Vibe Coding | **是否每次审批** |
| Spec 是否必需？ | SDD | Ad-hoc Vibe | **spec.md 是否共享契约** |
| 工具？ | Cursor (IDE) | Claude Code (CLI) | **集成层级** |
| 模式？ | Plan Mode | Build Mode | **是否先规划再执行** |
| Prompt？ | Few-Shot | Zero-Shot | **是否给示例** |
| 评测？ | Pass@1 | Pass@k | **采样次数** |
| Context？ | Window 大小 | Engineered | **是否人工管理注入** |

---

## 来源

- martinfowler.com/bliki/VibeCoding.html
- simonwillison.net/2025/Mar/19/vibe-coding/
- en.wikipedia.org/wiki/Vibe_coding
- spec-coding.dev/start-here
- github.github.io/spec-kit/