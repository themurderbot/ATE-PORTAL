'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Topbar from '../components/Topbar'
import { useLang } from '../lib/LangContext'

type Cert = {
  id: string; cert_ref: string; device_serial: string
  issue_date: string; install_date: string; expiry_date: string
  status: string; cert_type: string
  properties?: { property_name: string }
  technicians?: { full_name: string }
}

export default function CertsPage() {
  const { t, dir } = useLang()
  const [certs, setCerts] = useState<Cert[]>([])
  const [clientName, setClientName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: cl } = await supabase.from('clients').select('id, company_name').eq('email', user.email).single()
      if (!cl) return
      setClientName(cl.company_name)
      const { data } = await supabase
        .from('certificates')
        .select('*, properties(property_name), technicians(full_name)')
        .eq('client_id', cl.id)
        .order('expiry_date')
      if (data) setCerts(data)
      setLoading(false)
    }
    load()
  }, [])

  const statusColor: Record<string,string> = {
    active:'#00e676', expiring_soon:'#ffc200', expired:'#ff3040', renewed:'#0a80ff'
  }
  const statusLabel: Record<string,string> = {
    active: t('سارية','Active'), expiring_soon: t('تنتهي قريباً','Expiring Soon'),
    expired: t('منتهية','Expired'), renewed: t('مجددة','Renewed')
  }

  const certTypeLabel: Record<string,string> = {
    installation: t('شهادة تركيب وتشغيل','Installation Certificate'),
    maintenance:  t('شهادة صيانة دورية','Maintenance Certificate'),
    inspection:   t('شهادة فحص','Inspection Certificate'),
  }

  const kpis = [
    { icon:'✅', label: t('شهادات سارية','Active Certificates'),     value: certs.filter(c=>c.status==='active').length,         color:'#00e676' },
    { icon:'⚠️', label: t('تنتهي خلال 60 يوماً','Expiring in 60d'), value: certs.filter(c=>{ const d=Math.ceil((new Date(c.expiry_date).getTime()-Date.now())/86400000); return d>0&&d<=60 }).length, color:'#ffc200' },
    { icon:'🏢', label: t('عقارات مشمولة','Properties Covered'),     value: new Set(certs.map(c=>c.properties?.property_name).filter(Boolean)).size, color:'#0a80ff' },
  ]

  const printPDF = (c: Cert) => {
    const w = window.open('', '_blank')
    if (!w) return
    const daysLeft = c.expiry_date ? Math.ceil((new Date(c.expiry_date).getTime()-Date.now())/86400000) : null
    const sc = statusColor[c.status] || '#6090b0'
    const sl = statusLabel[c.status] || c.status
    const prop = (c as any).properties?.property_name || '—'
    const tech = (c as any).technicians?.full_name || '—'
    w.document.write(`<!DOCTYPE html><html dir="rtl"><head>
      <meta charset="UTF-8"/>
      <title>شهادة ${c.cert_ref}</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'Tajawal',Arial,sans-serif;background:#fff;color:#1a1a2e;padding:40px}
        .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:20px;border-bottom:3px solid #00e676}
        .logo{font-size:28px;font-weight:900;color:#0a80ff}
        .logo span{font-size:11px;display:block;color:#6090b0;font-weight:400;margin-top:2px}
        .cert-title{text-align:left}
        .cert-title h2{font-size:14px;color:#6090b0;font-weight:400}
        .cert-title h1{font-size:22px;font-weight:900;color:#1a1a2e;margin-top:4px}
        .badge{display:inline-block;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700;background:${sc}20;color:${sc};border:1px solid ${sc}44;margin-top:8px}
        .section{margin-bottom:20px}
        .section h3{font-size:10px;color:#6090b0;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #eee}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .field label{font-size:10px;color:#6090b0;display:block;margin-bottom:3px}
        .field p{font-size:13px;font-weight:600;color:#1a1a2e}
        .days-box{background:${sc}10;border:1px solid ${sc}33;border-radius:8px;padding:16px;text-align:center;margin:16px 0}
        .days-box p{font-size:11px;color:#6090b0;margin-bottom:4px}
        .days-box h1{font-size:32px;font-weight:900;color:${sc}}
        .footer{margin-top:28px;padding-top:14px;border-top:1px solid #eee;text-align:center;font-size:10px;color:#6090b0}
        @media print{body{padding:20px}}
      </style>
    </head><body>
      <div class="header">
        <div class="logo">ATE<span>Alarm Transmission System</span></div>
        <div class="cert-title">
          <h2>${certTypeLabel[c.cert_type] || t('شهادة تركيب','Certificate')}</h2>
          <h1>${c.cert_ref}</h1>
          <div class="badge">${sl}</div>
        </div>
      </div>
      <div class="section">
        <h3>${t('بيانات العميل والعقار','Client & Property Details')}</h3>
        <div class="grid">
          <div class="field"><label>${t('اسم العميل','Client')}</label><p>${clientName}</p></div>
          <div class="field"><label>${t('العقار','Property')}</label><p>${prop}</p></div>
          <div class="field"><label>${t('رقم الجهاز','Device S/N')}</label><p>${c.device_serial||'—'}</p></div>
          <div class="field"><label>${t('الفني المعتمد','Technician')}</label><p>${tech}</p></div>
        </div>
      </div>
      <div class="section">
        <h3>${t('تواريخ الشهادة','Certificate Dates')}</h3>
        <div class="grid">
          <div class="field"><label>${t('تاريخ التركيب','Install Date')}</label><p>${c.install_date||'—'}</p></div>
          <div class="field"><label>${t('تاريخ الإصدار','Issue Date')}</label><p>${c.issue_date||'—'}</p></div>
          <div class="field"><label>${t('تاريخ الانتهاء','Expiry Date')}</label><p style="color:${sc}">${c.expiry_date||'—'}</p></div>
        </div>
      </div>
      <div class="days-box">
        <p>${t('الأيام المتبقية','Days Remaining')}</p>
        <h1>${daysLeft !== null && daysLeft > 0 ? daysLeft : t('منتهية','Expired')}</h1>
        ${daysLeft !== null && daysLeft > 0 ? `<p style="margin-top:4px">${t('يوم','days')}</p>` : ''}
      </div>
      <div class="footer">
        <p>ATE Platform — Alarm Transmission System</p>
        <p style="margin-top:3px">${t('هذه الشهادة صادرة من ATE Platform','This certificate is issued by ATE Platform')}</p>
      </div>
      <script>window.onload=()=>{window.print()}</script>
    </body></html>`)
    w.document.close()
  }

  return (
    <div dir={dir} style={{ fontFamily:'Tajawal,Arial,sans-serif', minHeight:'100vh', background:'#060c14', color:'#e0f0ff' }}>
      <Topbar title="شهادات التركيب" titleEn="Certificates" />
      <div style={{ padding:'24px' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
          <div>
            <div style={{ fontSize:'20px', fontWeight:900 }}>📜 {t('شهادات التركيب','Installation Certificates')}</div>
            <div style={{ fontSize:'12px', color:'#6090b0', marginTop:'4px' }}>{t('الشهادات الصادرة من ATE عند تركيب وتشغيل الأجهزة','Certificates issued by ATE upon device installation')}</div>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px', marginBottom:'24px' }}>
          {kpis.map((k,i) => (
            <div key={i} style={{ background:'#0e1f33', borderRadius:'12px', padding:'20px', border:`1px solid ${k.color}22`, borderTop:`3px solid ${k.color}` }}>
              <div style={{ fontSize:'22px', marginBottom:'10px' }}>{k.icon}</div>
              <div style={{ fontSize:'28px', fontWeight:700, fontFamily:'Rajdhani,sans-serif', color:k.color, lineHeight:1, marginBottom:'4px' }}>{k.value}</div>
              <div style={{ fontSize:'12px', color:'#6090b0' }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Cert Cards */}
        {loading ? (
          <div style={{ padding:'40px', textAlign:'center', color:'#6090b0' }}>⏳</div>
        ) : certs.length === 0 ? (
          <div style={{ padding:'60px', textAlign:'center', color:'#304560', background:'#0e1f33', borderRadius:'12px', border:'1px solid rgba(26,48,80,.8)' }}>
            {t('لا توجد شهادات','No certificates found')}
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:'16px' }}>
            {certs.map(c => {
              const daysLeft = c.expiry_date ? Math.ceil((new Date(c.expiry_date).getTime()-Date.now())/86400000) : null
              const sc = statusColor[c.status] || '#6090b0'
              const sl = statusLabel[c.status] || c.status
              const urgent = daysLeft !== null && daysLeft > 0 && daysLeft <= 60
              const prop = (c as any).properties?.property_name || '—'
              const tech = (c as any).technicians?.full_name || '—'

              return (
                <div key={c.id} style={{
                  background:'#0e1f33', borderRadius:'14px',
                  border:`1px solid ${sc}33`, overflow:'hidden',
                  position:'relative',
                }}>
                  {urgent && (
                    <div style={{ position:'absolute', top:'14px', right:'14px', background:'#ffc20020', border:'1px solid #ffc20044', color:'#ffc200', fontSize:'10px', fontWeight:700, padding:'3px 10px', borderRadius:'20px' }}>
                      ⚠ {t('تجديد قريب','Renewal Soon')}
                    </div>
                  )}

                  <div style={{ height:'3px', background:sc }} />
                  <div style={{ padding:'20px' }}>

                    {/* Type + Name */}
                    <div style={{ fontSize:'10px', color:'#6090b0', letterSpacing:'1px', marginBottom:'6px' }}>
                      {certTypeLabel[c.cert_type] || t('شهادة تركيب','Certificate')}
                    </div>
                    <div style={{ fontSize:'18px', fontWeight:900, color:'#e0f0ff', marginBottom:'4px' }}>{prop}</div>
                    <div style={{ fontSize:'11px', color:'#0a80ff', fontFamily:'IBM Plex Mono,monospace', marginBottom:'16px' }}>{c.cert_ref}</div>

                    {/* Dates */}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'14px' }}>
                      {[
                        { label: t('تاريخ التركيب','Install Date'), value: c.install_date||'—' },
                        { label: t('تاريخ الإصدار','Issue Date'),   value: c.issue_date||'—' },
                        { label: t('انتهاء الصلاحية','Expiry'),     value: c.expiry_date||'—', color: daysLeft !== null && daysLeft <= 60 ? '#ffc200' : '#e0f0ff' },
                        { label: t('الفني المعتمد','Technician'),   value: `م. ${tech}` },
                      ].map((row,i) => (
                        <div key={i}>
                          <div style={{ fontSize:'10px', color:'#6090b0', marginBottom:'2px' }}>{row.label}</div>
                          <div style={{ fontSize:'12px', color: row.color||'#a0c0d8', fontFamily:'IBM Plex Mono,monospace' }}>{row.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:'12px', borderTop:'1px solid rgba(26,48,80,.6)' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                        <span style={{ background:`${sc}20`, color:sc, fontSize:'10px', fontWeight:700, padding:'3px 9px', borderRadius:'20px', border:`1px solid ${sc}33` }}>
                          • {sl}
                        </span>
                        {daysLeft !== null && daysLeft > 0 && (
                          <span style={{ fontSize:'11px', fontWeight:700, color:sc, fontFamily:'IBM Plex Mono,monospace' }}>
                            {daysLeft} {t('يوم متبقي','days left')}
                          </span>
                        )}
                      </div>
                      <div style={{ display:'flex', gap:'8px' }}>
                        {urgent && (
                          <button style={{ background:'#ffc20015', border:'1px solid #ffc20044', color:'#ffc200', borderRadius:'7px', padding:'5px 10px', fontSize:'10px', fontWeight:700, cursor:'pointer' }}>
                            ⚠ {t('تجديد عاجل','Urgent Renewal')}
                          </button>
                        )}
                        <button onClick={() => printPDF(c)} style={{ background:'rgba(255,48,64,.1)', border:'1px solid rgba(255,48,64,.3)', color:'#ff3040', borderRadius:'7px', padding:'5px 12px', fontSize:'11px', fontWeight:700, cursor:'pointer', fontFamily:'IBM Plex Mono,monospace' }}>
                          PDF ↓
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}