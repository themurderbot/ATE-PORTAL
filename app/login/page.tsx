'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('❌ بيانات الدخول غير صحيحة')
      setLoading(false)
      return
    }

    window.location.href = '/'
  }

  return (
    <div dir="rtl" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#060c14 0%,#091220 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Tajawal, Arial, sans-serif',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,212,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.02) 1px,transparent 1px)',
        backgroundSize: '32px 32px', pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '440px', padding: '0 24px', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '64px', height: '64px',
            background: 'linear-gradient(135deg,#ff3040,#ff6820)',
            borderRadius: '16px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px',
            boxShadow: '0 0 30px rgba(255,48,64,0.4)',
          }}>🔔</div>
          <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: '28px', fontWeight: 700, letterSpacing: '4px', color: '#e0f0ff' }}>ATE</div>
          <div style={{ fontSize: '11px', color: '#6090b0', letterSpacing: '2px', marginTop: '4px' }}>CLIENT PORTAL</div>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(14,31,51,0.9)', borderRadius: '16px', padding: '32px',
          border: '1px solid rgba(26,48,80,0.8)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#e0f0ff', marginBottom: '6px' }}>تسجيل الدخول</h2>
          <p style={{ fontSize: '12px', color: '#6090b0', marginBottom: '24px' }}>أدخل بياناتك للوصول إلى بوابة العميل</p>

          {error && (
            <div style={{
              background: 'rgba(255,48,64,0.1)', border: '1px solid rgba(255,48,64,0.3)',
              borderRadius: '8px', padding: '10px 14px',
              fontSize: '12px', color: '#ff3040', fontWeight: 700, marginBottom: '16px',
            }}>{error}</div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block', fontSize: '10px', color: '#6090b0',
                fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '1px',
                marginBottom: '6px', fontWeight: 600,
              }}>البريد الإلكتروني</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="client@company.com" required
                style={{
                  width: '100%', padding: '11px 14px',
                  background: 'rgba(9,18,32,0.8)', border: '1px solid rgba(36,64,96,0.8)',
                  borderRadius: '9px', fontSize: '13px',
                  fontFamily: 'Tajawal,sans-serif', color: '#e0f0ff',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block', fontSize: '10px', color: '#6090b0',
                fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '1px',
                marginBottom: '6px', fontWeight: 600,
              }}>كلمة المرور</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                style={{
                  width: '100%', padding: '11px 14px',
                  background: 'rgba(9,18,32,0.8)', border: '1px solid rgba(36,64,96,0.8)',
                  borderRadius: '9px', fontSize: '13px',
                  fontFamily: 'Tajawal,sans-serif', color: '#e0f0ff',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: loading ? '#304560' : 'linear-gradient(135deg,#0a80ff,#0066cc)',
                color: '#fff', fontWeight: 700, fontSize: '14px',
                borderRadius: '9px', border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Tajawal,sans-serif',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(10,128,255,0.3)',
              }}
            >
              {loading ? '⏳ جارٍ الدخول...' : '🔐 تسجيل الدخول'}
            </button>
          </form>

          <div style={{
            marginTop: '20px', paddingTop: '20px',
            borderTop: '1px solid rgba(26,48,80,0.8)',
            textAlign: 'center', fontSize: '11px', color: '#304560',
          }}>
            ATE Platform · بوابة العملاء<br />
            <span style={{ color: '#304560' }}>يتم إنشاء الحسابات من قِبل فريق ATE</span>
          </div>
        </div>

      </div>
    </div>
  )
}