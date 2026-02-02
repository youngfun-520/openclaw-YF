# 周期性学习综合与研究技能

这个技能使AI代理能够自主进行研究、综合信息、创建新技能并总结学习进化历程。

## 功能特性

- **专业网站研究**：搜索最新的AI代理技能发展趋势
- **知识综合**：将外部研究与内部记忆整合
- **技能生成**：创建标准化的技能文件
- **进化总结**：记录学习成果和能力提升

## 使用方法

### 基本研究
```bash
node {baseDir}/scripts/research_and_synthesize.mjs "research topic"
```

### 自定义输出路径
```bash
node {baseDir}/scripts/research_and_synthesize.mjs "research topic" "/path/to/output.md"
```

### 示例
```bash
# 研究2026年AI代理趋势
node {baseDir}/scripts/research_and_synthesize.mjs "AI agent skills development trends 2026"

# 研究最佳实践
node {baseDir}/scripts/research_and_synthesize.mjs "best practices for AI agent continuous learning"
```

## 输出内容

每次运行都会生成包含以下内容的总结：

- 搜索到的关键趋势
- 发现的最佳实践
- 综合的关键见解
- 技能开发机会
- 具体的改进建议
- 生成的技能列表
- 进化总结

## 集成方式

此技能可以：
- 作为独立工具运行
- 集成到定期学习循环中
- 与其他技能协作使用
- 作为知识管理流程的一部分