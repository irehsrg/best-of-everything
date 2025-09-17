'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface AuthFormProps {
  mode: 'signin' | 'signup'
  onToggle: () => void
  onSuccess: () => void
}

export default function AuthForm({ mode, onToggle, onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (mode === 'signup') {
        console.log('Attempting to sign up user with email:', email)

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        console.log('Signup result:', { data, error })

        if (error) throw error

        if (data.user) {
          console.log('User created successfully:', data.user.id)
          setMessage('Account created! Check your email for the confirmation link.')
        } else {
          setMessage('Check your email for the confirmation link!')
        }
      } else {
        console.log('Attempting to sign in user with email:', email)

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        console.log('Signin result:', { data, error })

        if (error) throw error

        console.log('Sign in successful')
        onSuccess()
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      setError(`Authentication failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-100 border border-red-200 rounded">
          {error}
        </div>
      )}

      {message && (
        <div className="p-3 text-sm text-green-600 bg-green-100 border border-green-200 rounded">
          {message}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          placeholder="Enter your password"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
      </Button>


      <div className="text-center">
        <Button
          type="button"
          variant="link"
          onClick={onToggle}
          className="text-sm"
        >
          {mode === 'signin'
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"
          }
        </Button>
      </div>
    </form>
  )
}