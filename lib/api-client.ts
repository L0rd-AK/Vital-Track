import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "./firebase"

// Resolve the current Firebase user, waiting for auth state to initialize.
function currentUser(): Promise<User | null> {
  if (auth.currentUser) return Promise.resolve(auth.currentUser)
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub()
      resolve(user)
    })
  })
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

// Authenticated fetch to our API routes. Attaches the Firebase ID token and
// parses JSON. Throws ApiError on non-2xx responses.
export async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const user = await currentUser()
  if (!user) throw new ApiError("Not authenticated", 401)

  const token = await user.getIdToken()
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    let message = res.statusText
    try {
      const body = await res.json()
      message = body?.error || message
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(message, res.status)
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}
