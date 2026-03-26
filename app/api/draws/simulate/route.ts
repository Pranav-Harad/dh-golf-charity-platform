import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// Helper to generate 5 unique numbers between 1 and 45
function generateRandomNumbers(): number[] {
  const nums = new Set<number>()
  while (nums.size < 5) {
    nums.add(Math.floor(Math.random() * 45) + 1)
  }
  return Array.from(nums).sort((a, b) => a - b)
}

export async function POST(req: Request) {
  try {
    const { month, draw_type } = await req.json()
    if (!month || !draw_type) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

    // 1. Delete existing simulations for this month to allow re-runs
    await supabaseAdmin.from('draws').delete().eq('month', month).eq('status', 'simulation')

    // 2. Determine prize pool
    const { count: activeSubscribers, error: activeErr } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'active')

    if (activeErr) throw activeErr

    // Assume $5 per active subscriber goes into the pool
    const newPool = (activeSubscribers || 0) * 5

    // Get previous jackpot rollover
    const { data: lastDraw } = await supabaseAdmin
      .from('draws')
      .select('id, jackpot_rollover')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    let rolledOver = 0
    if (lastDraw?.jackpot_rollover) {
      const { data: lastPool } = await supabaseAdmin
        .from('prize_pools')
        .select('five_match_pool')
        .eq('draw_id', lastDraw.id)
        .single()
      rolledOver = lastPool?.five_match_pool || 0
    }

    const totalPool = newPool + rolledOver
    const fiveMatchPool = (newPool * 0.40) + rolledOver
    const fourMatchPool = newPool * 0.35
    const threeMatchPool = newPool * 0.25

    // 3. Generate Numbers
    let draw_numbers = generateRandomNumbers()
    if (draw_type === 'algorithmic') {
      // In a real scenario, fetch all scores, calculate frequencies, and weight random generation
      // For this implementation, we will use random as a base
      draw_numbers = generateRandomNumbers() 
    }

    // 4. Create Draw
    const { data: draw, error: drawErr } = await supabaseAdmin
      .from('draws')
      .insert({
        month,
        draw_type,
        draw_numbers,
        status: 'simulation'
      })
      .select()
      .single()

    if (drawErr) throw drawErr

    // 5. Create Prize Pool
    await supabaseAdmin.from('prize_pools').insert({
      draw_id: draw.id,
      total_pool: totalPool,
      five_match_pool: fiveMatchPool,
      four_match_pool: fourMatchPool,
      three_match_pool: threeMatchPool,
    })

    // 6. Check Winners
    const { data: allScores } = await supabaseAdmin.from('scores').select('user_id, score')
    // Group by user id
    const userScores: Record<string, Set<number>> = {}
    allScores?.forEach(s => {
      if (!userScores[s.user_id]) userScores[s.user_id] = new Set()
      userScores[s.user_id].add(s.score)
    })

    const drawSet = new Set(draw_numbers)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const winnersToInsert: any[] = []

    let matched5 = 0, matched4 = 0, matched3 = 0

    Object.entries(userScores).forEach(([userId, scores]) => {
      let matches = 0
      scores.forEach(s => {
        if (drawSet.has(s)) matches++
      })

      if (matches === 5) {
        matched5++
        winnersToInsert.push({ user_id: userId, draw_id: draw.id, match_type: '5_match', verification_status: 'pending', prize_amount: 0 })
      } else if (matches === 4) {
        matched4++
        winnersToInsert.push({ user_id: userId, draw_id: draw.id, match_type: '4_match', verification_status: 'approved', prize_amount: 0 })
      } else if (matches === 3) {
        matched3++
        winnersToInsert.push({ user_id: userId, draw_id: draw.id, match_type: '3_match', verification_status: 'approved', prize_amount: 0 })
      }
    })

    // --- FALLBACK: Guaranteed Winner Logic ---
    // If no traditional winners (3+ matches) were found, pick a "Raffle Winner" from all active subscribers
    if (winnersToInsert.length === 0) {
      const { data: activeUsers } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('subscription_status', 'active')

      if (activeUsers && activeUsers.length > 0) {
        const randomWinner = activeUsers[Math.floor(Math.random() * activeUsers.length)]
        matched3 = 1 // Treat as a 3-match win
        winnersToInsert.push({ 
          user_id: randomWinner.id, 
          draw_id: draw.id, 
          match_type: '3_match', 
          verification_status: 'approved', 
          prize_amount: 0 
        })
      }
    }

    // Assign prize amounts inside winnersToInsert
    winnersToInsert.forEach(w => {
      if (w.match_type === '5_match') w.prize_amount = fiveMatchPool / (matched5 || 1)
      if (w.match_type === '4_match') w.prize_amount = fourMatchPool / (matched4 || 1)
      if (w.match_type === '3_match') w.prize_amount = threeMatchPool / (matched3 || 1)
    })

    if (winnersToInsert.length > 0) {
      await supabaseAdmin.from('winners').insert(winnersToInsert)
    }

    // 7. Auto-update jackpot rollover status if nobody won 5 match
    await supabaseAdmin
      .from('draws')
      .update({ jackpot_rollover: matched5 === 0 })
      .eq('id', draw.id)

    return NextResponse.json({
      success: true,
      draw,
      stats: { totalPool, newPool, rolledOver, matched5, matched4, matched3, isRaffle: matched5+matched4+matched3 === 1 && winnersToInsert.length === 1 }
    })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
