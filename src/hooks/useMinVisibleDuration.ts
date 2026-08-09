'use client'

import { useEffect, useRef, useState } from 'react'

// Keeps the return value `true` for at least `minMs` once `active` flips
// true, even if `active` flips back to false sooner — avoids a loading
// dialog flashing in and out faster than a person can read it.
export function useMinVisibleDuration(active: boolean, minMs: number) {
  const [visible, setVisible] = useState(active)
  const shownAtRef = useRef<number | null>(null)

  useEffect(() => {
    let cancelled = false

    if (active) {
      shownAtRef.current = Date.now()
      const id = setTimeout(() => {
        if (!cancelled) setVisible(true)
      }, 0)
      return () => {
        cancelled = true
        clearTimeout(id)
      }
    }

    const shownAt = shownAtRef.current
    const remaining = shownAt === null ? 0 : Math.max(minMs - (Date.now() - shownAt), 0)
    const id = setTimeout(() => {
      if (cancelled) return
      shownAtRef.current = null
      setVisible(false)
    }, remaining)

    return () => {
      cancelled = true
      clearTimeout(id)
    }
  }, [active, minMs])

  return visible
}
