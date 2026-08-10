'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDown, LogOut } from 'lucide-react'

interface AdminUser {
  email?: string
  profile?: { isAdmin: boolean; firstName?: string; lastName?: string } | null
}

function initials(user: AdminUser) {
  const first = user.profile?.firstName?.[0]
  const last = user.profile?.lastName?.[0]
  if (first || last) return `${first ?? ''}${last ?? ''}`.toUpperCase()
  return (user.email?.[0] ?? '?').toUpperCase()
}

function displayName(user: AdminUser) {
  const name = [user.profile?.firstName, user.profile?.lastName].filter(Boolean).join(' ')
  return name || user.email || 'Admin'
}

export default function AdminUserMenu({ user, onSignOut }: { user: AdminUser; onSignOut: () => void }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex min-h-[44px] items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors duration-250 hover:bg-cloud data-[state=open]:bg-cloud"
        >
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gradient-to-br from-connect-blue to-blue-deep text-small font-semibold text-white shadow-card">
            {initials(user)}
          </span>
          <span className="max-w-[10rem] truncate text-body font-medium text-ink">{displayName(user)}</span>
          <ChevronDown className="h-4 w-4 flex-none text-mist" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          className="z-50 w-64 rounded-2xl border border-border bg-white p-2 shadow-card-hover"
        >
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gradient-to-br from-connect-blue to-blue-deep text-body font-semibold text-white">
              {initials(user)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-body font-semibold text-ink">{displayName(user)}</p>
              <p className="truncate text-small text-slate">{user.email}</p>
            </div>
          </div>

          <DropdownMenu.Separator className="my-2 h-px bg-border" />

          <DropdownMenu.Item
            onSelect={onSignOut}
            className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl px-2 text-body font-medium text-error outline-none transition-colors duration-250 hover:bg-error/10 focus:bg-error/10"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
