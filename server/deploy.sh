#!/bin/bash

# Production deployment script for Naruto Blog
echo "🍥 Starting Naruto Blog Production Deployment"

# Create logs directory
mkdir -p logs

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy .env.example to .env and configure your environment variables."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production

# Check MongoDB connection
echo "🍃 Checking MongoDB connection..."
node -e "
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI)
  .then(() => { 
    console.log('✅ MongoDB connection successful'); 
    process.exit(0); 
  })
  .catch(err => { 
    console.error('❌ MongoDB connection failed:', err.message); 
    process.exit(1); 
  });
"

if [ $? -ne 0 ]; then
    echo "❌ MongoDB connection failed. Please check your MONGODB_URI in .env"
    exit 1
fi

# Start application with PM2
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup

echo "✅ Naruto Blog is now running in production mode!"
echo "📊 Monitor with: pm2 monit"
echo "📝 View logs with: pm2 logs"
echo "🔄 Restart with: pm2 restart naruto-blog-api"