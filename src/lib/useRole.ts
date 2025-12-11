// src/lib/useRole.ts - UPDATED VERSION
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { adminAuth, adminDb } from "./firebase"; // Changed from auth, db to adminAuth, adminDb

export function useRole() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(adminAuth, async (firebaseUser: User | null) => {
      setUser(firebaseUser);
      
      if (!firebaseUser) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        // Check if it's a super admin first
        const superAdminRef = doc(adminDb, "web_admins", firebaseUser.uid);
        const superAdminSnap = await getDoc(superAdminRef);
        
        if (superAdminSnap.exists()) {
          const adminData = superAdminSnap.data();
          setRole(adminData?.role || "super_admin");
          setLoading(false);
          return;
        }

        // Check regular user collection
        const userRef = doc(adminDb, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setRole(userData?.role || "user");
        } else {
          // If user doesn't exist in users collection, check if it's an admin
          setRole("user"); // Default role
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setRole("user"); // Default fallback
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { role, loading, user };
}

// Alternative: Simple version if you just need mobile user roles
export function useMobileUserRole() {
  const [role, setRole] = useState<string>("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(adminAuth, async (firebaseUser: User | null) => {
      if (!firebaseUser) {
        setRole("anonymous");
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(adminDb, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setRole(userData?.role || "user");
        } else {
          setRole("user");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setRole("user");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { role, loading };
}

// For admin dashboard - checks if user is a super admin
export function useSuperAdminCheck() {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(adminAuth, async (firebaseUser: User | null) => {
      if (!firebaseUser) {
        setIsSuperAdmin(false);
        setAdminData(null);
        setLoading(false);
        return;
      }

      try {
        const adminRef = doc(adminDb, "web_admins", firebaseUser.uid);
        const adminSnap = await getDoc(adminRef);

        if (adminSnap.exists()) {
          const data = adminSnap.data();
          setIsSuperAdmin(true);
          setAdminData(data);
        } else {
          setIsSuperAdmin(false);
          setAdminData(null);
        }
      } catch (error) {
        console.error("Error checking super admin status:", error);
        setIsSuperAdmin(false);
        setAdminData(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { isSuperAdmin, loading, adminData };
}

// Hook to get user data with role
export function useUserWithRole() {
  const [userData, setUserData] = useState<{
    user: User | null;
    role: string;
    isSuperAdmin: boolean;
    adminPermissions?: any;
  }>({
    user: null,
    role: "anonymous",
    isSuperAdmin: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(adminAuth, async (firebaseUser: User | null) => {
      if (!firebaseUser) {
        setUserData({
          user: null,
          role: "anonymous",
          isSuperAdmin: false,
        });
        setLoading(false);
        return;
      }

      try {
        // First check if super admin
        const adminRef = doc(adminDb, "web_admins", firebaseUser.uid);
        const adminSnap = await getDoc(adminRef);

        if (adminSnap.exists()) {
          const adminData = adminSnap.data();
          setUserData({
            user: firebaseUser,
            role: adminData?.role || "super_admin",
            isSuperAdmin: true,
            adminPermissions: adminData?.permissions,
          });
          setLoading(false);
          return;
        }

        // Check regular user
        const userRef = doc(adminDb, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserData({
            user: firebaseUser,
            role: userData?.role || "user",
            isSuperAdmin: false,
          });
        } else {
          setUserData({
            user: firebaseUser,
            role: "user",
            isSuperAdmin: false,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData({
          user: firebaseUser,
          role: "user",
          isSuperAdmin: false,
        });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { ...userData, loading };
}