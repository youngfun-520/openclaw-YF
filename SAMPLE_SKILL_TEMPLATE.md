# Sample Skill Template - Web Search

## Purpose
This skill performs web searches using a search engine API and returns relevant results. It demonstrates best practices for AI agent skill development.

## Configuration
The skill requires a search engine API key to function. This should be stored securely in the environment or configuration system.

## Parameters
- `query`: The search query string (required)
- `count`: Number of results to return (optional, default: 5)
- `safe_search`: Enable safe search filtering (optional, default: true)

## Dependencies
- Web search API access
- Network connectivity
- JSON parsing capabilities

## Implementation

### Input Validation
- Validates that query is not empty
- Ensures count is within acceptable range (1-20)
- Checks for potentially harmful characters

### Error Handling
- Handles API unavailability gracefully
- Manages rate limiting responses
- Processes malformed responses safely

### Security Measures
- Sanitizes user input to prevent injection
- Does not expose API keys in responses
- Implements proper authentication

### Performance Optimizations
- Sets appropriate timeouts
- Caches recent identical queries
- Limits response size to prevent excessive data transfer

## Usage Examples

### Basic Usage
```
web_search(query="latest AI developments")
```

### Advanced Usage
```
web_search(query="machine learning applications", count=10, safe_search=false)
```

## Response Format
Returns a structured object containing:
- Status indicator
- Array of search results
- Metadata about the search
- Error information if applicable

## Testing Approach
- Unit tests for input validation
- Mock API responses for integration tests
- End-to-end tests with actual API calls
- Error condition testing

## Security Considerations
- API keys are managed through secure configuration
- User queries are sanitized before sending to API
- Response data is validated before processing
- Rate limiting is respected to prevent abuse

## Monitoring
- Tracks successful and failed requests
- Monitors response times
- Logs unusual patterns or errors
- Measures usage statistics for optimization

## Maintenance
- Regular API compatibility checks
- Updates for API changes
- Performance monitoring and tuning
- Security audit compliance