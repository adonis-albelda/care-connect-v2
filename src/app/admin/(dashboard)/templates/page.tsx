'use client'

import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
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

const DEFAULTS: FormState = {
  introTitle: 'Who we are',
  introBody:
    '<p>Care Connect is an affordable solution for the elderly throughout the community, who prefer to stay at home where they can have an enhanced quality of life.</p>',
  staffTitle: 'Our team',
  staffBody: '<p>Introduce the people behind Care Connect here.</p>',
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
      <div className="flex flex-wrap items-start justify-between gap-4">
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
        <p className="mt-4 text-small text-error" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 max-w-3xl rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8">
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
    </div>
  )
}
