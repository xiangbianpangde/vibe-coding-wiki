// Wave 3h — L5 quality governance (12 empty terms) + a few L4/L3
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const ENRICH = {
  // ============ L5 质量治理（最大空白）============
  'test-referee': {
    examples: [
      {
        code: `# Test Suite as Referee: 测试套件做裁判
# 1. 写测试（spec 的机器可读版本）
def test_login():
    user = User.create(email="alice@example.com")
    assert user.login("password123") is True
    assert user.login("wrong") is False

# 2. 跑测试
$ pytest -v
# tests/test_auth.py::test_login PASSED

# 3. 任何 PR 必须通过全套测试
# → 失败 = AI 必须 revert 或修复
# → 通过 = 但还不一定对（还要 review）`,
        desc: "Test suite as referee 标准流程",
      },
    ],
    quotes: [
      {
        text: "The test suite acts as a referee: mechanical, repeatable, no ambiguity.",
        cite: 'community',
      },
    ],
    seeAlso: [
      { name: 'Martin Fowler: TDD', url: 'https://martinfowler.com/bliki/TestDrivenDevelopment.html' },
      { name: 'Kent Beck: TDD by Example', url: 'https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530' },
    ],
  },

  'safety-net-testing': {
    examples: [
      {
        code: `# Safety Net Testing: 让 AI 修改安全的兜底
# 覆盖目标：≥ 80%

# 1. 关键路径 100% 覆盖
- auth/login
- payment/checkout
- data/migration

# 2. 边界条件
- null/empty inputs
- 最大值/最小值
- 错误码

# 3. 回归测试
- 历史 bug 必须有测试

# 测不到的代码 = AI 改时无兜底 = 易回归`,
        desc: "Safety net testing 策略",
      },
    ],
    quotes: [
      {
        text: "A safety net catches you when your code falls. Tests are the safety net for AI.",
        cite: 'Robert C. Martin',
      },
    ],
    seeAlso: [
      { name: 'Working Effectively with Legacy Code', url: 'https://www.amazon.com/Working-Effectively-Legacy-Michael-Feathers/dp/0131177052' },
    ],
  },

  'diff-review': {
    examples: [
      {
        code: `# Diff Review: AI 生成代码的逐行审核
# AI 修改 PR → 人类 review diff

$ gh pr checkout 42
$ git diff main..HEAD
# 审 PR diff 的关键问题：
# 1. 是否符合 spec.md？
# 2. 测试覆盖？
# 3. 安全漏洞？
# 4. 性能 regression？
# 5. 命名/风格一致？

# 关键：不要"信任 PR" — 每一行都要看`,
        desc: "Diff review checklist",
      },
    ],
    quotes: [
      {
        text: "Trust no PR. Review every diff line.",
        cite: 'community',
      },
    ],
    seeAlso: [
      { name: 'GitHub Pull Request 文档', url: 'https://docs.github.com/en/pull-requests' },
    ],
  },

  'code-review': {
    examples: [
      {
        code: `# Code Review: AI 生成代码的多人 review
# 1. AI 生成 PR
# 2. 至少 1 个工程师 review（最好 2 个）
# 3. 用 CODEOWNERS 文件指定 reviewer
# 4. CI 通过 + review approve 才能 merge

# CODEOWNERS 示例：
# /src/auth/      @security-team
# /src/payments/  @payments-team
# *.go            @go-experts`,
        desc: "Code review with AI + humans",
      },
    ],
    quotes: [
      {
        text: "Code review is the human-in-the-loop check on AI-generated code.",
        cite: 'community',
      },
    ],
    seeAlso: [
      { name: 'GitHub CODEOWNERS', url: 'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-rules/customizing-your-repository/about-code-owners' },
    ],
  },

  'yolo-mode': {
    quotes: [
      {
        text: "YOLO mode: deploy and pray. Use only for prototypes.",
        cite: 'community',
      },
    ],
    seeAlso: [
      { name: 'Claude Code: Auto mode', url: 'https://docs.claude.com/en/docs/claude-code/auto-mode' },
    ],
  },

  'responsible-vc': {
    quotes: [
      {
        text: "It is absolutely possible to do vibe coding responsibly. The opposite of YOLO is not 'no agent'—it is engaged review.",
        cite: 'community',
      },
    ],
    seeAlso: [
      { name: 'Simon Willison: Vibe Coding tags', url: 'https://simonwillison.net/tags/vibe-coding/' },
    ],
  },

  'failure-mode': {
    examples: [
      {
        code: `# Failure Mode Analysis: 列出 AI 可能的失败模式
# 1. 幻觉：模型编造不存在的 API
# 2. 误删：rm -rf 误删关键文件
# 3. 误改：改了不相关的代码
# 4. 性能 regression：引入 O(n²) 算法
# 5. 安全漏洞：注入 SQL/XSS
# 6. 测试跳过：AI 加了 skip 标记绕过测试

# 对每个 mode 设计 guardrail：
# - 幻觉：强类型检查 + 编译错误
# - 误删：pre-commit hook 拦截 rm -rf
# - 安全：Semgrep / Snyk 自动扫描`,
        desc: "AI coding 常见 failure modes + guardrails",
      },
    ],
    quotes: [
      {
        text: "Every failure mode needs a guardrail.",
        cite: 'nazarboyko.com',
      },
    ],
    seeAlso: [
      { name: 'Anthropic: Building effective agents', url: 'https://www.anthropic.com/research/building-effective-agents' },
    ],
  },

  'spec-driven-prompting': {
    examples: [
      {
        code: `# Spec-Driven Prompting: 把 spec.md 作为 prompt
# 1. 写 spec.md（含验收标准）
# 2. 启动 Claude Code：claude
# 3. prompt: "请按 spec.md 实现 auth 模块"
// Claude 读 spec.md → 生成代码 → 跑测试

# 关键：spec 写得越精确，AI 输出越好
# 反例：prompt = "写个登录页"
# 正例：prompt = "按 spec.md 第 3 节实现 OAuth"`,
        desc: "Spec-driven prompting 工作流",
      },
    ],
    quotes: [
      {
        text: "Spec-driven prompting: let the spec be the prompt.",
        cite: 'community',
      },
    ],
    seeAlso: [
      { name: 'GitHub Spec Kit', url: 'https://github.github.io/spec-kit/' },
    ],
  },

  'manifest-file': {
    examples: [
      {
        code: `# Manifest File: AI 项目的元数据描述
# package.json (Node) / pyproject.toml (Python) / Cargo.toml (Rust)

{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "@anthropic-ai/sdk": "^0.20.0",
    "next": "^14.0.0"
  },
  "scripts": {
    "test": "vitest run",
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  }
}

# AI 生成代码时必须：
# - 更新 manifest 添加新依赖
# - 跑 manifest 的 test/lint/type-check 命令
# - 检查 manifest 是否冲突`,
        desc: "Manifest file 在 AI 项目中的作用",
      },
    ],
    seeAlso: [
      { name: 'npm package.json 文档', url: 'https://docs.npmjs.com/cli/v10/configuring-npm/package-json' },
    ],
  },

  'auto-mode-safety': {
    quotes: [
      {
        text: "The classifier never sees tool results, so injected instructions cannot influence its decisions.",
        cite: 'Claude Code Docs',
      },
    ],
    seeAlso: [
      { name: 'Claude Code: Auto Mode Safety', url: 'https://docs.claude.com/en/docs/claude-code/auto-mode-safety' },
    ],
  },

  'managed-settings': {
    examples: [
      {
        code: `# Managed Settings: 团队 / 企业的 Claude Code 配置
# ~/.claude/settings.json (user-level)
# .claude/settings.json (project-level)
# .claude/settings.local.json (local, gitignored)

{
  "permissions": {
    "allow": ["Bash(npm test)", "Read(**/*.ts)"],
    "deny": ["Bash(rm -rf *)", "Bash(curl *)"]
  },
  "model": "claude-sonnet-4-5",
  "autoMode": "safe"
}

# Managed: IT 团队用 MDM 推到所有机器`,
        desc: "Claude Code managed settings 配置",
      },
    ],
    seeAlso: [
      { name: 'Claude Code: Settings', url: 'https://docs.claude.com/en/docs/claude-code/settings' },
    ],
  },

  // ============ L7 补充 ============
  'safety-net': {
    examples: [
      {
        code: `# Safety Net for AI changes: 测试套件
# 关键路径必须 100% 覆盖：
# - auth (登录/权限)
# - payment (支付)
# - data migration (数据迁移)

# coverage 工具：
$ pytest --cov=src --cov-report=html
# src/auth.py        100%
# src/payment.py      98%
# src/utils.py        62%
# TOTAL                85%  ← < 80% 时 PR 拒绝`,
        desc: "Safety net 覆盖策略",
      },
    ],
    quotes: [
      {
        text: "Without a safety net, every AI change is a leap of faith.",
        cite: 'Robert C. Martin',
      },
    ],
    seeAlso: [
      { name: 'Working Effectively with Legacy Code', url: 'https://www.amazon.com/Working-Effectively-Legacy-Michael-Feathers/dp/0131177052' },
    ],
  },
};

