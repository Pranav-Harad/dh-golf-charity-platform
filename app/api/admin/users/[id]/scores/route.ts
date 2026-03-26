/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// GET all scores for a user
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('scores')
      .select('*')
      .eq('user_id', params.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE a score
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url)
    const scoreId = searchParams.get('scoreId')
    
    if (!scoreId) return NextResponse.json({ error: 'Missing scoreId' }, { status: 400 })

    const { error } = await supabaseAdmin
      .from('scores')
      .delete()
      .eq('id', scoreId)
      .eq('user_id', params.id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PATCH a score
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { scoreId, newScore } = await req.json()
    
    if (!scoreId || newScore === undefined) {
      return NextResponse.json({ error: 'Missing params' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('scores')
      .update({ score: newScore })
      .eq('id', scoreId)
      .eq('user_id', params.id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
