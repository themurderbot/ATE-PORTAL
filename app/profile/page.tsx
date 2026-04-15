'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Topbar from '../components/Topbar'
import { useLang } from '../lib/LangContext'

type Client = { id: string; company_name: string; contact_name: string; email: string; phone: string; city: string; client_code: string }

export default function ProfilePage() {
  const { t, dir } = useLang()
  const [client, setClient] = useState<Client | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('clients').select('*').eq('email', user.email).single()
      if (data) setClient(data)
    }
    load()
  }, [])

  return (
    <div dir={dir} style={{ fontFamily:'Tajawal,Arial,sans-serif', minHeight:'100vh', background:'#060c14', color:'#e0f0ff' }}>
      <Topbar title="حسابي" titleEn="My Account" />
      <div style={{ padding:'24px', maxWidth:'600px' }}>
        <div style={{ fontSize:'20px', fontWeight:900, marginBottom:'24px' }}>👤 {t('بيانات الحساب','Account Information')}</div>
        {client && (
          <div style={{ background:'#0e1f33', borderRadius:'12px', padding:'24px', border:'1px solid rgba(26,48,80,.8)' }}>
            <div style={{ width:'60px', height:'60px', borderRadius:'50%', background:'linear-gradient(135deg,#0a80ff,#0066cc)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', fontWeight:700, marginBottom:'20px' }}>
              {client.company_name?.charAt(0)}
            </div>
            {[
              { label: t('اسم الشركة','Company Name'), value: client.company_name },
              { label: t('اسم المسؤول','Contact Name'), value: client.contact_name },
              { label: t('البريد الإلكتروني','Email'), value: client.email },
              { label: t('الهاتف','Phone'), value: client.phone },
              { label: t('المدينة','City'), value: client.city },
              { label: t('رقم العميل','Client Code'), value: client.client_code },
            ].map(field => (
              <div key={field.label} style={{ display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid rgba(26,48,80,.6)' }}>
                <span style={{ fontSize:'12px', color:'#6090b0' }}>{field.label}</span>
                <span style={{ fontSize:'13px', fontWeight:600, color:'#e0f0ff' }}>{field.value || '—'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}