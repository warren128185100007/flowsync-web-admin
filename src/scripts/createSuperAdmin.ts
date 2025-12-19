// src/scripts/createSuperAdmin.ts - FIXED TYPE ERRORS
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
  serverTimestamp,
  collection,
  getDocs,
  query,
  where,
  DocumentData
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

// Define admin interface
interface AdminData {
  uid: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin';
  isActive: boolean;
  isLocked: boolean;
  mfaEnabled: boolean;
  loginAttempts: number;
  maxLoginAttempts: number;
  permissions: string[];
  createdAt: any;
  updatedAt: any;
  createdBy: string;
  status: string;
  lastLogin: any | null;
  passwordResetRequired: boolean;
  isEmailVerified: boolean;
  phoneNumber: string;
  address: string;
}

interface AdminDocument {
  id: string;
  data: AdminData;
}

export interface AdminCreationResult {
  success: boolean;
  email?: string;
  password?: string;
  userId?: string;
  error?: string;
  code?: string;
}

// Check if super admin already exists
export const checkSuperAdminExists = async (): Promise<{
  exists: boolean;
  count: number;
  admins: AdminDocument[];
}> => {
  try {
    // Check in web_admins collection
    const superAdminsQuery = query(
      collection(db, 'web_admins'),
      where('role', '==', 'super_admin')
    );
    
    const snapshot = await getDocs(superAdminsQuery);
    const superAdmins: AdminDocument[] = snapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data() as AdminData
    }));
    
    console.log(`🔍 Found ${superAdmins.length} super admin(s):`);
    superAdmins.forEach(admin => {
      console.log(`   • ${admin.data.email} (${admin.data.name})`);
    });
    
    return {
      exists: superAdmins.length > 0,
      count: superAdmins.length,
      admins: superAdmins
    };
  } catch (error: any) {
    console.error("❌ Error checking super admins:", error.message);
    return {
      exists: false,
      count: 0,
      admins: []
    };
  }
};

// Check if any admin exists (for first time setup)
export const checkAnyAdminExists = async (): Promise<boolean> => {
  try {
    const adminsQuery = query(collection(db, 'web_admins'));
    const snapshot = await getDocs(adminsQuery);
    return snapshot.size > 0;
  } catch (error: any) {
    console.error("❌ Error checking admins:", error.message);
    return false;
  }
};

// Function to create regular admin (to be used by super admin)
export const createAdminAccount = async (
  email: string,
  name: string,
  permissions: string[] = ['dashboard:view', 'users:read', 'devices:read'],
  createdBy: string
): Promise<AdminCreationResult> => {
  console.log("👨‍💼 Creating admin account for:", email);
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      error: "Invalid email format"
    };
  }
  
  // Check if user already exists
  try {
    const existingQuery = query(
      collection(db, 'web_admins'),
      where('email', '==', email)
    );
    const existingSnapshot = await getDocs(existingQuery);
    
    if (!existingSnapshot.empty) {
      return {
        success: false,
        error: `User with email ${email} already exists`
      };
    }
  } catch (error: any) {
    console.warn("⚠️ Could not check existing users:", error.message);
  }
  
  // Generate a secure temporary password
  const tempPassword = `Fl0wSync@${Math.random().toString(36).slice(-8)}`;
  
  try {
    // 1. Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, tempPassword);
    const userId = userCredential.user.uid;
    console.log("✅ Auth user created - UID:", userId);
    
    // 2. Create admin record in admins collection
    const adminData: AdminData = {
      uid: userId,
      email: email,
      name: name,
      role: "admin", // Regular admin only!
      isActive: true,
      isLocked: false,
      mfaEnabled: false,
      loginAttempts: 0,
      maxLoginAttempts: 5,
      permissions: permissions,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: createdBy,
      status: "active",
      lastLogin: null,
      passwordResetRequired: true, // Require password change on first login
      isEmailVerified: false,
      phoneNumber: "",
      address: ""
    };
    
    await setDoc(doc(db, 'admins', userId), adminData);
    console.log("✅ Admin created in admins collection");
    
    // 3. Also create in web_admins for super admin access
    await setDoc(doc(db, 'web_admins', userId), {
      ...adminData,
      role: 'admin' // Make sure it's admin in web_admins too
    });
    console.log("✅ Admin created in web_admins collection");
    
    // 4. Send password reset email
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("✅ Password reset email sent");
    } catch (emailError: any) {
      console.log("⚠️ Could not send email:", emailError.message);
    }
    
    return {
      success: true,
      email: email,
      password: tempPassword, // Only for initial display
      userId: userId
    };
    
  } catch (error: any) {
    console.error("❌ ERROR creating admin:", error.message);
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};

