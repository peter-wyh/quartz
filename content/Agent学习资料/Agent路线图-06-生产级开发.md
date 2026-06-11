---
tags: [AI-Agent, 学习路线图, 阶段六, 生产级开发]
阶段: 六
预计时间: 2-4周
前置要求: "[[Agent路线图-05-多Agent系统]]"
created: 2025-06-11
---

# 阶段六：生产级 Agent 开发

## 🎯 目标

掌握将 Agent 从原型推向生产环境所需的工程能力：评估、监控、安全、部署。

---

## 一、Agent 评估（Evaluation）

### 1.1 为什么评估 Agent 很难？

- 非确定性输出：同一输入可能产生不同结果
- 多步推理：错误可能在任何步骤发生
- 工具调用：工具执行结果影响后续行为
- 长流程：端到端评估复杂

### 1.2 评估维度

| 维度 | 指标 | 方法 |
|------|------|------|
| **准确性** | 回答正确率 | 人工标注 + LLM-as-Judge |
| **工具使用** | 工具选择正确率 | 对比预期工具调用 |
| **效率** | 平均步数、Token 消耗 | 日志统计 |
| **鲁棒性** | 边界情况处理 | 对抗测试 |
| **延迟** | 响应时间 | 端到端计时 |

### 1.3 评估框架

```python
# LLM-as-Judge 示例
def evaluate_response(query: str, response: str, reference: str) -> dict:
    prompt = f"""
    评估以下回答的质量：
    
    问题：{query}
    回答：{response}
    参考答案：{reference}
    
    请从以下维度评分（1-5分）：
    1. 准确性：回答是否正确
    2. 完整性：是否覆盖所有要点
    3. 简洁性：是否简洁明了
    """
    # 调用 LLM 进行评分
    ...
```

### 1.4 自动化测试

```python
import pytest

class TestAgent:
    def test_simple_query(self):
        result = agent.run("今天的天气")
        assert result is not None
        assert len(result) > 0
    
    def test_tool_calling(self):
        result = agent.run("搜索最新的 AI 新闻")
        assert "search" in agent.tool_calls_history
    
    def test_error_handling(self):
        result = agent.run("无效的查询 {{{}}")
        assert "error" not in result.lower() or "抱歉" in result
```

---

## 二、Agent 监控与可观测性

### 2.1 核心监控指标

```
┌──────────────────────────────────┐
│        Agent 监控面板             │
│                                  │
│  📊 Token 消耗趋势              │
│  ⏱️ 平均响应时间                │
│  🔧 工具调用频率                │
│  ❌ 错误率                      │
│  💰 成本追踪                    │
│  📈 用户满意度                  │
└──────────────────────────────────┘
```

### 2.2 日志设计

```python
import structlog

logger = structlog.get_logger()

# 每一步都记录
log = logger.bind(
    session_id="xxx",
    user_id="xxx",
    agent_name="research_agent"
)

log.info("agent_thought", thought="需要搜索相关信息", step=1)
log.info("tool_call", tool="search", args={"query": "AI Agent"}, step=2)
log.info("tool_result", result="...", step=3)
log.info("agent_response", response="...", step=4, tokens=500)
```

### 2.3 追踪工具

- **LangSmith**：LangChain 官方追踪平台
- **Langfuse**：开源 LLM 可观测性平台
- **Weights & Biases Weave**：实验追踪

---

## 三、安全与防护

### 3.1 常见安全风险

| 风险 | 说明 | 防护措施 |
|------|------|---------|
| **Prompt 注入** | 恶意输入篡改 Agent 行为 | 输入过滤 + System Prompt 防护 |
| **工具滥用** | Agent 调用危险工具 | 权限控制 + 审批机制 |
| **数据泄露** | Agent 泄露敏感信息 | 输出过滤 + 数据脱敏 |
| **无限循环** | Agent 陷入死循环 | 最大步数限制 |
| **成本爆炸** | Token 消耗失控 | 预算限制 + 用量告警 |

### 3.2 安全最佳实践

