'use client'

import SidebarLayout from '@/components/SidebarLayout'
import { useAuth } from '@/components/AuthProvider'
import SummaryCardList from '@/components/SummaryCardList'
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
  <h1 className="text-3xl font-bold mb-6 text-[#555b6e]">All Submissions</h1>
  <SummaryCardList summaries={allSummaries} showUserId />
    </SidebarLayout>

  )
}
