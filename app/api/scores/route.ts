import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: scores, error } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ scores })
}

export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { score, score_date } = await req.json()

    if (score < 1 || score > 45) {
      return NextResponse.json({ error: 'Score must be between 1 and 45' }, { status: 400 })
    }

    const { data: newScore, error } = await supabase
      .from('scores')
      .insert({
        user_id: user.id,
        score,
        score_date,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ score: newScore })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
