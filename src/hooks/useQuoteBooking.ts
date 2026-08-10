'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from 'convex/react'
import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/lib/toast-context'
import type { TimeValue, DateRangeValue } from '@/lib/types'

const DEFAULT_TIME: TimeValue = { hour: '09', minutes: '00', period: 'AM' }
const PENDING_KEY = 'cc_pending_quote'

interface PendingQuote {
  serviceId: string
  dateFrom: string
  dateTo: string
  startTime: TimeValue
  endTime: TimeValue
}

export function useQuoteBooking({ initialServiceId = null }: { initialServiceId?: string | null } = {}) {
  const router = useRouter()
  const { user } = useAuth()
  const { showSuccess, showError } = useToast()
  const createReservation = useMutation(api.reservations.create)

  const [serviceId, setServiceId] = useState<string | null>(initialServiceId)
  const [dateRange, setDateRange] = useState<DateRangeValue | undefined>(undefined)
  const [startTime, setStartTime] = useState<TimeValue>(DEFAULT_TIME)
  const [endTime, setEndTime] = useState<TimeValue>({ ...DEFAULT_TIME, period: 'PM' })
  const [isRequesting, setIsRequesting] = useState(false)
  const [autoConfirm, setAutoConfirm] = useState(false)

  const resetStartTime = useCallback(() => setStartTime(DEFAULT_TIME), [])
  const resetEndTime = useCallback(() => setEndTime({ ...DEFAULT_TIME, period: 'PM' }), [])
  const clearAutoConfirm = useCallback(() => setAutoConfirm(false), [])

  const reset = useCallback(() => {
    setServiceId(null)
    setDateRange(undefined)
    resetStartTime()
    resetEndTime()
  }, [resetStartTime, resetEndTime])

  const formatTime = (t: TimeValue) => `${t.hour}:${t.minutes} ${t.period}`

  // Sending a guest to log in wipes this component's local state — restore
  // whatever they'd picked once they're back and signed in, and tell the
  // consumer to reopen the confirm dialog instead of leaving them to redo it.
  useEffect(() => {
    if (!user) return
    const id = setTimeout(() => {
      const raw = sessionStorage.getItem(PENDING_KEY)
      if (!raw) return
      sessionStorage.removeItem(PENDING_KEY)
      try {
        const pending = JSON.parse(raw) as PendingQuote
        setServiceId(pending.serviceId)
        setDateRange({ from: new Date(pending.dateFrom), to: new Date(pending.dateTo) })
        setStartTime(pending.startTime)
        setEndTime(pending.endTime)
        setAutoConfirm(true)
      } catch {
        // malformed/stale entry — ignore it
      }
    }, 0)
    return () => clearTimeout(id)
  }, [user])

  // Checks the request is fillable and sends guests to log in first. Returns
  // whether it's ready to preview/confirm — does not send anything yet.
  const validate = useCallback(() => {
    if (!serviceId) {
      showError('Pick a service to get started.')
      return false
    }
    if (!dateRange?.from || !dateRange?.to) {
      showError('Choose your start and end dates.')
      return false
    }
    if (!user) {
      sessionStorage.setItem(
        PENDING_KEY,
        JSON.stringify({
          serviceId,
          dateFrom: dateRange.from.toISOString(),
          dateTo: dateRange.to.toISOString(),
          startTime,
          endTime,
        } satisfies PendingQuote)
      )
      router.push('/login')
      return false
    }
    return true
  }, [serviceId, dateRange, startTime, endTime, user, router, showError])

  const submit = useCallback(async () => {
    if (!serviceId || !dateRange?.from || !dateRange?.to || isRequesting) return

    setIsRequesting(true)
    try {
      await createReservation({
        startDate: dateRange.from.toDateString(),
        endDate: dateRange.to.toDateString(),
        serviceId: serviceId as Id<'services'>,
        startTime: formatTime(startTime),
        endTime: formatTime(endTime),
      })
      showSuccess("You're all set. We'll be in touch within 24 hours.")
      return true
    } catch {
      showError("That didn't go through — let's try that again.")
      return false
    } finally {
      setIsRequesting(false)
    }
  }, [serviceId, dateRange, startTime, endTime, isRequesting, createReservation, showSuccess, showError])

  return {
    serviceId,
    setServiceId,
    dateRange,
    setDateRange,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    resetStartTime,
    resetEndTime,
    reset,
    isRequesting,
    autoConfirm,
    clearAutoConfirm,
    validate,
    submit,
  }
}
