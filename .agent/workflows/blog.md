---
description: 生成"一天学会一个 AI Skill"系列博客文章的 SQL 插入脚本。当用户想写新博客、学习新 AI 技能、或需要生成博客内容时使用。
---

# 生成 AI Skills 系列博客

## 前置准备 (Research Stage)

1. **研读文档**：深入研究 AI Skill 的 SKILL.md、源码和官方示例。
2. **侦察数据库 (Research DB)** 💡：**必须**执行以下查询以获取最新的分类和标签：
   ```bash
   curl -s http://localhost:8080/api/admin/categories && curl -s http://localhost:8080/api/admin/tags
   ```
3. **智能匹配决策**：将拟定的分类/标签与现有数据比对。若名称高度相似（例如 `AI技术` vs `AI 技术`），务必使用**已有 ID** 以避免名称重复造成主逻辑混乱。

## 文章结构模板

每篇博客**必须**包含以下 7 个板块，保持系列一致性：

### 板块 1：什么是 [技能名]？为什么需要它？（~10%）
- 技能的本质和定位（用类比帮助理解）
- 适用人群
- 解决什么痛点（用表格对比）

### 板块 2：核心架构与目录结构（~15%）
- 目录结构可视化（用代码块展示目录树）
- 关键设计理念（用表格说明分层/模块）
- 为什么这样设计（解释背后的原理）

### 板块 3：核心工作流（~20%，最重要）
- 用流程图/文字展示完整的操作闭环
- 分步骤详细说明（Step 1, 2, 3...）
- 每步配上实用提示（💡）

### 板块 4：编写/使用指南与最佳实践（~15%）
- 关键原则（用 ✅/❌ 对比好坏实践）
- 代码示例
- 常见模式和反模式

### 板块 5：评测/验证体系（~15%）
- 如何验证技能效果
- 量化指标和定性评估
- 工具和流程

### 板块 6：高级特性/优化技巧（~10%）
- 进阶用法
- 性能/效果优化
- 与其他工具的集成

### 板块 7：实战演练（~15%）
- 一个端到端的完整示例
- 从需求到成品的全过程
- 可复制的代码/配置

## 文章格式规范

- **标题格式**：`用 [技能名] [做什么事]`
- **正文格式**：Markdown（MD），直接存入数据库 content 字段
- **代码块**：使用 ``` 围栏，标注语言类型
- **表格**：用 Markdown 表格展示对比和结构化信息
- **引用**：用 > 引用官方文档原文（中英文皆可）
- **图标**：适当使用 emoji（📦✅❌💡⚠️📊📈）增强可读性

生成一个完整的 SQL 插入脚本，保存到：
```
server/src/main/resources/insert_[skill-name]_blog.sql
```

SQL 脚本必须遵循以下**防重复**逻辑：
1. **分类处理**：先获取分类 ID。`SET @cat_id = (SELECT id FROM categories WHERE name = '[分类名]' LIMIT 1);`。如果不存在，则提示用户或手动插入一个新分类。
2. **标签处理**：对每个标签，使用 `INSERT INTO tags (id, name, created_at, updated_at) SELECT [随机大ID], '[标签名]', NOW(), NOW() FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = '[标签名]');`。
3. **文章映射**：使用 `SET @article_id = [时间戳/随机大ID];`。
4. **关联表**：使用 `INSERT INTO article_tags (article_id, tag_id) SELECT @article_id, id FROM tags WHERE name IN ('标签1', '标签2'...);`。

### 推荐的 SQL 模版结构：
```sql
-- 1. 获取分类 ID
SET @category_name = 'AI 技术';
SET @category_id = (SELECT id FROM categories WHERE name = @category_name LIMIT 1);

-- 2. 插入新标签（如果不存在）
-- 示例：INSERT INTO tags (id, name, created_at, updated_at) SELECT 1712210000001, 'AI Skill', NOW(), NOW() FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM tags WHERE name = 'AI Skill');

-- 3. 插入文章
SET @article_id = 1712210000000; -- 请使用唯一的大整数 ID
INSERT INTO articles (id, author_id, category_id, title, content, status, views, published_at, created_at, updated_at)
VALUES (@article_id, 1, @category_id, '标题', '正文', 1, 0, NOW(), NOW(), NOW());

-- 4. 关联标签
INSERT INTO article_tags (article_id, tag_id)
SELECT @article_id, id FROM tags WHERE name IN ('标签1', '标签2');
```

// turbo
### 参考已有文章的 ID 范围，避免冲突
```bash
curl -s http://localhost:8080/api/admin/articles | python3 -m json.tool 2>/dev/null || echo "检查现有文章 ID"
```

## 元信息

| 字段 | 说明 |
|------|------|
| author_id | 1（默认 alex） |
| category_id | 1（AI 技术分类） |
| status | 1（已发布） |
| content | MD 格式的完整文章正文 |

## 质量检查

- [ ] 7 个板块齐全
- [ ] 标题遵循系列命名格式
- [ ] 包含代码示例和表格
- [ ] 有实战演练部分
- [ ] SQL 语法正确，字符串中的单引号已转义
- [ ] 标签合理（3~5 个）