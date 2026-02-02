#!/usr/bin/env node

import { spawnSync } from 'child_process';

// 获取命令行参数
const subnetName = process.argv[2];

if (!subnetName) {
  console.log('Usage: node research_subnet.mjs "subnet_name"');
  process.exit(1);
}

// 使用Tavily搜索获取子网信息
const searchQuery = `Bittensor ${subnetName} subnet details functionality`;
const searchCmd = `node /home/codespace/.openclaw/workspace/skills/tavily-search/scripts/search.mjs "${searchQuery}" -n 3`;

const result = spawnSync(searchCmd, { shell: true, encoding: 'utf-8' });

if (result.status !== 0) {
  console.error(`搜索失败: ${result.stderr}`);
  process.exit(1);
}

console.log(`# ${subnetName} 子网研究摘要\n`);
console.log("## 子网概述");
console.log("- 子网ID: [待查询]");
console.log("- 创建时间: [待查询]");
console.log("- 主要功能: [待查询]");
console.log("\n## 技术特点");
console.log("- 算法机制: [待查询]");
console.log("- 激励模型: [待查询]");
console.log("- 验证方式: [待查询]");
console.log("\n## 参与方式");
console.log("- 矿工参与: [待查询]");
console.log("- 验证者参与: [待查询]");
console.log("- 投资门槛: [待查询]");
console.log("\n## 社区资源");
console.log("- 官方链接: [待查询]");
console.log("- 技术文档: [待查询]");
console.log("- 讨论渠道: [待查询]");
console.log("\n## 数据统计");
console.log("- 当前活跃节点数: [待查询]");
console.log("- TAO排放占比: [待查询]");
console.log("- 网络占比: [待查询]");