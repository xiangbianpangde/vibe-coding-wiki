# Vibe Coding Wiki v2.0 · 深度审计报告

> 基于实际加载 + DOM 检测 + curl 验证 + agent_browser 截图，得出的 10 个问题 + 10 个优化方向。

---

## 一、调研数据汇总

### 词条数据质量
- 总词条：178
- 有 `quotes` 字段：5 个（**<3%**）
- 有 `examples` 字段：约 5 个（**<3%**）
- 有 `coinedBy` 字段：6 个（约 3%）
- 有 `seeAlso` 字段：约 6 个
- **related 稀疏度**：
  - 仅 1 个 related：10 个词条（6%）
  - 3 个 related：128 个（72%）
  - 5 个 related：37 个（21%）
  - 7 个 related：3 个（2%）
- longDesc 长度：min 24 字符、max 553 字符、avg 228 字符

### 网站性能
- 首屏加载：~192ms（localhost）
- 字体加载：~1.7MB（Google Fonts 3 个 family）
- 首页节点数：507 个 DOM
- 内联样式：index.html 已清理（0 个）

### SEO 与无障碍
- favicon：❌ 无
- Open Graph / Twitter Card：❌ 无
- canonical link：❌ 无
- sitemap.xml：❌ 无
- robots.txt：❌ 无
- skip-link：❌ 无（term.html / index.html）
- ARIA 属性：❌ 0 个（index.html / term.html）
- prefers-color-scheme dark：❌ 无
- 键盘导航：仅有 ⌘K 搜索 + Esc 关闭

### 内容质量
- Karpathy 2026-02 新词 "agentic engineering" ✓
- 178 词条覆盖 8 层级 ✓
- 但**实证数据稀疏**：
  - 5 个词条有 quotes
  - 极少有 examples / code snippets
  - 来源链接大量缺失

### 链接与导航
- 链接数：33+（正常）
- 标题双层括号问题：**MCP 词条显示 "MCP (Model Context Protocol))"**
- 首页 layers.html#L1 链接正确（id 存在）
- 搜索 "claude" 返回 4 条 ✓
- 搜索结果链接到正确定位 ✓

---

## 二、10 个问题（按严重程度排序）

### 🔴 P0 严重问题（影响可用性）

**问题 1：词条标题双层括号**
- 现象：`term.html?id=mcp` 显示 "MCP (Model Context Protocol))"
- 根因：`term.js` 中 `term.zh === term.name ? term.name : ${term.zh} (${term.name})` — 当 name 本身含括号时输出重复
- 影响：详情页 178 个词条中可能有 10+ 出现同样问题
- 实测：MCP / RAG / GRAPH-RAG / DSPy 等所有含括号 name 都会触发

**问题 2：相关词条关联稀疏**
- 178 词条中 138 个（78%）只有 1-3 个 related
- 影响：点击"相关词条"经常只有 1-2 个可选项，知识图谱无法形成网络
- 根因：人工编写 data 时的成本问题，未使用算法自动生成关联

**问题 3：mermaid 关系图被裁切**
- 现象：只能看到 L1-L4 节点，L5-L8 不可见
- 根因：`mermaid-wrap` 设了 max-height + overflow，但节点过多图整体被裁
- 影响：核心"关系图谱"页面无法完整查看

### 🟠 P1 重要问题（影响专业感）

**问题 4：完整 SEO 元数据缺失**
- 无 favicon（浏览器标签页显示空白）
- 无 Open Graph（社交分享无卡片）
- 无 canonical（重复内容风险）
- 无 sitemap.xml / robots.txt（搜索引擎不友好）
- 无结构化数据（JSON-LD / Schema.org）

**问题 5：无暗色主题**
- 用户系统切暗色时网站依然亮
- 中国色项目已有 dark palette（玄青主导），但本站未实现
- 影响：长时间阅读疲劳、夜间使用

**问题 6：无障碍严重不足**
- ARIA 属性 0 个（index.html / term.html）
- 没有 skip-link 跳到主内容
- 没有 `<article>` 标签包裹主内容（首页）
- 焦点指示器仅简单实现
- 国际无障碍标准 WCAG 2.1 AA 部分不符合

**问题 7：词条元数据极少**
- 178 词条中只有 5 个有 quotes（<3%）
- 0 个有 examples / 代码示例
- 6 个有 seeAlso（外部链接）
- 词条详情页"详细定义"段很多仅 100-200 字
- 缺乏图片 / 图表 / 代码块

