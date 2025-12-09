import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Firebase Admin SDK configuration
const initializeFirebaseAdmin = () => {
  try {
    // Check if service account credentials are provided
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
      console.warn('⚠️  Firebase service account not configured');
      return null;
    }

    // Parse the service account JSON from environment variable
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

    // Initialize Firebase Admin
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID
    });

    console.log('🔥 Firebase Admin SDK initialized successfully');
    return admin;
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error.message);
    return null;
  }
};

const firebaseAdmin = initializeFirebaseAdmin();

export default firebaseAdmin;