'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Heart,
  MessageSquare,
  FileText,
  Star,
  type LucideIcon,
} from 'lucide-react'

const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/reservations', label: 'Reservations', icon: CalendarCheck },
  { href: '/admin/services', label: 'Services', icon: Heart },
  { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
  { href: '/admin/forms', label: 'Forms', icon: FileText },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-64 flex-none flex-col border-r border-border bg-white">
      <div className="flex h-16 flex-none items-center gap-2 border-b border-border px-6">
        <span className="font-headline text-h3 text-connect-blue">Care Connect</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-3" aria-label="Admin">
        <ul className="flex flex-col gap-1">
          {NAV.map((item) => {
            const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-body font-medium transition-colors duration-250 ${
                    active ? 'bg-blue-light text-connect-blue' : 'text-slate hover:bg-cloud hover:text-ink'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-none" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="flex-none border-t border-border p-4 text-center text-small text-mist">
        Built by Double A Digital Solution
      </div>
    </aside>
  )
}
