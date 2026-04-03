---
description: 启动前端和后端开发服务器，以及打包命令
---

# 开发与打包命令

## 启动前端（Vite 开发服务器）

// turbo
```bash
cd /Users/alex/Documents/blog && npm run dev
```

前端默认运行在 http://localhost:5173

## 启动后端（Spring Boot）

// turbo
```bash
cd /Users/alex/Documents/blog/server && mvn spring-boot:run
```

后端默认运行在 http://localhost:8080

> ⚠️ 注意：后端命令是 `mvn`（Maven），不是 `nvm`（Node Version Manager）

---

## 打包前端（Vite 生产构建）

```bash
cd /Users/alex/Documents/blog && npm run build
```

构建产物输出到 `dist/` 目录

## 打包后端（Spring Boot JAR）

```bash
cd /Users/alex/Documents/blog/server && mvn clean package -DskipTests
```

构建产物输出到 `server/target/` 目录，生成的 JAR 文件可以用以下命令运行：

```bash
java -jar server/target/server-0.0.1-SNAPSHOT.jar
```
