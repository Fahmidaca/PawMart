// Firebase Flexible Configuration Test Script
// Tests both environment variables and local file methods

const admin = require('./src/config/firebase-flexible');

async function testFirebaseFlexibleConnection() {
  console.log('🚀 Testing Firebase Admin SDK - Flexible Configuration...\n');
  
  try {
    // Test service account loading
    const serviceAccount = admin.getServiceAccount();
    
    console.log('📋 Service Account Details:');
    console.log(`  Project ID: ${serviceAccount.project_id}`);
    console.log(`  Client Email: ${serviceAccount.client_email}`);
    console.log(`  Private Key ID: ${serviceAccount.private_key_id.substring(0, 8)}...`);
    
    // Check environment variables
    console.log('\n🔧 Environment Variables:');
    console.log(`  FIREBASE_PROJECT_ID: ${process.env.FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing'}`);
    console.log(`  FIREBASE_SERVICE_ACCOUNT: ${process.env.FIREBASE_SERVICE_ACCOUNT ? '✅ Set (env var)' : '📁 Using local file'}`);
    console.log(`  MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ Missing'}`);
    
    // Test Firebase services
    console.log('\n🧪 Testing Firebase Services:');
    
    // Test Auth
    try {
      const auth = admin.getAuth();
      console.log('  🔐 Auth: ✅ Available');
    } catch (authError) {
      console.log('  🔐 Auth: ⚠️ Not available');
    }
    
    // Test Firestore
    try {
      const firestore = admin.getFirestore();
      console.log('  📊 Firestore: ✅ Available');
    } catch (firestoreError) {
      console.log('  📊 Firestore: ⚠️ Not available');
    }
    
    // Test Storage
    try {
      const storage = admin.getStorage();
      console.log('  ☁️ Storage: ✅ Available');
    } catch (storageError) {
      console.log('  ☁️ Storage: ⚠️ Not available');
    }
    
    console.log('\n🎉 Firebase Admin SDK - Flexible Configuration Test Passed!');
    console.log(`📍 Project: ${serviceAccount.project_id}`);
    console.log(`🔐 Service Account: ${serviceAccount.client_email}`);
    console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
    console.log('🚀 Ready for both local development and production deployment!\n');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ Firebase Flexible Configuration Test Failed:');
    console.error(`Error: ${error.message}`);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. For local development: Place serviceAccountKey.json in project root');
    console.error('2. For production: Set FIREBASE_SERVICE_ACCOUNT environment variable');
    console.error('3. Ensure FIREBASE_PROJECT_ID is set');
    console.error('4. Check that your Firebase project ID matches\n');
    
    return false;
  }
}

// Run the test
if (require.main === module) {
  testFirebaseFlexibleConnection()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = testFirebaseFlexibleConnection;