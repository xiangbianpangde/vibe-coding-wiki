// First-wave enrichment for priority terms (Task 1, batch 1)
// Quality bar: executable + first-party sources only
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const ENRICH = {
  // ============ L4 工具 ============

  langchain: {
    examples: [
      {
        code: `// LCEL (LangChain Expression Language) — pipe 风格链式调用
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatAnthropic } from "@langchain/anthropic";
import { StringOutputParser } from "@langchain/core/output_parsers";

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "你是一个严谨的技术编辑，回答基于以下上下文：\\n{context}"],
  ["human", "{question}"],
]);

const model = new ChatAnthropic({ model: "claude-sonnet-4-5", temperature: 0 });
const parser = new StringOutputParser();

const chain = prompt.pipe(model).pipe(parser);   // <-- LCEL 管道
const answer = await chain.invoke({ context: docs, question: q });`,
        desc: "LangChain LCEL 链式调用（pipe 语法）",
      },
      {
        code: `// LangGraph：状态化 agent 循环
import { StateGraph, MessagesAnnotation, ToolNode } from "@langchain/langgraph";
import { tool } from "@langchain/core/tools";

const search = tool(async ({ q }) => webSearch(q), {
  name: "search", description: "搜索网页",
});

const graph = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModelWithTools)
  .addNode("tools", new ToolNode([search]))
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", shouldContinue)   // has tool calls?
  .addEdge("tools", "agent");                     // loop back

export const app = graph.compile();   // → 可部署的 agent`,
        desc: "LangGraph 状态图：tool-use 循环",
      },
    ],
    // seeAlready has 1 entry; append a more specific one
    seeAlso: [
      { name: "LangChain 官网", url: "https://langchain.com" },
      { name: "LangChain Docs", url: "https://python.langchain.com/docs/introduction/" },
      { name: "LangGraph Repo", url: "https://github.com/langchain-ai/langgraph" },
    ],
  },

  "spec-kit": {
    examples: [
      {
        code: `# GitHub Spec Kit 典型流程
$ specify init my-project      # 初始化 spec/ 目录
$ specify spec "添加 OAuth 登录" # 生成 spec.md（含 user story + acceptance criteria）
$ specify plan                   # 生成 plan.md（技术决策 + 架构）
$ specify tasks                  # 生成 tasks.md（可勾选 checklist）
$ implement                      # 按 tasks.md 顺序实现`,
        desc: "Spec Kit 四阶段 CLI 流程",
      },
    ],
    seeAlso: [
      { name: "GitHub Spec Kit Repo", url: "https://github.com/github/spec-kit" },
      { name: "Spec Kit 文档", url: "https://github.github.io/spec-kit/" },
      { name: "Spec Kit 介绍博客", url: "https://github.blog/developer-skills/github/how-to-use-spec-kit-with-your-ai-assistant/" },
    ],
  },

  llamaindex: {
    examples: [
      {
        code: `from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.llms.anthropic import Anthropic

# 1. 加载 docs/ 目录下所有文档
documents = SimpleDirectoryReader("docs").load_data()

# 2. 构建向量索引（自动 embedding + chunking）
index = VectorStoreIndex.from_documents(documents)

# 3. 接入 Claude 作为生成端
llm = Anthropic(model="claude-sonnet-4-5")
query_engine = index.as_query_engine(llm=llm, similarity_top_k=5)

# 4. RAG 查询
response = query_engine.query("项目的部署流程是什么？")
print(response)   # → 基于 docs/ 的答案 + 引用块`,
        desc: "LlamaIndex 4 步搭建 RAG",
      },
      {
        code: `from llama_index.core import SummaryIndex

# 摘要索引：不走 embedding，全文 LLM 阅读
summary_index = SummaryIndex.from_documents(documents)
summary_engine = summary_index.as_query_engine(
    response_mode="tree_summarize"
)
print(summary_engine.query("总结这 200 篇文档的主要观点"))`,
        desc: "SummaryIndex：长文档摘要",
      },
    ],
    seeAlso: [
      { name: "LlamaIndex 官网", url: "https://llamaindex.ai" },
      { name: "LlamaIndex Docs", url: "https://docs.llamaindex.ai/en/stable/" },
      { name: "LlamaIndex GitHub", url: "https://github.com/run-llama/llama_index" },
    ],
  },

  dspy: {
    examples: [
      {
        code: `import dspy
from dspy.teleprompt import BootstrapFewShot

# 1. 签名（输入/输出 schema，不是 prompt）
class GenerateAnswer(dspy.Signature):
    """基于上下文回答问题。"""
    context = dspy.InputField()
    question = dspy.InputField()
    answer = dspy.OutputField()

# 2. 模块（可优化的单元）
class RAG(dspy.Module):
    def __init__(self):
        super().__init__()
        self.retrieve = dspy.Retrieve(k=5)
        self.generate = dspy.ChainOfThought(GenerateAnswer)
    def forward(self, question):
        ctx = self.retrieve(question).passages
        return self.generate(context=ctx, question=question)

# 3. 优化器：用训练集自动调 prompt
optimizer = BootstrapFewShot(metric=answer_exact_match, max_bootstrapped_demos=4)
compiled = optimizer.compile(RAG(), trainset=trainset)`,
        desc: "DSPy 编程式 prompt 优化",
      },
    ],
    seeAlso: [
      { name: "DSPy 官网", url: "https://dspy.ai" },
      { name: "DSPy GitHub", url: "https://github.com/stanfordnlp/dspy" },
      { name: "DSPy 论文 (Khattab et al. 2023)", url: "https://arxiv.org/abs/2310.03714" },
    ],
  },

  huggingface: {
    examples: [
      {
        code: `# transformers pipeline — 最简推理
from transformers import pipeline

# 1. 三行搞定一个任务
classifier = pipeline("text-classification", model="distilbert-base-uncased-finetuned-sst-2-english")
result = classifier("I love this movie!")
# → [{'label': 'POSITIVE', 'score': 0.9998}]

# 2. 生成任务
generator = pipeline("text-generation", model="Qwen/Qwen2.5-1.5B-Instruct")
print(generator("写一句关于春天的诗：", max_new_tokens=50))

# 3. 推理优化（量化）
from transformers import AutoModelForCausalLM
import torch
model = AutoModelForCausalLM.from_pretrained(
    "Qwen/Qwen2.5-7B-Instruct",
    torch_dtype=torch.bfloat16,   # 半精度
    device_map="auto",            # 自动 GPU 分配
)`,
        desc: "transformers pipeline + 量化加载",
      },
    ],
    seeAlso: [
      { name: "Hugging Face 官网", url: "https://huggingface.co" },
      { name: "transformers 文档", url: "https://huggingface.co/docs/transformers/index" },
      { name: "HuggingFace Hub", url: "https://huggingface.co/docs/hub/index" },
    ],
  },

  // ============ L3 技术 ============

  rag: {
    // already has 1 example; add a code-level complement
    examples: [
      {
        code: `query → embedding → vector_search(top_k=20) → rerank(top_n=5) → context
→ prompt_with_context(query, context) → llm.generate() → answer`,
        desc: "典型 RAG pipeline 伪代码（已存在）",
      },
      {
        code: `# LangChain RAG：retrieval chain with citations
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain

retriever = vectorstore.as_retriever(search_kwargs={"k": 20})
qa_prompt = ChatPromptTemplate.from_template("""
基于以下 context 回答，最后引用来源编号：

<context>
{context}
</context>

Question: {input}
""")

question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
rag_chain = create_retrieval_chain(retriever, question_answer_chain)
result = rag_chain.invoke({"input": "什么是 RAG？"})
print(result["answer"])
for i, doc in enumerate(result["context"]):
    print(f"[{i+1}] {doc.metadata.get('source', '?')}")`,
        desc: "LangChain RAG 实战代码 + 引用回传",
      },
    ],
  },

  // ============ L4 工具（已 examples=1）==========

  aider: {
    examples: [
      {
        code: `$ aider --model claude-sonnet-4-5
> Add tests for the auth module.
Aider: Adding tests... [commits to git]`,
        desc: "Aider 终端使用（已存在）",
      },
      {
        code: `# Aider 自动化 + 多文件编辑
$ aider --model claude-sonnet-4-5 \\
        --edit-format diff \\
        --auto-test \\
        --test-cmd "npm test" \\
        src/auth.ts src/middleware/auth.ts

# Aider 会：
# 1. 读 2 个文件 + repo map
# 2. 生成 unified diff
# 3. 写入 → 跑 npm test
# 4. 失败自动回滚（--auto-test 模式）`,
        desc: "Aider 多文件编辑 + 自动测试回滚",
      },
    ],
  },

  // ============ L5 质量（已 examples=1）==========

  guardrails: {
    examples: [
      {
        code: `// .github/workflows/ai-code-check.yml
- name: TypeScript check
  run: npx tsc --noEmit
- name: Lint
  run: npx eslint .
- name: Tests
  run: npm test
- name: Security audit
  run: npm audit --audit-level high
// 任何一步失败 → AI 生成的 PR 拒绝 merge`,
        desc: "Guardrails CI/CD 实际配置（已存在）",
      },
      {
        code: `// pre-commit hook：本地兜底，CI 之前的最后一道防线
// .husky/pre-commit
npx lint-staged             # 只 lint staged 文件
npx tsc --noEmit            # 类型检查
npm run test:changed        # 只跑被影响文件的测试

// package.json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{ts,tsx,json,md}": ["prettier --write"]
}`,
        desc: "本地 pre-commit guardrail（Husky + lint-staged）",
      },
    ],
  },
};

