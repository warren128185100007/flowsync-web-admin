// src/lib/admin-service.ts - UPDATED WITH REAL-TIME ONLINE STATUS
import { adminAuth, adminDb } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  serverTimestamp,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  Timestamp,
  onSnapshot,
  getDoc,
  orderBy,
  limit
} from 'firebase/firestore';

export interface AdminUser {
  id: string;
  uid: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastLogin?: Date;
  lastActivity?: Date; // New field for last activity timestamp
  lastSeen?: Date; // New field for last seen online
  isOnline?: boolean; // Real-time online status
  phoneNumber?: string;
  isEmailVerified: boolean;
  passwordResetRequired: boolean;
  isActive: boolean;
  isLocked: boolean;
  deviceInfo?: string; // Device/browser info
  ipAddress?: string; // Last known IP address
}

export interface CreateAdminData {
  email: string;
  name: string;
  role: 'admin';
  permissions: string[];
  phoneNumber?: string;
}

export interface UpdateAdminData {
  name?: string;
  role?: 'admin';
  permissions?: string[];
  status?: 'active' | 'inactive' | 'suspended';
  phoneNumber?: string;
}

export interface OnlineStatusUpdate {
  adminId: string;
  isOnline: boolean;
  timestamp: Date;
  deviceInfo?: string;
  ipAddress?: string;
}

// Real-time presence tracker
class PresenceTracker {
  private static instance: PresenceTracker;
  private onlineUsers = new Map<string, OnlineStatusUpdate>();
  private listeners = new Set<(update: OnlineStatusUpdate) => void>();
  private cleanupInterval: NodeJS.Timeout | null = null;
  
  private constructor() {
    // Clean up old entries every minute
    this.cleanupInterval = setInterval(() => this.cleanupOldEntries(), 60000);
  }
  
  static getInstance(): PresenceTracker {
    if (!PresenceTracker.instance) {
      PresenceTracker.instance = new PresenceTracker();
    }
    return PresenceTracker.instance;
  }
  
  updateStatus(update: OnlineStatusUpdate) {
    this.onlineUsers.set(update.adminId, update);
    
    // Notify all listeners
    this.listeners.forEach(listener => listener(update));
    
    // Update in Firestore
    this.updateFirestorePresence(update);
  }
  
