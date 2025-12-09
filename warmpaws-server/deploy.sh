#!/bin/bash

# PawMart Backend Deployment Script
# This script helps deploy the backend to various platforms

echo "🚀 PawMart Backend Deployment Script"
echo "===================================="

# Check if we're in the right directory
if [ ! -f "server.js" ]; then
    echo "❌ Error: Please run this script from the warmpaws-server directory"
    exit 1
fi

echo "📋 Available deployment options:"
echo "1) Heroku"
echo "2) Railway" 
echo "3) Render"
echo "4) Vercel"
echo "5) Local testing"
echo "6) Exit"

read -p "Choose deployment option (1-6): " choice

case $choice in
    1)
        echo "🔧 Deploying to Heroku..."
        
        # Check if Heroku CLI is installed
        if ! command -v heroku &> /dev/null; then
            echo "❌ Heroku CLI not found. Please install it first:"
            echo "   Visit: https://devcenter.heroku.com/articles/heroku-cli"
            exit 1
        fi
        
        # Create Heroku app
        echo "📱 Creating Heroku app..."
        heroku create pawmart-backend-$RANDOM
        
        # Set environment variables
        echo "🔐 Setting environment variables..."
        heroku config:set NODE_ENV=production
        heroku config:set FIREBASE_PROJECT_ID=warmpaws-app-fa44d
        heroku config:set JWT_SECRET=your-super-secure-jwt-secret-$(date +%s)
        heroku config:set CLIENT_URL=https://poetic-blancmange-cfdeec.netlify.app
        
        # Deploy
        echo "🚀 Deploying to Heroku..."
        git add .
        git commit -m "Deploy to Heroku"
        git push heroku main
        
        echo "✅ Deployment complete!"
        echo "🌐 Your app is available at: https://$(heroku apps:info --json | jq -r '.app.name').herokuapp.com"
        ;;
        
    2)
        echo "🔧 Deploying to Railway..."
        
        # Check if Railway CLI is installed
        if ! command -v railway &> /dev/null; then
            echo "❌ Railway CLI not found. Installing..."
            npm install -g @railway/cli
        fi
        
        echo "🚂 Initializing Railway project..."
        railway login
        railway init
        railway up
        
        echo "✅ Deployment complete!"
        echo "🌐 Your app is available at your Railway dashboard"
        ;;
        
    3)
        echo "🔧 Deploying to Render..."
        echo "📋 Please follow these steps:"
        echo "1. Go to https://render.com"
        echo "2. Connect your GitHub repository"
        echo "3. Create a new Web Service"
        echo "4. Set build command: npm install"
        echo "5. Set start command: npm start"
        echo "6. The render.yaml file will be automatically detected"
        echo "7. Set environment variables in the dashboard"
        ;;
        
    4)
        echo "🔧 Deploying to Vercel..."
        
        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo "❌ Vercel CLI not found. Installing..."
            npm install -g vercel
        fi
        
        echo "🚀 Deploying to Vercel..."
        vercel --prod
        
        echo "✅ Deployment complete!"
        ;;
        
    5)
        echo "🔧 Running local test..."
        echo "📦 Installing dependencies..."
        npm install
        
        echo "🚀 Starting local server..."
        echo "🌐 API will be available at: http://localhost:5000"
        echo "❤️  Health check: http://localhost:5000/api/health"
        echo ""
        echo "Press Ctrl+C to stop the server"
        
        npm run dev
        ;;
        
    6)
        echo "👋 Goodbye!"
        exit 0
        ;;
        
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment process completed!"
echo "📖 Don't forget to update your frontend environment variables"
echo "   with your new backend URL."