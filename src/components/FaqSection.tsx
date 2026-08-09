import Link from 'next/link'
import Reveal from '@/components/Reveal'
import FaqAccordion from '@/components/FaqAccordion'
import { FAQS } from '@/lib/faq-data'

const HOMEPAGE_LIMIT = 4

export default function FaqSection() {
  const preview = FAQS.slice(0, HOMEPAGE_LIMIT)

  return (
    <section className="bg-cloud px-4 py-12 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-content">
        <Reveal as="div" className="max-w-[65ch]">
          <h2 className="font-headline text-h1 text-connect-blue">Common questions</h2>
          <p className="mt-3 text-body-lg text-slate">
            A few things families usually ask before getting started. Tap a question to expand it.
          </p>
        </Reveal>

        <Reveal as="div" className="mt-10" delay={100}>
          <FaqAccordion items={preview} className="grid gap-4 sm:grid-cols-2" />
        </Reveal>

        <Reveal as="div" delay={150}>
          <Link
            href="/help/faq"
            className="mt-6 inline-flex min-h-[44px] items-center text-body font-medium text-connect-blue underline-offset-4 hover:underline"
          >
            View all FAQs
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
