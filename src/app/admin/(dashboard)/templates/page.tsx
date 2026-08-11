'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useQuery, useMutation } from 'convex/react'
import { Printer } from 'lucide-react'
import { api } from '@convex/_generated/api'
import RichTextEditor from '@/components/admin/RichTextEditor'
import QuotationSection from '@/components/admin/QuotationSection'
import QuotationSocialRow from '@/components/admin/QuotationSocialRow'
import { isConvexConfigured } from '@/lib/convex-client'
import { QUOTATION_TEMPLATE_DEFAULTS, type QuotationTemplateFields } from '@/lib/quotationDefaults'

type FormState = QuotationTemplateFields

const SECTION_FIELDS: { key: 'intro' | 'staff' | 'homeSupport' | 'personalCare' | 'complexCare'; label: string }[] = [
  { key: 'intro', label: 'Company introduction' },
  { key: 'staff', label: 'Team / staff' },
  { key: 'homeSupport', label: 'Home support services' },
  { key: 'personalCare', label: 'Personal care services' },
  { key: 'complexCare', label: 'Complex care services' },
]

export default function TemplatesPage() {
  const template = useQuery(api.quotationTemplate.get, isConvexConfigured ? {} : 'skip')
  const updateTemplate = useMutation(api.quotationTemplate.update)

  if (!isConvexConfigured || template === undefined) {
    return (
      <div>
        <h1 className="font-headline text-h2 text-connect-blue">Templates</h1>
        <p className="mt-1 text-small text-slate">Loading…</p>
      </div>
    )
  }

  return <TemplateForm key={template?._id ?? 'new'} initial={template ?? QUOTATION_TEMPLATE_DEFAULTS} onSave={updateTemplate} />
}

function TemplateForm({
  initial,
  onSave,
}: {
  initial: FormState
  onSave: (fields: FormState) => Promise<unknown>
}) {
  const [form, setForm] = useState<FormState>(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (key: keyof FormState) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
    setSaved(false)
  }

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    setError(null)
    try {
      await onSave(form)
      setSaved(true)
    } catch {
      setError("That didn't save — try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 print:hidden">
        <div>
          <h1 className="font-headline text-h2 text-connect-blue">Templates</h1>
          <p className="mt-1 text-small text-slate">
            Boilerplate text used on the printed quotation document — the quoted service and pricing come from the reservation itself.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex min-h-[44px] items-center gap-2 rounded-xl bg-connect-blue px-5 text-small font-semibold text-white shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:bg-blue-deep hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving…' : saved ? 'Saved' : 'Save changes'}
        </button>
      </div>

      {error && (
        <p className="mt-4 text-small text-error print:hidden" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="max-w-2xl rounded-2xl border border-border bg-white p-6 shadow-card print:hidden sm:p-8">
          {SECTION_FIELDS.map(({ key, label }, i) => {
            const titleKey = `${key}Title` as keyof FormState
            const bodyKey = `${key}Body` as keyof FormState
            return (
              <div key={key} className={i > 0 ? 'mt-8' : undefined}>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate">{label}</p>
                <label className="mt-3 flex flex-col gap-1.5">
                  <span className="text-small font-medium text-ink">Section title</span>
                  <input
                    value={form[titleKey]}
                    onChange={(e) => set(titleKey)(e.target.value)}
                    className="min-h-[44px] rounded-lg border border-border px-3 text-small text-ink focus:border-connect-blue focus:outline-none"
                  />
                </label>
                <div className="mt-4">
                  <span className="text-small font-medium text-ink">Body</span>
                  <div className="mt-1.5">
                    <RichTextEditor value={form[bodyKey]} onChange={set(bodyKey)} minHeightRem={7} />
                  </div>
                </div>
              </div>
            )
          })}

          <p className="mt-8 text-xs font-semibold uppercase tracking-wide text-slate">Contact footer</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-small font-medium text-ink">Email</span>
              <input
                value={form.contactEmail}
                onChange={(e) => set('contactEmail')(e.target.value)}
                className="min-h-[44px] rounded-lg border border-border px-3 text-small text-ink focus:border-connect-blue focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-small font-medium text-ink">Phone</span>
              <input
                value={form.contactPhone}
                onChange={(e) => set('contactPhone')(e.target.value)}
                className="min-h-[44px] rounded-lg border border-border px-3 text-small text-ink focus:border-connect-blue focus:outline-none"
              />
            </label>
          </div>
          <label className="mt-4 flex flex-col gap-1.5">
            <span className="text-small font-medium text-ink">Address</span>
            <input
              value={form.contactAddress}
              onChange={(e) => set('contactAddress')(e.target.value)}
              className="min-h-[44px] rounded-lg border border-border px-3 text-small text-ink focus:border-connect-blue focus:outline-none"
            />
          </label>
          <label className="mt-4 flex flex-col gap-1.5">
            <span className="text-small font-medium text-ink">Footer tagline</span>
            <input
              value={form.footerNote}
              onChange={(e) => set('footerNote')(e.target.value)}
              className="min-h-[44px] rounded-lg border border-border px-3 text-small text-ink focus:border-connect-blue focus:outline-none"
            />
          </label>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="mb-3 flex items-center justify-between print:hidden">
            <p className="text-small font-medium text-ink">Preview</p>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex min-h-[40px] items-center gap-2 rounded-lg border border-border px-3 text-xs font-semibold text-slate transition-colors duration-250 hover:border-connect-blue hover:text-connect-blue"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              Download preview
            </button>
          </div>
          <TemplatePreview form={form} />
        </div>
      </div>
    </div>
  )
}

function TemplatePreview({ form }: { form: FormState }) {
  return (
    <article className="rounded-2xl border border-border bg-white p-8 text-ink shadow-card print:rounded-none print:border-none print:p-0 print:shadow-none">
      <header className="flex items-center justify-between border-b border-border pb-6">
        <Image src="/images/pdf-logo.png" alt="Care Connect — Care That Comes to You" width={144} height={38} className="h-auto w-32" />
        <div className="text-right">
          <p className="font-headline text-h3 text-ink">Quotation</p>
          <p className="text-small text-slate">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </header>

      <QuotationSection title={form.introTitle} body={form.introBody} />
      <QuotationSection title={form.staffTitle} body={form.staffBody} />
      <QuotationSection title={form.homeSupportTitle} body={form.homeSupportBody} />
      <QuotationSection title={form.personalCareTitle} body={form.personalCareBody} />
      <QuotationSection title={form.complexCareTitle} body={form.complexCareBody} />

      <footer className="pt-6 text-center text-small text-slate">
        <p className="font-medium text-ink">Care Connect — {form.footerNote}</p>
        <p className="mt-1">
          {form.contactEmail} · {form.contactPhone}
        </p>
        <p>{form.contactAddress}</p>
        <QuotationSocialRow />
      </footer>
    </article>
  )
}
