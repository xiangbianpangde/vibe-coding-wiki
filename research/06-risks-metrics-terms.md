# L6 · 风险与度量层术语 (Risks & Metrics Layer)

> vibe coding 的代价、批评、实证研究。

---

## Technical Debt

**定义**：代码中为追求短期速度而累积的**长期维护负担**。

**vibe coding 加剧方式**：
- AI 倾向于"快速凑出能跑的代码"
- 重构被跳过
- 注释、文档常缺失
- 没有业务语义只有"看起来对"

**GitClear 数据（2024）**：
- 代码**重构占比**从 2021 的 25% 降至 2024 的 <10%
- **代码重复**增加了约 4 倍
- **代码 churn**（更新率）几乎翻倍

---

## Code Churn

**定义**：代码被修改 / 重写 / 删除的比率。

**vibe coding 影响**：AI 倾向于"重写而不重构"，导致 churn 飙升。

---

## Code Duplication

**定义**：相同 / 相似代码段重复出现。

**vibe coding 影响**：AI 重复生成相似函数，不主动 DRY。

---

## Vibe Slop

**定义**：Mario Zechner 与 Armin Ronacher（OpenClaw 工程师）发明的术语——指 vibe coding 产生的大量低质量、难维护代码。

**Zechner 警告**：
> "You have infrastructure that's falling apart, and you have software that's now very, very buggy compared to before. We can play this game for a couple more months, or maybe even years, but eventually it will catch up to us."

---

## Vibe Coding Hangover

**定义**：Fast Company 2025-09 提出的术语——指 vibe 出来的代码在生产中**逐渐暴露出问题**的状态。

**典型症状**：
- 没人敢改这块代码
- bug 报告无法复现
- 文档完全缺失
- 业务规则散落在 prompt 历史里

---

## Development Hell

**定义**：因 vibe coding 制造的"难以演进的系统"困境。

---

## Lethal Trifecta

**定义（Simon Willison）**：三个 AI agent 风险因子的组合——

1. **访问私人数据**（credentials / 用户信息）
2. **接触不可信内容**（邮件 / web）
3. **具有外部通信能力**（发邮件 / 推文 / commit）

**任意两个组合**：危险
**三个全占**：致命

> 即使非程序员也需要知道——因为 vibe coding 应用可能无意触发它。

---

## Software for One

**定义（Kevin Roose, NYT）**：只为"一个用户自己"写的、不可公开、不被审查、个性化的软件。

**与 vibe coding 关系**：vibe coding 让"为自己写软件"成为大众级实践。

---

## Homogenization of Software

**定义**：LLM 倾向于选择**主流 / 知名库**，导致软件栈趋同、生态多样性下降。

**论文**：Vibe Coding Kills Open Source（Koren et al., 2026-01）

---

## Eternal September

**定义**：GitHub 借用的 Usenet 术语——指"大量新人不了解规范地涌入"，让既有社区难以维持秩序。

**vibe coding 影响**：大量"prompt-only"的 PR 涌入开源项目，cURL、Ghostty 等已主动设防。

---

## YOLO Coding (与 YOLO Mode 的关系)

**定义**：YOLO Mode 的同义词，强调"完全不把关"的态度。

---

## Vibe Valuation

**定义**：The Economist 提出的**平行术语**——指 AI 创业公司估值背离 ARR（年经常性收入）等指标的潮流。

**与 vibe coding 关系**：**类比关系**——重速度、轻质量；类似"vibe slop"在投资领域。

---

## 关键实证研究

### METR Randomized Controlled Trial（2025-07）
- 16 名有经验的 OSS 开发者 / 246 任务
- 2025 年初 AI 工具让完成时间**+19%**
- 开发者**事前预测**：-24%
- 结论：**开发者高估了 AI 的提速效果**

### CodeRabbit PR Analysis（2025-12）
- 470 个开源 GitHub PR
- AI co-authored 代码**重大问题**多 1.7×
- **配置错误**多 75%
- **安全漏洞**多 2.74×

### Veracode Security Study（2025-10）
- LLM 生成代码安全性**3 年未改善**
- 大模型不比小模型更安全

---

## 风险事件时间线

| 时间 | 事件 | 教训 |
|---|---|---|
| 2025-05 | Lovable 170/1645 应用泄漏 PII | 安全 guardrail 缺失 |
| 2025-07 | Replit agent 删生产数据库 | YOLO 模式代价 |
| 2026-05 | rsync 3.4.3 "tridge + claude" commits | 拒绝 vibe 入侵关键基础设施 |
| 2026-01 | "Vibe Coding Kills Open Source" 论文 | 社区可持续性威胁 |

---

## 来源

- en.wikipedia.org/wiki/Vibe_coding
- simonwillison.net/2025/Mar/19/vibe-coding/
- simonwillison.net/2025/May/1/not-vibe-coding/
- martinfowler.com/bliki/VibeCoding.html
- cacm.acm.org/news/catching-the-vibe-of-vibe-coding/
- arxiv.org/html/2506.23253