'use client'

import { useState, type KeyboardEvent } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useMutation } from 'convex/react'
import { Plus, X } from 'lucide-react'
import { api } from '@convex/_generated/api'
import type { Doc } from '@convex/_generated/dataModel'

interface ServiceEditDrawerProps {
  service: Doc<'services'> | null
  onOpenChange: (open: boolean) => void
}

interface FormState {
  title: string
  slug: string
  shortDescription: string
  description: string
  banner: string
  isActive: boolean
  assistance: string[]
}

function toForm(service: Doc<'services'>): FormState {
  return {
    title: service.title,
    slug: service.slug ?? '',
    shortDescription: service.shortDescription,
    description: service.description,
    banner: service.banner ?? '',
    isActive: service.isActive,
    assistance: service.assistance ?? [],
  }
}

export default function ServiceEditDrawer({ service, onOpenChange }: ServiceEditDrawerProps) {
  return (
    <Dialog.Root open={service !== null} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-ink/45 backdrop-blur-sm" />
        <Dialog.Content className="admin-drawer fixed inset-y-0 right-0 z-[91] flex w-full max-w-2xl flex-col bg-white shadow-card-hover focus:outline-none">
          {/* Keyed by service id: remounts fresh local state per row instead
              of syncing via an effect when the selected service changes. */}
          {service && <ServiceEditForm key={service._id} service={service} onClose={() => onOpenChange(false)} />}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function ServiceEditForm({ service, onClose }: { service: Doc<'services'>; onClose: () => void }) {
  const updateService = useMutation(api.services.update)
  const [form, setForm] = useState<FormState>(() => toForm(service))
  const [activityInput, setActivityInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addActivity = () => {
    const value = activityInput.trim()
    if (!value) return
    if (form.assistance.some((a) => a.toLowerCase() === value.toLowerCase())) {
      setActivityInput('')
      return
    }
    setForm({ ...form, assistance: [...form.assistance, value] })
    setActivityInput('')
  }

  const removeActivity = (value: string) => {
    setForm({ ...form, assistance: form.assistance.filter((a) => a !== value) })
  }

  const handleActivityKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addActivity()
    }
  }

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    setError(null)
    try {
      await updateService({
        id: service._id,
        title: form.title,
        slug: form.slug || undefined,
        shortDescription: form.shortDescription,
        description: form.description,
        banner: form.banner || undefined,
        isActive: form.isActive,
        assistance: form.assistance,
      })
      onClose()
    } catch {
      setError("That didn't save — check the fields and try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5 sm:px-8">
        <div>
          <Dialog.Title className="font-headline text-h3 text-connect-blue">Edit service</Dialog.Title>
          <Dialog.Description className="mt-1 text-small text-slate">{service.title}</Dialog.Description>
        </div>
        <Dialog.Close asChild>
          <button
            type="button"
            aria-label="Close"
            className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-mist transition-colors duration-250 hover:bg-cloud hover:text-ink"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </Dialog.Close>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
        <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
          <div>
            <p className="text-small font-medium text-ink">Status</p>
            <p className="text-xs text-slate">Visible on the public site when active.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={form.isActive}
            onClick={() => setForm({ ...form, isActive: !form.isActive })}
            className={`relative h-7 w-12 flex-none rounded-full transition-colors duration-250 ${
              form.isActive ? 'bg-connect-blue' : 'bg-border'
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-card transition-transform duration-250 ${
                form.isActive ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-small font-medium text-ink">Title</span>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="min-h-[44px] rounded-lg border border-border px-3 text-small text-ink focus:border-connect-blue focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-small font-medium text-ink">Slug</span>
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="min-h-[44px] rounded-lg border border-border px-3 font-mono text-small text-ink focus:border-connect-blue focus:outline-none"
            />
          </label>
        </div>

        <label className="mt-5 flex flex-col gap-1.5">
          <span className="text-small font-medium text-ink">Short description</span>
          <textarea
            value={form.shortDescription}
            onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
            rows={2}
            className="rounded-lg border border-border px-3 py-2 text-small text-ink focus:border-connect-blue focus:outline-none"
          />
        </label>

        <label className="mt-5 flex flex-col gap-1.5">
          <span className="text-small font-medium text-ink">Full description</span>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={6}
            className="rounded-lg border border-border px-3 py-2 text-small text-ink focus:border-connect-blue focus:outline-none"
          />
        </label>

        <label className="mt-5 flex flex-col gap-1.5">
          <span className="text-small font-medium text-ink">Banner image URL</span>
          <input
            value={form.banner}
            onChange={(e) => setForm({ ...form, banner: e.target.value })}
            placeholder="https://…"
            className="min-h-[44px] rounded-lg border border-border px-3 text-small text-ink focus:border-connect-blue focus:outline-none"
          />
        </label>
        {form.banner && (
          <div className="mt-3 h-32 w-full overflow-hidden rounded-lg border border-border bg-cloud">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.banner} alt="" className="h-full w-full object-cover" />
          </div>
        )}

        <div className="mt-5">
          <span className="text-small font-medium text-ink">Activities</span>
          <p className="mt-0.5 text-xs text-slate">What&rsquo;s included with this service — press Enter to add.</p>
          <div className="mt-2 flex gap-2">
            <input
              value={activityInput}
              onChange={(e) => setActivityInput(e.target.value)}
              onKeyDown={handleActivityKeyDown}
              placeholder="e.g. Meal preparation"
              className="min-h-[44px] flex-1 rounded-lg border border-border px-3 text-small text-ink focus:border-connect-blue focus:outline-none"
            />
            <button
              type="button"
              onClick={addActivity}
              disabled={!activityInput.trim()}
              className="flex min-h-[44px] items-center gap-1.5 rounded-lg bg-connect-blue px-4 text-small font-semibold text-white transition-colors duration-250 hover:bg-blue-deep disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add
            </button>
          </div>

          {form.assistance.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {form.assistance.map((activity) => (
                <span
                  key={activity}
                  className="flex items-center gap-1.5 rounded-full bg-blue-light py-1.5 pl-3 pr-1.5 text-small font-medium text-connect-blue"
                >
                  {activity}
                  <button
                    type="button"
                    onClick={() => removeActivity(activity)}
                    aria-label={`Remove ${activity}`}
                    className="flex h-5 w-5 items-center justify-center rounded-full transition-colors duration-250 hover:bg-white/60"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-small text-mist">No activities added yet.</p>
          )}
        </div>
      </div>

      <div className="border-t border-border px-6 py-5 sm:px-8">
        {error && (
          <p className="mb-3 text-small text-error" role="alert">
            {error}
          </p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row-reverse">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-connect-blue text-body font-semibold text-white shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:bg-blue-deep hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <Dialog.Close asChild>
            <button
              type="button"
              disabled={saving}
              className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl border border-border text-body font-medium text-slate transition-colors duration-250 hover:bg-cloud disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          </Dialog.Close>
        </div>
      </div>
    </>
  )
}
