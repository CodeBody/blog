# Database Schema Reference

This document provides a quick reference for the `blog` database tables, fields, and relationships. It is the **Source of Truth** for all naming conventions in SQL and Java.

## 📋 Table Overview

| Table Name | Entity Class | Primary Key | Description |
| :--- | :--- | :--- | :--- |
| `users` | `User` | `id` (BIGINT) | User profiles and credentials. |
| `categories` | `Category` | `id` (BIGINT) | Article categorization. |
| `tags` | `Tag` | `id` (BIGINT) | Flexible article metadata tags. |
| `articles` | `Article` | `id` (BIGINT) | Blog content and publishing status. |
| `article_tags` | `ArticleTag` | `(article_id, tag_id)` | Many-to-Many join table. |
| `comments` | `Comment` | `id` (BIGINT) | Post-level feedback and moderation. |

---

## 🏗️ Detailed Structures

### 1. `users`
| Column | Type | Nullable | Comment |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | No | Unique ID |
| `username` | VARCHAR(50) | No | Login Name |
| `password` | VARCHAR(255) | No | BCrypt Hash |
| `nickname` | VARCHAR(50) | Yes | Display Name |
| `avatar` | VARCHAR(255) | Yes | Profile Image |
| `role` | VARCHAR(20) | No | Default: 'user' |
| `created_at` | DATETIME | No | ISO Timestamp |
| `updated_at` | DATETIME | No | ISO Timestamp |

### 2. `categories`
| Column | Type | Nullable | Comment |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | No | Unique ID |
| `name` | VARCHAR(50) | No | Display Name |
| `description` | VARCHAR(255) | Yes | Context Info |

### 3. `tags`
| Column | Type | Nullable | Comment |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | No | Unique ID |
| `name` | VARCHAR(50) | No | Display Name |

### 4. `articles`
| Column | Type | Nullable | Comment |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | No | Unique ID |
| `author_id` | BIGINT | No | FK: `users.id` |
| `category_id` | BIGINT | No | FK: `categories.id` |
| `title` | VARCHAR(255) | No | Heading |
| `content` | LONGTEXT | No | Markdown Text |
| `status` | TINYINT | No | 0: Draft, 1: Published |
| `views` | INT | No | Default: 0 |
| `published_at` | DATETIME | Yes | Release Date |

### 5. `article_tags`
| Column | Type | Nullable | Comment |
| :--- | :--- | :--- | :--- |
| `article_id` | BIGINT | No | FK: `articles.id` |
| `tag_id` | BIGINT | No | FK: `tags.id` |

---

## 📏 Naming Standards
- **Wait!** All Table Names MUST be PLURAL.
- Column Names MUST be `snake_case`.
- Always use `@TableName("plural_name")` in Java entities.
