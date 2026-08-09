import FaqAccordion from '@/components/FaqAccordion'
import { FAQS } from '@/lib/faq-data'

export const metadata = { title: 'F.A.Q. — Care Connect' }

export default function FaqPage() {
  return (
    <div>
      <h2 className="font-headline text-h2 text-connect-blue">Frequently Asked Questions</h2>
      <div className="mt-8">
        <FaqAccordion items={FAQS} />
      </div>
    </div>
  )
}
