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
  const [history, setHistory] = useState<any[]>([])


  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return
      const { data, error } = await supabase
        .from('summaries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
  
      if (error) {
        console.error('Error fetching history:', error)
      } else {
        setHistory(data || [])
      }
    }
  
    fetchHistory()
  }, [user])
  

  const handleUpload = async () => {
    if (!file || !user) return
    setSubmitting(true)
    setSummary('')
    setTopics([])
  
    const formData = new FormData()
    formData.append('file', file)
    formData.append('user_id', user.id)
    formData.append('file_name', file.name)
  
    try {
      // Step 1: Get job ID
      const { data } = await axios.post('http://localhost:8000/summarize/', formData)
      const jobId = data.job_id
  
      // Step 2: Poll status endpoint
      const poll = async () => {
        const res = await axios.get(`http://localhost:8000/status/${jobId}`)
        if (res.data.status === 'done') {
          setSummary(res.data.summary)
          setTopics(res.data.topics || [])
          setSubmitting(false)
        } else {
          setTimeout(poll, 2000)
        }
      }
  
      poll()
    } catch (err) {
      console.error(err)
      setSubmitting(false)
    }
  }
  
  

  if (loading || !user) return <p className="text-white p-8">Loading...</p>

  return (
    <main className="min-h-screen bg-zinc-900 text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">CityInsight AI</h1>
        <div className="text-sm text-gray-400 mt-2">
          You are logged in as: <span className="font-semibold text-white">{user?.role}</span>
        </div>

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
          accept=".pdf,.txt"
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

      {submitting && (
        <p className="text-sm text-gray-400 mt-2">Processing your file. This might take a moment...</p>
      )}

      {summary && (
        <div className="mt-8 max-w-2xl mx-auto bg-zinc-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Summary</h3>
          <p className="text-gray-200 whitespace-pre-line">{summary}</p>

          {topics.length > 0 && (
            <>
              <h4 className="mt-4 font-medium">Flagged Topics</h4>
              <ul className="list-disc list-inside text-gray-300">
                {topics.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}


    {history.length > 0 && (
      <div className="mt-12 max-w-2xl mx-auto bg-zinc-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Past Submissions</h3>
        <ul className="divide-y divide-zinc-700">
          {history.map((item) => (
            <li key={item.id} className="py-4">
              <div className="text-sm text-gray-400 mb-1">
                {new Date(item.created_at).toLocaleString()}
              </div>
              <div className="font-medium text-white">{item.file_name}</div>
              <div className="text-gray-300 mt-1 line-clamp-2">{item.summary?.slice(0, 200)}...</div>
            </li>
          ))}
        </ul>
      </div>
    )}


    </main>
  )
}
