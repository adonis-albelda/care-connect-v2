'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from 'convex/react'
import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/lib/toast-context'
import type { TimeValue, DateRangeValue } from '@/lib/types'

const DEFAULT_TIME: TimeValue = { hour: '09', minutes: '00', period: 'AM' }

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

  const resetStartTime = useCallback(() => setStartTime(DEFAULT_TIME), [])
  const resetEndTime = useCallback(() => setEndTime({ ...DEFAULT_TIME, period: 'PM' }), [])

  const formatTime = (t: TimeValue) => `${t.hour}:${t.minutes} ${t.period}`

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
      router.push('/login')
      return false
    }
    return true
  }, [serviceId, dateRange, user, router, showError])

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
    isRequesting,
    validate,
    submit,
  }
}
