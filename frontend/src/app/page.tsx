'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'
import axios from 'axios'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [file, setFile] = useState<File | null>(null)
  const [summary, setSummary] = useState('')
  const [topics, setTopics] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  const handleUpload = async () => {
    if (!file) return
    setSubmitting(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await axios.post('http://localhost:8000/summarize/', formData)
      setSummary(res.data.summary)
      setTopics(res.data.topics)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

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

      <hr style={{ margin: '2rem 0' }} />

      <h2>Upload Transcript</h2>
      <input type="file" accept=".txt" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload} disabled={submitting || !file}>
        {submitting ? 'Processing...' : 'Submit'}
      </button>

      {summary && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Summary:</h3>
          <p>{summary}</p>
          <h4>Flagged Topics:</h4>
          <ul>
            {topics.map((topic) => <li key={topic}>{topic}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}
