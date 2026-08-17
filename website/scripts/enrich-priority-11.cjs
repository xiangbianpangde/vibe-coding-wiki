// Wave 4a enrichment — 10 L1 paradigm + L2 method terms
// Strategy: focus on examples (biggest gap), maintain quotes/seeAlso where present
const { applyEnrich } = require('./lib/enrich-lib.cjs');

const ENRICH = {
  // ============ L1 范式（最大空白）============
  'ai-assisted': {
    examples: [
      {
        code: `# AI-assisted coding workflow
# 1. 写注释描述意图（让 AI 理解）
def calculate_discount(price, tier):
    """
    Tier 1: 0% off (regular)
    Tier 2: 10% off (silver)
    Tier 3: 20% off (gold)
    Tier 4: 30% off (platinum)
    """
    # 2. AI 补全实现
    discounts = {1: 0, 2: 0.1, 3: 0.2, 4: 0.3}
    return price * (1 - discounts.get(tier, 0))`,
        desc: "AI-assisted coding: 写注释 + AI 补全",
      },
      {
        code: `# AI-assisted test writing
# 输入：函数签名 + 行为描述
# 输出：测试用例（AI 生成）
def test_login():
    # AI 生成的测试
    assert login("alice", "correct") == True
    assert login("alice", "wrong") == False
    assert login("", "") == False
    assert raises(login, None, None)  # type check`,
        desc: "AI-assisted test writing",
      },
    ],
  },

  'pair-programming': {
    examples: [
      {
        code: `# AI pair programming: 驾驶员-导航员模式
# Driver: 写代码的人（AI 或人）
# Navigator: review 的人

# Round 1: 人导航，AI 写
# "我想要一个缓存装饰器，支持 TTL 和 LRU 淘汰"
# AI 写代码 → 人 review → 反馈

# Round 2: AI 导航，人写
# 人: 写缓存类骨架
# AI: 建议"加 TTL 检查"、"用 OrderedDict 实现 LRU"

# 关键：定期交换角色`,
        desc: "AI pair programming 驾驶员-导航员模式",
      },
    ],
  },

  pdd: {
    examples: [
      {
        code: `# Prompt-Driven Development
# 1. 把需求写成精确 prompt
prompt = """
实现用户登录接口，要求：
- POST /api/login
- 接受 {email, password}
- 返回 JWT token (HttpOnly cookie)
- 失败返回 401 + 错误信息
- rate limit: 5 次/分钟
"""

# 2. prompt 作为 source of truth
# 3. CI 跑 prompt → 验证实现匹配 prompt
$ pd test spec-login.md
# ✓ All spec requirements met
# ✓ Rate limit: 5/min implemented
# ✓ JWT in HttpOnly cookie`,
        desc: "PDD: prompt 作为 source of truth",
      },
    ],
  },

  emotioneering: {
    examples: [
      {
        code: `# AI Emotioneering: 用模型调整 UX 情感曲线
# 设计师先标注每屏的情绪目标
screens = [
    {"name": "onboarding", "target_emotion": "trust"},
    {"name": "error", "target_emotion": "calm"},
    {"name": "success", "target_emotion": "delight"},
]

# AI 生成匹配情绪的设计方案
for screen in screens:
    design = ai.generate_design(
        screen["name"],
        emotion=screen["target_emotion"],
        palette="warm",  # 暖色调增强 trust
    )`,
        desc: "AI 生成匹配目标情绪的 UX 设计",
      },
    ],
  },

  'orchestration-of-agents': {
    examples: [
      {
        code: `# Orchestration: 一个 lead agent 协调多个 specialist
# LangGraph 示例
from langgraph.graph import StateGraph
from typing import TypedDict, List

class WorkflowState(TypedDict):
    query: str
    research: List[str]
    analysis: str
    final: str

graph = StateGraph(WorkflowState)
graph.add_node("researcher", research_agent)
graph.add_node("analyst", analysis_agent)
graph.add_node("writer", writing_agent)

graph.add_edge("__start__", "researcher")
graph.add_edge("researcher", "analyst")
graph.add_edge("analyst", "writer")
graph.add_edge("writer", "__end__")

app = graph.compile()
result = app.invoke({"query": "AI safety trends 2026"})`,
        desc: "LangGraph 多 agent 编排",
      },
    ],
  },

  'agentic-workflow': {
    examples: [
      {
        code: `# Agentic Workflow: 循环 plan → act → observe
# 不再是 single-shot prompt，而是持续循环

async function agentic_loop(task):
    state = {goal: task, done: False}
    while not state.done:
        # 1. Plan: 决定下一步
        plan = await llm.plan(state.context, state.history)
        # 2. Act: 执行 action
        result = await execute(plan.action)
        # 3. Observe: 收集结果
        state.history.append({"plan": plan, "result": result})
        state.done = check_done(state)
    return state.history[-1].result

# vs 单次 prompt:
# answer = await llm.complete(prompt)
# agentic 多步处理复杂任务`,
        desc: "Agentic workflow vs single-shot prompt",
      },
    ],
  },

  'cognitive-debt-vs-tech-debt': {
    examples: [
      {
        code: `# Technical Debt vs Cognitive Debt
# Tech debt: 代码层面
def legacy_function(x):
    # TODO: 不知道干嘛，也不敢动
    return some_unclear_transformation(x)

# Cognitive debt: 团队认知层面
# - 不知道 AI 改了什么
# - 不知道为什么这样写
# - spec 散落在 PR comments / Slack / 各处
# - 6 个月后回来接手的人：完全失忆

# Hunt 框架：
# 2025 = tech debt year（代码债积累）
# 2026 = cognitive debt year（认知债爆炸）`,
        desc: "Cognitive debt vs technical debt 实测",
      },
    ],
  },

  'no-code': {
    examples: [
      {
        code: `# No-code: 用 AI 工具不写代码建应用
# 1. Lovable / v0: 描述 → 全栈应用
$ lovable "Build a SaaS dashboard for tracking gym workouts.
Login + workout log + progress chart. Dark mode."

# 2. 生成 React + Tailwind + DB
# 3. 部署到 lovable.dev subdomain
# 4. 之后用 Claude Code 加自定义功能

# 适合：原型、个人工具、内部工具
# 不适合：复杂业务逻辑、高合规要求`,
        desc: "No-code 工具栈: Lovable/v0 流程",
      },
    ],
  },

  // ============ L2 方法论 ============
  'spec-md': {
    examples: [
      {
        code: `# spec.md 完整模板
# /spec/auth.md

# 1. User Story
## 作为 注册用户
## 我想 通过 GitHub OAuth 登录
## 以便 不用记密码

# 2. Acceptance Criteria (机器可验证)
- [ ] GET /auth/github 跳转到 GitHub OAuth
- [ ] /auth/github/callback 用 code 换 token
- [ ] 首次登录自动创建 User 记录
- [ ] token 存 HttpOnly cookie，1h 过期
- [ ] refresh token，30 天过期
- [ ] npx tsc --noEmit 通过
- [ ] 测试覆盖 ≥ 80%

# 3. Non-Goals
- 不做多因素认证
- 不做密码重置

# 4. Tech Constraints
- 后端：Fastify + PostgreSQL
- Token：JWT (RS256)
- 测试：vitest`,
        desc: "spec.md 完整模板（4 段可验证结构）",
      },
    ],
  },

  'iterative-refinement': {
    examples: [
      {
        code: `# Iterative Refinement: 多轮 prompt 优化
# Round 1: 粗 prompt
prompt1 = "Write a sorting function"

# Round 2: 加约束
prompt2 = "Write a sorting function in Python. Handle empty list. Stable sort."

# Round 3: 加测试
prompt3 = prompt2 + "Must pass these tests: sort([])==[], sort([3,1])==[1,3]"

# Round 4: 加边界
prompt4 = prompt3 + "Handle negative numbers, floats, and duplicates"

# 每次迭代：跑测试 → 找失败 → 加约束 → 再 prompt
# 关键：把"成功标准"明确化`,
        desc: "Iterative refinement 4 轮 prompt 优化",
      },
    ],
  },
};

const added = applyEnrich(ENRICH);
console.log(`[enrich-priority-11] Added: ${added.examples} examples, ${added.seeAlso} seeAlso, ${added.quotes} quotes across ${added.terms} terms`);