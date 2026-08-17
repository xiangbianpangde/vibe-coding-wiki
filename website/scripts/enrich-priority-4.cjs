// Wave 3b enrichment — Task 1 continuation (10 more terms)
// Targets:
//   L3: function-calling, structured-outputs, embedding, vector-database, tokens
//   L4: cursor-composer, cline, devin, v0, codex-cli
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const ENRICH = {
  // ============ L3 技术概念 ============
  'function-calling': {
    examples: [
      {
        code: `// OpenAI function calling: 定义工具 schema
const tools = [{
  type: "function",
  function: {
    name: "get_weather",
    description: "Get current weather for a location",
    parameters: {
      type: "object",
      properties: {
        location: { type: "string", description: "City name" },
        unit:    { type: "string", enum: ["celsius", "fahrenheit"] }
      },
      required: ["location"]
    }
  }
}];

const resp = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "北京今天多少度？" }],
  tools, tool_choice: "auto",
});
// resp.choices[0].message.tool_calls → [{function: {name, arguments}}]`,
        desc: "OpenAI function calling 标准用法",
      },
      {
        code: `# Anthropic tool use (Anthropic SDK)
import anthropic

client = anthropic.Anthropic()
message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[{
        "name": "get_weather",
        "description": "Get current weather",
        "input_schema": {
            "type": "object",
            "properties": {"location": {"type": "string"}},
            "required": ["location"],
        },
    }],
    messages=[{"role": "user", "content": "上海今天多少度？"}],
)
# message.stop_reason == "tool_use" → 处理 tool_use block`,
        desc: "Anthropic tool use 等价调用",
      },
    ],
    quotes: [
      {
        text: "Function calling is the primitive that turns LLMs into agents.",
        cite: 'OpenAI 2023',
      },
    ],
    seeAlso: [
      { name: 'OpenAI Function Calling 指南', url: 'https://platform.openai.com/docs/guides/function-calling' },
      { name: 'Anthropic Tool Use 文档', url: 'https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview' },
    ],
  },

  'structured-outputs': {
    examples: [
      {
        code: `# OpenAI Structured Outputs (JSON Schema 严格模式)
import openai
from pydantic import BaseModel

class CalendarEvent(BaseModel):
    name: str
    date: str
    participants: list[str]

resp = openai.chat.completions.create(
    model="gpt-4o-2024-08-06",
    messages=[{"role": "user", "content": "Alice 和 Bob 7 月 15 日开会讨论 Q3 OKR"}],
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "calendar_event",
            "schema": CalendarEvent.model_json_schema(),
            "strict": True,         # ← 严格模式：模型不能编造字段
        },
    },
)
event = CalendarEvent.model_validate_json(resp.choices[0].message.content)
# → 100% schema-compliant, 无需 retry`,
        desc: "OpenAI strict JSON Schema 输出 + Pydantic 校验",
      },
    ],
    quotes: [
      {
        text: "Structured Outputs ensures model outputs exactly match your JSON Schema.",
        cite: 'OpenAI',
      },
    ],
    seeAlso: [
      { name: 'OpenAI Structured Outputs', url: 'https://platform.openai.com/docs/guides/structured-outputs' },
      { name: 'Anthropic Tool Use (结构化输出)', url: 'https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview' },
    ],
  },

  embedding: {
    examples: [
      {
        code: `# OpenAI embeddings API
from openai import OpenAI
client = OpenAI()

resp = client.embeddings.create(
    model="text-embedding-3-small",   # 1536 维
    input="Vibe coding 是 Andrej Karpathy 提出的术语",
    encoding_format="float",
)
vec = resp.data[0].embedding     # List[float] of length 1536
print(len(vec), vec[:3])
# → 1536 [0.0123, -0.0456, 0.0789 ...]

# 语义相似度：
import numpy as np
def cosine(a, b): return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
# cosine(emb("cat"), emb("dog")) ≈ 0.7 (高相似)
# cosine(emb("cat"), emb("quantum")) ≈ 0.3 (低相似)`,
        desc: "OpenAI embeddings API + cosine 相似度",
      },
    ],
    quotes: [
      {
        text: "An embedding is a numerical representation of a piece of text, useful for search, clustering, recommendations.",
        cite: 'OpenAI Cookbook',
      },
    ],
    seeAlso: [
      { name: 'OpenAI Embeddings 指南', url: 'https://platform.openai.com/docs/guides/embeddings' },
      { name: 'HuggingFace sentence-transformers', url: 'https://huggingface.co/sentence-transformers' },
    ],
  },

  'vector-database': {
    examples: [
      {
        code: `# ChromaDB (Python) — 最简向量数据库
import chromadb

client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection("docs")

# 添加文档（自动 embedding）
collection.add(
    documents=["Vibe Coding 由 Karpathy 提出", "MCP 是 Anthropic 的协议"],
    ids=["doc1", "doc2"],
)

# 查询
results = collection.query(query_texts=["什么是 vibe coding"], n_results=2)
# results['documents'] → [[最近的 2 个文档]]
# results['distances'] → [[距离分数，0 表示完全相同]]`,
        desc: "ChromaDB 5 行搭建向量库",
      },
    ],
    quotes: [
      {
        text: "Vector databases store and query high-dimensional embedding vectors.",
        cite: 'Pinecone',
      },
    ],
    seeAlso: [
      { name: 'Pinecone 官网', url: 'https://www.pinecone.io' },
      { name: 'ChromaDB 文档', url: 'https://docs.trychroma.com' },
      { name: 'Qdrant 文档', url: 'https://qdrant.tech/documentation/' },
    ],
  },

  tokens: {
    examples: [
      {
        code: `# tiktoken — OpenAI 的 tokenizer
import tiktoken

enc = tiktoken.encoding_for_model("gpt-4o")
tokens = enc.encode("Vibe coding is awesome!")
print(len(tokens))   # → 5

# Claude 用 Anthropic 的 tokenizer (大致 1 token ≈ 3.5 英文字符)
# 100K tokens ≈ 75K 英文单词 ≈ 50 万汉字 (中文 token 化更密)`,
        desc: "tiktoken 计算 token 数",
      },
    ],
    quotes: [
      {
        text: "Tokens are the atoms of LLMs. Everything is tokens.",
        cite: 'Andrej Karpathy',
      },
    ],
    seeAlso: [
      { name: 'OpenAI Tokenizer', url: 'https://platform.openai.com/tokenizer' },
      { name: 'tiktoken GitHub', url: 'https://github.com/openai/tiktoken' },
    ],
  },

  // ============ L4 工具 ============
  'cursor-composer': {
    examples: [
      {
        code: `# Cursor Composer: 多文件编辑
# 1. Cmd+I 打开 Composer
# 2. 输入："把登录页改成支持 OAuth，并把测试补齐"
# Composer 会：
#   - 扫描相关文件
#   - 生成 unified diff（多文件）
#   - 显示 plan 供 review
#   - 一次 apply 所有变更`,
        desc: "Cursor Composer 多文件编辑流程",
      },
    ],
    quotes: [
      {
        text: "Composer is Cursor's agent for multi-file edits, trained on real codebases.",
        cite: 'Cursor blog',
      },
    ],
    seeAlso: [
      { name: 'Cursor Composer 介绍', url: 'https://cursor.com/blog/composer-1' },
      { name: 'Cursor Docs: Composer', url: 'https://docs.cursor.com/composer' },
    ],
  },

  cline: {
    examples: [
      {
        code: `# Cline (Roo Code): VS Code 扩展
# 安装：在 VS Code 扩展市场搜 "Cline" 或 "Roo Code"
# 用法：
# 1. 打开 Cline 侧边栏
# 2. 输入："给 /api/users 加分页"
# 3. Cline 会：
#    - 创建 todo list
#    - 读相关文件
#    - 写代码 + 创建/编辑文件
#    - 跑 terminal 命令（如 npm install）
#    - diff 视图等你 approve`,
        desc: "Cline / Roo Code 用法",
      },
    ],
    quotes: [
      {
        text: "Cline: autonomous coding agent right in your IDE.",
        cite: 'Cline GitHub',
      },
    ],
    seeAlso: [
      { name: 'Cline GitHub', url: 'https://github.com/cline/cline' },
      { name: 'Roo Code (Cline fork)', url: 'https://github.com/RooCodeInc/Roo-Code' },
    ],
  },

  devin: {
    examples: [
      {
        code: `# Devin (Cognition AI): 全自主 agent
# Devin 接收 Slack/Jira ticket 后：
# 1. 在自己的 sandbox 里 git clone repo
# 2. 读代码 + 写代码 + 跑测试
# 3. 通过浏览器自测 UI
# 4. 输出 PR 链接
# 限制：单任务 ~$2-$10，长任务可能卡住`,
        desc: "Devin 自主 agent 工作流",
      },
    ],
    quotes: [
      {
        text: "Devin is the first fully autonomous AI software engineer.",
        cite: 'Cognition AI, 2024-03',
      },
    ],
    seeAlso: [
      { name: 'Cognition AI 官网', url: 'https://www.cognition.ai' },
      { name: 'Devin 介绍博客', url: 'https://www.cognition.ai/blog/introducing-devin' },
    ],
  },

  v0: {
    examples: [
      {
        code: `# v0 (Vercel): UI 生成
# 1. 访问 v0.dev
# 2. 输入 prompt："一个 SaaS dashboard，左侧导航，右侧卡片网格，支持 dark mode"
# 3. v0 生成 React + Tailwind + shadcn/ui 代码
# 4. 可以复制到 clipboard 或 fork 到 Vercel 部署`,
        desc: "v0.dev UI 生成流程",
      },
    ],
    quotes: [
      {
        text: "v0 generates copy-paste friendly React code based on shadcn/ui.",
        cite: 'Vercel',
      },
    ],
    seeAlso: [
      { name: 'v0.dev 官网', url: 'https://v0.dev' },
      { name: 'v0 文档', url: 'https://v0.dev/docs' },
    ],
  },

  'codex-cli': {
    examples: [
      {
        code: `# OpenAI Codex CLI (2025): 终端 agent
$ codex "为这个 Python 项目添加单元测试"
# Codex CLI 会：
# 1. 探索项目结构
# 2. 识别需要测试的函数
# 3. 生成 pytest 测试
# 4. 跑测试验证
# 5. 提交 commit`,
        desc: "Codex CLI 终端 agent 用法",
      },
    ],
    quotes: [
      {
        text: "Codex CLI brings OpenAI's coding agent to your terminal.",
        cite: 'OpenAI, 2025-04',
      },
    ],
    seeAlso: [
      { name: 'OpenAI Codex CLI', url: 'https://github.com/openai/codex' },
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
      if (newOnes.length) {
        item.examples = [...existing, ...newOnes];
        added.examples += newOnes.length;
        termChanged = true;
      }
    }
    if (e.seeAlso) {
      const existing = Array.isArray(item.seeAlso) ? item.seeAlso : [];
      const newOnes = e.seeAlso.filter(n => !existing.some(x => x.url === n.url));
      if (newOnes.length) {
        item.seeAlso = [...existing, ...newOnes];
        added.seeAlso += newOnes.length;
        termChanged = true;
      }
    }
    if (e.quotes) {
      const existing = Array.isArray(item.quotes) ? item.quotes : [];
      const newOnes = e.quotes.filter(n => !existing.some(x => x.text === n.text));
      if (newOnes.length) {
        item.quotes = [...existing, ...newOnes];
        added.quotes += newOnes.length;
        termChanged = true;
      }
    }
    if (termChanged) {
      added.terms++;
      fileModified = true;
    }
  }
  if (fileModified) fs.writeFileSync(fp, JSON.stringify(items, null, 2));
}

console.log(`[enrich-priority-4] Added: ${added.examples} examples, ${added.seeAlso} seeAlso, ${added.quotes} quotes across ${added.terms} terms`);
