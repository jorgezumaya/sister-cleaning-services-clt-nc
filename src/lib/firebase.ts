import { initializeApp, getApps, type FirebaseOptions } from "firebase/app";
import { getStorage } from "firebase/storage";

// All public — Firebase web config is meant to ship to the browser; access
// control lives in Storage security rules (public read, no write), not here.
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

export const firebaseApp = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);
export const isFirebaseConfigured = Boolean(firebaseConfig.projectId && firebaseConfig.storageBucket);
