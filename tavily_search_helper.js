#!/usr/bin/env node

// Helper script to use Tavily search when web_search is not available
const { spawn } = require('child_process');
const path = require('path');

const query = process.argv.slice(2).join(' ');

if (!query) {
  console.log('Usage: node tavily_search_helper.js "your search query"');
  process.exit(1);
}

const scriptPath = path.join(__dirname, 'skills', 'tavily-search', 'scripts', 'search.mjs');

const child = spawn('node', [scriptPath, query, '-n', '5'], {
  stdio: 'inherit'
});

child.on('error', (err) => {
  console.error('Error running Tavily search:', err.message);
});

child.on('close', (code) => {
  process.exit(code);
});