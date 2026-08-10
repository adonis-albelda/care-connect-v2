'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useMutation } from 'convex/react'
import { Mail, X } from 'lucide-react'
import type { Doc } from '@convex/_generated/dataModel'
import { api } from '@convex/_generated/api'
import RichTextEditor from '@/components/admin/RichTextEditor'

function htmlToPlainText(html: string) {
  return html
    .replace(/<\/(p|div|li)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export default function InquiryReplyDrawer({
  inquiry,
  onOpenChange,
}: {
  inquiry: Doc<'inquiries'> | null
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog.Root open={inquiry !== null} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-ink/45 backdrop-blur-sm" />
        <Dialog.Content className="admin-drawer fixed inset-y-0 right-0 z-[91] flex w-full max-w-2xl flex-col bg-white shadow-card-hover focus:outline-none">
          {inquiry && <ReplyForm key={inquiry._id} inquiry={inquiry} onClose={() => onOpenChange(false)} />}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function ReplyForm({ inquiry, onClose }: { inquiry: Doc<'inquiries'>; onClose: () => void }) {
  const sendReply = useMutation(api.inquiries.reply)
  const [reply, setReply] = useState(inquiry.reply ?? '')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const plainReply = htmlToPlainText(reply)
  const name = [inquiry.firstName, inquiry.lastName].filter(Boolean).join(' ')

  const handleSend = async () => {
    if (sending || !plainReply) return
    setSending(true)
    setError(null)
    try {
      await sendReply({ id: inquiry._id, reply })
      const subject = encodeURIComponent(`Re: Your inquiry to Care Connect`)
      const body = encodeURIComponent(plainReply)
      window.open(`mailto:${inquiry.emailAddress}?subject=${subject}&body=${body}`, '_blank')
      onClose()
    } catch {
      setError("That didn't save — try again.")
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5 sm:px-8">
        <div>
          <Dialog.Title className="font-headline text-h3 text-connect-blue">Reply to inquiry</Dialog.Title>
          <Dialog.Description className="mt-1 text-small text-slate">
            {name} · {inquiry.emailAddress}
          </Dialog.Description>
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
        <p className="text-xs font-semibold uppercase tracking-wide text-slate">Their message</p>
        <div className="mt-2 rounded-xl border border-border bg-cloud p-4">
          <p className="whitespace-pre-wrap text-small text-ink">{inquiry.message}</p>
          <p className="mt-3 text-xs text-mist">
            {inquiry.phoneNumber} · {new Date(inquiry._creationTime).toLocaleString()}
          </p>
        </div>

        {inquiry.repliedAt && (
          <p className="mt-3 text-xs text-slate">Already replied {new Date(inquiry.repliedAt).toLocaleString()} — sending again updates the record.</p>
        )}

        <div className="mt-6">
          <span className="text-small font-medium text-ink">Your reply</span>
          <div className="mt-1.5">
            <RichTextEditor value={reply} onChange={setReply} minHeightRem={8} />
          </div>
          <p className="mt-2 text-xs text-mist">
            Sending saves this reply and opens your email client to {inquiry.emailAddress} with the message pre-filled —
            Convex can&rsquo;t send email directly.
          </p>
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
            onClick={handleSend}
            disabled={sending || !plainReply}
            className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-connect-blue text-body font-semibold text-white shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:bg-blue-deep hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            {sending ? 'Saving…' : 'Send reply'}
          </button>
          <Dialog.Close asChild>
            <button
              type="button"
              disabled={sending}
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
