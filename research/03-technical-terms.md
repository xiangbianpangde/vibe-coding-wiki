# L3 · 技术概念层术语 (Technical Concept Layer)

> vibe coding 背后的 AI / LLM / Agent 技术栈术语。

---

## LLM (Large Language Model)

**定义**：基于 Transformer 的大规模语言模型，是 vibe coding 的引擎。

**与 vibe coding 相关的关键属性**：
- **Context Window**：上下文窗口（token 数）
- **Tokens**：模型处理的最小单位
- **Non-determinism**：温度采样下的不可复现性
- **Hallucination**：幻觉，编造事实 / API / 库

---

## Frontier Model

**定义**：在能力上达到"前沿"的 LLM，通常用于 vibe coding 的旗舰模型。

**典型代表**：Claude Sonnet 4.5 / GPT-5 / Gemini 3 Pro / DeepSeek-V3

---

## Code Model

**定义**：专门在代码上微调或训练的 LLM。

**典型代表**：
- Codex（OpenAI，2021 年 GitHub Copilot 的初版）
- Code Llama（Meta）
- DeepSeek-Coder
- Qwen-Coder
- StarCoder / StarCoder2

---

## Context Window

**定义**：LLM 单次推理可"看到"的最大 token 数。

**量级**（2025）：Claude Sonnet 4.5 = 200K / 1M；GPT-5 = 400K；Gemini 3 Pro = 1M-2M

---

## Hallucination

**定义**：LLM 在缺乏依据时生成看似合理但虚构的内容。

**vibe coding 场景下的具体表现**：
- 编造不存在的 API / 库 / 函数签名
- 引用不存在的文档
- 写出"看起来对但跑不起来"的代码

---

## Agent Loop

**定义**：AI Agent 反复执行"思考 → 行动 → 观察"循环的基本机制。

**典型结构**：
```
while not done:
    observation = env.step(action)   # 工具返回
    thought = llm.reason(context)    # 模型思考
    action = llm.decide(thought)      # 模型决策
```

**每轮都会重建 context**，这是 context engineering 的核心动因。

---

## Subagent

**定义**：由主 agent 派生的**子 agent**，负责专门子任务。

**典型用法**：
- 主 agent 负责整体规划
- 子 agent 负责 context gathering / test coverage / conflict resolution
- 子 agent 完成后向主 agent 汇报

**实践**：spawn_agent 工具、Plan mode、Claude Code 的 Task 工具

---

## Tool Use / Function Calling

**定义**：让 LLM 调用**外部函数**（读文件、跑命令、查 API）的能力。

**两种调用模式**：
| 模式 | 上下文开销 | 适用 |
|---|---|---|
| 直接工具调用 | 高（每次注入定义和返回值） | 简单一次性 |
| 让 Agent 写代码调用工具 | 低（代码复用工具调用） | 复杂 / 大规模 |

---

## MCP (Model Context Protocol)

**定义**：连接 AI Agent 与**外部数据源 / 工具**的开放标准。

**类比**：相当于 AI 时代的 USB / OpenAPI。

**核心元素**：
- MCP Server：暴露工具的进程
- MCP Client：Agent 内置的客户端
- 协议：JSON-RPC over stdio / HTTP

**官方源**：modelcontextprotocol.io（Anthropic 推出，2024-11）

---

## System Prompt / System Message

**定义**：在对话开头给 LLM 的**全局指令**，影响后续所有交互。

**vibe coding 场景下的用途**：
- 设定角色（"你是一位 Python 专家"）
- 注入项目规范
- 注入工具列表

---

## Few-Shot Prompting

**定义**：在 prompt 中给 LLM 几个**示例**，让模型模仿。

**vibe coding 例子**：
- 给出"期望输出格式"的示例
- 给出"代码风格"的示例

---

## Token / Tokenization

**定义**：模型把文本切分成**最小处理单元**的过程。

**估算规则**：英文 1 token ≈ 4 字符 / 0.75 词；中文 1 token ≈ 1-2 字

---

## Pass@k

**定义**：代码生成评测指标——k 次采样中**至少一次**通过测试的概率。

**SWE-bench Verified 基准**：Claude Sonnet 4.5 = ~65%；GPT-5 = ~70%（2025）

---

## 来源

- en.wikipedia.org/wiki/Vibe_coding
- operatordiary.com/articles/claude-code-vs-cursor-vs-windsurf/
- modelcontextprotocol.io
- spec-coding.dev/spec-md-template-for-ai-agents