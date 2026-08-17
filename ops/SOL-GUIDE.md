# /sol 使用指南 · ChatGPT web GPT-5.6 Sol High

> **通过 pi-oracle 调用 ChatGPT web 上的 GPT-5.6 Sol High（Plus 最高档）。**
> **不要再用 agent_browser 打开 chatgpt.com — 会被 ban。**

## 何时使用 /sol

✅ **使用**：
- 解决困难的设计问题
- 需要第二意见（"我的方案对吗？"）
- 你卡住了，需要外部视角
- 战略规划 / 风险分析
- 写 HN / 推广文案 / KOL outreach 模板

❌ **不使用**：
- 本地 trivial 编辑
- 可以直接在代码里看到答案的简单问题
- 重复性任务（应该写脚本）

## 4 个工具调用

### 1. `oracle_preflight` — 检查准备状态
```json
{
  "provider": "chatgpt"
}
```
**返回**：
- ✅ "Preflight ready" → 可以直接 submit
- ⚠️ "Auth missing/stale" → 需要先 `oracle_auth`

### 2. `oracle_auth` — 登录 ChatGPT
```json
{
  "provider": "chatgpt"
}
```
**何时需要**：
- 首次使用
- 认证过期（>30 天）
- 换了 Chrome 账号

**注意**：允许自动同步 Chrome cookies。如果 Chrome 锁定了 cookie DB，告诉用户退出 Chrome 并重跑。

### 3. `oracle_submit` — 提交问题
```json
{
  "prompt": "你的问题（详细、含上下文）",
  "files": ["README.md", "ops/share/01-hackernews.md"],  // 必填，至少 1 个
  "provider": "chatgpt",
  "preset": "thinking_extended"   // 推荐
}
```

**预设选项**：
- `thinking_extended` — Plus High (推荐，深度分析)
- `thinking_standard` — 标准
- `instant` — 即时（最快但最浅）

**文件限制**：
- 最多 10 文件
- 512 MiB/文件
- .exe/.dmg/.apk 会被拒

### 4. `oracle_read` — 读取结果
```json
{
  "jobId": "uuid-from-submit"
}
```
**状态**：
- `queued` — 还在排队
- `running` — 正在分析
- `complete` — 完成，读 response.md
- `failed` — 失败，看 error

完成时 `response` 字段指向 `/tmp/oracle-XXX/response.md`。

## 实战模板

### 模板 1：战略规划
```
prompt: "
我现在在做 [项目名]，已完成 [状态]。
剩余的 [未完成项] 应该按什么优先级做？
HN 推广的标题和内容应该怎么写？
风险是什么？
"
files: ["README.md", "关键文件"]
preset: thinking_extended
```

### 模板 2：bug 深度分析
```
prompt: "
我遇到 bug [描述]。
网络证据：[请求/响应]
期望：[正确行为]
给出根因 + 修复方案 + 类似 bug 的预防。
"
files: ["相关代码文件"]
preset: thinking_extended
```

### 模板 3：文案优化
```
prompt: "
我要写 [渠道] 推广 [产品]。
目标受众：[人群]。
现有草稿：[paste]
请优化：标题 + 开头 + 整体结构。
考虑 [HN 规则 / 字符限制 / SEO]。
"
files: ["现有草稿"]  
preset: thinking_extended
```

## Sync 触发

- 提交后系统会**自动通知**你完成
- 不要再 `oracle_read` 重复轮询
- 完成后用 `oracle_read` 一次获取结果

## 错误处理

| 错误 | 修复 |
|---|---|
| "Auth missing" | 跑 `oracle_auth` |
| "Could not open effort dropdown" | 换 preset（如 `thinking_standard`） |
| "File not found" | 用绝对路径（`/Users/...`） |
| "Files too large" | 拆分文件 / 删掉无关文件 |
| "Plan limit" | 不再升级，告诉用户 |

## 配合 Manus / 队员工作流

| 阶段 | 用 /sol |
|---|---|
| 调研可行性 | ✅ （"这 7 项优化 ROI 如何？"） |
| 设计方案 | ✅ （"Round 4 翻译合并的最佳实施？"） |
| bug 侦探 | ✅ （"为什么 base href + 路径 404？"） |
| 写文案 | ✅ （"HN 帖子怎么写？"） |
| trivial 改 | ❌ （直接做） |
| 重复任务 | ❌ （写脚本） |

## 真实案例（已用过的）

1. **战略规划** — 让 Sol 评估 v2.2 launch readiness + HN 标题 + 1k star 路径
2. **HN 帖子优化** — Sol 重写 01-hackernews.md（9.5/10 vs 6.5/10 原版）
3. **README v2.2** — Sol 建议从 "178 terms" 转向 "taxonomy problem" 核心论点

## 不要做的事

- ❌ 用 `agent_browser` 打开 chatgpt.com（会被 ban）
- ❌ 用 `instant` 跑深度分析（结果会很浅）
- ❌ 静默把 Plus High 升级到 Pro（如需要会失败）
- ❌ 把 1 个问题拆成 5 个重复问题
- ❌ 用 /sol 跑本地可见的代码问题

## Pitfalls

- Default is **Plus High** (`thinking_extended`).
- **`agent_browser` on ChatGPT is blocked** — 冲突 oracle worker session.
- pi-oracle jobs 在 `$PI_ORACLE_JOBS_DIR` 或 `/tmp/oracle-<id>/`.
- Worker 说 High 不可用就停止（不要 invent Instant/Medium fallback）。

## 验证

- `/sol` 提问后 → 30-60s 内收到 Sol 答案
- 提交 `thinking_extended` 后 `oracle_read` 显示 `complete` + `response.md`
- 错误 → 看 error 字段 + 修

---

## 队员 / 协调方集成

在 `intercom` 中通知协作者时：
- 让他们用 `/sol` 做战略 / 风险 / 文案问题
- 让他们用 `oracle_preflight` 检查状态
- 让他们用 `oracle_read` 读取结果
- 不要用 `agent_browser` 打开 chatgpt.com

**Sol is a senior advisor, not a replacement for local reasoning.**
