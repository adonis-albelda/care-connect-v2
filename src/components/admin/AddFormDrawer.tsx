'use client'

import { useRef, useState, type ChangeEvent } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useMutation } from 'convex/react'
import { FileUp, X } from 'lucide-react'
import { api } from '@convex/_generated/api'

type FormType = 'admin' | 'client' | 'agent'

const TYPE_OPTIONS: { value: FormType; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'client', label: 'Client' },
  { value: 'agent', label: 'Agent' },
]

export default function AddFormDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-ink/45 backdrop-blur-sm" />
        <Dialog.Content className="admin-drawer fixed inset-y-0 right-0 z-[91] flex w-full max-w-lg flex-col bg-white shadow-card-hover focus:outline-none">
          {/* Keyed so reopening always starts from a clean form. */}
          {open && <AddFormBody key="add-form" onClose={() => onOpenChange(false)} />}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function AddFormBody({ onClose }: { onClose: () => void }) {
  const generateUploadUrl = useMutation(api.forms.generateUploadUrl)
  const createForm = useMutation(api.forms.create)

  const [title, setTitle] = useState('')
  const [type, setType] = useState<FormType>('client')
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null)
  }

  const canSubmit = title.trim() && file && !saving

  const handleSubmit = async () => {
    if (!canSubmit || !file) return
    setSaving(true)
    setError(null)
    try {
      const uploadUrl = await generateUploadUrl()
      const res = await fetch(uploadUrl, { method: 'POST', headers: { 'Content-Type': file.type }, body: file })
      if (!res.ok) throw new Error('upload failed')
      const { storageId } = await res.json()
      await createForm({ title: title.trim(), type, storageId })
      onClose()
    } catch {
      setError("That didn't upload — check the file and try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5 sm:px-8">
        <div>
          <Dialog.Title className="font-headline text-h3 text-connect-blue">Upload a form</Dialog.Title>
          <Dialog.Description className="mt-1 text-small text-slate">Add a document for admin, client, or agent use.</Dialog.Description>
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
        <label className="flex flex-col gap-1.5">
          <span className="text-small font-medium text-ink">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Client Intake Form"
            className="min-h-[44px] rounded-lg border border-border px-3 text-small text-ink focus:border-connect-blue focus:outline-none"
          />
        </label>

        <div className="mt-5">
          <span className="text-small font-medium text-ink">Form type</span>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {TYPE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setType(option.value)}
                aria-pressed={type === option.value}
                className={`min-h-[40px] rounded-lg border text-small font-medium transition-colors duration-250 ${
                  type === option.value
                    ? 'border-connect-blue bg-blue-light text-connect-blue'
                    : 'border-border text-slate hover:bg-cloud'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <span className="text-small font-medium text-ink">File</span>
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 flex min-h-[96px] w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-center text-small text-slate transition-colors duration-250 hover:border-connect-blue hover:text-connect-blue"
          >
            <FileUp className="h-5 w-5" aria-hidden="true" />
            {file ? file.name : 'Click to choose a file'}
          </button>
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
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-connect-blue text-body font-semibold text-white shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:bg-blue-deep hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {saving ? 'Uploading…' : 'Upload form'}
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
