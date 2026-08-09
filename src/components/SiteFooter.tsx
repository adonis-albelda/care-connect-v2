import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, type LucideIcon } from 'lucide-react'
import { FooterColumn } from '@/components/ui/footer-column'

const SERVICE_LINKS = [
  { href: '/home-care', label: 'Home Support Services' },
  { href: '/personal-care', label: 'Personal Care Services' },
  { href: '/complex-care', label: 'Complex Care Services' },
]

const HELP_LINKS = [
  { href: '/help', label: 'Help' },
  { href: '/help/faq', label: 'F.A.Q.' },
  { href: '/help/terms_and_condition', label: 'Terms & Conditions' },
]

const SOCIAL_LINKS = [
  { href: 'https://facebook.com', icon: '/images/icons/facebook.svg', label: 'Care Connect on Facebook' },
  { href: 'https://twitter.com', icon: '/images/icons/twitter.svg', label: '@careconnectca on Twitter' },
  { href: 'https://instagram.com', icon: '/images/icons/instagram.svg', label: 'Care Connect on Instagram' },
]

function IconChip({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-white/10">
      <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
    </span>
  )
}

export default function SiteFooter() {
  return (
    <footer className="bg-gradient-to-br from-connect-blue to-blue-deep text-white">
      <div className="mx-auto grid max-w-content gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.2fr_2fr]">
        <div className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
          <Image src="/images/logo.png" alt="Care Connect logo" width={48} height={48} />
          <p className="font-headline text-h3">Care Connect</p>
          <p className="text-body text-blue-light">Care That Comes to You</p>

          <ul className="mt-3 flex items-center gap-3">
            {SOCIAL_LINKS.map(({ href, icon, label }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 transition-colors duration-250 hover:bg-white/20"
                >
                  <span className="sr-only">{label}</span>
                  <Image src={icon} alt="" width={18} height={18} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          <FooterColumn title="Services">
            {SERVICE_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex min-h-[44px] items-center text-body text-blue-light transition-colors duration-250 hover:text-white hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Contact Us">
            <li>
              <a
                href="mailto:admin@ucarecon.ca"
                className="flex min-h-[44px] items-center gap-3 text-body text-blue-light transition-colors duration-250 hover:text-white hover:underline"
              >
                <IconChip icon={Mail} />
                admin@ucarecon.ca
              </a>
            </li>
            <li>
              <a
                href="tel:+16478826872"
                className="flex min-h-[44px] items-center gap-3 text-body text-blue-light transition-colors duration-250 hover:text-white hover:underline"
              >
                <IconChip icon={Phone} />
                + 647-882-6872
              </a>
            </li>
            <li className="flex items-center gap-3 text-body text-blue-light">
              <IconChip icon={MapPin} />
              <span>120 Shelborne North York On. Canada M6B 1M7</span>
            </li>
          </FooterColumn>

          <FooterColumn title="Helpful Links">
            {HELP_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex min-h-[44px] items-center text-body text-blue-light transition-colors duration-250 hover:text-white hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </FooterColumn>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto max-w-content px-4 py-6 text-center text-small text-blue-light sm:px-6 sm:text-left">
          <p>Copyright © {new Date().getFullYear()} Care Connect — All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
