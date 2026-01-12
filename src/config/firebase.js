// Firebase Admin SDK Configuration
const admin = require('firebase-admin');

// Environment variables validation
const requiredEnvVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_SERVICE_ACCOUNT',
  'MONGODB_URI'
];

// Check for required environment variables
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});

// Initialize Firebase Admin SDK
let firebaseApp;

try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
  
  console.log('✅ Firebase Admin SDK initialized successfully');
  console.log(`📍 Project ID: ${process.env.FIREBASE_PROJECT_ID}`);
  console.log(`🔐 Service Account: ${serviceAccount.client_email}`);
  
} catch (error) {
  console.error('❌ Firebase Admin SDK initialization failed:', error.message);
  console.error('🔧 Please check your FIREBASE_SERVICE_ACCOUNT environment variable');
  process.exit(1);
}

// Export configured Firebase Admin instance
module.exports = admin;
module.exports.getAuth = () => admin.auth();
module.exports.getFirestore = () => admin.firestore();
module.exports.getStorage = () => admin.storage();
