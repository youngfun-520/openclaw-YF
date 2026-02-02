#!/usr/bin/env node

/**
 * AI代理功能测试脚本
 * 用于验证AI代理的基本功能
 */

const axios = require('axios');

async function testAIAgent() {
  console.log('🧪 开始测试AI代理功能...\n');
  
  try {
    // 测试健康检查端点
    console.log('1. 测试健康检查端点...');
    const healthResponse = await axios.get('http://localhost:3000/health');
    console.log('   ✓ 健康检查正常:', healthResponse.data.status);
    
    // 测试对话接口
    console.log('\n2. 测试对话接口...');
    const chatResponse = await axios.post('http://localhost:3000/api/chat', {
      message: '你好，这是一个测试消息',
      userId: 'test-user',
      channelId: 'test-channel'
    });
    
    console.log('   ✓ 对话接口正常:', chatResponse.data.success);
    console.log('   ✓ 响应内容:', chatResponse.data.response.text.substring(0, 50) + '...');
    
    // 测试技能接口
    console.log('\n3. 测试技能接口...');
    const skillsResponse = await axios.get('http://localhost:3000/api/skills');
    console.log('   ✓ 技能接口正常，已加载技能数量:', skillsResponse.data.skills.length);
    
    console.log('\n✅ 所有测试通过！AI代理功能正常。');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    if (error.response) {
      console.error('   错误状态码:', error.response.status);
      console.error('   错误响应:', error.response.data);
    }
  }
}

// 如果直接运行此脚本，则执行测试
if (require.main === module) {
  testAIAgent();
}

module.exports = { testAIAgent };