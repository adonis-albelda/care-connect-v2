'use client'

import { createContext, useContext, useCallback, type ReactNode } from 'react'
import { useConvexAuth, useQuery, useMutation } from 'convex/react'
import { useAuthActions } from '@convex-dev/auth/react'
import { api } from '@convex/_generated/api'
import type { ApiUser } from './types'

interface SignUpParams {
  firstName: string
  lastName?: string
  phoneNumber?: string
  email: string
  password: string
}

interface AuthContextValue {
  user: ApiUser | null
  loading: boolean
  signInWithPassword: (email: string, password: string) => Promise<void>
  signUp: (params: SignUpParams) => Promise<void>
  signInWithOAuth: (provider: 'google' | 'facebook') => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { signIn, signOut: convexSignOut } = useAuthActions()
  const viewer = useQuery(api.clients.viewer, isAuthenticated ? {} : 'skip')
  const upsertProfile = useMutation(api.clients.upsertProfile)

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      await signIn('password', { email, password, flow: 'signIn' })
    },
    [signIn]
  )

  const signUp = useCallback(
    async ({ firstName, lastName, phoneNumber, email, password }: SignUpParams) => {
      await signIn('password', { email, password, flow: 'signUp' })
      await upsertProfile({ firstName, lastName, phoneNumber })
    },
    [signIn, upsertProfile]
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
    <AuthContext.Provider
      value={{
        user: viewer ?? null,
        loading,
        signInWithPassword,
        signUp,
        signInWithOAuth,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
