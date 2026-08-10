'use client'

import { useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useMutation } from 'convex/react'
import { ImagePlus, Plus, X } from 'lucide-react'
import { api } from '@convex/_generated/api'
import type { Doc } from '@convex/_generated/dataModel'
import RichTextEditor from '@/components/admin/RichTextEditor'

interface ServiceEditDrawerProps {
  service: Doc<'services'> | null
  onOpenChange: (open: boolean) => void
}

interface FormState {
  title: string
  shortDescription: string
  description: string
  isActive: boolean
  assistance: string[]
}

function toForm(service: Doc<'services'>): FormState {
  return {
    title: service.title,
    shortDescription: service.shortDescription,
    description: service.description,
    isActive: service.isActive,
    assistance: service.assistance ?? [],
  }
}

export default function ServiceEditDrawer({ service, onOpenChange }: ServiceEditDrawerProps) {
  return (
    <Dialog.Root open={service !== null} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-ink/45 backdrop-blur-sm" />
        <Dialog.Content className="admin-drawer fixed inset-y-0 right-0 z-[91] flex w-full max-w-4xl flex-col bg-white shadow-card-hover focus:outline-none">
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
  const generateUploadUrl = useMutation(api.services.generateUploadUrl)
  const setBanner = useMutation(api.services.setBanner)

  const [form, setForm] = useState<FormState>(() => toForm(service))
  const [banner, setBannerPreview] = useState(service.banner ?? '')
  const [activityInput, setActivityInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handlePhotoSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setUploading(true)
    setError(null)
    try {
      const uploadUrl = await generateUploadUrl()
      const res = await fetch(uploadUrl, { method: 'POST', headers: { 'Content-Type': file.type }, body: file })
      if (!res.ok) throw new Error('upload failed')
      const { storageId } = await res.json()
      const url = await setBanner({ id: service._id, storageId })
      setBannerPreview(url ?? '')
    } catch {
      setError("That photo didn't upload — try again.")
    } finally {
      setUploading(false)
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
        shortDescription: form.shortDescription,
        description: form.description,
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
        <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
          <div>
            <span className="text-small font-medium text-ink">Photo</span>
            <div className="mt-2 aspect-video w-full overflow-hidden rounded-lg border border-border bg-cloud">
              {banner ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={banner} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-mist">
                  <ImagePlus className="h-8 w-8" aria-hidden="true" />
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="mt-2 flex min-h-[40px] w-full items-center justify-center gap-2 rounded-lg border border-border text-small font-semibold text-slate transition-colors duration-250 hover:border-connect-blue hover:text-connect-blue disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ImagePlus className="h-4 w-4" aria-hidden="true" />
              {uploading ? 'Uploading…' : 'Update photo'}
            </button>

            <div className="mt-6 flex items-center justify-between rounded-xl border border-border px-4 py-3">
              <div>
                <p className="text-small font-medium text-ink">Status</p>
                <p className="text-xs text-slate">Visible when active.</p>
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
          </div>

          <div>
            <label className="flex flex-col gap-1.5">
              <span className="text-small font-medium text-ink">Title</span>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="min-h-[44px] rounded-lg border border-border px-3 text-small text-ink focus:border-connect-blue focus:outline-none"
              />
            </label>

            <div className="mt-5">
              <span className="text-small font-medium text-ink">Short description</span>
              <div className="mt-1.5">
                <RichTextEditor
                  value={form.shortDescription}
                  onChange={(html) => setForm({ ...form, shortDescription: html })}
                  minHeightRem={4}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <span className="text-small font-medium text-ink">Full description</span>
          <div className="mt-1.5">
            <RichTextEditor
              value={form.description}
              onChange={(html) => setForm({ ...form, description: html })}
              minHeightRem={9}
            />
          </div>
        </div>

        <div className="mt-6">
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
