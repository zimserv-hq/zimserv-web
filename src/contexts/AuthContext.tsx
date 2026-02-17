// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase.config";

interface UserData {
  uid: string;
  email: string;
  fullName: string;
  phone: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  signup: (
    email: string,
    password: string,
    fullName: string,
    phone: string,
  ) => Promise<{ success: boolean; requiresVerification: boolean }>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  refreshUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyResetCode: (code: string) => Promise<string>;
  confirmPasswordReset: (code: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Signup function with email verification
  const signup = async (
    email: string,
    password: string,
    fullName: string,
    phone: string,
  ) => {
    try {
      console.log("🔄 Creating new user account...");

      // 1. Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // 2. Update profile with display name
      await updateProfile(user, {
        displayName: fullName,
      });

      // 3. Send verification email via unified handler
      const actionCodeSettings = {
        url: `${window.location.origin}/auth/action`, // ✅ unified handler
        handleCodeInApp: true,
      };

      await sendEmailVerification(user, actionCodeSettings);
      console.log("✅ Verification email sent to:", email);

      // 4. Save user data to Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userData = {
        uid: user.uid,
        email: email,
        fullName: fullName,
        phone: phone,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "customer",
        provider: "email",
      };

      await setDoc(userDocRef, userData);
      console.log("✅ User data stored in Firestore");

      // 5. Sign out user until they verify
      await signOut(auth);
      console.log("✅ User signed out - awaiting email verification");

      return { success: true, requiresVerification: true };
    } catch (error: any) {
      console.error("❌ Signup error:", error);
      throw error;
    }
  };

  // Login function with email verification check
  const login = async (email: string, password: string) => {
    try {
      console.log("🔄 Logging in user...");

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Reload user to get latest emailVerified status
      await user.reload();

      // Check if email is verified
      if (!user.emailVerified) {
        console.warn("⚠️ Email not verified");
        // Sign out unverified user
        await signOut(auth);

        const error: any = new Error(
          "Please verify your email before logging in. Check your inbox for the verification link.",
        );
        error.code = "auth/email-not-verified";
        throw error;
      }

      // Update emailVerified status in Firestore
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        {
          emailVerified: true,
          updatedAt: new Date(),
        },
        { merge: true },
      );

      console.log("✅ User logged in successfully:", user.uid);
    } catch (error: any) {
      console.error("❌ Login error:", error);
      throw error;
    }
  };

  // Reset password function - uses unified handler URL
  const resetPassword = async (email: string) => {
    try {
      console.log("🔄 Sending password reset email...");

      const actionCodeSettings = {
        url: `${window.location.origin}/auth/action`, // ✅ unified handler
        handleCodeInApp: true,
      };

      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      console.log("✅ Password reset email sent to:", email);
    } catch (error: any) {
      console.error("❌ Password reset error:", error);
      throw error;
    }
  };

  // Verify password reset code and return email
  const verifyResetCode = async (code: string): Promise<string> => {
    try {
      console.log("🔄 Verifying password reset code...");
      const email = await verifyPasswordResetCode(auth, code);
      console.log("✅ Reset code verified for:", email);
      return email;
    } catch (error: any) {
      console.error("❌ Reset code verification error:", error);
      throw error;
    }
  };

  // Confirm password reset with new password
  const confirmPasswordResetHandler = async (
    code: string,
    newPassword: string,
  ) => {
    try {
      console.log("🔄 Confirming password reset...");
      await confirmPasswordReset(auth, code, newPassword);
      console.log("✅ Password reset successfully");
    } catch (error: any) {
      console.error("❌ Password reset confirmation error:", error);
      throw error;
    }
  };

  // Resend verification email via unified handler
  const resendVerificationEmail = async () => {
    try {
      if (!currentUser) {
        throw new Error("No user is currently signed in");
      }

      const actionCodeSettings = {
        url: `${window.location.origin}/auth/action`, // ✅ unified handler
        handleCodeInApp: true,
      };

      await sendEmailVerification(currentUser, actionCodeSettings);
      console.log("✅ Verification email resent to:", currentUser.email);
    } catch (error: any) {
      console.error("❌ Error resending verification email:", error);
      throw error;
    }
  };

  // Refresh user to get latest emailVerified status
  const refreshUser = async () => {
    try {
      if (currentUser) {
        await currentUser.reload();
        setCurrentUser({ ...currentUser });

        if (currentUser.emailVerified) {
          // Update Firestore
          const userDocRef = doc(db, "users", currentUser.uid);
          await setDoc(
            userDocRef,
            {
              emailVerified: true,
              updatedAt: new Date(),
            },
            { merge: true },
          );

          // Refresh user data
          await fetchUserData(currentUser.uid);
        }
      }
    } catch (error) {
      console.error("❌ Error refreshing user:", error);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log("🔄 Logging out user...");
      await signOut(auth);
      setUserData(null);
      console.log("✅ User logged out successfully");
    } catch (error: any) {
      console.error("❌ Logout error:", error);
      throw error;
    }
  };

  // Fetch user data from Firestore
  const fetchUserData = async (uid: string) => {
    try {
      console.log("🔄 Fetching user data from Firestore...");
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData({
          uid: data.uid,
          email: data.email,
          fullName: data.fullName,
          phone: data.phone,
          emailVerified: data.emailVerified || false,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        });
        console.log("✅ User data fetched:", data.fullName);
      } else {
        console.warn("⚠️ No user document found in Firestore");
      }
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    console.log("🔄 Setting up auth state listener...");

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log(
        "🔄 Auth state changed:",
        user ? `User: ${user.uid}` : "No user",
      );
      setCurrentUser(user);

      if (user) {
        await fetchUserData(user.uid);
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => {
      console.log("🔄 Cleaning up auth state listener");
      unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    currentUser,
    userData,
    loading,
    signup,
    login,
    logout,
    resendVerificationEmail,
    refreshUser,
    resetPassword,
    verifyResetCode,
    confirmPasswordReset: confirmPasswordResetHandler,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
