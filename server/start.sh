#!/bin/bash

echo "🚂 Starting Railway deployment..."

# Check environment variables
if [ -z "$MONGODB_URI" ]; then
    echo "❌ MONGODB_URI not set"
    exit 1
fi

echo "✅ Environment variables check passed"

# Start the server
echo "🍥 Starting Naruto Blog server..."
exec node server.js