// src/lib/admin-auth.service.ts - COMPLETE FIXED VERSION
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
  Timestamp
} from 'firebase/firestore';
import { SuperAdmin, AdminLoginData, AdminLoginResponse } from '@/types/admin.types';

export class AdminAuthService {
  
  static async superAdminLogin(data: AdminLoginData): Promise<AdminLoginResponse> {
    try {
      const { email, password } = data;
      
      console.log("🔐 Attempting login for:", email);
      
      // 1. Try Firebase Auth login
      const userCredential = await signInWithEmailAndPassword(adminAuth, email, password);
      const userId = userCredential.user.uid;
      
      console.log("✅ Firebase Auth successful - UID:", userId);
      
      // 2. Check/create admin record
      const adminData = await this.getOrCreateAdmin(userId, email);
      
      // 3. Update last login - ONLY update specific fields
      await updateDoc(doc(adminDb, 'web_admins', userId), {
        lastLoginAt: serverTimestamp(),
        loginAttempts: 0,
        updatedAt: serverTimestamp()
      });
      
      console.log("🎉 Login successful!");
      
      return {
        success: true,
        message: 'Login successful',
        admin: adminData
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
  
  private static async getOrCreateAdmin(userId: string, email: string): Promise<SuperAdmin> {
    // Check web_admins collection
    const adminDocRef = doc(adminDb, 'web_admins', userId);
    const adminDoc = await getDoc(adminDocRef);
    
    if (adminDoc.exists()) {
      console.log("✅ Found existing admin record");
      const data = adminDoc.data();
      
      // Convert Firestore Timestamps to Dates
      const convertTimestamp = (timestamp: any): Date | Timestamp | null => {
        if (!timestamp) return null;
        if (timestamp instanceof Timestamp) return timestamp.toDate();
        if (timestamp?.toDate) return timestamp.toDate();
        return timestamp;
      };
      
      // Handle mfaSecret carefully - only include if it exists
      const mfaSecret = data.mfaSecret !== undefined ? data.mfaSecret : undefined;
      
      return {
        uid: userId,
        email: email,
        name: data.name || "System Administrator",
        role: data.role === 'super-admin' ? 'super_admin' : data.role || "super_admin",
        isActive: data.isActive !== false,
        isLocked: data.isLocked || false,
        mfaEnabled: data.mfaEnabled || false,
        mfaSecret: mfaSecret,
        loginAttempts: data.loginAttempts || 0,
        maxLoginAttempts: data.maxLoginAttempts || 5,
        lastLoginAt: convertTimestamp(data.lastLoginAt),
        lastLoginIp: data.lastLoginIp || null,
        passwordChangedAt: convertTimestamp(data.passwordChangedAt),
        createdAt: convertTimestamp(data.createdAt) || new Date(),
        updatedAt: convertTimestamp(data.updatedAt) || new Date(),
        permissions: Array.isArray(data.permissions) ? data.permissions : ['all']
      };
    }
    
    // Create new admin record
    console.log("📝 Creating new admin record...");
    
    const now = new Date();
    
    // Create clean Firestore data WITHOUT undefined values
    const firestoreData: any = {
      uid: userId,
      email: email,
      name: "System Administrator",
      role: "super_admin",
      isActive: true,
      isLocked: false,
      mfaEnabled: false,
      // DO NOT include mfaSecret field here
      loginAttempts: 0,
      maxLoginAttempts: 5,
      lastLoginAt: null,
      lastLoginIp: null,
      passwordChangedAt: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      permissions: ['all']
    };
    
    await setDoc(adminDocRef, firestoreData);
    
    console.log("✅ Created new admin record");
    
    // Return admin data for the response
    const newAdminData: SuperAdmin = {
      uid: userId,
      email: email,
      name: "System Administrator",
      role: "super_admin",
      isActive: true,
      isLocked: false,
      mfaEnabled: false,
      mfaSecret: undefined,
      loginAttempts: 0,
      maxLoginAttempts: 5,
      lastLoginAt: null,
      lastLoginIp: null,
      passwordChangedAt: null,
      createdAt: now,
      updatedAt: now,
      permissions: ['all']
    };
    
    return newAdminData;
  }
  
  static async getAdmin(uid: string): Promise<SuperAdmin | null> {
    try {
      const adminDoc = await getDoc(doc(adminDb, 'web_admins', uid));
      
      if (adminDoc.exists()) {
        const data = adminDoc.data();
        
        // Convert Firestore data to SuperAdmin type
        const convertTimestamp = (timestamp: any): Date | Timestamp | null => {
          if (!timestamp) return null;
          if (timestamp instanceof Timestamp) return timestamp.toDate();
          if (timestamp?.toDate) return timestamp.toDate();
          return timestamp;
        };
        
        // Handle mfaSecret carefully
        const mfaSecret = data.mfaSecret !== undefined ? data.mfaSecret : undefined;
        
        const admin: SuperAdmin = {
          uid: uid,
          email: data.email || '',
          name: data.name || "System Administrator",
          role: data.role === 'super-admin' ? 'super_admin' : data.role || "super_admin",
          isActive: data.isActive !== false,
          isLocked: data.isLocked || false,
          mfaEnabled: data.mfaEnabled || false,
          mfaSecret: mfaSecret,
          loginAttempts: data.loginAttempts || 0,
          maxLoginAttempts: data.maxLoginAttempts || 5,
          lastLoginAt: convertTimestamp(data.lastLoginAt),
          lastLoginIp: data.lastLoginIp || null,
          passwordChangedAt: convertTimestamp(data.passwordChangedAt),
          createdAt: convertTimestamp(data.createdAt) || new Date(),
          updatedAt: convertTimestamp(data.updatedAt) || new Date(),
          permissions: Array.isArray(data.permissions) ? data.permissions : ['all']
        };
        
        return admin;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting admin:', error);
      return null;
    }
  }
  
  static async getCurrentAdmin(): Promise<SuperAdmin | null> {
    try {
      const user = adminAuth.currentUser;
      if (!user) return null;
      
      return await this.getAdmin(user.uid);
    } catch (error) {
      console.error('Error getting current admin:', error);
      return null;
    }
  }
  
  static async isSuperAdmin(uid: string): Promise<boolean> {
    try {
      const admin = await this.getAdmin(uid);
      return !!admin && admin.isActive && !admin.isLocked;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }
  
  static async createNewAdmin(adminData: {
    email: string;
    name: string;
    role: 'super_admin' | 'admin' | 'moderator';
    permissions: string[];
    createdBy: string;
  }) {
    try {
      const adminId = `admin_${Date.now()}`;
      const tempPassword = Math.random().toString(36).slice(-8) + 'A1!';
      
      const adminRecord: any = {
        uid: adminId,
        email: adminData.email,
        name: adminData.name,
        role: adminData.role,
        isActive: true,
        isLocked: false,
        mfaEnabled: false,
        loginAttempts: 0,
        maxLoginAttempts: 5,
        permissions: adminData.permissions,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: adminData.createdBy,
        tempPassword: tempPassword,
        requiresPasswordChange: true
      };
      
      await setDoc(doc(adminDb, 'web_admins', adminId), adminRecord);
      
      console.log("✅ New admin created:", adminData.email);
      return {
        success: true,
        adminId: adminId,
        tempPassword: tempPassword,
        message: 'Admin created successfully'
      };
      
    } catch (error: any) {
      console.error('Error creating admin:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
  
  static async superAdminLogout() {
    try {
      await signOut(adminAuth);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, message: 'Logout failed' };
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
  
  static async checkAuth(): Promise<{ authenticated: boolean; admin?: SuperAdmin | null }> {
    try {
      const user = adminAuth.currentUser;
      if (!user) {
        return { authenticated: false };
      }
      
      const admin = await this.getAdmin(user.uid);
      return { 
        authenticated: !!admin && admin.isActive && !admin.isLocked,
        admin 
      };
    } catch (error) {
      console.error('Auth check error:', error);
      return { authenticated: false };
    }
  }
}