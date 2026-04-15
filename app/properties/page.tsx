'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Topbar from '../components/Topbar'
import { useLang } from '../lib/LangContext'

type Property = {
  id: string; property_name: string; district: string
  property_type: string; floors: number; city: string
}
type Cert = { property_id: string; expiry_date: string; status: string }

export default function PropertiesPage() {
  const { t, dir } = useLang()
  const [props, setProps] = useState<Property[]>([])
  const [certs, setCerts] = useState<Cert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: cl } = await supabase.from('clients').select('id').eq('email', user.email).single()
      if (!cl) return
      const [{ data: p }, { data: c }] = await Promise.all([
        supabase.from('properties').select('*').eq('client_id', cl.id).order('property_name'),
        supabase.from('certificates').select('property_id, expiry_date, status').eq('client_id', cl.id),
      ])
      if (p) setProps(p)
      if (c) setCerts(c)
      setLoading(false)
    }
    load()
  }, [])

  const typeIcon: Record<string,string> = {
    commercial:'🏢', residential:'🏠', industrial:'🏭', government:'🏛️'
  }

  return (
    <div dir={dir} style={{ fontFamily:'Tajawal,Arial,sans-serif', minHeight:'100vh', background:'#060c14', color:'#e0f0ff' }}>
      <Topbar title="عقاراتي" titleEn="My Properties" />
      <div style={{ padding:'24px' }}>

        <div style={{ marginBottom:'24px' }}>
          <div style={{ fontSize:'20px', fontWeight:900, color:'#e0f0ff' }}>
            🏢 {t('عقاراتي','My Properties')}
          </div>
          <div style={{ fontSize:'12px', color:'#6090b0', marginTop:'4px' }}>
            {props.length} {t('عقار مسجل','registered properties')}
          </div>
        </div>

        {loading ? (
          <div style={{ color:'#6090b0', padding:'40px', textAlign:'center' }}>
            ⏳ {t('جارٍ التحميل...','Loading...')}
          </div>
        ) : props.length === 0 ? (
          <div style={{ padding:'60px', textAlign:'center', color:'#304560', background:'#0e1f33', borderRadius:'12px', border:'1px solid rgba(26,48,80,.8)' }}>
            {t('لا توجد عقارات مسجلة','No properties registered')}
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'16px' }}>
            {props.map(p => {
              const cert = certs.find(c => c.property_id === p.id)
              const daysLeft = cert?.expiry_date
                ? Math.ceil((new Date(cert.expiry_date).getTime() - Date.now()) / 86400000)
                : null

              return (
                <div key={p.id} style={{
                  background:'#0e1f33', borderRadius:'14px',
                  border:'1px solid rgba(26,48,80,.8)',
                  overflow:'hidden', transition:'border-color .2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#0a80ff44')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(26,48,80,.8)')}
                >
                  <div style={{ height:'3px', background:'linear-gradient(90deg,#0a80ff,#0055cc)' }} />

                  <div style={{ padding:'20px' }}>
                    {/* Icon + Name */}
                    <div style={{ display:'flex', alignItems:'flex-start', gap:'14px', marginBottom:'18px' }}>
                      <div style={{
                        width:'44px', height:'44px', borderRadius:'10px',
                        background:'rgba(10,128,255,.1)', border:'1px solid rgba(10,128,255,.2)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:'22px', flexShrink:0,
                      }}>
                        {typeIcon[p.property_type] || '🏢'}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, fontSize:'14px', color:'#e0f0ff', lineHeight:1.3 }}>
                          {p.property_name}
                        </div>
                        <div style={{ fontSize:'11px', color:'#6090b0', marginTop:'4px' }}>
                          📍 {[p.district, p.city].filter(Boolean).join(' — ') || '—'}
                        </div>
                      </div>
                    </div>

                    {/* Certificate */}
                    <div style={{
                      display:'flex', alignItems:'center', justifyContent:'space-between',
                      padding:'10px 14px', borderRadius:'8px',
                      background:'rgba(6,12,20,.6)', border:'1px solid rgba(26,48,80,.6)',
                    }}>
                      <span style={{ fontSize:'11px', color:'#6090b0' }}>
                        📜 {t('الشهادة','Certificate')}
                      </span>
                      {daysLeft === null ? (
                        <span style={{ fontSize:'11px', color:'#304560' }}>—</span>
                      ) : daysLeft < 0 ? (
                        <span style={{ fontSize:'11px', fontWeight:700, color:'#ff3040' }}>
                          {t('منتهية','Expired')}
                        </span>
                      ) : (
                        <span style={{
                          fontSize:'11px', fontWeight:700,
                          color: daysLeft <= 30 ? '#ffc200' : '#00e676',
                          fontFamily:'IBM Plex Mono,monospace',
                        }}>
                          {daysLeft} {t('يوم','days')}
                        </span>
                      )}
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