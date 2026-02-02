# 配置视频/动图生成模型指南

## 当前状态
我已经为您创建了视频生成技能的框架 (`/home/codespace/.openclaw/workspace/skills/video-generation/`)，但要使其完全工作，您需要添加实际的视频生成模型和API密钥。

## 选项1: 添加Stability AI视频模型

### 1. 获取API密钥
- 访问 https://stability.ai/
- 注册账户并获取API密钥

### 2. 更新配置文件
编辑 `/home/codespace/.openclaw/openclaw.json`，在 `env` 部分添加：
```json
{
  "env": {
    "TAVILY_API_KEY": "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",
    "STABILITY_API_KEY": "your_stability_api_key_here"
  }
}
```

### 3. 添加模型提供商
在 `/home/codespace/.openclaw/openclaw.json` 的 `models.providers` 部分添加：
```json
"stability-ai": {
  "baseUrl": "https://api.stability.ai/v2alpha",
  "apiKey": "your-stability-api-key",
  "api": "stability-api",
  "models": [
    {
      "id": "stable-video-diffusion",
      "name": "Stable Video Diffusion",
      "input": ["image", "text"],
      "output": ["video"],
      "contextWindow": 2048,
      "maxTokens": 2048
    }
  ]
}
```

## 选项2: 添加OpenAI视频模型

### 1. 获取API密钥
- 访问 https://platform.openai.com/
- 注册账户并获取API密钥

### 2. 更新配置文件
在 `/home/codespace/.openclaw/openclaw.json` 中添加：
```json
{
  "env": {
    "TAVILY_API_KEY": "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",
    "OPENAI_API_KEY": "your_openai_api_key_here"
  }
}
```

### 3. 添加模型提供商
在 `models.providers` 中添加：
```json
"openai": {
  "baseUrl": "https://api.openai.com/v1",
  "apiKey": "your-openai-api-key",
  "api": "openai-images",
  "models": [
    {
      "id": "dall-e-3-video",
      "name": "DALL-E 3 Video",
      "input": ["text", "image"],
      "output": ["image", "video"],
      "contextWindow": 4096,
      "maxTokens": 4096
    }
  ]
}
```

## 选项3: 本地视频处理工具

### 1. 安装FFmpeg
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install ffmpeg

# macOS
brew install ffmpeg

# 确认安装
ffmpeg -version
```

### 2. 配置本地视频处理
创建本地视频处理脚本，可以与AI生成的图像结合生成视频。

## 应用配置更改

完成配置更改后，需要重启OpenClaw服务：
```bash
openclaw gateway restart
```

## 测试视频生成

配置完成后，您可以使用以下命令测试：
```bash
# 测试视频生成技能
node /home/codespace/.openclaw/workspace/skills/video-generation/scripts/generate_video.mjs "A cat wearing sunglasses dancing"
```

## 技能使用方式

一旦配置完成，您可以这样使用视频生成功能：
```javascript
// 在对话中请求视频生成
"请生成一个关于太阳系运转的视频"

// 系统将使用配置的视频模型来处理请求
```

## 多模型协作配置

要实现多模型协作（文本模型+图像模型+视频模型），您可以在配置中设置：

```json
"agents": {
  "defaults": {
    "models": {
      "multi-modal-workflow": {
        "steps": [
          {
            "model": "qwen-portal/coder-model",
            "task": "generate script"
          },
          {
            "model": "configured-image-model",
            "task": "generate keyframes"
          },
          {
            "model": "configured-video-model", 
            "task": "generate video"
          }
        ]
      }
    }
  }
}
```

## 注意事项

- 视频生成API通常成本较高，请注意用量
- 生成视频可能需要较长处理时间
- 某些API可能需要特殊访问权限
- 确保有足够的存储空间保存生成的视频
- 遵守各服务商的使用条款和限制