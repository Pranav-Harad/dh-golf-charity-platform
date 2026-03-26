/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { Search as SearchIcon, Mail, CreditCard, Heart, Trophy, Trash2, Edit2, X } from 'lucide-react'
import { toast } from 'sonner'

type User = {
  id: string
  full_name: string | null
  email: string | null
  subscription_status: string
  subscription_plan: string | null
  charity_id: string | null
  created_at: string
  charities?: {
    name: string
  } | null
}

export default function UserList({ initialUsers }: { initialUsers: User[] }) {
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const filteredUsers = initialUsers.filter(user => 
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
        />
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-800/30">
                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Charity</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-white font-medium">{user.full_name || 'Anonymous'}</span>
                      <span className="text-zinc-500 text-sm flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {user.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.subscription_status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}>
                      {user.subscription_status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <CreditCard className="w-4 h-4 text-zinc-500" />
                      <span className="capitalize">{user.subscription_plan || 'None'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Heart className="w-4 h-4 text-red-400/60" />
                      <span>{user.charities?.name || 'Not Selected'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedUser(user)}
                      className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-all text-sm font-medium flex items-center gap-2 ml-auto"
                    >
                      <Trophy className="w-4 h-4" />
                      Manage Scores
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="p-12 text-center text-zinc-500">
            No users found matching your search.
          </div>
        )}
      </div>

      {/* Score Management Modal */}
      {selectedUser && (
        <ScoreModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  )
}

function ScoreModal({ user, onClose }: { user: User, onClose: () => void }) {
  const [scores, setScores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingScore, setEditingScore] = useState<any>(null)
  const [newValue, setNewValue] = useState('')

  const fetchScores = async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/users/${user.id}/scores`)
    const data = await res.json()
    setScores(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchScores()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id])

  const handleDelete = async (scoreId: string) => {
    if (!confirm('Are you sure you want to delete this score?')) return
    const res = await fetch(`/api/admin/users/${user.id}/scores?scoreId=${scoreId}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Score deleted')
      fetchScores()
    }
  }

  const handleUpdate = async () => {
    const val = parseInt(newValue)
    if (isNaN(val) || val < 1 || val > 45) {
      toast.error('Score must be between 1 and 45')
      return
    }
    const res = await fetch(`/api/admin/users/${user.id}/scores`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scoreId: editingScore.id, newScore: val })
    })
    if (res.ok) {
      toast.success('Score updated')
      setEditingScore(null)
      fetchScores()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Manage Scores</h2>
            <p className="text-zinc-500 text-sm">{user.full_name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="py-20 text-center text-zinc-500">Loading scores...</div>
          ) : scores.length === 0 ? (
            <div className="py-20 text-center text-zinc-500">No scores found for this user.</div>
          ) : (
            <div className="space-y-4">
              {scores.map(s => (
                <div key={s.id} className="bg-zinc-800/50 border border-zinc-700/50 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    {editingScore?.id === s.id ? (
                      <input 
                        type="number" 
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        className="w-20 bg-zinc-900 border border-emerald-500/50 rounded-lg px-2 py-1 text-white outline-none"
                        autoFocus
                      />
                    ) : (
                      <span className="text-2xl font-bold text-emerald-400">{s.score}</span>
                    )}
                    <span className="text-zinc-500 text-sm block">
                      {new Date(s.score_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {editingScore?.id === s.id ? (
                      <button 
                        onClick={handleUpdate}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium"
                      >
                        Save
                      </button>
                    ) : (
                      <button 
                        onClick={() => { setEditingScore(s); setNewValue(s.score.toString()); }}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(s.id)}
                      className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
