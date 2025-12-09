import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8KLW2lzK7CRiLchsDyUt3oxoeqrDFIvs",
  authDomain: "warmpaws-app-fa44d.firebaseapp.com",
  projectId: "warmpaws-app-fa44d",
  storageBucket: "warmpaws-app-fa44d.firebasestorage.app",
  messagingSenderId: "658484214322",
  appId: "1:658484214322:web:df5e311b9f57d840f29a2b",
  measurementId: "G-16WVG57NHD"
};

// Initialize Firebase
let app, auth, db, analytics;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  analytics = getAnalytics(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization failed:', error);
  throw error;
}

// Export Firebase services
export { auth, db, analytics };
export default app;
