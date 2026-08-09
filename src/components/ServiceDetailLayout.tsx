import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import Reveal from '@/components/Reveal'

interface ServiceDetailLayoutProps {
  banner?: string
  title: string
  description?: string
  introLine?: string
  bullets?: string[]
  footnote?: string
  quoteHref?: string
}

export default function ServiceDetailLayout({ banner, title, description, introLine, bullets, footnote, quoteHref }: ServiceDetailLayoutProps) {
  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6">
      <Link href="/" className="inline-flex min-h-[44px] items-center gap-2 text-body font-medium text-connect-blue hover:underline">
        <span aria-hidden="true">←</span> Back
      </Link>

      <Reveal className="group mt-6 overflow-hidden rounded-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={banner}
          alt=""
          className="h-64 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 sm:h-80"
        />
      </Reveal>

      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_2fr]">
        <Reveal>
          <h1 className="font-headline text-h1 text-connect-blue">{title}</h1>
          <p className="mt-3 text-body text-slate">
            Everything below is what&rsquo;s included in this plan — request a quote and we&rsquo;ll tailor it to your family&rsquo;s situation.
          </p>
          {bullets?.length ? (
            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-light px-3 py-1 text-small font-semibold text-connect-blue">
              {bullets.length} activities included
            </span>
          ) : null}
        </Reveal>

        <Reveal delay={100}>
          <p className="text-body-lg text-slate">{description}</p>

          {introLine && (
            <p
              className="mt-6 font-headline text-h3 text-ink"
              dangerouslySetInnerHTML={{ __html: introLine }}
            />
          )}

          {bullets?.length > 0 && (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2 text-body text-ink">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-success" aria-hidden="true" />
                  {bullet}
                </li>
              ))}
            </ul>
          )}

          {footnote && <p className="mt-6 text-body text-slate">{footnote}</p>}

          <Link
            href={quoteHref ?? '/services'}
            className="mt-8 flex min-h-[48px] w-full items-center justify-center rounded-xl bg-connect-blue px-8 text-body font-semibold text-white shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:bg-blue-deep hover:shadow-card-hover sm:w-auto"
          >
            Get A Quote
          </Link>
        </Reveal>
      </div>
    </div>
  )
}
