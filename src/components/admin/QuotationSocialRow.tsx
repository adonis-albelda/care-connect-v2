import Image from 'next/image'

const SOCIAL = [
  { icon: '/images/icons/facebook.svg', label: 'Care Connect' },
  { icon: '/images/icons/twitter.svg', label: '@careconnectca' },
  { icon: '/images/icons/instagram.svg', label: 'Care Connect' },
]

// Matches quotation.pdf's repeated social-handle row on the cover and back
// cover pages.
export default function QuotationSocialRow() {
  return (
    <div className="mt-4 flex items-center justify-center gap-6">
      {SOCIAL.map((s) => (
        <span key={s.label + s.icon} className="flex items-center gap-1.5 text-xs text-slate">
          <Image src={s.icon} alt="" width={14} height={14} aria-hidden="true" />
          {s.label}
        </span>
      ))}
    </div>
  )
}
