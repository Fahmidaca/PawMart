# 🔍 Firebase Config Copy Guide

## 📍 How to Find Your Firebase Config

### After Creating Your Project:

1. **Click the gear icon** ⚙️ (Project Settings) in the left sidebar
2. **Scroll down to "Your apps"** section  
3. **Click on your web app** (it should show the `</>` icon)
4. **Copy the firebaseConfig object** - it will look exactly like this:

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

## ✅ What to Look For:

- **apiKey**: Should start with `AIzaSy` and be about 39 characters long
- **authDomain**: Should be `your-project-id.firebaseapp.com`
- **projectId**: Your project name (like `warmpaws-app`)
- **storageBucket**: Should be `your-project-id.appspot.com`
- **messagingSenderId**: A 12-digit number
- **appId**: Should start with `1:` and contain your project info

## 🔧 If You Don't See the Config:

### Method 1: Add a Web App
1. **Click the `</>` icon** "Add app" 
2. **App nickname**: `WarmPaws Web App`
3. **Check**: "Also set up Firebase Hosting for this app"
4. **Click "Register app"**
5. **Copy the config** that appears

### Method 2: If Already Added
1. **Click on the existing web app** in the "Your apps" section
2. **Config will appear** below the app

## 🚀 After You Copy the Config:

**Just paste it here in this exact format:**

```javascript
const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_AUTH_DOMAIN_HERE", 
  projectId: "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket: "PASTE_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_SENDER_ID_HERE",
  appId: "PASTE_YOUR_APP_ID_HERE"
};
```

I'll automatically:
1. ✅ Update your `.env` file with real credentials
2. ✅ Enable Firebase authentication  
3. ✅ Restart the development server
4. ✅ Make Google Sign-in work with real accounts!

## 🆘 Need Help?

- **Can't find config?**: Look for the `</>` web app icon
- **Config looks wrong?**: Make sure you copied the entire `firebaseConfig` object
- **Having issues?**: Check that Google Sign-in is enabled in Authentication settings

**Ready to copy? Just paste your config here when you have it!** 🎯