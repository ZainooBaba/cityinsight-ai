'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { useEffect } from 'react'
import { supabase } from '@/utils/supabaseClient'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  if (loading || !user) return <p>Loading...</p>

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <p>Welcome, {user.email}</p>
      <button onClick={async () => {
        await supabase.auth.signOut()
        router.push('/login')
      }}>
        Sign Out
      </button>
    </div>
  )
}
