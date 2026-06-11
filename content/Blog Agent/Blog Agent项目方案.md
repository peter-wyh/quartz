---
tags: [项目方案, Blog-Agent, AI-Agent]
项目: Blog文章生成Agent
状态: 规划中
created: 2025-06-11
---

# Blog 文章内容生成 Agent — 项目方案

## 一、项目概述

### 1.1 目标

构建一个 AI Agent，能够**自动化生成高质量 Blog 文章**，支持从选题、调研、撰写到发布的全流程。

### 1.2 核心能力

```
选题策划 → 素材搜集 → 大纲生成 → 正文撰写 → 校审润色 → 排版输出 → 发布
```

### 1.3 期望效果

| 指标 | 目标 |
|------|------|
| 单篇文章生成时间 | 5-15 分钟 |
| 文章质量 | 接近人工撰写水平 |
| 人工介入程度 | 仅需选题确认 + 最终审核 |
| 支持语言 | 中文为主，可扩展英文 |
| 输出格式 | Markdown / HTML |

---

## 二、功能模块设计

### 2.1 功能全景

```
┌─────────────────────────────────────────────────┐
│              Blog 文章生成 Agent                  │
│                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐    │
│  │ 选题引擎 │ │ 调研引擎 │ │  写作引擎    │    │
│  │ Topic    │ │ Research │ │  Writing     │    │
│  └──────────┘ └──────────┘ └──────────────┘    │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐    │
│  │ 校审引擎 │ │ SEO 优化 │ │  发布引擎    │    │
│  │ Review   │ │ SEO      │ │  Publish     │    │
│  └──────────┘ └──────────┘ └──────────────┘    │
│                                                 │
│  ┌──────────────────────────────────────────┐   │
│  │           记忆 & 知识库                   │   │
│  │  品牌语料 | 历史文章 | 用户偏好 | 热点库  │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### 2.2 各模块职责

#### 📌 模块一：选题引擎（Topic Agent）

```
输入：行业/关键词/热点趋势
输出：3-5 个推荐选题 + 理由

功能：
- 抓取行业热点（微博热搜、知乎热榜、Google Trends）
- 分析竞品博客近期的选题方向
- 结合历史文章避免重复
- 评估选题的搜索量和竞争度
```

**示例输出：**
```yaml
推荐选题:
  - 标题: "2025年AI Agent开发入门完全指南"
    理由: "AI Agent搜索量月增200%，竞争度中等"
    预估流量: 高
    难度: ⭐⭐
    
  - 标题: "LangGraph实战：构建你的第一个Agent"
    理由: "LangGraph热度持续上升，实操内容稀缺"
    预估流量: 中高
    难度: ⭐⭐⭐
```

#### 📌 模块二：调研引擎（Research Agent）

```
输入：确定的选题
输出：素材包（关键数据、观点、引用来源）

功能：
- 搜索引擎获取最新资料
- 抓取相关文章/论文摘要
- 提取关键数据和观点
- 标注来源和可信度
- 生成参考文献列表
```

**素材包结构：**
```yaml
素材包:
  核心观点:
    - "Agent市场预计2025年达到XXX亿"
    - "70%的企业已开始探索Agent应用"
  关键数据:
    - 来源: Gartner报告
      数据: "..."
  参考文章:
    - 标题: "xxx"
      链接: "https://..."
      摘要: "..."
  专家观点:
    - 人物: "xxx"
      观点: "..."
```

#### 📌 模块三：写作引擎（Writing Agent）

```
输入：选题 + 素材包 + 风格指南
输出：完整 Blog 文章

功能：
- 生成文章大纲（支持人工确认/修改）
- 按大纲逐节撰写
- 自动插入图表/代码块
- 保持品牌统一的写作风格
- 生成摘要和关键词
```

#### 📌 模块四：校审引擎（Review Agent）

```
输入：初稿文章
输出：修改建议 / 修订稿

功能：
- 语法和拼写检查
- 逻辑连贯性审查
- 事实核查（与素材对比）
- 可读性评分
- 查重检测
- 敏感词检查
```

#### 📌 模块五：SEO 优化引擎（SEO Agent）

```
输入：完成的文章
输出：SEO 优化后的文章 + 元数据

功能：
- 标题优化（包含核心关键词）
- Meta Description 生成
- 关键词密度分析
- 标题层级检查（H1/H2/H3）
- 内链建议（关联历史文章）
- 图片 Alt 文本生成
- URL Slug 生成
```

**SEO 元数据输出：**
```yaml
seo:
  title: "2025年AI Agent开发入门完全指南 | 你的博客名"
  description: "从零开始学习AI Agent开发..."
  keywords: ["AI Agent", "Agent开发", "LangChain"]
  slug: "ai-agent-development-guide-2025"
  og_image: "/images/ai-agent-guide.png"
