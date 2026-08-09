import ServiceDetailLayout from '@/components/ServiceDetailLayout'

export const metadata = { title: 'Personal Care Services — Care Connect' }

export default function PersonalCarePage() {
  return (
    <ServiceDetailLayout
      banner="/images/personal-care-banner.png"
      title="Personal Care Services"
      description="Arthritis, physical disabilities, and age-related conditions are some of the few circumstances that prevent patients from caring for themselves. Our caregivers can assist you with daily tasks such as mobility, eating, exercising, and grooming."
      introLine="Personal care service includes assistance with the private activities of daily living such as:"
      bullets={[
        'Dressing',
        'Bathing',
        'Grooming',
        'Mobility',
        'Toileting',
        'Continence assistance',
        'Medication reminders',
        'Alzheimer & dementia support',
        'Overnight care',
      ]}
      footnote="Trained and certified Personal Support Workers provide all personal support services."
      quoteHref="/get-quote?service=personal-care-services"
    />
  )
}
