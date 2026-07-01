import { adminAuth } from "./firebase-admin"

export class AuthError extends Error {
  status: number
  constructor(message = "Unauthorized", status = 401) {
    super(message)
    this.status = status
  }
}

// Verify the Firebase ID token from the Authorization header and return the uid.
export async function requireUid(req: Request): Promise<string> {
  const header = req.headers.get("authorization") || ""
  const match = header.match(/^Bearer (.+)$/i)
  if (!match) throw new AuthError("Missing bearer token")

  try {
    const decoded = await adminAuth().verifyIdToken(match[1])
    return decoded.uid
  } catch {
    throw new AuthError("Invalid or expired token")
  }
}
