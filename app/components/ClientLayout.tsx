'use client'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import { LangProvider } from '../lib/LangContext'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin  = pathname === '/login' || pathname === '/'

  if (isLogin) {
    return <LangProvider>{children}</LangProvider>
  }

  return (
    <LangProvider>
      <div style={{ display: 'flex', flexDirection: 'row', minHeight: '100vh', background: '#060c14' }}>
        <Sidebar />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </LangProvider>
  )
}