  private async updateFirestorePresence(update: OnlineStatusUpdate) {
    try {
      const presenceRef = doc(adminDb, 'admin_presence', update.adminId);
      await setDoc(presenceRef, {
        ...update,
        timestamp: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating presence in Firestore:', error);
    }
  }
  
  getStatus(adminId: string): OnlineStatusUpdate | undefined {
    return this.onlineUsers.get(adminId);
  }
  
  isOnline(adminId: string): boolean {
    const status = this.onlineUsers.get(adminId);
    if (!status) return false;
    
    // Consider offline if last update was more than 5 minutes ago
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return status.timestamp > fiveMinutesAgo;
  }
  
  getOnlineAdmins(): OnlineStatusUpdate[] {
    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
    
    return Array.from(this.onlineUsers.values())
      .filter(update => update.timestamp > fifteenMinutesAgo)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  subscribe(callback: (update: OnlineStatusUpdate) => void): () => void {
    this.listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }
  
  private cleanupOldEntries() {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    for (const [adminId, update] of this.onlineUsers.entries()) {
      if (update.timestamp < oneHourAgo) {
        this.onlineUsers.delete(adminId);
      }
    }
  }
  
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.listeners.clear();
    this.onlineUsers.clear();
  }
}

export class AdminService {
  private static presenceTracker = PresenceTracker.getInstance();
  private static readonly OFFLINE_THRESHOLD = 5 * 60 * 1000; // 5 minutes
  
  // Get all admins with real-time status
  static async getAdmins(): Promise<AdminUser[]> {
    try {
      const adminsCollection = collection(adminDb, 'admins');
      const snapshot = await getDocs(adminsCollection);
      
      const admins = snapshot.docs.map(doc => {
        const data = doc.data();
        return this.mapAdminData(doc.id, data);
      });
      
      // Enhance with real-time online status
      return await this.enhanceAdminsWithOnlineStatus(admins);
    } catch (error) {
      console.error('Error fetching admins:', error);
      return [];
    }
  }

  // Get all web_admins with real-time status
  static async getWebAdmins(): Promise<AdminUser[]> {
    try {
      const adminsCollection = collection(adminDb, 'web_admins');
      const snapshot = await getDocs(adminsCollection);
      
      const admins = snapshot.docs.map(doc => {
        const data = doc.data();
        return this.mapAdminData(doc.id, data);
      });
      
      // Enhance with real-time online status
      return await this.enhanceAdminsWithOnlineStatus(admins);
    } catch (error) {
      console.error('Error fetching web admins:', error);
      return [];
    }
  }

  // Get online admins in real-time
  static async getOnlineAdmins(): Promise<AdminUser[]> {
    try {
      // Get admins with recent activity (last 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - this.OFFLINE_THRESHOLD);
      
      const adminsCollection = collection(adminDb, 'web_admins');
      const q = query(
        adminsCollection,
        where('lastActivity', '>=', Timestamp.fromDate(fiveMinutesAgo))
      );
      
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...this.mapAdminData(doc.id, data),
          isOnline: true
        };
      });
    } catch (error) {
      console.error('Error fetching online admins:', error);
      return [];
    }
  }

  // Update admin activity (call this when admin performs any action)
  static async updateAdminActivity(adminId: string, deviceInfo?: string, ipAddress?: string): Promise<void> {
    try {
      const now = new Date();
      
      // Update in admins collection
      const adminRef = doc(adminDb, 'admins', adminId);
      await updateDoc(adminRef, {
        lastActivity: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...(deviceInfo && { deviceInfo }),
        ...(ipAddress && { ipAddress })
      });
      
      // Update in web_admins collection
      const webAdminRef = doc(adminDb, 'web_admins', adminId);
      await updateDoc(webAdminRef, {
        lastActivity: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...(deviceInfo && { deviceInfo }),
        ...(ipAddress && { ipAddress })
      });
      
      // Update presence tracker
      this.presenceTracker.updateStatus({
        adminId,
        isOnline: true,
        timestamp: now,
        deviceInfo,
        ipAddress
      });
      
    } catch (error) {
      console.error('Error updating admin activity:', error);
    }
  }

  // Subscribe to admin presence changes (real-time)
  static subscribeToAdminPresence(
    callback: (adminId: string, isOnline: boolean, timestamp: Date) => void
  ): () => void {
    // Subscribe to Firestore presence collection
    const presenceCollection = collection(adminDb, 'admin_presence');
    
    const unsubscribe = onSnapshot(presenceCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const data = change.doc.data();
        const adminId = change.doc.id;
        const isOnline = data.isOnline || false;
        const timestamp = data.timestamp?.toDate() || new Date();
        
        callback(adminId, isOnline, timestamp);
      });
    }, (error) => {
      console.error('Error subscribing to presence:', error);
    });
    
    // Also subscribe to local presence tracker
    const localUnsubscribe = this.presenceTracker.subscribe((update) => {
      callback(update.adminId, update.isOnline, update.timestamp);
    });
    
    // Return combined unsubscribe function
    return () => {
      unsubscribe();
      localUnsubscribe();
    };
  }

  // Force logout admin (set offline status)
  static async forceLogoutAdmin(adminId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const now = new Date();
      
      // Update presence to offline
      const presenceRef = doc(adminDb, 'admin_presence', adminId);
      await setDoc(presenceRef, {
        adminId,
        isOnline: false,
        timestamp: serverTimestamp(),
        forcedLogout: true,
        forcedBy: 'system',
        forcedAt: serverTimestamp()
      }, { merge: true });
      
      // Update last activity to now (to mark as just logged out)
      await this.updateAdminActivity(adminId);
      
      // Update presence tracker
      this.presenceTracker.updateStatus({
        adminId,
        isOnline: false,
        timestamp: now
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Error forcing logout:', error);
      return { success: false, error: error.message };
    }
  }

  // Get admin's last activity
  static async getAdminLastActivity(adminId: string): Promise<Date | null> {
    try {
      const adminRef = doc(adminDb, 'web_admins', adminId);
      const snapshot = await getDoc(adminRef);
      
      if (snapshot.exists()) {
        const data = snapshot.data();
        return data.lastActivity?.toDate() || null;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting admin last activity:', error);
      return null;
    }
  }

  // Create new admin
  static async createAdmin(adminData: CreateAdminData, createdBy: string): Promise<{ 
    success: boolean; 
    data?: AdminUser; 
    error?: string;
    tempPassword?: string;
  }> {
    try {
      const tempPassword = `Admin${Math.random().toString(36).slice(-8)}!`;
      
      const userCredential = await createUserWithEmailAndPassword(
        adminAuth, 
        adminData.email, 
        tempPassword
      );
      
      const userId = userCredential.user.uid;
      const now = new Date();
      
      const adminDoc = {
        uid: userId,
        email: adminData.email,
        name: adminData.name,
        role: 'admin',
        status: 'active',
        permissions: adminData.permissions,
        phoneNumber: adminData.phoneNumber || '',
        isActive: true,
        isLocked: false,
        mfaEnabled: false,
        loginAttempts: 0,
        maxLoginAttempts: 5,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastActivity: serverTimestamp(), // Initial activity
        createdBy: createdBy,
        passwordResetRequired: true,
        isEmailVerified: false
      };
      
      await setDoc(doc(adminDb, 'admins', userId), adminDoc);
      await setDoc(doc(adminDb, 'web_admins', userId), adminDoc);
      
      // Initialize presence
      const presenceRef = doc(adminDb, 'admin_presence', userId);
      await setDoc(presenceRef, {
        adminId: userId,
        isOnline: false,
        timestamp: serverTimestamp(),
        createdAt: serverTimestamp()
      });
      
      try {
        await sendPasswordResetEmail(adminAuth, adminData.email);
      } catch (emailError) {
        console.warn('Could not send password reset email:', emailError);
      }
      
      const createdAdmin: AdminUser = {
        id: userId,
        uid: userId,
        email: adminData.email,
        name: adminData.name,
        role: 'admin',
        status: 'active',
        permissions: adminData.permissions,
        createdAt: now,
        updatedAt: now,
        lastActivity: now,
        createdBy: createdBy,
        phoneNumber: adminData.phoneNumber || '',
        isEmailVerified: false,
        passwordResetRequired: true,
        isActive: true,
        isLocked: false,
        isOnline: false
      };
      
      return {
        success: true,
        data: createdAdmin,
        tempPassword: tempPassword
      };
      
    } catch (error: any) {
      console.error('Error creating admin:', error);
      
      let errorMessage = error.message;
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  // Update admin
  static async updateAdmin(adminId: string, data: UpdateAdminData): Promise<{ success: boolean; error?: string }> {
    try {
      if (data.role && data.role !== 'admin') {
        return { success: false, error: 'Cannot change role to super_admin' };
      }
      
      const adminRef = doc(adminDb, 'admins', adminId);
      const updateData: any = {
        ...data,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(adminRef, updateData);
      
      const webAdminRef = doc(adminDb, 'web_admins', adminId);
      await updateDoc(webAdminRef, updateData);
      
      return { success: true };
    } catch (error: any) {
      console.error('Error updating admin:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete admin
  static async deleteAdmin(adminId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const adminRef = doc(adminDb, 'admins', adminId);
      const webAdminRef = doc(adminDb, 'web_admins', adminId);
      const presenceRef = doc(adminDb, 'admin_presence', adminId);
      
      await deleteDoc(adminRef);
      
      try {
        await deleteDoc(webAdminRef);
      } catch (e) {
        console.log('No web_admin record found');
      }
      
      try {
        await deleteDoc(presenceRef);
      } catch (e) {
        console.log('No presence record found');
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting admin:', error);
      return { success: false, error: error.message };
    }
  }

  // Reset admin password
  static async resetAdminPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      await sendPasswordResetEmail(adminAuth, email);
      return { success: true };
    } catch (error: any) {
      console.error('Error resetting password:', error);
      return { success: false, error: error.message };
    }
  }

  // Get admin by ID with online status
  static async getAdminById(adminId: string): Promise<AdminUser | null> {
    try {
      const adminSnapshot = await getDocs(query(collection(adminDb, 'admins'), where('uid', '==', adminId)));
      
      if (!adminSnapshot.empty) {
        const data = adminSnapshot.docs[0].data();
        const admin = this.mapAdminData(adminSnapshot.docs[0].id, data);
        
        // Enhance with online status
        const onlineAdmins = await this.getOnlineAdmins();
        const isOnline = onlineAdmins.some(a => a.id === adminId);
        
        return {
          ...admin,
          isOnline
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching admin:', error);
      return null;
    }
  }

  // Check if email is already registered
  static async checkAdminEmail(email: string): Promise<{ exists: boolean; admin?: AdminUser }> {
    try {
      const snapshot = await getDocs(query(collection(adminDb, 'admins'), where('email', '==', email)));
      
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        const admin = this.mapAdminData(snapshot.docs[0].id, data);
        
        // Check online status
        const onlineAdmins = await this.getOnlineAdmins();
        const isOnline = onlineAdmins.some(a => a.id === admin.id);
        
        return {
          exists: true,
          admin: {
            ...admin,
            isOnline
          }
        };
      }
      
      return { exists: false };
    } catch (error) {
      console.error('Error checking email:', error);
      return { exists: false };
    }
  }

  // Toggle admin status
  static async toggleAdminStatus(adminId: string, status: 'active' | 'inactive'): Promise<{ success: boolean; error?: string }> {
    try {
      const adminRef = doc(adminDb, 'admins', adminId);
      await updateDoc(adminRef, {
        status: status,
        updatedAt: serverTimestamp()
      });
      
      const webAdminRef = doc(adminDb, 'web_admins', adminId);
      await updateDoc(webAdminRef, {
        status: status,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Error toggling admin status:', error);
      return { success: false, error: error.message };
    }
  }

  // Promote admin to super admin
  static async promoteToSuperAdmin(adminId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const adminRef = doc(adminDb, 'admins', adminId);
      await updateDoc(adminRef, {
        role: 'super_admin',
        permissions: ['all'],
        updatedAt: serverTimestamp()
      });
      
      const webAdminRef = doc(adminDb, 'web_admins', adminId);
      await updateDoc(webAdminRef, {
        role: 'super_admin',
        permissions: ['all'],
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Error promoting admin:', error);
      return { success: false, error: error.message };
    }
  }

  // Get recent admin activity (for dashboard)
  static async getRecentActivity(limitCount: number = 10): Promise<AdminUser[]> {
    try {
      const adminsCollection = collection(adminDb, 'web_admins');
      const q = query(
        adminsCollection,
        where('lastActivity', '!=', null),
        orderBy('lastActivity', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        const admin = this.mapAdminData(doc.id, data);
        
        // Check if currently online
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        const isOnline = admin.lastActivity && admin.lastActivity > fifteenMinutesAgo;
        
        return {
          ...admin,
          isOnline: isOnline || false
        };
      });
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }

  // Helper method to map Firestore data to AdminUser
  private static mapAdminData(id: string, data: any): AdminUser {
    return {
      id: id,
      uid: data.uid || id,
      email: data.email || '',
      name: data.name || '',
      role: data.role === 'super_admin' ? 'super_admin' : 'admin',
      status: data.status || 'active',
      permissions: data.permissions || [],
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      createdBy: data.createdBy || 'system',
      lastLogin: data.lastLogin?.toDate(),
      lastActivity: data.lastActivity?.toDate(),
      lastSeen: data.lastActivity?.toDate(), // Use lastActivity as lastSeen
      phoneNumber: data.phoneNumber || '',
      isEmailVerified: data.isEmailVerified || false,
      passwordResetRequired: data.passwordResetRequired || false,
      isActive: data.isActive !== false,
      isLocked: data.isLocked || false,
      deviceInfo: data.deviceInfo || '',
      ipAddress: data.ipAddress || ''
    };
  }

  // Helper method to enhance admins with online status
  private static async enhanceAdminsWithOnlineStatus(admins: AdminUser[]): Promise<AdminUser[]> {
    try {
      const onlineAdmins = await this.getOnlineAdmins();
      const onlineAdminIds = new Set(onlineAdmins.map(admin => admin.id));
      
      return admins.map(admin => ({
        ...admin,
        isOnline: onlineAdminIds.has(admin.id)
      }));
    } catch (error) {
      console.error('Error enhancing admins with online status:', error);
      return admins.map(admin => ({
        ...admin,
        isOnline: false
      }));
    }
  }

  // Clean up presence tracker (call when app shuts down)
  static cleanup() {
    this.presenceTracker.destroy();
  }
}