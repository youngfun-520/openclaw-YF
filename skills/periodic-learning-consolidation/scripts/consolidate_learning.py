#!/usr/bin/env python3
"""
周期性学习整合脚本
用于分析内存文件、综合外部研究并生成知识摘要
"""

import os
import json
import re
from datetime import datetime, timedelta
from pathlib import Path
import hashlib

class LearningConsolidator:
    def __init__(self, workspace_path="./"):
        self.workspace_path = Path(workspace_path)
        self.memory_path = self.workspace_path / "memory"
        self.skills_path = self.workspace_path / "skills"
        
    def analyze_memory_files(self, days=7):
        """分析最近的内存文件"""
        print(f"分析最近{days}天的内存文件...")
        
        memory_files = []
        keywords = ['learned', 'insight', 'improvement', 'pattern', 'solution', 'issue', 'discovered', 'realized']
        
        # 获取最近几天的内存文件
        cutoff_date = datetime.now() - timedelta(days=days)
        
        for file_path in self.memory_path.glob("*.md"):
            try:
                # 解析文件名中的日期 (格式: YYYY-MM-DD.md)
                date_str = file_path.name.replace('.md', '')
                file_date = datetime.strptime(date_str, "%Y-%m-%d")
                
                if file_date >= cutoff_date:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                                # 提取包含关键词的内容（支持中英文）
                    keyword_matches = []
                    all_keywords = keywords + ['学习', '洞察', '改进', '模式', '解决方案', '问题', '发现', '实现', '总结', '成果', '技能', '发展', '趋势', '最佳实践', '知识', '经验', '成长', '进展', '成就', '理解', '创新', '优化', '效率', '实践', '探索', '掌握', '应用', '提升']
                    for keyword in all_keywords:
                        matches = re.findall(r'.{0,50}' + keyword + r'.{0,50}', content, re.IGNORECASE)
                        keyword_matches.extend(matches)
                    
                    if keyword_matches:
                        memory_files.append({
                            'file': str(file_path),
                            'date': date_str,
                            'keywords_found': len(keyword_matches),
                            'content_snippets': keyword_matches[:5]  # 限制显示数量
                        })
            except ValueError:
                # 如果文件名不是日期格式，则跳过
                continue
        
        return memory_files
    
    def analyze_skills(self):
        """分析现有技能的结构和使用情况"""
        print("分析现有技能...")
        
        skills_info = []
        for skill_dir in self.skills_path.iterdir():
            if skill_dir.is_dir():
                skill_file = skill_dir / "SKILL.md"
                if skill_file.exists():
                    with open(skill_file, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                    # 提取技能名称和描述
                    name_match = re.search(r'name:\s*(.+)', content)
                    desc_match = re.search(r'description:\s*(.+)', content)
                    
                    skills_info.append({
                        'name': name_match.group(1).strip() if name_match else skill_dir.name,
                        'description': desc_match.group(1).strip() if desc_match else "No description",
                        'directory': str(skill_dir),
                        'created': datetime.fromtimestamp(skill_dir.stat().st_ctime).strftime('%Y-%m-%d'),
                        'modified': datetime.fromtimestamp(skill_dir.stat().st_mtime).strftime('%Y-%m-%d')
                    })
        
        return skills_info
    
    def generate_summary(self, memory_analysis, skills_analysis):
        """生成学习整合摘要"""
        print("生成学习整合摘要...")
        
        summary = {
            'generated_at': datetime.now().isoformat(),
            'period_days': 7,
            'memory_files_analyzed': len(memory_analysis),
            'skills_count': len(skills_analysis),
            'key_themes': self.extract_themes(memory_analysis),
            'recent_skills': skills_analysis[-5:],  # 最近添加的5个技能
            'recommendations': self.generate_recommendations(memory_analysis, skills_analysis)
        }
        
        return summary
    
    def extract_themes(self, memory_analysis):
        """从内存分析中提取关键主题"""
        all_content = []
        for item in memory_analysis:
            all_content.extend(item['content_snippets'])
        
        text = ' '.join(all_content).lower()
        
        # 常见主题关键词（支持中英文）
        themes = {
            'technical_skills': ['code', 'script', 'programming', 'api', 'development', 'debug', 'test', '编程', '代码', '脚本', '开发', '调试', '测试'],
            'research': ['research', 'study', 'find', 'discover', 'analyze', 'investigate', '研究', '学习', '发现', '分析', '调查', '探索'],
            'problem_solving': ['issue', 'problem', 'solution', 'fix', 'resolve', 'troubleshoot', '问题', '解决方案', '修复', '解决'],
            'learning': ['learn', 'understand', 'knowledge', 'insight', 'improve', 'evolve', '学习', '理解', '知识', '洞察', '改进', '成长', '进展'],
            'automation': ['automate', 'script', 'workflow', 'process', 'efficiency', 'optimize', '自动化', '脚本', '工作流', '流程', '效率', '优化']
        }
        
        theme_counts = {}
        for theme, keywords in themes.items():
            count = sum(text.count(keyword.lower()) for keyword in keywords)
            if count > 0:
                theme_counts[theme] = count
        
        # 返回最常见的主题
        sorted_themes = sorted(theme_counts.items(), key=lambda x: x[1], reverse=True)
        return [theme for theme, count in sorted_themes[:3]]
    
    def generate_recommendations(self, memory_analysis, skills_analysis):
        """基于分析生成改进建议"""
        recommendations = []
        
        # 检查是否有重复出现的主题，可能需要专门的技能
        themes = self.extract_themes(memory_analysis)
        if 'problem_solving' in themes or 'technical_skills' in themes:
            recommendations.append({
                'type': 'new_skill',
                'title': '常见问题解决技能',
                'description': '基于频繁出现的问题解决需求，建议创建专门的故障排除技能'
            })
        
        # 检查技能更新情况
        if skills_analysis:
            # 检查是否有长时间未更新的技能
            old_skills = [s for s in skills_analysis if 
                         datetime.strptime(s['modified'], '%Y-%m-%d') < datetime.now() - timedelta(days=30)]
            if old_skills:
                recommendations.append({
                    'type': 'maintenance',
                    'title': '技能更新提醒',
                    'description': f'发现{len(old_skills)}个超过30天未更新的技能，建议审查'
                })
        
        # 基于内存分析建议
        if len(memory_analysis) > 5:  # 如果有很多内存文件
            recommendations.append({
                'type': 'organization',
                'title': '知识整理',
                'description': '内存文件较多，建议创建知识分类和索引系统'
            })
        
        return recommendations
    
    def save_summary(self, summary, output_path=None):
        """保存摘要到文件"""
        if output_path is None:
            output_path = self.workspace_path / f"learning_summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)
        
        print(f"摘要已保存到: {output_path}")
        return output_path
    
    def run_consolidation(self):
        """运行完整的整合流程"""
        print("开始周期性学习整合...")
        
        # 1. 分析内存文件
        memory_analysis = self.analyze_memory_files()
        
        # 2. 分析现有技能
        skills_analysis = self.analyze_skills()
        
        # 3. 生成摘要
        summary = self.generate_summary(memory_analysis, skills_analysis)
        
        # 4. 保存摘要
        output_path = self.save_summary(summary)
        
        # 5. 打印关键信息
        print("\n=== 学习整合摘要 ===")
        print(f"生成时间: {summary['generated_at']}")
        print(f"分析内存文件数: {summary['memory_files_analyzed']}")
        print(f"技能总数: {summary['skills_count']}")
        print(f"识别的主题: {', '.join(summary['key_themes'])}")
        print(f"改进建议数: {len(summary['recommendations'])}")
        
        if summary['recommendations']:
            print("\n改进建议:")
            for i, rec in enumerate(summary['recommendations'], 1):
                print(f"{i}. [{rec['type']}] {rec['title']}: {rec['description']}")
        
        return summary


def main():
    """主函数"""
    consolidator = LearningConsolidator()
    summary = consolidator.run_consolidation()


if __name__ == "__main__":
    main()