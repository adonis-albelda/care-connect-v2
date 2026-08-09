'use client'

import { createContext, useCallback, useContext, type ReactNode } from 'react'
import { useConvexAuth, useQuery } from 'convex/react'
import { useAuthActions } from '@convex-dev/auth/react'
import { api } from '@convex/_generated/api'

interface AdminUser {
  email?: string
  profile?: { isAdmin: boolean; firstName?: string; lastName?: string } | null
}

interface AdminAuthContextValue {
  user: AdminUser | null
  loading: boolean
  signInWithPassword: (email: string, password: string) => Promise<void>
  signInWithOAuth: (provider: 'google' | 'facebook') => Promise<void>
  signOut: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { signIn, signOut: convexSignOut } = useAuthActions()
  const viewer = useQuery(api.users.viewer, isAuthenticated ? {} : 'skip')

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      await signIn('password', { email, password, flow: 'signIn' })
    },
    [signIn]
  )

  const signInWithOAuth = useCallback(
    async (provider: 'google' | 'facebook') => {
      await signIn(provider)
    },
    [signIn]
  )

  const signOut = useCallback(async () => {
    await convexSignOut()
  }, [convexSignOut])

  const loading = isLoading || (isAuthenticated && viewer === undefined)

  return (
    <AdminAuthContext.Provider
      value={{
        user: viewer ?? null,
        loading,
        signInWithPassword,
        signInWithOAuth,
        signOut,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
