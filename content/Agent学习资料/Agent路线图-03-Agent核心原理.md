---
tags: [AI-Agent, 学习路线图, 阶段三, Agent原理]
阶段: 三
预计时间: 2-3周
前置要求: "[[Agent路线图-02-Prompt Engineering]]"
created: 2025-06-11
---

# 阶段三：Agent 核心原理

## 🎯 目标

深入理解 AI Agent 的核心架构：感知、规划、行动、记忆。能从零手写一个简单 Agent。

---

## 一、什么是 AI Agent？

### 1.1 定义

> Agent = LLM + 感知 + 记忆 + 规划 + 工具使用

```
┌─────────────────────────────────────┐
│              AI Agent                │
│                                     │
│  ┌───────┐  ┌──────┐  ┌──────────┐ │
│  │ 感知  │→│ 规划 │→│  行动    │ │
│  │Perceive│  │Plan │  │  Act     │ │
│  └───────┘  └──────┘  └──────────┘ │
│       ↑         ↑          │        │
│       │    ┌────┴────┐     ↓        │
│       │    │  记忆   │  ┌──────┐   │
│       └────│ Memory  │←─│工具  │   │
│            └─────────┘  │Tools │   │
│                         └──────┘   │
└─────────────────────────────────────┘
```

### 1.2 Agent vs Chatbot

| 维度   | Chatbot | Agent   |
| ---- | ------- | ------- |
| 交互方式 | 单轮问答    | 多步自主执行  |
| 工具使用 | ❌       | ✅       |
| 记忆   | 有限      | 短期 + 长期 |
| 规划能力 | ❌       | ✅ 任务分解  |
| 自主性  | 被动响应    | 主动执行    |
| 错误处理 | 无       | 自我修正    |

---

## 二、Agent 核心组件

### 2.1 感知（Perception）

Agent 如何理解输入和环境：

- **用户输入解析**：理解用户意图
- **环境状态感知**：了解当前上下文
- **工具返回解析**：理解工具执行结果

### 2.2 规划（Planning）

将复杂任务分解为可执行的步骤：

```
用户：帮我分析竞品并写报告

Agent 规划：
  Step 1: 搜索竞品信息
  Step 2: 提取关键数据
  Step 3: 分析优势和劣势
  Step 4: 生成对比表格
  Step 5: 撰写分析报告
```

**规划策略**：
- **单步规划**：每次只规划下一步
- **全局规划**：一次性规划所有步骤
- **动态规划**：根据中间结果调整计划

### 2.3 行动（Action）

通过工具与外部世界交互：

```python
# 工具定义示例
class Tool:
    name: str           # 工具名称
    description: str    # 工具描述
    parameters: dict    # 参数 schema
    
    def execute(self, **kwargs):
        """执行工具逻辑"""
        pass
```

**常见工具类型**：
- 🔍 搜索引擎
- 🌐 浏览器
- 📁 文件读写
- 💻 代码执行
- 📧 发送邮件
- 🗄️ 数据库查询

### 2.4 记忆（Memory）

```
┌──────────────────────────────────┐
│         Memory System            │
│                                  │
│  ┌─────────────────────────┐    │
│  │ 短期记忆 (Working Memory)│    │
│  │ 当前对话上下文           │    │
│  │ 最近 N 轮交互           │    │
│  └─────────────────────────┘    │
│           ↓                      │
│  ┌─────────────────────────┐    │
│  │ 长期记忆 (Long-term)    │    │
│  │ 向量数据库              │    │
│  │ 用户偏好 / 知识库       │    │
│  └─────────────────────────┘    │
└──────────────────────────────────┘
```

---

## 三、Agent 循环（Agent Loop）

这是 Agent 运行的核心循环：

```python
while not task_complete:
    # 1. 思考：分析当前状态，决定下一步
    thought = llm.think(context, memory, available_tools)
    
    # 2. 行动：选择并执行工具
    if thought.needs_tool:
        observation = tool.execute(thought.tool_call)
    else:
        observation = None
    
    # 3. 观察：处理结果
    memory.update(thought, observation)
    
    # 4. 检查：任务是否完成
    task_complete = thought.is_final
```

### 3.1 完整示例：从零写一个 Agent

```python
import json
from openai import OpenAI

client = OpenAI()

# 定义工具
def search_web(query: str) -> str:
    """模拟搜索"""
    return f"搜索结果：关于'{query}'的信息..."

def calculate(expression: str) -> str:
    """计算数学表达式"""
    return str(eval(expression))

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "search_web",
            "description": "搜索互联网获取信息",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "搜索关键词"}
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "calculate",
            "description": "计算数学表达式",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {"type": "string", "description": "数学表达式"}
                },
                "required": ["expression"]
            }
        }
    }
]

TOOL_MAP = {
    "search_web": search_web,
    "calculate": calculate
}

# Agent 主循环
def agent_run(user_query: str, max_steps: int = 10):
    messages = [
        {"role": "system", "content": "你是一个有用的AI助手，可以使用工具来帮助用户。"},
        {"role": "user", "content": user_query}
    ]
    
    for step in range(max_steps):
        print(f"\n--- Step {step + 1} ---")
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            tools=TOOLS
        )
        
        msg = response.choices[0].message
        
        # 如果没有工具调用，说明 Agent 认为任务完成
        if not msg.tool_calls:
            print(f"最终回答: {msg.content}")
            return msg.content
        
        # 处理工具调用
        messages.append(msg)
        for tool_call in msg.tool_calls:
            func_name = tool_call.function.name
            func_args = json.loads(tool_call.function.arguments)
            
            print(f"调用工具: {func_name}({func_args})")
            result = TOOL_MAP[func_name](**func_args)
            print(f"工具结果: {result}")
            
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": str(result)
            })
    
    return "达到最大步数限制"

# 运行
agent_run("搜索2024年世界人口，然后计算人均GDP大约是多少？")
```

---

## 四、Agent 设计模式

### 4.1 ReAct 模式

最常见的 Agent 模式，推理和行动交替进行。

### 4.2 Plan-and-Execute 模式

先制定完整计划，再逐步执行。

```
Plan:
  1. 收集数据
  2. 清洗数据  
  3. 训练模型
  4. 评估结果

Execute:
  → Step 1: ... ✅
  → Step 2: ... ✅
  → Step 3: ... (发现数据不够) → Replan
```

### 4.3 Reflexion 模式

Agent 自我评估和反思：

```
Action → Result → Self-Evaluation → Reflection → Improved Action
```

---

## 📚 推荐资源

- 📄 **ReAct 论文**：*Synergizing Reasoning and Acting in Language Models* (Yao et al., 2023)
- 📄 **Toolformer**：*Language Models Can Teach Themselves to Use Tools* (Schick et al., 2023)
- 📄 **Reflexion**：*Language Agents with Verbal Reinforcement Learning* (Shinn et al., 2023)
- 📺 [Andrew Ng - AI Agentic Design Patterns](https://www.deeplearning.ai/short-courses/)
- 💻 [learn-claude-code](https://github.com/shareAI-lab/learn-claude-code) — 从零构建 Agent

---

## ✅ 阶段完成标准

- [ ] 能画出 Agent 的核心架构图
- [ ] 理解 Agent Loop 的工作原理
- [ ] 能从零手写一个带工具调用的 Agent
- [ ] 理解 ReAct、Plan-Execute、Reflexion 三种模式
- [ ] 完成一个能搜索 + 计算的简单 Agent

**上一阶段** ← [[Agent路线图-02-Prompt Engineering]]
**下一阶段** → [[Agent路线图-04-框架实战]]
