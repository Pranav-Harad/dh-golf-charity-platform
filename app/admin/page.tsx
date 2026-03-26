/* eslint-disable @typescript-eslint/no-explicit-any */
import AdminSimulationManager, { PublishButton } from '@/components/AdminSimulationManager'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { Users, DollarSign, Target, Trophy, Heart } from 'lucide-react'

export const revalidate = 0

export default async function AdminDashboardPage() {
  
  // Fetch Reports & Analytics Data
  const [
    { count: activeUsers },
    { data: prizePools },
    { data: draws },
    { data: _charities },
    { data: winners }
  ] = await Promise.all([
    supabaseAdmin.from('users').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active'),
    supabaseAdmin.from('prize_pools').select('total_pool'),
    supabaseAdmin.from('draws').select('*').order('created_at', { ascending: false }),
    supabaseAdmin.from('charities').select('*').order('created_at', { ascending: false }),
    supabaseAdmin.from('winners').select('*, users(full_name, email), draws(month)').order('created_at', { ascending: false })
  ])

  const totalPrizePools = prizePools?.reduce((acc: any, p: any) => acc + p.total_pool, 0) || 0
  const totalWinningsPending = winners?.filter((w: any) => w.payout_status === 'pending').reduce((acc: any, w: any) => acc + w.prize_amount, 0) || 0
  
  // Calculate Charity Contributions (10% of all confirmed prize winnings)
  const confirmedWinnings = winners?.filter((w: any) => w.payout_status === 'paid').reduce((acc: any, w: any) => acc + w.prize_amount, 0) || 0
  const totalCharityContributions = confirmedWinnings * 0.10

  // Match Stats
  const count5Match = winners?.filter((w: any) => w.match_type === '5_match').length || 0
  const count4Match = winners?.filter((w: any) => w.match_type === '4_match').length || 0
  const count3Match = winners?.filter((w: any) => w.match_type === '3_match').length || 0
  
  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Platform Overview</h1>
          <p className="text-zinc-400">Manage draws, charities, users, and review key metrics.</p>
        </div>
        <AdminSimulationManager />
      </div>

      {/* Analytics KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div className="flex items-center gap-4 text-emerald-400 mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl"><Users className="w-6 h-6" /></div>
            <span className="font-semibold">Active Subscribers</span>
          </div>
          <div className="text-4xl font-bold text-white">{activeUsers || 0}</div>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div className="flex items-center gap-4 text-cyan-400 mb-4">
            <div className="p-3 bg-cyan-500/10 rounded-xl"><DollarSign className="w-6 h-6" /></div>
            <span className="font-semibold">Total Prize Pools</span>
          </div>
          <div className="text-4xl font-bold text-white">${totalPrizePools.toFixed(2)}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div className="flex items-center gap-4 text-yellow-500 mb-4">
            <div className="p-3 bg-yellow-500/10 rounded-xl"><Trophy className="w-6 h-6" /></div>
            <span className="font-semibold">Pending Payouts</span>
          </div>
          <div className="text-4xl font-bold text-white">${totalWinningsPending.toFixed(2)}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div className="flex items-center gap-4 text-rose-400 mb-4">
            <div className="p-3 bg-rose-500/10 rounded-xl"><Heart className="w-6 h-6" /></div>
            <span className="font-semibold">Charity Collections</span>
          </div>
          <div className="text-4xl font-bold text-white">${totalCharityContributions.toFixed(2)}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div className="flex items-center gap-4 text-purple-400 mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl"><Target className="w-6 h-6" /></div>
            <span className="font-semibold">Match Statistics</span>
          </div>
          <div className="flex gap-4 items-end">
            <div>
              <div className="text-2xl font-bold text-white">{count5Match}</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">5 Match</div>
            </div>
            <div className="w-px h-8 bg-zinc-800"></div>
            <div>
              <div className="text-2xl font-bold text-white">{count4Match}</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">4 Match</div>
            </div>
            <div className="w-px h-8 bg-zinc-800"></div>
            <div>
              <div className="text-2xl font-bold text-white">{count3Match}</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">3 Match</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grids for Draw Management and Recent Winners */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Draw Management Snippet */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Draws</h2>
          </div>
          
          <div className="space-y-4">
            {draws?.slice(0, 5).map((draw: any) => (
              <div key={draw.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-black/40 border border-zinc-800/50 rounded-xl">
                <div>
                  <div className="text-white font-medium flex items-center gap-2">
                    {draw.month}
                    {draw.status === 'simulation' && (
                      <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase rounded border border-yellow-500/20">Draft</span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-500 capitalize">{draw.draw_type}</div>
                </div>
                <div className="mt-3 sm:mt-0 flex items-center gap-4">
                  <div className="text-sm font-mono text-emerald-400">
                    {draw.draw_numbers.join(' - ')}
                  </div>
                  {draw.status === 'simulation' && (
                    <PublishButton drawId={draw.id} month={draw.month} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Winners & Payouts Snippet */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col">
          <h2 className="text-xl font-semibold text-white mb-6">Recent Winners</h2>
          
          <div className="space-y-4 flex-1">
            {winners?.slice(0, 5).map((win: any) => (
                <div key={win.id} className="flex items-center justify-between p-4 bg-black/40 border border-zinc-800/50 rounded-xl">
                  <div>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <div className="text-white font-medium text-sm">{(win.users as any)?.full_name || 'Unknown'}</div>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <div className="text-xs text-zinc-500 capitalize">{(win.draws as any)?.month} • {win.match_type.replace('_',' ')}</div>
                  </div>
                 <div className="text-right">
                   <div className="text-emerald-400 font-semibold">${win.prize_amount.toFixed(2)}</div>
                   <div className={`text-xs capitalize ${win.payout_status === 'pending' ? 'text-yellow-500' : 'text-zinc-500'}`}>{win.verification_status} / {win.payout_status}</div>
                 </div>
               </div>
            ))}
            {(!winners || winners.length === 0) && (
              <div className="text-center py-12 text-zinc-500">No winners found.</div>
            )}
          </div>
          <a href="/admin/winners" className="mt-6 w-full py-3 bg-zinc-800 text-center text-white rounded-xl text-sm font-medium hover:bg-zinc-700 transition">
            View All Winners & Process Payouts
          </a>
        </div>

      </div>

    </div>
  )
}
