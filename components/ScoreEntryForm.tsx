'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Plus, Edit2, Check, X } from 'lucide-react'

// Assuming a Score type based on our database
type Score = {
  id: string
  score: number
  score_date: string
  created_at: string
}

interface ScoreEntryFormProps {
  initialScores?: Score[]
  onScoreAdded?: () => void
}

export default function ScoreEntryForm({ initialScores = [], onScoreAdded }: ScoreEntryFormProps) {
  const [scores, setScores] = useState<Score[]>(initialScores)
  const [loading, setLoading] = useState(false)
  
  // New Score Form States
  const [newScore, setNewScore] = useState('')
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0])
  const [formError, setFormError] = useState('')

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editScoreVal, setEditScoreVal] = useState('')
  const [editDateVal, setEditDateVal] = useState('')

  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    
    const s = parseInt(newScore)
    if (isNaN(s) || s < 1 || s > 45) {
      setFormError('Score must be between 1 and 45')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: s, score_date: newDate })
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error)
      
      // The DB trigger keeps max 5 scores, so let's just refresh visually
      // In a real app we might mutate SWR or React Query here
      if (onScoreAdded) onScoreAdded()
      else window.location.reload()

      setNewScore('')
    } catch (err) {
      const error = err as Error
      setFormError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (score: Score) => {
    setEditingId(score.id)
    setEditScoreVal(score.score.toString())
    setEditDateVal(score.score_date)
  }

  const handleUpdate = async (id: string) => {
    const s = parseInt(editScoreVal)
    if (isNaN(s) || s < 1 || s > 45) {
      alert('Score must be between 1 and 45')
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`/api/scores/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: s, score_date: editDateVal })
      })
      if (!res.ok) throw new Error('Failed to update')

      setScores(prev => prev.map(sc => sc.id === id ? { ...sc, score: s, score_date: editDateVal } : sc))
      setEditingId(null)
    } catch {
      alert('Error updating score')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Score Management</h3>
      
      {/* Add New Score */}
      <form onSubmit={handleAddScore} className="flex gap-4 items-end mb-8 bg-black/20 p-4 rounded-lg">
        <div className="flex-1">
          <label className="block text-xs text-zinc-400 mb-1">Score (1-45)</label>
          <input
            type="number"
            min="1"
            max="45"
            required
            value={newScore}
            onChange={(e) => setNewScore(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-zinc-400 mb-1">Date</label>
          <input
            type="date"
            required
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-emerald-500 outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center min-w-[100px]"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="flex items-center gap-1"><Plus className="w-4 h-4"/> Add</span>}
        </button>
      </form>

      {formError && <p className="text-red-400 text-sm mb-4">{formError}</p>}

      {/* List Recent Scores */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-4">Recent Scores (Max 5)</h4>
        {scores.length === 0 ? (
          <p className="text-zinc-500 italic text-sm">No scores submitted yet.</p>
        ) : (
          scores.map((score, index) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              key={score.id}
              className="flex items-center justify-between bg-zinc-800/50 border border-zinc-700/50 p-4 rounded-lg"
            >
              {editingId === score.id ? (
                <div className="flex items-center gap-4 flex-1">
                  <input
                    type="number"
                    min="1" max="45"
                    value={editScoreVal}
                    onChange={(e) => setEditScoreVal(e.target.value)}
                    className="w-20 bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-white text-sm outline-none"
                  />
                  <input
                    type="date"
                    value={editDateVal}
                    onChange={(e) => setEditDateVal(e.target.value)}
                    className="bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-white text-sm outline-none"
                  />
                  <div className="ml-auto flex gap-2">
                    <button onClick={() => handleUpdate(score.id)} disabled={loading} className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 transition">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-1.5 bg-zinc-700 text-zinc-400 rounded hover:bg-zinc-600 transition">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-6">
                    <div className="px-3 py-2 bg-black/40 rounded-lg border border-zinc-700/50">
                      <span className="text-3xl font-bold bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">{score.score}</span>
                    </div>
                    <div className="text-sm text-zinc-400">
                      <div>Played on</div>
                      <div className="text-white font-medium">{new Date(score.score_date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <button onClick={() => startEdit(score)} className="p-2 text-zinc-400 hover:text-white transition">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
