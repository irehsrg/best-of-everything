import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  console.log('Auth callback received:', { code: !!code, error, error_description })

  if (error) {
    console.error('Auth callback error:', error, error_description)
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error)}`)
  }

  if (code) {
    try {
      const supabase = await createClient()
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      console.log('Code exchange result:', { success: !!data?.session, error: exchangeError })

      if (!exchangeError && data?.session) {
        // Give the trigger time to create the profile
        await new Promise(resolve => setTimeout(resolve, 1000))
        return NextResponse.redirect(`${origin}/`)
      } else {
        console.error('Code exchange failed:', exchangeError)
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=exchange_failed`)
      }
    } catch (err) {
      console.error('Exception in auth callback:', err)
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=exception`)
    }
  }

  console.log('No code in callback')
  return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_code`)
}