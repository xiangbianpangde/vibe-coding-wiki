// Wave 4e — push examples past 70% target
// 12 L2/L3/L7/L8 terms, examples focus
const { applyEnrich } = require('./lib/enrich-lib.cjs');

const ENRICH = {
  // ============ L1 paradigm ============
  'machine-speed': {
    examples: [
      {
        code: `# Machine Speed: AI 修改代码的速度远超人类 review
# 实测：人类 review ~200 行代码/小时
# AI 生成 ~2000 行代码/小时
# → review bottleneck 放大 10x

# 后果（无 guardrails）：
# - tech debt 积累速度 = 人类时代的 10x
# - review 跟不上，AI 错改未被发现

# 解法：
# 1. 强类型系统（编译时捕获 ~70% 错误）
# 2. 自动测试（CI 跑全套，5 分钟内）
# 3. 限制 AI 单次 PR 大小（<500 行）
# 4. spec.md 先行 → 减少 review 模糊地带`,
        desc: "Machine speed 含义 + 实测数据 + guardrails",
      },
    ],
  },

  // ============ L2 methodology ============
  'acceptance-criteria': {
    examples: [
      {
        code: `# Acceptance Criteria: spec 的机器可验证版本
## User Story: 作为用户，我想重置密码，以便忘记密码时能恢复账号

# 验收标准（每条都是可测的）：
- [ ] 点击"忘记密码"链接，5 秒内跳转到 /reset
- [ ] 输入邮箱，60 秒内收到重置邮件
- [ ] 重置链接 24h 后失效
- [ ] 重置后，旧 session 全部失效
- [ ] npx tsc --noEmit 通过
- [ ] 3 个 e2e 测试覆盖（点击、邮件、失效）

# 非目标（明确不做）：
- 不做短信验证码
- 不做多因素认证`,
        desc: "Acceptance Criteria 完整样例",
      },
    ],
  },

  'tdd-ai': {
    examples: [
      {
        code: `# TDD with AI: 测试先于代码
# 1. 写失败的测试（spec 形式）
def test_calculate_discount():
    assert calculate_discount(100, "regular") == 100
    assert calculate_discount(100, "gold") == 80

# 2. 跑测试：FAIL（AI 还没写实现）
$ pytest test_discount.py
# FAILED test_discount.py::test_calculate_discount - NameError

# 3. prompt AI:
# "实现 calculate_discount(price, tier):
#  - regular: 无折扣
#  - silver: 10%
#  - gold: 20%
#  - platinum: 30%
#  通过 test_calculate_discount 中的测试"

# 4. AI 写代码 → 重跑测试 → PASS`,
        desc: "TDD with AI 工作流",
      },
    ],
  },

  'auto-memory': {
    examples: [
      {
        code: `# Claude Code Auto Memory: 跨 session 持久化
# ~/.claude/memory/CLAUDE.md 跨会话保留
# 项目级：.claude/memory/

# 自动记忆的内容：
# - 用户偏好（"always use 2-space indent"）
# - 项目约定（"API errors return RFC 7807"）
# - 关键决策（"chose Postgres over MongoDB for JSONB"）

# 触发：每个 session 末尾自动 append
# 加载：每个 session 开始时自动 prepend`,
        desc: "Claude Code auto memory 用法",
      },
    ],
  },

  commands: {
    examples: [
      {
        code: `# Claude Code Custom Commands: 把常用 prompt 模板化
# .claude/commands/test.md:
"""
跑以下测试并报告：
- pytest tests/ -v
- npx vitest run
- coverage < 80% 时列出未覆盖文件

只报告失败项，不要解释成功项。
"""

# 用法：在 Claude Code 中输入 /test
# 自动执行上面的 prompt

# 类似 /deploy, /review-pr, /refactor`,
        desc: "Claude Code custom commands 模板",
      },
    ],
  },

  // ============ L3 technical core ============
  'context-window': {
    examples: [
      {
        code: `# Context Window: LLM 一次能"看"多少 token
# 2026 标准：
# - Claude Opus 4.6: 1M tokens (~750K 英文单词)
# - Gemini 2.5 Pro: 2M tokens
# - GPT-4o: 128K (默认)

# 1 token ≈ 0.75 英文单词 ≈ 1.5 中文字符
# 1M tokens ≈:
# - 750K 英文单词 (~3000 页)
# - 50 万汉字

# 应用：
# - 长文档 RAG（chunk + 检索 + 注入）
# - 全 codebase 分析（claude --add-dir + context）
# - 长对话（自动 compaction）`,
        desc: "Context window 实测数据 + 实际应用",
      },
    ],
  },

  'tool-use': {
    examples: [
      {
        code: `# Tool Use: LLM 调外部 API 的协议
# Anthropic 标准：
messages = client.messages.create(
    model="claude-sonnet-4-5",
    tools=[
        {
            "name": "get_weather",
            "description": "Get current weather for a city. Use when user asks about weather.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "city": {"type": "string"},
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
                },
                "required": ["city"]
            }
        }
    ],
    messages=[{"role": "user", "content": "What's the weather in Tokyo?"}]
)

# Claude 决定是否调用、调用哪个、用什么参数
# response.stop_reason == "tool_use" → 处理调用`,
        desc: "Anthropic tool use 标准用法",
      },
    ],
  },

  subagent: {
    examples: [
      {
        code: `# Claude Code Subagent: 隔离 context 的子 agent
# .claude/agents/security-reviewer.md:
---
name: security-reviewer
description: Reviews code for security vulnerabilities. Use proactively after code changes.
tools: Read, Grep, Glob
---

You are a security reviewer. When invoked:
1. Scan changed files for OWASP Top Top
2. Check for: SQL injection, XSS, hardcoded secrets, eval()
3. Output findings as: file:line + severity + fix
4. DO NOT modify files — only report
---

# 用法：
$ claude "review recent changes for security"
# Claude 自动调用 security-reviewer subagent`,
        desc: "Claude Code subagent 配置",
      },
    ],
  },

  // ============ L7 prompt patterns ============
  'self-consistency': {
    examples: [
      {
        code: `# Self-Consistency: 多次采样 + 多数投票
# 单次 LLM 输出可能错，投票降低随机性

from collections import Counter

def self_consistent_answer(prompt, model, n_samples=5):
    answers = [model.generate(prompt, temperature=0.7) for _ in range(n_samples)]
    # 多数投票
    most_common = Counter(answers).most_common(1)[0][0]
    return most_common

# 适用：
# - 数学推理（GSM8K +17.9%）
# - 常识推理
# - 代码生成（同一问题多种实现）

# 代价：n x 推理成本`,
        desc: "Self-consistency 投票机制",
      },
    ],
  },

  'tree-of-thought': {
    examples: [
      {
        code: `# Tree of Thought: 树状探索多路径
# vs Chain-of-Thought: 单链推理
# ToT: 多链 + 评估 + 选择 + 回溯

class TreeOfThought:
    def solve(self, problem):
        # 1. 生成多个候选步骤
        thoughts = self.generate_thoughts(problem, n=3)
        # 2. 评估每个候选
        scores = [self.evaluate(t) for t in thoughts]
        # 3. 选 top-k 继续展开
        best = sorted(zip(thoughts, scores), key=lambda x: -x[1])[:2]
        # 4. 递归直到到达目标
        if self.is_goal(best):
            return best[0][0]
        return self.solve(self.advance(best))

# 适用：Game of 24 / 创意写作 / 复杂规划
# 代价：n^k 指数复杂度`,
        desc: "Tree of Thought 算法骨架",
      },
    ],
  },

  // ============ L5 quality ============
  'yolo-mode': {
    examples: [
      {
        code: `# YOLO Mode: deploy and pray
# 适用场景：
# ✓ 一次性原型
# ✓ 个人工具
# ✓ 内部 demo（接受 1 周内回滚）
# ✗ 生产
# ✗ 涉及金钱/医疗/法律

# Claude Code /auto mode = YOLO 默认
# 但保留：
# - 5 秒延迟才执行破坏性命令
# - git commit 自动 backup

# 反例（YOLO 不适用）：
# - 在线支付系统
# - 医疗数据处理
# - 多用户协作平台`,
        desc: "YOLO mode 适用 vs 不适用场景",
      },
    ],
  },
};

const added = applyEnrich(ENRICH);
console.log(`[enrich-priority-15] Added: ${added.examples} examples, ${added.seeAlso} seeAlso, ${added.quotes} quotes across ${added.terms} terms`);