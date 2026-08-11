'use node'

import { v } from 'convex/values'
import { action } from './_generated/server'
import { api } from './_generated/api'
import { renderQuotationPdf } from './quotationPdf'
import { sendMailgunEmail } from './mailgun'
import { buildQuotationEmailHtml } from './quotationEmailHtml'
import { QUOTATION_TEMPLATE_DEFAULTS } from './quotationDefaults'

async function fetchLogo(filename: string): Promise<Buffer | undefined> {
  const siteUrl = process.env.SITE_URL
  if (!siteUrl) return undefined
  try {
    const res = await fetch(`${siteUrl}/images/${filename}`)
    if (!res.ok) return undefined
    return Buffer.from(await res.arrayBuffer())
  } catch {
    // Logo is cosmetic — never block sending the quote over a fetch hiccup.
    return undefined
  }
}

// Admin action — prices a pending reservation, generates the branded
// quotation PDF, and emails it to the client via Mailgun. Only marks the
// reservation as quoted once the email actually sends, so a failure leaves
// it pending and retryable instead of silently lying about what happened.
export const send = action({
  args: {
    id: v.id('reservations'),
    ratePerHour: v.number(),
    hst: v.string(),
    hstAmount: v.number(),
    serviceAmount: v.number(),
    total: v.number(),
    totalHours: v.number(),
    totalDays: v.number(),
  },
  handler: async (ctx, { id, ...pricing }) => {
    // getForQuotation and quotationTemplate.get both requireAdmin — this
    // doubles as the auth check for the whole action.
    const reservation = await ctx.runQuery(api.reservations.getForQuotation, { id })
    if (!reservation) throw new Error('Reservation not found')

    const template = (await ctx.runQuery(api.quotationTemplate.get, {})) ?? QUOTATION_TEMPLATE_DEFAULTS
    const [pdfLogo, emailLogo] = await Promise.all([fetchLogo('pdf-logo.png'), fetchLogo('email_temps_logo.png')])

    const pdf = await renderQuotationPdf({
      logo: pdfLogo,
      backLogo: pdfLogo,
      clientName: reservation.clientName,
      clientEmail: reservation.clientEmail,
      serviceTitle: reservation.serviceTitle,
      serviceDescriptionHtml: reservation.serviceDescription,
      serviceAssistance: reservation.serviceAssistance,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      template,
      pricing,
    })

    const html = buildQuotationEmailHtml({
      clientEmail: reservation.clientEmail,
      contactEmail: template.contactEmail,
      contactPhone: template.contactPhone,
      hasLogo: !!emailLogo,
    })

    await sendMailgunEmail({
      to: reservation.clientEmail,
      subject: 'Care Connect - Quote Summary',
      html,
      attachments: [
        { filename: 'care-connect-quotation.pdf', data: pdf, contentType: 'application/pdf' },
        ...(emailLogo ? [{ filename: 'logo.png', data: emailLogo, contentType: 'image/png', inline: true }] : []),
      ],
    })

    await ctx.runMutation(api.reservations.sendQuote, { id, ...pricing })
  },
})
