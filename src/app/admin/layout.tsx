import { Poppins, Inter } from 'next/font/google'
import type { ReactNode } from 'react'
import '../globals.css'
import AdminProviders from '@/components/admin/AdminProviders'

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata = { title: 'Admin — Care Connect' }

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-cloud text-ink">
        <AdminProviders>{children}</AdminProviders>
      </body>
    </html>
  )
}
