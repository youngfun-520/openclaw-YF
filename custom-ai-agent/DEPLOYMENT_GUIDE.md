# 一键部署AI代理 - 部署指南

## 概述

这是一个完全可定制的AI代理系统，支持多种部署方式，包括Docker容器化部署和直接安装部署。

## 部署方式

### 方式1: Docker Compose 一键部署 (推荐)

```bash
# 克隆或下载项目文件
# 进入项目目录
cd custom-ai-agent

# 启动服务
docker-compose up -d
```

### 方式2: 直接运行安装脚本

```bash
# 给予执行权限
chmod +x install.sh

# 运行安装脚本
./install.sh
```

### 方式3: 手动部署

```bash
# 1. 安装Node.js 18+
# 2. 克隆项目
git clone <repository-url>
cd custom-ai-agent

# 3. 安装依赖
npm install

# 4. 启动服务
npm start
```

## 配置说明

### 主要配置项

- `agent.name`: AI代理的名称
- `agent.model`: 使用的语言模型
- `server.port`: 服务监听端口
- `channels`: 通信渠道配置
- `skills`: 启用的技能模块

### API密钥配置

在使用前，请确保配置必要的API密钥：

```bash
# 复制示例环境文件
cp .env.example .env

# 编辑环境变量
vim .env
```

## 功能特性

### 核心功能
- 智能对话处理
- 多技能模块系统
- 记忆管理功能
- 自定义工作流
- 多渠道接入

### 技能模块
- 网络搜索
- 文件操作
- 代码生成
- 任务管理
- 记忆管理

## API接口

### 健康检查
```
GET /health
```

### 对话接口
```
POST /api/chat
Content-Type: application/json

{
  "message": "你好",
  "userId": "user123",
  "channelId": "telegram"
}
```

### 技能列表
```
GET /api/skills
```

## 环境要求

- Node.js 18.x 或更高版本
- Docker & Docker Compose (容器化部署)
- 至少 2GB 可用内存
- 稳定的网络连接

## 自定义配置

### 添加新技能
1. 在 `skills/` 目录下创建新技能文件
2. 在 `config/default.yaml` 中启用该技能
3. 重启服务

### 修改AI模型
编辑 `config/default.yaml` 中的 `agent.model` 字段

## 故障排除

### 常见问题

1. **端口冲突**: 修改 `config/default.yaml` 中的 `server.port`
2. **API密钥错误**: 检查 `.env` 文件中的配置
3. **内存不足**: 增加系统内存或调整Node.js内存限制

### 日志查看

```bash
# Docker部署查看日志
docker-compose logs -f custom-ai-agent

# 直接部署查看日志
tail -f logs/agent.log
```

## 升级维护

### 备份数据
```bash
tar -czf backup-$(date +%Y%m%d-%H%M%S).tar.gz data/ config/
```

### 更新版本
```bash
# 停止服务
docker-compose down

# 拉取最新代码
git pull origin main

# 重新构建并启动
docker-compose up -d
```

## 安全注意事项

- 不要在公共网络直接暴露服务端口
- 定期更新依赖包
- 保护好API密钥和敏感信息
- 使用HTTPS反向代理（推荐nginx）

## 支持

如需技术支持，请参考文档或联系开发者。