# 🔧 Fix "auth/configuration-not-found" Error

## What's Happening
Firebase is loading but can't find the project configuration. This usually means:
1. Environment variables not being read by Netlify
2. Firebase project settings need adjustment
3. Authentication not properly enabled

## 🔍 Step 1: Verify Firebase Authentication

### Go to Firebase Console:
1. Visit https://console.firebase.google.com/project/warmpaws-app-fa44d
2. Click **"Authentication"** in the left menu
3. Click **"Get started"** if not already done
4. Go to **"Sign-in method"** tab
5. Make sure **"Email/Password"** is **ENABLED** (green toggle)

## 🔍 Step 2: Check Netlify Environment Variables

In your Netlify site settings:
1. **Site settings** → **Environment variables**
2. Verify all 6 variables are set correctly:
   ```
   VITE_FIREBASE_API_KEY=AIzaSyD8KLW2lzK7CRiLchsDyUt3oxoeqrDFIvs
   VITE_FIREBASE_AUTH_DOMAIN=warmpaws-app-fa44d.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=warmpaws-app-fa44d
   VITE_FIREBASE_STORAGE_BUCKET=warmpaws-app-fa44d.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=658484214322
   VITE_FIREBASE_APP_ID=1:658484214322:web:df5e311b9f57d840f29a2b
   ```

## 🔍 Step 3: Enable Authentication (Critical)

**This is likely the issue!** In Firebase Console:

1. Go to **"Authentication"**
2. Click **"Get started"** (if not done already)
3. Click **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. **Enable the first toggle** (Email/Password)
6. Click **"Save"**
7. (Optional) Also enable **"Google"** provider

## 🔍 Step 4: Check Web App Registration

In Firebase Console:
1. Go to **"Project settings"** (gear icon)
2. Scroll to **"Your apps"** section
3. Make sure there's a **web app** registered with the exact config you have

## 🚨 Most Likely Fix
**Enable Email/Password authentication in Firebase Console!** 

This is the most common cause of "configuration-not-found" errors.

After enabling, redeploy and the error should be gone!