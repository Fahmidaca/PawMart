# 🔥 Firebase Setup Guide for WarmPaws

## Current Issue
Your `.env` file contains placeholder values instead of actual Firebase credentials:
```
VITE_FIREBASE_API_KEY=your_api_key_here ❌
```

## 🔑 Step 1: Get Your Firebase Credentials

### Go to Firebase Console:
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Select your WarmPaws project (or create a new one if needed)
3. Click the **gear icon** → **Project Settings**
4. Scroll down to **"Your apps"** section
5. Click the **web icon** (</>) to add a web app if not already done
6. Copy the **firebaseConfig** object

### Your Firebase Config Should Look Like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

## 📝 Step 2: Update Your .env File

Replace the placeholder values in `C:/Users/User/Documents/warmpaws/.env` with your actual Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_actual_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_actual_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_actual_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_actual_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id_here
VITE_FIREBASE_APP_ID=your_actual_app_id_here
```

## 🌐 Step 3: Set Environment Variables in Netlify

### Method A: Netlify Dashboard (Recommended)
1. Go to your Netlify site dashboard
2. Click **"Site settings"** → **"Environment variables"**
3. Click **"Add a variable"** for each one:

| Key | Value (copy from Firebase) |
|-----|---------------------------|
| `VITE_FIREBASE_API_KEY` | Your actual API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Your auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Your project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Your storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID |
| `VITE_FIREBASE_APP_ID` | Your app ID |

### Method B: Create _redirects file with env vars
Create a file named `.env.production` in your project root:
```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_actual_auth_domain
# ... etc
```

## 🔄 Step 4: Redeploy

After setting environment variables:
1. **Trigger a new deployment** in Netlify
2. Or **drag the new dist folder** with updated .env values

## ✅ Step 5: Test Firebase Authentication

Once deployed, test:
- Sign up with email/password
- Sign in functionality  
- Protected routes
- User profile access

## 🚨 Important Notes:
- ❌ **Never commit** real Firebase keys to public repositories
- ✅ **Use Netlify environment variables** for production
- ✅ **Keep .env file** in .gitignore for security
- ✅ **Regenerate keys** if accidentally exposed

Your Firebase authentication will work once these credentials are properly configured!