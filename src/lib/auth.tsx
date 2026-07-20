// oxlint-disable react/only-export-components
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { toast } from 'sonner'
import { demoData } from '../data/demoData'
import type { Profile } from '../types/platform'
import { isSupabaseConfigured, supabase } from './supabase'

type AuthContextValue = {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithMagicLink: (email: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  signOut: () => Promise<void>
  demoLogin: (role: 'customer' | 'admin') => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const localAuthKey = 'bli-local-auth'

function localUser(role: 'customer' | 'admin'): User {
  const profile = role === 'admin' ? demoData.profiles[1] : demoData.profiles[0]
  return {
    id: profile.id,
    app_metadata: {},
    user_metadata: { full_name: profile.full_name },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    email: profile.email,
  } as User
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function bootstrap() {
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.auth.getSession()
        if (!mounted) return
        setSession(data.session)
        setUser(data.session?.user ?? null)
        if (data.session?.user) await loadProfile(data.session.user.id, data.session.user.email)
        setLoading(false)
        return
      }
      const stored = localStorage.getItem(localAuthKey) as 'customer' | 'admin' | null
      if (stored) {
        const fake = localUser(stored)
        setUser(fake)
        setProfile(demoData.profiles.find((item) => item.id === fake.id) ?? null)
      }
      setLoading(false)
    }
    bootstrap()

    if (isSupabaseConfigured && supabase) {
      const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
        setSession(nextSession)
        setUser(nextSession?.user ?? null)
        if (nextSession?.user) await loadProfile(nextSession.user.id, nextSession.user.email)
        else setProfile(null)
      })
      return () => listener.subscription.unsubscribe()
    }
    return () => { mounted = false }
  }, [])

  async function loadProfile(userId: string, email?: string) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
      if (error) console.warn(error)
      if (data) {
        setProfile(data as Profile)
      } else {
        const created = { id: userId, full_name: email?.split('@')[0] || 'New Client', email: email || '', role: 'customer' }
        await supabase.from('profiles').insert(created)
        setProfile(created as Profile)
      }
      return
    }
    setProfile(demoData.profiles.find((item) => item.id === userId) ?? null)
  }

  const value = useMemo<AuthContextValue>(() => ({
    user,
    profile,
    session,
    loading,
    isAdmin: profile?.role === 'admin' || profile?.role === 'staff',
    async signUp(email, password, fullName, phone) {
      if (!isSupabaseConfigured || !supabase) {
        localStorage.setItem(localAuthKey, 'customer')
        const fake = localUser('customer')
        setUser(fake)
        setProfile({ ...demoData.profiles[0], email, full_name: fullName, phone })
        toast.success('Demo account created')
        return
      }
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName, phone } } })
      if (error) throw error
      if (data.user) await supabase.from('profiles').upsert({ id: data.user.id, email, full_name: fullName, phone, role: 'customer' })
      toast.success('Check your email to verify your account')
    },
    async signIn(email, password) {
      if (!isSupabaseConfigured || !supabase) {
        const role = email.toLowerCase().includes('admin') ? 'admin' : 'customer'
        localStorage.setItem(localAuthKey, role)
        const fake = localUser(role)
        setUser(fake)
        setProfile(demoData.profiles.find((item) => item.id === fake.id) ?? null)
        toast.success(`Signed in as demo ${role}`)
        return
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    },
    async signInWithMagicLink(email) {
      if (!isSupabaseConfigured || !supabase) {
        toast.success('Demo mode: use password sign in or demo buttons')
        return
      }
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin + '/dashboard' } })
      if (error) throw error
      toast.success('Magic link sent')
    },
    async resetPassword(email) {
      if (!isSupabaseConfigured || !supabase) {
        toast.success('Demo mode password reset acknowledged')
        return
      }
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/auth' })
      if (error) throw error
      toast.success('Password reset email sent')
    },
    async signOut() {
      if (isSupabaseConfigured && supabase) await supabase.auth.signOut()
      localStorage.removeItem(localAuthKey)
      setSession(null)
      setUser(null)
      setProfile(null)
    },
    demoLogin(role) {
      localStorage.setItem(localAuthKey, role)
      const fake = localUser(role)
      setUser(fake)
      setProfile(demoData.profiles.find((item) => item.id === fake.id) ?? null)
      toast.success(`Signed in as demo ${role}`)
    },
  }), [loading, profile, session, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
