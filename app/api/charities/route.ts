import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  
  const supabase = createClient()
  
  let query = supabase.from('charities').select('*')
  
  if (category) {
    query = query.eq('category', category)
  }
  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  const { data: charities, error } = await query.order('name')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ charities })
}
