// src/lib/admin-auth.service.ts - FIXED VERSION
import { 
  adminAuth, 
  adminDb 
} from './firebase';
import { 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import Cookies from 'js-cookie';

export interface AdminLoginData {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  admin?: any;
  userType?: 'super_admin' | 'admin';
}

export class AdminAuthService {
  
  static async superAdminLogin(data: AdminLoginData): Promise<AdminLoginResponse> {
    try {
      const { email, password } = data;
      
      console.log("🔐 Attempting login for:", email);
      
      // 1. Firebase Auth login
      const userCredential = await signInWithEmailAndPassword(adminAuth, email, password);
      const userId = userCredential.user.uid;
      
      console.log("✅ Firebase Auth successful - UID:", userId);
      
      // 2. CHECK BOTH COLLECTIONS to determine admin type
      let adminData: any = null;
      let userType: 'super_admin' | 'admin' = 'admin';
      
      // First check web_admins (super admin)
      const webAdminDoc = await getDoc(doc(adminDb, 'web_admins', userId));
      if (webAdminDoc.exists()) {
        const data = webAdminDoc.data();
        console.log("✅ Found in web_admins - role:", data.role);
        
        // Determine if it's super admin or regular admin in web_admins
        if (data.role === 'super_admin') {
          userType = 'super_admin';
          console.log("👑 User is SUPER ADMIN");
        } else {
          userType = 'admin';
          console.log("👤 User is REGULAR ADMIN (in web_admins)");
        }
        
        adminData = data;
        
        // Update last login in web_admins
        await updateDoc(doc(adminDb, 'web_admins', userId), {
          lastLogin: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      // If not in web_admins, check admins collection
      else {
        const adminDoc = await getDoc(doc(adminDb, 'admins', userId));
        if (adminDoc.exists()) {
          const data = adminDoc.data();
          console.log("✅ Found in admins - role:", data.role);
          
          // Regular admins should have role = 'admin'
          userType = data.role === 'super_admin' ? 'super_admin' : 'admin';
          adminData = data;
          
          // Update last login in admins
          await updateDoc(doc(adminDb, 'admins', userId), {
            lastLogin: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        } else {
          console.log("❌ User not found in any admin collection");
          await signOut(adminAuth);
          return {
            success: false,
            message: 'Access denied. Not an admin user.'
          };
        }
      }
      
      // 3. IMPORTANT: Normalize role format
      let normalizedRole = userType;
      if (adminData.role === 'super-admin') {
        normalizedRole = 'super_admin';
      } else if (adminData.role === 'admin') {
        normalizedRole = 'admin';
      }
      
      // 4. Set cookie for middleware
      const token = await userCredential.user.getIdToken();
      this.setAuthCookie(token);
      
      // 5. Store admin data in localStorage - CRITICAL: Use normalized role
      const userDataToStore = {
        uid: userId,
        email: email,
        name: adminData.name || 'Administrator',
        role: normalizedRole, // ← THIS MUST BE CORRECT
        permissions: Array.isArray(adminData.permissions) ? adminData.permissions : [],
        isActive: adminData.isActive !== false,
        isLocked: adminData.isLocked || false,
        userType: normalizedRole, // Store for reference
        timestamp: Date.now(),
        lastLogin: new Date().toISOString(),
        createdAt: adminData.createdAt?.toDate?.() || new Date(),
        phoneNumber: adminData.phoneNumber || '',
        // Add debug info
        _debug: {
          collection: webAdminDoc.exists() ? 'web_admins' : 'admins',
          originalRole: adminData.role,
          normalizedRole: normalizedRole
        }
      };
      
      localStorage.setItem('admin_user', JSON.stringify(userDataToStore));
      
      console.log("🎉 Login successful! User type:", normalizedRole);
      console.log("📋 Stored localStorage data:", {
        email: userDataToStore.email,
        role: userDataToStore.role,
        userType: userDataToStore.userType,
        permissions: userDataToStore.permissions?.length
      });
      
      return {
        success: true,
        message: 'Login successful',
        admin: userDataToStore,
        userType: normalizedRole
      };
      
    } catch (error: any) {
      console.error('Login error:', error.message);
      
      let message = 'Login failed';
      if (error.code === 'auth/invalid-credential') {
        message = 'Invalid email or password';
      } else if (error.code === 'auth/user-not-found') {
        message = 'User not found';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Wrong password';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many attempts. Please try again later';
      }
      
      return {
        success: false,
        message: message
      };
    }
  }
  
  // Get current admin from localStorage (for client-side)
  static getCurrentAdmin(): any {
    try {
      const adminData = localStorage.getItem('admin_user');
      if (!adminData) return null;
      
      const admin = JSON.parse(adminData);
      
      // Ensure role is normalized
      if (admin.role === 'super-admin') {
        admin.role = 'super_admin';
      }
      
      return admin;
    } catch (error) {
      console.error('Error getting current admin:', error);
      return null;
    }
  }
  
  // Check if current user is super admin
  static isSuperAdmin(): boolean {
    const admin = this.getCurrentAdmin();
    return admin?.role === 'super_admin';
  }
  
  // Check if current user is admin (either type)
  static isAdminUser(): boolean {
    const admin = this.getCurrentAdmin();
    return admin?.role === 'super_admin' || admin?.role === 'admin';
  }
  
  // Helper: Get admin from Firebase (for server-side checks)
  static async getAdminFromFirebase(uid: string): Promise<any> {
    try {
      // Check both collections
      const [webAdminDoc, adminDoc] = await Promise.all([
        getDoc(doc(adminDb, 'web_admins', uid)),
        getDoc(doc(adminDb, 'admins', uid))
      ]);
      
      if (webAdminDoc.exists()) {
        const data = webAdminDoc.data();
        return {
          ...data,
          collection: 'web_admins',
          role: data.role === 'super_admin' ? 'super_admin' : 'admin'
        };
      }
      
      if (adminDoc.exists()) {
        const data = adminDoc.data();
        return {
          ...data,
          collection: 'admins',
          role: 'admin' // Regular admins should always be 'admin'
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting admin from Firebase:', error);
      return null;
    }
  }
  
  private static setAuthCookie(token: string): void {
    try {
      Cookies.set('admin-session', token, {
        expires: 1,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      document.cookie = `admin-session=${token}; expires=${expires.toUTCString()}; path=/; Secure; SameSite=Strict`;
      
      console.log('✅ Auth cookie set');
    } catch (error) {
      console.error('Error setting auth cookie:', error);
    }
  }
  
  private static clearAuthCookie(): void {
    try {
      Cookies.remove('admin-session', { path: '/' });
      document.cookie = 'admin-session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
      console.log('✅ Auth cookie cleared');
    } catch (error) {
      console.error('Error clearing auth cookie:', error);
    }
  }
  
  static async superAdminLogout() {
    try {
      this.clearAuthCookie();
      localStorage.removeItem('admin_user');
      await signOut(adminAuth);
      
      console.log("✅ Logout completed");
      
      return { 
        success: true, 
        message: 'Logged out successfully' 
      };
    } catch (error: any) {
      console.error('Logout error:', error);
      return { 
        success: false, 
        message: 'Logout failed' 
      };
    }
  }
  
  // Debug method - call this after login to check
  static debugLoginInfo() {
    const admin = this.getCurrentAdmin();
    console.log('🔍 DEBUG Login Info:');
    console.log('- Admin in localStorage:', admin);
    console.log('- Role:', admin?.role);
    console.log('- Is super admin?', this.isSuperAdmin());
    console.log('- Raw localStorage:', localStorage.getItem('admin_user'));
    
    // Check what's in Firebase
    if (admin?.uid) {
      this.getAdminFromFirebase(admin.uid).then(firebaseData => {
        console.log('- Firebase data:', firebaseData);
      });
    }
  }
  
  static async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(adminAuth, email);
      return { 
        success: true, 
        message: 'Password reset email sent successfully' 
      };
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      let message = 'Failed to send reset email';
      if (error.code === 'auth/user-not-found') {
        message = 'User not found';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address';
      }
      
      return { 
        success: false, 
        message: message 
      };
    }
  }
  
  static async checkAuth(): Promise<{ 
    authenticated: boolean; 
    admin?: any | null;
    userType?: 'super_admin' | 'admin' | null;
    hasCookie?: boolean;
  }> {
    try {
      const cookieValue = Cookies.get('admin-session');
      const hasCookie = !!cookieValue || document.cookie.includes('admin-session');
      
      const user = adminAuth.currentUser;
      
      if (!user && !hasCookie) {
        return { 
          authenticated: false, 
          hasCookie: false 
        };
      }
      
      if (user) {
        const adminUser = this.getCurrentAdmin();
        if (adminUser) {
          return { 
            authenticated: adminUser.isActive && !adminUser.isLocked,
            admin: adminUser,
            userType: adminUser.role,
            hasCookie
          };
        }
      }
      
      if (hasCookie) {
        return { 
          authenticated: true, 
          hasCookie: true 
        };
      }
      
      return { 
        authenticated: false, 
        hasCookie: false 
      };
    } catch (error) {
      console.error('Auth check error:', error);
      return { 
        authenticated: false, 
        hasCookie: false 
      };
    }
  }
  
  // Helper: Check if admin has permission
  static hasPermission(permission: string): boolean {
    const admin = this.getCurrentAdmin();
    if (!admin) return false;
    
    // Super admin has all permissions
    if (admin.role === 'super_admin') return true;
    
    // Regular admin check specific permission
    return admin.permissions?.includes(permission) || 
           admin.permissions?.includes('all') || 
           admin.permissions?.includes('*');
  }
  
  // Get all admins
  static async getAllAdmins(): Promise<any[]> {
    try {
      const admins: any[] = [];
      
      const superAdminsQuery = query(
        collection(adminDb, 'web_admins'),
        where('isActive', '==', true)
      );
      
      const superAdminsSnapshot = await getDocs(superAdminsQuery);
      superAdminsSnapshot.forEach((doc) => {
        const data = doc.data();
        admins.push({
          ...data,
          id: doc.id,
          userType: data.role === 'super_admin' ? 'super_admin' : 'admin'
        });
      });
      
      const regularAdminsQuery = query(
        collection(adminDb, 'admins'),
        where('isActive', '==', true)
      );
      
      const regularAdminsSnapshot = await getDocs(regularAdminsQuery);
      regularAdminsSnapshot.forEach((doc) => {
        const data = doc.data();
        admins.push({
          ...data,
          id: doc.id,
          userType: 'admin'
        });
      });
      
      return admins;
    } catch (error) {
      console.error('Error getting all admins:', error);
      return [];
    }
  }
}