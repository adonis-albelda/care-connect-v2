export interface Service {
  id: string
  title: string
  slug: string
  short_description: string
  description?: string
  banner?: string
  assistance?: string[]
}

export interface Testimonial {
  id: string
  client_name: string
  message: string
}

export interface ApiUser {
  id: string
  email: string
  first_name?: string
  last_name?: string
  [key: string]: unknown
}

export interface TimeValue {
  hour: string
  minutes: string
  period: 'AM' | 'PM'
}

export interface DateRangeValue {
  from: Date | undefined
  to?: Date | undefined
}

export interface RegisterPayload {
  first_name: string
  last_name: string
  phone_number: string
  email: string
  password: string
  password_confirmation: string
}

export interface InquiryPayload {
  first_name: string
  last_name: string
  email_address: string
  phone_number: string
  message: string
}
