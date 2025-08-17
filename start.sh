#!/bin/bash

# Web Scraper Pro - Local Setup Script
echo "🕷️  Web Scraper Pro - Local Setup"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (version 18+) first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Start the application
echo "🚀 Starting Web Scraper Pro..."
echo "   Server will be available at: http://localhost:5000"
echo "   Press Ctrl+C to stop the server"
echo ""

npm run dev