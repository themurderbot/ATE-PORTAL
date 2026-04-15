'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Topbar from '../components/Topbar'
import { useLang } from '../lib/LangContext'

type Property = { id: string; property_name: string; district: string; property_type: string; floors: number; client_id: string }

export default function PropertiesPage() {
  const { t, dir } = useLang()
  const [props, setProps] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: cl } = await supabase.from('clients').select('id').eq('email', user.email).single()
      if (!cl) return
      const { data } = await supabase.from('properties').select('*').eq('client_id', cl.id).order('property_name')
      if (data) setProps(data)
      setLoading(false)
    }
    load()
  }, [])

  const typeIcon: Record<string,string> = { commercial:'🏢', residential:'🏠', industrial:'🏭', government:'🏛️' }

  return (
    <div dir={dir} style={{ fontFamily:'Tajawal,Arial,sans-serif', minHeight:'100vh', background:'#060c14', color:'#e0f0ff' }}>
      <Topbar title="عقاراتي" titleEn="My Properties" />
      <div style={{ padding:'24px' }}>
        <div style={{ fontSize:'20px', fontWeight:900, marginBottom:'20px' }}>🏢 {t('عقاراتي','My Properties')}</div>
        {loading ? <div style={{ color:'#6090b0' }}>⏳</div> : props.length === 0 ? (
          <div style={{ padding:'60px', textAlign:'center', color:'#304560', background:'#0e1f33', borderRadius:'12px', border:'1px solid rgba(26,48,80,.8)' }}>{t('لا توجد عقارات','No properties')}</div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px' }}>
            {props.map(p => (
              <div key={p.id} style={{ background:'#0e1f33', borderRadius:'12px', padding:'20px', border:'1px solid rgba(26,48,80,.8)' }}>
                <div style={{ fontSize:'28px', marginBottom:'12px' }}>{typeIcon[p.property_type] || '🏢'}</div>
                <div style={{ fontWeight:700, fontSize:'15px', marginBottom:'6px' }}>{p.property_name}</div>
                <div style={{ fontSize:'12px', color:'#6090b0', marginBottom:'4px' }}>📍 {p.district || '—'}</div>
                <div style={{ fontSize:'11px', color:'#304560', fontFamily:'IBM Plex Mono,monospace' }}>{p.property_type || '—'}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}