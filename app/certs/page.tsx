'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Topbar from '../components/Topbar'
import { useLang } from '../lib/LangContext'

type Cert = { id: string; cert_ref: string; device_serial: string; issue_date: string; expiry_date: string; status: string; properties?: { property_name: string } }

export default function CertsPage() {
  const { t, dir } = useLang()
  const [certs, setCerts] = useState<Cert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: cl } = await supabase.from('clients').select('id').eq('email', user.email).single()
      if (!cl) return
      const { data } = await supabase.from('certificates').select('*, properties(property_name)').eq('client_id', cl.id).order('expiry_date')
      if (data) setCerts(data)
      setLoading(false)
    }
    load()
  }, [])

  const statusColor: Record<string,string> = { active:'#00e676', expiring_soon:'#ffc200', expired:'#ff3040', renewed:'#0a80ff' }
  const statusLabel: Record<string,string> = { active: t('سارية','Active'), expiring_soon: t('تنتهي قريباً','Expiring Soon'), expired: t('منتهية','Expired'), renewed: t('مجددة','Renewed') }

  return (
    <div dir={dir} style={{ fontFamily:'Tajawal,Arial,sans-serif', minHeight:'100vh', background:'#060c14', color:'#e0f0ff' }}>
      <Topbar title="شهادات التركيب" titleEn="Certificates" />
      <div style={{ padding:'24px' }}>
        <div style={{ fontSize:'20px', fontWeight:900, marginBottom:'20px' }}>📜 {t('شهادات التركيب','Installation Certificates')}</div>
        <div style={{ background:'#0e1f33', borderRadius:'12px', border:'1px solid rgba(26,48,80,.8)', overflow:'hidden' }}>
          {loading ? <div style={{ padding:'40px', textAlign:'center', color:'#6090b0' }}>⏳</div> : (
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'rgba(0,230,118,.04)' }}>
                  {[t('رقم الشهادة','Cert #'), t('العقار','Property'), t('S/N الجهاز','Device S/N'), t('الإصدار','Issue'), t('الانتهاء','Expiry'), t('الحالة','Status')].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'right', fontSize:'10px', color:'#6090b0', fontFamily:'IBM Plex Mono,monospace', borderBottom:'1px solid rgba(26,48,80,.8)', fontWeight:600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {certs.map((c, i) => {
                  const daysLeft = c.expiry_date ? Math.ceil((new Date(c.expiry_date).getTime() - Date.now()) / 86400000) : null
                  return (
                    <tr key={c.id} style={{ borderBottom:'1px solid rgba(26,48,80,.4)', background: i%2===0 ? 'transparent' : 'rgba(255,255,255,.01)' }}>
                      <td style={{ padding:'12px 16px', fontFamily:'IBM Plex Mono,monospace', color:'#00e676', fontSize:'12px', fontWeight:700 }}>{c.cert_ref}</td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'#e0f0ff' }}>{(c as any).properties?.property_name || '—'}</td>
                      <td style={{ padding:'12px 16px', fontFamily:'IBM Plex Mono,monospace', fontSize:'10px', color:'#6090b0' }}>{c.device_serial || '—'}</td>
                      <td style={{ padding:'12px 16px', fontFamily:'IBM Plex Mono,monospace', fontSize:'10px', color:'#6090b0' }}>{c.issue_date || '—'}</td>
                      <td style={{ padding:'12px 16px', fontFamily:'IBM Plex Mono,monospace', fontSize:'10px', color: daysLeft !== null && daysLeft < 30 ? '#ffc200' : '#6090b0' }}>
                        {c.expiry_date || '—'}
                        {daysLeft !== null && daysLeft > 0 && daysLeft < 90 && <span style={{ marginRight:'6px', color:'#ffc200', fontSize:'9px' }}>({daysLeft} {t('يوم','days')})</span>}
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ background:`${statusColor[c.status]}20`, color:statusColor[c.status], fontSize:'10px', fontWeight:700, padding:'3px 9px', borderRadius:'20px', border:`1px solid ${statusColor[c.status]}33` }}>
                          {statusLabel[c.status] || c.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}