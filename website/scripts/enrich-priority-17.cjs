// Wave 5a — Tier 1+2 (10 terms): Claude Code internals + ML model/quantization
// Strategy: full content (examples + quotes + seeAlso) for all 10 terms
const { applyEnrich } = require('./lib/enrich-lib.cjs');

const ENRICH = {
  // ============ Tier 1: Claude Code 内部词 ============
  'checkpoint': {
    examples: [
      {
        code: `# Claude Code Checkpoint: agent 状态快照
# 当 agent 执行长任务时，定期保存状态：
# - 已修改的文件列表
# - 当前 todo 进度
# - 关键决策历史

# 用法：
$ claude "Refactor the auth module"
# Claude 自动：
# 1. 创建初始 checkpoint
# 2. 每 5 步保存
# 3. 出错时回退到上一个 checkpoint
# 4. 完成后清理

# 手动触发：
# /checkpoint → 立即保存当前状态
# /rewind → 回退到上一个 checkpoint`,
        desc: "Claude Code checkpoint 工作流",
      },
    ],
    quotes: [
      {
        text: "Checkpoints let you rewind long-running agent tasks without losing progress.",
        cite: 'Claude Code Docs',
      },
    ],
    seeAlso: [
      { name: 'Claude Code: Checkpoints', url: 'https://docs.claude.com/en/docs/claude-code/checkpoints' },
    ],
  },

  'permission-mode': {
    examples: [
      {
        code: `# Claude Code Permission Mode: 控制 agent 权限
# 3 种模式：
# 1. default: 每次破坏性操作前 prompt
# 2. acceptEdits: 自动批准文件编辑（保留 prompt 给系统命令）
# 3. bypassPermissions: 全自动（仅 sandbox 内安全）

# 配置：~/.claude/settings.json 或 .claude/settings.local.json
{
  "permissions": {
    "mode": "acceptEdits",
    "allow": ["Bash(npm test)", "Read(**/*.ts)"],
    "deny": ["Bash(rm -rf *)"]
  }
}

# CLI flag:
$ claude --permission-mode bypassPermissions

# 团队规范：
# - 个人项目: default
# - 内部工具: acceptEdits
# - 生产: default + 严格 deny list`,
        desc: "Claude Code permission mode 3 种配置",
      },
    ],
    quotes: [
      {
        text: "Permission mode determines which tools Claude can invoke without confirmation.",
        cite: 'Claude Code Docs',
      },
    ],
    seeAlso: [
      { name: 'Claude Code: Permissions', url: 'https://docs.claude.com/en/docs/claude-code/permissions' },
    ],
  },

  'bare-mode': {
    examples: [
      {
        code: `# Claude Code Bare Mode: 极简配置模式
# 不加载任何 custom commands / hooks / agents
# 纯净 Claude Code 环境

# 用途：
# 1. 调试 — 排除 custom 配置干扰
# 2. 一致性 — 不同机器上相同行为
# 3. CI — 自动化环境

# CLI:
$ claude --bare

# 环境变量:
$ CLAUDE_CODE_BARE_MODE=1 claude

# vs default:
# - 没有 user-level commands/agents
# - 没有 hooks 触发
# - 只用 core Claude Code 功能
# - settings.json 只读 project-level`,
        desc: "Claude Code bare mode 调试/一致性场景",
      },
    ],
    quotes: [
      {
        text: "Bare mode: vanilla Claude Code without project customizations.",
        cite: 'Claude Code Docs',
      },
    ],
    seeAlso: [
      { name: 'Claude Code: Bare Mode', url: 'https://docs.claude.com/en/docs/claude-code/bare-mode' },
    ],
  },

  'output-style': {
    examples: [
      {
        code: `# Claude Code Output Style: 控制输出格式
# 4 种内置风格：
# - default: 标准格式（解释 + 代码）
# - explanatory: 详细教学风格（教学时用）
# - concise: 极简风格（节省 token）
# - structured: 结构化（表格 + 列表）

# CLI:
$ claude --output-style concise

# 团队规范示例：
{
  "output_style": "structured",
  "preferences": {
    "include_examples": true,
    "include_citations": true
  }
}

# 应用场景：
# - 学习: explanatory
# - 写代码: default
# - 大量生成: concise
# - 报告 / 文档: structured`,
        desc: "Claude Code 4 种 output style + 选择指南",
      },
    ],
    quotes: [
      {
        text: "Output style shapes how Claude communicates — verbose or terse, prose or tables.",
        cite: 'Claude Code Docs',
      },
    ],
    seeAlso: [
      { name: 'Claude Code: Output Styles', url: 'https://docs.claude.com/en/docs/claude-code/output-styles' },
    ],
  },

  // ============ Tier 2: 新模型 / 量化技术 ============
  'router-gating': {
    examples: [
      {
        code: `# Router/Gating: 动态选择 expert 或模型
# MoE 中的 gating network:
class Router(torch.nn.Module):
    def __init__(self, d_model, num_experts):
        super().__init__()
        self.gate = torch.nn.Linear(d_model, num_experts)

    def forward(self, x):
        logits = self.gate(x)
        # top-k routing
        top_k_vals, top_k_idx = logits.topk(2, dim=-1)
        return top_k_vals, top_k_idx

# 多模型 routing (e.g., 简单问题用小模型，复杂用大模型)
def route_query(query):
    if is_simple(query):
        return "gpt-4o-mini"      # 便宜
    elif is_moderate(query):
        return "claude-sonnet-4-5" # 中等
    else:
        return "claude-opus-4-6"   # 强但贵

# 实战：FrugalGPT / RouteLLM 等 router 模型`,
        desc: "Router/Gating 两种用法（MoE + 多模型）",
      },
    ],
    quotes: [
      {
        text: "Routing: route each query to the cheapest model that can handle it.",
        cite: 'FrugalGPT, 2023',
      },
    ],
    seeAlso: [
      { name: 'FrugalGPT 论文', url: 'https://arxiv.org/abs/2305.05176' },
      { name: 'Switch Transformer', url: 'https://arxiv.org/abs/2101.03961' },
    ],
  },

  alibi: {
    examples: [
      {
        code: `# ALiBi: Attention with Linear Biases
# 替代 rope/absolute position encoding
# 原理：给 attention score 加线性距离 bias

import torch
import torch.nn.functional as F

def alibi_attention(Q, K, alibi_bias):
    # Q, K: (batch, heads, seq, d_k)
    # alibi_bias: (batch, heads, seq, seq) — 预计算
    scores = (Q @ K.transpose(-2, -1)) / (Q.size(-1) ** 0.5)
    scores = scores + alibi_bias   # 加线性 bias
    return F.softmax(scores, dim=-1)

# 生成 alibi bias
def get_alibi_bias(n_heads, seq_len):
    slopes = torch.tensor([2 ** -((i + 1) * 8 / n_heads) for i in range(n_heads)])
    # distance matrix
    pos = torch.arange(seq_len)
    distance = (pos.unsqueeze(0) - pos.unsqueeze(1)).abs().float()  # (seq, seq)
    alibi = -slopes.view(-1, 1, 1) * distance.view(1, seq_len, seq_len)
    return alibi.unsqueeze(0)   # (1, heads, seq, seq)

# 优势：
# - 无需训练位置参数（省参数）
# - 天然支持更长 context（外推性好）
# - 计算便宜`,
        desc: "ALiBi 注意力 bias PyTorch 实现",
      },
    ],
    quotes: [
      {
        text: "ALiBi: a simple, parameter-free positional encoding with strong length extrapolation.",
        cite: 'Press et al. 2022',
      },
    ],
    seeAlso: [
      { name: 'ALiBi 论文 (Press et al. 2022)', url: 'https://arxiv.org/abs/2108.12409' },
    ],
  },

  awq: {
    examples: [
      {
        code: `# AWQ: Activation-aware Weight Quantization
# 关键洞察：不是所有 weight 都同等重要
# 1% salient weights → 保留高精度 (FP16)
# 99% 其他 → INT4

# 安装:
$ pip install autoawq

from awq import AutoAWQForCausalLM
from transformers import AutoTokenizer

model_path = "Qwen/Qwen2.5-7B-Instruct"
quant_path = "qwen2.5-7b-awq-4bit"

# 量化
model = AutoAWQForCausalLM.from_pretrained(model_path)
tokenizer = AutoTokenizer.from_pretrained(model_path)
quant_config = { "zero_point": True, "q_group_size": 128, "w_bit": 4 }
model.quantize(tokenizer, quant_config=quant_config)
model.save_quantized(quant_path)

# 加载量化模型
from awq import AutoAWQForCausalLM
model = AutoAWQForCausalLM.from_quantized(quant_path)

# 优势：
# - 4-bit 推理速度接近 FP16
# - 质量损失最小（vs GPTQ）
# - 适合 LLM 服务部署`,
        desc: "AWQ 4-bit 量化完整 pipeline",
      },
    ],
    quotes: [
      {
        text: "AWQ: 4-bit quantization that preserves quality by protecting salient weights.",
        cite: 'Lin et al. 2023',
      },
    ],
    seeAlso: [
      { name: 'AWQ 论文', url: 'https://arxiv.org/abs/2306.00978' },
      { name: 'AutoAWQ GitHub', url: 'https://github.com/casper-hansen/AutoAWQ' },
    ],
  },

  gptq: {
    examples: [
      {
        code: `# GPTQ: GPT 风格的训练后量化
# 逐层量化：每层最小化重建误差
# 一次性量化整个模型

# 安装:
$ pip install auto-gptq

from auto_gptq import AutoGPTQForCausalLM, BaseQuantizeConfig

model_path = "meta-llama/Llama-3-8B"
quant_path = "llama-3-8b-gptq-4bit"

# 量化
quantize_config = BaseQuantizeConfig(
    bits=4,
    group_size=128,
    desc_act=True,       # activation-aware
)

model = AutoGPTQForCausalLM.from_pretrained(model_path, quantize_config)
tokenizer = AutoTokenizer.from_pretrained(model_path)

# 校准（用 128 个样本）
examples = [...]   # 代表性数据集
model.quantize(examples, batch_size=1, use_triton=False)

model.save_quantized(quant_path)

# 推理：
from auto_gptq import AutoGPTQForCausalLM
model = AutoGPTQForCausalLM.from_quantized(quant_path, device="cuda:0")`,
        desc: "GPTQ 4-bit 量化 + 校准",
      },
    ],
    quotes: [
      {
        text: "GPTQ: O(N) layer-wise quantization using second-order information.",
        cite: 'Frantar et al. 2022',
      },
    ],
    seeAlso: [
      { name: 'GPTQ 论文 (Frantar et al. 2022)', url: 'https://arxiv.org/abs/2210.17323' },
      { name: 'AutoGPTQ GitHub', url: 'https://github.com/AutoGPTQ/AutoGPTQ' },
    ],
  },

  'frontier-model': {
    examples: [
      {
        code: `# Frontier Model: 最先进的 LLM
# 2026 frontier 模型列表：

frontier_models = {
    "Anthropic": [
        {"name": "Claude Opus 4.6", "context": "1M", "strength": "reasoning + coding"},
        {"name": "Claude Sonnet 4.5", "context": "1M", "strength": "balanced"},
    ],
    "OpenAI": [
        {"name": "GPT-5", "context": "256K", "strength": "multimodal"},
        {"name": "GPT-4o", "context": "128K", "strength": "speed"},
    ],
    "Google": [
        {"name": "Gemini 2.5 Pro", "context": "2M", "strength": "long context"},
    ],
    "Meta": [
        {"name": "Llama 4 405B", "context": "128K", "strength": "open source"},
    ],
    "DeepSeek": [
        {"name": "DeepSeek V3", "context": "64K", "strength": "cost efficiency"},
    ],
}

# 选择 frontier model 考虑：
# 1. 任务类型 (code / chat / multimodal)
# 2. context 长度需求
# 3. cost (input/output tokens)
# 4. 速度 (latency)
# 5. 数据 residency (cloud vs self-hosted)`,
        desc: "Frontier model 选择决策树 + 2026 列表",
      },
    ],
    quotes: [
      {
        text: "Frontier model: the most capable AI system at the time, often with broad capabilities.",
        cite: 'Stanford CRFM',
      },
    ],
    seeAlso: [
      { name: 'Stanford CRFM: Frontier Model Definition', url: 'https://crfm.stanford.edu' },
      { name: 'Anthropic Models', url: 'https://docs.anthropic.com/en/docs/about-claude/models' },
    ],
  },

  'code-model': {
    examples: [
      {
        code: `# Code Model: 专门为代码训练/微调的 LLM
# 优势 vs general LLM：
# - FIM (fill-in-middle) 能力强
# - 多语言代码理解
# - repository-level context (SWE-bench)

# 2026 code models:
code_models = {
    "OpenAI": ["GPT-5-Codex", "codex-cli"],
    "Anthropic": ["Claude Sonnet 4.5 (code专用系统提示)"],
    "DeepSeek": ["DeepSeek-Coder-V2"],
    "Qwen": ["Qwen2.5-Coder-32B-Instruct"],
    "Mistral": ["Codestral 22B"],
    "Meta": ["Code Llama 70B"],
}

# 评测基准：
# - HumanEval: 164 Python problems
# - MBPP: 1k Python problems
# - SWE-bench: 真实 GitHub issue 修复
# - LiveCodeBench: 竞赛级编程

# 实测 leader (2026):
# 1. Claude Sonnet 4.5: SWE-bench 60%+
# 2. GPT-5-Codex: SWE-bench 55%+
# 3. Qwen2.5-Coder: HumanEval 90%+`,
        desc: "Code model 评测 + 2026 leaderboard",
      },
    ],
    quotes: [
      {
        text: "Code models: specialized LLMs trained on code repositories. Outperform general models on programming tasks.",
        cite: 'community',
      },
    ],
    seeAlso: [
      { name: 'Qwen2.5-Coder', url: 'https://qwenlm.github.io/blog/qwen2.5-coder-family/' },
      { name: 'SWE-bench Leaderboard', url: 'https://www.swebench.com' },
    ],
  },
};

const added = applyEnrich(ENRICH);
console.log(`[enrich-priority-17] Added: ${added.examples} examples, ${added.seeAlso} seeAlso, ${added.quotes} quotes across ${added.terms} terms`);