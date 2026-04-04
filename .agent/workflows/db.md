---
description: 数据库常用操作，包括本地与云端数据同步、备份和恢复。
---

# 数据库操作指南

本文档记录了 `blog` 项目中常用的数据库管理命令。

## 1. 数据同步 (Sync)

### 从本地同步到云端 (Local -> Cloud)
将本地开发环境的所有表数据（包含结构）同步到生产环境。**注意：这会覆盖云端数据库！**

// turbo
```bash
mysqldump -u root -p123456 blog | mysql -h 103.112.186.48 -u blog -pLcyBnt637Wejy5KE blog
```

### 仅同步数据 (Data Only)
只同步数据，不修改表结构：

// turbo
```bash
mysqldump -u root -p123456 --no-create-info --skip-triggers blog | mysql -h 103.112.186.48 -u blog -pLcyBnt637Wejy5KE blog
```

## 2. 数据库备份 (Backup)

### 备份本地数据库
将本地数据库导出为 SQL 文件。

// turbo
```bash
mysqldump -u root -p123456 blog > /Users/alex/Documents/blog/server/src/main/resources/backup_$(date +%Y%m%d_%H%M%S).sql
```

## 3. 常见问题排查

*   **远程连接失败**：确保云端服务器 `103.112.186.48` 的 3306 端口防火墙已开启，且本地 IP 已授权。
*   **版本不兼容**：如果遇到 `Unknown table 'COLUMN_STATISTICS'...` 错误，请在 `mysqldump` 后添加 `--column-statistics=0` 参数。
*   **权限不足**：确保云端用户 `blog` 具有 `INSERT`, `UPDATE`, `DELETE`, `CREATE`, `DROP` 等权限。
