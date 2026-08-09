'use client'

import { useState, type FormEvent } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@convex/_generated/api'
import { useToast } from '@/lib/toast-context'

export default function TestimonialPrompt() {
  const [testimonial, setTestimonial] = useState('')
  const [isRequesting, setIsRequesting] = useState(false)
  const { showSuccess, showError } = useToast()
  const createTestimonial = useMutation(api.testimonials.create)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (testimonial.trim().length < 10) {
      showError('Tell us a little more — at least 10 characters helps other families.')
      return
    }
    if (isRequesting) return
    setIsRequesting(true)

    try {
      await createTestimonial({ testimony: testimonial })
      showSuccess('Thank you for sharing — it means a lot to us.')
      setTestimonial('')
    } catch {
      showError("That didn't go through — let's try that again in a moment.")
    } finally {
      setIsRequesting(false)
    }
  }

  return (
    <section className="flex justify-center bg-connect-blue px-4 py-20 sm:px-6">
      <div className="w-full max-w-xl text-center">
        <h2 className="font-headline text-h1 text-white">Share your story</h2>
        <p className="mx-auto mt-3 max-w-[50ch] text-body-lg text-blue-light">
          Your experience helps other families feel confident about the care they choose.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl bg-white p-8 text-left shadow-card-hover"
        >
          <label htmlFor="testimonial" className="block text-body font-medium text-ink">
            Your thoughts
          </label>
          <textarea
            id="testimonial"
            value={testimonial}
            onChange={(e) => setTestimonial(e.target.value)}
            placeholder="Write your thoughts here..."
            rows={5}
            className="mt-2 w-full rounded-xl border border-border bg-cloud p-4 text-body text-ink placeholder:text-mist"
          />
          <button
            type="submit"
            disabled={!testimonial.length || isRequesting}
            className="mt-4 min-h-[48px] w-full rounded-xl bg-connect-blue text-body font-semibold text-white shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:bg-blue-deep hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isRequesting ? 'Submitting…' : 'Submit'}
          </button>
        </form>
      </div>
    </section>
  )
}
