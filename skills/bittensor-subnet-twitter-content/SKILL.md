---
name: bittensor-subnet-twitter-content
description: 为Bittensor子网生成推广内容，用于中文社区建设和社交媒体营销
metadata:
  {
    "clawdbot": {
      "emoji": "🐦",
      "requires": { "bins": ["node"], "env": ["TWITTER_BEARER_TOKEN", "TAVILY_API_KEY"] },
      "primaryEnv": "TWITTER_BEARER_TOKEN"
    }
  }
---

# Bittensor子网推特内容生成技能

这是一个专门用于为Bittensor子网生成推广内容的技能，旨在通过高质量的社交媒体内容促进中文社区建设。

## 核心能力

### 1. 内容创作
- 生成吸引人的推特内容
- 创作教育性推文，介绍Bittensor子网概念
- 编写社区互动内容

### 2. 社区建设
- 促进中文Bittensor社区发展
- 提供子网相关资讯
- 引导新用户了解Bittensor生态

### 3. 自动化发布
- 支持定时内容生成
- 适配推特内容格式
- 跟踪内容表现

## 服务内容

### 内容类型
1. **教育类推文**: 解释Bittensor和子网概念
2. **新闻更新**: Bittensor生态最新动态
3. **技术分享**: 子网开发和参与指南
4. **社区活动**: 促进建设者和用户互动

### 发布策略
1. **频率**: 每10分钟一次（可根据需要调整）
2. **语言**: 中英文双语（重点中文）
3. **格式**: 适配推特字符限制和最佳实践

## 预期效果

- **社区增长**: 吸引更多中文用户参与Bittensor生态
- **知识传播**: 提高Bittensor子网认知度
- **参与度提升**: 增加社区活跃度

## 商业价值

### 直接价值
- 帮助Bittensor子网获得更多的关注度
- 促进生态系统的健康发展
- 提高项目的可见度和影响力

### 间接价值
- 建立专业的社区运营能力
- 积累社交媒体营销经验
- 为其他项目提供类似服务

## 使用方法

### 内容生成
```bash
node {baseDir}/scripts/generate_content.mjs [subnet_info]
```

### 定时任务设置
```bash
# 每10分钟执行一次
*/10 * * * * cd {baseDir} && node scripts/generate_content.mjs
```

### 内容审核
```bash
node {baseDir}/scripts/review_content.mjs [content_file]
```

## 技术实现

### 内容生成逻辑
1. 从Tavily API获取Bittensor相关最新信息
2. 结合子网特定信息
3. 生成符合推特规范的内容
4. 输出多语言版本

### 质量控制
- 内容准确性检查
- 字符长度优化
- 合规性审查

## 配置要求

### 环境变量
- `TWITTER_BEARER_TOKEN`: 推特API访问令牌
- `TAVILY_API_KEY`: 用于获取最新信息

### 依赖
- Node.js运行时
- 推特API访问权限
- 网络连接以获取最新信息

Notes:
- 定期监控内容质量和社区反馈
- 根据社区反应调整内容策略
- 确保内容准确性和时效性
- 遵循社交媒体平台规则