#!/bin/bash

# Quick deployment script for Vercel
# Usage: ./deploy.sh

echo "🚀 Task Manager Frontend - Vercel Deployment"
echo "============================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run from task-manager-frontend directory"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Commit changes: git add . && git commit -m 'Prepare for Vercel deployment'"
    echo "2. Push to GitHub: git push origin main"
    echo "3. Go to vercel.com and import your repository"
    echo "4. Set environment variable: EXPO_PUBLIC_API_URL"
    echo "5. Deploy!"
else
    echo "❌ Build failed. Check errors above."
    exit 1
fi
