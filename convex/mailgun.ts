'use node'

interface MailgunAttachment {
  filename: string
  data: Buffer
  contentType: string
}

interface SendMailgunEmailArgs {
  to: string
  subject: string
  html: string
  attachments?: MailgunAttachment[]
}

export async function sendMailgunEmail({ to, subject, html, attachments = [] }: SendMailgunEmailArgs) {
  const apiKey = process.env.MAILGUN_API_KEY
  const domain = process.env.MAILGUN_DOMAIN
  const from = process.env.MAILGUN_FROM_EMAIL ?? `Care Connect <postmaster@${domain}>`
  const apiBase = process.env.MAILGUN_API_BASE ?? 'https://api.mailgun.net'

  if (!apiKey || !domain) {
    throw new Error('Mailgun is not configured — set MAILGUN_API_KEY and MAILGUN_DOMAIN in Convex env.')
  }

  const form = new FormData()
  form.append('from', from)
  form.append('to', to)
  form.append('subject', subject)
  form.append('html', html)

  for (const attachment of attachments) {
    const blob = new Blob([new Uint8Array(attachment.data)], { type: attachment.contentType })
    form.append('attachment', blob, attachment.filename)
  }

  const res = await fetch(`${apiBase}/v3/${domain}/messages`, {
    method: 'POST',
    headers: { Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}` },
    body: form,
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Mailgun send failed (${res.status}): ${body}`)
  }

  return res.json()
}
