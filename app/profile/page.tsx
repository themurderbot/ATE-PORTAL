'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Topbar from '../components/Topbar'
import { useLang } from '../lib/LangContext'
import { useRouter } from 'next/navigation'

type Client = {
  id: string; company_name: string; contact_name: string
  email: string; phone: string; city: string; client_code: string
  created_at: string
}

export default function ProfilePage() {
  const { t, dir } = useLang()
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('clients').select('*').eq('email', user.email).single()
      if (data) setClient(data)
    }
    load()
  }, [])

  const handleLogout = async () => {
    setLoggingOut(true)
    try { await supabase.auth.signOut() } catch(e) {}
    localStorage.clear()
    sessionStorage.clear()
    window.location.replace('/login')
  }

  const memberYear = client?.created_at ? new Date(client.created_at).getFullYear() : '—'

  const fields = [
    { label: t('اسم الشركة','Company Name'),        value: client?.company_name },
    { label: t('البريد الإلكتروني','Email'),         value: client?.email },
    { label: t('رقم الجوال','Phone'),               value: client?.phone },
    { label: t('المدينة','City'),                    value: client?.city },
    { label: t('رقم العميل','Client Code'),          value: client?.client_code },
  ]

  return (
    <div dir={dir} style={{ fontFamily:'Tajawal,Arial,sans-serif', minHeight:'100vh', background:'#060c14', color:'#e0f0ff' }}>
      <Topbar title="حسابي" titleEn="My Account" />
      <div style={{ padding:'24px' }}>

        {/* Header */}
        {client && (
          <div style={{ background:'#0e1f33', borderRadius:'14px', border:'1px solid rgba(26,48,80,.8)', padding:'28px', marginBottom:'20px', display:'flex', alignItems:'center', gap:'20px' }}>
            <div style={{
              width:'64px', height:'64px', borderRadius:'50%',
              background:'linear-gradient(135deg,#0a80ff,#0066cc)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'24px', fontWeight:700, color:'#fff', flexShrink:0,
            }}>
              {client.company_name?.charAt(0)}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'20px', fontWeight:900, color:'#e0f0ff' }}>{client.company_name}</div>
              <div style={{ fontSize:'12px', color:'#6090b0', marginTop:'4px', fontFamily:'IBM Plex Mono,monospace' }}>
                {client.client_code} · member since {memberYear}
              </div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', marginTop:'8px', background:'rgba(0,230,118,.1)', border:'1px solid rgba(0,230,118,.2)', borderRadius:'20px', padding:'3px 10px' }}>
                <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#00e676' }} />
                <span style={{ fontSize:'11px', color:'#00e676' }}>{t('حساب نشط','Active Account')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div style={{ background:'#0e1f33', borderRadius:'14px', border:'1px solid rgba(26,48,80,.8)', padding:'20px', marginBottom:'16px' }}>
          <div style={{ fontSize:'13px', fontWeight:700, color:'#6090b0', marginBottom:'16px' }}>
            👤 {t('بيانات الحساب','Account Details')}
          </div>
          {fields.map(field => (
            <div key={field.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid rgba(26,48,80,.5)' }}>
              <span style={{ fontSize:'12px', color:'#6090b0' }}>{field.label}</span>
              <span style={{ fontSize:'13px', fontWeight:600, color:'#e0f0ff' }}>{field.value || '—'}</span>
            </div>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={{
            width:'100%', padding:'14px',
            background:'rgba(255,48,64,.05)', border:'1px solid rgba(255,48,64,.2)',
            borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center',
            gap:'8px', cursor:'pointer', transition:'all .2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,48,64,.1)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,48,64,.05)')}
        >
          <span style={{ fontSize:'16px', color:'#ff3040' }}>⏻</span>
          <span style={{ fontSize:'14px', fontWeight:700, color:'#ff3040', fontFamily:'Tajawal,sans-serif' }}>
            {loggingOut ? '...' : t('تسجيل الخروج','Sign Out')}
          </span>
        </button>

      </div>
    </div>
  )
}