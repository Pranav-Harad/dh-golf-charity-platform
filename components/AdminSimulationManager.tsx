/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Play, Send, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminSimulationManager() {
  const [isSimulating, setIsSimulating] = useState(false)
  const [drawType, setDrawType] = useState('random')
  const router = useRouter()

  const handleSimulate = async () => {
    setIsSimulating(true)
    try {
      const month = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
      const res = await fetch('/api/draws/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          month, 
          draw_type: drawType 
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Simulation failed')

      toast.success(`Simulation for ${month} completed!`)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSimulating(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <select 
        value={drawType}
        onChange={(e) => setDrawType(e.target.value)}
        className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm rounded-lg px-3 py-2 outline-none focus:border-emerald-500 transition"
      >
        <option value="random">Random Draw</option>
        <option value="algorithmic">Algorithmic (Participation Weighted)</option>
      </select>

      <button
        onClick={handleSimulate}
        disabled={isSimulating}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-800 text-white rounded-lg transition text-sm font-medium shadow-lg shadow-emerald-500/20"
      >
        {isSimulating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Simulating...
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            Run New Simulation
          </>
        )}
      </button>
    </div>
  )
}

export function PublishButton({ drawId, month }: { drawId: string; month: string }) {
  const [isPublishing, setIsPublishing] = useState(false)
  const router = useRouter()

  const handlePublish = async () => {
    if (!confirm(`Are you sure you want to publish the ${month} draw results? This will make them visible to all users.`)) return
    
    setIsPublishing(true)
    try {
      const res = await fetch('/api/draws/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draw_id: drawId })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Publishing failed')

      toast.success(`Draw results for ${month} published!`)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <button
      onClick={handlePublish}
      disabled={isPublishing}
      className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition text-xs font-semibold border border-cyan-500/20"
    >
      {isPublishing ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <Send className="w-3 h-3" />
      )}
      Publish
    </button>
  )
}
