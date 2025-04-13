'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) setMessage(error.message)
    else setMessage('Check your email for a magic link')
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Login</h1>
      <input
        type="email"
        value={email}
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: '0.5rem', marginRight: '1rem' }}
      />
      <button onClick={handleLogin}>Send Magic Link</button>
      <p>{message}</p>
    </div>
  )
}
