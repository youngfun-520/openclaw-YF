#!/bin/bash
# Script to setup Tavily API key for web search functionality

echo "Setting up Tavily Web Search API..."

# Prompt for API key
read -p "Please enter your Tavily API key (get one at https://tavily.com): " TAVILY_API_KEY

# Validate input
if [ -z "$TAVILY_API_KEY" ]; then
    echo "Error: API key cannot be empty."
    exit 1
fi

# Add to environment
export TAVILY_API_KEY="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"

# Optionally save to shell profile for persistence
read -p "Do you want to save this key to your shell profile for future sessions? (y/n): " save_response

if [ "$save_response" = "y" ] || [ "$save_response" = "Y" ]; then
    echo "# Tavily API Key for OpenClaw" >> ~/.bashrc
    echo "export TAVILY_API_KEY=$TAVILY_API_KEY" >> ~/.bashrc
    echo "API key saved to ~/.bashrc"
    echo "Please run 'source ~/.bashrc' or restart your terminal to use the key."
fi

echo "Tavily API key is now set for this session."
echo "You can now use web search functionality in OpenClaw!"