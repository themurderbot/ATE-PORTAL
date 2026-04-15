'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Topbar from '../components/Topbar'
import { useLang } from '../lib/LangContext'

export default function MaintenancePage() {
  const { t, dir } = useLang()
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: cl } = await supabase.from('clients').select('id').eq('email', user.email).single()
      if (!cl) return
      const { data } = await supabase.from('requests').select('*, properties(property_name)').eq('client_id', cl.id).order('created_at', { ascending: false })
      if (data) setRequests(data)
      setLoading(false)
    }
    load()
  }, [])

  const stageColor: Record<string,string> = { new:'#6090b0', awaiting_payment:'#0a80ff', scheduled:'#ffc200', installed:'#ff6820', certified:'#00e676' }
  const stageLabel: Record<string,string> = { new: t('جديد','New'), awaiting_payment: t('بانتظار الدفع','Awaiting Payment'), scheduled: t('مجدول','Scheduled'), installed: t('تم التركيب','Installed'), certified: t('شهادة صادرة','Certified') }

  return (
    <div dir={dir} style={{ fontFamily:'Tajawal,Arial,sans-serif', minHeight:'100vh', background:'#060c14', color:'#e0f0ff' }}>
      <Topbar title="طلبات الصيانة" titleEn="Maintenance Requests" />
      <div style={{ padding:'24px' }}>
        <div style={{ fontSize:'20px', fontWeight:900, marginBottom:'20px' }}>🔧 {t('طلباتي','My Requests')}</div>
        {loading ? <div style={{ color:'#6090b0' }}>⏳</div> : requests.length === 0 ? (
          <div style={{ padding:'60px', textAlign:'center', color:'#304560', background:'#0e1f33', borderRadius:'12px', border:'1px solid rgba(26,48,80,.8)' }}>{t('لا توجد طلبات','No requests')}</div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {requests.map(r => (
              <div key={r.id} style={{ background:'#0e1f33', borderRadius:'12px', padding:'16px 20px', border:'1px solid rgba(26,48,80,.8)', display:'flex', alignItems:'center', gap:'16px' }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:'IBM Plex Mono,monospace', color:'#0a80ff', fontSize:'11px', marginBottom:'4px' }}>{r.request_code}</div>
                  <div style={{ fontWeight:700, fontSize:'13px' }}>{r.properties?.property_name || '—'}</div>
                  <div style={{ fontSize:'11px', color:'#6090b0', marginTop:'2px' }}>{r.created_at?.split('T')[0]}</div>
                </div>
                <span style={{ background:`${stageColor[r.stage]}20`, color:stageColor[r.stage], fontSize:'10px', fontWeight:700, padding:'4px 12px', borderRadius:'20px', border:`1px solid ${stageColor[r.stage]}33` }}>
                  {stageLabel[r.stage] || r.stage}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}