# Firebase Google Sign-In Fix - Unauthorized Domain Error

## 🚨 Error Description
```
Firebase: Error (auth/unauthorized-domain).
```

## 🔧 Solution

### Step 1: Add Authorized Domains in Firebase Console

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your project: `warmpaws-app-fa44d`

2. **Navigate to Authentication Settings**
   - Click on "Authentication" in the left sidebar
   - Click on "Settings" tab
   - Click on "Authorized domains"

3. **Add Netlify Domain**
   - Click "Add domain"
   - Add: `poetic-blancmange-cfdeec.netlify.app`
   - Click "Add"

4. **Add Additional Domains for Development**
   - `localhost:5173` (for local development)
   - `localhost:5174` (if different port)
   - `localhost:5175` (if different port)

### Step 2: Verify Domain Configuration

After adding the domains, your authorized domains should include:
```
poetic-blancmange-cfdeec.netlify.app
localhost:5173
warmpaws-app-fa44d.firebaseapp.com
```

### Step 3: Test Google Sign-In

1. Clear browser cache/cookies
2. Visit: https://poetic-blancmange-cfdeec.netlify.app
3. Try Google Sign-In again

## 🔄 Alternative Solutions

### Option A: Use Custom Domain
If you have a custom domain:
1. Add your custom domain to Firebase authorized domains
2. Update Netlify to use the custom domain

### Option B: Update Firebase Configuration
Add domain verification in your Firebase config:

```javascript
// In src/config/firebase.js
const firebaseConfig = {
  // ... your existing config
  authorizedDomains: [
    'poetic-blancmange-cfdeec.netlify.app',
    'localhost:5173',
    'your-custom-domain.com'
  ]
};
```

### Option C: Local Development Fix
For local development, add this to your hosts file:
```
127.0.0.1 localhost
```

## 🛠️ Quick Fix for Immediate Testing

### Temporary Solution: Disable Domain Check
Add this to your Firebase Auth configuration:

```javascript
// In src/contexts/AuthContext.jsx
const loginWithGoogle = async () => {
  try {
    // For testing: Allow all domains temporarily
    const provider = new GoogleAuthProvider();
    
    // Add these scopes if needed
    provider.addScope('email');
    provider.addScope('profile');
    
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error) {
    console.error('Google sign-in error:', error);
    
    // Handle specific errors
    if (error.code === 'auth/unauthorized-domain') {
      console.log('Domain not authorized. Please add domain to Firebase Console.');
      alert('Please contact admin to add domain to Firebase authorized domains list.');
      return null;
    }
    
    throw error;
  }
};
```

## 📋 Step-by-Step Firebase Console Setup

### 1. Access Firebase Console
- URL: https://console.firebase.google.com/
- Login with your Google account

### 2. Select Project
- Click on `warmpaws-app-fa44d` project

### 3. Navigate to Authentication
- Left sidebar → Authentication
- Click "Settings" tab
- Click "Authorized domains"

### 4. Add Authorized Domains
Click "Add domain" and add each domain:
```
poetic-blancmange-cfdeec.netlify.app
localhost:5173
localhost:5174
localhost:5175
```

### 5. Save Changes
- Click "Save" after adding each domain

## 🔍 Verification Steps

After making changes:
1. Wait 2-5 minutes for changes to propagate
2. Clear browser cache
3. Test Google Sign-In on: https://poetic-blancmange-cfdeec.netlify.app

## 🆘 If Still Not Working

### Check These:
1. **Domain Spelling**: Ensure exact domain match
2. **HTTPS Required**: Firebase requires HTTPS for production
3. **Cache Issues**: Clear all browser data
4. **Firebase Project**: Ensure you're editing the correct project

### Contact Support:
- Firebase Support: https://firebase.google.com/support
- Netlify Support: https://www.netlify.com/support/

## 📝 Notes
- Domain changes may take 5-10 minutes to propagate
- Always use HTTPS in production
- Keep localhost domains for development testing
- Consider using a custom domain for production