// Apply
const layers = ['L1','L2','L3','L4','L5','L6','L7','L8'];
let added = { examples: 0, seeAlso: 0, quotes: 0, terms: 0 };

for (const l of layers) {
  const fp = path.join(DATA_DIR, `terms-${l}.json`);
  const items = JSON.parse(fs.readFileSync(fp, 'utf8'));
  let fileModified = false;
  for (const item of items) {
    const e = ENRICH[item.id];
    if (!e) continue;
    let termChanged = false;
    if (e.examples) {
      const existing = Array.isArray(item.examples) ? item.examples : [];
      const newOnes = e.examples.filter(n => !existing.some(x => x.code === n.code));
      if (newOnes.length) { item.examples = [...existing, ...newOnes]; added.examples += newOnes.length; termChanged = true; }
    }
    if (e.seeAlso) {
      const existing = Array.isArray(item.seeAlso) ? item.seeAlso : [];
      const newOnes = e.seeAlso.filter(n => !existing.some(x => x.url === n.url));
      if (newOnes.length) { item.seeAlso = [...existing, ...newOnes]; added.seeAlso += newOnes.length; termChanged = true; }
    }
    if (e.quotes) {
      const existing = Array.isArray(item.quotes) ? item.quotes : [];
      const newOnes = e.quotes.filter(n => !existing.some(x => x.text === n.text));
      if (newOnes.length) { item.quotes = [...existing, ...newOnes]; added.quotes += newOnes.length; termChanged = true; }
    }
    if (termChanged) { added.terms++; fileModified = true; }
  }
  if (fileModified) fs.writeFileSync(fp, JSON.stringify(items, null, 2));
}

console.log(`[enrich-priority-10] Added: ${added.examples} examples, ${added.seeAlso} seeAlso, ${added.quotes} quotes across ${added.terms} terms`);
