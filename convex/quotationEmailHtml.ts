// Inline-styled — most email clients strip <style> blocks, so everything
// that must render consistently is styled directly on each element.

export function buildQuotationEmailHtml({
  clientEmail,
  contactEmail,
  contactPhone,
  hasLogo,
}: {
  clientEmail: string
  contactEmail: string
  contactPhone: string
  hasLogo: boolean
}) {
  const connectBlue = '#183891'
  const blueDeep = '#0F2461'
  const ink = '#1A1D29'
  const slate = '#5B6070'
  const cloud = '#F4F6FA'
  const border = '#E3E6ED'

  return `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:${cloud};font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${cloud};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ${border};">
            <tr>
              <td style="background-color:${connectBlue};padding:28px 32px;">
                ${
                  hasLogo
                    ? `<img src="cid:logo.png" alt="Care Connect" width="150" style="display:block;height:auto;" />`
                    : `<span style="color:#ffffff;font-size:20px;font-weight:700;">Care Connect</span>`
                }
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 16px;font-size:20px;color:${ink};">Quotation Summary</h1>
                <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${ink};">Hello, ${clientEmail}</p>
                <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${slate};">
                  Thank you for reaching out to us with your request. Attached, you will find the quotation document
                  detailing the services/products you inquired about. Please take a moment to review it.
                </p>
                <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${slate};">
                  If you have any questions, require adjustments, or need further clarification, please don&rsquo;t
                  hesitate to contact me directly. I&rsquo;m happy to assist and ensure that the quotation meets your
                  expectations.
                </p>
                <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${slate};">
                  Once you&rsquo;re ready to proceed, kindly let us know so we can move forward with the next steps.
                </p>
                <p style="margin:0;font-size:15px;line-height:1.6;color:${slate};">
                  Thank you again for considering Care Connect. We look forward to working with you!
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px;background-color:${cloud};border-top:1px solid ${border};">
                <p style="margin:0;font-size:13px;color:${slate};">Care Connect — Care That Comes to You</p>
                <p style="margin:4px 0 0;font-size:13px;color:${slate};">${contactEmail} · ${contactPhone}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`.trim()
}
