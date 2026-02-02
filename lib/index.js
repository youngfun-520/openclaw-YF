/**
 * Token Optimizer - 入口文件
 */

const TokenOptimizerEngine = require('./token-optimizer-engine');

class TokenOptimizer {
  constructor(config = {}) {
    this.engine = new TokenOptimizerEngine(config);
  }

  /**
   * 分析AI使用情况
   */
  async analyze(usageData) {
    return await this.engine.analyzeUsage(usageData);
  }

  /**
   * 优化单个请求
   */
  async optimizeRequest(request) {
    const optimizations = {};

    // 应用各种优化策略
    optimizations.prompt = this.engine.promptEngineering(request.prompt || '');
    optimizations.model = this.engine.modelDowngrade(request.model, request.complexity || 0.5);
    optimizations.caching = this.engine.caching(request);
    optimizations.context = this.engine.contextCompression(request.context || '');
    optimizations.task = this.engine.taskDecomposition(request.task || '');

    return optimizations;
  }

  /**
   * 批量优化
   */
  async optimizeBatch(requests) {
    const results = [];
    for (const request of requests) {
      results.push(await this.optimizeRequest(request));
    }
    return results;
  }

  /**
   * 获取优化建议
   */
  async getRecommendations(usageData) {
    return await this.engine.generateRecommendations(usageData);
  }
}

module.exports = TokenOptimizer;

// 如果直接运行此文件，则启动CLI
if (require.main === module) {
  const { program } = require('commander');
  const fs = require('fs').promises;
  
  program
    .version('1.0.0')
    .description('AI Token Optimizer CLI');

  program
    .command('analyze')
    .description('分析AI使用数据')
    .argument('<file>', 'JSON文件路径包含使用数据')
    .action(async (file) => {
      try {
        const data = JSON.parse(await fs.readFile(file, 'utf8'));
        const optimizer = new TokenOptimizer();
        const result = await optimizer.analyze(data);
        console.log(JSON.stringify(result, null, 2));
      } catch (error) {
        console.error('分析失败:', error.message);
      }
    });

  program
    .command('optimize')
    .description('优化单个请求')
    .argument('<request>', '请求对象(JSON字符串)')
    .action(async (requestStr) => {
      try {
        const request = JSON.parse(requestStr);
        const optimizer = new TokenOptimizer();
        const result = await optimizer.optimizeRequest(request);
        console.log(JSON.stringify(result, null, 2));
      } catch (error) {
        console.error('优化失败:', error.message);
      }
    });

  program.parse();
}
