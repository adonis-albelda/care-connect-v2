'use client'

import { useCallback, useEffect, useState } from 'react'

const COOLDOWN_MS = 5 * 60 * 1000
const STORAGE_KEY = 'cc_last_inquiry_at'

// One inquiry per 5 minutes per browser — tracked in localStorage, not the
// server, so it's a soft spam deterrent, not a hard rate limit.
export function useInquiryCooldown() {
  const [remainingMs, setRemainingMs] = useState(0)

  const tick = useCallback(() => {
    const lastSentAt = Number(localStorage.getItem(STORAGE_KEY) ?? 0)
    const remaining = COOLDOWN_MS - (Date.now() - lastSentAt)
    setRemainingMs(remaining > 0 ? remaining : 0)
  }, [])

  useEffect(() => {
    // Nested in callbacks (setTimeout/setInterval), not called directly at
    // the top of the effect body, per the earlier pattern this project uses
    // to keep the React Compiler's effect-purity check happy.
    const initial = setTimeout(tick, 0)
    const interval = setInterval(tick, 1000)
    return () => {
      clearTimeout(initial)
      clearInterval(interval)
    }
  }, [tick])

  const markSent = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()))
    tick()
  }, [tick])

  return { remainingMs, markSent }
}
