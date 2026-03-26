'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function GlobalNav({ user }: { user: any }) {
  const pathname = usePathname()

  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <header className="fixed w-full top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex flex-col md:flex-row items-center justify-between">
        <Link href="/" className="font-bold text-2xl tracking-tighter text-white z-10 flex items-center">
          GOLF<span className="text-emerald-500">VAULT</span>
        </Link>
        
        <nav className="flex items-center gap-6 text-sm font-medium mt-4 md:mt-0">
          <Link href="/charities" className="text-zinc-400 hover:text-white transition-colors">Causes</Link>
          <Link href="/#how-it-works" className="text-zinc-400 hover:text-white transition-colors">How it Works</Link>
          {!user ? (
            <>
              <Link href="/login" className="text-zinc-400 hover:text-white transition-colors">Sign In</Link>
              <Link href="/signup" className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white rounded-full transition-all">Get Started</Link>
            </>
          ) : (
            <Link href="/dashboard" className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full transition-all flex items-center gap-2">
              <span className="hidden sm:inline">Go to Dashboard</span> →
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
