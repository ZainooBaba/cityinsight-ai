'use client'

import Link from 'next/link'
import { useAuth } from './AuthProvider'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/cn'

const colors = {
  base: '#faf9f9',
  sidebar: '#bee3db',
  text: '#555b6e',
  hover: '#89b0ae',
  active: '#ffd6ba',
  highlight: '#fff',
}

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const pathname = usePathname()

  const nav = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Upload', href: '/upload' },
  ]

  if (user?.role === 'admin') {
    nav.push({ name: 'Admin', href: '/admin' })
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: colors.base, color: colors.text }}>
      <aside
        className="w-64 p-6 space-y-6 shadow-xl"
        style={{ backgroundColor: colors.sidebar }}
      >
        <div className="text-3xl font-extrabold tracking-tight" style={{ color: colors.text }}>
          CityInsight
        </div>

        <nav className="space-y-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'block px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-[1.03] hover:shadow-md',
                pathname === item.href
                  ? 'bg-[#309eb0] text-[#ceeaef] font-semibold'
                  : 'text-[#555b6e] hover:bg-[#89b0ae]'
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <button
          onClick={async () => {
            const { supabase } = await import('@/utils/supabaseClient')
            await supabase.auth.signOut()
            location.href = '/login'
          }}
          className="text-sm mt-10 text-red-500 hover:text-red-400 transition-colors duration-200"
        >
          Sign Out
        </button>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">{children}</main>
    </div>
  )
}
