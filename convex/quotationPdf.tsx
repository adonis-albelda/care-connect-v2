'use node'

import { Document, Page, View, Text, Image, StyleSheet, renderToBuffer } from '@react-pdf/renderer'
import { parseHtmlBlocks } from './htmlBlocks'

const COLORS = {
  connectBlue: '#183891',
  blueDeep: '#0F2461',
  ink: '#1A1D29',
  slate: '#5B6070',
  mist: '#9AA0B0',
  border: '#E3E6ED',
}

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 11, color: COLORS.ink, fontFamily: 'Helvetica' },
  logo: { width: 150, height: 40, objectFit: 'contain' },
  h1: { fontSize: 20, fontWeight: 700, color: COLORS.ink, marginBottom: 12 },
  p: { marginBottom: 10, lineHeight: 1.5, color: COLORS.slate },
  li: { marginBottom: 4, lineHeight: 1.4, color: COLORS.slate },
  footer: {
    position: 'absolute',
    bottom: 32,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 9,
    color: COLORS.mist,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
  },
  sectionBar: { backgroundColor: COLORS.connectBlue, color: '#FFFFFF', fontSize: 12, fontWeight: 700, padding: 8, marginTop: 4 },
  tableHeaderRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.ink, paddingBottom: 6, marginTop: 10 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingVertical: 8 },
  th: { fontSize: 9, fontWeight: 700, color: COLORS.slate, textTransform: 'uppercase' },
  td: { fontSize: 10, color: COLORS.ink },
})

const COL = { service: 0.28, rate: 0.14, days: 0.28, hours: 0.14, amount: 0.16 }

interface QuotationPdfProps {
  logo?: Buffer | Uint8Array
  backLogo?: Buffer | Uint8Array
  clientName: string
  clientEmail: string
  serviceTitle: string
  serviceDescriptionHtml: string
  serviceAssistance: string[]
  startDate: string
  endDate: string
  template: {
    introTitle: string
    introBody: string
    staffTitle: string
    staffBody: string
    homeSupportTitle: string
    homeSupportBody: string
    personalCareTitle: string
    personalCareBody: string
    complexCareTitle: string
    complexCareBody: string
    contactEmail: string
    contactPhone: string
    contactAddress: string
    footerNote: string
  }
  pricing: {
    ratePerHour: number
    hst: string
    hstAmount: number
    serviceAmount: number
    total: number
    totalHours: number
    totalDays: number
  }
}

function money(value: number) {
  return `$${value.toFixed(2)}`
}

function Blocks({ html }: { html: string }) {
  return (
    <>
      {parseHtmlBlocks(html).map((block, i) =>
        block.type === 'ul' ? (
          <View key={i} style={{ marginBottom: 10 }}>
            {block.items.map((item, j) => (
              <Text key={j} style={styles.li}>
                {'•  '}
                {item}
              </Text>
            ))}
          </View>
        ) : (
          <Text key={i} style={styles.p}>
            {block.text}
          </Text>
        )
      )}
    </>
  )
}

function PageHeader({ logo }: { logo?: Buffer | Uint8Array }) {
  // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf's Image, not an HTML img
  return logo ? <Image src={logo as Buffer} style={styles.logo} /> : <Text style={{ fontSize: 16, fontWeight: 700 }}>Care Connect</Text>
}

function PageFooter({ page }: { page: number }) {
  return (
    <View style={styles.footer} fixed>
      <Text>www.ucarecon.ca</Text>
      <Text>Page {page}</Text>
    </View>
  )
}

