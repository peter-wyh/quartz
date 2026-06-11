---
tags: [AI-Agent, 学习路线图, 阶段一]
阶段: 一
预计时间: 1-2周
前置要求: 基本编程能力
created: 2025-06-11
---

# 阶段一：基础知识

## 🎯 目标

理解大语言模型（LLM）的基本原理，搭建开发环境，掌握必要的 Python 技能。

---

## 一、LLM 基础概念

### 1.1 什么是大语言模型

- **本质**：基于 Transformer 架构的文本生成模型
- **核心能力**：理解指令 → 生成文本 → 推理与决策
- **关键概念**：
  - Token（词元）：模型处理文本的最小单位
  - Context Window（上下文窗口）：模型一次能处理的最大 Token 数
  - Temperature（温度）：控制生成内容的随机性
  - Top-p / Top-k：采样策略参数

### 1.2 主流 LLM 一览

| 模型 | 厂商 | 特点 |
|------|------|------|
| GPT-4o | OpenAI | 综合能力最强 |
| Claude 4 | Anthropic | 长文本、推理能力突出 |
| GLM-4 | 智谱 | 中文能力优秀 |
| Llama 3 | Meta | 开源，可本地部署 |
| Qwen 3 | 阿里 | 开源，中英双语 |

### 1.3 LLM 的局限性

- ❌ 无法访问实时信息
- ❌ 无法执行代码或操作文件
- ❌ 上下文长度有限
- ❌ 会产生幻觉（编造信息）
- ❌ 无法与外部系统交互

> 💡 **Agent 的价值**：通过工具调用（Tool Use）弥补以上局限！

---

## 二、API 调用基础

### 2.1 OpenAI API 调用示例

```python
from openai import OpenAI

client = OpenAI(api_key="your-api-key")

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "你是一个有帮助的助手。"},
        {"role": "user", "content": "什么是 AI Agent？"}
    ],
    temperature=0.7
)

print(response.choices[0].message.content)
```

### 2.2 核心概念

- **System Prompt**：定义 AI 的角色和行为规则
- **User Message**：用户输入
- **Assistant Message**：AI 回复
- **多轮对话**：维护完整的消息历史

### 2.3 流式输出（Streaming）

```python
stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "解释 Agent"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

---

## 三、开发环境搭建

### 3.1 Python 环境

```bash
# 推荐使用 uv 管理环境
uv venv agent-learning
source agent-learning/bin/activate

# 安装核心依赖
uv pip install openai anthropic python-dotenv
```

### 3.2 项目结构建议

```
agent-learning/
├── .env                # API Keys（不提交到 Git）
├── notebooks/          # 实验笔记本
├── src/                # 源代码
│   ├── basics/         # 基础练习
│   ├── agents/         # Agent 实现
│   └── tools/          # 工具定义
└── tests/              # 测试
```

---

## 四、Python 必备技能清单

- [x] 基本数据结构（dict, list, tuple）
- [x] 函数和类
- [ ] 异步编程（async/await）
- [ ] JSON 处理
- [ ] HTTP 请求（requests / httpx）
- [ ] 类型注解（Type Hints）
- [ ] Pydantic 数据验证
- [ ] pytest 基本测试

---

## 📚 推荐资源

- 📖 [OpenAI API 文档](https://platform.openai.com/docs)
- 📖 [Anthropic API 文档](https://docs.anthropic.com)
- 📺 Andrej Karpathy - 「Let's build GPT」YouTube 系列
- 📺 3Blue1Brown - 「Neural Networks」可视化系列

---

## ✅ 阶段完成标准

- [ ] 能用 Python 调用 LLM API 并获得回复
- [ ] 理解 Token、Temperature、Context Window
- [ ] 能实现多轮对话
- [ ] 搭建好开发环境

**下一阶段** → [[Agent路线图-02-Prompt Engineering]]
