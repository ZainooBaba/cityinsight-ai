'use client'

import SidebarLayout from '@/components/SidebarLayout'
import { useAuth } from '@/components/AuthProvider'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'

export default function DashboardPage() {
  const { user } = useAuth()
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      supabase
        .from('summaries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => setHistory(data || []))
    }
  }, [user])

  return (
    <SidebarLayout>
      <h1 className="text-3xl font-bold mb-6 text-[#555b6e]">Your Submissions</h1>
      <div className="grid gap-6">
        {history.map((s) => (
          <div
            key={s.id}
            className="p-5 rounded-xl bg-[#fefefe] shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]"
          >
            <div className="text-sm text-[#89b0ae] mb-1">
              {new Date(s.created_at).toLocaleString()}
            </div>
            <div className="text-lg font-semibold text-[#555b6e]">{s.file_name}</div>
            <div className="text-[#777] mt-2 line-clamp-3">
              {s.summary.slice(0, 250)}...
            </div>
          </div>
        ))}
        {history.length === 0 && (
          <p className="text-[#999] italic text-sm">No uploads yet. Submit something to get started.</p>
        )}
      </div>
    </SidebarLayout>
  )
}
