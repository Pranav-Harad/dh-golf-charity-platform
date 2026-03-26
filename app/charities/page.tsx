'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Search, MapPin, Target } from 'lucide-react'

type Charity = {
  id: string
  name: string
  description: string
  category: string
  image_url: string
  is_featured: boolean
}

export default function CharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)

  const categories = ['All', 'Education', 'Environment', 'Health', 'Animals', 'Poverty']

  useEffect(() => {
    async function fetchCharities() {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (category && category !== 'All') params.append('category', category)
      
      const res = await fetch(`/api/charities?${params.toString()}`)
      const data = await res.json()
      if (data.charities) {
        setCharities(data.charities)
      }
      setLoading(false)
    }

    // Debounce search
    const t = setTimeout(() => {
      fetchCharities()
    }, 300)
    return () => clearTimeout(t)
  }, [search, category])

  return (
    <div className="min-h-screen bg-black/95 text-zinc-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Our Causes
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Discover the amazing organizations your subscription helps support. Change your selected charity at any time.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 items-center justify-between bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search charities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide py-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c === 'All' ? '' : c)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                  (category === c || (c === 'All' && !category))
                    ? 'bg-emerald-500 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-zinc-900 rounded-3xl border border-zinc-800"></div>
            ))}
          </div>
        ) : charities.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No charities found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {charities.map((charity, i) => (
              <Link href={`/charities/${charity.id}`} key={charity.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-emerald-500/50 transition-all cursor-pointer h-full flex flex-col"
                >
                  <div className="h-48 bg-zinc-800 relative overflow-hidden">
                    {charity.image_url ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={charity.image_url}
                          alt={charity.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600 bg-zinc-800">
                        No Image
                      </div>
                    )}
                    {charity.is_featured && (
                      <div className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2 text-emerald-400 text-sm font-medium">
                      <MapPin className="w-4 h-4" />
                      {charity.category || 'General Cause'}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 line-clamp-1">{charity.name}</h3>
                    <p className="text-zinc-400 text-sm line-clamp-3 flex-1 mb-6">
                      {charity.description}
                    </p>
                    <div className="mt-auto">
                      <span className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                        View Details →
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
