import GetQuoteForm from '@/components/GetQuoteForm'

export const metadata = { title: 'Get a Quote — Care Connect' }

interface GetQuotePageProps {
  searchParams: Promise<{ service?: string }>
}

export default async function GetQuotePage({ searchParams }: GetQuotePageProps) {
  const { service } = await searchParams

  return <GetQuoteForm preselectServiceSlug={service ?? null} />
}
