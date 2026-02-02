# Search API Setup Skill

## Issue
由于缺少必要的API密钥，无法进行网络搜索。具体错误信息：需要设置BRAVE_API_KEY。

## Solution Steps

### 1. 获取Brave Search API密钥
- 访问 https://brave.com/search/api/
- 注册账户并获取免费的API密钥
- 或者使用其他支持的搜索引擎API

### 2. 配置API密钥
在配置文件中设置环境变量：
```bash
BRAVE_API_KEY=your_actual_api_key_here
```

或者在系统配置中添加API密钥。

### 3. 验证配置
重启系统后验证API密钥是否生效。

## Alternative Solutions
如果无法获取Brave Search API密钥，可考虑：
- 使用其他搜索引擎API（如Google Custom Search等）
- 禁用需要网络搜索的功能
- 手动搜索后提供信息

## 注意事项
- API密钥应安全保存，避免泄露
- 检查API使用限制和费用
- 定期更新过期的API密钥