```python
# 1. 输入过滤
def sanitize_input(user_input: str) -> str:
    """过滤潜在的危险输入"""
    # 移除可能的注入指令
    dangerous_patterns = [
        "忽略之前的指令",
        "ignore previous instructions",
        "你现在是",
    ]
    for pattern in dangerous_patterns:
        if pattern in user_input.lower():
            raise ValueError("检测到可疑输入")
    return user_input

# 2. 工具权限控制
TOOL_PERMISSIONS = {
    "search_web": {"rate_limit": 10, "allowed": True},
    "execute_code": {"rate_limit": 5, "allowed": True, "sandbox": True},
    "delete_file": {"rate_limit": 0, "allowed": False},  # 禁止
}

# 3. 输出过滤
def filter_output(response: str) -> str:
    """过滤敏感信息"""
    # 检查是否包含 API key、密码等
    ...
```

---

## 四、成本优化

### 4.1 Token 优化策略

| 策略 | 效果 | 实现难度 |
|------|------|---------|
| 精简 System Prompt | 减少 30-50% Token | ⭐ |
| 使用 GPT-4o-mini 处理简单任务 | 降低成本 90% | ⭐ |
| 缓存频繁查询 | 减少重复调用 | ⭐⭐ |
| 上下文压缩 | 压缩历史消息 | ⭐⭐⭐ |
| 路由到合适的模型 | 按任务复杂度选模型 | ⭐⭐ |

### 4.2 模型路由

```python
def route_model(query: str) -> str:
    """根据任务复杂度选择模型"""
    simple_patterns = ["翻译", "总结", "格式化"]
    if any(p in query for p in simple_patterns):
        return "gpt-4o-mini"  # 便宜快速
    return "gpt-4o"  # 复杂任务用强模型
```

---

## 五、部署架构

### 5.1 基础架构

```
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌─────────┐
│  用户   │───→│ API 网关 │───→│ Agent    │───→│  LLM    │
│  请求   │    │ Gateway  │    │ Service  │    │  API    │
└─────────┘    └──────────┘    └──────────┘    └─────────┘
                                    │
                               ┌────┼────┐
                               ↓    ↓    ↓
                            ┌────┐┌────┐┌────┐
                            │工具││记忆││向量│
                            │服务││存储││DB  │
                            └────┘└────┘└────┘
```

### 5.2 部署方式

| 方式 | 适用场景 | 工具 |
|------|---------|------|
| **API 服务** | Web/移动端接入 | FastAPI + Docker |
| **异步任务** | 长时间运行的任务 | Celery + Redis |
| **Serverless** | 按需调用 | AWS Lambda / Vercel |
| **实时通信** | 对话式 Agent | WebSocket + Socket.IO |

---

## 六、实战项目

### 项目：生产级 Research Agent

```
功能需求：
- 输入研究主题，自动生成研究报告
- 支持多来源搜索（学术、新闻、博客）
- 引用来源，标注可信度
- 输出 Markdown / PDF 格式

工程要求：
- 异步处理（Celery）
- 进度追踪（WebSocket）
- 错误恢复（重试机制）
- 成本控制（Token 预算）
- 监控告警（Langfuse）
- 单元测试（pytest）
- CI/CD（GitHub Actions）

技术栈：
FastAPI + Celery + Redis + LangGraph + Langfuse + Docker
```

---

## 📚 推荐资源

- 📖 [LangSmith 文档](https://docs.smith.langchain.com/)
- 📖 [Langfuse 文档](https://langfuse.com/docs)
- 📖 [OWASP LLM Security](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- 📺 Building Production LLM Apps - Full Stack LLM Bootcamp
- 📖 [Hermes Agent 源码](https://github.com/NousResearch/hermes-agent) — 生产级 Agent 参考

---

## ✅ 阶段完成标准

- [ ] 能为 Agent 设计评估方案
- [ ] 实现基本的监控和日志
- [ ] 理解常见安全风险及防护
- [ ] 完成一个带部署的完整项目
- [ ] 掌握成本优化策略

**上一阶段** ← [[Agent路线图-05-多Agent系统]]
**下一阶段** → [[Agent路线图-07-前沿探索]]
