'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Topbar from '../components/Topbar'
import { useLang } from '../lib/LangContext'

type Invoice = { id: string; invoice_code: string; amount: number; status: string; issue_date: string; due_date: string; requests?: { request_code: string } }

export default function InvoicesPage() {
  const { t, dir } = useLang()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: cl } = await supabase.from('clients').select('id').eq('email', user.email).single()
      if (!cl) return
      const { data } = await supabase.from('invoices').select('*, requests(request_code)').eq('client_id', cl.id).order('created_at', { ascending: false })
      if (data) setInvoices(data)
      setLoading(false)
    }
    load()
  }, [])

  const statusColor: Record<string,string> = { pending:'#ffc200', paid:'#00e676', overdue:'#ff3040', cancelled:'#6090b0' }
  const statusLabel: Record<string,string> = { pending: t('مستحقة','Pending'), paid: t('مدفوعة','Paid'), overdue: t('متأخرة','Overdue'), cancelled: t('ملغاة','Cancelled') }

  return (
    <div dir={dir} style={{ fontFamily:'Tajawal,Arial,sans-serif', minHeight:'100vh', background:'#060c14', color:'#e0f0ff' }}>
      <Topbar title="الفواتير" titleEn="Invoices" />
      <div style={{ padding:'24px' }}>
        <div style={{ fontSize:'20px', fontWeight:900, marginBottom:'20px' }}>💳 {t('الفواتير والمدفوعات','Invoices & Payments')}</div>
        <div style={{ background:'#0e1f33', borderRadius:'12px', border:'1px solid rgba(26,48,80,.8)', overflow:'hidden' }}>
          {loading ? <div style={{ padding:'40px', textAlign:'center', color:'#6090b0' }}>⏳</div> : (
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'rgba(10,128,255,.06)' }}>
                  {[t('رقم الفاتورة','Invoice #'), t('الطلب','Request'), t('المبلغ','Amount'), t('الإصدار','Issue'), t('الاستحقاق','Due'), t('الحالة','Status')].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'right', fontSize:'10px', color:'#6090b0', fontFamily:'IBM Plex Mono,monospace', borderBottom:'1px solid rgba(26,48,80,.8)', fontWeight:600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, i) => (
                  <tr key={inv.id} style={{ borderBottom:'1px solid rgba(26,48,80,.4)', background: i%2===0 ? 'transparent' : 'rgba(255,255,255,.01)' }}>
                    <td style={{ padding:'12px 16px', fontFamily:'IBM Plex Mono,monospace', color:'#0a80ff', fontSize:'12px', fontWeight:700 }}>{inv.invoice_code}</td>
                    <td style={{ padding:'12px 16px', fontSize:'11px', color:'#6090b0' }}>{inv.requests?.request_code || '—'}</td>
                    <td style={{ padding:'12px 16px', fontFamily:'Rajdhani,sans-serif', fontWeight:700, color:'#ffc200', fontSize:'14px' }}>{Number(inv.amount).toLocaleString()} {t('د','AED')}</td>
                    <td style={{ padding:'12px 16px', fontFamily:'IBM Plex Mono,monospace', fontSize:'10px', color:'#6090b0' }}>{inv.issue_date || '—'}</td>
                    <td style={{ padding:'12px 16px', fontFamily:'IBM Plex Mono,monospace', fontSize:'10px', color: inv.status==='overdue' ? '#ff3040' : '#6090b0' }}>{inv.due_date || '—'}</td>
                    <td style={{ padding:'12px 16px' }}>
                      <span style={{ background:`${statusColor[inv.status] || '#6090b0'}20`, color:statusColor[inv.status] || '#6090b0', fontSize:'10px', fontWeight:700, padding:'3px 9px', borderRadius:'20px', border:`1px solid ${statusColor[inv.status] || '#6090b0'}33` }}>
                        {statusLabel[inv.status] || inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}