import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  // Temporarily disable Firebase for demo mode - change this to 'true' for production
  const enableFirebase = import.meta.env.VITE_ENABLE_FIREBASE === 'true';
  
  return enableFirebase && apiKey && 
         apiKey !== 'your_api_key_here' && 
         apiKey !== 'AIzaSyDEMO' &&
         apiKey.length > 10 &&
         !apiKey.includes('demo');
};

// Export auth - will be null in demo mode
let auth = null;

// Initialize Firebase only if properly configured
if (isFirebaseConfigured()) {
  try {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID
    };
    
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (error) {
    console.warn('Firebase initialization failed, running in demo mode:', error);
    auth = null;
  }
}

// Export auth (will be null in demo mode)
export { auth };
export default null;