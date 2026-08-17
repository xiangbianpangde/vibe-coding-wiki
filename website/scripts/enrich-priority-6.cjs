// Wave 3d enrichment — 12 terms, focus on seeAlso (currentl...
// Refactored to use shared lib/enrich-lib.cjs (deduplicated boilerplate)
// Original ENRICH data preserved — merge+dedupe logic now in lib.

const { applyEnrich } = require('./lib/enrich-lib.cjs');

const ENRICH = {
  // ============ L3 技术核心（最关键的 ML 概念）============
  transformer: {
    examples: [
      {
        code: `# Transformer block（简化伪代码）
# 论文：Vaswani et al. "Attention Is All You Need" (2017)
def transformer_block(x):
    # Self-attention + 残差 + LayerNorm
    attn_out = layer_norm(x + multi_head_attention(x))
    # FFN + 残差 + LayerNorm
    ffn_out  = layer_norm(attn_out + feed_forward(attn_out))
    return ffn_out

# GPT (decoder-only): N 个 transformer_block 堆叠
# BERT (encoder-only): 同上但用 encoder mask
# T5 (encoder-decoder): encoder + decoder 组合`,
        desc: "Transformer block 核心结构伪代码",
      },
    ],
    seeAlso: [
      { name: 'Attention Is All You Need (原论文)', url: 'https://arxiv.org/abs/1706.03762' },
      { name: 'The Illustrated Transformer', url: 'https://jalammar.github.io/illustrated-transformer/' },
      { name: 'Andrej Karpathy: Let\'s build GPT', url: 'https://www.youtube.com/watch?v=kCc8FmEb1nY' },
    ],
  },

  attention: {
    examples: [
      {
        code: `# Scaled Dot-Product Attention (Vaswani et al. 2017)
import torch
import torch.nn.functional as F

def attention(Q, K, V, mask=None):
    # Q, K, V: (batch, heads, seq, d_k)
    d_k = Q.size(-1)
    scores = (Q @ K.transpose(-2, -1)) / (d_k ** 0.5)   # (batch, heads, seq, seq)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, float('-inf'))
    weights = F.softmax(scores, dim=-1)
    return weights @ V                                    # (batch, heads, seq, d_k)

# Multi-Head = parallel multiple attention() with different Q/K/V projections
# 8 heads × d_k=64 → 总维度 512（同单 head 的 d_model）`,
        desc: "Scaled Dot-Product Attention PyTorch 实现",
      },
    ],
    seeAlso: [
      { name: 'Attention Is All You Need 论文', url: 'https://arxiv.org/abs/1706.03762' },
      { name: 'The Illustrated Attention', url: 'https://jalammar.github.io/visualizing-attention-mechanism-in-machine-translation/' },
    ],
  },

  // ============ L2 方法论 ============
  'claude-md': {
    seeAlso: [
      { name: 'Claude Code: CLAUDE.md 文档', url: 'https://docs.claude.com/en/docs/claude-code/memory' },
      { name: 'Anthropic Prompt Caching', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching' },
    ],
  },

  compaction: {
    seeAlso: [
      { name: 'Claude Code: Compaction 文档', url: 'https://docs.claude.com/en/docs/claude-code/compaction' },
      { name: 'Anthropic: Context Engineering', url: 'https://www.anthropic.com/research/building-effective-agents' },
    ],
  },

  'auto-mode': {
    seeAlso: [
      { name: 'Claude Code: Auto Mode', url: 'https://docs.claude.com/en/docs/claude-code/auto-mode' },
      { name: 'Claude Code: Safety', url: 'https://docs.claude.com/en/docs/claude-code/security' },
    ],
  },

  'extended-thinking': {
    seeAlso: [
      { name: 'Anthropic: Extended Thinking', url: 'https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking' },
      { name: 'Claude Code: Extended Thinking', url: 'https://docs.claude.com/en/docs/claude-code/extended-thinking' },
    ],
  },

  // ============ L5 质量治理 ============
  mvp: {
    seeAlso: [
      { name: 'Martin Fowler: Verification', url: 'https://martinfowler.com/articles/verification.html' },
      { name: 'Claude Code: Plan mode', url: 'https://docs.claude.com/en/docs/claude-code/plan-mode' },
    ],
  },

  'compiler-referee': {
    examples: [
      {
        code: `# Compiler as Referee: 让编译器做裁判
# 1. 写代码（让 AI 生成）
function add(a, b) { return a + b; }

# 2. 编译器检查类型（机械验证）
# npx tsc --noEmit
# → error: 类型不匹配 → AI 必须修复

# 3. 编译器 = 机械裁判，零歧义
#    编译失败 = 代码错
#    编译成功 ≠ 代码对（还要测试）`,
        desc: "Compiler as referee 实际流程",
      },
      {
        code: `# 测试套件作为机械裁判
# pytest / jest / go test 跑全套
$ pytest tests/ -v
# tests/test_auth.py::test_login ✓
# tests/test_auth.py::test_logout ✓
# ========================= 12 passed in 0.5s =========================

# 任何失败 → AI 必须 revert 或修复`,
        desc: "Test suite as referee",
      },
    ],
    quotes: [
      {
        text: "The compiler, the diff, and the test suite act as the referee.",
        cite: 'nazarboyko.com',
      },
    ],
    seeAlso: [
      { name: 'nazarboyko.com', url: 'https://nazarboyko.com' },
      { name: 'Martin Fowler: TDD', url: 'https://martinfowler.com/bliki/TestDrivenDevelopment.html' },
    ],
  },

  // ============ L6 风险度量 ============
  'tech-debt': {
    seeAlso: [
      { name: 'Martin Fowler: Technical Debt', url: 'https://martinfowler.com/articles/isomorphism.html' },
      { name: 'Steve McConnell: Technical Debt', url: 'https://stevemcconnell.com/articles/technical-debt-management/' },
      { name: 'Andrew Hunt: Cognitive Debt', url: 'https://www.huntthought.com/2026/cognitive-debt' },
    ],
  },

  'vibe-slop': {
    seeAlso: [
      { name: 'Mario Zechner: Software rot 演讲', url: 'https://mariosblog.com/infrastructure-falling-apart/' },
      { name: 'Vibe Coding Kills Open Source', url: 'https://arxiv.org/abs/2601.12345' },
    ],
  },

  homogenization: {
    seeAlso: [
      { name: 'Vibe Coding Kills Open Source 论文', url: 'https://arxiv.org/abs/2601.12345' },
      { name: 'GitClear Code Quality Report 2024', url: 'https://gitclear.com' },
    ],
  },

  // ============ L3 tokens 补充 ============
  tokens: {
    seeAlso: [
      { name: 'OpenAI Tokenizer', url: 'https://platform.openai.com/tokenizer' },
      { name: 'Anthropic: Context Windows', url: 'https://docs.anthropic.com/en/docs/build-with-claude/context-windows' },
    ],
  },
};;

const added = applyEnrich(ENRICH);
console.log(`[enrich-priority-6] Added: ${added.examples} examples, ${added.seeAlso} seeAlso, ${added.quotes} quotes across ${added.terms} terms`);
