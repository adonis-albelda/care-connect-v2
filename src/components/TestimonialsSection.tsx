'use client'

import Reveal from '@/components/Reveal'
import { TestimonialsColumn, type TestimonialColumnItem } from '@/components/ui/testimonials-columns-1'
import { useTestimonialsQuery } from '@/hooks/useTestimonialsQuery'

const WORD_LIMIT = 22
// The API only returns id, client_name, and message — "role" isn't part of the
// testimonial record yet, so it's a static placeholder until the API adds it.
const STATIC_ROLE = 'Care Connect Client'

function capWords(text: string, limit: number) {
  const words = text.trim().split(/\s+/)
  if (words.length <= limit) return text.trim()
  return `${words.slice(0, limit).join(' ')}…`
}

function splitIntoColumns(items: TestimonialColumnItem[], columns: number) {
  const result: TestimonialColumnItem[][] = Array.from({ length: columns }, () => [])
  items.forEach((item, i) => result[i % columns].push(item))
  return result
}

function TestimonialsSkeleton() {
  return (
    <div className="mt-10 flex max-h-[740px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
      {[0, 1, 2].map((col) => (
        <div key={col} className={`flex flex-col gap-6 ${col === 1 ? 'hidden md:flex' : ''} ${col === 2 ? 'hidden lg:flex' : ''}`}>
          {[0, 1, 2].map((row) => (
            <div key={row} className="w-80 flex-none animate-pulse rounded-2xl bg-white/10 p-8">
              <div className="h-4 w-full rounded-md bg-white/20" />
              <div className="mt-2 h-4 w-4/5 rounded-md bg-white/20" />
              <div className="mt-2 h-4 w-3/5 rounded-md bg-white/20" />
              <div className="mt-5 flex items-center gap-3">
                <div className="h-10 w-10 flex-none rounded-full bg-white/20" />
                <div className="flex flex-col gap-2">
                  <div className="h-3 w-24 rounded-md bg-white/20" />
                  <div className="h-3 w-32 rounded-md bg-white/20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const { data: testimonials = [], isLoading } = useTestimonialsQuery()

  if (isLoading) {
    return (
      <section className="bg-gradient-to-br from-connect-blue to-blue-deep px-4 py-12 text-white sm:px-6 sm:py-20">
        <div className="mx-auto max-w-content">
          <Reveal as="h2" className="font-headline text-h1">
            What Our Clients Say
          </Reveal>
          <Reveal as="p" className="mt-3 max-w-[60ch] text-body-lg text-blue-light">
            Every message here is read by our team — these stories are what keep us motivated.
          </Reveal>
          <span className="sr-only">Loading testimonials…</span>
          <div aria-hidden="true">
            <TestimonialsSkeleton />
          </div>
        </div>
      </section>
    )
  }

  if (!testimonials.length) return null

  const items: TestimonialColumnItem[] = testimonials.map((testimonial) => ({
    id: testimonial.id,
    text: capWords(testimonial.message, WORD_LIMIT),
    name: testimonial.client_name,
    role: STATIC_ROLE,
  }))

  const [firstColumn, secondColumn, thirdColumn] = splitIntoColumns(items, 3)

  return (
    <section className="bg-gradient-to-br from-connect-blue to-blue-deep px-4 py-12 text-white sm:px-6 sm:py-20">
      <div className="mx-auto max-w-content">
        <Reveal as="h2" className="font-headline text-h1">
          What Our Clients Say
        </Reveal>
        <Reveal as="p" className="mt-3 max-w-[60ch] text-body-lg text-blue-light">
          Every message here is read by our team — these stories are what keep us motivated.
        </Reveal>

        <div className="mt-10 flex max-h-[740px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} duration={19} className="hidden md:block" />
          <TestimonialsColumn testimonials={thirdColumn} duration={17} className="hidden lg:block" />
        </div>
      </div>
    </section>
  )
}