export async function renderQuotationPdf(props: QuotationPdfProps): Promise<Buffer> {
  const { logo, backLogo, clientName, clientEmail, serviceTitle, serviceDescriptionHtml, serviceAssistance, startDate, endDate, template, pricing } =
    props

  const doc = (
    <Document title="Care Connect Quotation">
      {/* Page 1 — cover */}
      <Page size="LETTER" style={styles.page}>
        <PageHeader logo={logo} />
        <View style={{ height: 220, backgroundColor: COLORS.connectBlue, marginVertical: 40, borderRadius: 2 }} />
        <View>
          <Text style={{ fontSize: 11, marginBottom: 8 }}>
            Prepared for : {clientName || 'Valued client'} ({clientEmail})
          </Text>
          <Text style={{ fontSize: 11 }}>Prepared by : Care Connect</Text>
        </View>
      </Page>

      {/* Page 2 — company introduction */}
      <Page size="LETTER" style={styles.page}>
        <PageHeader logo={logo} />
        <View style={{ marginTop: 40, flex: 1 }}>
          <Text style={styles.h1}>{template.introTitle}</Text>
          <Blocks html={template.introBody} />
        </View>
        <PageFooter page={2} />
      </Page>

      {/* Page 3 — staff */}
      <Page size="LETTER" style={styles.page}>
        <PageHeader logo={logo} />
        <View style={{ marginTop: 40, flex: 1 }}>
          <Text style={styles.h1}>{template.staffTitle}</Text>
          <Blocks html={template.staffBody} />
        </View>
        <PageFooter page={3} />
      </Page>

      {/* Page 4 — home support services */}
      <Page size="LETTER" style={styles.page}>
        <PageHeader logo={logo} />
        <View style={{ marginTop: 40, flex: 1 }}>
          <Text style={styles.h1}>{template.homeSupportTitle}</Text>
          <Blocks html={template.homeSupportBody} />
        </View>
        <PageFooter page={4} />
      </Page>

      {/* Page 5 — personal care + complex care */}
      <Page size="LETTER" style={styles.page}>
        <PageHeader logo={logo} />
        <View style={{ marginTop: 40, flex: 1 }}>
          <Text style={styles.h1}>{template.personalCareTitle}</Text>
          <Blocks html={template.personalCareBody} />
          <Text style={[styles.h1, { marginTop: 16 }]}>{template.complexCareTitle}</Text>
          <Blocks html={template.complexCareBody} />
        </View>
        <PageFooter page={5} />
      </Page>

      {/* Page 6 — quoted service + quote breakdown */}
      <Page size="LETTER" style={styles.page}>
        <PageHeader logo={logo} />
        <View style={{ marginTop: 40, flex: 1 }}>
          <Text style={styles.h1}>{serviceTitle}</Text>
          <Blocks html={serviceDescriptionHtml} />
          {serviceAssistance.length > 0 && (
            <View style={{ marginBottom: 10 }}>
              {serviceAssistance.map((activity, i) => (
                <Text key={i} style={styles.li}>
                  {'•  '}
                  {activity}
                </Text>
              ))}
            </View>
          )}

          <Text style={[styles.h1, { marginTop: 16 }]}>Quote</Text>

          <Text style={styles.sectionBar}>Service</Text>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.th, { width: `${COL.service * 100}%` }]}>Service</Text>
            <Text style={[styles.th, { width: `${COL.rate * 100}%` }]}>Rate/Hr.</Text>
            <Text style={[styles.th, { width: `${COL.days * 100}%` }]}>Days</Text>
            <Text style={[styles.th, { width: `${COL.hours * 100}%` }]}>Total Hours</Text>
            <Text style={[styles.th, { width: `${COL.amount * 100}%`, textAlign: 'right' }]}>Amount</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.td, { width: `${COL.service * 100}%` }]}>{serviceTitle}</Text>
            <Text style={[styles.td, { width: `${COL.rate * 100}%` }]}>{money(pricing.ratePerHour)}</Text>
            <Text style={[styles.td, { width: `${COL.days * 100}%` }]}>
              {startDate} - {endDate}
            </Text>
            <Text style={[styles.td, { width: `${COL.hours * 100}%` }]}>{pricing.totalHours}</Text>
            <Text style={[styles.td, { width: `${COL.amount * 100}%`, textAlign: 'right' }]}>{money(pricing.serviceAmount)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.td, { width: `${COL.service * 100}%`, color: COLORS.slate }]}>HST ({pricing.hst}%)</Text>
            <Text style={{ width: `${COL.rate * 100}%` }} />
            <Text style={[styles.td, { width: `${COL.days * 100}%`, color: COLORS.slate }]}>
              {pricing.totalDays} day{pricing.totalDays === 1 ? '' : 's'}
            </Text>
            <Text style={{ width: `${COL.hours * 100}%` }} />
            <Text style={[styles.td, { width: `${COL.amount * 100}%`, textAlign: 'right', color: COLORS.slate }]}>
              {money(pricing.hstAmount)}
            </Text>
          </View>

          <Text style={[styles.sectionBar, { marginTop: 16 }]}>Total</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
            <Text style={{ fontSize: 12, fontWeight: 700 }}>Total Service Fee</Text>
            <Text style={{ fontSize: 12, fontWeight: 700 }}>{money(pricing.total)}</Text>
          </View>
        </View>
        <PageFooter page={6} />
      </Page>

      {/* Page 7 — back cover */}
      <Page size="LETTER" style={[styles.page, { alignItems: 'center', justifyContent: 'space-between' }]}>
        <View />
        <View style={{ alignItems: 'center' }}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf's Image, not an HTML img */}
          {backLogo && <Image src={backLogo as Buffer} style={{ width: 100, height: 100, objectFit: 'contain' }} />}
          <Text style={{ fontSize: 18, fontWeight: 700, marginTop: 12 }}>Care Connect</Text>
          <Text style={{ fontSize: 11, color: COLORS.slate, marginTop: 2 }}>{template.footerNote}</Text>

          <View style={{ marginTop: 32, alignItems: 'center' }}>
            <Text style={{ fontSize: 11, marginBottom: 8 }}>{template.contactEmail}</Text>
            <Text style={{ fontSize: 11, marginBottom: 8 }}>{template.contactPhone}</Text>
            <Text style={{ fontSize: 11, textAlign: 'center' }}>{template.contactAddress}</Text>
          </View>
        </View>
        <View style={{ height: 120, width: '100%', backgroundColor: COLORS.connectBlue, borderRadius: 2 }} />
      </Page>
    </Document>
  )

  return renderToBuffer(doc)
}
