// Firebase Client Configuration for AuthContext
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Check if Firebase is enabled
const isFirebaseEnabled = import.meta.env.VITE_ENABLE_FIREBASE === 'true';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase only if enabled and config is available
let app = null;
let auth = null;

if (isFirebaseEnabled && firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
} else {
  console.log('Firebase is disabled or not configured');
}

export { auth };
export default app;