import { 
  collection, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  DocumentData,
  QuerySnapshot,
  serverTimestamp,
  where,
  limit,
  writeBatch,
  getDoc,
  DocumentReference
} from 'firebase/firestore';
import { ref, getDownloadURL, listAll, uploadBytes, deleteObject } from 'firebase/storage';
import { adminDb, adminStorage } from './firebase';

export interface FirebaseUser {
  id: string;
  address?: string;
  createdAt?: Timestamp | Date | null;
  email: string;
  fullName?: string;
  username?: string;
  hasLinkedDevices?: boolean;
  isEmailVerified?: boolean;
  isGmailAccount?: boolean;
  lastLogin?: Timestamp | Date | null;
  otpVerified?: boolean;
  phoneNumber?: string;
  photoURL?: string;
  profileImageUrl?: string;
  uid: string;
  updatedAt?: Timestamp | Date | null;
  status?: 'active' | 'inactive' | 'suspended';
  role?: 'user' | 'admin' | 'super_admin';
  deviceToken?: string;
  notificationEnabled?: boolean;
  language?: string;
  timezone?: string;
}

export interface WaterFlowData {
  currentFlowRate: number;
  todayUsage: number;
  todayBill: number;
  pressure: number;
  temperature: number;
  timestamp: Timestamp;
  peakFlow?: number;
  waterQuality?: number;
  valveStatus?: 'open' | 'closed';
}

export interface WaterDataHistoryItem {
  id: string;
  currentFlowRate?: number;
  todayUsage?: number;
  todayBill?: number;
  pressure?: number;
  temperature?: number;
  timestamp?: Timestamp | Date;
  date?: Date;
  flowRate?: number;
  dailyUsage?: number;
  dailyCost?: number;
}

export interface ProcessedUser extends FirebaseUser {
  waterFlowData: WaterFlowData;
  lastActivity: Timestamp | Date | null;
  valveStatus: 'open' | 'closed';
  alerts?: Alert[];
  displayPhotoUrl: string;
  totalUsage?: number;
  averageDailyUsage?: number;
  estimatedMonthlyBill?: number;
}

export interface Alert {
  id: string;
  userId: string;
  type: 'high_usage' | 'leak_detected' | 'pressure_drop' | 'device_offline' | 'unusual_pattern' | 'bill_estimate';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  message: string;
  read: boolean;
  timestamp: Timestamp;
  source: string;
  status: 'active' | 'acknowledged' | 'resolved';
  data?: any;
}

export interface CreateUserData {
  email: string;
  fullName: string;
  phoneNumber?: string;
  address?: string;
  username?: string;
  role?: 'user' | 'admin';
  status?: 'active' | 'inactive';
}

export interface UpdateUserData {
  email?: string; // Add email to UpdateUserData interface
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  username?: string;
  status?: 'active' | 'inactive' | 'suspended';
  role?: 'user' | 'admin';
  notificationEnabled?: boolean;
  language?: string;
  timezone?: string;
}

export interface BulkUpdateData {
  userIds: string[];
  updates: Partial<UpdateUserData>;
}

export interface PaginationOptions {
  limit: number;
  page: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  verifiedUsers: number;
  usersWithDevices: number;
  gmailUsers: number;
  recentSignups: number;
  totalRevenue: number;
}

