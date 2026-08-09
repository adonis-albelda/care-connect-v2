import ServiceDetailBooking from '@/components/ServiceDetailBooking'

export const metadata = { title: 'Service Details — Care Connect' }

interface ServiceDetailsPageProps {
  searchParams: Promise<{ type?: string }>
}

export default async function ServiceDetailsPage({ searchParams }: ServiceDetailsPageProps) {
  const { type } = await searchParams
  return <ServiceDetailBooking slug={type} />
}
