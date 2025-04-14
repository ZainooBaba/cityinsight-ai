'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'
import Link from 'next/link'

export default function SummaryDetailPage({ params }: { params: { id: string } }) {
  const [summary, setSummary] = useState<any>(null)

  useEffect(() => {
    const fetchSummary = async () => {
      const { data } = await supabase
        .from('summaries')
        .select('*')
        .eq('id', params.id)
        .single()

      setSummary(data)
    }

    fetchSummary()
  }, [params.id])

  if (!summary) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#faf9f9',
        }}
      >
        <p style={{ color: '#555b6e', fontSize: '1rem' }}>Loading...</p>
      </div>
    )
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#faf9f9',
        padding: '3rem 1.5rem',
        color: '#555b6e',
      }}
    >
      <div
        style={{
          maxWidth: '48rem',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
          border: '1px solid #bee3db',
        }}
      >
        <Link
          href="/dashboard"
          style={{
            display: 'inline-block',
            marginBottom: '1rem',
            color: '#89b0ae',
            fontSize: '0.9rem',
            textDecoration: 'none',
          }}
        >
          ← Back to Dashboard
        </Link>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>
          {summary.file_name}
        </h1>

        <p style={{ fontSize: '0.875rem', color: '#89b0ae', marginBottom: '0.75rem' }}>
          Uploaded: {new Date(summary.created_at).toLocaleString()}
        </p>

        {summary.city && (
          <p style={{ marginBottom: '0.25rem' }}>
            <span role="img" aria-label="City">📍</span> <strong>City:</strong> {summary.city}
          </p>
        )}
        {summary.department && (
          <p style={{ marginBottom: '1rem' }}>
            <span role="img" aria-label="Department">🏛️</span> <strong>Department:</strong> {summary.department}
          </p>
        )}

        <hr style={{ borderTop: '1px solid #bee3db', margin: '1.5rem 0' }} />

        <div
          style={{
            whiteSpace: 'pre-wrap',
            fontSize: '1rem',
            lineHeight: '1.65',
            color: '#555b6e',
            marginBottom: '2rem',
          }}
        >
          {summary.summary}
        </div>

        {summary.topics?.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>Tagged Topics</h2>
            <ul style={{ paddingLeft: '1.2rem', color: '#89b0ae', fontSize: '0.95rem' }}>
              {summary.topics.map((t: string) => (
                <li key={t} style={{ marginBottom: '0.25rem' }}>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  )
}
