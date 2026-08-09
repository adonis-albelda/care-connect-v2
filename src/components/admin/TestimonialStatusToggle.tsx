'use client'

import { useState } from 'react'
import { useMutation } from 'convex/react'
import { Check, Clock } from 'lucide-react'
import { api } from '@convex/_generated/api'
import type { Doc } from '@convex/_generated/dataModel'

export default function TestimonialStatusToggle({ testimonial }: { testimonial: Doc<'testimonials'> }) {
  const setStatus = useMutation(api.testimonials.setStatus)
  const [pending, setPending] = useState(false)
  const approved = testimonial.status === 'approved'

  const toggle = async () => {
    if (pending) return
    setPending(true)
    try {
      await setStatus({ id: testimonial._id, status: approved ? 'pending' : 'approved' })
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        toggle()
      }}
      disabled={pending}
      title={approved ? 'Click to move back to pending' : 'Click to approve'}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors duration-250 disabled:cursor-not-allowed disabled:opacity-60 ${
        approved ? 'bg-blue-light text-connect-blue hover:bg-blue-light/70' : 'bg-cloud text-slate hover:bg-border'
      }`}
    >
      {approved ? <Check className="h-3 w-3" aria-hidden="true" /> : <Clock className="h-3 w-3" aria-hidden="true" />}
      {pending ? 'Updating…' : approved ? 'Approved' : 'Pending'}
    </button>
  )
}
