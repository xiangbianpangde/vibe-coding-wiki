// Wave 4b enrichment — 10 L3 ML core concepts (examples + quotes + seeAlso)
const { applyEnrich } = require('./lib/enrich-lib.cjs');

const ENRICH = {
  // ============ L3 ML 核心 ============
  'cosine-similarity': {
    examples: [
      {
        code: `# Cosine Similarity: 衡量两个向量的方向相似度
import numpy as np

def cosine_similarity(a, b):
    """
    Returns: -1 (opposite) to 1 (same direction)
    Formula: cos(θ) = (a · b) / (||a|| × ||b||)
    """
    dot = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    return dot / (norm_a * norm_b)

# Embedding 相似度示例：
emb_cat   = [0.8, 0.2, 0.1]   # "cat" 的 embedding
emb_dog   = [0.7, 0.3, 0.1]   # "dog"
emb_table = [0.1, 0.8, 0.5]   # "table"

print(cosine_similarity(emb_cat, emb_dog))      # → 0.99 (高)
print(cosine_similarity(emb_cat, emb_table))    # → 0.32 (低)

# vs Euclidean distance: 对向量长度敏感
# Cosine: 只关心方向（更适合 NLP embedding）`,
        desc: "Cosine similarity 实现 + 与 Euclidean 对比",
      },
    ],
    quotes: [
      {
        text: "Cosine similarity measures the angle between vectors, ignoring magnitude. Ideal for comparing normalized embeddings.",
        cite: 'Stanford NLP',
      },
    ],
    seeAlso: [
      { name: 'Wikipedia: Cosine similarity', url: 'https://en.wikipedia.org/wiki/Cosine_similarity' },
      { name: 'NumPy: np.dot', url: 'https://numpy.org/doc/stable/reference/generated/numpy.dot.html' },
    ],
  },

  'kv-cache': {
    examples: [
      {
        code: `# KV Cache: Transformer 推理加速的关键
# 标准 autoregressive 生成：每生成一个 token 要重算所有之前的 attention
# → O(n²) per context

# KV Cache: 把已计算的 K, V 矩阵缓存起来
# → 新 token 只需算自己的 Q，然后和缓存的 K、V 做 attention
# → O(n) per context

# 内存代价：
#   cache_size = 2 × num_layers × seq_len × d_model × batch_size × bytes_per_param
# GPT-3 175B (96 layers, d_model=12288, fp16):
#   per token = 2 × 96 × 12288 × 2 bytes = 4.7 MB
#   2048 tokens context = 9.4 GB
# → 长 context 内存爆炸，催生 vLLM/PagedAttention 等优化`,
        desc: "KV Cache 工作原理 + 内存代价",
      },
    ],
    seeAlso: [
      { name: 'vLLM: PagedAttention 论文', url: 'https://arxiv.org/abs/2309.06180' },
      { name: 'DAIR.ai: KV Cache 解释', url: 'https://dair.ai' },
    ],
  },

  rope: {
    examples: [
      {
        code: `# RoPE (Rotary Position Embedding)
# 核心思想：把位置信息编码为 query / key 向量的旋转
# 不加 position embedding，而是旋转 Q、K 向量

import torch
import torch.nn.functional as F

def apply_rope(x, freqs):
    """
    x:      (batch, heads, seq, d_k)
    freqs:  (seq, d_k/2) — 预计算的 sin/cos
    """
    # 把最后一维拆成两半，分别乘 cos/sin
    x_pair = x.float().reshape(*x.shape[:-1], -1, 2)
    x_real, x_imag = x_pair[..., 0], x_pair[..., 1]

    # cos/sin 旋转
    cos = freqs.cos()[None, None, :, :]
    sin = freqs.sin()[None, None, :, :]
    out_real = x_real * cos - x_imag * sin
    out_imag = x_real * sin + x_imag * cos

    return torch.stack([out_real, out_imag], dim=-1).reshape(x.shape).to(x.dtype)

# 优势：天然支持相对位置 + 长度外推`,
        desc: "RoPE 旋转位置编码 PyTorch 实现",
      },
    ],
    seeAlso: [
      { name: 'RoPE 原论文 (Su et al. 2021)', url: 'https://arxiv.org/abs/2104.09864' },
    ],
  },

  'mixture-of-experts': {
    examples: [
      {
        code: `# Mixture of Experts (MoE): 稀疏激活大模型
# DeepSeek V3: 671B 总参数，但每 token 只激活 ~37B

class MoELayer(torch.nn.Module):
    def __init__(self, d_model, num_experts=64, top_k=2):
        super().__init__()
        self.gate = torch.nn.Linear(d_model, num_experts)
        self.experts = torch.nn.ModuleList([
            torch.nn.Sequential(
                torch.nn.Linear(d_model, d_model * 4),
                torch.nn.GELU(),
                torch.nn.Linear(d_model * 4, d_model),
            ) for _ in range(num_experts)
        ])
        self.top_k = top_k

    def forward(self, x):
        # 1. Router 决定 top-k experts
        scores = self.gate(x)                    # (batch, seq, num_experts)
        top_k_vals, top_k_idx = scores.topk(self.top_k, dim=-1)

        # 2. 只激活 top-k experts
        output = torch.zeros_like(x)
        for k in range(self.top_k):
            mask = (top_k_idx[..., k:k+1] == torch.arange(len(self.experts))).any(-1)
            # ... 复杂 index + scatter，实际用 vLLM/Switch Transformer 优化
        return output`,
        desc: "MoE layer 简化实现",
      },
    ],
    seeAlso: [
      { name: 'Switch Transformer 论文', url: 'https://arxiv.org/abs/2101.03961' },
      { name: 'DeepSeek V3 技术报告', url: 'https://arxiv.org/abs/2412.19437' },
    ],
  },

  mamba: {
    examples: [
      {
        code: `# Mamba: 状态空间模型替代 Transformer
# 优势：线性时间复杂度 O(n) vs Transformer O(n²)
# 劣势：不适合需要精确检索的任务（vs attention）

from mamba_ssm import Mamba

model = Mamba(
    d_model=768,           # hidden dim
    d_state=16,            # SSM state dimension
    d_conv=4,              # 局部卷积核大小
    expand=2,              # 块扩展因子
).to("cuda")

# 输入: (batch, seq_len, d_model)
x = torch.randn(2, 1024, 768).to("cuda")
y = model(x)   # 输出同 shape

# Mamba-2: 改进版本，更快 + 支持 tensor parallel
# Jamba: Mamba + Attention 混合（弥补 Mamba 弱点）`,
        desc: "Mamba state space model PyTorch 示例",
      },
    ],
    seeAlso: [
      { name: 'Mamba 原论文 (Gu & Dao 2023)', url: 'https://arxiv.org/abs/2312.00752' },
      { name: 'Mamba GitHub', url: 'https://github.com/state-spaces/mamba' },
    ],
  },

  'paged-attention': {
    examples: [
      {
        code: `# PagedAttention: vLLM 的 KV Cache 分页管理
# 问题：传统 KV Cache 是连续内存，长 context 会 OOM
# 解决：把 KV Cache 分成固定大小的"页"（类似 OS 虚拟内存）

from vllm import LLM, SamplingParams

llm = LLM(
    model="meta-llama/Llama-3-70b",
    gpu_memory_utilization=0.9,
    block_size=16,         # 每页存 16 个 token 的 KV
    max_num_blocks_per_seq=256,   # 最长 4096 tokens
)

# 自动应用 PagedAttention
outputs = llm.generate(["Long prompt..."], SamplingParams(max_tokens=100))

# 优势：
# - 内存碎片化 ↓
# - 长 context 支持 ↑
# - batch 内不同 seq 长度高效共享 GPU`,
        desc: "vLLM PagedAttention 用法",
      },
    ],
    seeAlso: [
      { name: 'PagedAttention 论文 (Kwon et al. 2023)', url: 'https://arxiv.org/abs/2309.06180' },
      { name: 'vLLM 文档', url: 'https://docs.vllm.ai' },
    ],
  },

  'speculative-decoding': {
    examples: [
      {
        code: `# Speculative Decoding: 用小模型加速大模型推理
# 1. 小模型 (draft) 生成 K 个候选 token（快）
# 2. 大模型 (target) 一次性验证 K 个候选（并行）

# 用 HuggingFace transformers 实现
from transformers import AutoModelForCausalLM, AutoTokenizer

draft_model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-0.5B").cuda()
target_model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-7B").cuda()

# draft 生成 5 个 token
draft_tokens = draft_model.generate(input_ids, max_new_tokens=5)

# target 一次性 verify
# 接受 prefix 长度 = 直到第一个 mismatch
output = target_model.generate(
    input_ids,
    max_new_tokens=5,
    speculative_decoding=True,
    assistant_model=draft_model,
)

# 实测加速：2-3x（取决于 acceptance rate）`,
        desc: "Speculative decoding 简化实现",
      },
    ],
    seeAlso: [
      { name: 'Speculative Decoding 论文', url: 'https://arxiv.org/abs/2211.17192' },
    ],
  },

  'flash-attention': {
    examples: [
      {
        code: `# Flash Attention: 内存高效的 attention 计算
# 标准 attention: O(n²) 内存（存 attention matrix）
# Flash Attention: O(n) 内存（分块计算，不存中间结果）

# HuggingFace transformers 自动支持 (PyTorch 2.0+)
from transformers import AutoModelForCausalLM
import torch

model = AutoModelForCausalLM.from_pretrained(
    "Qwen/Qwen2.5-7B",
    attn_implementation="flash_attention_2",   # 启用
    torch_dtype=torch.bfloat16,
).cuda()

# 长 context 训练必备（节省 5-10x 显存）`,
        desc: "Flash Attention 启用方式",
      },
    ],
    seeAlso: [
      { name: 'Flash Attention 论文 (Dao et al. 2022)', url: 'https://arxiv.org/abs/2205.14135' },
      { name: 'Flash Attention GitHub', url: 'https://github.com/Dao-AILab/flash-attention' },
    ],
  },

  quantization: {
    examples: [
      {
        code: `# Model Quantization: FP32 → FP16 → INT8 → INT4
# 目的：减少模型大小 + 加速推理（牺牲一点精度）

# 1. bitsandbytes (HuggingFace)
from transformers import AutoModelForCausalLM, BitsAndBytesConfig

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,                    # 4-bit 量化
    bnb_4bit_compute_dtype="bfloat16",    # 计算用 bf16
    bnb_4bit_quant_type="nf4",            # NormalFloat4 (LLM 最优)
)

model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3-70b",
    quantization_config=bnb_config,
    device_map="auto",
)
# 70B FP16 → 35GB → 4-bit: 17.5GB（单 24GB GPU 可跑）

# 2. GPTQ (post-training, GPU-friendly)
# 3. AWQ (activation-aware, 4-bit, 质量最好)`,
        desc: "Model quantization 4-bit + bitsandbytes",
      },
    ],
    seeAlso: [
      { name: 'bitsandbytes', url: 'https://github.com/TimDettmers/bitsandbytes' },
      { name: 'HuggingFace: Quantization', url: 'https://huggingface.co/docs/transformers/quantization' },
    ],
  },

  'graph-rag': {
    examples: [
      {
        code: `# GraphRAG: 用知识图谱增强 RAG
# 传统 RAG: chunk → embedding → vector search
# GraphRAG: chunk → entity extraction → graph → community detection → summary

# Microsoft GraphRAG 简化流程
from graphrag import GraphRAG

graph = GraphRAG.from_documents(docs)

# 1. 提取实体和关系
graph.extract_entities()

# 2. 构建知识图谱
graph.build_graph()

# 3. Leiden 算法分社区
communities = graph.detect_communities()

# 4. 每个社区生成 summary
graph.summarize_communities()

# 5. 查询：先用 community summary 找相关社区，再 drill down
result = graph.query("What are the key themes in this document?")

# 优势：跨 chunk 关系查询，全局摘要
# 劣势：图构建慢，索引大`,
        desc: "Microsoft GraphRAG 简化流程",
      },
    ],
    seeAlso: [
      { name: 'Microsoft GraphRAG', url: 'https://microsoft.github.io/graphrag/' },
      { name: 'GraphRAG 论文', url: 'https://arxiv.org/abs/2404.16130' },
    ],
  },
};

const added = applyEnrich(ENRICH);
console.log(`[enrich-priority-12] Added: ${added.examples} examples, ${added.seeAlso} seeAlso, ${added.quotes} quotes across ${added.terms} terms`);