```

#### 📌 模块六：发布引擎（Publish Agent）

```
输入：终稿 + SEO 元数据
输出：发布到目标平台

支持平台：
- WordPress (REST API)
- Hugo / Jekyll (静态文件)
- Hexo (Markdown 文件)
- 自建博客 (API)
- Ghost
```

---

## 三、多 Agent 架构设计

### 3.1 架构图

```
                    ┌─────────────┐
                    │   用户输入   │
                    │ 选题/关键词  │
                    └──────┬──────┘
                           ↓
                    ┌──────────────┐
                    │  Orchestrator │ ← 编排者 Agent（总调度）
                    │  编排者       │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              ↓            ↓            ↓
       ┌───────────┐ ┌──────────┐ ┌──────────┐
       │ Topic     │ │ Research │ │ Writing  │
       │ Agent     │ │ Agent    │ │ Agent    │
       │ 选题策划  │ │ 素材调研 │ │ 内容撰写 │
       └─────┬─────┘ └────┬─────┘ └────┬─────┘
             │             │            │
             └─────────────┼────────────┘
                           ↓
                    ┌──────────────┐
                    │   Review     │
                    │   Agent      │
                    │   校审润色   │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │   SEO Agent  │
                    │   SEO优化    │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │  Publish     │
                    │  Agent       │
                    │  发布上线    │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │  ✅ 文章上线  │
                    └──────────────┘
```

### 3.2 工作流设计

```yaml
workflow:
  name: blog_article_generation
  steps:
    - step: 1
      agent: TopicAgent
      action: 生成选题推荐
      input: "行业关键词"
      output: "选题列表"
      human_review: true    # 需要人工确认选题

    - step: 2
      agent: ResearchAgent
      action: 调研搜集素材
      input: "确定的选题"
      output: "素材包"
      tools: [web_search, web_scrape, arxiv_search]

    - step: 3
      agent: WritingAgent
      action: 生成大纲
      input: "选题 + 素材包"
      output: "文章大纲"
      human_review: true    # 需要人工确认大纲

    - step: 4
      agent: WritingAgent
      action: 撰写正文
      input: "大纲 + 素材包"
      output: "文章初稿"

    - step: 5
      agent: ReviewAgent
      action: 校审润色
      input: "文章初稿"
      output: "修订稿"

    - step: 6
      agent: SEOOptAgent
      action: SEO优化
      input: "修订稿"
      output: "SEO优化稿 + 元数据"

    - step: 7
      agent: PublishAgent
      action: 发布
      input: "终稿 + 元数据"
      output: "发布状态"
      human_review: true    # 发布前最终确认
```

---

## 四、技术方案

### 4.1 技术栈选型

```
┌─────────────────────────────────────────┐
│             技术架构                     │
│                                         │
│  框架层:  LangGraph（Agent 编排）       │
│  模型层:  GPT-4o / Claude / GLM-4      │
│  搜索层:  Tavily Search / SerpAPI       │
│  存储层:  ChromaDB（向量）+ SQLite      │
│  发布层:  WordPress API / Hexo          │
│  部署层:  Docker + FastAPI              │
│  监控层:  Langfuse                      │
└─────────────────────────────────────────┘
```

### 4.2 技术选型理由

| 组件 | 选型 | 理由 |
|------|------|------|
| **Agent 框架** | LangGraph | 工作流可视化、状态管理、人机交互节点 |
| **主模型** | GPT-4o / Claude | 写作质量高，长文本能力强 |
| **辅助模型** | GPT-4o-mini | 选题分析、SEO检查等轻量任务，降本 |
| **搜索** | Tavily Search | 专为 AI Agent 设计的搜索 API |
| **向量数据库** | ChromaDB | 轻量，本地运行，存储品牌语料和历史文章 |
| **前端** | Gradio / Streamlit | 快速搭建交互界面 |
| **API** | FastAPI | 异步、高性能、自动文档 |

### 4.3 目录结构

```
blog-agent/
├── README.md
├── pyproject.toml
├── .env.example
│
├── src/
│   ├── __init__.py
│   ├── main.py                 # 入口
│   ├── config.py               # 配置
│   │
│   ├── agents/                 # 各 Agent 定义
│   │   ├── __init__.py
│   │   ├── orchestrator.py     # 编排者
│   │   ├── topic_agent.py      # 选题 Agent
│   │   ├── research_agent.py   # 调研 Agent
│   │   ├── writing_agent.py    # 写作 Agent
│   │   ├── review_agent.py     # 校审 Agent
│   │   ├── seo_agent.py        # SEO Agent
│   │   └── publish_agent.py    # 发布 Agent
│   │
│   ├── tools/                  # 工具定义
│   │   ├── __init__.py
│   │   ├── search.py           # 搜索工具
│   │   ├── scraper.py          # 网页抓取
│   │   ├── seo_analyzer.py     # SEO 分析
│   │   └── publisher.py        # 发布工具
│   │
│   ├── memory/                 # 记忆系统
│   │   ├── __init__.py
│   │   ├── brand_voice.py      # 品牌语料库
│   │   ├── article_history.py  # 历史文章
│   │   └── vector_store.py     # 向量存储
│   │
│   ├── prompts/                # Prompt 模板
│   │   ├── topic_prompt.py
│   │   ├── outline_prompt.py
│   │   ├── writing_prompt.py
│   │   ├── review_prompt.py
│   │   └── seo_prompt.py
│   │
│   ├── workflow/               # 工作流定义
│   │   ├── __init__.py
│   │   └── blog_workflow.py    # LangGraph 工作流
│   │
│   └── utils/                  # 工具函数
│       ├── __init__.py
│       ├── token_counter.py
│       └── format_converter.py
│
├── data/
│   ├── brand_voice/            # 品牌语料
│   ├── templates/              # 文章模板
│   └── output/                 # 生成输出
│
├── tests/
│   ├── test_agents/
│   ├── test_tools/
│   └── test_workflow/
│
├── web/                        # Web 界面（可选）
│   └── app.py                  # Gradio/Streamlit
│
└── docker/
    ├── Dockerfile
    └── docker-compose.yml
