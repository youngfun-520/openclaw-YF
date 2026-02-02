# AI Agent Skill Implementation Examples

## Introduction
This document provides practical examples of implementing different types of skills for AI agents, with focus on real-world use cases and implementation patterns.

## 1. Web Search Skill

A skill that allows an agent to perform web searches:

```python
import requests
from langchain.tools import BaseTool
from typing import Optional
from pydantic import Field

class WebSearchTool(BaseTool):
    name = "web_search"
    description = "Use this tool to search the web for current information"
    api_key: str = Field(..., description="API key for the search service")
    search_url: str = "https://api.duckduckgo.com/"
    
    def _run(self, query: str) -> str:
        try:
            params = {
                'q': query,
                'format': 'json',
                'no_html': '1',
                'skip_disambig': '1'
            }
            response = requests.get(self.search_url, params=params)
            response.raise_for_status()
            
            data = response.json()
            results = data.get('RelatedTopics', [])
            
            if results:
                summary = []
                for i, result in enumerate(results[:3]):  # Limit to top 3 results
                    if 'Text' in result:
                        summary.append(f"{i+1}. {result['Text']}")
                
                return "\n".join(summary) if summary else "No results found"
            else:
                return "No results found for the query"
                
        except Exception as e:
            return f"Error performing web search: {str(e)}"
```

## 2. File Operations Skill

A skill for reading and writing files:

```python
import os
from langchain.tools import BaseTool
from typing import Optional
from pydantic import Field

class FileOperationsTool(BaseTool):
    name = "file_operations"
    description = "Tool for reading, writing, and managing files"
    workspace_path: str = Field(default="./workspace", description="Base path for file operations")
    
    def _run(self, operation: str, filepath: str, content: Optional[str] = None) -> str:
        try:
            full_path = os.path.join(self.workspace_path, filepath)
            
            if operation == "read":
                with open(full_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                return f"File content:\n{content}"
            
            elif operation == "write":
                os.makedirs(os.path.dirname(full_path), exist_ok=True)
                with open(full_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                return f"Successfully wrote to {filepath}"
            
            elif operation == "list":
                files = os.listdir(os.path.dirname(full_path))
                return f"Files in directory: {', '.join(files)}"
            
            else:
                return "Invalid operation. Use 'read', 'write', or 'list'"
                
        except Exception as e:
            return f"Error with file operation: {str(e)}"
```

## 3. Calculator Skill

A skill for mathematical calculations:

```python
import re
import operator
from langchain.tools import BaseTool

class CalculatorTool(BaseTool):
    name = "calculator"
    description = "Use this tool to perform mathematical calculations"
    
    def _run(self, expression: str) -> str:
        try:
            # Clean the expression to remove any potentially dangerous code
            expression = re.sub(r'[^\d+\-*/().\s]', '', expression)
            
            # Evaluate the expression safely
            result = eval(expression, {"__builtins__": {}}, {})
            
            return f"Result: {result}"
        except Exception as e:
            return f"Error calculating expression: {str(e)}"
```

## 4. Database Query Skill

A skill for querying databases:

```python
import sqlite3
from langchain.tools import BaseTool
from typing import Optional
from pydantic import Field

class DatabaseQueryTool(BaseTool):
    name = "database_query"
    description = "Tool for querying database tables"
    db_path: str = Field(..., description="Path to the SQLite database")
    
    def _run(self, query: str) -> str:
        try:
            # Only allow SELECT statements for safety
            if not query.strip().upper().startswith("SELECT"):
                return "Only SELECT queries are allowed for security reasons"
            
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute(query)
            rows = cursor.fetchall()
            
            # Get column names
            columns = [description[0] for description in cursor.description]
            
            # Format results
            result = [columns]  # Header row
            for row in rows:
                result.append(list(row))
            
            conn.close()
            
            # Convert to string representation
            formatted_result = "\n".join([str(row) for row in result])
            return f"Query results:\n{formatted_result}"
            
        except Exception as e:
            return f"Database query error: {str(e)}"
```