// Function to create super admin (ONE-TIME ONLY)
export const createFirstSuperAdmin = async (): Promise<AdminCreationResult> => {
  console.log("🚀 Creating super admin...");
  
  const adminEmail = 'admin@flowsync.com';
  const adminPassword = 'Admin@Flowsync2024!';
  
  // FIRST: Check if any super admin already exists
  console.log("\n🔍 Checking for existing super admins...");
  const superAdminCheck = await checkSuperAdminExists();
  
  if (superAdminCheck.exists) {
    console.error("\n❌ SUPER ADMIN ALREADY EXISTS!");
    console.log("📊 Found", superAdminCheck.count, "super admin(s):");
    superAdminCheck.admins.forEach((admin, index) => {
      console.log(`   ${index + 1}. ${admin.data.email} (${admin.data.name})`);
    });
    
    console.log("\n⚠️  ABORTING: Super admin already exists.");
    console.log("💡 To reset super admin password, use Firebase Console or reset script.");
    
    return {
      success: false,
      error: `Super admin already exists (${superAdminCheck.count} found)`,
      email: adminEmail
    };
  }
  
  // Check if any admin exists
  console.log("\n🔍 Checking for any existing admins...");
  const anyAdminExists = await checkAnyAdminExists();
  
  if (anyAdminExists) {
    console.warn("⚠️  Other admin accounts exist. Only creating super admin.");
  }
  
  try {
    // 1. Create Firebase Auth user
    console.log("\n🔐 Creating Firebase Auth user...");
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const userId = userCredential.user.uid;
    console.log("✅ Auth user created - UID:", userId);
    
    // 2. Create super admin record in web_admins
    const superAdminData: AdminData = {
      uid: userId,
      email: adminEmail,
      name: "System Administrator",
      role: "super_admin",
      isActive: true,
      isLocked: false,
      mfaEnabled: false,
      loginAttempts: 0,
      maxLoginAttempts: 5,
      permissions: ["all"], // Super admin has all permissions
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: 'system',
      status: "active",
      lastLogin: null,
      passwordResetRequired: false,
      isEmailVerified: false,
      phoneNumber: "",
      address: ""
    };
    
    console.log("📝 Creating super admin in Firestore...");
    await setDoc(doc(db, 'web_admins', userId), superAdminData);
    console.log("✅ Super admin created in web_admins collection");
    
    // 3. Also create in admins collection
    await setDoc(doc(db, 'admins', userId), {
      ...superAdminData,
      role: 'super_admin'
    });
    console.log("✅ Super admin created in admins collection");
    
    // 4. Send password reset email (optional)
    try {
      await sendPasswordResetEmail(auth, adminEmail);
      console.log("✅ Password reset email sent");
    } catch (emailError: any) {
      console.log("⚠️ Could not send email:", emailError.message);
    }
    
    // 5. Verify creation
    console.log("\n🔍 Verifying super admin creation...");
    const verification = await checkSuperAdminExists();
    
    if (verification.exists && verification.count === 1) {
      console.log("✅ Super admin verification successful!");
    } else {
      console.error("⚠️  Verification warning: Expected 1 super admin, found", verification.count);
    }
    
    return {
      success: true,
      email: adminEmail,
      password: adminPassword,
      userId: userId
    };
    
  } catch (error: any) {
    console.error("\n❌ ERROR creating super admin:", error.message);
    
    // Check if error is due to duplicate
    if (error.code === 'auth/email-already-in-use') {
      console.error("\n⚠️  Email already in use. Checking Firestore records...");
      const check = await checkSuperAdminExists();
      if (check.exists) {
        console.error("✅ Super admin record exists in Firestore. User may need to be linked.");
      }
    }
    
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};

// Reset existing super admin password
export const resetSuperAdminPassword = async (email: string = 'admin@flowsync.com'): Promise<AdminCreationResult> => {
  console.log("🔐 Resetting super admin password for:", email);
  
  try {
    // Check if super admin exists
    const check = await checkSuperAdminExists();
    if (!check.exists) {
      return {
        success: false,
        error: "No super admin found. Use createFirstSuperAdmin() instead."
      };
    }
    
    // Send password reset email
    await sendPasswordResetEmail(auth, email);
    console.log("✅ Password reset email sent to", email);
    
    return {
      success: true,
      email: email
    };
  } catch (error: any) {
    console.error("❌ Error resetting password:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

// List all super admins
export const listSuperAdmins = async (): Promise<void> => {
  console.log("\n📋 Listing all super admins...");
  
  try {
    const check = await checkSuperAdminExists();
    
    console.log("=".repeat(60));
    console.log("SUPER ADMIN ACCOUNTS");
    console.log("=".repeat(60));
    
    if (!check.exists) {
      console.log("❌ No super admin accounts found");
    } else {
      console.log(`✅ Found ${check.count} super admin(s):\n`);
      
      check.admins.forEach((admin, index) => {
        const data = admin.data;
        console.log(`${index + 1}. ${data.name}`);
        console.log(`   Email: ${data.email}`);
        console.log(`   UID: ${data.uid}`);
        console.log(`   Status: ${data.status}`);
        console.log(`   Created: ${data.createdAt?.toDate?.() || 'N/A'}`);
        console.log(`   Last Login: ${data.lastLogin?.toDate?.() || 'Never'}`);
        console.log("   Permissions:", data.permissions?.join(', ') || 'all');
        console.log("");
      });
    }
    
    console.log("=".repeat(60));
  } catch (error: any) {
    console.error("❌ Error listing super admins:", error.message);
  }
};

// Delete all super admins (DANGEROUS - for testing only)
export const deleteAllSuperAdmins = async (): Promise<AdminCreationResult> => {
  console.log("⚠️  WARNING: Deleting all super admins!");
  console.log("🚨 THIS ACTION CANNOT BE UNDONE!\n");
  
  // Add a confirmation prompt for CLI
  if (process.env.NODE_ENV === 'production') {
    console.error("❌ Cannot delete super admins in production");
    return {
      success: false,
      error: "Cannot delete super admins in production"
    };
  }
  
  try {
    const check = await checkSuperAdminExists();
    
    if (!check.exists) {
      console.log("✅ No super admins to delete");
      return {
        success: true
      };
    }
    
    console.log(`Found ${check.count} super admin(s) to delete:`);
    check.admins.forEach(admin => {
      console.log(`   • ${admin.data.email}`);
    });
    
    console.log("\n🚨 THIS WILL REMOVE ALL SUPER ADMIN ACCESS!");
    console.log("Type 'DELETE_ALL_SUPER_ADMINS' to confirm:");
    
    // For CLI, we'll just log the warning and not actually delete
    console.log("\n⏸️  Deletion paused for safety.");
    console.log("💡 To delete, implement confirmation logic.");
    
    return {
      success: false,
      error: "Deletion requires manual confirmation"
    };
    
  } catch (error: any) {
    console.error("❌ Error deleting super admins:", error.message);
    return {
      success: false,
      error: error.message
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
// CLI EXECUTION CODE
// ============================================

if (require.main === module) {
  console.log("🚀 =========================================");
  console.log("🚀 FlowSync Super Admin Management Script");
  console.log("🚀 =========================================");
  console.log("👑 Ensures ONLY ONE super admin exists");
  console.log("🔒 Maximum security for admin management");
  console.log("=".repeat(50));
  
  const runScript = async () => {
    try {
      // First test the connection
      console.log("\n🔌 Testing Firebase connection...");
      const connected = await testConnection();
      
      if (!connected) {
        console.error("❌ Cannot proceed: Firebase connection failed");
        process.exit(1);
      }
      
      console.log("✅ Firebase connection verified");
      
      // Get command line arguments
      const args = process.argv.slice(2);
      const command = args[0] || 'create';
      
      switch (command) {
        case 'create':
          console.log("\n📦 Creating super admin account...");
          const result = await createFirstSuperAdmin();
          
          if (result.success) {
            console.log("\n" + "=".repeat(60));
            console.log("🎉 SUPER ADMIN CREATION SUCCESSFUL!");
            console.log("=".repeat(60));
            console.log("📧 Email:", result.email);
            console.log("🔑 Password:", result.password);
            console.log("🆔 User ID:", result.userId);
            console.log("\n🔗 Login URL: http://localhost:3000/auth/super-admin");
            console.log("\n⚠️  IMPORTANT SECURITY NOTES:");
            console.log("   • Save these credentials securely!");
            console.log("   • Only ONE super admin can exist");
            console.log("   • Regular admins can be created via web interface");
            console.log("=".repeat(60));
          } else {
            console.error("\n❌ ADMIN CREATION FAILED:", result.error);
            if (result.code === 'auth/email-already-in-use') {
              console.log("\n💡 Try: npm run admin:reset");
            }
            process.exit(1);
          }
          break;
          
        case 'list':
          await listSuperAdmins();
          break;
          
        case 'reset':
          console.log("\n🔐 Resetting super admin password...");
          const resetResult = await resetSuperAdminPassword();
          if (resetResult.success) {
            console.log("✅ Password reset email sent");
          } else {
            console.error("❌ Reset failed:", resetResult.error);
          }
          break;
          
        case 'check':
          console.log("\n🔍 Checking super admin status...");
          const check = await checkSuperAdminExists();
          console.log(`Found ${check.count} super admin(s)`);
          break;
          
        case 'delete':
          console.log("\n🚨 DELETE ALL SUPER ADMINS");
          console.log("⚠️  DANGEROUS OPERATION!");
          await deleteAllSuperAdmins();
          break;
          
        case 'help':
        default:
          console.log("\n📖 AVAILABLE COMMANDS:");
          console.log("   npm run admin:create    - Create first super admin");
          console.log("   npm run admin:list      - List all super admins");
          console.log("   npm run admin:check     - Check super admin status");
          console.log("   npm run admin:reset     - Reset super admin password");
          console.log("   npm run admin:delete    - Delete all super admins (DANGER)");
          console.log("\n📝 Usage: npm run admin:[command]");
          break;
      }
      
      process.exit(0);
    } catch (error: any) {
      console.error("\n❌ Unexpected error:", error.message);
      console.error(error.stack);
      process.exit(1);
    }
  };

  runScript();
}