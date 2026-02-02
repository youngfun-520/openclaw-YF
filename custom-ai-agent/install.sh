#!/bin/bash

# Custom AI Agent - 一键部署脚本
# 版本: 1.0
# 描述: 快速部署定制AI代理系统

set -e  # 遇到错误时停止执行

echo "==========================================="
echo "    欢迎使用定制AI代理一键部署工具"
echo "==========================================="

# 检查依赖
check_dependencies() {
    echo "检查系统依赖..."
    
    if ! command -v node &> /dev/null; then
        echo "错误: Node.js 未安装"
        echo "请先安装 Node.js 18+"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo "错误: npm 未安装"
        echo "请先安装 npm"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        echo "警告: Git 未安装，将跳过某些功能"
    fi
    
    echo "✓ 所有依赖检查完成"
}

# 创建项目目录
setup_directories() {
    echo "创建项目目录..."
    
    mkdir -p config
    mkdir -p logs
    mkdir -p data
    mkdir -p skills
    
    echo "✓ 目录结构创建完成"
}

# 生成默认配置
generate_config() {
    echo "生成默认配置文件..."
    
    cat > config/default.yaml << EOF
# AI代理配置文件
agent:
  name: "Custom AI Agent"
  description: "A customizable AI agent for various tasks"
  model: "qwen-portal/coder-model"
  thinking: "high"
  verbose: false
  
server:
  port: 3000
  host: "0.0.0.0"
  cors: true
  
channels:
  telegram:
    enabled: false
    bot_token: ""
  discord:
    enabled: false
    bot_token: ""
  whatsapp:
    enabled: false
    phone_number: ""
  
skills:
  enabled:
    - web_search
    - file_operations
    - code_generation
    - task_management
    - memory_management
  settings:
    web_search:
      provider: "tavily"
    file_operations:
      allowed_paths: ["./data", "./workspace"]
      
logging:
  level: "info"
  file: "./logs/agent.log"
  max_size: "10MB"
  max_files: 5

memory:
  retention_days: 30
  auto_compact: true
EOF
    
    echo "✓ 配置文件生成完成"
}

# 安装依赖
install_dependencies() {
    echo "安装项目依赖..."
    
    # 创建package.json
    cat > package.json << EOF
{
  "name": "custom-ai-agent",
  "version": "1.0.0",
  "description": "A customizable AI agent with one-click deployment",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.0",
    "dotenv": "^16.0.0",
    "yaml": "^2.0.0",
    "axios": "^1.0.0",
    "ws": "^8.0.0",
    "openai": "^4.0.0",
    "langchain": "^0.0.189"
  },
  "devDependencies": {
    "nodemon": "^3.0.0",
    "jest": "^29.0.0"
  }
}
EOF
    
    npm install
    
    echo "✓ 依赖安装完成"
}

# 创建主入口文件
create_main_file() {
    echo "创建主程序文件..."
    
    cat > index.js << 'EOF'
const express = require('express');
const axios = require('axios');
const yaml = require('yaml');
const fs = require('fs');
require('dotenv').config();

class CustomAIAgent {
  constructor(configPath = './config/default.yaml') {
    this.config = yaml.parse(fs.readFileSync(configPath, 'utf8'));
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.initializeSkills();
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  setupRoutes() {
    // 健康检查端点
    this.app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // 主要API端点
    this.app.post('/api/chat', async (req, res) => {
      try {
        const { message, userId, channelId } = req.body;
        const response = await this.processMessage(message, userId, channelId);
        res.json({ response, success: true });
      } catch (error) {
        console.error('Error processing message:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
      }
    });

    // 技能管理端点
    this.app.get('/api/skills', (req, res) => {
      res.json({ 
        skills: this.enabledSkills.map(skill => ({
          name: skill.name,
          description: skill.description,
          enabled: true
        }))
      });
    });
  }

  initializeSkills() {
    // 初始化技能系统
    this.enabledSkills = [];
    
    // 根据配置加载技能
    const skillsConfig = this.config.skills.enabled;
    skillsConfig.forEach(skillName => {
      // 这里可以动态加载技能模块
      this.enabledSkills.push({
        name: skillName,
        description: `Skill for ${skillName}`,
        enabled: true
      });
    });
    
    console.log(`✓ Loaded ${this.enabledSkills.length} skills`);
  }

  async processMessage(message, userId, channelId) {
    // 这里实现AI处理逻辑
    // 暂时返回模拟响应
    return {
      text: `收到您的消息: "${message}". 这是定制AI代理的模拟响应。`,
      timestamp: new Date().toISOString(),
      source: 'custom-ai-agent',
      processed_by: this.config.agent.name
    };
  }

  start(port = 3000) {
    this.app.listen(port, () => {
      console.log(`\n===========================================`);
      console.log(`  ${this.config.agent.name} 已启动`);
      console.log(`  监听端口: ${port}`);
      console.log(`  访问地址: http://localhost:${port}`);
      console.log(`===========================================\n`);
    });
  }
}

// 启动应用
if (require.main === module) {
  const agent = new CustomAIAgent();
  agent.start(process.env.PORT || 3000);
}

module.exports = CustomAIAgent;
EOF

    echo "✓ 主程序文件创建完成"
}

# 创建启动脚本
create_start_script() {
    echo "创建启动脚本..."
    
    cat > start.sh << 'EOF'
#!/bin/bash
# 启动AI代理

# 加载环境变量
if [ -f .env ]; then
    export $(cat .env | xargs)
fi

# 检查是否以开发模式运行
if [ "$1" = "dev" ]; then
    echo "以开发模式启动..."
    npm run dev
else
    echo "以生产模式启动..."
    npm run start
fi
EOF

    chmod +x start.sh
    
    echo "✓ 启动脚本创建完成"
}

# 显示完成信息
show_completion_message() {
    echo ""
    echo "==========================================="
    echo "        部署完成！🎉"
    echo "==========================================="
    echo ""
    echo "接下来您可以："
    echo ""
    echo "1. 编辑配置文件:"
    echo "   vim config/default.yaml"
    echo ""
    echo "2. 设置环境变量 (可选):"
    echo "   cp .env.example .env"
    echo "   vim .env"
    echo ""
    echo "3. 启动AI代理:"
    echo "   ./start.sh"
    echo ""
    echo "4. 或在开发模式下启动:"
    echo "   ./start.sh dev"
    echo ""
    echo "5. 检查健康状态:"
    echo "   curl http://localhost:3000/health"
    echo ""
    echo "==========================================="
    echo "注意: 首次运行前请确保已配置必要的API密钥"
    echo "==========================================="
}

# 执行安装流程
main() {
    check_dependencies
    setup_directories
    generate_config
    install_dependencies
    create_main_file
    create_start_script
    show_completion_message
}

# 运行主函数
main