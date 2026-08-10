'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useQuery, useMutation } from 'convex/react'
import { Printer } from 'lucide-react'
import { api } from '@convex/_generated/api'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { isConvexConfigured } from '@/lib/convex-client'

interface FormState {
  introTitle: string
  introBody: string
  staffTitle: string
  staffBody: string
  contactEmail: string
  contactPhone: string
  contactAddress: string
  footerNote: string
}

// Seeded from quotation.pdf so a first-time admin edits real content
// instead of starting from a blank placeholder.
const DEFAULTS: FormState = {
  introTitle: 'Who we are',
  introBody: `
<p>CCHAHS is an affordable solution for the elderly throughout the community, who prefer to stay at home where they can have enhanced quality of life without enduring the challenge of interrupted routines and changes in daily habits with a move to a care facility.</p>
<p>Our part-time, full-time, and around the clock services are designed for people who choose to live independently, but need support in their home in order to do so. These services may include companionship, meal preparation, medication reminders, light housekeeping, and help with errands and shopping.</p>
<p>Sometimes more specialized care is required to remain safe at home. If services of a regulated health care professional are required such as a registered nurse, one can be assigned to provide services. These services may include foot care, medication management, Alzheimer care, diabetic management, palliative care, and wound care.</p>
<p>CCHAHS stands out from the competition because we are locally owned and operated and dedicated to serving the community where we live.</p>
<p>CCHAHS services allow more flexibility to clients as they offer competitive rates for all levels of service for quality care provided by qualified staff.</p>
`.trim(),
  staffTitle: 'Staff',
  staffBody: `
<p><strong>Mrs. B. Elmido — Owner</strong></p>
<p>Mrs. Elmido is responsible for the management of CCHAHS and dedicates 100% of her time to the business. Responsibilities include office management, sales and marketing, payroll, general accounting, scheduling, employee hiring and background checks, client assessments, writing customer reports, and presenting CCHAHS services to local health-related facilities and senior health care organizations.</p>
<p>Mrs. Elmido has a natural aptitude for business, inherent leadership abilities, strong interpersonal skills, and a passion for serving customers, and is responsible for conducting customer needs assessments and maintaining customer satisfaction quality conformance.</p>
<p><strong>Ms. Christina Rojas — Technical Advisor</strong></p>
<p>Ms. Rojas assists in office administration including client assessments, payroll, general accounting, scheduling, employee background checks, and writing customer reports.</p>
<p>Ms. Rojas has been in the medical profession as a Health Care Aide since 2010, bringing experience and expertise in caring for seniors.</p>
`.trim(),
  contactEmail: 'admin@ucarecon.ca',
  contactPhone: '416-262-4071',
  contactAddress: '120 Shelborne North York On. Canada M6B 1M7',
  footerNote: 'Care that comes to you',
}

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

  return <TemplateForm key={template?._id ?? 'new'} initial={template ?? DEFAULTS} onSave={updateTemplate} />
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
          <p className="text-xs font-semibold uppercase tracking-wide text-slate">Company introduction</p>
          <label className="mt-3 flex flex-col gap-1.5">
            <span className="text-small font-medium text-ink">Section title</span>
            <input
              value={form.introTitle}
              onChange={(e) => set('introTitle')(e.target.value)}
              className="min-h-[44px] rounded-lg border border-border px-3 text-small text-ink focus:border-connect-blue focus:outline-none"
            />
          </label>
          <div className="mt-4">
            <span className="text-small font-medium text-ink">Body</span>
            <div className="mt-1.5">
              <RichTextEditor value={form.introBody} onChange={set('introBody')} minHeightRem={7} />
            </div>
          </div>

          <p className="mt-8 text-xs font-semibold uppercase tracking-wide text-slate">Team / staff</p>
          <label className="mt-3 flex flex-col gap-1.5">
            <span className="text-small font-medium text-ink">Section title</span>
            <input
              value={form.staffTitle}
              onChange={(e) => set('staffTitle')(e.target.value)}
              className="min-h-[44px] rounded-lg border border-border px-3 text-small text-ink focus:border-connect-blue focus:outline-none"
            />
          </label>
          <div className="mt-4">
            <span className="text-small font-medium text-ink">Body</span>
            <div className="mt-1.5">
              <RichTextEditor value={form.staffBody} onChange={set('staffBody')} minHeightRem={7} />
            </div>
          </div>

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

      <section className="border-b border-border py-6">
        <h2 className="font-headline text-h3 text-ink">{form.introTitle}</h2>
        <div
          className="mt-3 text-small text-slate [&_p]:mb-3 [&_p:last-child]:mb-0"
          dangerouslySetInnerHTML={{ __html: form.introBody }}
        />
      </section>

      <section className="border-b border-border py-6">
        <h2 className="font-headline text-h3 text-ink">{form.staffTitle}</h2>
        <div
          className="mt-3 text-small text-slate [&_p]:mb-3 [&_p:last-child]:mb-0"
          dangerouslySetInnerHTML={{ __html: form.staffBody }}
        />
      </section>

      <footer className="pt-6 text-center text-small text-slate">
        <p className="font-medium text-ink">Care Connect — {form.footerNote}</p>
        <p className="mt-1">
          {form.contactEmail} · {form.contactPhone}
        </p>
        <p>{form.contactAddress}</p>
      </footer>
    </article>
  )
}
