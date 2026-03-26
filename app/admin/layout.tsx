import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogOut, LayoutDashboard, Users, Trophy, Target, Settings, ShieldAlert } from 'lucide-react'
import { logout } from '@/app/login/actions'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || ['admin@golfvault.com']
  if (!ADMIN_EMAILS.includes(user.email!)) {
    // Unauthorized
    return (
      <div className="min-h-screen bg-black/95 flex items-center justify-center p-4 text-center">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-zinc-400 mb-6">You do not have administrative privileges to view this area.</p>
          <Link href="/dashboard" className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black/95 text-zinc-100 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-zinc-900/50 border-r border-zinc-800 flex flex-col hidden md:flex sticky top-0 h-screen">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
          <Link href="/" className="font-bold text-xl bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Admin Portal
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:text-white hover:bg-zinc-800/50 text-zinc-400 transition cursor-pointer font-medium">
            <LayoutDashboard className="w-5 h-5 text-emerald-400" /> Overview
          </Link>
          <Link href="/admin/winners" className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition cursor-pointer">
            <Trophy className="w-5 h-5" /> Winners & Payouts
          </Link>
          <Link href="/admin/charities" className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition cursor-pointer">
            <Target className="w-5 h-5" /> Charities
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition cursor-pointer">
            <Users className="w-5 h-5" /> Users
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition cursor-pointer">
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-zinc-800">
          <form action={logout}>
            <button type="submit" className="flex items-center justify-center w-full gap-2 px-4 py-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-400/10 transition">
              <LogOut className="w-4 h-4" /> Exit Admin
            </button>
          </form>
        </div>
      </aside>
      
      <main className="flex-1 w-full p-6 md:p-10 hide-scrollbar overflow-y-auto max-h-screen">
        {children}
      </main>
    </div>
  )
}
