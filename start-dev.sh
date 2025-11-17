#!/bin/bash

# S2S RBI System - Development Startup Script
# Starts CMS_Backend and S2S_Console in separate terminal windows

echo "🚀 Starting S2S RBI System Development Servers..."
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first:"
    echo "   npm install -g pnpm"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "pnpm-workspace.yaml" ]; then
    echo "❌ Please run this script from the S2S_RBI_System root directory"
    exit 1
fi

echo "📦 Installing dependencies (if needed)..."
pnpm install

echo ""
echo "🔧 Starting CMS_Backend on port 4000..."
cd CMS_Backend
pnpm dev &
CMS_PID=$!
cd ..

echo "   CMS_Backend PID: $CMS_PID"
echo "   URL: http://localhost:4000"
echo ""

# Wait a bit for CMS_Backend to start
sleep 3

echo "🎨 Starting S2S_Console..."
cd S2S_Console
pnpm dev &
CONSOLE_PID=$!
cd ..

echo "   S2S_Console PID: $CONSOLE_PID"
echo "   URL: http://localhost:5001 (or check package.json for actual port)"
echo ""

echo "✅ Servers starting..."
echo ""
echo "To stop servers, run:"
echo "   kill $CMS_PID $CONSOLE_PID"
echo ""
echo "Or press Ctrl+C and manually kill processes:"
echo "   lsof -ti:4000 | xargs kill -9"
echo "   lsof -ti:5001 | xargs kill -9"
echo ""

# Wait for user interrupt
wait





