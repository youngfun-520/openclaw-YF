#!/usr/bin/env node

/**
 * AI代理初始化脚本
 * 用于创建完整的AI代理系统
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initializeAIAgent() {
  console.log('🚀 开始初始化定制AI代理...\n');
  
  try {
    // 创建技能目录结构
    console.log('📁 创建技能目录结构...');
    const skillsDirs = [
      'web_search',
      'file_operations', 
      'code_generation',
      'task_management',
      'memory_management'
    ];
    
    for (const dir of skillsDirs) {
      const skillPath = path.join(__dirname, 'skills', dir);
      await fs.mkdir(skillPath, { recursive: true });
      
      // 为每个技能创建基本文件结构
      const skillFiles = {
        'index.js': `// ${dir} 技能模块
export const ${dir.replace('-', '_')}Skill = {
  name: '${dir}',
  description: '${dir} 功能模块',
  version: '1.0.0',
  
  async execute(params) {
    // 执行技能逻辑
    return {
      success: true,
      result: '执行${dir}操作',
      timestamp: new Date().toISOString()
    };
  }
};
`,
        'config.json': JSON.stringify({
          name: dir,
          enabled: true,
          settings: {},
          dependencies: []
        }, null, 2),
        'README.md': `# ${dir} 技能模块

## 功能说明
此模块提供 ${dir} 相关功能。

## 使用方法
\`\`\`javascript
import { ${dir.replace('-', '_')}Skill } from './${dir}';
const result = await ${dir.replace('-', '_')}Skill.execute(params);
\`\`\`

## 配置选项
- 选项1: 说明
- 选项2: 说明
`
      };
      
      for (const [fileName, content] of Object.entries(skillFiles)) {
        await fs.writeFile(path.join(skillPath, fileName), content);
      }
    }
    
    console.log('   ✓ 技能目录结构创建完成');
    
    // 创建环境变量示例文件
    console.log('\n🔐 创建环境变量配置...');
    const envContent = `# AI代理环境变量配置

# 语言模型API配置
OPENAI_API_KEY=
QWEN_API_KEY=

# 通信渠道配置
TELEGRAM_BOT_TOKEN=
DISCORD_BOT_TOKEN=

# 数据库配置
DATABASE_URL=

# 其他配置
NODE_ENV=production
LOG_LEVEL=info
`;
    await fs.writeFile(path.join(__dirname, '.env.example'), envContent);
    
    console.log('   ✓ 环境变量配置创建完成');
    
    // 创建示例数据文件
    console.log('\n📊 创建示例数据文件...');
    const sampleData = {
      agent: {
        name: "Custom AI Agent",
        version: "1.0.0",
        createdAt: new Date().toISOString(),
        description: "A customizable AI agent for various tasks"
      },
      skills: skillsDirs,
      config: {
        server: {
          port: 3000,
          host: "0.0.0.0"
        },
        features: {
          memory: true,
          learning: true,
          multiChannel: true
        }
      }
    };
    
    await fs.writeFile(
      path.join(__dirname, 'data', 'sample-config.json'),
      JSON.stringify(sampleData, null, 2)
    );
    
    console.log('   ✓ 示例数据文件创建完成');
    
    console.log('\n✅ AI代理初始化完成！');
    console.log('\n接下来您可以：');
    console.log('1. 查看部署指南: DEPLOYMENT_GUIDE.md');
    console.log('2. 编辑配置文件: config/default.yaml');
    console.log('3. 运行一键部署: docker-compose up -d');
    console.log('4. 启动服务: npm start');
    
  } catch (error) {
    console.error('❌ 初始化失败:', error.message);
    throw error;
  }
}

// 检测是否为主模块运行
const isMainModule = process.argv[1] === __filename;

if (isMainModule) {
  initializeAIAgent().catch(error => {
    console.error('初始化过程中发生错误:', error);
    process.exit(1);
  });
}

export { initializeAIAgent };