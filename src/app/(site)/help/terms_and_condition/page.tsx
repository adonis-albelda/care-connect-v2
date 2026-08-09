export const metadata = { title: 'Terms & Conditions — Care Connect' }

const SECTIONS = [
  {
    id: 'acceptance',
    title: '1. Acceptance of these terms',
    body: [
      'By creating an account, requesting a quote, or booking a service through Care Connect, you agree to these Terms & Conditions. If you don’t agree with any part of them, please don’t use the site or our services.',
    ],
  },
  {
    id: 'services',
    title: '2. Our services',
    body: [
      'Care Connect provides in-home care — Home Support, Personal Care, and Complex Care — delivered by caregivers we directly employ and manage. We’re not a directory or marketplace connecting you to independent contractors; every caregiver you’re matched with is part of our own team.',
      'Pricing is a custom quote built around your family’s situation rather than fixed subscription tiers. A quote request does not itself create a booking — a member of our team follows up to confirm details before any service is scheduled.',
    ],
  },
  {
    id: 'accounts',
    title: '3. Your account',
    body: [
      'You’re responsible for the accuracy of the information you provide when creating an account, and for keeping your login credentials confidential. Let us know right away if you suspect unauthorized access to your account.',
      'You must be legally able to enter into agreements on behalf of yourself or the person you’re arranging care for.',
    ],
  },
  {
    id: 'bookings',
    title: '4. Bookings, changes & cancellations',
    body: [
      'Once you have an account, you can view and manage upcoming bookings directly. To change or cancel a booking, please give us as much notice as you reasonably can — this helps us keep caregivers available for other families.',
      'We’ll always confirm specific scheduling and cancellation terms with you before a booking is finalized.',
    ],
  },
  {
    id: 'payment',
    title: '5. Payment',
    body: [
      'Payment terms are confirmed as part of your individual quote. We’ll be transparent about costs before any service begins — no hidden fees.',
    ],
  },
  {
    id: 'conduct',
    title: '6. Caregiver conduct & safety',
    body: [
      'We take the safety and dignity of everyone in our clients’ homes seriously. If you ever have a concern about a caregiver’s conduct, please contact us directly so we can address it.',
    ],
  },
  {
    id: 'liability',
    title: '7. Limitation of liability',
    body: [
      'We work carefully to provide safe, reliable care, but as with any in-home service, we can’t guarantee an outcome for every situation. To the extent permitted by law, Care Connect’s liability is limited to the value of the services provided under your booking.',
    ],
  },
  {
    id: 'privacy',
    title: '8. Privacy',
    body: [
      'The personal and health-related information you share with us is used only to provide and coordinate your care, and to communicate with you about your account and bookings.',
    ],
  },
  {
    id: 'changes',
    title: '9. Changes to these terms',
    body: [
      'We may update these terms from time to time as our services evolve. If we make a material change, we’ll make a reasonable effort to let account holders know.',
    ],
  },
  {
    id: 'law',
    title: '10. Governing law',
    body: ['These terms are governed by the laws of the Province of Ontario, Canada.'],
  },
  {
    id: 'contact',
    title: '11. Contact us',
    body: [
      'Questions about these terms? Reach us at admin@ucarecon.ca or +1 647-882-6872.',
    ],
  },
]

export default function TermsPage() {
  return (
    <div>
      <h2 className="font-headline text-h2 text-connect-blue">Terms &amp; Conditions</h2>
      <p className="mt-2 text-body text-slate">Last updated August 2026</p>

      <nav aria-label="Table of contents" className="mt-6 rounded-2xl border border-border bg-cloud p-5">
        <p className="text-small font-semibold uppercase tracking-wide text-slate">On this page</p>
        <ol className="mt-3 grid gap-2 sm:grid-cols-2">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-body text-connect-blue hover:underline">
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-10 flex flex-col gap-10">
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-24">
            <h3 className="font-headline text-h3 text-ink">{s.title}</h3>
            <div className="mt-3 flex flex-col gap-3 text-body text-slate">
              {s.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
