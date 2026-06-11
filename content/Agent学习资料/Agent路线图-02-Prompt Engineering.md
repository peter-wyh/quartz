---
tags: [AI-Agent, 学习路线图, 阶段二, Prompt-Engineering]
阶段: 二
预计时间: 1-2周
前置要求: "[[Agent路线图-01-基础知识]]"
created: 2025-06-11
---

# 阶段二：Prompt Engineering

## 🎯 目标

掌握提示工程核心技术，学会设计高质量的系统提示词，理解 Agent 推理的基础。

---

## 一、提示工程基础

### 1.1 提示词要素

一个完整的提示词通常包含：

| 要素 | 说明 | 示例 |
|------|------|------|
| **指令** | 要做什么 | "总结以下文章" |
| **上下文** | 背景信息 | "你是医疗领域的专家" |
| **输入数据** | 具体内容 | 文章正文 |
| **输出格式** | 期望的格式 | "用 Markdown 表格输出" |

### 1.2 设计原则

1. **清晰明确**：避免歧义，具体说明期望
2. **给出示例**：Few-shot 比纯描述更有效
3. **结构化**：用分隔符（```、---）区分不同部分
4. **约束条件**：明确长度、格式、语气等要求

---

## 二、核心提示技术

### 2.1 零样本提示（Zero-Shot）

```
将以下文本翻译成英文：
{text}
```

### 2.2 少样本提示（Few-Shot）

```
判断情感倾向：

文本：这个产品太棒了！ → 情感：正面
文本：质量很差，很失望 → 情感：负面
文本：今天天气不错 → 情感：正面
文本：{新文本} → 情感：
```

### 2.3 链式思考（Chain of Thought, CoT）

```
请一步步思考：

一个问题有 5 个苹果，拿走 2 个，又买了 3 个，现在有几个？

让我们一步步来：
1. 最初有 5 个苹果
2. 拿走 2 个：5 - 2 = 3
3. 买了 3 个：3 + 3 = 6
4. 答案是 6 个
```

> 💡 **CoT 是 Agent 推理的基础！** 在提示中加入 "Let's think step by step" 即可激活。

### 2.4 自我一致性（Self-Consistency）

- 对同一问题多次采样（temperature > 0）
- 取出现最多的答案
- 提高推理可靠性

### 2.5 思维树（Tree of Thoughts）

```
问题：如何提高产品销量？

请考虑至少 3 条不同的思路，对每条思路评估可行性，
然后选择最优方案详细展开。
```

---

## 三、与 Agent 相关的关键技术

### 3.1 ReAct（Reasoning + Acting）

ReAct 是 Agent 最核心的范式：

```
问题：2024年奥运会在哪里举办？

思考：我需要搜索2024年奥运会的信息
行动：search("2024年奥运会举办地")
观察：2024年夏季奥运会在法国巴黎举办

思考：我已经得到了答案
回答：2024年奥运会在法国巴黎举办。
```

**ReAct 循环**：
```
Thought（思考）→ Action（行动）→ Observation（观察）→ 循环...
```

### 3.2 Function Calling（函数调用）

让 LLM 调用预定义的外部工具：

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "获取指定城市的天气",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {"type": "string", "description": "城市名"}
                },
                "required": ["city"]
            }
        }
    }
]

response = client.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    tools=tools
)
```

### 3.3 系统提示词设计模板

```
你是一个 {角色}。

## 你的能力
- {能力1}
- {能力2}

## 工作流程
1. {步骤1}
2. {步骤2}
3. {步骤3}

## 约束条件
- {约束1}
- {约束2}

## 输出格式
{格式要求}
```

---

## 四、实战练习

### 练习 1：设计一个翻译 Agent 的 System Prompt

```markdown
你是一个专业的中英双语翻译。

规则：
1. 保持原文语气和风格
2. 专业术语使用行业通用译法
3. 不确定的翻译用 [?] 标注
4. 输出格式：
   - 译文
   - 关键术语对照表
```

### 练习 2：用 Few-Shot 实现文本分类

设计 3-5 个示例，让 LLM 对新闻进行分类。

### 练习 3：实现 CoT 数学推理

用链式思考解决 5 道应用题，对比有无 CoT 的准确率差异。

---

## 📚 推荐资源

- 📖 [提示工程指南（中文）](https://www.promptingguide.ai/zh) — **必读**
- 📖 [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- 📖 [Anthropic Prompt Engineering](https://docs.anthropic.com/claude/docs/prompt-engineering)
- 📄 论文：*Chain-of-Thought Prompting Elicits Reasoning* (Wei et al., 2022)
- 📄 论文：*ReAct: Synergizing Reasoning and Acting* (Yao et al., 2023)

---

## ✅ 阶段完成标准

- [ ] 理解 Zero-Shot、Few-Shot、CoT 的区别
- [ ] 能设计高质量的系统提示词
- [ ] 理解 ReAct 循环的核心逻辑
- [ ] 能实现 Function Calling
- [ ] 完成至少 2 个实战练习

**上一阶段** ← [[Agent路线图-01-基础知识]]
**下一阶段** → [[Agent路线图-03-Agent核心原理]]
