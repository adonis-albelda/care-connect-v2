import { convexAuth } from '@convex-dev/auth/server'
import { Password } from '@convex-dev/auth/providers/Password'
import Google from '@auth/core/providers/google'
import Facebook from '@auth/core/providers/facebook'

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password, Google, Facebook],
})
