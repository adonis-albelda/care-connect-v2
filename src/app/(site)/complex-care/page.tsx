import ServiceDetailLayout from '@/components/ServiceDetailLayout'

export const metadata = { title: 'Complex Care Services — Care Connect' }

export default function ComplexCarePage() {
  return (
    <ServiceDetailLayout
      banner="/images/complex_care_services_banner.jpg"
      title="Complex Care Services"
      description="Our experienced and highly trained caregivers provide the highest quality of care to both patients and their families. Our goal is to help individuals and their loved ones live happy and fulfilling lives."
      introLine="Complex care refers to services that must be performed by regulated health professionals, such as a Registered Nurse or a Registered Practical Nurse. These services include:"
      bullets={[
        'Medication administration',
        'Vital signs monitoring',
        'Wound care',
        'Catheter care',
        'Foot care',
        'Ostomy care',
        'Palliative care',
      ]}
      quoteHref="/get-quote?service=complex-care-services"
    />
  )
}
