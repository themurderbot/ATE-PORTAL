'use client'
import { useLang } from '../lib/LangContext'
import Topbar from '../components/Topbar'

export default function DocsPage() {
  const { t, dir } = useLang()
  const docs = [
    { name: t('عقد الإيجار أو سند الملكية','Lease or Ownership Deed'), status: 'missing', icon: '📋' },
    { name: t('رخصة البناء','Building Permit'), status: 'missing', icon: '🏗️' },
    { name: t('شهادة إتمام البناء','Construction Completion Certificate'), status: 'uploaded', icon: '📄' },
    { name: t('خريطة الموقع','Site Plan'), status: 'uploaded', icon: '🗺️' },
  ]

  return (
    <div dir={dir} style={{ fontFamily:'Tajawal,Arial,sans-serif', minHeight:'100vh', background:'#060c14', color:'#e0f0ff' }}>
      <Topbar title="المستندات المطلوبة" titleEn="Required Documents" />
      <div style={{ padding:'24px' }}>
        <div style={{ fontSize:'20px', fontWeight:900, marginBottom:'8px' }}>📎 {t('المستندات المطلوبة','Required Documents')}</div>
        <div style={{ fontSize:'12px', color:'#6090b0', marginBottom:'24px' }}>{t('يرجى رفع المستندات التالية لإتمام ملفك','Please upload the following documents')}</div>
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {docs.map((doc, i) => (
            <div key={i} style={{ background:'#0e1f33', borderRadius:'12px', padding:'16px 20px', border:`1px solid ${doc.status==='missing' ? 'rgba(255,193,7,.2)' : 'rgba(0,230,118,.15)'}`, display:'flex', alignItems:'center', gap:'14px' }}>
              <div style={{ fontSize:'24px' }}>{doc.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:'14px' }}>{doc.name}</div>
                <div style={{ fontSize:'11px', color: doc.status==='missing' ? '#ffc200' : '#00e676', marginTop:'3px' }}>
                  {doc.status==='missing' ? t('⚠ مطلوب الرفع','⚠ Upload Required') : t('✅ تم الرفع','✅ Uploaded')}
                </div>
              </div>
              {doc.status==='missing' && (
                <button style={{ padding:'8px 16px', borderRadius:'8px', border:'1px solid rgba(10,128,255,.4)', background:'rgba(10,128,255,.1)', color:'#0a80ff', fontSize:'12px', fontWeight:700, cursor:'pointer', fontFamily:'Tajawal,sans-serif' }}>
                  ⬆ {t('رفع','Upload')}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}