import Hero from '@/components/Hero'
import QuoteWidget from '@/components/QuoteWidget'
import ServicesSection from '@/components/ServicesSection'
import TrustSection from '@/components/TrustSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import FaqSection from '@/components/FaqSection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="relative -mt-16 px-4 pb-4 sm:px-6">
        <QuoteWidget />
      </div>
      <ServicesSection />
      <TrustSection />
      <TestimonialsSection />
      <FaqSection />
    </>
  )
}
