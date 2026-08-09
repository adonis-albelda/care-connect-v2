import Image from 'next/image'
import Reveal from '@/components/Reveal'

export default function NewsletterSection() {
  return (
    <section className="bg-cloud px-4 py-12 sm:px-6 sm:py-20">
      <Reveal
        className="mx-auto flex max-w-content flex-col items-start gap-8 rounded-2xl bg-gradient-to-br from-connect-blue to-blue-deep p-8 shadow-card transition-shadow duration-250 hover:shadow-card-hover sm:p-10 md:flex-row md:items-center md:justify-between"
      >
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-white/10">
            <Image src="/images/icons/mail-white.svg" alt="" width={22} height={22} aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-headline text-h2 text-white">Stay in the loop</h2>
            <p className="mt-2 max-w-[60ch] text-body-lg text-blue-light">
              Sign up to hear from us about specials, sales, and events.
            </p>
          </div>
        </div>
        <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            placeholder="you@example.com"
            className="min-h-[48px] flex-1 rounded-xl border border-white/20 bg-white/10 px-4 text-body text-white placeholder:text-blue-light"
          />
          <button
            type="submit"
            className="min-h-[44px] rounded-xl bg-white px-6 text-body font-semibold text-connect-blue shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:bg-blue-light hover:shadow-card-hover"
          >
            Subscribe
          </button>
        </form>
      </Reveal>
    </section>
  )
}
