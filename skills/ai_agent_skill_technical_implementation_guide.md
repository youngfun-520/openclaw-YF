# AI代理技能开发技术实现指南

## 1. 技能开发框架

### 1.1 基础结构
一个完整的AI代理技能通常包括以下组件：

```
skill_name/
├── SKILL.md              # 技能描述和文档
├── config.json          # 配置文件
├── main.py              # 主要逻辑实现
├── utils.py             # 辅助函数
├── tests/               # 测试文件
│   ├── test_main.py
│   └── test_utils.py
└── requirements.txt     # 依赖包列表
```

### 1.2 技能接口规范
```python
class SkillInterface:
    def __init__(self, config):
        """初始化技能"""
        pass
    
    def validate_input(self, input_data):
        """验证输入数据"""
        pass
    
    def execute(self, input_data):
        """执行主要逻辑"""
        pass
    
    def format_output(self, result):
        """格式化输出结果"""
        pass
```

## 2. 实现细节

### 2.1 输入处理
```python
def validate_and_parse_input(self, raw_input):
    """
    验证和解析输入数据
    - 类型检查
    - 范围验证
    - 必需字段确认
    """
    # 示例实现
    if not isinstance(raw_input, dict):
        raise TypeError("Input must be a dictionary")
    
    required_fields = ['query', 'context']
    for field in required_fields:
        if field not in raw_input:
            raise ValueError(f"Missing required field: {field}")
    
    return raw_input
```

### 2.2 错误处理机制
```python
def safe_execute(self, operation, *args, **kwargs):
    """
    安全执行操作，包含错误处理
    """
    try:
        return operation(*args, **kwargs)
    except SpecificError as e:
        logger.error(f"Specific error occurred: {str(e)}")
        return self.handle_specific_error(e)
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return self.handle_general_error(e)
```

### 2.3 缓存策略
```python
import functools
import time

def cached_with_ttl(ttl_seconds=300):
    """
    带有时效性的缓存装饰器
    """
    def decorator(func):
        func._cache = {}
        
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            key = str(args) + str(sorted(kwargs.items()))
            now = time.time()
            
            if key in func._cache:
                result, timestamp = func._cache[key]
                if now - timestamp < ttl_seconds:
                    return result
            
            result = func(*args, **kwargs)
            func._cache[key] = (result, now)
            return result
        
        return wrapper
    return decorator
```

## 3. 性能优化

### 3.1 异步处理
```python
import asyncio
import aiohttp

async def async_process_batch(self, items):
    """
    异步批量处理项目
    """
    semaphore = asyncio.Semaphore(10)  # 限制并发数
    
    async def process_item(item):
        async with semaphore:
            # 实际处理逻辑
            return await self.process_single_item(item)
    
    tasks = [process_item(item) for item in items]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    return results
```

### 3.2 资源管理
```python
class ResourceManager:
    def __init__(self):
        self.resources = {}
    
    async def __aenter__(self):
        # 初始化资源
        await self.setup_resources()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        # 清理资源
        await self.cleanup_resources()
    
    async def setup_resources(self):
        # 建立连接池、初始化客户端等
        pass
    
    async def cleanup_resources(self):
        # 关闭连接、释放内存等
        pass
```

## 4. 测试策略

### 4.1 单元测试示例
```python
import unittest.mock as mock
import pytest

class TestSkillMainLogic:
    def test_valid_input_processing(self):
        """测试有效输入的处理"""
        skill = SkillImplementation(config={})
        
        mock_input = {
            'query': 'test query',
            'context': {'user_id': '123'}
        }
        
        with mock.patch.object(skill, 'execute_core_logic') as mock_method:
            mock_method.return_value = {'result': 'success'}
            result = skill.execute(mock_input)
            
            assert result['result'] == 'success'
            mock_method.assert_called_once()
    
    def test_invalid_input_handling(self):
        """测试无效输入的处理"""
        skill = SkillImplementation(config={})
        
        invalid_inputs = [
            None,
            {},
            {'query': ''},
            {'context': {}}
        ]
        
        for invalid_input in invalid_inputs:
            with pytest.raises((ValueError, TypeError)):
                skill.validate_input(invalid_input)
```

### 4.2 集成测试
```python
def test_end_to_end_workflow():
    """
    端到端集成测试
    """
    # 设置测试环境
    config = load_test_config()
    skill = SkillImplementation(config)
    
    # 准备测试数据
    test_input = prepare_test_data()
    
    # 执行技能
    result = skill.execute(test_input)
    
    # 验证结果
    assert result is not None
    assert 'expected_field' in result
    assert validate_result_structure(result)
```

## 5. 部署和监控

### 5.1 配置管理
```python
import json
import os
from typing import Dict, Any

class ConfigManager:
    def __init__(self, config_path: str = None):
        self.config = self.load_config(config_path)
    
    def load_config(self, path: str) -> Dict[str, Any]:
        """加载配置文件"""
        if path and os.path.exists(path):
            with open(path, 'r') as f:
                return json.load(f)
        else:
            # 默认配置
            return self.get_default_config()
    
    def get_default_config(self) -> Dict[str, Any]:
        """获取默认配置"""
        return {
            'api_timeout': 30,
            'retry_attempts': 3,
            'cache_ttl': 300,
            'max_concurrent_requests': 10
        }
    
    def get(self, key: str, default=None):
        """获取配置值"""
        return self.config.get(key, default)
```

### 5.2 监控指标
```python
import time
from contextlib import contextmanager

class MetricsCollector:
    def __init__(self):
        self.metrics = {
            'execution_count': 0,
            'total_execution_time': 0,
            'error_count': 0
        }
    
    @contextmanager
    def track_execution(self):
        """跟踪执行时间和次数"""
        start_time = time.time()
        self.metrics['execution_count'] += 1
        
        try:
            yield
        except Exception:
            self.metrics['error_count'] += 1
            raise
        finally:
            execution_time = time.time() - start_time
            self.metrics['total_execution_time'] += execution_time
    
    def get_average_execution_time(self):
        """获取平均执行时间"""
        count = self.metrics['execution_count']
        total_time = self.metrics['total_execution_time']
        return total_time / count if count > 0 else 0
```

## 6. 安全考虑

### 6.1 输入净化
```python
import re

def sanitize_input(user_input: str) -> str:
    """
    净化用户输入，防止注入攻击
    """
    # 移除潜在危险字符
    dangerous_patterns = [
        r'<script.*?>.*?</script>',  # JavaScript
        r'javascript:',              # JS协议
        r'on\w+\s*=',               # 事件处理器
        r'data:text/html',           # HTML数据URI
    ]
    
    sanitized = user_input
    for pattern in dangerous_patterns:
        sanitized = re.sub(pattern, '', sanitized, flags=re.IGNORECASE)
    
    return sanitized.strip()
```

### 6.2 访问控制
```python
class AccessController:
    def __init__(self, auth_provider):
        self.auth_provider = auth_provider
        self.rate_limiter = RateLimiter()
    
    def check_access(self, user_token: str, resource: str) -> bool:
        """检查用户访问权限"""
        user = self.auth_provider.verify_token(user_token)
        if not user:
            return False
        
        # 检查权限
        if not self.has_permission(user, resource):
            return False
        
        # 检查速率限制
        if not self.rate_limiter.allow_request(user.id):
            return False
        
        return True
```

## 总结
AI代理技能的技术实现需要综合考虑架构设计、性能优化、测试覆盖、部署监控和安全保障等多个方面。通过遵循这些实践指南，可以构建出高质量、高可靠的AI代理技能。