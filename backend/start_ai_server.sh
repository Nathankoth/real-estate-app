#!/bin/bash

# AI Explanation Server Startup Script

echo "🚀 Starting AI Explanation Server..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found. Please create one with your OPENAI_API_KEY"
    echo "Example:"
    echo "OPENAI_API_KEY=your_openai_api_key_here"
    echo "PORT=3001"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🎯 Starting Express AI server on port 3001..."
node express_ai_server.js
