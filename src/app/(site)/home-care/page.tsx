import ServiceDetailLayout from '@/components/ServiceDetailLayout'

export const metadata = { title: 'Home Support Services — Care Connect' }

export default function HomeCarePage() {
  return (
    <ServiceDetailLayout
      banner="/images/hom_support_services_banner.jpg"
      title="Home Support Services"
      description="Recovering from home after surgery can limit you with your daily activities. Whether you are recovering from major surgery, childbirth, or plastic surgery, our compassionate caregivers can assist you to a healthy and complete recovery."
      introLine="Home Support Services include assistance with day-to-day activities such as:"
      bullets={[
        'Light housekeeping & laundry',
        'Meal preparation & planning',
        'Companionship and community outings',
        'Light yard work',
        'Grocery shopping',
        'Errands',
        'Accompaniment to doctor or other health care appointments',
        'Pet care',
        'Incidental transportation',
        'Home safety',
        'Sorting mail',
        'Cleaning out cupboards',
        'Regular fridge cleaning to ensure food is fresh',
        'Coordination of home and yard repair or maintenance services',
        'Coordination for installation of in-home assistive devices',
        'Coordination of services and referrals to other community agencies if required',
      ]}
      footnote="We offer the option of live-in caregivers for short or long term placements."
      quoteHref="/get-quote?service=home-support-services"
    />
  )
}
