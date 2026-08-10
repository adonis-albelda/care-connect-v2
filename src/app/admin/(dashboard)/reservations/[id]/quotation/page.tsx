import QuotationDocument from '@/components/admin/QuotationDocument'

export const metadata = { title: 'Quotation — Care Connect' }

interface QuotationPageProps {
  params: Promise<{ id: string }>
}

export default async function QuotationPage({ params }: QuotationPageProps) {
  const { id } = await params
  return <QuotationDocument reservationId={id} />
}
