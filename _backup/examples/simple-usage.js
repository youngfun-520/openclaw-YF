/**
 * Token Optimizer 使用示例
 */

const TokenOptimizer = require('../lib/index');

async function example() {
  console.log('🚀 Token Optimizer 使用示例');
  
  // 创建优化器实例
  const optimizer = new TokenOptimizer({
    minCompressionRatio: 0.2,
    maxContextLength: 128000
  });
  
  // 示例1: 分析使用数据
  console.log('\\n📊 示例1: 分析AI使用数据');
  const usageData = {
    'gpt-4': { 
      inputTokens: 500000, 
      outputTokens: 200000 
    },
    'gpt-3.5-turbo': { 
      inputTokens: 1000000, 
      outputTokens: 800000 
    },
    'claude-3-opus': { 
      inputTokens: 200000, 
      outputTokens: 100000 
    }
  };
  
  const analysis = await optimizer.analyze(usageData);
  console.log(`当前月度成本: $${analysis.currentCost.toFixed(2)}`);
  console.log(`潜在节约金额: $${analysis.potentialSavings.toFixed(2)}`);
  console.log(`优化得分: ${analysis.optimizationScore.toFixed(1)}/100`);
  console.log(`建议数量: ${analysis.recommendations.length}`);
  
  // 示例2: 优化单个请求
  console.log('\\n🔧 示例2: 优化单个请求');
  const sampleRequest = {
    model: 'gpt-4',
    prompt: '这是一个很长的提示词，包含了很多可能不必要的上下文信息。我们需要优化这个提示词以减少token的使用，同时保持其核心功能不变。'.repeat(20),
    context: '这是一个很长的上下文，包含了很多背景信息。这些信息可能对当前任务并非全部必要。'.repeat(15),
    complexity: 0.4, // 任务复杂度 (0-1)
    type: 'frequent_query',
    cacheable: true
  };
  
  const optimizations = await optimizer.optimizeRequest(sampleRequest);
  console.log('优化结果:');
  console.log(`  提示词压缩比: ${(optimizations.prompt.compressionRatio * 100).toFixed(1)}%`);
  console.log(`  推荐模型: ${optimizations.model}`);
  console.log(`  上下文压缩比: ${(optimizations.context.compressionRatio * 100).toFixed(1)}%`);
  
  // 示例3: 获取优化建议
  console.log('\\n💡 示例3: 获取优化建议');
  const recommendations = await optimizer.getRecommendations(usageData);
  recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec.title} (${rec.priority}优先级)`);
    console.log(`   ${rec.description}`);
    console.log(`   预估节约: $${rec.estimatedSavings.toFixed(2)}`);
  });
  
  console.log('\\n✅ 示例执行完成!');
}

// 运行示例
if (require.main === module) {
  example().catch(console.error);
}

module.exports = example;