```

---

## 五、Prompt 设计方案

### 5.1 品牌风格指南（Brand Voice）

```markdown
## 品牌写作风格

### 语调
- 专业但不生硬，像资深技术专家在和朋友聊天
- 适当使用比喻和类比，让复杂概念易懂
- 避免过度使用"震撼""革命性"等夸张词汇

### 格式
- 标题用数字或疑问句（"5个技巧…""如何…""为什么…"）
- 每节开头用一句话总结
- 代码示例必须完整可运行
- 关键结论用 ✅ 加粗标注
- 段落不超过 4 句话

### 长度
- 标准文章：2000-3500 字
- 深度文章：3500-5000 字
- 快讯类：800-1500 字

### 禁止
- ❌ 不生成虚假数据或编造引用
- ❌ 不抄袭已有文章
- ❌ 不使用 AI 痕迹过重的表述（"总之""值得注意的是"）
```

### 5.2 大纲生成 Prompt

```markdown
你是一位资深技术博客编辑。

## 任务
根据以下选题和素材，生成一篇博客文章的详细大纲。

## 选题
{topic}

## 素材
{research_materials}

## 要求
1. 大纲至少包含 3 级标题（H1/H2/H3）
2. 每个章节标注预估字数
3. 标注需要插入代码/图表的位置
4. 开头要有吸引人的引入
5. 结尾要有总结和行动号召（CTA）

## 输出格式
```yaml
title: 文章标题
outline:
  - section: 引言
    points: [...]
    estimated_words: 200
  - section: 核心内容一
    subsections: [...]
    estimated_words: 500
```
```

### 5.3 正文撰写 Prompt

```markdown
你是一位技术博客写手，请按照以下要求撰写文章。

## 风格指南
{brand_voice}

## 文章大纲
{outline}

## 参考素材
{materials}

## 要求
1. 严格按照大纲结构撰写
2. 每个观点都要有数据或案例支撑
3. 代码示例用 ```代码块包裹
4. 自然融入关键词：{keywords}
5. 段落简洁，每段不超过4句
6. 使用 Markdown 格式
```

---

## 六、关键工具实现

### 6.1 搜索工具

```python
from tavily import TavilyClient

async def web_search(query: str, max_results: int = 5) -> list[dict]:
    """搜索互联网获取最新资料"""
    client = TavilyClient(api_key=settings.TAVILY_API_KEY)
    results = client.search(
        query=query,
        max_results=max_results,
        search_depth="advanced"
    )
    return results
```

### 6.2 网页抓取工具

```python
import httpx
from readability import Document

async def scrape_webpage(url: str) -> dict:
    """抓取网页正文内容"""
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, timeout=30)
        doc = Document(resp.text)
        return {
            "title": doc.title(),
            "content": doc.summary(),
            "url": url
        }
```

### 6.3 SEO 分析工具

```python
def analyze_seo(article: str, keyword: str) -> dict:
    """分析文章 SEO 质量"""
    return {
        "keyword_density": calculate_keyword_density(article, keyword),
        "title_score": score_title(article.title, keyword),
        "heading_structure": check_headings(article),
        "readability_score": flesch_reading_ease(article),
        "word_count": len(article.split()),
        "meta_description_length": ...,
        "internal_link_suggestions": ...,
    }
```

