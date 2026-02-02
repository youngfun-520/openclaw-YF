#!/usr/bin/env node

/**
 * Bittensor子网推特内容生成器
 * 为中文社区生成高质量的Bittensor子网推广内容
 */

import fs from 'fs/promises';
import path from 'path';

// Bittensor子网相关信息模板
const SUBNET_INFO_TEMPLATES = [
  {
    title: "创新AI训练子网",
    description: "利用去中心化网络进行AI模型训练，让每个人都能参与AI发展",
    benefits: ["去中心化训练", "经济激励", "社区治理"],
    hashtags: ["#Bittensor", "#AI", "#DeAI", "#Web3"]
  },
  {
    title: "去中心化机器学习网络",
    description: "通过贡献计算资源获得TAO代币奖励，构建开放的AI生态系统",
    benefits: ["资源贡献", "代币奖励", "开源协作"],
    hashtags: ["#Bittensor", "#ML", "#Decentralized", "#AI"]
  },
  {
    title: "智能合约子网",
    description: "基于Bittensor协议的智能合约网络，实现AI驱动的链上决策",
    benefits: ["智能合约", "AI决策", "链上治理"],
    hashtags: ["#Bittensor", "#SmartContract", "#AIAgent", "#Blockchain"]
  }
];

// 推文内容模板
const TWEET_TEMPLATES = [
  "🌟 发现了一个超酷的Bittensor子网！{title} - {description} {hashtags}",
  "🚀 Bittensor子网探索：{title}正在改变游戏规则！{description} {hashtags}",
  "💡 你知道吗？{title}是Bittensor生态中的一大亮点！{description} {hashtags}",
  "🔥 Bittensor子网推荐：{title}提供了{benefits}等强大功能！{hashtags}",
  "🌐 中文社区专享：深入了解{title}如何推动去中心化AI发展 {description} {hashtags}"
];

/**
 * 生成随机的Bittensor子网推文
 */
