import { getApp, getApps, initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

// Firebase web config is safe to expose (access is enforced by security rules).
// Values fall back to the shared project so the app runs without a local .env;
// override any of them via NEXT_PUBLIC_FIREBASE_* environment variables.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyDGVzgnkicPwXJgiHMmKTqPJEanjnYfn-k",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "healthyspine-7e8d4.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "healthyspine-7e8d4",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "healthyspine-7e8d4.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "142814791905",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:142814791905:web:6c3e4bfaa3dc8a44034fa0",
}

// Reuse the existing app on hot reload / repeated imports instead of re-initializing.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export { app }
