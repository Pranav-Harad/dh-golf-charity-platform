import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { CheckCircle2, AlertCircle, TrendingUp, Trophy, ArrowRight, Wallet } from 'lucide-react'
import ScoreEntryForm from '@/components/ScoreEntryForm'
import ProofUpload from '@/components/ProofUpload'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch all necessary data
  const [
    { data: profile },
    { data: scores },
    { data: myCharity },
    { data: winnings },
    { data: latestDraw }
  ] = await Promise.all([
    supabase.from('users').select('*').eq('id', user.id).single(),
    supabase.from('scores').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('users').select('charity_id, charity_contribution_percent, charities(name, image_url)').eq('id', user.id).single(),
    supabase.from('winners').select('*, draws(month)').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('draws').select('*').eq('status', 'published').order('created_at', { ascending: false }).limit(1).single()
  ])

  const isActive = profile?.subscription_status === 'active'
  const isLapsed = profile?.subscription_status === 'lapsed'

  const totalWon = winnings?.filter(w => w.payout_status === 'paid').reduce((acc, w) => acc + w.prize_amount, 0) || 0
  const pendingWon = winnings?.filter(w => w.payout_status === 'pending').reduce((acc, w) => acc + w.prize_amount, 0) || 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          Welcome back, {profile?.full_name?.split(' ')[0]}
        </h1>
        <p className="text-zinc-400">Manage your subscription, scores, and charity contributions.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Subscription Status Module */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-hidden">
            <div className="flex items-start justify-between relative z-10">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Subscription Status</h3>
                <div className="flex items-center gap-2 mt-4">
                  {isActive ? (
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" /> Active
                    </div>
                  ) : (
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${
                      isLapsed ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      <AlertCircle className="w-4 h-4" /> {isLapsed ? 'Lapsed' : 'Inactive'}
                    </div>
                  )}
                </div>
                {isActive && profile?.subscription_renewal_date && (
                  <p className="text-zinc-400 text-sm mt-3">
                    Renews on {new Date(profile.subscription_renewal_date).toLocaleDateString()}
                  </p>
                )}
              </div>
              {!isActive && (
                <Link href="/subscribe" className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-lg shadow-emerald-500/20">
                  Subscribe Now <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
            {isActive && (
              <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none"></div>
            )}
          </div>

          {/* Score Management Module */}
          {isActive ? (
            <ScoreEntryForm initialScores={scores || []} />
          ) : (
             <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center py-12">
               <TrendingUp className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
               <h3 className="text-lg font-medium text-white mb-2">Scores Locked</h3>
               <p className="text-zinc-400 text-sm max-w-sm mx-auto">Active subscription required to enter scores and participate in draws.</p>
             </div>
          )}

        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          {/* Charity Module */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Your Charity</h3>
            {myCharity?.charities ? (
              (() => {
                const c = Array.isArray(myCharity.charities) ? myCharity.charities[0] : (myCharity.charities as any);
                return (
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      {c?.image_url ? (
                        <img src={c.image_url} alt="Charity" className="w-16 h-16 rounded-lg object-cover bg-zinc-800" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-600">Logo</div>
                      )}
                      <div>
                        <h4 className="text-white font-medium">{c?.name || 'Charity'}</h4>
                        <Link href={`/charities/${myCharity.charity_id}`} className="text-emerald-400 text-xs hover:underline">View Profile</Link>
                      </div>
                    </div>
                    <div className="bg-black/30 p-4 rounded-lg border border-zinc-800/50">
                      <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wider">Contribution</div>
                      <div className="text-2xl font-bold font-mono text-emerald-400">{myCharity.charity_contribution_percent}%</div>
                      <p className="text-xs text-zinc-400 mt-2">Of your prize winnings will be donated automatically.</p>
                    </div>
                  </div>
                )
              })()
            ) : (
              <div className="text-center py-6">
                <p className="text-zinc-500 text-sm mb-4">You haven&apos;t selected a charity yet.</p>
                <Link href="/charities" className="text-emerald-400 text-sm font-medium hover:underline">Browse Charities</Link>
              </div>
            )}
          </div>

          {/* Draw Participation & Winnings */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
               <Trophy className="w-5 h-5 text-yellow-500" /> Winnings Overview
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50">
                <div className="text-xs text-zinc-400 mb-1">Total Won</div>
                <div className="text-2xl font-bold text-white">${totalWon.toFixed(2)}</div>
              </div>
              <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20">
                <div className="text-xs text-yellow-500/80 mb-1">Pending Sync</div>
                <div className="text-2xl font-bold text-yellow-500">${pendingWon.toFixed(2)}</div>
              </div>
            </div>

            {winnings && winnings.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Recent Wins</h4>
                {winnings.slice(0,3).map(win => (
                  <div key={win.id} className="flex flex-col gap-3 text-sm bg-black/20 p-3 rounded-lg border border-zinc-800/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white font-medium block">{(win.draws as any)?.month || 'Draw'}</span>
                        <span className="text-xs text-zinc-500 inline-block mt-0.5 px-2 py-0.5 bg-zinc-800 rounded">{win.match_type.replace('_', ' ')}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-400 font-semibold">${win.prize_amount.toFixed(2)}</div>
                        <div className={`text-xs capitalize ${win.verification_status === 'pending' ? 'text-yellow-500' : 'text-zinc-500'}`}>
                          {win.verification_status === 'approved' ? win.payout_status : `${win.verification_status} Review`}
                        </div>
                      </div>
                    </div>
                    
                    {win.verification_status === 'pending' && !win.proof_url && (
                       <div className="pt-2 border-t border-zinc-800/50 flex justify-between items-center">
                         <span className="text-xs text-zinc-400">Proof required for payout</span>
                         <ProofUpload winnerId={win.id} userId={user.id} />
                       </div>
                    )}
                    {win.proof_url && win.verification_status === 'pending' && (
                       <div className="pt-2 border-t border-zinc-800/50">
                         <span className="text-xs text-yellow-500/80">Proof submitted. Awaiting review.</span>
                       </div>
                    )}
                    {win.verification_status === 'rejected' && (
                       <div className="pt-2 border-t border-red-500/30 flex justify-between items-center">
                         <span className="text-xs text-red-400">Proof rejected. Re-upload.</span>
                         <ProofUpload winnerId={win.id} userId={user.id} />
                       </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 text-sm italic">No winnings yet. Enter your scores to participate in the next draw!</p>
            )}

            {latestDraw && (
              <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
                <p className="text-zinc-400 text-xs mb-1">Latest Draw Result</p>
                <p className="text-white text-sm font-medium">{latestDraw.month}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
