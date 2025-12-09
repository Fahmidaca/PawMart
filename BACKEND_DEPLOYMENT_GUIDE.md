# 🚀 PawMart Backend Deployment Guide

## Overview

This guide covers deploying the PawMart backend API to various cloud platforms. The backend is built with Node.js, Express.js, and supports both MongoDB and Firebase.

## 📋 Prerequisites

- Node.js 18+ installed
- Git repository access
- Firebase project setup
- MongoDB database (optional, Firebase Firestore is primary)

## 🛠️ Platform Deployment Options

### 1. Heroku Deployment

#### Step 1: Install Heroku CLI
```bash
# Download from: https://devcenter.heroku.com/articles/heroku-cli
```

#### Step 2: Create Heroku App
```bash
cd warmpaws-server
heroku create pawmart-backend
```

#### Step 3: Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=5000
heroku config:set FIREBASE_PROJECT_ID=your-project-id
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set CLIENT_URL=https://your-frontend-url.netlify.app
```

#### Step 4: Add Buildpack
```bash
heroku buildpacks:set heroku/nodejs
```

#### Step 5: Deploy
```bash
git add .
git commit -m "Deploy backend to Heroku"
git push heroku main
```

#### Step 6: Scale
```bash
heroku ps:scale web=1
```

### 2. Railway Deployment

#### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

#### Step 2: Login and Deploy
```bash
cd warmpaws-server
railway login
railway init
railway up
```

#### Step 3: Set Environment Variables
```bash
railway variables set NODE_ENV=production
railway variables set PORT=5000
railway variables set FIREBASE_PROJECT_ID=your-project-id
railway variables set JWT_SECRET=your-jwt-secret
railway variables set CLIENT_URL=https://your-frontend-url.netlify.app
```

### 3. Render Deployment

#### Step 1: Connect Repository
1. Go to [render.com](https://render.com)
2. Connect your GitHub repository
3. Select the `warmpaws-server` directory

#### Step 2: Configure Build
```yaml
# render.yaml
services:
  - type: web
    name: pawmart-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
```

#### Step 3: Set Environment Variables
In Render dashboard, set all required environment variables.

### 4. DigitalOcean App Platform

#### Step 1: Create App
1. Go to DigitalOcean Apps
2. Create new app from GitHub
3. Select repository and `warmpaws-server` directory

#### Step 2: Configure
```yaml
# .do/app.yaml
name: pawmart-backend
services:
- name: web
  source_dir: /
  github:
    repo: your-username/pawmart
    branch: master
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: PORT
    value: 8080
```

### 5. Vercel Deployment

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Configure vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

#### Step 3: Deploy
```bash
cd warmpaws-server
vercel --prod
```

## 🔧 Environment Variables Configuration

### Required Variables
```env
NODE_ENV=production
PORT=5000
FIREBASE_PROJECT_ID=your-project-id
JWT_SECRET=your-super-secure-jwt-secret
CLIENT_URL=https://your-frontend-url.netlify.app
```

### Optional Variables
```env
MONGODB_URI=mongodb://localhost:27017/pawmart
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🔐 Firebase Setup for Production

### 1. Create Service Account
1. Go to Firebase Console
2. Project Settings → Service Accounts
3. Generate new private key
4. Download JSON file

### 2. Extract Configuration
```javascript
// Extract these values from service account JSON:
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "xxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "firebase-adminsdk@your-project-id.iam.gserviceaccount.com"
}
```

### 3. Set Environment Variables
```bash
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
FIREBASE_PROJECT_ID=your-project-id
```

## 🗄️ Database Configuration

### Firebase Firestore (Primary)
- No additional setup required
- Automatically configured via service account
- Security rules should be set up in Firebase Console

### MongoDB (Optional)
```bash
# For production, use MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pawmart
```

## 🚦 Health Check

After deployment, test the health endpoint:
```bash
curl https://your-backend-url.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "PawMart Server is running",
  "timestamp": "2025-01-09T13:00:00.000Z"
}
```

## 🔍 API Endpoints

Once deployed, your API will be available at the deployment URL:

### Base URL
```
https://your-backend-url.com
```

### Endpoints
- `GET /` - API information
- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/services` - Get services
- `POST /api/services` - Create service
- `GET /api/listings` - Get listings
- `POST /api/listings` - Create listing
- `GET /api/orders` - Get orders
- `POST /api/orders` - Create order

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions
```yaml
# .github/workflows/deploy-backend.yml
name: Deploy Backend

on:
  push:
    paths:
      - 'warmpaws-server/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Railway
      uses: railway/deploy@v1
      with:
        token: ${{ secrets.RAILWAY_TOKEN }}
        service: pawmart-backend
```

## 📊 Monitoring and Logging

### Recommended Tools
- **Heroku**: Built-in logging
- **Railway**: Built-in monitoring
- **Render**: Built-in logging
- **Sentry**: Error tracking
- **LogRocket**: Frontend monitoring

## 🆘 Troubleshooting

### Common Issues

1. **Port Not Found**
   - Ensure PORT environment variable is set
   - Check platform-specific port requirements

2. **Firebase Connection Failed**
   - Verify service account JSON is correct
   - Check Firebase project ID matches

3. **CORS Errors**
   - Set CLIENT_URL environment variable
   - Ensure frontend URL is correct

4. **Database Connection Failed**
   - Check MongoDB URI format
   - Verify network access for Atlas

### Debug Commands
```bash
# Check logs
heroku logs --tail

# Test API locally
curl http://localhost:5000/api/health

# Check environment variables
heroku config
```

## 🎯 Recommended Deployment

For this project, I recommend:

1. **Railway** - Easy deployment, good free tier
2. **Render** - Simple setup, good documentation
3. **Heroku** - Most popular, extensive documentation

Choose based on your familiarity and requirements.

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review platform-specific documentation
3. Create an issue in the GitHub repository
4. Contact the development team