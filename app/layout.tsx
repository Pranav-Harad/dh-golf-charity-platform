import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { createClient } from '@/lib/supabase/server'
import GlobalNav from '@/components/GlobalNav'
import MainLayoutWrapper from '@/components/MainLayoutWrapper'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GolfVault | Golf Charity Platform',
  description: 'Subscribe to win, play to conquer, donate to change lives.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user = null
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      user = data.user
    }
  } catch {
    console.warn('Supabase not configured, skipping auth check for preview')
  }

  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} bg-black text-zinc-100 antialiased min-h-screen flex flex-col`}>
        {/* Simple global nav for non-dashboard pages */}
        <GlobalNav user={user} />
        <MainLayoutWrapper>
          {children}
        </MainLayoutWrapper>
        <Toaster position="top-right" theme="dark" richColors />

        <footer className="border-t border-zinc-900 bg-black py-12 text-center text-zinc-600 text-sm mt-auto">
          <div className="max-w-7xl mx-auto px-6">
            <p>&copy; {new Date().getFullYear()} GolfVault. All rights reserved.</p>
            <p className="mt-2 text-xs">Making an impact through unified giving.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
