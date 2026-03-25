import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Home, User as UserIcon } from 'lucide-react'
import { logout } from '@/app/login/actions'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('full_name, subscription_status')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-black/95 text-zinc-100 flex flex-col">
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            GolfVault
          </Link>
          
          <div className="flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="text-zinc-400 hover:text-white flex items-center gap-2 transition-colors">
              <Home className="w-4 h-4" /> Dashboard
            </Link>
            <div className="hidden sm:flex items-center gap-2 text-emerald-400">
              <UserIcon className="w-4 h-4" />
              {profile?.full_name}
            </div>
            <form action={logout}>
              <button type="submit" className="text-zinc-400 hover:text-red-400 flex items-center gap-2 transition-colors">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  )
}
