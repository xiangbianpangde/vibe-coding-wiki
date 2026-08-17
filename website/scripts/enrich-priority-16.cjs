// Wave 4f — 12 L3 ML training + Claude Code concepts to push examples past 70%
const { applyEnrich } = require('./lib/enrich-lib.cjs');

const ENRICH = {
  // ============ L3 ML Training concepts ============
  'lora': {
    examples: [
      {
        code: `# LoRA: 低秩适配微调
# 标准 fine-tuning 更新所有 W 矩阵 (e.g., 7B params)
# LoRA: 冻结 W，添加低秩旁路 W' = A @ B
#   A: (d × r), B: (r × d), r << d
#   参数量: r × 2d vs d × ×
# 7B model + r=16: 训练 0.1% 参数

from peft import LoraConfig, get_peft_model

config = LoraConfig(
    r=16,                   # rank
    lora_alpha=32,          # scaling
    target_modules=["q_proj", "v_proj"],   # 只在 attention 层加 LoRA
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

model = get_peft_model(base_model, config)
model.print_trainable_parameters()
# trainable params: 4,194,304 || all params: 7,000,000,000 || 0.06%`,
        desc: "LoRA 标准用法 + 参数量对比",
      },
    ],
  },

  qlora: {
    examples: [
      {
        code: `# QLoRA: 4-bit base + LoRA adapter
# 1. 把 base model 量化到 4-bit (NF4)
# 2. 添加 LoRA adapter (bf16)
# 3. 只训练 LoRA 参数

from transformers import BitsAndBytesConfig
from peft import LoraConfig, prepare_model_for_kbit_training

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype="bfloat16",
    bnb_4bit_use_double_quant=True,
)

model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3-70b",
    quantization_config=bnb_config,
    device_map="auto",
)
model = prepare_model_for_kbit_training(model)

# 加 LoRA
lora_config = LoraConfig(r=64, lora_alpha=16, target_modules="all-linear")
model = get_peft_model(model, lora_config)

# 效果：65B model 单 48GB GPU 可训练，95%+ 质量`,
        desc: "QLoRA 完整 pipeline",
      },
    ],
  },

  rlhf: {
    examples: [
      {
        code: `# RLHF: Reinforcement Learning from Human Feedback
# 三阶段：
# 1. SFT: 在 instruction-response 数据上 supervised fine-tune
# 2. Reward Model: 人类对多个 output 排序，训练 reward model
# 3. PPO: 用 reward model 作 reward signal，policy gradient 训练

# 关键问题：
# - reward hacking（model 学会 exploit RM 而非真改进）
# - 人类标注不一致
# - 计算昂贵（每次 PPO step 需 RM inference）

# 替代方案：
# - DPO: 直接 preference learning，无需 RM
# - RLAIF: AI 替代人类标注
# - KTO: Kahneman-Tversky 优化`,
        desc: "RLHF 3 阶段 pipeline",
      },
    ],
  },

  dpo: {
    examples: [
      {
        code: `# DPO: Direct Preference Optimization
# 不需要 reward model，直接用偏好对 (chosen, rejected) 优化

from trl import DPOTrainer, DPOConfig

config = DPOConfig(
    beta=0.1,                  # KL 约束强度
    learning_rate=1e-6,
    batch_size=4,
)

trainer = DPOTrainer(
    model=base_model,
    ref_model=None,            # 用 peft 模式共享 base
    args=config,
    train_dataset=preference_dataset,  # {prompt, chosen, rejected}
    tokenizer=tokenizer,
)
trainer.train()

# 优势 vs RLHF：
# - 单阶段训练
# - 无需 RM
# - 更稳定（无 reward hacking）
# - 论文: 75% 人类偏好 vs SFT baseline`,
        desc: "DPO trainer HuggingFace TRL",
      },
    ],
  },

  peft: {
    examples: [
      {
        code: `# PEFT: Parameter-Efficient Fine-Tuning
# HuggingFace 库统一多种参数高效微调方法

from peft import (
    LoraConfig, get_peft_model,           # LoRA / QLoRA
    PromptTuningConfig,                   # Prompt Tuning
    PrefixTuningConfig,                   # Prefix Tuning
    IA3Config,                            # IA^3
)

# 1. LoRA (most popular)
lora = LoraConfig(r=16, lora_alpha=32, target_modules=["q_proj"])
model = get_peft_model(base_model, lora)

# 2. Prompt Tuning (smallest, <1k params)
prompt_config = PromptTuningConfig(
    num_virtual_tokens=20,
    prompt_tuning_init="TEXT",
    prompt_tuning_init_text="Classify if this text is positive:",
)

# 3. IA^3 (multiplies activations, similar params to LoRA)
ia3 = IA3Config(target_modules=["q_proj", "v_proj"])`,
        desc: "PEFT 库支持的 4 种主要方法",
      },
    ],
  },

  rlaif: {
    examples: [
      {
        code: `# RLAIF: Reinforcement Learning from AI Feedback
# Anthropic Constitutional AI 的核心
# 用 AI 替代人类标注 preference，扩展性更强

# 流程：
# 1. 让 LLM 根据"宪法"（一组原则）评价两个 output
# 2. 用 AI 偏好训练 RM
# 3. PPO 训练 policy

# 优势：
# - 便宜（无需人类标注）
# - 可扩展（按宪法原则规模化）
# - 一致性高

# 宪法原则示例：
# "Choose the response that is least harmful, racist, sexist, or socially biased."
# "Avoid responses that encourage illegal or dangerous activity."`,
        desc: "RLAIF Constitutional AI 流程",
      },
    ],
  },

  distillation: {
    examples: [
      {
        code: `# Knowledge Distillation: 大模型知识转移到小模型
# Teacher: 7B 模型
# Student: 1.5B 模型
# 目标: student 模仿 teacher 的 soft logits

import torch.nn.functional as F

def distillation_loss(student_logits, teacher_logits, temperature=3.0):
    """
    Higher temperature = softer distribution = more knowledge transfer
    """
    soft_student = F.log_softmax(student_logits / temperature, dim=-1)
    soft_teacher = F.softmax(teacher_logits / temperature, dim=-1)
    return F.kl_div(soft_student, soft_teacher, reduction='batchmean') * (temperature ** 2)

# 总损失 = α * distillation + (1-α) * hard_target
loss = 0.7 * distillation_loss(s_logits, t_logits) + 0.3 * F.cross_entropy(s_logits, labels)

# 效果：DistilBERT 保留 97% 性能，60% 体积，60% 速度`,
        desc: "Distillation loss 公式 + 实战数据",
      },
    ],
  },

  quantization: {
    // already has examples from wave 4b, but ensure quotes/seeAlso — already done in 4d
  },

  // ============ L3 retrieval ============
  reranker: {
    examples: [
      {
        code: `# Reranker: 把 vector search 的 top-K 结果按相关性重排
# Stage 1: Vector search (fast, ~10ms)
# Stage 2: Rerank top-20 with cross-encoder (slow but accurate, ~200ms)
# Stage 3: 选 top-5 注入 prompt

from sentence_transformers import CrossEncoder

reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

# Vector search 返回 20 个候选
candidates = vector_store.search(query, top_k=20)

# Cross-encoder 打分
pairs = [[query, doc.text] for doc in candidates]
scores = reranker.predict(pairs)  # shape: (20,)

# 重排并取 top-5
top_5 = [candidates[i] for i in scores.argsort()[-5:][::-1]]

# 性能提升：RAG 准确率 +15-30% (vs 纯 vector search)`,
        desc: "Reranker 2-stage retrieval pipeline",
      },
    ],
  },

  hyde: {
    examples: [
      {
        code: `# HyDE: Hypothetical Document Embeddings
# 假设文档 embedding 比问题 embedding 更接近真实文档
# 1. LLM 生成"假设性答案"（不需要正确，只需相关）
# 2. Embedding 假设答案
# 3. 用假设答案的 embedding 做 vector search

from openai import OpenAI

client = OpenAI()

def hyde_search(query, vector_store, k=5):
    # 1. 生成假设答案
    hypothetical = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Write a short answer to the question."},
            {"role": "user", "content": query},
        ],
    ).choices[0].message.content

    # 2. Embed 假设答案
    query_emb = client.embeddings.create(
        model="text-embedding-3-small",
        input=hypothetical,
    ).data[0].embedding

    # 3. Vector search
    return vector_store.search(query_emb, top_k=k)

# 实测：zero-shot retrieval 准确率显著提升（特别是短问题）`,
        desc: "HyDE 完整 Python 实现",
      },
    ],
  },

  'constrained-decoding': {
    examples: [
      {
        code: `# Constrained Decoding: 强制 LLM 输出符合 schema
# 用 Outlines / Guidance 等库实现

import outlines

@outlines.prompt
def generate_user():
    """Generate a user profile as JSON."""

generator = outlines.generate.json(
    model,
    UserProfile,   # Pydantic model
)

# 输出严格匹配 schema
user = generator("Alice is 30, lives in Tokyo, likes coding")

# 优势：
# - 无需 retry
# - 100% schema 兼容
# - token-level 约束（vs response-level 校验）

# 应用：
# - 结构化输出 (OpenAI JSON mode 类似)
# - 代码生成（必须匹配语法）
# - SQL 生成（必须有效）`,
        desc: "Outlines 库 constrained decoding",
      },
    ],
  },

  sampling: {
    examples: [
      {
        code: `# Sampling 策略对比
# 1. Greedy: 永远选概率最高的 token
# - 优点: 确定、可复现
# - 缺点: 容易重复、单调
# - 适用: factual QA

# 2. Top-K: 从概率最高的 K 个 token 中采样
# K=40 是 OpenAI 默认
# 优点: 限制离谱 token
# 缺点: K 固定，分布稀疏时浪费

# 3. Top-p (nucleus): 累积概率 ≥ p 的最小 token 集合
# p=0.9 通常效果好
# 优点: 自适应集合大小
# 缺点: 计算稍慢

# 4. Temperature: logits / temp 再 softmax
# temp=0 → greedy, temp=1 → 标准, temp=2 → 更有创意

# 实战：
# 创意写作: temp=1.0, top_p=0.9
# 代码生成: temp=0.2, top_p=0.95
# 翻译: temp=0.3, top_k=40`,
        desc: "4 种 sampling 策略对比 + 实战参数",
      },
    ],
  },
};

const added = applyEnrich(ENRICH);
console.log(`[enrich-priority-16] Added: ${added.examples} examples, ${added.seeAlso} seeAlso, ${added.quotes} quotes across ${added.terms} terms`);