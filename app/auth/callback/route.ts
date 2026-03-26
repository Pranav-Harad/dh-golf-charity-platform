import { createClient } from '@/lib/supabase/server'
import { getURL } from '@/lib/utils'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const url = getURL()
      return NextResponse.redirect(`${url}${next.startsWith('/') ? next.substring(1) : next}`)
    }
  }

  // return the user to an error page with instructions
  const url = getURL()
  return NextResponse.redirect(`${url}login?error=Could not authenticate user`)
}
