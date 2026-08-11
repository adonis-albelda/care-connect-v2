'use client'

import { useMutation } from 'convex/react'
import { Check, Clock } from 'lucide-react'
import { api } from '@convex/_generated/api'
import type { Doc } from '@convex/_generated/dataModel'
import ConfirmButton from '@/components/admin/ConfirmButton'

export default function TestimonialStatusToggle({ testimonial }: { testimonial: Doc<'testimonials'> }) {
  const setStatus = useMutation(api.testimonials.setStatus)
  const approved = testimonial.status === 'approved'

  const toggle = () => setStatus({ id: testimonial._id, status: approved ? 'pending' : 'approved' })
  const preview = testimonial.testimony.length > 140 ? `${testimonial.testimony.slice(0, 140)}…` : testimonial.testimony

  return (
    <ConfirmButton
      onConfirm={toggle}
      title={approved ? 'Move back to pending?' : 'Approve this testimonial?'}
      description={
        approved
          ? "It'll be removed from the public testimonials section right away."
          : "It'll show up in the public testimonials section right away, in the client's own words."
      }
      details={[`From ${testimonial.clientName ?? 'a client'}: “${preview}”`]}
      tone={approved ? 'warning' : 'default'}
      confirmLabel={approved ? 'Yes, unapprove' : 'Yes, approve'}
      busyLabel="Updating…"
      stopPropagation
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors duration-250 disabled:cursor-not-allowed disabled:opacity-60 ${
        approved ? 'bg-blue-light text-connect-blue hover:bg-blue-light/70' : 'bg-cloud text-slate hover:bg-border'
      }`}
    >
      {approved ? <Check className="h-3 w-3" aria-hidden="true" /> : <Clock className="h-3 w-3" aria-hidden="true" />}
      {approved ? 'Approved' : 'Pending'}
    </ConfirmButton>
  )
}
