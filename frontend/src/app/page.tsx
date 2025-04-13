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

  if (loading || !user) return <p className="text-white p-8">Loading...</p>

  return (
    <main className="min-h-screen bg-zinc-900 text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">CityInsight AI</h1>
        <button
          onClick={async () => {
            await supabase.auth.signOut()
            router.push('/login')
          }}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Sign Out
        </button>
      </div>

      <div className="bg-zinc-800 p-6 rounded-lg shadow-md max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Upload Transcript</h2>
        <input
          type="file"
          accept=".txt"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4
                     file:rounded file:border-0 file:text-sm file:font-semibold
                     file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />
        <button
          onClick={handleUpload}
          disabled={submitting || !file}
          className="mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded w-full"
        >
          {submitting ? 'Processing...' : 'Submit'}
        </button>
      </div>

      {summary && (
        <div className="mt-8 max-w-2xl mx-auto bg-zinc-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Summary</h3>
          <p className="text-gray-200">{summary}</p>

          <h4 className="mt-4 font-medium">Flagged Topics</h4>
          <ul className="list-disc list-inside text-gray-300">
            {topics.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}
