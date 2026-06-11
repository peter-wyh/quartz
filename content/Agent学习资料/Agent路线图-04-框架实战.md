---
tags: [AI-Agent, 学习路线图, 阶段四, 框架实战]
阶段: 四
预计时间: 2-3周
前置要求: "[[Agent路线图-03-Agent核心原理]]"
created: 2025-06-11
---

# 阶段四：Agent 框架实战

## 🎯 目标

掌握主流 Agent 开发框架，能用框架快速构建实际应用。

---

## 一、框架全景对比

| 框架 | 核心定位 | 适合场景 | 学习难度 |
|------|---------|---------|---------|
| **LangChain** | 通用 LLM 应用开发 | RAG、Agent、Pipeline | ⭐⭐ |
| **LlamaIndex** | 数据接入 + RAG | 知识库问答 | ⭐⭐ |
| **CrewAI** | 多角色 Agent 协作 | 模拟团队协作 | ⭐⭐ |
| **AutoGen** | 多 Agent 对话 | 复杂推理任务 | ⭐⭐⭐ |
| **LangGraph** | 状态图 Agent | 复杂工作流 | ⭐⭐⭐ |
| **OpenAI Swarm** | 极简多 Agent | 学习 Agent 编排 | ⭐ |

---

## 二、LangChain 入门

### 2.1 核心概念

```
┌────────────────────────────────────┐
│          LangChain 架构             │
│                                    │
│  Model ─── Prompt ─── Output Parser│
│    │                               │
│  Chain（链）                        │
│    │                               │
│  Agent + Tools                     │
│    │                               │
│  Memory（记忆）                     │
└────────────────────────────────────┘
```

### 2.2 构建一个简单 Agent

```python
from langchain_openai import ChatOpenAI
from langchain.agents import create_react_agent, AgentExecutor
from langchain.tools import tool

# 定义工具
@tool
def search(query: str) -> str:
    """搜索互联网获取信息"""
    # 实际使用时接入搜索 API
    return f"关于 '{query}' 的搜索结果..."

@tool  
def calculator(expression: str) -> str:
    """计算数学表达式"""
    return str(eval(expression))

# 创建 Agent
llm = ChatOpenAI(model="gpt-4o")
tools = [search, calculator]

agent = create_react_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# 运行
result = agent_executor.invoke({
    "input": "2024年全球人口是多少？人均GDP是多少？"
})
```

### 2.3 LangChain 核心模块

- **Chains**：将多个组件串联成流水线
- **Agents**：根据输入动态选择工具
- **Memory**：维护对话历史
- **Retrievers**：检索相关文档（RAG）
- **Callbacks**：监控和日志

---

## 三、LangGraph（重点推荐）

LangGraph 是构建复杂 Agent 的最佳选择。

### 3.1 为什么选 LangGraph？

- ✅ 基于状态图（State Graph），工作流清晰可视化
- ✅ 支持循环、条件分支、并行
- ✅ 内置人机交互节点
- ✅ 支持持久化状态

### 3.2 核心概念

```
State（状态）: Agent 运行中的所有数据
Node（节点）  : 处理状态的函数
Edge（边）    : 节点之间的转移（可带条件）
```

### 3.3 示例：构建一个 Research Agent

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
import operator

# 定义状态
class AgentState(TypedDict):
    query: str
    search_results: list[str]
    analysis: str
    report: str
    iterations: int

# 节点：搜索
def search_node(state: AgentState) -> AgentState:
    results = search_api(state["query"])
    state["search_results"] = results
    state["iterations"] += 1
    return state

# 节点：分析
def analyze_node(state: AgentState) -> AgentState:
    analysis = llm.analyze(state["search_results"])
    state["analysis"] = analysis
    return state

# 节点：生成报告
def report_node(state: AgentState) -> AgentState:
    report = llm.generate_report(state["analysis"])
    state["report"] = report
    return state

# 条件边：是否需要继续搜索
def should_continue(state: AgentState) -> str:
    if state["iterations"] < 3 and not state.get("analysis"):
        return "search"
    return "report"

# 构建图
graph = StateGraph(AgentState)
graph.add_node("search", search_node)
graph.add_node("analyze", analyze_node)
graph.add_node("report", report_node)

graph.add_edge("search", "analyze")
graph.add_conditional_edges("analyze", should_continue)
graph.add_edge("report", END)

graph.set_entry_point("search")
app = graph.compile()
```

---

## 四、CrewAI 入门

### 4.1 核心概念

```
Crew（团队）
├── Agent 1（研究员）：负责搜集信息
├── Agent 2（分析师）：负责分析数据
└── Agent 3（写手）  ：负责撰写报告
    │
    └── Task（任务）：按顺序或并行执行
```

### 4.2 示例

```python
from crewai import Agent, Task, Crew

researcher = Agent(
    role="市场研究员",
    goal="收集 AI Agent 市场的最新信息",
    backstory="你是一位经验丰富的市场研究员",
    llm=ChatOpenAI(model="gpt-4o")
)

analyst = Agent(
    role="数据分析师",
    goal="分析市场数据并提取洞察",
    backstory="你擅长从数据中发现趋势",
    llm=ChatOpenAI(model="gpt-4o")
)

research_task = Task(
    description="研究 2024 年 AI Agent 市场规模和主要玩家",
    agent=researcher,
    expected_output="一份详细的市场调研摘要"
)

analysis_task = Task(
    description="基于调研数据，分析市场趋势和机会",
    agent=analyst,
    expected_output="包含图表建议的市场分析报告"
)

crew = Crew(
    agents=[researcher, analyst],
    tasks=[research_task, analysis_task],
    verbose=True
)

result = crew.kickoff()
```

---

## 五、实战项目

### 项目 1：个人知识助手（LangChain + RAG）

```
功能：
- 上传 PDF/文档
- 自动构建知识库
- 基于知识库回答问题
- 引用来源

技术栈：LangChain + ChromaDB + OpenAI
```

### 项目 2：研究报告生成器（LangGraph）

```
功能：
- 自动搜索指定主题
- 收集多个来源信息
- 分析对比
- 生成结构化报告

技术栈：LangGraph + Tavily Search + OpenAI
```

### 项目 3：团队协作 Agent（CrewAI）

```
功能：
- 产品经理 Agent 需求分析
- 工程师 Agent 技术方案
- 测试 Agent 质量检查

技术栈：CrewAI + 自定义工具
```

---

## 📚 推荐资源

- 📖 [LangChain 官方文档](https://python.langchain.com/)
- 📖 [LangGraph 官方教程](https://langchain-ai.github.io/langgraph/)
- 📖 [CrewAI 官方文档](https://docs.crewai.com/)
- 📺 DeepLearning.AI - LangChain 短课程
- 💻 [LangChain Templates](https://github.com/langchain-ai/langchain/tree/master/templates)

---

## ✅ 阶段完成标准

- [ ] 用 LangChain 构建一个带工具的 Agent
- [ ] 理解 LangGraph 的状态图模型
- [ ] 用 CrewAI 实现多角色协作
- [ ] 完成至少 1 个实战项目
- [ ] 能根据需求选择合适的框架

**上一阶段** ← [[Agent路线图-03-Agent核心原理]]
**下一阶段** → [[Agent路线图-05-多Agent系统]]
