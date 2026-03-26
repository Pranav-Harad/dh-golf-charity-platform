import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Calendar, ChevronLeft, Target } from 'lucide-react'

export const revalidate = 60

export default async function CharityDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  
  const { data: charity } = await supabase
    .from('charities')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!charity) {
    notFound()
  }

  const events = charity.upcoming_events as { title: string, date: string, description: string }[] || []
  
  async function selectCharity() {
    'use server'
    const supabaseAction = createClient()
    const { data: { user } } = await supabaseAction.auth.getUser()
    if (user) {
      await supabaseAction.from('users').update({ charity_id: params.id }).eq('id', user.id)
    }
    // Redirect must be outside the `if` block or simply thrown to work correctly
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-black/95 text-zinc-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/charities" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors mb-8 text-sm font-medium">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Causes
        </Link>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden mb-12">
          <div className="h-64 md:h-96 relative bg-zinc-800">
            {charity.image_url ? (
              <img
                src={charity.image_url}
                alt={charity.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-600">
                Image Placeholder
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              {charity.category && (
                <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-zinc-800/80 backdrop-blur text-emerald-400 rounded-full text-sm font-medium border border-zinc-700">
                  <Target className="w-4 h-4" />
                  {charity.category}
                </div>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{charity.name}</h1>
            </div>
          </div>
          
          <div className="p-6 md:p-10">
            <h2 className="text-2xl font-semibold mb-4 text-white">About the Cause</h2>
            <div className="prose prose-invert max-w-none text-zinc-400 text-lg leading-relaxed mb-12">
              <p>{charity.description}</p>
            </div>

            {events.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-emerald-400" />
                  Upcoming Events
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {events.map((evt, i) => (
                    <div key={i} className="bg-zinc-800/50 border border-zinc-700 p-6 rounded-2xl">
                      <div className="text-emerald-400 font-semibold mb-2">{evt.date}</div>
                      <h3 className="text-xl font-medium text-white mb-2">{evt.title}</h3>
                      <p className="text-zinc-400 text-sm">{evt.description}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Support this Charity</h3>
                <p className="text-zinc-400 text-sm">Select them as your designated beneficiary in your account settings.</p>
              </div>
              <form action={selectCharity}>
                <button type="submit" className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-medium rounded-xl transition-colors whitespace-nowrap">
                  Select this Charity
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

