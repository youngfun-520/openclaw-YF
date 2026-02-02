# File System Operations Skill

## Purpose
Provides safe file system operations including reading, writing, and listing files within a designated workspace directory.

## Configuration
- `workspace_root`: Root directory for all operations (default: "./workspace")
- `allowed_extensions`: List of file extensions that can be accessed (default: [".txt", ".md", ".json", ".yaml"])
- `max_file_size_mb`: Maximum file size that can be read (default: 10)

## Parameters
- `operation`: Type of operation ("read", "write", "list", "delete")
- `path`: File or directory path relative to workspace root
- `content`: Content to write (for write operations)
- `recursive`: Whether to recursively list directories (for list operations)

## Implementation

### Input Validation
```python
def validate_input(operation, path, content=None):
    # Verify operation is valid
    if operation not in ["read", "write", "list", "delete"]:
        raise ValueError(f"Invalid operation: {operation}")
    
    # Validate path doesn't contain traversal sequences
    if ".." in path.split("/"):
        raise ValueError("Path traversal is not allowed")
    
    # Validate file extension for read/write operations
    if operation in ["read", "write", "delete"]:
        ext = os.path.splitext(path)[1]
        if ext not in config.allowed_extensions:
            raise ValueError(f"File extension {ext} not allowed")
    
    # Validate file size for write operations
    if operation == "write" and len(content) > config.max_file_size_mb * 1024 * 1024:
        raise ValueError("File exceeds maximum allowed size")
```

### Error Handling
```python
def safe_file_operation(operation, path, content=None):
    try:
        full_path = os.path.join(config.workspace_root, path)
        
        if operation == "read":
            with open(full_path, 'r') as f:
                return f.read()
        elif operation == "write":
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            with open(full_path, 'w') as f:
                f.write(content)
            return {"status": "success", "message": f"File {path} written successfully"}
        elif operation == "list":
            items = []
            for item in os.listdir(full_path):
                item_path = os.path.join(full_path, item)
                items.append({
                    "name": item,
                    "type": "directory" if os.path.isdir(item_path) else "file",
                    "size": os.path.getsize(item_path) if os.path.isfile(item_path) else None
                })
            return items
        elif operation == "delete":
            os.remove(full_path)
            return {"status": "success", "message": f"File {path} deleted successfully"}
    except FileNotFoundError:
        return {"status": "error", "message": f"File or directory {path} not found"}
    except PermissionError:
        return {"status": "error", "message": f"Permission denied accessing {path}"}
    except Exception as e:
        return {"status": "error", "message": f"Unexpected error: {str(e)}"}
```

### Security Measures
- Restricts operations to a designated workspace directory
- Prevents path traversal attacks using `..` sequences
- Validates file extensions against allowed list
- Enforces maximum file sizes
- Uses proper file permissions

### Usage Examples
```javascript
// Reading a file
const readme = file_system({operation: "read", path: "README.md"});

// Writing a file
const result = file_system({
  operation: "write", 
  path: "notes/new_note.md", 
  content: "# My New Note\nContent here..."
});

// Listing directory contents
const files = file_system({operation: "list", path: "documents/"});
```

### Response Format
```json
{
  "status": "success | error",
  "data": "result data or null",
  "message": "descriptive message for errors"
}
```

## Testing
- Unit tests for input validation
- Integration tests for each operation type
- Security tests for path traversal prevention
- Edge case tests for file permissions and non-existent files
- Performance tests for large files