function generateSubnetTweet() {
  const template = SUBNET_INFO_TEMPLATES[Math.floor(Math.random() * SUBNET_INFO_TEMPLATES.length)];
  const tweetTemplate = TWEET_TEMPLATES[Math.floor(Math.random() * TWEET_TEMPLATES.length)];
  
  // 随机选择一个推文模板并替换变量
  let tweet = tweetTemplate
    .replace('{title}', template.title)
    .replace('{description}', template.description)
    .replace('{benefits}', template.benefits.slice(0, 2).join("、"))
    .replace('{hashtags}', template.hashtags.join(" "));
  
  // 如果推文超过280字符，则进行截断
  if (tweet.length > 280) {
    const truncatedDescription = template.description.substring(0, 
      template.description.length - (tweet.length - 280));
    tweet = tweetTemplate
      .replace('{title}', template.title)
      .replace('{description}', truncatedDescription + "...")
      .replace('{benefits}', template.benefits[0])
      .replace('{hashtags}', template.hashtags.join(" "));
  }
  
  return {
    content: tweet,
    metadata: {
      subnetTitle: template.title,
      category: "Bittensor子网推广",
      language: "中文",
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * 生成教育性推文
 */
function generateEducationalTweet() {
  const educationalTopics = [
    {
      topic: "什么是Bittensor?",
      content: "📚 Bittensor是一个去中心化机器学习网络，允许AI模型在保护隐私的同时进行协作和竞争。开发者可以通过贡献独特信息获得TAO代币奖励！#Bittensor #DeAI #MachineLearning"
    },
    {
      topic: "子网如何工作?",
      content: "🔧 Bittensor子网是网络上的专业化AI任务分区。任何人都可以创建子网来解决特定问题，比如图像识别、自然语言处理等。#Bittensor #Subnet #AI"
    },
    {
      topic: "参与Bittensor的好处",
      content: "💎 参与Bittensor网络可以获得：1) TAO代币奖励 2) 贡献全球AI网络 3) 访问前沿AI技术。一起来构建去中心化AI未来！#Bittensor #Web3 #AI"
    },
    {
      topic: "中文社区发展",
      content: "🌐 Bittensor中文社区正在快速发展！我们致力于推广去中心化AI理念，帮助中文用户更好地理解和参与Bittensor生态。加入我们一起建设！#BittensorCN #DeAI #Community"
    }
  ];
  
  const topic = educationalTopics[Math.floor(Math.random() * educationalTopics.length)];
  
  return {
    content: topic.content,
    metadata: {
      topic: topic.topic,
      category: "教育内容",
      language: "中文",
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * 生成社区互动推文
 */
function generateCommunityTweet() {
  const communityTemplates = [
    "💬 社区问答时间！你对Bittensor子网最感兴趣的是什么？评论告诉我们你的想法！#Bittensor #Community #QandA",
    "📢 社区投票：你希望下一个Bittensor子网专注于哪个领域？A) NLP B) Computer Vision C) Finance D) Other #Bittensor #Poll",
    "👏 感谢所有为Bittensor中文社区做出贡献的朋友们！一起让去中心化AI变得更 accessible！#BittensorCN #Community",
    "🎯 本周挑战：部署一个Bittensor子网并分享你的经验！我们将选出最有创意的分享给予奖励！#Bittensor #Challenge #BuildTogether"
  ];
  
  const content = communityTemplates[Math.floor(Math.random() * communityTemplates.length)];
  
  return {
    content: content,
    metadata: {
      category: "社区互动",
      language: "中文",
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * 生成综合内容包
 */
function generateComprehensiveContent() {
  const types = ['subnet', 'educational', 'community'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  switch(type) {
    case 'subnet':
      return generateSubnetTweet();
    case 'educational':
      return generateEducationalTweet();
    case 'community':
      return generateCommunityTweet();
    default:
      return generateSubnetTweet();
  }
}

/**
 * 保存生成的内容到文件
 */
async function saveContentToFile(contentObj) {
  const contentDir = path.join(process.cwd(), 'generated-content');
  await fs.mkdir(contentDir, { recursive: true });
  
  const fileName = `bittensor_tweet_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.json`;
  const filePath = path.join(contentDir, fileName);
  
  await fs.writeFile(
    filePath, 
    JSON.stringify(contentObj, null, 2), 
    'utf8'
  );
  
  return filePath;
}

/**
 * 主函数
 */
async function main() {
  console.log('🐦 开始生成Bittensor子网推特内容...');
  
  try {
    // 生成多种类型的内容
    const subnetTweet = generateSubnetTweet();
    const educationalTweet = generateEducationalTweet();
    const communityTweet = generateCommunityTweet();
    const comprehensiveContent = generateComprehensiveContent();
    
    // 显示生成的内容
    console.log('\\n--- 生成的子网推广内容 ---');
    console.log(subnetTweet.content);
    
    console.log('\\n--- 生成的教育内容 ---');
    console.log(educationalTweet.content);
    
    console.log('\\n--- 生成的社区互动内容 ---');
    console.log(communityTweet.content);
    
    console.log('\\n--- 随机综合内容 ---');
    console.log(comprehensiveContent.content);
    
    // 保存所有内容
    const savedFiles = [];
    for (const content of [subnetTweet, educationalTweet, communityTweet, comprehensiveContent]) {
      const filePath = await saveContentToFile(content);
      savedFiles.push(filePath);
    }
    
    console.log('\\n✅ 内容生成完成！');
    console.log(`💾 已保存 ${savedFiles.length} 个内容文件:`);
    for (const file of savedFiles) {
      console.log(`   - ${file}`);
    }
    
    console.log('\\n📈 今日推特内容策略:');
    console.log('   - 上午: 教育性内容 (帮助新用户了解)');
    console.log('   - 下午: 子网推广 (详细介绍特定子网)');
    console.log('   - 晚上: 社区互动 (增加用户参与度)');
    
  } catch (error) {
    console.error('❌ 内容生成过程中出现错误:', error.message);
    process.exit(1);
  }
}

// 检测是否为主模块运行
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isMainModule = process.argv[1] === __filename;

if (isMainModule) {
  main();
}

export { 
  generateSubnetTweet, 
  generateEducationalTweet, 
  generateCommunityTweet, 
  generateComprehensiveContent 
};