// Cache management
const profileImageCache = new Map<string, { url: string; timestamp: number }>();
const userCache = new Map<string, { user: ProcessedUser; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getDefaultAvatar = (name?: string, email?: string): string => {
  const displayName = name || email || 'User';
  const encodedName = encodeURIComponent(displayName);
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodedName}&backgroundColor=0ea5e9&radius=20`;
};

export class RealtimeUserService {
  private static instance: RealtimeUserService;
  
  static getInstance(): RealtimeUserService {
    if (!RealtimeUserService.instance) {
      RealtimeUserService.instance = new RealtimeUserService();
    }
    return RealtimeUserService.instance;
  }

  // Cache management
  clearUserCache(userId: string): void {
    userCache.delete(userId);
    profileImageCache.delete(userId);
  }

  clearAllCache(): void {
    userCache.clear();
    profileImageCache.clear();
  }

  // CREATE Operations
  async createUser(userData: CreateUserData): Promise<{ 
    success: boolean; 
    userId?: string; 
    error?: string;
    user?: ProcessedUser;
  }> {
    try {
      // Validate email
      if (!userData.email || !userData.email.includes('@')) {
        return { success: false, error: 'Valid email is required' };
      }

      // Check if user already exists
      const existingUser = await this.getUserByEmail(userData.email);
      if (existingUser) {
        return { success: false, error: 'User with this email already exists' };
      }

      const usersRef = collection(adminDb, 'users');
      const username = userData.username || userData.email.split('@')[0];
      
      const newUserData = {
        email: userData.email.toLowerCase(),
        fullName: userData.fullName,
        username,
        phoneNumber: userData.phoneNumber || '',
        address: userData.address || '',
        role: userData.role || 'user',
        status: userData.status || 'active',
        isEmailVerified: false,
        isGmailAccount: userData.email.includes('gmail.com'),
        otpVerified: false,
        hasLinkedDevices: false,
        notificationEnabled: true,
        language: 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        photoURL: getDefaultAvatar(userData.fullName, userData.email),
        profileImageUrl: getDefaultAvatar(userData.fullName, userData.email),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: null,
      };

      const docRef = await addDoc(usersRef, newUserData);
      const userId = docRef.id;

      // Update with generated ID
      await updateDoc(docRef, {
        id: userId,
        uid: userId,
      });

      // Create initial water data
      const waterDataRef = collection(adminDb, 'users', userId, 'waterData');
      await addDoc(waterDataRef, {
        currentFlowRate: 0,
        todayUsage: 0,
        todayBill: 0,
        pressure: 0,
        temperature: 0,
        waterQuality: 0,
        valveStatus: 'closed',
        timestamp: serverTimestamp(),
      });

      // Create user activity log
      const activityRef = collection(adminDb, 'users', userId, 'activities');
      await addDoc(activityRef, {
        action: 'Account created',
        details: 'User account was created by admin',
        type: 'account_creation',
        timestamp: serverTimestamp(),
      });

      // Get the created user
      const createdUser = await this.getUserById(userId);
      
      return { 
        success: true, 
        userId, 
        user: createdUser || undefined // Handle null case
      };
    } catch (error: any) {
      console.error('Error creating user:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to create user' 
      };
    }
  }

  // READ Operations
  async getUserById(userId: string): Promise<ProcessedUser | null> {
    try {
      // Check cache
      const cached = userCache.get(userId);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.user;
      }

      const userDoc = await getDoc(doc(adminDb, 'users', userId));
      
      if (!userDoc.exists()) {
        return null;
      }

      const user = await this.processUserWithImage(userId, userDoc.data());
      userCache.set(userId, { user, timestamp: Date.now() });
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<ProcessedUser | null> {
    try {
      const usersRef = collection(adminDb, 'users');
      const q = query(usersRef, where('email', '==', email.toLowerCase()));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return null;
      }

      const userDoc = snapshot.docs[0];
      return await this.processUserWithImage(userDoc.id, userDoc.data());
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  async getUsersByStatus(status: 'active' | 'inactive' | 'suspended'): Promise<ProcessedUser[]> {
    try {
      const usersRef = collection(adminDb, 'users');
      const q = query(usersRef, where('status', '==', status));
      const snapshot = await getDocs(q);
      
      const users = await Promise.all(
        snapshot.docs.map(async (userDoc) => {
          return await this.processUserWithImage(userDoc.id, userDoc.data());
        })
      );

      return users;
    } catch (error) {
      console.error('Error getting users by status:', error);
      return [];
    }
  }

  async getUsersByRole(role: 'user' | 'admin'): Promise<ProcessedUser[]> {
    try {
      const usersRef = collection(adminDb, 'users');
      const q = query(usersRef, where('role', '==', role));
      const snapshot = await getDocs(q);
      
      const users = await Promise.all(
        snapshot.docs.map(async (userDoc) => {
          return await this.processUserWithImage(userDoc.id, userDoc.data());
        })
      );

      return users;
    } catch (error) {
      console.error('Error getting users by role:', error);
      return [];
    }
  }

  async getUsersWithDevices(): Promise<ProcessedUser[]> {
    try {
      const usersRef = collection(adminDb, 'users');
      const q = query(usersRef, where('hasLinkedDevices', '==', true));
      const snapshot = await getDocs(q);
      
      const users = await Promise.all(
        snapshot.docs.map(async (userDoc) => {
          return await this.processUserWithImage(userDoc.id, userDoc.data());
        })
      );

      return users;
    } catch (error) {
      console.error('Error getting users with devices:', error);
      return [];
    }
  }

  async searchUsers(searchTerm: string): Promise<ProcessedUser[]> {
    try {
      if (!searchTerm.trim()) {
        return [];
      }

      const usersRef = collection(adminDb, 'users');
      const searchTermLower = searchTerm.toLowerCase();
      
      // Create multiple queries for different fields
      const queries = [
        query(usersRef, where('email', '>=', searchTermLower), where('email', '<=', searchTermLower + '\uf8ff')),
        query(usersRef, where('fullName', '>=', searchTermLower), where('fullName', '<=', searchTermLower + '\uf8ff')),
        query(usersRef, where('username', '>=', searchTermLower), where('username', '<=', searchTermLower + '\uf8ff')),
        query(usersRef, where('phoneNumber', '>=', searchTermLower), where('phoneNumber', '<=', searchTermLower + '\uf8ff')),
      ];

      const allSnapshots = await Promise.all(queries.map(q => getDocs(q)));
      const uniqueUserIds = new Set<string>();
      const users: ProcessedUser[] = [];

      for (const snapshot of allSnapshots) {
        for (const userDoc of snapshot.docs) {
          if (!uniqueUserIds.has(userDoc.id)) {
            uniqueUserIds.add(userDoc.id);
            const user = await this.processUserWithImage(userDoc.id, userDoc.data());
            users.push(user);
          }
        }
      }

      return users;
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  async getAllUsers(pagination?: PaginationOptions): Promise<{
    users: ProcessedUser[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const usersRef = collection(adminDb, 'users');
      let q = query(usersRef);
      
      if (pagination) {
        const { limit: limitCount, page, orderBy: orderField = 'createdAt', orderDirection = 'desc' } = pagination;
        const offset = (page - 1) * limitCount;
        
        q = query(
          usersRef,
          orderBy(orderField, orderDirection),
          limit(limitCount + 1) // +1 to check if there's a next page
        );
      }

      const snapshot = await getDocs(q);
      const allUsers = await Promise.all(
        snapshot.docs.map(async (userDoc) => {
          return await this.processUserWithImage(userDoc.id, userDoc.data());
        })
      );

      // For pagination
      let paginatedUsers = allUsers;
      let hasNextPage = false;
      
      if (pagination) {
        hasNextPage = allUsers.length > pagination.limit;
        paginatedUsers = allUsers.slice(0, pagination.limit);
      }

      // Get total count (for first page only)
      let totalCount = allUsers.length;
      if (pagination?.page === 1) {
        const countSnapshot = await getDocs(usersRef);
        totalCount = countSnapshot.size;
      }

      return {
        users: paginatedUsers,
        total: totalCount,
        page: pagination?.page || 1,
        totalPages: Math.ceil(totalCount / (pagination?.limit || totalCount)),
      };
    } catch (error) {
      console.error('Error getting all users:', error);
      return {
        users: [],
        total: 0,
        page: 1,
        totalPages: 0,
      };
    }
  }

  // UPDATE Operations
  async updateUser(userId: string, updates: UpdateUserData): Promise<{ 
    success: boolean; 
    error?: string;
    user?: ProcessedUser;
  }> {
    try {
      const userRef = doc(adminDb, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        return { success: false, error: 'User not found' };
      }

      // Prepare update data
      const updateData: any = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      // If updating email, check if it's already taken
      if (updates.email) {
        const existingUser = await this.getUserByEmail(updates.email);
        if (existingUser && existingUser.id !== userId) {
          return { success: false, error: 'Email already in use' };
        }
        updateData.email = updates.email.toLowerCase();
        updateData.isGmailAccount = updates.email.includes('gmail.com');
      }

      await updateDoc(userRef, updateData);
      
      // Clear cache
      this.clearUserCache(userId);
      
      // Log activity
      const activityRef = collection(adminDb, 'users', userId, 'activities');
      await addDoc(activityRef, {
        action: 'Profile updated',
        details: 'User profile was updated by admin',
        type: 'profile_update',
        timestamp: serverTimestamp(),
        changes: Object.keys(updates),
      });

      // Get updated user
      const updatedUser = await this.getUserById(userId);
      
      return { 
        success: true, 
        user: updatedUser || undefined // Handle null case
      };
    } catch (error: any) {
      console.error('Error updating user:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to update user' 
      };
    }
  }

  async bulkUpdateUsers(bulkData: BulkUpdateData): Promise<{ 
    success: boolean; 
    updatedCount: number;
    errors: string[];
  }> {
    try {
      const batch = writeBatch(adminDb);
      const errors: string[] = [];
      let updatedCount = 0;

      for (const userId of bulkData.userIds) {
        const userRef = doc(adminDb, 'users', userId);
        try {
          batch.update(userRef, {
            ...bulkData.updates,
            updatedAt: serverTimestamp(),
          });
          this.clearUserCache(userId);
          updatedCount++;
        } catch (error: any) {
          errors.push(`User ${userId}: ${error.message}`);
        }
      }

      await batch.commit();
      
      return {
        success: errors.length === 0,
        updatedCount,
        errors,
      };
    } catch (error: any) {
      console.error('Error in bulk update:', error);
      return {
        success: false,
        updatedCount: 0,
        errors: [error.message],
      };
    }
  }

  async updateUserStatus(userId: string, status: 'active' | 'inactive' | 'suspended'): Promise<boolean> {
    try {
      const userRef = doc(adminDb, 'users', userId);
      await updateDoc(userRef, {
        status,
        updatedAt: serverTimestamp(),
      });

      this.clearUserCache(userId);
      
      // Log activity
      const activityRef = collection(adminDb, 'users', userId, 'activities');
      await addDoc(activityRef, {
        action: `Status changed to ${status}`,
        details: `User account status was updated`,
        type: 'status_change',
        timestamp: serverTimestamp(),
      });

      return true;
    } catch (error) {
      console.error('Error updating user status:', error);
      return false;
    }
  }

  async verifyUserEmail(userId: string): Promise<boolean> {
    try {
      const userRef = doc(adminDb, 'users', userId);
      await updateDoc(userRef, {
        isEmailVerified: true,
        updatedAt: serverTimestamp(),
      });

      this.clearUserCache(userId);
      return true;
    } catch (error) {
      console.error('Error verifying user email:', error);
      return false;
    }
  }

  // DELETE Operations
  async deleteUser(userId: string): Promise<{ 
    success: boolean; 
    error?: string;
  }> {
    try {
      const userRef = doc(adminDb, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        return { success: false, error: 'User not found' };
      }

      // First, delete all user data (in production, you might want to archive instead)
      const batch = writeBatch(adminDb);
      
      // Delete user document
      batch.delete(userRef);
      
      // Delete user's water data
      const waterDataRef = collection(adminDb, 'users', userId, 'waterData');
      const waterDataSnapshot = await getDocs(waterDataRef);
      waterDataSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Delete user's activities
      const activitiesRef = collection(adminDb, 'users', userId, 'activities');
      const activitiesSnapshot = await getDocs(activitiesRef);
      activitiesSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Delete user's alerts
      const alertsRef = collection(adminDb, 'users', userId, 'alerts');
      const alertsSnapshot = await getDocs(alertsRef);
      alertsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Delete user's devices
      const devicesRef = collection(adminDb, 'users', userId, 'devices');
      const devicesSnapshot = await getDocs(devicesRef);
      devicesSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      
      // Clear cache
      this.clearUserCache(userId);
      
      // Delete profile image from storage if exists
      try {
        const imagePaths = [
          `users/${userId}/profile/profile.jpg`,
          `users/${userId}/profile_images/profile.jpg`,
          `users/${userId}/profile_pictures/profile.jpg`,
        ];
        
        for (const path of imagePaths) {
          const imageRef = ref(adminStorage, path);
          await deleteObject(imageRef);
        }
      } catch (storageError) {
        console.log('No profile image to delete or already deleted');
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting user:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to delete user' 
      };
    }
  }

  async deleteMultipleUsers(userIds: string[]): Promise<{ 
    success: boolean; 
    deletedCount: number;
    errors: string[];
  }> {
    try {
      const results = await Promise.allSettled(
        userIds.map(userId => this.deleteUser(userId))
      );

      const deletedCount = results.filter(r => 
        r.status === 'fulfilled' && r.value.success
      ).length;
      
      const errors = results
        .filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success))
        .map(r => r.status === 'rejected' ? r.reason.message : r.value.error);

      return {
        success: errors.length === 0,
        deletedCount,
        errors,
      };
    } catch (error: any) {
      console.error('Error deleting multiple users:', error);
      return {
        success: false,
        deletedCount: 0,
        errors: [error.message],
      };
    }
  }

  // STATISTICS Operations
  async getUserStats(): Promise<UserStats> {
    try {
      const usersRef = collection(adminDb, 'users');
      const snapshot = await getDocs(usersRef);
      
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseUser[];
      
      const waterDataPromises = users.map(async (user) => {
        try {
          const waterDataRef = collection(adminDb, 'users', user.id, 'waterData');
          const q = query(waterDataRef, orderBy('timestamp', 'desc'), limit(1));
          const waterSnapshot = await getDocs(q);
          
          if (!waterSnapshot.empty) {
            const latestData = waterSnapshot.docs[0].data();
            return latestData.todayBill || 0;
          }
          return 0;
        } catch (error) {
          return 0;
        }
      });

      const waterBills = await Promise.all(waterDataPromises);
      const totalRevenue = waterBills.reduce((sum, bill) => sum + bill, 0) * 30;

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const stats: UserStats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'active').length,
        verifiedUsers: users.filter(u => u.isEmailVerified).length,
        usersWithDevices: users.filter(u => u.hasLinkedDevices).length,
        gmailUsers: users.filter(u => u.isGmailAccount).length,
        recentSignups: users.filter(u => {
          if (!u.createdAt) return false;
          const createdAt = u.createdAt instanceof Timestamp ? u.createdAt.toDate() : new Date(u.createdAt);
          return createdAt >= sevenDaysAgo;
        }).length,
        totalRevenue,
      };

      return stats;
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        totalUsers: 0,
        activeUsers: 0,
        verifiedUsers: 0,
        usersWithDevices: 0,
        gmailUsers: 0,
        recentSignups: 0,
        totalRevenue: 0,
      };
    }
  }

  // REAL-TIME Subscriptions
  subscribeToAllUsers(onUpdate: (users: ProcessedUser[]) => void) {
    const usersRef = collection(adminDb, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, async (snapshot: QuerySnapshot<DocumentData>) => {
      try {
        console.log(`🔄 Real-time update: ${snapshot.docs.length} users`);
        
        const users = await Promise.all(
          snapshot.docs.map(async (userDoc) => {
            const userData = userDoc.data();
            const userId = userDoc.id;
            return await this.processUserWithImage(userId, userData);
          })
        );

        onUpdate(users);
      } catch (error) {
        console.error('Error processing real-time users:', error);
        onUpdate([]);
      }
    });
  }

  subscribeToUser(userId: string, onUpdate: (user: ProcessedUser | null) => void) {
    const userRef = doc(adminDb, 'users', userId);
    
    return onSnapshot(userRef, async (userDoc) => {
      try {
        if (userDoc.exists()) {
          const user = await this.processUserWithImage(userId, userDoc.data());
          onUpdate(user);
        } else {
          onUpdate(null);
        }
      } catch (error) {
        console.error('Error in user subscription:', error);
        onUpdate(null);
      }
    });
  }

  subscribeToUserWaterData(userId: string, onUpdate: (data: WaterFlowData) => void) {
    const waterDataRef = collection(adminDb, 'users', userId, 'waterData');
    const q = query(waterDataRef, orderBy('timestamp', 'desc'), limit(1));
    
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const latestData = snapshot.docs[0].data();
        onUpdate({
          currentFlowRate: latestData.flowRate || latestData.currentFlowRate || 0,
          todayUsage: latestData.todayUsage || latestData.dailyUsage || 0,
          todayBill: latestData.todayBill || latestData.dailyCost || 0,
          pressure: latestData.pressure || 0,
          temperature: latestData.temperature || 0,
          waterQuality: latestData.waterQuality || 0,
          valveStatus: latestData.valveStatus || 'closed',
          timestamp: latestData.timestamp || Timestamp.now(),
          peakFlow: latestData.peakFlow || 0,
        });
      } else {
        onUpdate({
          currentFlowRate: 0,
          todayUsage: 0,
          todayBill: 0,
          pressure: 0,
          temperature: 0,
          waterQuality: 0,
          valveStatus: 'closed',
          timestamp: Timestamp.now(),
          peakFlow: 0,
        });
      }
    });
  }

  // Helper Methods
  private async processUserWithImage(userId: string, userData: any): Promise<ProcessedUser> {
    let waterFlowData: WaterFlowData = {
      currentFlowRate: 0,
      todayUsage: 0,
      todayBill: 0,
      pressure: 0,
      temperature: 0,
      waterQuality: 0,
      valveStatus: 'closed',
      timestamp: Timestamp.now(),
      peakFlow: 0,
    };
    
    let hasLinkedDevices = userData.hasLinkedDevices || false;
    let lastActivity = userData.lastLogin || null;

    try {
      // Get real-time water data
      const waterDataRef = collection(adminDb, 'users', userId, 'waterData');
      const waterQuery = query(waterDataRef, orderBy('timestamp', 'desc'), limit(1));
      const waterSnapshot = await getDocs(waterQuery);
      
      if (!waterSnapshot.empty) {
        const latestWater = waterSnapshot.docs[0].data();
        waterFlowData = {
          currentFlowRate: latestWater.flowRate || latestWater.currentFlowRate || 0,
          todayUsage: latestWater.todayUsage || latestWater.dailyUsage || 0,
          todayBill: latestWater.todayBill || latestWater.dailyCost || 0,
          pressure: latestWater.pressure || 0,
          temperature: latestWater.temperature || 0,
          waterQuality: latestWater.waterQuality || 0,
          valveStatus: latestWater.valveStatus || 'closed',
          timestamp: latestWater.timestamp || Timestamp.now(),
          peakFlow: latestWater.peakFlow || 0,
        };
      }
    } catch (waterError) {
      console.log(`No water data for user ${userId}:`, waterError);
    }

    try {
      // Get user statistics
      const waterHistory = await this.getWaterDataHistory(userId, 30);
      const totalUsage = waterHistory.reduce((sum, data) => sum + (data.todayUsage || data.dailyUsage || 0), 0);
      const averageDailyUsage = waterHistory.length > 0 ? totalUsage / waterHistory.length : 0;
      const estimatedMonthlyBill = waterHistory.reduce((sum, data) => sum + (data.todayBill || data.dailyCost || 0), 0) * 30;

      const displayPhotoUrl = userData.photoURL || userData.profileImageUrl || getDefaultAvatar(userData.fullName, userData.email);
      const valveStatus: 'open' | 'closed' = waterFlowData.currentFlowRate > 0 ? 'open' : 'closed';

      return {
        id: userId,
        uid: userId,
        email: userData.email || '',
        fullName: userData.fullName || 'Unknown User',
        username: userData.username || '',
        phoneNumber: userData.phoneNumber || '',
        address: userData.address || '',
        isEmailVerified: userData.isEmailVerified || false,
        isGmailAccount: userData.isGmailAccount || false,
        otpVerified: userData.otpVerified || false,
        hasLinkedDevices,
        status: userData.status || 'active',
        role: userData.role || 'user',
        photoURL: displayPhotoUrl,
        profileImageUrl: displayPhotoUrl,
        displayPhotoUrl,
        waterFlowData,
        lastActivity,
        valveStatus,
        createdAt: userData.createdAt || null,
        updatedAt: userData.updatedAt || null,
        lastLogin: userData.lastLogin || null,
        deviceToken: userData.deviceToken || '',
        notificationEnabled: userData.notificationEnabled ?? true,
        language: userData.language || 'en',
        timezone: userData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        totalUsage,
        averageDailyUsage,
        estimatedMonthlyBill,
      };
    } catch (error) {
      console.error('Error processing user:', error);
      // Return minimal user data
      return {
        id: userId,
        uid: userId,
        email: userData.email || '',
        fullName: userData.fullName || 'Unknown User',
        username: userData.username || '',
        phoneNumber: userData.phoneNumber || '',
        waterFlowData,
        lastActivity,
        valveStatus: 'closed',
        displayPhotoUrl: getDefaultAvatar(userData.fullName, userData.email),
        isEmailVerified: userData.isEmailVerified || false,
        hasLinkedDevices: false,
        status: userData.status || 'active',
        role: userData.role || 'user',
        photoURL: getDefaultAvatar(userData.fullName, userData.email),
        profileImageUrl: getDefaultAvatar(userData.fullName, userData.email),
      };
    }
  }

  private async getWaterDataHistory(userId: string, days: number = 7): Promise<WaterDataHistoryItem[]> {
    try {
      const waterDataRef = collection(adminDb, 'users', userId, 'waterData');
      const waterQuery = query(waterDataRef, orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(waterQuery);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().timestamp?.toDate?.() || new Date()
      })) as WaterDataHistoryItem[];
    } catch (error) {
      console.error('Error getting water data history:', error);
      return [];
    }
  }

  async uploadProfileImage(userId: string, file: File): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `profile_${Date.now()}.${fileExtension}`;
      const storagePath = `users/${userId}/profile_images/${fileName}`;
      const storageRef = ref(adminStorage, storagePath);

      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);

      // Update user document with new image URL
      const userRef = doc(adminDb, 'users', userId);
      await updateDoc(userRef, {
        photoURL: downloadUrl,
        profileImageUrl: downloadUrl,
        updatedAt: serverTimestamp(),
      });

      // Clear cache
      this.clearUserCache(userId);

      return { success: true, url: downloadUrl };
    } catch (error: any) {
      console.error('Error uploading profile image:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
const realtimeUserService = RealtimeUserService.getInstance();
export default realtimeUserService;