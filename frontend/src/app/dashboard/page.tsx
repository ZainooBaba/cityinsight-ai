'use client'

import SidebarLayout from '@/components/SidebarLayout'
import SummaryCardList from '@/components/SummaryCardList'
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
  <SummaryCardList summaries={history} />
    </SidebarLayout>
  )
}
