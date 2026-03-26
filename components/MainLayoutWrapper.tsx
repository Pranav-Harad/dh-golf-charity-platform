'use client'

import { usePathname } from 'next/navigation'

export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')
  
  return (
    <div className={`flex-1 ${!isDashboard ? 'pt-20' : ''}`}>
      {children}
    </div>
  )
}
