'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useLang } from '../lib/LangContext'
import { supabase } from '../lib/supabase'

interface SidebarProps {
  isMobile?: boolean
  isOpen?: boolean
  onClose?: () => void
}

const navItems = [
  { section: { ar: 'الرئيسية', en: 'MAIN' }, items: [
    { id: 'dash',  ar: 'لوحة التحكم',       en: 'Dashboard',         icon: '📊', href: '/' },
  ]},
  { section: { ar: 'العقارات', en: 'PROPERTIES' }, items: [
    { id: 'props', ar: 'عقاراتي',            en: 'My Properties',     icon: '🏢', href: '/properties' },
  ]},
  { section: { ar: 'العقود والمالية', en: 'FINANCE' }, items: [
    { id: 'inv',   ar: 'الفواتير والمدفوعات', en: 'Invoices & Payments', icon: '💳', href: '/invoices' },
    { id: 'certs', ar: 'شهادات التركيب',     en: 'Certificates',       icon: '📜', href: '/certs' },
  ]},
  { section: { ar: 'الدعم', en: 'SUPPORT' }, items: [
    { id: 'docs',  ar: 'المستندات المطلوبة',  en: 'Required Documents', icon: '📎', href: '/docs' },
    { id: 'maint', ar: 'طلبات التركيب',      en: 'INQUIRIES',        icon: '🔧', href: '/maintenance' },
    { id: 'prof',  ar: 'حسابي',              en: 'My Account',         icon: '👤', href: '/profile' },
  ]},
]

export default function Sidebar({ isMobile = false, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { lang, setLang, t } = useLang()
  const [active, setActive] = useState('dash')
  const [loggingOut, setLoggingOut] = useState(false)
  const [clientName, setClientName] = useState('')

  useEffect(() => {
    const match = navItems.flatMap(s => s.items).find(i => i.href === pathname)
    if (match) setActive(match.id)
  }, [pathname])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        supabase.from('clients').select('company_name').eq('email', data.user.email).single()
          .then(({ data: cl }) => { if (cl) setClientName(cl.company_name) })
      }
    })
  }, [])

  async function handleLogout() {
    setLoggingOut(true)
    await supabase.auth.signOut()
    window.location.href = 'https://ate-landing.vercel.app'
  }

  const handleNavClick = (id: string) => {
    setActive(id)
    if (isMobile && onClose) onClose()
  }

  const S: React.CSSProperties = isMobile ? {
    width: '280px',
    background: '#0a1628',
    borderLeft: '1px solid rgba(26,48,80,0.8)',
    display: 'flex', flexDirection: 'column',
    position: 'fixed', top: 0, right: 0,
    height: '100vh', zIndex: 1000,
    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.3s ease',
    overflow: 'hidden',
    boxShadow: isOpen ? '-12px 0 40px rgba(0,0,0,0.6)' : 'none',
  } : {
    width: '240px', flexShrink: 0,
    background: '#0a1628',
    borderRight: '1px solid rgba(26,48,80,0.8)',
    display: 'flex', flexDirection: 'column',
    position: 'sticky', top: 0, height: '100vh',
    overflow: 'hidden', order: -1,
  }

  return (
    <aside style={S}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(26,48,80,0.8)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="/icon-192.png" alt="Weqayah" style={{ width: '36px', height: '36px', borderRadius: '9px', flexShrink: 0, boxShadow: '0 0 14px rgba(255,48,64,0.25)' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '18px', fontWeight: 700, letterSpacing: '2px', color: '#e0f0ff' }}>Weqayah</div>
          <div style={{ fontSize: '9px', color: '#304560', letterSpacing: '1px' }}>CLIENT PORTAL</div>
        </div>
        {isMobile && (
          <button onClick={onClose} aria-label="إغلاق" style={{
            background: 'transparent', border: 'none', color: '#8aa0b8',
            fontSize: 24, cursor: 'pointer', padding: '4px 8px', lineHeight: 1,
          }}>×</button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
        {navItems.map(section => (
          <div key={section.section.ar}>
            <div style={{ fontSize: '9px', color: '#304560', letterSpacing: '2px', textTransform: 'uppercase', padding: '12px 18px 5px', fontFamily: 'Rajdhani,sans-serif' }}>
              {lang === 'ar' ? section.section.ar : section.section.en}
            </div>
            {section.items.map(item => (
              <Link key={item.id} href={item.href} onClick={() => handleNavClick(item.id)} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 18px', cursor: 'pointer',
                color: active === item.id ? '#e0f0ff' : 'rgba(224,240,255,.45)',
                fontSize: '13px', margin: '1px 8px', borderRadius: '8px',
                border: active === item.id ? '1px solid rgba(10,128,255,.3)' : '1px solid transparent',
                background: active === item.id ? 'linear-gradient(135deg,rgba(10,128,255,.2),rgba(0,212,255,.08))' : 'transparent',
                fontWeight: active === item.id ? 700 : 400,
                textDecoration: 'none', transition: 'all .2s',
              }}>
                <span style={{ fontSize: '15px', width: '18px', textAlign: 'center' }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{lang === 'ar' ? item.ar : item.en}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Language Toggle */}
      <div style={{ padding: '0 12px 10px' }}>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(26,48,80,.8)', borderRadius: '8px', overflow: 'hidden' }}>
          <button onClick={() => setLang('ar')} style={{ flex: 1, padding: '8px', border: 'none', cursor: 'pointer', background: lang === 'ar' ? 'rgba(255,48,64,.4)' : 'transparent', color: '#e0f0ff', fontSize: '12px', fontWeight: lang === 'ar' ? 700 : 400, fontFamily: 'Tajawal,sans-serif', transition: 'all .2s' }}>العربية</button>
          <button onClick={() => setLang('en')} style={{ flex: 1, padding: '8px', border: 'none', cursor: 'pointer', background: lang === 'en' ? 'rgba(255,48,64,.4)' : 'transparent', color: '#e0f0ff', fontSize: '12px', fontWeight: lang === 'en' ? 700 : 400, fontFamily: 'Tajawal,sans-serif', transition: 'all .2s' }}>English</button>
        </div>
      </div>

      {/* User + Logout */}
      <div style={{ padding: '0 12px 16px', borderTop: '1px solid rgba(26,48,80,.8)', paddingTop: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '9px 10px', background: 'rgba(255,255,255,.04)', borderRadius: '8px', border: '1px solid rgba(26,48,80,.8)', marginBottom: '8px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg,#0a80ff,#0066cc)', fontSize: '12px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {clientName?.charAt(0) || '?'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#e0f0ff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{clientName || t('العميل', 'Client')}</div>
            <div style={{ fontSize: '9px', color: '#304560' }}>CLIENT PORTAL</div>
          </div>
        </div>
        <button onClick={handleLogout} disabled={loggingOut} style={{
          width: '100%', padding: '8px', border: '1px solid rgba(255,48,64,.3)',
          borderRadius: '8px', background: 'rgba(255,48,64,.08)',
          color: '#ff6080', fontSize: '12px', fontWeight: 700,
          cursor: loggingOut ? 'not-allowed' : 'pointer',
          fontFamily: 'Tajawal,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          opacity: loggingOut ? 0.6 : 1, transition: 'all .2s',
        }}>
          {loggingOut ? '⏳' : '🚪'} {t('تسجيل الخروج', 'Logout')}
        </button>
      </div>
    </aside>
  )
}