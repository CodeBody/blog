-- 1. 获取背景：从 API 知 "AI技术" ID 为 1
SET @category_id = 1;

-- 2. 处理标签：复用已有 React (7), UI/UX (12)
-- 插入新标签（仅当不存在时）
INSERT INTO tags (id, name, created_at, updated_at)
SELECT 1712210000002, 'Frontend', NOW(), NOW() FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Frontend');
INSERT INTO tags (id, name, created_at, updated_at)
SELECT 1712210000006, 'Architecture', NOW(), NOW() FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Architecture');

-- 3. 插入文章
SET @article_id = 20260404105501;
INSERT INTO articles (id, author_id, category_id, title, content, status, views, published_at, created_at, updated_at)
VALUES (
    @article_id,
    1,
    @category_id,
    '用 senior-frontend 像资深专家一样构建高性能前端架构',
    '# 一天学会一个 AI Skill：用 senior-frontend 像资深专家一样构建高性能前端架构

### 板块 1：什么是 senior-frontend？为什么需要它？

**senior-frontend** 是一个旨在模拟“资深前端架构师”思维维度的 AI 技能。它不仅关注功能的实现，更聚焦于代码的可维护性、性能瓶颈以及极端的工程规范。

| 维度 | 普通开发习惯 | 用了 senior-frontend 之后 |
|------|-------------|-------------------------|
| **组件封装** | 巨大的单一组件 | 高度解耦、职责单一的组件（Atomic Design） |
| **性能** | 随意引入重资源包 | 自动 Bundle 分析、Lazy Loading、流式渲染 |
| **可测试性** | “以后再补测试” | TDD 驱动，自动生成 Vitest/Cypress 测试用例 |
| **无障碍** | 忽略 a11y | 语义化 HTML、ARIA 标签、键盘导航检查 |

**适用场景**：构建中大型企业级 Web 应用、重构复杂老旧代码、建立团队前端规范。

### 板块 2：目录结构可视化

资深专家眼中的标准 Next.js/React 项目结构：

```text
src/
├── app/              # Next.js App Router (路由与页面)
├── components/
│   ├── ui/           # 原子组件 (shadcn/ui 风格)
│   └── layout/       # 布局组件
├── hooks/            # 逻辑抽离与复用
├── lib/              # 外部库封装 (utils, fetcher)
├── services/         # API 请求层
├── types/            # 全局 TypeScript 定义
└── __tests__/        # 针对逻辑的单元测试
```

**设计理念**：
- **逻辑与视图分离**：复杂的业务逻辑一律抽离到 `hooks` 或 `services` 中。
- **类型安全**：禁止任何 `any`，严格使用 TypeScript 泛型。

### 板块 3：核心工作流

`senior-frontend` 的操作闭环分为四步：

1.  **架构脚手架 (Scaffolding)** 💡：根据需求（Admin/Lander/SaaS）选择最佳工程模板。
2.  **契约优先 (Contract First)** 💡：先定义 TS 类型和 Mock 数据，确保前后端理解一致。
3.  **精细化实现** 💡：使用 `Sever Components` 减少客户端 JS 体积。
4.  **性能与审计 (Audit Feed)** 💡：自动运行代码审计，检查包体积和渲染耗时。

### 板块 4：最佳实践指南

✅ **Do''s**:
- 优先使用服务端组件（RSC）。
- 对超过 10KB 的组件使用 `next/dynamic` 进行异步加载。
- 使用 `date-fns` 替代 `moment.js` 以缩减体积。

❌ **Don''ts**:
- 严禁在组件顶层直接编写复杂的 useEffect 逻辑。
- 严禁使用硬编码的字符串或 ID（统一存入常量或环境变量）。
- 严禁跳过语义化标签（如用 `div` 代替 `button`）。

### 板块 5：评测指标

- **Bundle Health Score**：包体积健康分（由 AI 自动计算）。
- **Lighthouse 分数**：核心性能指标（FCP, LCP, TBT）必须达标。
- **代码覆盖率**：关键路径的单元测试覆盖率。

### 板块 6：高级优化技巧

- **边缘计算集成**：在 Middleware 中处理身份验证和国际化（i18n）。
- **缓存策略优化**：精细控制 Next.js/React 的缓存，实现极致的加载速度。

### 板块 7：实战演练

**任务**：重构一个渲染 5000 条数据的商品列表页。

**资深版实现路线**：
1. **分析**：识别到列表项存在重复渲染。
2. **应用方案**：
    - 使用 `react-window` 实现虚拟列表渲染。
    - 图像使用 `next/image` 进行自动裁剪和 WebP 转换。
    - 将数据获取逻辑移至服务端，利用 `Suspense` 实现加载状态。

```tsx
// 优化后的虚拟列表组件片段
import { FixedSizeList as List } from ''react-window'';

export const ProductList = ({ items }) => (
  <List
    height={800}
    itemCount={items.length}
    itemSize={150}
    width={''100%''}
  >
    {({ index, style }) => (
      <div style={style}>
        <ProductCard data={items[index]} priority={index < 5} />
      </div>
    )}
  </List>
);
```

**总结**：资深，不仅是经验的积累，更是对每一行代码负责的态度。',
    1,
    0,
    NOW(),
    NOW(),
    NOW()
);

-- 4. 关联标签：复用已有 React (7), UI/UX (12)
INSERT INTO article_tags (article_id, tag_id)
SELECT @article_id, id FROM tags WHERE name IN ('React', 'UI/UX', 'Frontend', 'Architecture');
