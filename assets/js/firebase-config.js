/*
    FIREBASE CONFIGURATION
    ======================
    
    SETUP INSTRUCTIONS:
    1. Go to https://console.firebase.google.com/
    2. Create a new project (or use existing)
    3. Enable Authentication:
       - Go to Authentication > Sign-in method
       - Enable GitHub provider (add Client ID and Client Secret)
       - Enable Google provider
       - Add your domain to authorized domains
    4. Enable Firestore Database:
       - Go to Firestore Database > Create database
       - Start in test mode (or set up security rules)
    5. Enable Storage:
       - Go to Storage > Get started
       - Start in test mode (or set up security rules)
    6. Get your config:
       - Go to Project Settings > General
       - Scroll to "Your apps" > Web app
       - Copy the config object below
    7. Replace the config values below with your Firebase config
*/

// Firebase configuration - REPLACE WITH YOUR VALUES
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase (using CDN - loaded in HTML)
// Make sure to include Firebase scripts in HTML before this file
if (typeof firebase !== 'undefined') {
  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  const storage = firebase.storage();
  
  const githubProvider = new firebase.auth.GithubAuthProvider();
  const googleProvider = new firebase.auth.GoogleAuthProvider();

  // Export for use in other files
  window.firebaseAuth = auth;
  window.firebaseDb = db;
  window.firebaseStorage = storage;
  window.githubProvider = githubProvider;
  window.googleProvider = googleProvider;
} else {
  console.error('Firebase SDK not loaded. Make sure to include Firebase scripts in HTML.');
}

