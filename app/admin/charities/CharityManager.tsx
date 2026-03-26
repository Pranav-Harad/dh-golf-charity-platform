'use client'

import { useState } from 'react'
import { saveCharity, deleteCharity } from '@/app/admin/actions'
import { Plus, Edit2, Trash2, X } from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CharityManager({ initialCharities }: { initialCharities: any[] }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editing, setEditing] = useState<any | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (c: any) => {
    setEditing(c)
    setIsAdding(false)
  }

  const handleAddNew = () => {
    setEditing(null)
    setIsAdding(true)
  }

  const closeForm = () => {
    setEditing(null)
    setIsAdding(false)
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        {initialCharities.map(c => (
           <div key={c.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-start justify-between">
             <div className="flex items-start gap-4">
               {c.image_url ? (
                 <>
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src={c.image_url} alt={c.name} className="w-12 h-12 rounded object-cover bg-zinc-800" />
                 </>
               ) : (
                 <div className="w-12 h-12 rounded bg-zinc-800 flex items-center justify-center text-xs text-zinc-600">Logo</div>
               )}
               <div>
                 <h3 className="text-white font-medium">{c.name}</h3>
                 <p className="text-zinc-500 text-sm mt-1">{c.description || 'No description'}</p>
                 <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded inline-block mt-2">
                   {c.category || 'General'}
                 </span>
               </div>
             </div>
             <div className="flex items-center gap-2">
               <button onClick={() => handleEdit(c)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition">
                 <Edit2 className="w-4 h-4" />
               </button>
               <form action={deleteCharity.bind(null, c.id)}>
                 <button type="submit" className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded transition">
                   <Trash2 className="w-4 h-4" />
                 </button>
               </form>
             </div>
           </div>
        ))}
      </div>

      <div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl sticky top-8">
          {(isAdding || editing) ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">{editing ? 'Edit Charity' : 'Add Charity'}</h3>
                <button onClick={closeForm} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
              </div>
              <form action={saveCharity} onSubmit={closeForm} className="space-y-4">
                {editing && <input type="hidden" name="id" value={editing.id} />}
                
                <div>
                  <label className="text-xs text-zinc-400 uppercase tracking-wider">Name</label>
                  <input required name="name" defaultValue={editing?.name} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 mt-1" />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 uppercase tracking-wider">Category</label>
                  <input required name="category" defaultValue={editing?.category} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 mt-1" />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 uppercase tracking-wider">Description</label>
                  <textarea name="description" defaultValue={editing?.description} rows={3} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 mt-1" />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 uppercase tracking-wider">Image URL</label>
                  <input name="image_url" defaultValue={editing?.image_url} className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 mt-1" />
                </div>
                <button type="submit" className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition">
                  {editing ? 'Save Changes' : 'Create Charity'}
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mx-auto mb-4 border border-zinc-700/50">
                <Target className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="text-white font-medium mb-2">Manage Partners</h3>
              <p className="text-sm text-zinc-400 mb-6">Add new verified 501(c)(3) charities to the platform.</p>
              <button onClick={handleAddNew} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-sm font-medium transition">
                <Plus className="w-4 h-4" /> Add Charity
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Target(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
  )
}
