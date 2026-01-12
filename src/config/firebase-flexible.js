// Firebase Admin SDK Configuration - Flexible Version
// Supports both local file (development) and environment variables (production)

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Environment variables validation
const requiredEnvVars = [
  'FIREBASE_PROJECT_ID',
  'MONGODB_URI'
];

// Check for required environment variables
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});

// Function to get service account configuration
function getServiceAccount() {
  // Priority 1: Environment variable (production)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      console.log('✅ Using Firebase service account from environment variable');
      return serviceAccount;
    } catch (error) {
      console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable:', error.message);
      throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT format');
    }
  }
  
  // Priority 2: Local file (development)
  const localPath = path.join(__dirname, '../../serviceAccountKey.json');
  if (fs.existsSync(localPath)) {
    try {
      const serviceAccount = require(localPath);
      console.log('✅ Using Firebase service account from local file');
      console.log('📁 File:', localPath);
      return serviceAccount;
    } catch (error) {
      console.error('❌ Failed to load local service account file:', error.message);
    }
  }
  
  // Fallback: Try alternative local paths
  const alternativePaths = [
    path.join(process.cwd(), 'serviceAccountKey.json'),
    path.join(process.cwd(), 'config', 'serviceAccountKey.json'),
    path.join(__dirname, 'serviceAccountKey.json')
  ];
  
  for (const altPath of alternativePaths) {
    if (fs.existsSync(altPath)) {
      try {
        const serviceAccount = require(altPath);
        console.log('✅ Using Firebase service account from alternative path');
        console.log('📁 File:', altPath);
        return serviceAccount;
      } catch (error) {
        console.error(`❌ Failed to load from ${altPath}:`, error.message);
      }
    }
  }
  
  throw new Error('No Firebase service account found. Please set FIREBASE_SERVICE_ACCOUNT environment variable or place serviceAccountKey.json file.');
}

// Initialize Firebase Admin SDK
let firebaseApp;

try {
  const serviceAccount = getServiceAccount();
  
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
  
  console.log('✅ Firebase Admin SDK initialized successfully');
  console.log(`📍 Project ID: ${process.env.FIREBASE_PROJECT_ID}`);
  console.log(`🔐 Service Account: ${serviceAccount.client_email}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
} catch (error) {
  console.error('❌ Firebase Admin SDK initialization failed:', error.message);
  console.error('🔧 Solutions:');
  console.error('1. Set FIREBASE_SERVICE_ACCOUNT environment variable with JSON content');
  console.error('2. Download serviceAccountKey.json from Firebase Console');
  console.error('3. Place serviceAccountKey.json in project root or config/ directory');
  process.exit(1);
}

// Export configured Firebase Admin instance and helper functions
module.exports = admin;
module.exports.getAuth = () => admin.auth();
module.exports.getFirestore = () => admin.firestore();
module.exports.getStorage = () => admin.storage();
module.exports.getServiceAccount = getServiceAccount;