## 5. Email Sending Skill

A skill for sending emails:

```python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from langchain.tools import BaseTool
from typing import Dict
from pydantic import Field

class EmailSendingTool(BaseTool):
    name = "send_email"
    description = "Tool for sending emails"
    smtp_server: str = Field(..., description="SMTP server address")
    smtp_port: int = Field(..., description="SMTP server port")
    username: str = Field(..., description="Email account username")
    password: str = Field(..., description="Email account password")
    
    def _run(self, recipient: str, subject: str, body: str) -> str:
        try:
            msg = MIMEMultipart()
            msg['From'] = self.username
            msg['To'] = recipient
            msg['Subject'] = subject
            
            msg.attach(MIMEText(body, 'plain'))
            
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.username, self.password)
            
            text = msg.as_string()
            server.sendmail(self.username, recipient, text)
            server.quit()
            
            return f"Email sent successfully to {recipient}"
            
        except Exception as e:
            return f"Error sending email: {str(e)}"
```

## 6. System Command Skill

A skill for executing safe system commands:

```python
import subprocess
import shlex
from langchain.tools import BaseTool
from typing import List

class SafeCommandTool(BaseTool):
    name = "safe_command"
    description = "Execute safe system commands (limited to read-only operations)"
    
    # Whitelist of allowed commands
    ALLOWED_COMMANDS = ['ls', 'pwd', 'cat', 'head', 'tail', 'grep', 'find', 'du', 'df']
    
    def _run(self, command: str) -> str:
        try:
            # Parse the command safely
            parts = shlex.split(command)
            cmd_name = parts[0]
            
            if cmd_name not in self.ALLOWED_COMMANDS:
                return f"Command '{cmd_name}' is not allowed. Allowed commands: {', '.join(self.ALLOWED_COMMANDS)}"
            
            # Execute the command
            result = subprocess.run(
                parts,
                capture_output=True,
                text=True,
                timeout=30  # 30-second timeout
            )
            
            if result.returncode == 0:
                return result.stdout
            else:
                return f"Command failed: {result.stderr}"
                
        except subprocess.TimeoutExpired:
            return "Command timed out after 30 seconds"
        except Exception as e:
            return f"Error executing command: {str(e)}"
```

## 7. Integration with Agent

Example of how to integrate skills with an agent:

```python
from langchain.agents import initialize_agent, AgentType
from langchain_openai import ChatOpenAI

def create_agent_with_skills():
    # Initialize the LLM
    llm = ChatOpenAI(temperature=0)
    
    # Create instances of your tools
    web_search_tool = WebSearchTool(api_key="your-api-key")
    file_ops_tool = FileOperationsTool(workspace_path="./workspace")
    calculator_tool = CalculatorTool()
    
    # Initialize the agent with tools
    agent = initialize_agent(
        tools=[web_search_tool, file_ops_tool, calculator_tool],
        llm=llm,
        agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
        verbose=True
    )
    
    return agent

# Usage
agent = create_agent_with_skills()
response = agent.run("What is the current population of New York City?")
print(response)
```

## Security Considerations

When implementing skills for AI agents, always consider:

1. **Input Validation**: Sanitize all inputs to prevent injection attacks
2. **Access Control**: Limit what the agent can access based on its role
3. **Rate Limiting**: Prevent abuse of external APIs
4. **Error Handling**: Gracefully handle failures without exposing sensitive information
5. **Logging**: Log all actions for audit trails
6. **Principle of Least Privilege**: Give the minimum permissions necessary

## Testing Skills

Always test your skills thoroughly:

```python
def test_skill(skill, input_data):
    try:
        result = skill._run(**input_data)
        print(f"Success: {result}")
        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

# Example test
test_input = {"query": "population of Tokyo"}
test_skill(WebSearchTool(api_key="test"), test_input)
```

## Conclusion

Creating effective AI agent skills requires balancing functionality with security. By following these patterns and examples, you can build robust, secure, and useful skills for your AI agents.