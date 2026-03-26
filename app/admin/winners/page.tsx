import { supabaseAdmin } from '@/lib/supabase/admin'
import { verifyWinner, processPayout } from '@/app/admin/actions'
import { Check, X, ExternalLink, DollarSign } from 'lucide-react'

export const revalidate = 0

export default async function AdminWinnersPage() {
  const { data: winners } = await supabaseAdmin
    .from('winners')
    .select('*, users(full_name, email), draws(month)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Winners Management</h1>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="bg-zinc-800/50 text-xs uppercase text-zinc-500 border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4">Winner</th>
              <th className="px-6 py-4">Draw Info</th>
              <th className="px-6 py-4">Prize</th>
              <th className="px-6 py-4">Proof</th>
              <th className="px-6 py-4">Verification</th>
              <th className="px-6 py-4 text-right">Payout Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {winners?.map((win) => (
              <tr key={win.id} className="hover:bg-zinc-800/20 transition">
                <td className="px-6 py-4">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <div className="text-white font-medium">{(win.users as any)?.full_name}</div>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <div className="text-xs">{(win.users as any)?.email}</div>
                </td>
                <td className="px-6 py-4">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <div className="text-white">{(win.draws as any)?.month}</div>
                  <div className="text-xs uppercase bg-zinc-800 px-2 py-0.5 rounded inline-block mt-1">
                    {win.match_type.replace('_',' ')}
                  </div>
                </td>
                <td className="px-6 py-4 text-emerald-400 font-bold">${win.prize_amount.toFixed(2)}</td>
                <td className="px-6 py-4">
                  {win.proof_url ? (
                    <a href={win.proof_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300">
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-zinc-600 italic">None</span>
                  )}
                </td>
                <td className="px-6 py-4">
                   {win.verification_status === 'pending' ? (
                     <div className="flex gap-2">
                       <form action={verifyWinner.bind(null, win.id, 'approved')}>
                         <button type="submit" disabled={!win.proof_url} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded disabled:opacity-50">
                           <Check className="w-4 h-4" />
                         </button>
                       </form>
                       <form action={verifyWinner.bind(null, win.id, 'rejected')}>
                         <button type="submit" disabled={!win.proof_url} className="px-2 py-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded disabled:opacity-50">
                           <X className="w-4 h-4" />
                         </button>
                       </form>
                     </div>
                   ) : (
                     <span className={`px-2 py-1 rounded text-xs font-medium ${win.verification_status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                       {win.verification_status.toUpperCase()}
                     </span>
                   )}
                </td>
                <td className="px-6 py-4 text-right">
                  {win.payout_status === 'paid' ? (
                    <span className="text-emerald-400 font-medium text-xs">PAID</span>
                  ) : (
                    <form action={processPayout.bind(null, win.id)}>
                      <button 
                        type="submit" 
                        disabled={win.verification_status !== 'approved'}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 rounded-lg text-xs font-medium disabled:opacity-30 transition"
                      >
                        <DollarSign className="w-3 h-3" /> Mark Paid
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!winners || winners.length === 0) && (
          <div className="p-8 text-center text-zinc-500">No winners to manage yet.</div>
        )}
      </div>
    </div>
  )
}
