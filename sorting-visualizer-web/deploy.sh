#!/bin/bash

# Deployment script for Vercel

echo "🚀 Deploying Sorting Visualizer to Vercel..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "📦 Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔐 Checking Vercel authentication..."
vercel whoami || vercel login

# Deploy to production
echo "🚢 Deploying to production..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your app should now be live on Vercel!"
