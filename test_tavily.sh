#!/bin/bash

# Script to test Tavily search functionality

echo "Testing Tavily search functionality..."

# Check if TAVILY_API_KEY is set
if [ -z "$TAVILY_API_KEY" ]; then
    echo "ERROR: TAVILY_API_KEY environment variable is not set"
    echo "Please set your Tavily API key before running this test."
    echo "You can get one at https://tavily.com"
    exit 1
fi

echo "TAVILY_API_KEY is set, proceeding with test..."

# Test basic search
echo ""
echo "Running test search for 'OpenClaw AI assistant'..."
cd /home/codespace/.openclaw/workspace/skills/tavily-search/scripts/
node search.mjs "OpenClaw AI assistant" -n 3

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Tavily search functionality test completed successfully!"
else
    echo ""
    echo "✗ Tavily search functionality test failed!"
    exit 1
fi