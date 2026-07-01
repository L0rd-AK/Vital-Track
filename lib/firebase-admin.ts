import { cert, getApps, initializeApp, type App } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

// Server-side Firebase Admin, used to verify ID tokens sent by the client.
// Credentials come from a service-account key (Firebase console →
// Project Settings → Service accounts → Generate new private key).
function getAdminApp(): App {
  const existing = getApps()
  if (existing.length) return existing[0]

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  // Private key is stored with escaped newlines in .env; restore them.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin env vars missing. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in .env.local."
    )
  }

  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
}

export function adminAuth() {
  return getAuth(getAdminApp())
}
