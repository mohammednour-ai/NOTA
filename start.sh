#!/bin/bash

echo "========================================"
echo " SCENTMATCH - Perfume Recommendation"
echo "========================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "[ERROR] .env file not found!"
    echo ""
    echo "Please create a .env file with your API keys."
    echo "See env-template.txt for reference."
    echo ""
    echo "Minimum required:"
    echo "ANTHROPIC_API_KEY=your_key_here"
    echo "PORT=3000"
    echo ""
    exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "[INFO] Installing dependencies..."
    npm install
fi

echo "[INFO] Starting server..."
echo ""
echo "Server will start at: http://localhost:3000"
echo "Press Ctrl+C to stop"
echo ""

node server.js
