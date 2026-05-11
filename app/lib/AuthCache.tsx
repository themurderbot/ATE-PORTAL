'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from './supabase'

type Client = {
  id: string
  company_name: string
  email: string
  phone: string
}

interface AuthCacheType {
  client: Client | null
  loading: boolean
  refresh: () => Promise<void>
}

const AuthCacheContext = createContext<AuthCacheType>({
  client: null,
  loading: true,
  refresh: async () => {},
})

export function AuthCacheProvider({ children }: { children: ReactNode }) {
  const [client, setClient]   = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadClient() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) {
        setClient(null)
        setLoading(false)
        return
      }
      const { data } = await supabase
        .from('clients')
        .select('id, company_name, email, phone')
        .eq('email', user.email)
        .maybeSingle()
      setClient(data || null)
    } catch (e) {
      console.error('AuthCache:', e)
      setClient(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadClient() }, [])

  return (
    <AuthCacheContext.Provider value={{ client, loading, refresh: loadClient }}>
      {children}
    </AuthCacheContext.Provider>
  )
}

export const useAuth = () => useContext(AuthCacheContext)