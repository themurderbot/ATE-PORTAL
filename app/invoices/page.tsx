'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Topbar from '../components/Topbar'
import { useLang } from '../lib/LangContext'

type Invoice = {
  id: string; invoice_code: string; amount: number
  status: string; issue_date: string; due_date: string
  requests?: { request_code: string; properties?: { property_name: string } }
  client?: { company_name: string }
}

export default function InvoicesPage() {
  const { t, dir } = useLang()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [clientName, setClientName] = useState('')
  const [loading, setLoading] = useState(true)
  const [pdfInv, setPdfInv] = useState<Invoice | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: cl } = await supabase.from('clients').select('id, company_name').eq('email', user.email).single()
      if (!cl) return
      setClientName(cl.company_name)
      const { data } = await supabase
        .from('invoices')
        .select('*, requests(request_code, properties(property_name))')
        .eq('client_id', cl.id)
        .order('created_at', { ascending: false })
      if (data) setInvoices(data)
      setLoading(false)
    }
    load()
  }, [])

  const statusColor: Record<string,string> = { pending:'#ffc200', paid:'#00e676', overdue:'#ff3040', cancelled:'#6090b0' }
  const statusLabel: Record<string,string> = {
    pending: t('مستحقة','Pending'), paid: t('مدفوعة','Paid'),
    overdue: t('متأخرة','Overdue'), cancelled: t('ملغاة','Cancelled')
  }

  const printPDF = (inv: Invoice) => {
    const w = window.open('', '_blank')
    if (!w) return
    const sc = statusColor[inv.status] || '#6090b0'
    const sl = statusLabel[inv.status] || inv.status
    const prop = inv.requests?.properties?.property_name || '—'
    const req  = inv.requests?.request_code || '—'
    w.document.write(`<!DOCTYPE html><html dir="rtl"><head>
      <meta charset="UTF-8"/>
      <title>فاتورة ${inv.invoice_code}</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: 'Tajawal',Arial,sans-serif; background:#fff; color:#1a1a2e; padding:40px; }
        .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:32px; padding-bottom:20px; border-bottom:2px solid #0a80ff; }
        .logo { font-size:28px; font-weight:900; color:#0a80ff; letter-spacing:-1px; }
        .logo span { font-size:12px; display:block; color:#6090b0; font-weight:400; margin-top:2px; }
        .inv-num { text-align:left; }
        .inv-num h2 { font-size:22px; font-weight:900; color:#1a1a2e; }
        .inv-num p { font-size:12px; color:#6090b0; margin-top:4px; }
        .status-badge { display:inline-block; padding:4px 14px; border-radius:20px; font-size:12px; font-weight:700; background:${sc}20; color:${sc}; border:1px solid ${sc}44; margin-top:8px; }
        .section { margin-bottom:24px; }
        .section h3 { font-size:11px; color:#6090b0; text-transform:uppercase; letter-spacing:1px; margin-bottom:12px; }
        .grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .field label { font-size:11px; color:#6090b0; display:block; margin-bottom:4px; }
        .field value, .field p { font-size:14px; font-weight:600; color:#1a1a2e; }
        .amount-box { background:#0a80ff10; border:1px solid #0a80ff33; border-radius:10px; padding:20px; text-align:center; margin:24px 0; }
        .amount-box p { font-size:12px; color:#6090b0; margin-bottom:6px; }
        .amount-box h1 { font-size:36px; font-weight:900; color:#0a80ff; }
        .footer { margin-top:32px; padding-top:16px; border-top:1px solid #e0e0e0; text-align:center; font-size:11px; color:#6090b0; }
        @media print { body { padding:20px; } }
      </style>
    </head><body>
      <div class="header">
        <div class="logo">ATE<span>Alarm Transmission System</span></div>
        <div class="inv-num">
          <h2>${inv.invoice_code}</h2>
          <p>${t('تاريخ الإصدار','Issue Date')}: ${inv.issue_date || '—'}</p>
          <p>${t('تاريخ الاستحقاق','Due Date')}: ${inv.due_date || '—'}</p>
          <div class="status-badge">${sl}</div>
        </div>
      </div>

      <div class="section">
        <h3>${t('بيانات العميل','Client Details')}</h3>
        <div class="grid">
          <div class="field"><label>${t('اسم العميل','Client Name')}</label><p>${clientName}</p></div>
          <div class="field"><label>${t('العقار','Property')}</label><p>${prop}</p></div>
          <div class="field"><label>${t('رقم الطلب','Request #')}</label><p>${req}</p></div>
          <div class="field"><label>${t('رقم الفاتورة','Invoice #')}</label><p>${inv.invoice_code}</p></div>
        </div>
      </div>

      <div class="amount-box">
        <p>${t('المبلغ الإجمالي','Total Amount')}</p>
        <h1>${Number(inv.amount).toLocaleString()} ${t('درهم','AED')}</h1>
      </div>

      <div class="footer">
        <p>ATE Platform — Alarm Transmission System</p>
        <p style="margin-top:4px">${t('شكراً لثقتكم بنا','Thank you for your trust')}</p>
      </div>
      <script>window.onload=()=>{window.print()}</script>
    </body></html>`)
    w.document.close()
  }

  return (
    <div dir={dir} style={{ fontFamily:'Tajawal,Arial,sans-serif', minHeight:'100vh', background:'#060c14', color:'#e0f0ff' }}>
      <Topbar title="الفواتير" titleEn="Invoices" />
      <div style={{ padding:'24px' }}>
        <div style={{ fontSize:'20px', fontWeight:900, marginBottom:'20px' }}>
          💳 {t('الفواتير والمدفوعات','Invoices & Payments')}
        </div>

        <div style={{ background:'#0e1f33', borderRadius:'12px', border:'1px solid rgba(26,48,80,.8)', overflow:'hidden' }}>
          {loading ? (
            <div style={{ padding:'40px', textAlign:'center', color:'#6090b0' }}>⏳</div>
          ) : invoices.length === 0 ? (
            <div style={{ padding:'60px', textAlign:'center', color:'#304560' }}>
              {t('لا توجد فواتير','No invoices found')}
            </div>
          ) : (
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'rgba(10,128,255,.06)' }}>
                  {[
                    t('العقار','Property'),
                    t('رقم الفاتورة','Invoice #'),
                    t('الطلب','Request'),
                    t('المبلغ','Amount'),
                    t('الإصدار','Issue'),
                    t('الاستحقاق','Due'),
                    t('الحالة','Status'),
                    'PDF',
                  ].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'right', fontSize:'10px', color:'#6090b0', fontFamily:'IBM Plex Mono,monospace', borderBottom:'1px solid rgba(26,48,80,.8)', fontWeight:600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, i) => (
                  <tr key={inv.id} style={{ borderBottom:'1px solid rgba(26,48,80,.4)', background: i%2===0 ? 'transparent' : 'rgba(255,255,255,.01)' }}>
                    <td style={{ padding:'12px 16px', fontSize:'12px', fontWeight:600, color:'#e0f0ff' }}>
                      {inv.requests?.properties?.property_name || '—'}
                    </td>
                    <td style={{ padding:'12px 16px', fontFamily:'IBM Plex Mono,monospace', color:'#0a80ff', fontSize:'12px', fontWeight:700 }}>{inv.invoice_code}</td>
                    <td style={{ padding:'12px 16px', fontSize:'11px', color:'#6090b0' }}>{inv.requests?.request_code || '—'}</td>
                    <td style={{ padding:'12px 16px', fontFamily:'Rajdhani,sans-serif', fontWeight:700, color:'#ffc200', fontSize:'14px' }}>
                      {Number(inv.amount).toLocaleString()} {t('د','AED')}
                    </td>
                    <td style={{ padding:'12px 16px', fontFamily:'IBM Plex Mono,monospace', fontSize:'10px', color:'#6090b0' }}>{inv.issue_date || '—'}</td>
                    <td style={{ padding:'12px 16px', fontFamily:'IBM Plex Mono,monospace', fontSize:'10px', color: inv.status==='overdue' ? '#ff3040' : '#6090b0' }}>{inv.due_date || '—'}</td>
                    <td style={{ padding:'12px 16px' }}>
                      <span style={{ background:`${statusColor[inv.status]||'#6090b0'}20`, color:statusColor[inv.status]||'#6090b0', fontSize:'10px', fontWeight:700, padding:'3px 9px', borderRadius:'20px', border:`1px solid ${statusColor[inv.status]||'#6090b0'}33` }}>
                        {statusLabel[inv.status] || inv.status}
                      </span>
                    </td>
                    <td style={{ padding:'12px 16px' }}>
                      <button onClick={() => printPDF(inv)} style={{
                        background:'rgba(255,48,64,.1)', border:'1px solid rgba(255,48,64,.3)',
                        color:'#ff3040', borderRadius:'6px', padding:'5px 12px',
                        fontSize:'11px', fontWeight:700, cursor:'pointer',
                        fontFamily:'IBM Plex Mono,monospace',
                      }}>
                        PDF ↓
                      </button>
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