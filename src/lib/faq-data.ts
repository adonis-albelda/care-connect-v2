export interface FaqItem {
  question: string
  answer: string
}

export const FAQS: FaqItem[] = [
  {
    question: 'What areas do you serve?',
    answer: 'We currently provide in-home care across the Greater Toronto Area. Enter your details in a quote request and we’ll confirm coverage for your address.',
  },
  {
    question: 'Are your caregivers employed by Care Connect, or contracted out?',
    answer: 'Every caregiver is directly employed and managed by Care Connect — we’re not a directory or marketplace connecting you to independent contractors. That means consistent training, accountability, and one team to call if anything needs to change.',
  },
  {
    question: 'How does getting a quote actually work?',
    answer: 'Choose a service, your dates, and a start and end time, and submit the request — no account needed to start. We follow up with a custom quote built around your family’s situation. We don’t use fixed pricing tiers, since every care plan looks different.',
  },
  {
    question: 'What’s the difference between Home Support, Personal Care, and Complex Care?',
    answer: 'Home Support covers everyday household help — meal prep, light housekeeping, companionship. Personal Care adds hands-on assistance with daily living, like bathing, dressing, and mobility. Complex Care is for higher-need situations — recovery, chronic conditions, or rehabilitation — that call for more experienced support.',
  },
  {
    question: 'Do you offer live-in caregivers?',
    answer: 'Yes — live-in care is available for both short and long term placements, in addition to scheduled visits.',
  },
  {
    question: 'Can I change or cancel a scheduled booking?',
    answer: 'Yes. Once you have an account you can manage upcoming bookings directly, or reach out to our team and we’ll take care of it — just try to give us as much notice as you can.',
  },
  {
    question: 'Is there a minimum number of hours per visit?',
    answer: 'It depends on the service and the care plan we build with you. Your quote will spell out exactly what’s included before you commit to anything.',
  },
  {
    question: 'How do I get started?',
    answer: 'Submit a quote request for the service you need, or create an account first if you’d like to save your details for future bookings. Either way, a real person follows up — no automated runaround.',
  },
]
