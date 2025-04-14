'use client'

import SidebarLayout from '@/components/SidebarLayout'
import { useAuth } from '@/components/AuthProvider'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [allSummaries, setAllSummaries] = useState<any[]>([])

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/dashboard')
      return
    }

    supabase
      .from('summaries')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => setAllSummaries(data || []))
  }, [user])

  return (
    <SidebarLayout>
      <h1 className="text-3xl font-semibold text-paynes-gray mb-6">All Submissions</h1>

      <div className="grid gap-6">
        {allSummaries.map((s) => (
          <div
            key={s.id}
            className="p-5 bg-seasalt border border-mint-green rounded-2xl shadow-sm transition-all hover:shadow-md hover:scale-[1.01]"
          >
            <div className="text-sm text-paynes-gray mb-1">
              {new Date(s.created_at).toLocaleString()} —{' '}
              <span className="italic text-cambridge-blue">{s.user_id}</span>
            </div>
            <div className="text-lg font-semibold text-paynes-gray">{s.file_name}</div>
            <div className="text-sm text-paynes-gray mt-2 line-clamp-3">{s.summary.slice(0, 250)}...</div>
          </div>
        ))}

        {allSummaries.length === 0 && (
          <p className="text-paynes-gray italic text-sm">No submissions yet.</p>
        )}
      </div>
    </SidebarLayout>
  )
}
