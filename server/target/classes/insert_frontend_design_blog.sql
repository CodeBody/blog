-- ============================================
-- 博客文章插入脚本：一天学会 AI Skills：用 frontend-design 终结"AI审美"
-- 执行前请确保已创建 blog 数据库和相关表
-- ============================================

USE blog;

-- 1. 插入用户（如果不存在）
INSERT IGNORE INTO users (id, username, password, email) VALUES
(1, 'alex', '$2a$10$placeholder', 'alex@example.com');

-- 2. 插入分类（如果不存在）
INSERT IGNORE INTO categories (id, name, description) VALUES
(1, 'AI 技术', '人工智能相关技术文章'),
(2, '前端开发', '前端框架与工程化实践');

-- 3. 插入标签（如果不存在）
INSERT IGNORE INTO tags (id, name) VALUES
(1, 'AI'),
(2, 'Claude'),
(3, 'Anthropic'),
(4, 'Skills'),
(11, 'Design Engineering'),
(12, 'UI/UX');

-- 4. 插入文章
INSERT INTO articles (id, author_id, category_id, title, content, status, views, published_at, created_at, updated_at) VALUES
(2, 1, 2, '一天学会 AI Skills：用 frontend-design 终结"AI审美"',
'# 一天学会 AI Skills：用 frontend-design 终结"AI审美"

> 告别千篇一律的紫蓝渐变和居中大圆角，让 Claude 从"写码机器"化身为"资深设计工程师（Design Engineer）"。

如果你经常用大模型帮你写前端 UI，你一定对所谓的 **"AI 审美 (AI Slop)"** 不陌生。大模型默认生成的 UI 往往长得一模一样：永远的 Inter 或 Arial 字体、标准的卡片阴影、毫无层次的间距，以及那种说不出哪里不对但就是显得"廉价"的紫蓝渐变。

今天，我们要学习的是 Anthropic 官方提供的一个极其强大的技能——**`frontend-design`**。它通过一套精心设计的指令和规范，彻底扭转了模型的默认设计偏好，强制要求模型在写任何一行代码之前，**先以设计师的视角思考**。

📦 **项目地址**：[anthropics/skills/skills/frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design)

---

## 1. 什么是 frontend-design？为什么需要它？

### 核心定位

`frontend-design` 是供 Claude Code（或任何兼容的 AI Agent）加载的专属标准操作手册。它不提供具体的 React 或 Vue 模板代码，而是提供**设计直觉和审美边界**。

### 适用人群

- 独立开发者：想做出看起来像请了专业设计师打造的独立产品。
- 前端工程师：希望利用 AI 快速搭建高质量原型，而不是产出需要二次重构的废品。

### 解决什么痛点？

| 痛点 | "AI 默认输出" | `frontend-design` 技能的解法 |
|------|---------------|--------------------------|
| **视觉千篇一律** | 大圆角卡片、居中排版、紫/蓝主色调 | 强制探索单色系、非对称排版、有情绪调性的色彩 |
| **缺乏层级感** | 所有元素权重一模一样 | 严格依靠字重、对比度和空间布局（空白）建立视觉层级 |
| **生硬的交互** | 无过渡动画或无意义的弹跳 | 定义微交互（micro-interactions）的缓动曲线和时机 |
| **为代码而代码** | 直接开始 `<div>` 嵌套 | **先写设计系统规范，再写代码** |

---

## 2. 核心架构与目录结构

这个 Skill 的精妙之处在于它不仅是一段提示词，而是一个微型的**设计框架体系**。

```text
frontend-design/
├── SKILL.md                ← 核心指令文件，控制 AI 的设计理念和行为模式
└── references/             ← 具体的领域设计知识库
    ├── typography.md       ← 字体配对与排版层次字典表
    ├── spacing.md          ← 间距与网格系统规范
    ├── motion.md           ← 动画缓动函数与持续时间参考
    └── accessibility.md    ← WCAG 对比度等无障碍标准
```

### 为何这样设计？

采用了**核心理念 + 模块化参考**的分层设计。`SKILL.md` 教 AI "如何像设计师一样思考"，而当 AI 决定使用特定的排版或者动画时，会自动去 `references/` 读取更细致的技术参数表。这保证了 Token 的高效利用。

---

## 3. 核心工作流

当用户提出 "帮我写一个登录页面" 或任何涉及前端 UI 的需求时，该 Skill 将触发以下严密的工作闭环：

```text
接收需求 → 分析品牌调性 → 制定设计系统(Design Tokens) → 空间与排版布局 → 编写代码实现
   ↑                                                                  |
   └────────────────────── 用户反馈 / 调整交互 ──────────────────────────┘
```

### Step 1: 从默认审美中"解毒"（De-programming）
Skill 强制 Claude 在分析需求后，第一步先写下一段话：*“放弃所有预设的紫蓝渐变、大圆角等默认模式。”* 这一步是为了清空 AI 的缓存路径。

### Step 2: 确立情绪板与调性（Mood & Tone）
Claude 需要挑选 3 个描绘产品情感的形容词（如：克制、工业风、极简主义），然后根据这三个词匹配专属的字体（如用 Space Grotesk 替代 Inter）和色彩空间。

### Step 3: 定义 Design Tokens
确定排印（Typography）层级、间距倍数规则与基础色板，不直接硬编码 CSS。

### Step 4: 执行组件级渲染
在完成思考后，最后再输出代码，确保界面严格遵循刚刚制定的 Tokens 体系。

---

## 4. 编写/使用指南与最佳实践

### ✅ 最佳实践：提供意象隐喻
在使用 Claude 配合本技能时，你的提示词无需涉及太多技术细节，你可以说：
> 💡 *“帮我设计一个 SaaS 数据面板，我希望它有像 Notion 一样克制、极简的学术感，纸张一样的白色背景配上深灰色的字。不要用任何花哨的彩色阴影。”*

### ❌ 反面模式：微观指挥
使用本技能后，**不要**再去教 AI 怎么写 CSS。
> ❌ *“帮我写一个按钮，padding设为10px，margin是5px，用绝对定位放在右上角。”* （这会导致冲突，因为 AI 已经被设定为使用标准的间距倍数系统，你的微观指挥会破坏系统）。

---

## 5. 评测/验证体系

Anthropic 官方在开发这个技能时，内部是如何评定它的好坏的？

1. **盲测对比（Blind A/B Testing）**：将生成出的静态 HTML 给人类设计师审核，不告知哪一个是使用了 `frontend-design` 生成的。
2. **"Slop" 检测器**：通过自动化脚本检查生成的代码中是否又出现了 `#4F46E5` (Indigo 色)、过度的 `box-shadow` 或者 `border-radius: 9999px`。
3. **响应式及可访问性检查**：用 Lighthouse 等工具检测生成的 HTML 是否自带良好的结构和无障碍（a11y）标签，这也是设计工程师的重要职责。

---

## 6. 高级特性：动态微动效生成

很多时候，界面显得突兀是因为缺乏动画。`frontend-design` 在其内部高级规范中，要求 AI 在悬停状态（Hover）和状态切换时引入微交互。

它内置了弹簧动画（Spring）的参数生成习惯，而不是简单的 `linear`。你会发现，使用这个技能后，生成的按钮悬浮动画都会带有丝滑的 `cubic-bezier(0.4, 0, 0.2, 1)`（Ease-out 曲线）。

---

## 7. 实战演练：生成一个高级博客文章卡片

我们在终端中启动加载了该技能的 Claude Code，然后输入一个看似非常简单的需求：

**需求**：
> "用 Tailwind CSS 和 React 写一个博客文章的展示卡片组。"

**如果没有技能 (默认表现)**：
它通常会输出一个标准的三列网格结构（Grid），里面放上有着大圆角和蓝色背景的文章卡片，没有考虑文字阅读体验，行高往往是 1.5 的默认值。

**有了 frontend-design 技能**：
1. **思考过程展示**：Claude 会先在终端打印 *"摒弃默认卡片设计。博客阅读的核心是文字，我们将采用大量的留白。字体选用 serif 衬线体增加人文感。"*
2. **成品亮点**：
   - 没用明显的边框线来区分卡片，而是完全利用**空间间距 (Space)** 来组织内容。
   - 引入了 `tracking-tight` 来收紧标题的字间距，让排版更现代。
   - 色彩体系使用了极度克制的锌灰色系 (`zinc-900`, `zinc-500`)。
3. **输出代码 (部分缩略)**:
```tsx
export function ArticleCard({ title, date, excerpt }) {
  return (
    <article className="group flex flex-col items-start justify-between py-6 max-w-2xl">
      <div className="flex items-center gap-x-4 text-xs">
        <time dateTime={date} className="text-zinc-500 font-mono">
          {date}
        </time>
      </div>
      <div className="group relative">
        <h3 className="mt-3 text-lg font-semibold leading-6 text-zinc-900 tracking-tight group-hover:text-zinc-600 transition-colors duration-300">
          <a href="#">
            <span className="absolute inset-0" />
            {title}
          </a>
        </h3>
        <p className="mt-5 line-clamp-3 text-sm leading-6 text-zinc-600">
          {excerpt}
        </p>
      </div>
    </article>
  )
}
```

通过这个技能，你可以明显感到 AI 在**设计**你的代码，而不是仅仅在**写**代码。赶快把 `frontend-design` 加入到你的 AI Agent 工具箱中吧！',
1, 0, '2026-04-03 16:30:00', '2026-04-03 16:30:00', '2026-04-03 16:30:00');

-- 5. 插入文章-标签关联
INSERT IGNORE INTO article_tags (article_id, tag_id) VALUES
(2, 1),   -- AI
(2, 2),   -- Claude
(2, 4),   -- Skills
(2, 11),  -- Design Engineering
(2, 12);  -- UI/UX
