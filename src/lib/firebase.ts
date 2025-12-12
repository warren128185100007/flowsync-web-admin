// src/lib/firebase.ts
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  setPersistence, 
  browserSessionPersistence 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your existing Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB-N9fe1ItqiwviiNDh1HrXIMl7RNwqNXk",
  authDomain: "flowsync-mobile-app.firebaseapp.com",
  projectId: "flowsync-mobile-app",
  storageBucket: "flowsync-mobile-app.firebasestorage.app",
  messagingSenderId: "973374894026",
  appId: "1:973374894026:web:e05000569b50b80cdb2933",
  measurementId: "G-GQ5WWBQWX4"
};

// Create separate admin instance
const ADMIN_APP_NAME = "flowsync-admin";

let adminApp: FirebaseApp;
let adminAuth: ReturnType<typeof getAuth>;
let adminDb: ReturnType<typeof getFirestore>;
let adminStorage: ReturnType<typeof getStorage>;

console.log('🔄 Initializing Firebase...');

if (!getApps().some(app => app.name === ADMIN_APP_NAME)) {
  console.log('📱 Creating new Firebase admin app');
  adminApp = initializeApp(firebaseConfig, ADMIN_APP_NAME);
  adminAuth = getAuth(adminApp);
  adminDb = getFirestore(adminApp);
  adminStorage = getStorage(adminApp);
  
  // Set admin-specific persistence
  setPersistence(adminAuth, browserSessionPersistence);
  
  console.log('✅ Firebase initialized successfully');
  console.log('📊 Firestore database:', adminDb);
  console.log('📦 Storage:', adminStorage);
} else {
  console.log('🔄 Using existing Firebase app');
  adminApp = getApps().find(app => app.name === ADMIN_APP_NAME)!;
  adminAuth = getAuth(adminApp);
  adminDb = getFirestore(adminApp);
  adminStorage = getStorage(adminApp);
}

export { adminAuth, adminDb, adminStorage };
export default adminApp;