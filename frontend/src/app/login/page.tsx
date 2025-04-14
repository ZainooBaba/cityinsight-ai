'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabaseClient'
import { useAuth } from '@/components/AuthProvider'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.push('/')
    }
  }, [loading, user, router])

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) setMessage(error.message)
    else setMessage('📩 Check your email for a magic link')
  }

  if (loading || user) return <p style={{ textAlign: 'center', marginTop: '3rem' }}>Loading...</p>

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#faf9f9',
        padding: '2rem',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          border: '1px solid #bee3db',
          borderRadius: '1rem',
          padding: '2rem',
          width: '100%',
          maxWidth: '28rem',
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)',
        }}
      >
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: '600',
            color: '#555b6e',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
        >
          Sign In
        </h1>

        <input
          type="email"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #89b0ae',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontSize: '1rem',
            color: '#555b6e',
            backgroundColor: '#fff',
            transition: 'border-color 0.2s',
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            backgroundColor: '#89b0ae',
            color: '#fff',
            fontWeight: 600,
            fontSize: '1rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#555b6e'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#89b0ae'
          }}
        >
          Send Magic Link
        </button>

        {message && (
          <p
            style={{
              marginTop: '1rem',
              color: '#555b6e',
              fontSize: '0.875rem',
              textAlign: 'center',
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
