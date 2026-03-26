'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, Loader2, CheckCircle } from 'lucide-react'
import { updateWinnerProof } from '@/app/dashboard/actions'

export default function ProofUpload({ winnerId, userId }: { winnerId: string, userId: string }) {
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      const file = e.target.files?.[0]
      if (!file) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${winnerId}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('winner-proofs')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('winner-proofs')
        .getPublicUrl(fileName)

      await updateWinnerProof(winnerId, publicUrl)
      setSuccess(true)
    } catch (error: any) {
      const err = error as Error
      console.error('Error uploading proof:', err.message)
      alert('Error uploading proof!')
    } finally {
      setUploading(false)
    }
  }

  if (success) {
    return (
      <div className="text-emerald-400 text-xs flex items-center gap-1 mt-2 font-medium">
        <CheckCircle className="w-3 h-3" /> Proof Uploaded
      </div>
    )
  }

  return (
    <div className="mt-2">
      <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 active:scale-95 transition text-xs font-medium rounded-md text-zinc-300">
        {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
        {uploading ? 'Uploading...' : 'Upload Proof (Image)'}
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleUpload} 
          disabled={uploading}
          className="hidden" 
        />
      </label>
    </div>
  )
}
