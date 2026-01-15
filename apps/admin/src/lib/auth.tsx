import React, { createContext, useContext, useMemo, useState } from "react"
import { clearAuthToken, getAuthToken, setAuthToken } from "@/lib/api"

type AuthContextValue = {
  token: string | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getAuthToken())

  const value = useMemo<AuthContextValue>(() => {
    return {
      token,
      isAuthenticated: Boolean(token),
      login: (nextToken: string) => {
        setAuthToken(nextToken)
        setTokenState(nextToken)
      },
      logout: () => {
        clearAuthToken()
        setTokenState(null)
      },
    }
  }, [token])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return ctx
}
