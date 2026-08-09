import Image from 'next/image'
import { Mail, Phone, MapPin, type LucideIcon } from 'lucide-react'
import Reveal from '@/components/Reveal'
import ContactForm from '@/components/ContactForm'

export const metadata = { title: 'Contact Us — Care Connect' }

const ADDRESS = '120 Shelborne North York On. Canada M6B 1M7'

function ContactRow({
  href,
  icon: Icon,
  children,
}: {
  href: string
  icon: LucideIcon
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="flex min-h-[44px] items-center gap-3 text-body font-medium text-ink transition-colors duration-250 hover:text-connect-blue"
    >
      <Icon aria-hidden="true" className="h-5 w-5 flex-none" />
      {children}
    </a>
  )
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-content px-4 py-16 sm:px-6">
      <div className="grid gap-12 md:grid-cols-2">
        <Reveal className="group relative min-h-[520px] overflow-hidden">
          <Image
            src="/images/paper-plane.png"
            alt=""
            fill
            aria-hidden="true"
            className="object-cover opacity-70 transition-transform duration-500 ease-out group-hover:scale-110"
          />

          <div className="relative">
            <h1 className="font-headline text-h1 text-connect-blue">Contact Us</h1>
            <p className="mt-3 max-w-[50ch] text-body-lg text-slate">
              Let us know about your questions or concerns. We&rsquo;ll get back to you as soon as we can.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <ContactRow href="mailto:admin@ucarecon.ca" icon={Mail}>
                admin@ucarecon.ca
              </ContactRow>
              <ContactRow href="tel:+16478826872" icon={Phone}>
                647-882-6872
              </ContactRow>
              <ContactRow
                href={`https://maps.google.com/?q=${encodeURIComponent(ADDRESS)}`}
                icon={MapPin}
              >
                {ADDRESS}
              </ContactRow>
            </div>

            <div className="mt-4">
              <iframe
                title="Care Connect location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-56 w-full border-0"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={100} className="rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8">
          <h2 className="font-headline text-h3 text-ink">Send us a message</h2>
          <p className="mt-1 text-body text-slate">Fill out the form and our team will follow up directly.</p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </div>
  )
}
