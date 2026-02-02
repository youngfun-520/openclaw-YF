---
name: video-generation
description: Generate videos and animations using AI models and services
metadata:
  {
    "clawdbot": {
      "emoji": "🎥",
      "requires": { "bins": ["node", "ffmpeg"], "env": ["STABILITY_API_KEY", "OPENAI_API_KEY"] },
      "primaryEnv": "STABILITY_API_KEY"
    }
  }
---

# 视频生成技能

使用AI模型和服务生成视频和动画的技能。

## 功能说明

### 视频生成
```bash
node {baseDir}/scripts/generate_video.mjs "prompt" [options]
```

### 动图生成
```bash
node {baseDir}/scripts/generate_gif.mjs "prompt" [options]
```

### 视频编辑
```bash
node {baseDir}/scripts/edit_video.mjs "input.mp4" "output.mp4" [effects]
```

## 使用示例

### 基础视频生成
```bash
node {baseDir}/scripts/generate_video.mjs "A futuristic cityscape at sunset"
```

### 带参数的视频生成
```bash
node {baseDir}/scripts/generate_video.mjs "A dancing robot" --duration 5 --resolution 1080p
```

### 从图像生成视频
```bash
node {baseDir}/scripts/image_to_video.mjs "input_image.jpg" "motion description"
```

## 支持的服务

- Stability AI (Stable Video Diffusion)
- OpenAI DALL-E (图像转视频)
- Runway ML (高级视频编辑)
- Local FFmpeg (视频处理)

## 配置要求

- `STABILITY_API_KEY`: Stability AI API密钥
- `OPENAI_API_KEY`: OpenAI API密钥
- FFmpeg: 本地视频处理工具

## 输出格式

- MP4: 标准视频格式
- GIF: 动画格式
- WEBM: 网页视频格式

Notes:
- 视频生成可能需要几分钟处理时间
- API调用会产生费用，请注意用量
- 复杂的视频可能需要高级API访问权限