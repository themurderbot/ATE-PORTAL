'use client'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Topbar from './components/Topbar'
import { useLang } from './lib/LangContext'
import { useAuth } from './lib/AuthCache'
import { useRouter } from 'next/navigation'

type Invoice = { id: string; invoice_code: string; amount: number; status: string; due_date: string }
type Cert    = { id: string; cert_ref: string; expiry_date: string; status: string; properties?: { property_name: string } }

export default function DashboardPage() {
  const { t, dir } = useLang()
  const router = useRouter()
  const { client, loading: authLoading } = useAuth()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [certs, setCerts]       = useState<Cert[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!client) { router.push('/login'); return }

    async function load() {
      const [{ data: inv }, { data: cr }] = await Promise.all([
        supabase.from('invoices').select('*').eq('client_id', client!.id).eq('status', 'pending').order('due_date').limit(3),
        supabase.from('certificates').select('*, properties(property_name)').eq('client_id', client!.id).in('status', ['active','expiring_soon']).order('expiry_date').limit(4),
      ])
      if (inv) setInvoices(inv)
      if (cr)  setCerts(cr)
      setLoading(false)
    }
    load()
  }, [client, authLoading])

  const statusColor: Record<string,string> = { active:'#00e676', expiring_soon:'#ffc200', expired:'#ff3040', pending:'#ffc200', paid:'#00e676', overdue:'#ff3040' }
  const statusLabel: Record<string,string> = {
    active: t('سارية','Active'), expiring_soon: t('تنتهي قريباً','Expiring Soon'),
    expired: t('منتهية','Expired'), pending: t('مستحقة','Pending'),
    paid: t('مدفوعة','Paid'), overdue: t('متأخرة','Overdue'),
  }

  if (authLoading || loading) return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:'#060c14', color:'#6090b0', fontFamily:'Tajawal,sans-serif', fontSize:'16px' }}>
      ⏳ {t('جارٍ التحميل...','Loading...')}
    </div>
  )

  return (
    <div dir={dir} style={{ fontFamily:'Tajawal,Arial,sans-serif', minHeight:'100vh', background:'#060c14', color:'#e0f0ff' }}>
      <Topbar title="لوحة التحكم" titleEn="Dashboard" />
      <div style={{ padding:'24px' }}>

        {/* Welcome */}
        <div style={{ marginBottom:'24px' }}>
          <div style={{ fontSize:'22px', fontWeight:900, color:'#e0f0ff' }}>
            {t('مرحباً،','Welcome,')} <span style={{ color:'#0a80ff' }}>{client?.company_name || ''}</span>
          </div>
          <div style={{ fontSize:'12px', color:'#6090b0', marginTop:'4px' }}>
            {t('هذا ملخص حسابك في ATE Platform','Here\'s your ATE Platform account summary')}
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px', marginBottom:'24px' }}>
          {[
            { icon:'💳', label: t('فواتير مستحقة','Pending Invoices'),   value: invoices.length,                               color:'#ffc200' },
            { icon:'📜', label: t('شهادات سارية','Active Certificates'),  value: certs.filter(c=>c.status==='active').length,     color:'#00e676' },
            { icon:'⚠️', label: t('تنتهي قريباً','Expiring Soon'),        value: certs.filter(c=>c.status==='expiring_soon').length, color:'#ff6820' },
          ].map((k,i) => (
            <div key={i} style={{ background:'#0e1f33', borderRadius:'12px', padding:'20px', border:'1px solid rgba(26,48,80,.8)' }}>
              <div style={{ fontSize:'22px', marginBottom:'10px' }}>{k.icon}</div>
              <div style={{ fontSize:'28px', fontWeight:700, fontFamily:'Rajdhani,sans-serif', color:k.color, lineHeight:1, marginBottom:'4px' }}>{k.value}</div>
              <div style={{ fontSize:'12px', color:'#6090b0' }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Two columns */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>

          {/* Invoices */}
          <div style={{ background:'#0e1f33', borderRadius:'12px', border:'1px solid rgba(26,48,80,.8)', overflow:'hidden' }}>
            <div style={{ padding:'14px 18px', borderBottom:'1px solid rgba(26,48,80,.8)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontWeight:700, fontSize:'13px' }}>💳 {t('فواتير مستحقة الدفع','Invoices Due')}</span>
              <a href="/invoices" style={{ fontSize:'11px', color:'#0a80ff', textDecoration:'none' }}>{t('عرض الكل ←','View All →')}</a>
            </div>
            <div style={{ padding:'12px' }}>
              {invoices.length === 0 ? (
                <div style={{ padding:'20px', textAlign:'center', color:'#304560', fontSize:'12px' }}>✅ {t('لا توجد فواتير مستحقة','No pending invoices')}</div>
              ) : invoices.map(inv => (
                <div key={inv.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 8px', borderRadius:'8px', marginBottom:'6px', background:'rgba(10,128,255,.06)', border:'1px solid rgba(10,128,255,.1)' }}>
                  <div>
                    <div style={{ fontSize:'12px', fontWeight:700, fontFamily:'IBM Plex Mono,monospace', color:'#0a80ff' }}>{inv.invoice_code}</div>
                    <div style={{ fontSize:'10px', color:'#6090b0', marginTop:'2px' }}>{t('الاستحقاق:','Due:')} {inv.due_date || '—'}</div>
                  </div>
                  <div style={{ textAlign:'left' }}>
                    <div style={{ fontSize:'14px', fontWeight:700, fontFamily:'Rajdhani,sans-serif', color:'#ffc200' }}>{Number(inv.amount).toLocaleString()} {t('د','AED')}</div>
                    <span style={{ fontSize:'9px', background:`${statusColor[inv.status]}20`, color:statusColor[inv.status], padding:'2px 7px', borderRadius:'10px', border:`1px solid ${statusColor[inv.status]}33` }}>{statusLabel[inv.status]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certs */}
          <div style={{ background:'#0e1f33', borderRadius:'12px', border:'1px solid rgba(26,48,80,.8)', overflow:'hidden' }}>
            <div style={{ padding:'14px 18px', borderBottom:'1px solid rgba(26,48,80,.8)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontWeight:700, fontSize:'13px' }}>📜 {t('شهادات التركيب','Installation Certificates')}</span>
              <a href="/certs" style={{ fontSize:'11px', color:'#0a80ff', textDecoration:'none' }}>{t('عرض الكل ←','View All →')}</a>
            </div>
            <div style={{ padding:'12px' }}>
              {certs.length === 0 ? (
                <div style={{ padding:'20px', textAlign:'center', color:'#304560', fontSize:'12px' }}>{t('لا توجد شهادات','No certificates')}</div>
              ) : certs.map(cert => {
                const daysLeft = cert.expiry_date ? Math.ceil((new Date(cert.expiry_date).getTime() - Date.now()) / 86400000) : null
                return (
                  <div key={cert.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 8px', borderRadius:'8px', marginBottom:'6px', background:'rgba(0,230,118,.04)', border:'1px solid rgba(0,230,118,.1)' }}>
                    <div>
                      <div style={{ fontSize:'12px', fontWeight:700, fontFamily:'IBM Plex Mono,monospace', color:'#00e676' }}>{cert.cert_ref}</div>
                      <div style={{ fontSize:'10px', color:'#6090b0', marginTop:'2px' }}>{(cert as any).properties?.property_name || '—'}</div>
                    </div>
                    <div style={{ textAlign:'left', display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'4px' }}>
                      {daysLeft !== null && (
                        <span style={{ fontSize:'10px', fontWeight:700, color: daysLeft < 30 ? '#ffc200' : '#00e676', fontFamily:'IBM Plex Mono,monospace' }}>
                          {daysLeft > 0 ? `${daysLeft} ${t('يوم','days')}` : t('منتهية','Expired')}
                        </span>
                      )}
                      <span style={{ fontSize:'9px', background:`${statusColor[cert.status]}20`, color:statusColor[cert.status], padding:'2px 7px', borderRadius:'10px', border:`1px solid ${statusColor[cert.status]}33` }}>{statusLabel[cert.status]}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}