"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "@/lib/firebase"

interface AuthContextValue {
  /** The current Firebase user, or null when signed out. */
  user: User | null
  /** True until Firebase reports the initial auth state. Guard on this to avoid flicker. */
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true })

// Single source of truth for authentication. Subscribes to Firebase auth once and
// mirrors the result into localStorage["user"] for the components that still read it.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)

      // Keep the legacy localStorage mirror consistent with Firebase.
      if (u) {
        localStorage.setItem("user", JSON.stringify({ name: u.displayName || "User", email: u.email }))
      } else {
        localStorage.removeItem("user")
      }
    })
    return () => unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