// Apply
const layers = ['L1','L2','L3','L4','L5','L6','L7','L8'];
let added = { examples: 0, seeAlso: 0, terms: 0 };

for (const l of layers) {
  const fp = path.join(DATA_DIR, `terms-${l}.json`);
  const items = JSON.parse(fs.readFileSync(fp, 'utf8'));
  let modified = false;
  for (const item of items) {
    const e = ENRICH[item.id];
    if (!e) continue;
    if (e.examples) {
      // Merge: replace if currently empty, else append (avoid exact duplicate)
      const existing = Array.isArray(item.examples) ? item.examples : [];
      const newOnes = e.examples.filter(n => !existing.some(x => x.code === n.code));
      item.examples = [...existing, ...newOnes];
      added.examples += newOnes.length;
      modified = true;
    }
    if (e.seeAlso) {
      const existing = Array.isArray(item.seeAlso) ? item.seeAlso : [];
      const newOnes = e.seeAlso.filter(n => !existing.some(x => x.url === n.url));
      item.seeAlso = [...existing, ...newOnes];
      added.seeAlso += newOnes.length;
      modified = true;
    }
    if (modified) added.terms++;
    modified = false;
  }
  if (Object.keys(ENRICH).some(id => items.some(it => it.id === id))) {
    // Only write if any of our target ids live in this layer
    const hasTarget = items.some(it => ENRICH[it.id]);
    if (hasTarget) fs.writeFileSync(fp, JSON.stringify(items, null, 2));
  }
}

console.log(`[enrich-priority-1] Added: ${added.examples} examples, ${added.seeAlso} seeAlso across ${added.terms} terms`);
