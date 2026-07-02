import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// These variables will be loaded from .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isFirebaseConfigured =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

let app;
let auth: any = null;
let db: any = null;

if (isFirebaseConfigured) {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

// Local mock database in case Firebase is not fully configured (enables zero-setup local dev)
const getLocalData = (key: string) => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

const setLocalData = (key: string, value: any) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
};

export interface UserProfile {
  uid: string;
  email: string;
  role: "student" | "company";
  name: string;
  companyName?: string;
  college?: string;
  skills?: string[];
  cpi?: number;
  marketValue?: number;
  walletAddress?: string;
  tokenBalance?: number;
  createdAt: string;
}

export async function firebaseSignUp(email: string, password: string, name: string, role: "student" | "company", extra: any = {}): Promise<UserProfile> {
  if (isFirebaseConfigured && auth && db) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const profile: UserProfile = {
        uid: user.uid,
        email,
        role,
        name,
        ...extra,
        createdAt: new Date().toISOString(),
      };
      
      await setDoc(doc(db, "users", user.uid), profile);
      
      // Crucial: Set local data so the application knows the user is logged in
      setLocalData("scoutrena_current_user", profile);
      
      return profile;
    } catch (error: any) {
      console.error("Firebase SignUp Error:", error);
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error("Email/Password Auth is not enabled! Go to Firebase Console -> Authentication -> Sign-in method and enable 'Email/Password'.");
      } else if (error.code === 'auth/email-already-in-use') {
        throw new Error("This email is already registered. Please log in instead.");
      } else if (error.code === 'auth/weak-password') {
        throw new Error("Password must be at least 6 characters long.");
      }
      throw new Error(error.message || "Registration failed.");
    }
  } else {
    throw new Error("Firebase is not configured. Real signup is disabled.");
  }
}

export async function firebaseLogin(email: string, password: string): Promise<UserProfile> {
  if (isFirebaseConfigured && auth && db) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const profile = docSnap.data() as UserProfile;
        // Crucial: Set local data so the application knows the user is logged in
        setLocalData("scoutrena_current_user", profile);
        return profile;
      }
      throw new Error("Profile not found in Firestore. Please register first.");
    } catch (error: any) {
      console.error("Firebase Login Error:", error);
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error("Email/Password Auth is not enabled! Go to Firebase Console -> Authentication -> Sign-in method and enable 'Email/Password'.");
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        throw new Error("Invalid email or password. Please check your credentials or register a new account.");
      } else if (error.code === 'auth/wrong-password') {
        throw new Error("Incorrect password. Please try again.");
      }
      throw new Error(error.message || "Login failed.");
    }
  } else {
    throw new Error("Firebase is not configured. Real login is disabled.");
  }
}

export async function firebaseLogout() {
  if (isFirebaseConfigured && auth) {
    await signOut(auth);
    if (typeof window !== "undefined") {
      localStorage.removeItem("scoutrena_current_user");
    }
  } else {
    if (typeof window !== "undefined") {
      localStorage.removeItem("scoutrena_current_user");
    }
  }
}

export function getCurrentUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  return getLocalData("scoutrena_current_user");
}

export async function updateProfile(uid: string, data: Partial<UserProfile>) {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, data);
    
    // Also update local storage for fast reading
    const currentUser = getLocalData("scoutrena_current_user");
    if (currentUser && currentUser.uid === uid) {
      setLocalData("scoutrena_current_user", { ...currentUser, ...data });
    }
  } else {
    throw new Error("Firebase is not configured.");
  }
}

export { auth, db };
