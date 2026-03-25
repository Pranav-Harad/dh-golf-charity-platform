import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const supabase = createClient()
  
  const { data: draws, error } = await supabase
    .from('draws')
    .select('*, prize_pools(total_pool, jackpot_carried_forward)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ draws })
}
