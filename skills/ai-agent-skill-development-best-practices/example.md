# 使用示例：应用AI代理开发最佳实践

## 场景：创建一个新的AI代理技能

以下是如何应用"AI代理技能开发最佳实践"中的原则来创建一个新技能的示例。

### 1. 项目初始化阶段
```bash
# 创建项目目录结构
mkdir my-ai-agent-skill
cd my-ai-agent-skill
mkdir src tests docs config

# 初始化项目
touch README.md
touch requirements.txt
touch .gitignore
```

### 2. 应用模块化设计原则
```python
# src/
├── __init__.py
├── core/
│   ├── __init__.py
│   ├── agent.py          # 核心代理逻辑
│   └── handler.py        # 请求处理
├── utils/
│   ├── __init__.py
│   ├── validation.py     # 数据验证
│   └── helpers.py        # 辅助函数
└── models/
    ├── __init__.py
    ├── request.py        # 请求模型
    └── response.py       # 响应模型
```

### 3. 实现错误处理机制
```python
# src/core/handler.py
import logging
from typing import Optional
from ..models.request import RequestModel
from ..models.response import ResponseModel

class SkillHandler:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
    
    async def process_request(self, request: RequestModel) -> Optional[ResponseModel]:
        try:
            # 处理请求的核心逻辑
            result = await self._execute_skill(request)
            return ResponseModel(success=True, data=result)
        
        except ValidationError as e:
            self.logger.error(f"Validation error: {str(e)}")
            return ResponseModel(success=False, error=str(e), error_type="validation")
        
        except ExternalServiceError as e:
            self.logger.error(f"External service error: {str(e)}")
            # 实现降级方案
            return self._fallback_response(request)
        
        except Exception as e:
            self.logger.exception("Unexpected error occurred")
            return ResponseModel(success=False, error="Internal error", error_type="internal")
```

### 4. 编写测试
```python
# tests/test_core.py
import pytest
from src.core.agent import SkillAgent
from src.models.request import RequestModel

@pytest.fixture
def agent():
    return SkillAgent()

def test_process_valid_request(agent):
    """测试处理有效请求"""
    request = RequestModel(data="valid input")
    result = agent.process(request)
    assert result.success is True
    assert result.data is not None

def test_process_invalid_request(agent):
    """测试处理无效请求"""
    request = RequestModel(data="")  # 无效输入
    result = agent.process(request)
    assert result.success is False
    assert "error" in result
```

### 5. 性能优化示例
```python
# src/utils/cache.py
import asyncio
from functools import wraps
from typing import Any, Callable

def cached(ttl: int = 300):
    """简单的缓存装饰器"""
    def decorator(func: Callable) -> Callable:
        cache = {}
        
        @wraps(func)
        async def wrapper(*args, **kwargs):
            key = str(args) + str(sorted(kwargs.items()))
            now = asyncio.get_event_loop().time()
            
            if key in cache:
                result, timestamp = cache[key]
                if now - timestamp < ttl:
                    return result
            
            result = await func(*args, **kwargs)
            cache[key] = (result, now)
            return result
        
        return wrapper
    return decorator

# 在适当的地方使用缓存
@cached(ttl=60)  # 60秒缓存
async def expensive_operation(param: str) -> Any:
    # 执行昂贵的操作
    pass
```

### 6. 监控和日志记录
```python
# src/monitoring.py
import time
import logging
from typing import Dict, Any
from dataclasses import dataclass

@dataclass
class Metrics:
    execution_time: float
    success_count: int
    error_count: int

class Monitor:
    def __init__(self):
        self.metrics = Metrics(0.0, 0, 0)
        self.logger = logging.getLogger(__name__)
    
    def track_execution(self, func_name: str, duration: float, success: bool):
        """跟踪执行指标"""
        if success:
            self.metrics.success_count += 1
        else:
            self.metrics.error_count += 1
            
        self.logger.info(
            f"Function {func_name} executed in {duration:.2f}s, "
            f"success: {success}, total: {self.metrics.success_count + self.metrics.error_count}"
        )
    
    def get_metrics(self) -> Dict[str, Any]:
        """获取当前指标"""
        return {
            "execution_time_avg": self.metrics.execution_time,
            "success_rate": (
                self.metrics.success_count / 
                max(self.metrics.success_count + self.metrics.error_count, 1)
            ),
            "total_requests": self.metrics.success_count + self.metrics.error_count
        }
```

## 实施检查清单

### 设计阶段
- [ ] 是否定义了清晰的模块边界？
- [ ] 是否考虑了扩展性需求？
- [ ] 是否规划了错误处理策略？

### 开发阶段
- [ ] 是否遵循了代码风格指南？
- [ ] 是否实现了适当的错误处理？
- [ ] 是否编写了充足的测试？

### 测试阶段
- [ ] 是否覆盖了所有核心功能？
- [ ] 是否测试了错误情况？
- [ ] 是否进行了性能测试？

### 部署阶段
- [ ] 是否配置了监控？
- [ ] 是否设置了日志记录？
- [ ] 是否制定了回滚计划？

### 维护阶段
- [ ] 是否定期审查代码质量？
- [ ] 是否收集和分析用户反馈？
- [ ] 是否更新了相关文档？

通过遵循这些示例和检查清单，您可以有效地应用AI代理技能开发的最佳实践，从而构建高质量、可维护的AI代理技能。