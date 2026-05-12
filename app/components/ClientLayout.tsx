'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import { LangProvider } from '../lib/LangContext'
import { AuthCacheProvider } from '../lib/AuthCache'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === '/login'

  const [isMobile, setIsMobile] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    setIsDrawerOpen(false)
  }, [pathname])

  if (isLogin) {
    return <LangProvider>{children}</LangProvider>
  }

  return (
    <LangProvider>
      <AuthCacheProvider>
        <div style={{ display: 'flex', flexDirection: 'row', minHeight: '100vh', background: '#060c14' }}>
          {isMobile && (
            <button
              onClick={() => setIsDrawerOpen(true)}
              aria-label="فتح القائمة"
              style={{
                position: 'fixed', top: 12, right: 12, zIndex: 998,
                width: 44, height: 44,
                background: 'rgba(10,22,40,0.92)',
                border: '1px solid rgba(26,48,80,0.8)',
                borderRadius: 10, color: '#e0f0ff', fontSize: 22,
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >☰</button>
          )}

          {isMobile && isDrawerOpen && (
            <div
              onClick={() => setIsDrawerOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.6)', zIndex: 999,
                backdropFilter: 'blur(2px)',
              }}
            />
          )}

          <Sidebar
            isMobile={isMobile}
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          />

          <main style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            minWidth: 0, overflowY: 'auto',
            paddingTop: isMobile ? 64 : 0,
          }}>
            {children}
          </main>
        </div>
      </AuthCacheProvider>
    </LangProvider>
  )
}