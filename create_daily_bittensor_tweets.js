#!/usr/bin/env node

/**
 * 生成每日Bittensor子网推特内容
 * 用于促进中文社区建设
 */

import fs from 'fs/promises';
import path from 'path';

// Bittensor子网数据库
const BITTENSOR_SUBNETS = [
  {
    id: "DogeLayer",
    name: "DogeLayer",
    description: "桥接传统加密货币挖矿与去中心化AI网络",
    focus: "AI挖矿",
    participants: "矿工和技术人员",
    howToJoin: "通过贡献计算资源参与网络"
  },
  {
    id: "Gradients",
    name: "Gradients (SN 56)",
    description: "专注于AI模型训练和梯度计算",
    focus: "AI模型训练",
    participants: "AI研究人员和开发者",
    howToJoin: "提供模型训练算力或使用训练服务"
  },
  {
    id: "Chutes",
    name: "Chutes (SN 64)",
    description: "AI模型推理和部署",
    focus: "AI推理服务",
    participants: "AI开发者和企业",
    howToJoin: "部署AI模型或使用推理服务"
  },
  {
    id: "OpenKaito",
    name: "OpenKaito",
    description: "开放的数据索引和检索子网",
    focus: "数据索引",
    participants: "数据科学家和开发者",
    howToJoin: "贡献数据源或使用索引服务"
  },
  {
    id: "MyShell",
    name: "MyShell",
    description: "文本到语音(TTS)模型子网",
    focus: "TTS模型",
    participants: "语音技术开发者",
    howToJoin: "提供TTS模型或使用语音服务"
  },
  {
    id: "APEX",
    name: "APEX",
    description: "高性能AI推理子网",
    focus: "AI推理加速",
    participants: "AI应用开发者",
    howToJoin: "提供GPU资源或使用推理服务"
  }
];

// 推特内容模板
const TWEET_TEMPLATES = [
  // 模板1: 详细功能介绍
  (subnet) => `🌐 Bittensor子网探索 #${String(Math.floor(Math.random() * 100)).padStart(3, '0')}: ${subnet.name}
  
🔍 子网功能概览:
• 用途: ${subnet.description}
• 技术特点: ${subnet.focus}相关创新
• 参与方式: ${subnet.howToJoin}
• 价值: 为Bittensor生态带来${subnet.focus}能力

#Bittensor #去中心化AI #${subnet.focus.replace(/\s+/g, '')} #TAO`,
  
  // 模板2: 解读模式
  (subnet) => `🚀 ${subnet.name} 子网解读

💡 这个子网专注于${subnet.description}，通过${subnet.focus}技术为Bittensor网络提供独特价值。

📈 适合${subnet.participants}参与
🎯 如何体验: ${subnet.howToJoin}

#Bittensor生态 #去中心化AI #${subnet.focus.replace(/\s+/g, '')}`,
  
  // 模板3: 快速概览
  (subnet) => `📋 ${subnet.name} 子网速览

⚡ 核心功能: ${subnet.focus}
⚡ 网络地位: Bittensor生态中的${subnet.focus}子网
⚡ 参与门槛: ${subnet.howToJoin}

🔥 探索这个子网如何推动${subnet.focus}领域的发展
#Bittensor #Web3 #AI基础设施`
];

/**
 * 生成随机的子网推特内容
 */
function generateRandomSubnetTweet() {
  const randomSubnet = BITTENSOR_SUBNETS[Math.floor(Math.random() * BITTENSOR_SUBNETS.length)];
  const randomTemplate = TWEET_TEMPLATES[Math.floor(Math.random() * TWEET_TEMPLATES.length)];
  
  return {
    subnet: randomSubnet,
    content: randomTemplate(randomSubnet),
    timestamp: new Date().toISOString()
  };
}

/**
 * 生成今日的推特内容集合
 */
function generateDailyTweets(count = 3) {
  const tweets = [];
  for (let i = 0; i < count; i++) {
    tweets.push(generateRandomSubnetTweet());
  }
  return tweets;
}

/**
 * 保存推特内容到文件
 */
async function saveTweetsToFile(tweets) {
  const content = `# 今日Bittensor子网推特内容 - ${new Date().toLocaleDateString('zh-CN')}
  
每日为中文社区生成的Bittensor子网介绍内容

## 推特内容列表

${tweets.map((tweet, index) => `### 推特 ${index + 1}:
\`\`\`
${tweet.content}
\`\`\`

*子网*: ${tweet.subnet.name}
*主题*: ${tweet.subnet.focus}
*时间*: ${tweet.timestamp}
`).join('\n')}

## 子网信息参考

${BITTENSOR_SUBNETS.map(subnet => `**${subnet.name}**: ${subnet.description}`).join('\n')}
`;

  const filename = `bittensor_tweets_${new Date().toISOString().split('T')[0]}.md`;
  const filepath = path.join(process.cwd(), 'daily_tweets', filename);
  
  // 确保目录存在
  await fs.mkdir(path.join(process.cwd(), 'daily_tweets'), { recursive: true });
  
  await fs.writeFile(filepath, content, 'utf8');
  return filepath;
}

// 如果直接运行此脚本
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 检测是否为主模块运行
const isMainModule = process.argv[1] === __filename;

if (isMainModule) {
  (async () => {
    console.log('🤖 开始生成Bittensor子网推特内容...');
    
    try {
      // 生成今日推特内容
      const dailyTweets = generateDailyTweets(3); // 生成3条推特
      
      // 显示生成的内容
      console.log('\n📝 今日生成的推特内容:');
      dailyTweets.forEach((tweet, index) => {
        console.log(`\n--- 推特 ${index + 1} ---`);
        console.log(tweet.content);
      });
      
      // 保存到文件
      const filepath = await saveTweetsToFile(dailyTweets);
      console.log(`\n💾 推特内容已保存至: ${filepath}`);
      
      console.log('\n✅ 推特内容生成完成！可以复制以上内容发布到社交媒体。');
      
    } catch (error) {
      console.error('❌ 生成推特内容时出错:', error.message);
    }
  })();
}

export { generateRandomSubnetTweet, generateDailyTweets, saveTweetsToFile };