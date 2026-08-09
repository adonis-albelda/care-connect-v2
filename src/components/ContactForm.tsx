'use client'

import { useState, type FormEvent } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@convex/_generated/api'
import FormField, { inputClass } from '@/components/FormField'
import { useToast } from '@/lib/toast-context'
import type { InquiryPayload } from '@/lib/types'

const INITIAL: InquiryPayload = {
  first_name: '',
  last_name: '',
  email_address: '',
  phone_number: '',
  message: '',
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function ContactForm() {
  const { showSuccess, showError } = useToast()
  const createInquiry = useMutation(api.inquiries.create)
  const [inquiry, setInquiry] = useState<InquiryPayload>(INITIAL)
  const [errors, setErrors] = useState<Partial<Record<keyof InquiryPayload, string>>>({})
  const [isRequesting, setIsRequesting] = useState(false)

  const update = (field: keyof InquiryPayload) => (value: string) => setInquiry((i) => ({ ...i, [field]: value }))

  const validate = () => {
    const next: Partial<Record<keyof InquiryPayload, string>> = {}
    if (!inquiry.first_name) next.first_name = 'Add your name.'
    if (!inquiry.email_address) next.email_address = 'Add your email address.'
    else if (!isValidEmail(inquiry.email_address)) next.email_address = "That doesn't look like a full email — check for a typo."
    if (!inquiry.message) next.message = 'Let us know what you need help with.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate() || isRequesting) return
    setIsRequesting(true)

    try {
      await createInquiry({
        firstName: inquiry.first_name,
        lastName: inquiry.last_name || undefined,
        emailAddress: inquiry.email_address,
        phoneNumber: inquiry.phone_number,
        message: inquiry.message,
      })
      showSuccess("Successfully submitted your inquiry — we'll contact you soon!")
      setInquiry(INITIAL)
      setErrors({})
    } catch {
      showError("That didn't go through — let's try that again.")
    } finally {
      setIsRequesting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="first_name" label="First name" required error={errors.first_name}>
          <input
            id="first_name"
            value={inquiry.first_name}
            onChange={(e) => update('first_name')(e.target.value)}
            placeholder="First name"
            className={inputClass(!!errors.first_name)}
          />
        </FormField>
        <FormField id="last_name" label="Last name">
          <input
            id="last_name"
            value={inquiry.last_name}
            onChange={(e) => update('last_name')(e.target.value)}
            placeholder="Last name"
            className={inputClass(false)}
          />
        </FormField>
      </div>

      <FormField id="email_address" label="Email Address" required error={errors.email_address}>
        <input
          id="email_address"
          type="email"
          value={inquiry.email_address}
          onChange={(e) => update('email_address')(e.target.value)}
          placeholder="@mail.com"
          className={inputClass(!!errors.email_address)}
        />
      </FormField>

      <FormField id="phone_number" label="Phone number" error={errors.phone_number}>
        <input
          id="phone_number"
          type="tel"
          value={inquiry.phone_number}
          onChange={(e) => update('phone_number')(e.target.value)}
          placeholder="0000 0000 000000"
          className={inputClass(!!errors.phone_number)}
        />
      </FormField>

      <FormField id="message" label="Message" required error={errors.message}>
        <textarea
          id="message"
          value={inquiry.message}
          onChange={(e) => update('message')(e.target.value)}
          placeholder="Hello..."
          rows={5}
          className={inputClass(!!errors.message)}
        />
      </FormField>

      <button
        type="submit"
        disabled={isRequesting}
        className="min-h-[48px] rounded-xl bg-connect-blue text-body font-semibold text-white shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:bg-blue-deep hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {isRequesting ? 'Sending…' : 'Send'}
      </button>
    </form>
  )
}
