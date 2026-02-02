# 添加视频/动图生成模型配置指南

## 概述
本文档介绍如何为OpenClaw系统添加视频或动图生成模型，以扩展AI代理的多媒体处理能力。

## 支持的视频/动图生成服务

### 1. OpenAI DALL-E系列（支持视频生成）
- 适用于图像和简单动画生成
- API: `https://api.openai.com/v1/images/generations`

### 2. Stability AI (Stable Video Diffusion)
- 专业视频生成模型
- API: `https://api.stability.ai/v2alpha/image-to-video`

### 3. Runway ML
- 高级视频编辑和生成
- API: `https://api.runwayml.com/v1`

### 4. Pika Labs API
- AI驱动的视频生成
- API: `https://api.pika.art`

## 配置步骤

### 步骤1: 编辑配置文件
```bash
# 备份当前配置
cp /home/codespace/.openclaw/openclaw.json /home/codespace/.openclaw/openclaw.json.backup

# 编辑配置
nano /home/codespace/.openclaw/openclaw.json
```

### 步骤2: 添加新的模型提供商
在配置文件中的 `models.providers` 部分添加新的视频模型提供商：

```json
{
  "models": {
    "providers": {
      "qwen-portal": { /* 现有配置 */ },
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
      },
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
    }
  }
}
```

### 步骤3: 更新环境变量
将API密钥添加到环境变量中：

```bash
# 编辑配置文件
nano /home/codespace/.openclaw/openclaw.json

# 在env部分添加API密钥
{
  "env": {
    "TAVILY_API_KEY": "...",
    "OPENAI_API_KEY": "your_openai_api_key_here",
    "STABILITY_API_KEY": "your_stability_api_key_here"
  }
}
```

### 步骤4: 创建视频生成技能
创建一个新的技能来处理视频生成任务：

```bash
mkdir -p /home/codespace/.openclaw/workspace/skills/video-generation
```

创建技能定义文件：

```json
{
  "name": "video-generation",
  "description": "Generate videos and animations using AI models",
  "scripts": {
    "generate_video": "/home/codespace/.openclaw/workspace/skills/video-generation/scripts/generate.mjs"
  }
}
```

### 步骤5: 重启服务
```bash
openclaw gateway restart
```

## 视频生成技能示例

创建一个视频生成脚本：

```javascript
// /home/codespace/.openclaw/workspace/skills/video-generation/scripts/generate.mjs
#!/usr/bin/env node

import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const apiKey = process.env.STABILITY_API_KEY;
const apiUrl = 'https://api.stability.ai/v2alpha/image-to-video';

async function generateVideo(prompt, options = {}) {
  if (!apiKey) {
    throw new Error('STABILITY_API_KEY is not set');
  }

  try {
    const response = await axios.post(apiUrl, {
      image_strength: options.imageStrength || 0.5,
      motion_bucket_id: options.motionBucketId || 127,
      seed: options.seed || Math.floor(Math.random() * 1000000000),
      cfg_scale: options.cfgScale || 1.8,
      steps: options.steps || 30,
      // 这里需要上传一张图片作为基础
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      responseType: 'stream'
    });

    // 处理返回的视频流
    const outputPath = path.join(process.cwd(), `generated-video-${Date.now()}.mp4`);
    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(outputPath));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Video generation failed:', error.message);
    throw error;
  }
}

// 如果直接运行此脚本
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const prompt = process.argv[2];
  if (!prompt) {
    console.log('Usage: node generate.mjs "video prompt"');
    process.exit(1);
  }

  generateVideo(prompt)
    .then(videoPath => {
      console.log(`Video generated successfully: ${videoPath}`);
    })
    .catch(error => {
      console.error('Error generating video:', error.message);
      process.exit(1);
    });
}

export { generateVideo };
```

## 注意事项

1. **API成本**: 视频生成通常比文本或图像生成更昂贵
2. **处理时间**: 视频生成可能需要几分钟时间
3. **存储需求**: 视频文件通常较大，需要足够的存储空间
4. **格式兼容性**: 确保输出格式与您的需求兼容

## 测试配置

配置完成后，可以通过以下方式测试：

```bash
# 测试视频生成技能
node /home/codespace/.openclaw/workspace/skills/video-generation/scripts/generate.mjs "A cat wearing sunglasses dancing"
```

## 故障排除

- 确保API密钥正确设置
- 检查网络连接
- 验证API提供商的配额和权限
- 查看日志文件以获取详细错误信息