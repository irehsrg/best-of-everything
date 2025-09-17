'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Profile } from '@/types'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchProfile(session.user.id)
      }

      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it manually
        console.log('Profile not found, creating manually...')

        try {
          const { data: userData } = await supabase.auth.getUser()
          const userEmail = userData.user?.email || user?.email || ''
          const emailVerified = userData.user?.email_confirmed_at != null

          console.log('Creating profile for:', { userId, userEmail, emailVerified })

          const { data: newProfile, error: createError } = await (supabase
            .from('profiles') as any)
            .insert({
              id: userId,
              email: userEmail,
              email_verified: emailVerified,
              display_name: null
            })
            .select()
            .single()

          if (createError) {
            console.error('Failed to create profile:', createError)
            // Try one more time with a different approach
            await new Promise(resolve => setTimeout(resolve, 2000))

            const { data: retryProfile, error: retryError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single()

            if (!retryError && retryProfile) {
              console.log('Profile found on retry!')
              setProfile(retryProfile)
            } else {
              console.error('Profile creation failed completely:', retryError)
              setProfile(null)
            }
          } else {
            console.log('Profile created successfully:', newProfile)
            setProfile(newProfile)
          }
        } catch (createError) {
          console.error('Exception creating profile:', createError)
          setProfile(null)
        }
      } else if (error) {
        console.error('Profile fetch error:', error)
        setProfile(null)
      } else {
        console.log('Profile found:', data)
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setProfile(null)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    profile,
    loading,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}