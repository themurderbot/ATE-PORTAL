'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import Topbar from '../components/Topbar'
import { useLang } from '../lib/LangContext'

type Doc = {
  id: string; name: string; description: string
  formats: string; max_size: string; status: string
  property_name: string; accepted_date?: string
}

export default function DocsPage() {
  const { t, dir } = useLang()
  const [pending, setPending] = useState<Doc[]>([])
  const [accepted, setAccepted] = useState<Doc[]>([])
  const [files, setFiles] = useState<Record<string, File | null>>({})
  const [uploading, setUploading] = useState<Record<string, boolean>>({})

  // بيانات تجريبية — استبدلها لاحقاً بـ Supabase
  useEffect(() => {
    setPending([
      {
        id: '1', name: t('عقد إيجار / سند ملكية', 'Lease / Ownership Deed'),
        description: t('مطلوب لإتمام تسجيل العقار', 'Required to complete property registration'),
        formats: 'PDF · JPG · PNG', max_size: '10MB',
        status: 'pending', property_name: t('برج الخليج', 'Gulf Tower'),
      },
      {
        id: '2', name: t('صورة الهوية الوطنية / الإقامة', 'National ID / Residence Copy'),
        description: t('المفوّض بالتوقيع على العقد', 'Authorized signatory'),
        formats: 'PDF · JPG · PNG', max_size: '5MB',
        status: 'pending', property_name: t('برج الخليج', 'Gulf Tower'),
      },
    ])
    setAccepted([
      {
        id: '3', name: t('رخصة تجارية', 'Commercial License'),
        description: '', formats: '', max_size: '',
        status: 'accepted', property_name: t('مجمع A', 'Complex A'),
        accepted_date: '22-01-2024',
      },
      {
        id: '4', name: t('عقد إيجار – مجمع A', 'Lease – Complex A'),
        description: '', formats: '', max_size: '',
        status: 'accepted', property_name: t('مجمع A', 'Complex A'),
        accepted_date: '25-01-2024',
      },
    ])
  }, [])

  const handleFile = (id: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [id]: file }))
  }

  const handleUpload = async (id: string) => {
    if (!files[id]) return
    setUploading(prev => ({ ...prev, [id]: true }))
    await new Promise(r => setTimeout(r, 1500)) // simulate upload
    setUploading(prev => ({ ...prev, [id]: false }))
    alert(t('تم إرسال الملف بنجاح ✅', 'File sent successfully ✅'))
  }

  return (
    <div dir={dir} style={{ fontFamily:'Tajawal,Arial,sans-serif', minHeight:'100vh', background:'#060c14', color:'#e0f0ff' }}>
      <Topbar title="المستندات المطلوبة" titleEn="Required Documents" />
      <div style={{ padding:'24px' }}>

        {/* Header */}
        <div style={{ marginBottom:'28px' }}>
          <div style={{ fontSize:'20px', fontWeight:900 }}>📎 {t('المستندات المطلوبة','Required Documents')}</div>
          <div style={{ fontSize:'12px', color:'#6090b0', marginTop:'4px' }}>
            {t('يرجى رفع المستندات المطلوبة لإتمام ملفك','Please upload the required documents to complete your file')}
          </div>
        </div>

        {/* Pending docs */}
        {pending.length > 0 && (
          <div style={{ marginBottom:'32px' }}>
            <div style={{ fontSize:'13px', fontWeight:700, color:'#ffc200', marginBottom:'14px', display:'flex', alignItems:'center', gap:'8px' }}>
              ⏳ {t('في انتظار الإرفاق','Awaiting Upload')}
              <span style={{ background:'#ffc20020', color:'#ffc200', fontSize:'10px', padding:'2px 8px', borderRadius:'10px', border:'1px solid #ffc20033' }}>
                {pending.length}
              </span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
              {pending.map(doc => (
                <div key={doc.id} style={{
                  background:'#0e1f33', borderRadius:'14px',
                  border:'1px solid rgba(255,193,7,.2)', overflow:'hidden',
                }}>
                  {/* Doc header */}
                  <div style={{ padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div style={{ display:'flex', gap:'12px', alignItems:'flex-start' }}>
                      <div style={{ fontSize:'22px', marginTop:'2px' }}>📄</div>
                      <div>
                        <div style={{ fontWeight:700, fontSize:'15px', color:'#e0f0ff' }}>{doc.name}</div>
                        <div style={{ fontSize:'11px', color:'#6090b0', marginTop:'3px' }}>
                          {doc.property_name} · {doc.description}
                        </div>
                        <div style={{ fontSize:'10px', color:'#304560', marginTop:'6px', fontFamily:'IBM Plex Mono,monospace' }}>
                          {t('الصيغ المقبولة','Accepted formats')}: {doc.formats} · {t('حد أقصى','Max')}: {doc.max_size}
                        </div>
                      </div>
                    </div>
                    <span style={{ background:'#ffc20015', border:'1px solid #ffc20033', color:'#ffc200', fontSize:'10px', fontWeight:700, padding:'3px 10px', borderRadius:'20px', whiteSpace:'nowrap' }}>
                      ⏳ {t('في انتظار الإرفاق','Awaiting Upload')}
                    </span>
                  </div>

                  {/* Upload area */}
                  <div style={{ padding:'0 20px 16px', display:'flex', gap:'12px', alignItems:'center' }}>
                    <label style={{
                      flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                      padding:'12px', borderRadius:'8px', cursor:'pointer',
                      border:'1.5px dashed rgba(10,128,255,.3)', background:'rgba(10,128,255,.04)',
                      color: files[doc.id] ? '#00e676' : '#6090b0', fontSize:'13px',
                      transition:'all .2s',
                    }}>
                      <input type="file" style={{ display:'none' }} accept=".pdf,.jpg,.jpeg,.png"
                        onChange={e => handleFile(doc.id, e.target.files?.[0] || null)} />
                      <span>📎</span>
                      <span>{files[doc.id] ? files[doc.id]!.name : t('انقر لإرفاق الملف','Click to attach file')}</span>
                    </label>
                    <button
                      onClick={() => handleUpload(doc.id)}
                      disabled={!files[doc.id] || uploading[doc.id]}
                      style={{
                        padding:'12px 24px', borderRadius:'8px', fontWeight:700, fontSize:'13px',
                        fontFamily:'Tajawal,sans-serif', cursor: files[doc.id] ? 'pointer' : 'not-allowed',
                        background: files[doc.id] ? 'linear-gradient(135deg,#00c853,#00e676)' : 'rgba(26,48,80,.6)',
                        border:'none', color: files[doc.id] ? '#fff' : '#304560',
                        whiteSpace:'nowrap', transition:'all .2s',
                        opacity: uploading[doc.id] ? 0.7 : 1,
                      }}
                    >
                      {uploading[doc.id] ? '⏳' : `${t('إرسال','Send')} ←`}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accepted docs */}
        {accepted.length > 0 && (
          <div>
            <div style={{ fontSize:'13px', fontWeight:700, color:'#00e676', marginBottom:'14px', display:'flex', alignItems:'center', gap:'8px' }}>
              ✅ {t('مستندات تم قبولها','Accepted Documents')}
              <span style={{ background:'#00e67620', color:'#00e676', fontSize:'10px', padding:'2px 8px', borderRadius:'10px', border:'1px solid #00e67633' }}>
                {accepted.length}
              </span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {accepted.map(doc => (
                <div key={doc.id} style={{
                  background:'#0e1f33', borderRadius:'12px',
                  border:'1px solid rgba(0,230,118,.15)',
                  padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center',
                }}>
                  <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
                    <div style={{
                      width:'32px', height:'32px', borderRadius:'8px',
                      background:'rgba(0,230,118,.1)', border:'1px solid rgba(0,230,118,.2)',
                      display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px',
                    }}>✅</div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:'14px', color:'#e0f0ff' }}>{doc.name}</div>
                      <div style={{ fontSize:'11px', color:'#6090b0', marginTop:'2px' }}>
                        {doc.property_name} · {t('تم القبول بتاريخ','Accepted on')} {doc.accepted_date}
                      </div>
                    </div>
                  </div>
                  <span style={{ background:'#00e67615', border:'1px solid #00e67633', color:'#00e676', fontSize:'10px', fontWeight:700, padding:'3px 10px', borderRadius:'20px' }}>
                    ✓ {t('مقبول','Accepted')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}