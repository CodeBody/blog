-- 1. 获取分类 ID
SET @category_name = '设计美学';
SET @category_id = (SELECT id FROM categories WHERE name = @category_name LIMIT 1);

-- 2. 插入新标签（如果不存在）
INSERT INTO tags (id, name, created_at, updated_at) SELECT 2040725288890343427, 'AI Skill', NOW(), NOW() FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = 'AI Skill');
INSERT INTO tags (id, name, created_at, updated_at) SELECT 2040725288890343428, 'UI/UX', NOW(), NOW() FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = 'UI/UX');
INSERT INTO tags (id, name, created_at, updated_at) SELECT 2040725288890343429, '工程实践', NOW(), NOW() FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = '工程实践');

-- 3. 插入文章
SET @article_id = 2040730000000000002; -- 使用唯一 ID
INSERT INTO articles (id, author_id, category_id, title, content, status, views, published_at, created_at, updated_at)
VALUES (@article_id, 10001, @category_id, '用 frontend-design 打造一眼惊艳的生产级前端界面', '# 用 frontend-design 打造一眼惊艳的生产级前端界面

在 AI 蓬勃发展的今天，“AI 塑料感（AI Slop）”正充斥着互联网：千篇一律的 Inter 字体、饱和度过高的紫色渐变、以及毫无灵魂的卡片堆砌。**frontend-design** 不仅仅是一个工具，它更像是一位拥有挑剔审美的“数字建筑师”，它的使命是打破平庸，通过大胆的视觉叙事和极致的代码实现，打造出真正具备“灵魂”的前端界面。

### 板块 1：什么是 frontend-design？为什么需要它？

| 特性 | 普通 AI 生成 | frontend-design |
| :--- | :--- | :--- |
| **排版** | 默认字体（Arial/Inter/Roboto） | 独特且具有个性的显示字体（Display Font） |
| **色彩** | 随机、温和的调色盘 | 浓烈、对比鲜明且具叙事性的颜色系统 |
| **动效** | 通用的淡入淡出 | 高影响力的页面揭示、交响乐式的延迟动效 |
| **布局** | 规整的网格布局 | 打破常规的非对称、重叠和斜向流 |

### 板块 2：核心架构与目录结构

`frontend-design` 技能的实现不仅仅是生成一段代码，它遵循严谨的工程化路径。以 GitHub 官方 skill 为例，其核心结构如下：

```text
.agent/skills/frontend-design/
├── SKILL.md          # 核心指令集：定义审美哲学与编码准则
├── examples/          # 灵感库：包含 Minimalist, Maximalist, Glassmorphism 等多种风格示例
├── scripts/           # 工具集：辅助生成特定组件
└── README.md          # 使用说明
```

**设计理念**：分层驱动（Aesthetic -> Architecture -> Implementation）。设计师首先确定视觉基调，再构建 CSS 变量系统，最后编写功能代码。

### 板块 3：核心工作流

💡 秘籍：不要急着写第一行代码，先在脑海中完成“视觉定调”。

1.  **Step 1: 理解背景与定调**：确定界面是“暴力极简（Brutalist Minimalism）”还是“复古未来（Retro-Futuristic）”。
2.  **Step 2: 视觉锚点设计**：选择一个让人过目不忘的视觉元素（如：一个巨大的、带动态纹理的标题）。
3.  **Step 3: 响应式实现**：使用现代 CSS（Grid, Flexbox, Clamp()）确保美感在任何屏幕上都得以延续。
4.  **Step 4: 细节打磨（Polish）**：注入微小的动效、杂音纹理（Noise Textures）和精准的阴影。

### 板块 4：编写/使用指南与最佳实践

✅ **Do’’s**:
- 使用 Google Fonts 或自定义字体。
- 善用 CSS 变量 (`--accent-color`)。
- 追求极致的负空间（Negative Space）。

❌ **Don’ts**:
- 避免使用传统的“蓝色主调”白底设计。
- 拒绝使用标准的 `border-radius: 4px` 这种毫无个性的圆角。

### 板块 5：评测/验证体系

一个完美的 `frontend-design` 作品应通过以下验证：
- **视觉一致性**：颜色、排版和动效是否服务于同一个主题？
- **难忘指数**：用户在关闭页面 10 秒后，是否还能回想起它的特征？
- **技术性能**：即使使用了复杂的渐变和动画，也要确保秒开。

### 板块 6：高级特性/优化技巧

*   **梯度网格 (Gradient Meshes)**：使用多个阴影重叠，创造出如液体般的流转效果。
*   **动态噪点 (Dynamic Noise)**：为背景添加一层极其微弱的 `opacity: 0.05` 的噪点贴图，能瞬间提升界面的“有机感”。

### 板块 7：实战演练

以下是一个实现“玻璃拟态（Glassmorphism）”极致质感的核心 CSS 片段：

```css
.premium-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  border-radius: 20px;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

.premium-card:hover {
  transform: translateY(-5px) scale(1.02);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```', 1, 0, NOW(), NOW(), NOW());

-- 4. 关联标签
INSERT INTO article_tags (article_id, tag_id)
SELECT @article_id, id FROM tags WHERE name IN ('AI Skill', 'UI/UX', '工程实践');
