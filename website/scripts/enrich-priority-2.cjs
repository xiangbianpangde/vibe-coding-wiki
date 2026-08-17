// Wave 2 enrichment — Task 1, batch 2
// Refactored to use shared lib/enrich-lib.cjs (deduplicated boilerplate)
// Original ENRICH data preserved — merge+dedupe logic now in lib.

const { applyEnrich } = require('./lib/enrich-lib.cjs');

const ENRICH = {
  // ====== L2 方法论 ======
  "plan-verify-build": {
    examples: [
      {
        code: `// Plan-Verify-Build 三段循环
loop:
  phase = plan     // 1. 把目标拆成可验证任务
  if not verify(phase):    // 2. 机械化验证（编译、测试、lint）
    revert_to_last_green()
    refine_plan()
    continue
  phase = build    // 3. 执行最小变更
  commit_if_green()

// 关键：plan 阶段产出物必须可机械验证（"添加登录页"不可，"添加登录页 + 路由 + 单元测试"可）`,
        desc: "Plan-Verify-Build 循环伪代码",
      },
    ],
    seeAlso: [
      { name: "Claude Code: Plan mode", url: "https://docs.claude.com/en/docs/claude-code/plan-mode" },
      { name: "Anthropic: Building effective agents", url: "https://www.anthropic.com/research/building-effective-agents" },
    ],
  },

  sdd: {
    examples: [
      {
        code: `# spec.md 的最小可执行结构
# 1. 用户故事
As a 注册用户
I want 通过 GitHub OAuth 登录
So that 我不用记密码

# 2. 验收标准（机器可验证）
- [ ] GET /auth/github 跳转到 GitHub OAuth 页面
- [ ] 回调 /auth/github/callback 用 code 换 token
- [ ] 用户首次登录自动创建 DB 记录
- [ ] 测试覆盖率 ≥ 80%
- [ ] npx tsc --noEmit 通过

# 3. 非目标（明确说不做什么）
- 不做多因素认证
- 不做密码重置流程

# 4. 技术约束
- 后端：Fastify + PostgreSQL
- Token：HttpOnly cookie，1h 过期`,
        desc: "spec.md 模板：4 段可验证结构",
      },
    ],
    seeAlso: [
      { name: "GitHub Spec Kit", url: "https://github.github.io/spec-kit/" },
      { name: "Spec Coding Manifesto", url: "https://spec-coding.dev" },
    ],
  },

  // ====== L3 技术 ======
  "computer-use": {
    examples: [
      {
        code: `// Anthropic Claude Computer Use 工具调用示例
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();
const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  tools: [
    {
      type: "computer_20241022",     // 计算机使用工具版本
      name: "computer",
      display_width_px: 1920,
      display_height_px: 1080,
    },
  ],
  messages: [{
    role: "user",
    content: "请打开 Safari，搜索 Vibe Coding Wiki",
  }],
});

for (const block of response.content) {
  if (block.type === "tool_use" && block.name === "computer") {
    switch (block.input.action) {
      case "screenshot": captureScreen(); break;
      case "left_click":  await mouseClick(block.input.coordinate); break;
      case "type":        await keyboardType(block.input.text); break;
      case "key":         await keyboardPress(block.input.text); break;
    }
  }
}`,
        desc: "Anthropic Computer Use SDK 调用",
      },
    ],
    quotes: [
      {
        text: "Computer use lets Claude perceive and interact with computer interfaces. It can look at screens, move cursors, click, and type.",
        cite: "Anthropic, 2024-10 release notes",
      },
    ],
    seeAlso: [
      { name: "Anthropic Computer Use 公告", url: "https://www.anthropic.com/news/computer-use" },
      { name: "Computer Use 文档", url: "https://docs.claude.com/en/docs/agents-and-tools/tool-use/computer-use-tool" },
    ],
  },

  "browser-use": {
    examples: [
      {
        code: `# Browser-Use 库 — 让 LLM 操控浏览器
from browser_use import Agent
from langchain_anthropic import ChatAnthropic

agent = Agent(
    task="在 Hacker News 上找最近一篇关于 vibe coding 的文章，提取标题和评论数",
    llm=ChatAnthropic(model="claude-sonnet-4-5"),
)

result = await agent.run()
print(result)   # → 标题 + 评论数

# 内部循环：
# 1. 打开浏览器 → 截图 → 让 LLM 决策
# 2. 执行 click/type/scroll
# 3. 直到 LLM 输出 task_complete`,
        desc: "browser-use 开源库（Python）",
      },
    ],
    quotes: [
      {
        text: "Browser-use enables AI agents to control browsers naturally. Built on Playwright + LangChain.",
        cite: "browser-use.com",
      },
    ],
    seeAlso: [
      { name: "browser-use 官网", url: "https://browser-use.com" },
      { name: "browser-use GitHub", url: "https://github.com/browser-use/browser-use" },
      { name: "Anthropic Claude for Chrome", url: "https://www.anthropic.com/news/claude-for-chrome" },
    ],
  },
};;

const added = applyEnrich(ENRICH);
console.log(`[enrich-priority-2] Added: ${added.examples} examples, ${added.seeAlso} seeAlso, ${added.quotes} quotes across ${added.terms} terms`);
