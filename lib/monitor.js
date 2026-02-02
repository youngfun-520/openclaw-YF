#!/usr/bin/env node

/**
 * Token Optimizer 监控脚本
 * 实时监控AI服务使用和优化效果
 */

const TokenOptimizer = require('./index');
const fs = require('fs').promises;
const path = require('path');

class TokenMonitor {
  constructor(config = {}) {
    this.optimizer = new TokenOptimizer(config);
    this.config = {
      pollingInterval: config.pollingInterval || 30000, // 30秒
      reportInterval: config.reportInterval || 300000, // 5分钟
      ...config
    };
    
    this.stats = {
      startTime: new Date(),
      totalRequests: 0,
      optimizedRequests: 0,
      estimatedSavings: 0,
      lastReport: new Date()
    };
  }

  async start() {
    console.log('📊 Token Optimizer 监控已启动...');
    console.log(`📈 监控间隔: ${this.config.pollingInterval}ms`);
    console.log(`📋 报告间隔: ${this.config.reportInterval}ms`);
    
    // 定期检查
    setInterval(() => {
      this.checkUsage();
    }, this.config.pollingInterval);
    
    // 定期生成报告
    setInterval(() => {
      this.generateReport();
    }, this.config.reportInterval);
  }

  async checkUsage() {
    try {
      // 这里会连接到实际的AI服务API获取使用数据
      // 为演示目的，使用模拟数据
      const mockUsageData = {
        'gpt-4': { 
          inputTokens: Math.floor(Math.random() * 100000) + 50000, 
          outputTokens: Math.floor(Math.random() * 50000) + 20000 
        },
        'gpt-3.5-turbo': { 
          inputTokens: Math.floor(Math.random() * 500000) + 200000, 
          outputTokens: Math.floor(Math.random() * 400000) + 100000 
        }
      };

      const analysis = await this.optimizer.analyze(mockUsageData);
      
      this.stats.totalRequests += 1;
      this.stats.estimatedSavings += analysis.potentialSavings / 100; // 模拟节约
      
      console.log(`✅ 检查完成 | 当前成本: $${analysis.currentCost.toFixed(2)} | 潜在节约: $${analysis.potentialSavings.toFixed(2)}`);
      
    } catch (error) {
      console.error('❌ 检查使用情况时出错:', error.message);
    }
  }

  async generateReport() {
    const now = new Date();
    const timeElapsed = (now - this.stats.lastReport) / 1000 / 60; // 分钟
    
    const report = {
      timestamp: now.toISOString(),
      uptime: ((now - this.stats.startTime) / 1000 / 60 / 60).toFixed(2) + '小时',
      stats: {
        totalChecks: this.stats.totalRequests,
        estimatedTotalSavings: `$${this.stats.estimatedSavings.toFixed(2)}`,
        avgSavingsPerCheck: `$${(this.stats.estimatedSavings / this.stats.totalRequests || 0).toFixed(2)}`
      },
      periodStats: {
        checksDuringPeriod: Math.round(timeElapsed * (this.config.pollingInterval / 1000 / 60)),
        estimatedSavingsDuringPeriod: `$${(this.stats.estimatedSavings / this.stats.totalRequests * (timeElapsed * (this.config.pollingInterval / 1000 / 60))).toFixed(2)}`
      }
    };

    console.log('\\n📈 === 监控报告 ===');
    console.log(`时间戳: ${report.timestamp}`);
    console.log(`运行时间: ${report.uptime}`);
    console.log(`\\n📊 统计数据:`);
    console.log(`  总检查次数: ${report.stats.totalChecks}`);
    console.log(`  预估总节约: ${report.stats.estimatedTotalSavings}`);
    console.log(`  平均每次节约: ${report.stats.avgSavingsPerCheck}`);
    console.log(`\\n🕒 周期统计 (${timeElapsed.toFixed(1)}分钟):`);
    console.log(`  期间检查次数: ${report.periodStats.checksDuringPeriod}`);
    console.log(`  期间预估节约: ${report.periodStats.estimatedSavingsDuringPeriod}`);
    console.log('==================\\n');

    this.stats.lastReport = now;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const config = {
    pollingInterval: parseInt(process.env.POLLING_INTERVAL) || 30000,
    reportInterval: parseInt(process.env.REPORT_INTERVAL) || 300000
  };

  const monitor = new TokenMonitor(config);
  monitor.start();
}

module.exports = TokenMonitor;