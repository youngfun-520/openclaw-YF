# 搜索API配置指南

## 概述
本指南将帮助您配置适当的API密钥以启用网络搜索功能。目前环境中缺少BRAVE_API_KEY，但存在TAVILY_API_KEY，我们可以利用现有资源。

## 可用选项

### 选项1：配置BRAVE_API_KEY（推荐）
1. 访问 [Brave Search API](https://brave.com/search/api/) 页面
2. 注册并获取API密钥
3. 设置环境变量：
   ```bash
   export BRAVE_API_KEY="your_brave_api_key_here"
   ```

### 选项2：利用现有的TAVILY_API_KEY
环境中已经存在TAVILY_API_KEY，可以修改系统配置以使用Tavily搜索服务：
- TAVILY_API_KEY: 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

## 配置步骤

### 步骤1：环境变量配置
编辑您的shell配置文件（如 `.bashrc`, `.zshrc` 或 `.env`）：
```bash
# 添加Brave Search API密钥
export BRAVE_API_KEY="your_brave_api_key_here"

# 或者，如果您想使用Tavily，确保以下存在
export TAVILY_API_KEY="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"
```

### 步骤2：验证配置
重新加载配置并验证：
```bash
source ~/.bashrc  # 或相应配置文件
echo $BRAVE_API_KEY
```

### 步骤3：更新应用配置
如果需要，更新应用程序配置以使用正确的搜索API服务。

## 替代方案

如果没有API密钥，可以考虑以下替代方案：

1. 使用命令行工具进行搜索：
   - `curl` 请求特定API端点
   - 使用系统内置工具获取网络内容

2. 手动搜索后输入信息

## 故障排除

- 如果API密钥无效，请检查拼写错误
- 确保API密钥没有过期
- 检查API提供商的服务状态
- 验证环境变量权限设置

## 安全提示

- 不要在代码中硬编码API密钥
- 定期轮换API密钥
- 使用最小权限原则配置API访问
- 避免将敏感配置提交到版本控制系统