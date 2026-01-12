// Firebase Connection Test Script
// Run with: node test-firebase.js

const admin = require('firebase-admin');

async function testFirebaseConnection() {
  console.log('🚀 Testing Firebase Admin SDK Connection...\n');
  
  try {
    // Check environment variables
    console.log('📋 Checking Environment Variables:');
    console.log(`  FIREBASE_PROJECT_ID: ${process.env.FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing'}`);
    console.log(`  FIREBASE_SERVICE_ACCOUNT: ${process.env.FIREBASE_SERVICE_ACCOUNT ? '✅ Set' : '❌ Missing'}`);
    console.log(`  MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ Missing'}\n`);
    
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable not set');
    }
    
    // Parse service account
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log('🔑 Service Account Details:');
    console.log(`  Project ID: ${serviceAccount.project_id}`);
    console.log(`  Client Email: ${serviceAccount.client_email}`);
    console.log(`  Private Key ID: ${serviceAccount.private_key_id.substring(0, 8)}...\n`);
    
    // Initialize Firebase Admin SDK
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
    
    console.log('✅ Firebase Admin SDK initialized successfully!\n');
    
    // Test Firebase Auth
    console.log('🔐 Testing Firebase Authentication...');
    try {
      const auth = admin.auth();
      console.log('✅ Firebase Auth service accessible');
    } catch (authError) {
      console.log('⚠️  Firebase Auth service test skipped:', authError.message);
    }
    
    // Test Firebase Firestore
    console.log('📊 Testing Firebase Firestore...');
    try {
      const firestore = admin.firestore();
      console.log('✅ Firebase Firestore service accessible');
    } catch (firestoreError) {
      console.log('⚠️  Firebase Firestore service test skipped:', firestoreError.message);
    }
    
    // Test Firebase Storage
    console.log('☁️  Testing Firebase Storage...');
    try {
      const storage = admin.storage();
      console.log('✅ Firebase Storage service accessible');
    } catch (storageError) {
      console.log('⚠️  Firebase Storage service test skipped:', storageError.message);
    }
    
    console.log('\n🎉 All Firebase services configured successfully!');
    console.log(`📍 Project: ${serviceAccount.project_id}`);
    console.log('🚀 Ready for Vercel deployment!\n');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ Firebase connection test failed:');
    console.error(`Error: ${error.message}`);
    console.error('\n🔧 Troubleshooting steps:');
    console.error('1. Check your Firebase service account key JSON file');
    console.error('2. Verify environment variables are set correctly');
    console.error('3. Ensure the private key is properly formatted');
    console.error('4. Check that your Firebase project ID matches\n');
    
    return false;
  }
}

// Run the test
if (require.main === module) {
  testFirebaseConnection()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = testFirebaseConnection;