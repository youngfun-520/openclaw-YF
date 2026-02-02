# API 密钥配置状态报告

## 当前环境中的API密钥

目前在环境中发现了以下API密钥：
- TAVILY_API_KEY (可用)
- 但缺少 BRAVE_API_KEY

## 配置说明

要启用Brave搜索引擎功能，请按以下步骤操作：

### 方法1：设置环境变量
```bash
export BRAVE_API_KEY="your_brave_api_key_here"
```

### 方法2：创建.env文件
在项目根目录下创建`.env`文件：
```
BRAVE_API_KEY=your_brave_api_key_here
```

### 方法3：使用其他可用的搜索服务
当前环境中已有TAVILY_API_KEY，可以考虑修改配置以使用Tavily搜索服务。

## 获取BRAVE_API_KEY的方法

1. 访问 https://brave.com/search/api/
2. 注册账户并获取API密钥
3. 将API密钥添加到环境变量中

## 注意事项

- 确保API密钥的安全性，不要将其提交到版本控制系统
- 定期轮换API密钥以提高安全性
- 检查API使用限制，避免超出配额