**问题 8：首屏加载 Google Fonts 偏大**
- 字体总 1.7MB（Noto Serif SC + M PLUS Rounded 1c + JetBrains Mono）
- Noto Serif SC 中文 9 个 weight × 中文字符
- 影响：移动端首屏加载慢、Lighthouse 性能分下降

### 🟡 P2 体验问题

**问题 9：搜索结果无键盘导航**
- 搜索有 ⌘K 触发 ✓
- 但搜索结果只能用鼠标点击，不能键盘 Select + Enter
- 即使代码中有相关逻辑（activeIndex），但没自动 focus 第一个结果

**问题 10：导航在移动端重新设计不足**
- 8 个导航项在移动端全部 hide（display: none）
- 没有汉堡菜单 / 抽屉式导航
- 移动端用户无法访问所有页面

---

## 三、10 个优化方向（按 ROI 排序）

### 🚀 P0 立即优化（高 ROI）

**方向 1：算法生成相关词条网络**
- 用 terms.js 数据自动计算 related：
  - 同 layer 的同 categories 词条
  - 共享 ≥2 个 tags 的词条
  - 互引用的词条（双向关系）
- 目标：每词条有 5-8 个合理的相关词条
- 工作量：1-2 小时

**方向 2：拆分 terms.js 为模块化 JSON**
- 现状：1 个 117KB JS 文件包含所有数据
- 改进：拆为 `data/layers.json` + `data/tools.json` + 按需加载
- 收益：首屏 JS 减少 60%+，移动端体验提升
- 工作量：3-4 小时

**方向 3：修复词条标题双层括号 + 智能化**
- 改进渲染：当 name 已含括号时不重复包裹
- 国际化：增加 `displayName` 字段（zh/ja/es 多语言）
- 工作量：1 小时

### 🎯 P1 短期优化（中等 ROI）

**方向 4：完整 SEO 元数据**
- 加 favicon.v1（SVG 矢量）
- 加 Open Graph / Twitter Card
- 加 JSON-LD 结构化数据（schema.org/DefinedTerm）
- 动态生成 sitemap.xml
- 加 robots.txt
- 工作量：4-6 小时

**方向 5：暗色主题**
- 中国色项目已有 dark palette，移植即可
- CSS 变量 + `:root[data-theme="dark"]` 切换
- 顶部加切换按钮
- 工作量：3-4 小时

**方向 6：词条深度扩充**
- 目标：每词条增加：
  - examples（代码示例）：目标 50% 词条
  - quotes（直接引文）：目标 30% 词条
  - seeAlso（外部链接）：目标 50% 词条
  - images / diagrams（示意图）
- 工作量：8-12 小时

**方向 7：详情页增强**
- 加"演进时间线"（术语自身的版本变化）
- 加"常见误解"section
- 加"反义词 / 关联术语"区分
- 加"学习路径"（3-5 篇推荐阅读顺序）
- 加版本历史（v1 → v2 变化）
- 工作量：6-8 小时

### 💎 P2 中期优化（高价值）

**方向 8：Mermaid 子图按词条动态生成**
- 每个词条详情页底部显示该词条关联子图
- 数据驱动：自动从 related 抽取
- 工作量：8-10 小时

**方向 9：键盘可达性全面升级**
- skip-link 添加
- 全部链接加 `aria-label`
- 搜索结果键盘 Select + Enter
- detail 页 TOC 锚点键盘导航
- 焦点环（focus-visible）增强
- 工作量：6-8 小时

**方向 10：组件库化与可扩展性**
- 现状：每个页面 inline 大量 style
- 改进：抽离 `components.css` 命名空间
- 建立 Storybook / 组件 demo 页
- 加 RTL (right-to-left) 支持
- 工作量：10-15 小时

---

## 四、推荐执行顺序

```
P0-1 算法生成相关词条（1-2h）→ 立即可见的网络效应
P1-2 拆分 terms.js（3-4h）→ 性能提升
P0-3 修复双重括号（1h）→ 立即修复
P2-4 键盘可达性（6-8h）→ A11y 合规
P1-4 SEO 元数据（4-6h）→ 搜索引擎友好
P1-5 暗色主题（3-4h）→ 体验提升
P2-9 详情页增强（6-8h）→ 核心价值
P1-6 词条深度扩充（8-12h）→ 内容质量
P2-8 Mermaid 子图（8-10h）→ 差异化
P2-10 组件库化（10-15h）→ 可维护性
```

总计：~50-70 小时可达 v3.0 专业级