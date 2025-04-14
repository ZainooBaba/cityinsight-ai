'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'


type AppUser = {
    id: string
    email: string
    role: string
}

  
type AuthContextType = {
    user: AppUser | null
    loading: boolean
}
  
const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
})
  

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AppUser | null>(null)
    const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUserData = async () => {
      const { data } = await supabase.auth.getSession()
      const sessionUser = data.session?.user ?? null
  
      if (sessionUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', sessionUser.id)
          .single()
  
          setUser({
            id: sessionUser.id,
            email: sessionUser.email!,
            role: profile?.role || 'user',
          })
          
      } else {
        setUser(null)
      }
  
      setLoading(false)
    }
  
    getUserData()
  
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user ?? null
  
      if (sessionUser) {
        supabase
          .from('profiles')
          .select('role')
          .eq('id', sessionUser.id)
          .single()
          .then(({ data: profile }) => {
            setUser({
                id: sessionUser.id,
                email: sessionUser.email!, // ✅ use "!" here too
                role: profile?.role || 'user',
              })
          })
      } else {
        setUser(null)
      }
    })
  
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])
  

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
