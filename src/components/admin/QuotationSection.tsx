export default function QuotationSection({ title, body }: { title: string; body: string }) {
  return (
    <section className="border-b border-border py-6">
      <h2 className="font-headline text-h3 text-ink">{title}</h2>
      <div
        className="mt-3 text-body text-slate [&_li]:mb-1 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </section>
  )
}
