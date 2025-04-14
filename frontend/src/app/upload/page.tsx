'use client'

import SidebarLayout from '@/components/SidebarLayout'
import { useAuth } from '@/components/AuthProvider'
import { useState } from 'react'
import axios from 'axios'

export default function UploadPage() {
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleUpload = async () => {
    if (!file || !user) return
    setSubmitting(true)
    setMessage('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('user_id', user.id)
    formData.append('file_name', file.name)

    try {
      const { data } = await axios.post('http://localhost:8000/summarize/', formData)
      const jobId = data.job_id

      const poll = async () => {
        const res = await axios.get(`http://localhost:8000/status/${jobId}`)
        if (res.data.status === 'done') {
          setSubmitting(false)
          setMessage('✅ Summary completed!')
        } else {
          setTimeout(poll, 2000)
        }
      }

      poll()
    } catch (err) {
      setSubmitting(false)
      setMessage('❌ Upload failed.')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null
    setFile(selected)

    if (selected && selected.type === 'text/plain') {
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsText(selected)
    } else {
      setPreview(null)
    }
  }

  return (
    <SidebarLayout>
      <h1 className="text-3xl font-semibold text-[#555b6e] mb-6">Upload Transcript</h1>

      <div
        style={{
          backgroundColor: '#faf9f9',
          padding: '1.5rem',
          borderRadius: '1rem',
          maxWidth: '42rem',
          border: '1px solid #89b0ae',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
        }}
        className="space-y-4"
      >
        <input
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileChange}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid #bee3db',
            backgroundColor: 'white',
            color: '#555b6e',
            transition: 'border 0.3s',
          }}
        />

        <button
          disabled={!file || submitting}
          onClick={handleUpload}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            backgroundColor: '#89b0ae',
            color: 'white',
            fontWeight: 600,
            cursor: submitting ? 'not-allowed' : 'pointer',
            opacity: !file || submitting ? 0.6 : 1,
            transform: 'scale(1)',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            if (!submitting) (e.currentTarget.style.transform = 'scale(1.03)')
          }}
          onMouseLeave={(e) => {
            if (!submitting) (e.currentTarget.style.transform = 'scale(1)')
          }}
        >
          {submitting ? 'Processing...' : 'Submit'}
        </button>

        {message && (
          <p style={{ color: '#555b6e', fontSize: '0.875rem' }}>{message}</p>
        )}

        {preview && (
          <div
            style={{
              backgroundColor: '#fff',
              border: '1px solid #bee3db',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginTop: '1rem',
              maxHeight: '300px',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              color: '#555b6e',
              fontSize: '0.9rem',
              lineHeight: '1.5',
            }}
          >
            {preview}
          </div>
        )}
      </div>
    </SidebarLayout>
  )
}
