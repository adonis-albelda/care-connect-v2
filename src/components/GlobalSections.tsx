'use client'

import { useAuth } from '@/lib/auth-context'
import NewsletterSection from '@/components/NewsletterSection'
import TestimonialPrompt from '@/components/TestimonialPrompt'

export default function GlobalSections() {
  const { user } = useAuth()

  return (
    <>
      <NewsletterSection />
      {user && <TestimonialPrompt />}
    </>
  )
}
