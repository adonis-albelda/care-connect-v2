export interface QuotationTemplateFields {
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

// Seeded from quotation.pdf. Used both as the Templates admin page's
// starting form state before anything is saved, AND as QuotationDocument's
// fallback when no quotationTemplates row exists yet — so "preview
// quotation" always shows real content instead of silently skipping pages
// just because the admin hasn't hit Save yet.
//
// Duplicated at convex/quotationDefaults.ts for the emailed-PDF generator —
// Convex's bundler only processes files inside convex/, so it can't import
// this one directly. Keep both copies in sync if the defaults change.
export const QUOTATION_TEMPLATE_DEFAULTS: QuotationTemplateFields = {
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
  homeSupportTitle: 'Home Support Services',
  homeSupportBody: `
<p>Home support services include assistance with day-to-day activities such as:</p>
<ul>
<li>Light housekeeping &amp; laundry</li>
<li>Meal preparation &amp; planning</li>
<li>Companionship and community outings</li>
<li>Light yard work</li>
<li>Grocery shopping and errands</li>
<li>Accompaniment to doctor or other health care appointments</li>
<li>Pet care</li>
<li>Incidental transportation</li>
<li>Home safety, sorting mail, cleaning cupboards, fridge cleaning</li>
<li>Coordination of home and yard repair or maintenance services</li>
<li>Coordination for installation of in-home assistance devices</li>
<li>Coordination of services and referrals to other community agencies if required</li>
</ul>
<p>We offer the option of live-in caregivers for short or long term placements.</p>
`.trim(),
  personalCareTitle: 'Personal Care Services',
  personalCareBody: `
<p>Personal care includes assistance with the private activities of daily living such as:</p>
<ul>
<li>Dressing, bathing, grooming</li>
<li>Mobility and toileting</li>
<li>Continence assistance</li>
<li>Medication reminders</li>
<li>Alzheimer &amp; dementia support</li>
<li>Respite care</li>
<li>Overnight care</li>
</ul>
<p>Trained and certified Personal Support Workers provide all personal support services.</p>
`.trim(),
  complexCareTitle: 'Complex Care Services',
  complexCareBody: `
<p>Complex care refers to services that must be performed by a regulated health professional such as a Registered Practical Nurse:</p>
<ul>
<li>Medication administration</li>
<li>Vital signs monitoring</li>
<li>Wound care</li>
<li>Catheter care</li>
<li>Foot care</li>
<li>Ostomy care</li>
<li>Palliative care</li>
</ul>
`.trim(),
  contactEmail: 'admin@ucarecon.ca',
  contactPhone: '416-262-4071',
  contactAddress: '120 Shelborne North York On. Canada M6B 1M7',
  footerNote: 'Care that comes to you',
}
