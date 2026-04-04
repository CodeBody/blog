---
name: database-standards
description: Strict guidelines for database table naming and entity mapping in this blog project. Use this skill whenever adding new entities, tables, or custom SQL queries. This ensures all tables follow the plural naming convention and are explicitly mapped in Java.
---

This skill defines the database conventions that must be strictly followed in this repository to prevent "Table Not Found" errors and maintain schema consistency.

## Core Rules

### 1. Plural Table Names
- **Rule**: All table names in the database MUST be plural (e.g., `users`, `articles`, `categories`, `tags`, `article_tags`, `comments`).
- **Never Use**: Singular names like `article` or `user` for database tables.

### 2. Mandatory Explicit Mapping
- **Rule**: Every Java Entity class (`com.blog.server.entity.*`) MUST have a `@TableName` annotation.
- **Reasoning**: This prevents MyBatis Plus from defaulting to singular names based on class names and ensures 100% clarity.
- **Example**: `@TableName("articles")` for the `Article` class.

### 3. Snake_Case Convention
- **Rule**: All database column names must be `snake_case` (e.g., `author_id`, `created_at`).
- **Mapping**: Java fields should use `camelCase` (e.g., `authorId`, `createdAt`). Ensure MyBatis Plus `map-underscore-to-camel-case` is enabled in `application.yml`.

### 4. Custom SQL Audit
- **Rule**: Before writing a custom `@Select`, `@Update`, or XML query, check the `schema.sql` file or the `DATABASE.md` reference to verify the exact table name and column names.
- **Example**: `SELECT * FROM articles` (Correct) vs `SELECT * FROM article` (Incorrect).

## Database Reference
For a complete list of tables and their structures, always refer to [DATABASE.md](file:///Users/alex/Documents/blog/DATABASE.md) in the project root.

## Audit Checklist
- [ ] Does the entity have a `@TableName`?
- [ ] Is the table name in the `@TableName` plural?
- [ ] Does the custom SQL use the exact plural table name?
- [ ] Are column names in SQL correctly using snake_case?
