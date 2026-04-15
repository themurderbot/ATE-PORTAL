'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Topbar from '../components/Topbar'
import { useLang } from '../lib/LangContext'

type Property = {
  id: string; property_name: string; district: string
  property_type: string; floors: number; city: string
}
type Device = { id: string; property_id: string; status: string }
type Cert   = { property_id: string; expiry_date: string; status: string }

export default function PropertiesPage() {
  const { t, dir } = useLang()
  const [props, setProps]   = useState<Property[]>([])
  const [devices, setDevices] = useState<Device[]>([])
  const [certs, setCerts]   = useState<Cert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: cl } = await supabase.from('clients').select('id').eq('email', user.email).single()
      if (!cl) return
      const [{ data: p }, { data: d }, { data: c }] = await Promise.all([
        supabase.from('properties').select('*').eq('client_id', cl.id).order('property_name'),
        supabase.from('devices').select('id, property_id, status'),
        supabase.from('certificates').select('property_id, expiry_date, status').eq('client_id', cl.id),
      ])
      if (p) setProps(p)
      if (d) setDevices(d)
      if (c) setCerts(c)
      setLoading(false)
    }
    load()
  }, [])

  const typeIcon: Record<string,string> = {
    commercial:'🏢', residential:'🏠', industrial:'🏭', government:'🏛️'
  }

  const deviceStatus: Record<string,{ color:string; bg:string; ar:string; en:string }> = {
    active:  { color:'#00e676', bg:'rgba(0,230,118,.12)',  ar:'نشط',       en:'Active'     },
    fault:   { color:'#ff3040', bg:'rgba(255,48,64,.12)',  ar:'عطل',       en:'Fault'      },
    offline: { color:'#6090b0', bg:'rgba(96,144,176,.12)', ar:'غير متصل', en:'Offline'    },
    alarm:   { color:'#ffc200', bg:'rgba(255,194,0,.12)',  ar:'إنذار',     en:'Alarm'      },
  }

  return (
    <div dir={dir} style={{ fontFamily:'Tajawal,Arial,sans-serif', minHeight:'100vh', background:'#060c14', color:'#e0f0ff' }}>
      <Topbar title="عقاراتي" titleEn="My Properties" />
      <div style={{ padding:'24px' }}>

        {/* Header */}
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
              // جهاز ASE الخاص بالعقار
              const device = devices.find(d => d.property_id === p.id)
              const devSt  = device ? (deviceStatus[device.status] ?? deviceStatus.offline) : deviceStatus.offline

              // شهادة العقار
              const cert     = certs.find(c => c.property_id === p.id)
              const daysLeft = cert?.expiry_date
                ? Math.ceil((new Date(cert.expiry_date).getTime() - Date.now()) / 86400000)
                : null

              return (
                <div key={p.id} style={{
                  background:'#0e1f33', borderRadius:'14px',
                  border:`1px solid ${devSt.color}22`,
                  overflow:'hidden', transition:'border-color .2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = devSt.color + '55')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = devSt.color + '22')}
                >
                  {/* Top accent */}
                  <div style={{ height:'3px', background:devSt.color }} />

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

                    git add .
git commit -m "remove device status from properties"

                    }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                        <div style={{
                          width:'8px', height:'8px', borderRadius:'50%',
                          background:devSt.color,
                          boxShadow:`0 0 6px ${devSt.color}`,
                        }} />
                        <span style={{ fontSize:'12px', color:'#a0c0d8' }}>
                          {t('جهاز ASE','ASE Device')}
                        </span>
                      </div>
                      <span style={{ fontSize:'12px', fontWeight:700, color:devSt.color }}>
                        {t(devSt.ar, devSt.en)}
                      </span>
                    </div>

                    {/* Certificate expiry */}
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