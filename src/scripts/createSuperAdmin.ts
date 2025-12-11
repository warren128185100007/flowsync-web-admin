// src/scripts/createSuperAdmin.ts - COMPLETE VERSION
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  Auth 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  Firestore,
  serverTimestamp
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-N9fe1ItqiwviiNDh1HrXIMl7RNwqNXk",
  authDomain: "flowsync-mobile-app.firebaseapp.com",
  projectId: "flowsync-mobile-app",
  storageBucket: "flowsync-mobile-app.firebasestorage.app",
  messagingSenderId: "973374894026",
  appId: "1:973374894026:web:e05000569b50b80cdb2933",
  measurementId: "G-GQ5WWBQWX4"
};

const app = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export interface AdminCreationResult {
  success: boolean;
  email?: string;
  password?: string;
  userId?: string;
  error?: string;
  code?: string;
}

export const createFirstSuperAdmin = async (): Promise<AdminCreationResult> => {
  console.log("🚀 Creating super admin...");
  
  const adminEmail = 'admin@flowsync.com';
  const adminPassword = 'Admin@Flowsync2024!';
  
  try {
    // 1. Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const userId = userCredential.user.uid;
    console.log("✅ Auth user created - UID:", userId);
    
    // 2. Create admin record in web_admins
    const adminData = {
      uid: userId,
      email: adminEmail,
      name: "System Administrator",
      role: "super_admin",
      isActive: true,
      isLocked: false,
      mfaEnabled: false,
      loginAttempts: 0,
      maxLoginAttempts: 5,
      permissions: ["all"],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: 'system'
    };
    
    await setDoc(doc(db, 'web_admins', userId), adminData);
    console.log("✅ Admin created in web_admins collection");
    
    // 3. Also create in admins collection for mobile app
    await setDoc(doc(db, 'admins', userId), {
      uid: userId,
      email: adminEmail,
      role: 'super_admin',
      createdAt: serverTimestamp(),
      createdBy: 'system'
    });
    console.log("✅ Admin created in admins collection");
    
    // 4. Also create in users collection
    await setDoc(doc(db, 'users', userId), {
      uid: userId,
      email: adminEmail,
      name: "System Administrator",
      role: 'super_admin',
      isAdmin: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log("✅ Admin created in users collection");
    
    // 5. Send password reset email
    try {
      await sendPasswordResetEmail(auth, adminEmail);
      console.log("✅ Password reset email sent");
    } catch (emailError) {
      console.log("⚠️ Could not send email");
    }
    
    console.log("\n🎉 SUPER ADMIN CREATED!");
    console.log("📧 Email: admin@flowsync.com");
    console.log("🔑 Password: Admin@Flowsync2024!");
    console.log("\n🔗 Login URL: http://localhost:3000/auth/super-admin");
    
    return {
      success: true,
      email: adminEmail,
      password: adminPassword,
      userId: userId
    };
    
  } catch (error: any) {
    console.error("❌ ERROR:", error.message);
    console.error("Error code:", error.code);
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};

export const testConnection = async (): Promise<boolean> => {
  try {
    const testRef = doc(db, "_test_connection", "test");
    await setDoc(testRef, { test: true, timestamp: serverTimestamp() });
    console.log("✅ Firebase connection successful!");
    return true;
  } catch (error: any) {
    console.error("❌ Connection failed:", error.message);
    return false;
  }
};

// ============================================
// EXECUTION CODE - ADDED TO RUN THE SCRIPT
// ============================================

// Only execute if this file is run directly (not imported as a module)
if (require.main === module) {
  console.log("🚀 =========================================");
  console.log("🚀 FlowSync Super Admin Creation Script");
  console.log("🚀 =========================================");
  
  const runScript = async () => {
    try {
      // First test the connection
      console.log("\n🔌 Testing Firebase connection...");
      const connected = await testConnection();
      
      if (!connected) {
        console.error("❌ Cannot proceed: Firebase connection failed");
        console.log("💡 Check your internet connection and Firebase configuration");
        process.exit(1);
      }
      
      console.log("✅ Firebase connection verified");
      console.log("\n📦 Creating super admin account...");
      
      // Create the admin
      const result = await createFirstSuperAdmin();
      
      if (result.success) {
        console.log("\n" + "=".repeat(50));
        console.log("🎉 ADMIN CREATION SUCCESSFUL!");
        console.log("=".repeat(50));
        console.log("📧 Email:", result.email);
        console.log("🔑 Password:", result.password);
        console.log("🆔 User ID:", result.userId);
        console.log("\n🔗 Login URL: http://localhost:3000/auth/super-admin");
        console.log("\n⚠️  Important: Save these credentials securely!");
        console.log("=".repeat(50));
        process.exit(0);
      } else {
        console.error("\n" + "=".repeat(50));
        console.error("❌ ADMIN CREATION FAILED");
        console.error("=".repeat(50));
        console.error("Error:", result.error);
        console.error("Code:", result.code);
        
        if (result.code === 'auth/email-already-in-use') {
          console.log("\nℹ️  User already exists in Firebase Auth!");
          console.log("You can try to login with:");
          console.log("Email: admin@flowsync.com");
          console.log("Password: Admin@Flowsync2024!");
          console.log("\n💡 If you forgot the password, reset it in Firebase Console");
        } else if (result.code === 'auth/network-request-failed') {
          console.log("\n💡 Check your internet connection");
        } else if (result.code === 'auth/invalid-api-key') {
          console.log("\n💡 Check your Firebase configuration");
        }
        
        process.exit(1);
      }
    } catch (error: any) {
      console.error("\n❌ Unexpected error:", error.message);
      console.error("Stack:", error.stack);
      process.exit(1);
    }
  };

  runScript();
}