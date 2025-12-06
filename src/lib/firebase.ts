import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// PASTE THE CONFIG YOU JUST COPIED ↓
const firebaseConfig = {
  apiKey: "AIzaSyB-N9fe1ItqiwviiNDh1HrXIMl7RNwqNXk",
  authDomain: "flowsync-mobile-app.firebaseapp.com",
  projectId: "flowsync-mobile-app",
  storageBucket: "flowsync-mobile-app.firebasestorage.app",
  messagingSenderId: "973374894026",
  appId: "1:973374894026:web:85db26effb8622bddb2933",
  measurementId: "G-DYJDC0SEGT"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Firestore database