import * as admin from 'firebase-admin';

// Check if Firebase Admin is already initialized
if (!admin.apps.length) {
  try {
    // Use service account from environment variables
    const serviceAccount = {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || "flowsync-mobile-app",
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    // Only initialize if we have the required credentials
    if (serviceAccount.privateKey && serviceAccount.clientEmail) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.projectId}.firebaseio.com`,
        storageBucket: `${serviceAccount.projectId}.appspot.com`,
      });
      console.log('✅ Firebase Admin initialized successfully');
    } else {
      console.warn('⚠️ Firebase Admin credentials not found. Some admin features may be limited.');
      console.log('Using environment variables:', {
        hasPrivateKey: !!process.env.FIREBASE_ADMIN_PRIVATE_KEY,
        hasClientEmail: !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      });
    }
  } catch (error) {
    console.error('❌ Firebase Admin initialization error:', error);
  }
}

// Export Firebase Admin services
export const adminFirestore = admin.firestore();
export const adminAuth = admin.auth();
export const adminStorage = admin.storage();
export { admin };