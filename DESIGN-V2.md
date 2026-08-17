# Vibe Coding Wiki · v2.0 升级设计

> 在 v1.0 基础上，参考成熟项目（Wikipedia / MDN / DevDocs / Claude Code 官方词汇表 / Stack Overflow 2025 / Simon Willison）的设计模式，扩充术语数量与前端组件。

---

## 一、问题诊断

### 当前 v1.0 缺陷

| 维度 | 现状 | 差距 |
|---|---|---|
| 术语数量 | 71 个 | 目标 200+ 个（含 Claude Code 官方、Karpathy 2026 新词、120 个 LLM 术语） |
| 词条详情 | 无 | 每个词条需独立详情页（Wikipedia 模板化） |
| 组件丰富度 | 6 页（薄） | 需 10+ 组件（详情页 / 对比 / 数据仪表板 / 标签云 / 引用 / 时间线） |
| 信息架构 | 平铺 | 需有版本演进（vibe coding → vibe engineering → agentic engineering） |
| 数据驱动 | 弱 | 词条数据应支撑搜索 / 过滤 / 关联 / 标签 / 时间线多维 |

### 缺失的核心术语（来自调研）

**Karpathy 2026 新词**
- Agentic Engineering（取代 vibe coding 的术语）
- Cognitive Debt（Hunt 2026）
- Emotioneering（Shimmin 对照词）

**Simon Willison 2025-10**
- Vibe Engineering（vibe coding 的对立面）
- Coding Agents / Agentic Coding Tools
- Parallel Coding Agents
- Agent Teams

**Claude Code 官方词汇表（30+ 独有术语）**
- Agentic Harness / Agentic Loop
- CLAUDE.md / Auto Memory / Compaction
- Hook / Checkpoint / Extended Thinking
- Effort Level / Output Style
- MCP Tool Search / Connector / Channel
- Permission Mode / Bare Mode / Dispatch
- Bundled Skills / Commands

**120 个 LLM 术语（关键技术栈）**
- Transformer / Attention / Self-Attention / Cross-Attention
- RAG / Vector Database / Embedding / Chunking
- LoRA / QLoRA / PEFT / DPO / ORPO / IPO / RLHF / RLAIF
- Chain-of-Thought / ReAct / Tree-of-Thought / Reflexion
- KV Cache / PagedAttention / Speculative Decoding
- Mixture of Experts (MoE) / FlashAttention
- RoPE / ALiBi / SwiGLU
- Mamba (SSM) / Diffusion Model / Vision Transformer (ViT)
- DSPy / LangChain / LlamaIndex

**Stack Overflow 2025 数据**
- 84% 使用 / 51% 每天 / 72% 不做 vibe coding
- 66% "几乎对但不完全对" / 45% 调试难

---

## 二、目标 v2.0

### 信息架构升级

```
/                    首页（统计 + 词云 + 时间线）
/glossary            A-Z 词条表（200+）
/layers              L1-L8 分层（扩充）
/scenarios           10 类场景（扩充）
/graph               关系图谱（mermaid）
/citations           来源（扩充）
/compare             对比页（vibe vs agentic vs hallucination）
/stats               数据仪表板（Stack Overflow 2025）
/term                详情页（动态渲染 200+ 词条）
```

### 新增组件

1. **词条详情页**（`term.html`）
   - 顶部：标题 + 一句话定义 + 分类标签
   - TOC 锚点（侧栏）：定义、出处、相关词、例句、引用
   - 正文：完整定义（含历史溯源）
   - 侧栏：相关词条、标签、来源
   - 底部：feedback 区（`talkSend`）

2. **对比页**（`compare.html`）
   - 并列两栏 / 三栏对比
   - 关键差异高亮
   - 适用场景标注

3. **数据仪表板**（`stats.html`）
   - Stack Overflow 2025 数据可视化
   - 工具采纳率柱状图（CSS 风格）
   - 信任度 sentiment 雷达

4. **标签云**（首页内嵌）
   - 词条频率可视化
   - 点击进入过滤列表

5. **版本演进时间线**（首页内嵌）
   - Vibe Coding (2025-02) → Vibe Checking → Vibe Engineering (2025-10) → Agentic Engineering (2026-02)

6. **反馈按钮 + talkSend**
   - 每个词条"提交反馈"
   - AI agent 接收建议

---

## 三、设计原则（继承 + 增强）

继承 v1.0 的中国色设计哲学：
- 暖纸基底（#F9F4DC 乳白）
- 衬线中文（Noto Serif SC）
- 圆体数字（M PLUS Rounded 1c）
- 锐角无圆角（border-radius: 0）
- 中国色 palette（L1-L8 语义色）

**新增设计原则（参考成熟项目）**：
- **Wikipedia 模板化**：定义、出处、相关词、引用模板一致
- **MDN 侧栏 TOC**：长详情页锚点导航
- **DevDocs 多面板**：左目录 + 中内容 + 右相关
- **Claude Code 词汇表风**：每个术语一行 + 链接
- **Stack Overflow 仪表板**：可视化数据

---

## 四、执行计划

1. ✅ 调研成熟项目（Wikipedia / MDN / DevDocs / Claude Code 词汇表）
2. ⏳ 扩展数据到 200+ 词条（含完整 schema）
3. ⏳ 构建详情页（动态渲染）
4. ⏳ 构建对比页
5. ⏳ 构建数据仪表板
6. ⏳ 增强首页（标签云 + 时间线 + 数据）
7. ⏳ 增强词条页（按层级 + 标签双过滤）
8. ⏳ 复盘核验
9. ⏳ 导出 /talk 验收汇报

---

## 五、新数据 Schema

每条词条：
```js
{
  id: 'vibe-coding',         // slug
  name: 'Vibe Coding',        // 英文
  zh: 'Vibe Coding',          // 中文
  shortDesc: '...',           // 一句话
  longDesc: '...',            // 详细定义（多段）
  layer: 'L1',                // 主层级
  category: 'paradigm',       // 子分类
  tags: ['paradigm', 'karpathy'],
  related: ['agentic-programming', 'vibe-engineering'],
  source: 'Karpathy X post, 2025-02-02',
  sourceUrl: 'https://x.com/karpathy/status/...',
  coinedBy: 'Andrej Karpathy',
  coinedDate: '2025-02',
  examples: ['...'],
  quotes: [{text: '...', cite: '...'}],
  seeAlso: [{name: '...', url: '...'}],
  version: 'v1',              // 演进版本
}
```

---

## 六、参考设计系统

| 来源 | 学习点 |
|---|---|
| Wikipedia Glossary | 模板化定义 + hatnote 跨引用 |
| MDN Glossary | 前置 frontmatter + 标准段落 |
| DevDocs | 紧凑布局 + 多面板 |
| Claude Code 文档 | 词汇表风格（每条一行 + 链接） |
| Stack Overflow 2025 | 数据可视化、表格化 |
| 中国传统色 Studio | 设计 token 系统 |