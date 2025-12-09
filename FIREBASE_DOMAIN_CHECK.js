// Firebase Domain Authorization Checker
// Run this in browser console on your Firebase Console page

console.log('🔍 Checking Firebase Authorized Domains...\n');

// Current domain
const currentDomain = window.location.hostname;
console.log('📍 Current domain:', currentDomain);
console.log('🔗 Full URL:', window.location.href);

// Check if we're on Firebase Console
if (window.location.hostname.includes('firebase.google.com')) {
  console.log('✅ On Firebase Console - proceed with domain addition');
} else {
  console.log('❌ Not on Firebase Console');
  console.log('🌐 Please visit: https://console.firebase.google.com/');
}

// List of domains to add
const domainsToAdd = [
  'poetic-blancmange-cfdeec.netlify.app',
  'localhost:5173',
  'localhost:5174',
  'localhost:5175'
];

console.log('\n📋 Domains to add to Firebase Authorized Domains:');
domainsToAdd.forEach((domain, index) => {
  console.log(`${index + 1}. ${domain}`);
});

console.log('\n📝 Instructions:');
console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
console.log('2. Select your project: warmpaws-app-fa44d');
console.log('3. Authentication → Settings → Authorized domains');
console.log('4. Add each domain above');

console.log('\n⚡ Quick Copy-Paste List:');
console.log(domainsToAdd.join('\n'));

console.log('\n🔄 After adding domains:');
console.log('- Wait 2-5 minutes for propagation');
console.log('- Clear browser cache');
console.log('- Test Google Sign-In again');