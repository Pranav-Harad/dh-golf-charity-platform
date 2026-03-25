import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { draw_id } = await req.json()

    if (!draw_id) return NextResponse.json({ error: 'Missing draw_id' }, { status: 400 })

    const { data: draw, error } = await supabaseAdmin
      .from('draws')
      .update({ status: 'published' })
      .eq('id', draw_id)
      .eq('status', 'simulation')
      .select()
      .single()

    if (error || !draw) {
      throw error || new Error('Draw not found or already published')
    }

    return NextResponse.json({ success: true, draw })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
