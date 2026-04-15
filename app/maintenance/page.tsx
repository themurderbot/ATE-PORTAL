'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Topbar from '../components/Topbar'
import { useLang } from '../lib/LangContext'

export default function MaintenancePage() {
  const { t, dir } = useLang()
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({ property: '', owner: '' })
  const [success, setSuccess] = useState(false)

  const today = new Date()
  const dateStr = `${String(today.getDate()).padStart(2,'0')}/${String(today.getMonth()+1).padStart(2,'0')}/${today.getFullYear()}`

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: cl } = await supabase.from('clients').select('id').eq('email', user.email).single()
      if (!cl) return
      const { data } = await supabase.from('requests')
        .select('*, properties(property_name)')
        .eq('client_id', cl.id)
        .order('created_at', { ascending: false })
      if (data) setRequests(data)
      setLoading(false)
    }
    load()
  }, [])

  const handleSubmit = async () => {
    if (!form.property || !form.owner) return
    setSending(true)
    await new Promise(r => setTimeout(r, 1200))
    setSending(false)
    setSuccess(true)
    setForm({ property: '', owner: '' })
    setTimeout(() => setSuccess(false), 3000)
  }

  const stageColor: Record<string,string> = {
    new:'#6090b0', awaiting_payment:'#0a80ff',
    scheduled:'#ffc200', installed:'#ff6820', certified:'#00e676'
  }
  const stageLabel: Record<string,string> = {
    new: t('جديد','New'),
    awaiting_payment: t('بانتظار الدفع','Awaiting Payment'),
    scheduled: t('مجدول','Scheduled'),
    installed: t('تم التركيب','Installed'),
    certified: t('شهادة صادرة','Certified'),
  }

  return (
    <div dir={dir} style={{ fontFamily:'Tajawal,Arial,sans-serif', minHeight:'100vh', background:'#060c14', color:'#e0f0ff' }}>
      <Topbar title="طلبات التركيب" titleEn="Installation Requests" />
      <div style={{ padding:'24px', maxWidth:'100%' }}>

        {/* Header */}
        <div style={{ fontSize:'20px', fontWeight:900, marginBottom:'24px' }}>
          🔧 {t('طلبات التركيب','Installation Requests')}
        </div>

        {/* New Request Form */}
        <div style={{ background:'#0e1f33', borderRadius:'14px', border:'1px solid rgba(26,48,80,.8)', overflow:'hidden', marginBottom:'28px' }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(26,48,80,.6)' }}>
            <span style={{ fontSize:'14px', fontWeight:700, color:'#e0f0ff' }}>
              + {t('طلب تركيب جديد','New Installation Request')}
            </span>
          </div>

          <div style={{ padding:'20px', display:'flex', flexDirection:'column', gap:'16px' }}>

            {/* Fixed type */}
            <div style={{ background:'rgba(6,12,20,.6)', border:'1px solid rgba(26,48,80,.6)', borderRadius:'8px', padding:'10px 14px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:'12px', color:'#6090b0' }}>{t('نوع الطلب','Request Type')}</span>
              <span style={{ fontSize:'13px', fontWeight:700, color:'#0a80ff' }}>
                {t('طلب تركيب جهاز','Device Installation Request')}
              </span>
            </div>

            {/* Property + Owner */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
              <div>
                <label style={{ fontSize:'12px', color:'#6090b0', display:'block', marginBottom:'6px' }}>
                  {t('اسم العقار','Property Name')}
                </label>
                <input
                  type="text"
                  value={form.property}
                  onChange={e => setForm(p => ({ ...p, property: e.target.value }))}
                  placeholder={t('مثال: برج الخليج','e.g. Gulf Tower')}
                  style={{
                    width:'100%', padding:'10px 12px', borderRadius:'8px',
                    background:'rgba(6,12,20,.8)', border:'1px solid rgba(26,48,80,.8)',
                    color:'#e0f0ff', fontSize:'13px', fontFamily:'Tajawal,sans-serif', outline:'none',
                  }}
                  onFocus={e => e.target.style.borderColor = '#0a80ff'}
                  onBlur={e => e.target.style.borderColor = 'rgba(26,48,80,.8)'}
                />
              </div>
              <div>
                <label style={{ fontSize:'12px', color:'#6090b0', display:'block', marginBottom:'6px' }}>
                  {t('اسم المالك','Owner Name')}
                </label>
                <input
                  type="text"
                  value={form.owner}
                  onChange={e => setForm(p => ({ ...p, owner: e.target.value }))}
                  placeholder={t('الاسم الكامل','Full name')}
                  style={{
                    width:'100%', padding:'10px 12px', borderRadius:'8px',
                    background:'rgba(6,12,20,.8)', border:'1px solid rgba(26,48,80,.8)',
                    color:'#e0f0ff', fontSize:'13px', fontFamily:'Tajawal,sans-serif', outline:'none',
                  }}
                  onFocus={e => e.target.style.borderColor = '#0a80ff'}
                  onBlur={e => e.target.style.borderColor = 'rgba(26,48,80,.8)'}
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label style={{ fontSize:'12px', color:'#6090b0', display:'block', marginBottom:'6px' }}>
                {t('التاريخ','Date')}
              </label>
              <input
                type="text"
                value={dateStr}
                disabled
                style={{
                  width:'100%', padding:'10px 12px', borderRadius:'8px',
                  background:'rgba(6,12,20,.4)', border:'1px solid rgba(26,48,80,.4)',
                  color:'#6090b0', fontSize:'13px', fontFamily:'IBM Plex Mono,monospace', outline:'none',
                  cursor:'not-allowed',
                }}
              />
            </div>

            {/* Submit */}
            {success ? (
              <div style={{ padding:'12px', borderRadius:'8px', background:'rgba(0,200,83,.1)', border:'1px solid rgba(0,200,83,.3)', color:'#00c853', textAlign:'center', fontSize:'13px', fontWeight:700 }}>
                ✅ {t('تم إرسال الطلب بنجاح','Request sent successfully')}
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!form.property || !form.owner || sending}
                style={{
                  width:'100%', padding:'12px',
                  background: (form.property && form.owner) ? 'linear-gradient(135deg, #00c853, #00e676)' : 'rgba(26,48,80,.6)',
                  border:'none', borderRadius:'8px',
                  color: (form.property && form.owner) ? '#fff' : '#304560',
                  fontSize:'14px', fontWeight:700,
                  fontFamily:'Tajawal,sans-serif',
                  cursor: (form.property && form.owner) ? 'pointer' : 'not-allowed',
                  transition:'all .2s',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                }}
              >
                {sending ? '⏳' : `✓ ${t('إرسال الطلب','Send Request')}`}
              </button>
            )}

          </div>
        </div>

        {/* Previous Requests */}
        <div style={{ fontSize:'14px', fontWeight:700, color:'#6090b0', marginBottom:'14px' }}>
          {t('طلباتي الحالية والسابقة','My Current & Previous Requests')}
        </div>

        {loading ? (
          <div style={{ color:'#6090b0', padding:'40px', textAlign:'center' }}>⏳</div>
        ) : requests.length === 0 ? (
          <div style={{ padding:'40px', textAlign:'center', color:'#304560', background:'#0e1f33', borderRadius:'12px', border:'1px solid rgba(26,48,80,.8)' }}>
            {t('لا توجد طلبات سابقة','No previous requests')}
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {requests.map(r => (
              <div key={r.id} style={{ background:'#0e1f33', borderRadius:'12px', padding:'14px 20px', border:'1px solid rgba(26,48,80,.8)', display:'flex', alignItems:'center', gap:'16px' }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:'IBM Plex Mono,monospace', color:'#0a80ff', fontSize:'11px', marginBottom:'4px' }}>{r.request_code}</div>
                  <div style={{ fontWeight:700, fontSize:'13px' }}>{r.properties?.property_name || '—'}</div>
                  <div style={{ fontSize:'11px', color:'#6090b0', marginTop:'2px' }}>{r.created_at?.split('T')[0]}</div>
                </div>
                <span style={{ background:`${stageColor[r.stage] || '#6090b0'}20`, color:stageColor[r.stage] || '#6090b0', fontSize:'10px', fontWeight:700, padding:'4px 12px', borderRadius:'20px', border:`1px solid ${stageColor[r.stage] || '#6090b0'}33` }}>
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