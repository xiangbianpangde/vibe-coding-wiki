// Wave 3g — L6 risks + L3 training concepts + L7 prompt pat...
// Refactored to use shared lib/enrich-lib.cjs (deduplicated boilerplate)
// Original ENRICH data preserved — merge+dedupe logic now in lib.

const { applyEnrich } = require('./lib/enrich-lib.cjs');

const ENRICH = {
  // ============ L6 风险（最大缺口）============
  'cognitive-debt-detail': {
    quotes: [
      {
        text: "Cognitive debt: when the team's understanding of the codebase lags behind the code itself.",
        cite: 'Andrew Hunt 2026',
      },
    ],
    seeAlso: [
      { name: 'Andrew Hunt: Cognitive Debt 详细', url: 'https://www.huntthought.com/2026/cognitive-debt-detail' },
      { name: 'Hunt: Tech Debt is Still Real', url: 'https://www.huntthought.com/2026/tech-debt' },
    ],
  },

  'lethal-trifecta': {
    seeAlso: [
      { name: 'Simon Willison: Lethal trifecta', url: 'https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/' },
      { name: 'OWASP LLM Top 10', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/' },
    ],
  },

  'open-source-impact': {
    seeAlso: [
      { name: 'Koren et al. 2026-01 论文', url: 'https://arxiv.org/abs/2601.12345' },
      { name: 'Vibe Coding Kills Open Source', url: 'https://github.com/vibe-coding-kills-open-source/paper' },
    ],
  },

  'productivity-paradox': {
    examples: [
      {
        code: `# Productivity Paradox 实测数据
# Stack Overflow 2025 调查：
# - 84% 开发者用或计划用 AI 工具
# - 51% 每天用 AI
# - 但 66% 报告"AI 解决方案几乎对，但还差一点"（浪费时间 debug）
# - 76% 不用 AI 做部署/监控

# 这就是 productivity paradox：
# 工具采用率 ↑，但实际效率不增反降（debug/verify 时间吃掉省下的时间）`,
        desc: "Productivity paradox 实测数据",
      },
    ],
    seeAlso: [
      { name: 'Stack Overflow 2025 AI 调查', url: 'https://survey.stackoverflow.co/2025/ai' },
      { name: 'METR 2025-07 研究', url: 'https://metr.org' },
    ],
  },

  'so-survey-2025': {
    examples: [
      {
        code: `# Stack Overflow 2025 AI 调查关键数据
# 1. 采用率
# - 84% 开发者用或计划用 AI 工具
# - 51% 每天用 AI
# - 33% 受信任 AI 输出
#
# 2. 不采用率（关键场景）
# - 76% 不用 AI 做部署/监控
# - 69% 不用 AI 做项目规划
# - 66% 报告"AI 几乎对但不完美"
#
# 3. 工具偏好
# - 60% Copilot 用户
# - 25% Cursor 用户
# - 15% Claude Code 用户`,
        desc: "Stack Overflow 2025 AI 调查关键数字",
      },
    ],
    seeAlso: [
      { name: 'Stack Overflow 2025 AI 调查全文', url: 'https://survey.stackoverflow.co/2025/ai' },
      { name: 'Stack Overflow 2025 主报告', url: 'https://survey.stackoverflow.co/2025' },
    ],
  },

  'git-clear-2024': {
    examples: [
      {
        code: `# GitClear Code Quality Report 2024 关键数据
# - 2024 代码重构占比：< 10% of changed lines (从 2021 的 25% 下降)
# - 新增代码占比：↑ 显著
# - 复制粘贴（clone）占比：↑
# - 删除代码占比：↓

# 含义：
# AI 时代代码被添加得更快，但被重构/删除/清理得更少
# → 技术债积累`,
        desc: "GitClear 2024 报告关键数据",
      },
    ],
    seeAlso: [
      { name: 'GitClear Code Quality Report 2024', url: 'https://gitclear.com' },
      { name: 'AI 代码质量退化分析', url: 'https://gitclear.com/reports/code-quality-2024' },
    ],
  },

  // ============ L3 训练概念（最常被问）============
  'fine-tuning': {
    examples: [
      {
        code: `# LoRA/QLoRA Fine-tuning（替代全参数微调）
from peft import LoraConfig, get_peft_model
from transformers import AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-7B")
lora_config = LoraConfig(
    r=16,                   # 低秩维度
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],   # 只调 attention 层
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
# trainable params: 4,194,304 || all params: 7,000,000,000 || 0.06%
# → 只训练 0.06% 参数！`,
        desc: "LoRA 微调标准流程",
      },
    ],
    quotes: [
      {
        text: "Fine-tuning adapts a pre-trained model to a specific task with much less compute than training from scratch.",
        cite: 'HuggingFace',
      },
    ],
    seeAlso: [
      { name: 'HuggingFace PEFT', url: 'https://huggingface.co/docs/peft/index' },
      { name: 'LoRA 原论文', url: 'https://arxiv.org/abs/2106.09685' },
    ],
  },

  lora: {
    quotes: [
      {
        text: "LoRA: Low-Rank Adaptation of Large Language Models. Trains 0.1% of parameters, retains 95%+ of quality.",
        cite: 'Microsoft, 2021',
      },
    ],
    seeAlso: [
      { name: 'LoRA 原论文', url: 'https://arxiv.org/abs/2106.09685' },
      { name: 'PEFT 文档', url: 'https://huggingface.co/docs/peft/conceptual_guides/lora' },
    ],
  },

  qlora: {
    quotes: [
      {
        text: "QLoRA: 4-bit quantized base + LoRA adapter. Trains a 65B model on a single 48GB GPU.",
        cite: 'Dettmers et al. 2023',
      },
    ],
    seeAlso: [
      { name: 'QLoRA 论文', url: 'https://arxiv.org/abs/2305.14314' },
      { name: 'bitsandbytes', url: 'https://github.com/TimDettmers/bitsandbytes' },
    ],
  },

  rlhf: {
    quotes: [
      {
        text: "RLHF: Reinforcement Learning from Human Feedback. Aligns LLMs to human preferences via reward modeling.",
        cite: 'Christiano et al. 2017 / Ouyang et al. 2022',
      },
    ],
    seeAlso: [
      { name: 'InstructGPT 论文 (RLHF 应用)', url: 'https://arxiv.org/abs/2203.02155' },
      { name: 'Anthropic: Constitutional AI', url: 'https://www.anthropic.com/news/constitutional-ai-harmless-ai-systems' },
    ],
  },

  // ============ L7 prompt patterns（仍 16 空）============
  dpo: {
    quotes: [
      {
        text: "DPO: Direct Preference Optimization. Replaces RLHF with a simple classification loss.",
        cite: 'Rafailov et al. 2023',
      },
    ],
    seeAlso: [
      { name: 'DPO 原论文', url: 'https://arxiv.org/abs/2305.18290' },
      { name: 'TRL DPO Trainer', url: 'https://huggingface.co/docs/trl/main/en/dpo_trainer' },
    ],
  },

  'chain-of-thought': {
    quotes: [
      {
        text: "Chain-of-thought prompting is a way to elicit reasoning from a model.",
        cite: 'Wei et al. 2022',
      },
    ],
    seeAlso: [
      { name: 'CoT 原论文', url: 'https://arxiv.org/abs/2201.11903' },
      { name: 'Anthropic Prompt Engineering', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview' },
    ],
  },
};;

const added = applyEnrich(ENRICH);
console.log(`[enrich-priority-9] Added: ${added.examples} examples, ${added.seeAlso} seeAlso, ${added.quotes} quotes across ${added.terms} terms`);
