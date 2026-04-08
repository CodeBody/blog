# 🌟 个人博客系统

一个基于前沿技术栈构建的现代化全栈个人博客和作品集系统。具备优雅的响应式界面和稳健安全的后端架构。

<div align="center">
  <img src="./docs/front.png" alt="前端主页演示" width="800px" style="border-radius: 8px; margin-bottom: 20px;"/>
  <br/>
  <img src="./docs/admin.png" alt="博客后台管理" width="800px" style="border-radius: 8px;"/>
</div>

## 🚀 技术栈

### 前端 (Frontend)
- **核心框架**: React 19 + Vite 8
- **样式方案**: Tailwind CSS, PostCSS
- **动画动效**: Framer Motion, React Three Fiber (3D 交互)
- **路由控制**: React Router DOM v6
- **Markdown**: React Markdown, UIW React MD Editor

### 后端 (Backend)
- **核心框架**: Spring Boot 3.2.4
- **开发语言**: Java 17
- **数据库**: MySQL 8.0+
- **ORM框架**: MyBatis-Plus 3.5.5
- **安全认证**: Spring Security + JWT 令牌认证
- **API 文档**: SpringDoc OpenAPI (Swagger 3)

---

## 🛠️ 快速开始

请按照以下步骤在本地运行该项目。

### 1. 数据库配置
1. 安装 MySQL 8.0+ 并启动服务。
2. 创建一个名为 `blog` 的数据库：
   ```sql
   CREATE DATABASE blog DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. 导入项目自带的 sql 结构脚本：
   ```bash
   mysql -u root -p blog < database.sql
   ```
*(注: 项目中也包含一个 `database.db` SQLite 文件，但在默认配置中，Spring 后端连接的是 MySQL)。*

### 2. 后端服务端启动
出于安全考虑，本项目的数据库账密和 JWT 密钥没有硬编码，而是通过**环境变量**读取。在启动服务端前，请确保设置了对应变量。

- **`DB_HOST`**: 数据库 IP（默认: `localhost`）
- **`DB_USERNAME`**: MySQL 用户名（如: `root`）
- **`DB_PASSWORD`**: MySQL 密码
- **`JWT_SECRET`**: (可选) 用于生成 JWT Token 的自定义长密钥

**本地开发环境运行 (Dev profile)：**
```bash
cd server
# 请确保使用 Java 17 版本
mvn clean compile

# 在命令行中附带环境变量直接启动 Spring Boot：
DB_USERNAME=root DB_PASSWORD=你的数据库密码 mvn spring-boot:run
```
*(服务端启动成功后，默认运行在 `http://localhost:8080`)*

### 3. 前端客户端启动
前端项目代码位于根目录下。

```bash
# 注意: 需要安装 Node.js (推荐 v18+)
# 1. 安装项目依赖
npm install

# 2. 启动 Vite 开发服务器
npm run dev
```
前端本地开发服务默认运行在 `http://localhost:5173`。并且在配置中，所有 API 请求会自动代理到后端的 `8080` 端口。

---

## 🏗️ 项目目录结构

```text
├── src/                  # 前端源代码 (React)
│   ├── components/       # 通用的 UI 组件
│   ├── pages/            # 各个页面视图 (前台展示与后台管理)
│   ├── router/           # React Router 路由配置
│   ├── utils/            # 工具函数和 API 接口请求封装
│   └── index.css         # 全局 Tailwind 样式
├── server/               # 后端源代码 (Spring Boot)
│   ├── src/main/java     # Java 业务代码
│   └── src/main/resources# 应用配置文件 (application.yml 等)
├── database.sql          # 数据库表结构初始化脚本
├── README.md             # 项目使用说明文档
└── package.json          # Node依赖配置
```

## 📄 开源许可证

本项目基于 [MIT License](LICENSE) 协议开源。
