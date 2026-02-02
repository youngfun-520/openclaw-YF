# API Configuration Issue Skill

## Description
This skill addresses the issue of missing API keys, specifically the Brave Search API key, which prevents the agent from performing web searches.

## Problem
The `web_search` tool requires a Brave Search API key to function. Without this key, the agent cannot perform web searches, limiting its ability to gather information and learn.

## Solution
1. Configure the Brave Search API key by running `openclaw configure --section web` and providing the API key when prompted.
2. Alternatively, set the `BRAVE_API_KEY` environment variable in the Gateway environment.

## Steps to Resolve
1. Obtain a Brave Search API key from the Brave Search API website.
2. Run the configuration command: `openclaw configure --section web`
3. Enter the API key when prompted.
4. Verify the configuration by attempting a web search.

## Prevention
- Ensure all necessary API keys are configured during initial setup.
- Document the required API keys and their sources in the project documentation.
- Regularly check and update API keys as needed.

## Additional Notes
- Other search APIs could potentially be used as alternatives, but would require configuration changes.
- Always ensure API keys are stored securely and not exposed in logs or version control.