### 6.4 发布工具

```python
import httpx

async def publish_to_wordpress(
    title: str,
    content: str,
    categories: list[str],
    tags: list[str],
    status: str = "draft"
) -> dict:
    """发布到 WordPress"""
    wp_url = f"{settings.WP_URL}/wp-json/wp/v2/posts"
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            wp_url,
            auth=(settings.WP_USER, settings.WP_APP_PASSWORD),
            json={
                "title": title,
                "content": content,
                "status": status,
                "categories": categories,
                "tags": tags,
            }
        )
    return resp.json()
```

---

## 七、人机交互设计

### 7.1 交互节点

```
选题推荐 ──→ [用户确认选题] ──→ 调研
                                    ↓
大纲生成 ──→ [用户确认/修改大纲] ──→ 撰写
                                       ↓
                               校审 + SEO
                                       ↓
                              [用户最终审核] ──→ 发布
```

### 7.2 交互方式

| 方式 | 说明 |
|------|------|
| **命令行** | 最简单，直接终端操作 |
| **Web 界面** | Gradio/Streamlit 搭建 |
| **Feishu 机器人** | 在飞书中交互（推荐！） |
| **Obsidian 插件** | 在 Obsidian 中触发 |

---

## 八、成本估算

### 8.1 单篇文章 Token 消耗估算

| 步骤 | 输入 Token | 输出 Token | 模型 | 预估费用 |
|------|-----------|-----------|------|---------|
| 选题分析 | 1,000 | 500 | GPT-4o-mini | ¥0.03 |
| 素材调研 | 3,000 | 1,500 | GPT-4o-mini | ¥0.09 |
| 生成大纲 | 2,000 | 1,000 | GPT-4o | ¥0.30 |
| 撰写正文 | 5,000 | 4,000 | GPT-4o | ¥1.50 |
| 校审润色 | 5,000 | 3,000 | GPT-4o | ¥1.10 |
| SEO 优化 | 3,000 | 1,000 | GPT-4o-mini | ¥0.06 |
| **合计** | **19,000** | **11,000** | — | **≈ ¥3-5** |

> 💡 使用 GPT-4o 单篇约 ¥3-5，使用国产模型可降至 ¥1-2。

---

## 九、开发计划

### Phase 1：MVP（第 1-2 周）

```
目标：能生成一篇完整文章

- [ ] 项目初始化（LangGraph + FastAPI）
- [ ] Writing Agent（核心写作能力）
- [ ] 简单命令行交互
- [ ] Markdown 文件输出
```

### Phase 2：调研能力（第 3 周）

```
目标：能自动搜集素材

- [ ] 集成 Tavily Search
- [ ] Research Agent 实现
- [ ] 素材整理和引用标注
```

### Phase 3：选题 + SEO（第 4 周）

```
目标：选题推荐和 SEO 优化

- [ ] Topic Agent（热点分析）
- [ ] SEO Agent（关键词优化）
- [ ] 品牌风格指南集成
```

### Phase 4：校审 + 发布（第 5 周）

```
目标：自动校审和发布

- [ ] Review Agent（语法、逻辑、事实核查）
- [ ] WordPress / Hexo 发布集成
- [ ] 完整工作流串联
```

### Phase 5：优化 & 界面（第 6 周）

```
目标：打磨用户体验

- [ ] Web 界面（Gradio）
- [ ] 记忆系统（品牌语料、历史文章）
- [ ] 成本优化（模型路由）
- [ ] 监控（Langfuse）
```

---

## 十、风险与应对

| 风险 | 影响 | 应对策略 |
|------|------|---------|
| 生成内容质量不稳定 | 文章不可用 | Review Agent 多轮校审 + 人工兜底 |
| 搜索 API 返回低质量素材 | 内容空洞 | 多源搜索 + 可信度过滤 |
| Token 成本超预期 | 预算超标 | 模型路由 + 预算限制 + 缓存 |
| 发布平台 API 变更 | 发布失败 | 适配器模式，解耦发布逻辑 |
| 内容重复/抄袭 | SEO 惩罚 | 查重检测 + 原创性评分 |

---

## 📎 相关笔记

- [[Agent路线图-00-总览]] — Agent 学习路线图
- [[Agent路线图-04-框架实战]] — LangGraph 实战
- [[Agent路线图-06-生产级开发]] — 生产级部署

---

> 💡 **下一步**：确认方案后，可以从 Phase 1 开始动手搭建。需要我帮你开始编码吗？
