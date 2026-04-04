-- 1. 获取背景：从 API 知 "AI技术" ID 为 1
SET @category_id = 1;

-- 2. 处理标签：部分复用已有，部分新建
-- "Skills" (ID: 4) 和 "UI/UX" (ID: 12) 已存在
-- 插入新标签（仅当不存在时）
INSERT INTO tags (id, name, created_at, updated_at)
SELECT 1712210000002, 'Frontend', NOW(), NOW() FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Frontend');
INSERT INTO tags (id, name, created_at, updated_at)
SELECT 1712210000004, 'Anti-Slop', NOW(), NOW() FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Anti-Slop');

-- 3. 插入文章
SET @article_id = 20260404105001;
INSERT INTO articles (id, author_id, category_id, title, content, status, views, published_at, created_at, updated_at)
VALUES (
    @article_id,
    1,
    @category_id,
    '用 anti-slop-design 打造拒绝“AI味”的高级感界面',
    '# 一天学会一个 AI Skill：用 anti-slop-design 打造拒绝“AI味”的高级感界面

### 板块 1：什么是 anti-slop-design？为什么需要它？

**anti-slop-design**（防平庸设计技能）是一个专注于提升 AI 生成 UI 审美上限的专业技能。它的核心目标是打破 AI 常见的“出厂设置感”——那些一眼就能看出的、千篇一律的配色和布局。

| 特性 | 普通 AI 生成 | 用了 anti-slop-design 之后 |
|------|-------------|-------------------------|
| **字体** | 默认 Inter/System Sans | 考究的字体配对（如 Serif + Mono） |
| **色彩** | 纯黑、纯白、紫色渐变 | 具有质感的“有色灰”、品牌调性色彩 |
| **布局** | 标准三栏、卡片堆砌 | 具有节奏感的栅格、错位布局、Bento Grid |
| **细节** | 无表情的默认图标 | 精致的 SVG、物理动效、有意义的空白 |

**适用人群**：追求极致产品质感的前端工程师、UI 设计师、以及厌倦了“AI 全家桶”审美的人。

### 板块 2：核心架构与设计理念

该技能采用了“味觉层（Taste Layer）”的设计模式，将审美逻辑从代码实现中解耦。

```text
anti-slop-design/
├── SKILL.md          # 核心指令：审美过滤与味觉层定义
├── references/
│   ├── typography.md # 字体配对库
│   ├── color-palettes.md # 高级感色板
│   └── icons.md      # 规范的 SVG 引用方案
└── assets/           # 优质案例参考
```

**关键设计理念**：
- **审美优先级**：在写代码前，先通过“Category -> Tone -> Memorable Element”三个维度确立风格。
- **拒绝 sameness**：系统性地规避掉 2024 年最泛滥的设计模式（如磨砂玻璃面板、气泡图标等）。

### 板块 3：核心工作流

想要获得高质量输出，必须遵循以下闭环操作：

1.  **Step 0: 环境侦察** 💡：AI 会检查你的 `design-tokens.css` 或 `tailwind.config.js`。
2.  **Step 1: 设计思考 (Design Thinking)** 💡：由于是“防平庸”，AI 会主动选择一种极端的风格（如“硬核密实主义”或“空气感极简”）。
3.  **Step 2: 方案构建** 💡：应用特定的“味觉层”规则，不再搜索通用组件库。
4.  **Step 3: 防平庸审核 (Slop Check)** 💡：二次检查输出，如果发现“Inter 字体 + 20px 圆角卡片”，则根据规则进行重构。

### 板块 4：指南与最佳实践

✅ **Do''s**:
- 使用“有色灰”（如 `slate-950` 加入 2% 蓝调）。
- 标题手动微调 `letter-spacing`。
- 使用物理引擎风格的 `Framer Motion` 弹簧动画（Spring）。

❌ **Don''ts**:
- 严禁使用 Emoji 代替 Icon。
- 严禁使用无意义的背景虚化层。
- 严禁在标题和正文全部使用同一种字体。

### 板块 5：评测/验证体系

如何检测你的 AI 是否变优雅了？
- **量化指标**：检查非默认字体的使用率、色彩对比度（需 > 4.5:1）。
- **定性评估**：观察页面是否有“记忆点”？是否有逻辑性地打破了常规布局？

### 板块 6：高级优化技巧

- **集成 SOUL.md**：如果项目中存在 `SOUL.md`（品牌灵魂文件），它能自动提取品牌调性，让审美更贴合项目。
- **字体预加载**：结合 Google Fonts 或本地字体文件，让视觉效果 100% 还原。

### 板块 7：实战演练

**需求**：为一个“个人技术周刊”生成 Hero Section。

**过程**：
1. **输入**：“帮我写个周刊首页，要硬核一点。”
2. **AI 响应**：触发 anti-slop-design，识别到“Newsletter”分类，选择“暗黑极简（Techno-Minimalist）”风格。
3. **输出片段**：
```jsx
// 采用了错位的衬线体标题和微粒背景
export const Hero = () => (
  <section className="bg-[#0c0c0e] text-[#e1e1e6] flex flex-col items-center">
    <h1 className="font-serif italic text-7xl tracking-tighter mix-blend-difference mb-8">
      Atomic Knowledge.
    </h1>
    <div className="border-t border-[#222] w-full max-w-2xl px-4 py-2 font-mono text-sm uppercase">
      Issue #042 — 2026.04.04
    </div>
  </section>
)
```
**总结**：拒绝平庸，从第一行指令开始。',
    1,
    0,
    NOW(),
    NOW(),
    NOW()
);

-- 4. 关联标签：混合匹配已有 ID 和本次可能新建的系统名
INSERT INTO article_tags (article_id, tag_id)
SELECT @article_id, id FROM tags WHERE name IN ('Skills', 'UI/UX', 'Frontend', 'Anti-Slop');
