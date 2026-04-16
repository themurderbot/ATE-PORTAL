'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#03080f',
      color: '#ddeeff',
      fontFamily: "'Tajawal', sans-serif",
      direction: 'rtl',
      overflowX: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Tajawal:wght@300;400;500;700;900&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior: smooth; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
      `}</style>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top:0, left:0, right:0, zIndex:1000,
        padding: '0 5vw', height: '70px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(3,8,15,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,207,255,0.08)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{
            width:'38px', height:'38px',
            background: 'linear-gradient(135deg, #ff2020, #ff6a00)',
            borderRadius: '9px',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'17px', fontWeight:700, color:'#fff',
            fontFamily:"'Rajdhani', sans-serif",
          }}>ATE</div>
          <div>
            <div style={{ fontSize:'15px', fontWeight:700, color:'#ddeeff', letterSpacing:'2px', fontFamily:"'Rajdhani', sans-serif" }}>ATE PLATFORM</div>
            <div style={{ fontSize:'9px', color:'#6a90b0', letterSpacing:'1px' }}>ALARM TRANSMISSION SYSTEM</div>
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <button
            onClick={() => router.push('/login')}
            style={{
              padding:'9px 22px', borderRadius:'8px',
              border:'1px solid rgba(0,207,255,0.3)',
              background:'transparent', color:'#00cfff',
              fontSize:'13px', fontWeight:700, cursor:'pointer',
              fontFamily:"'Tajawal', sans-serif",
            }}
          >
            👤 بوابة العميل
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '120px 5vw 80px',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(10,114,255,0.12) 0%, transparent 65%)',
      }}>
        <div style={{ animation: 'fadeUp 0.8s ease forwards' }}>
          <div style={{
            display: 'inline-flex', alignItems:'center', gap:'8px',
            padding:'6px 16px', borderRadius:'20px', marginBottom:'28px',
            background:'rgba(0,207,255,0.06)', border:'1px solid rgba(0,207,255,0.2)',
            fontSize:'12px', color:'#00cfff', letterSpacing:'1px',
            fontFamily:"'IBM Plex Mono', monospace",
          }}>
            <span style={{ animation:'pulse 2s infinite', display:'inline-block', width:'6px', height:'6px', borderRadius:'50%', background:'#00e676' }} />
            EN54 · SIA DC-09 · Contact ID · Modbus
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: 900, lineHeight: 1.1,
            marginBottom: '24px', color: '#ddeeff',
            fontFamily:"'Tajawal', sans-serif",
          }}>
            نظام إرسال الإنذارات<br />
            <span style={{ color:'#0a72ff' }}>الأذكى في الخليج</span>
          </h1>

          <p style={{
            fontSize: '16px', color: '#6a90b0', maxWidth: '560px',
            margin: '0 auto 40px', lineHeight: 1.8,
          }}>
            منصة متكاملة لمراقبة وإدارة أجهزة إنذار الحريق بتقنية ATE المتوافقة مع معايير الدفاع المدني
          </p>

          <div style={{ display:'flex', gap:'14px', justifyContent:'center', flexWrap:'wrap' }}>
            <button
              onClick={() => router.push('/login')}
              style={{
                padding:'14px 36px', borderRadius:'10px', border:'none',
                background:'linear-gradient(135deg, #0a72ff, #0050cc)',
                color:'#fff', fontSize:'15px', fontWeight:700, cursor:'pointer',
                fontFamily:"'Tajawal', sans-serif",
                boxShadow:'0 8px 32px rgba(10,114,255,0.3)',
              }}
            >
              👤 بوابة العميل
            </button>
            <a href="#features" style={{
              padding:'14px 36px', borderRadius:'10px',
              border:'1px solid rgba(0,207,255,0.2)',
              color:'#00cfff', fontSize:'15px', fontWeight:700,
              textDecoration:'none', fontFamily:"'Tajawal', sans-serif",
            }}>
              اكتشف المزايا ↓
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{
        padding: '40px 5vw',
        background: 'rgba(13,28,48,0.8)',
        borderTop: '1px solid rgba(20,37,64,1)',
        borderBottom: '1px solid rgba(20,37,64,1)',
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))',
          gap: '32px', maxWidth: '900px', margin: '0 auto', textAlign: 'center',
        }}>
          {[
            { value:'< 0.8s', label:'زمن الاستجابة' },
            { value:'99.9%', label:'وقت التشغيل' },
            { value:'6+', label:'أنظمة مدعومة' },
            { value:'EN54', label:'المعيار الدولي' },
          ].map((s,i) => (
            <div key={i}>
              <div style={{ fontSize:'28px', fontWeight:700, color:'#00cfff', fontFamily:"'Rajdhani', sans-serif" }}>{s.value}</div>
              <div style={{ fontSize:'12px', color:'#6a90b0', marginTop:'4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding:'80px 5vw' }}>
        <div style={{ textAlign:'center', marginBottom:'48px' }}>
          <h2 style={{ fontSize:'clamp(24px,4vw,40px)', fontWeight:900, color:'#ddeeff' }}>
            نظام يحميك ويحمي منشأتك
          </h2>
          <p style={{ color:'#6a90b0', marginTop:'12px', fontSize:'14px' }}>
            تقنية متقدمة لمراقبة الإنذارات وحماية الأرواح والممتلكات
          </p>
        </div>
        <div style={{
          display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px,1fr))',
          gap:'20px', maxWidth:'1100px', margin:'0 auto',
        }}>
          {[
            { icon:'🔴', title:'مراقبة فورية', desc:'تلقي الإنذارات وإبلاغ الدفاع المدني خلال ثوانٍ' },
            { icon:'📡', title:'6+ أنظمة', desc:'دعم Contact ID، SIA DC-09، Modbus RTU، RS485 وغيرها' },
            { icon:'📜', title:'شهادات معتمدة', desc:'إصدار شهادات التركيب والصيانة المعتمدة من الدفاع المدني' },
            { icon:'🗺️', title:'خريطة حية', desc:'تتبع مواقع الأجهزة وحالتها على خريطة تفاعلية' },
            { icon:'💳', title:'إدارة مالية', desc:'فواتير ومدفوعات وتقارير مالية كاملة' },
            { icon:'📲', title:'إشعارات WhatsApp', desc:'إبلاغ فوري عبر WhatsApp عند وقوع أي إنذار' },
          ].map((f,i) => (
            <div key={i} style={{
              background:'#0d1c30', borderRadius:'14px',
              border:'1px solid rgba(20,37,64,1)', padding:'24px',
              transition:'border-color .2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(10,114,255,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(20,37,64,1)')}
            >
              <div style={{ fontSize:'28px', marginBottom:'14px' }}>{f.icon}</div>
              <div style={{ fontSize:'15px', fontWeight:700, color:'#ddeeff', marginBottom:'8px' }}>{f.title}</div>
              <div style={{ fontSize:'12px', color:'#6a90b0', lineHeight:1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Device section */}
      <section id="device" style={{
        padding:'80px 5vw',
        background:'rgba(13,28,48,0.5)',
        borderTop:'1px solid rgba(20,37,64,1)',
      }}>
        <div style={{ maxWidth:'900px', margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'48px', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:'11px', color:'#0a72ff', letterSpacing:'2px', marginBottom:'16px', fontFamily:"'IBM Plex Mono', monospace" }}>
              ATE DEVICE
            </div>
            <h2 style={{ fontSize:'clamp(22px,3vw,36px)', fontWeight:900, color:'#ddeeff', marginBottom:'16px', lineHeight:1.3 }}>
              الجهاز
            </h2>
            <p style={{ color:'#6a90b0', lineHeight:1.8, fontSize:'14px', marginBottom:'24px' }}>
              جهاز ATE المتكامل للاتصال بلوحات إنذار الحريق ونقل البيانات للمنصة السحابية بشكل آمن وفوري
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {['متوافق مع EN54 وUL864','دعم LTE/4G وRS485','تركيب لمرة واحدة','ضمان 3 سنوات'].map((f,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', fontSize:'13px', color:'#a0c0d8' }}>
                  <span style={{ color:'#00e676', fontSize:'16px' }}>✓</span> {f}
                </div>
              ))}
            </div>
            <div style={{ marginTop:'28px' }}>
              <div style={{ fontSize:'12px', color:'#6a90b0', marginBottom:'6px' }}>سعر التركيب لمرة واحدة</div>
              <div style={{ fontSize:'32px', fontWeight:900, color:'#0a72ff', fontFamily:"'Rajdhani', sans-serif" }}>
                10,000 <span style={{ fontSize:'16px', color:'#6a90b0' }}>درهم</span>
              </div>
            </div>
          </div>
          <div style={{
            background:'#0d1c30', borderRadius:'20px',
            border:'1px solid rgba(10,114,255,0.2)',
            padding:'40px', textAlign:'center',
            display:'flex', flexDirection:'column', alignItems:'center', gap:'16px',
          }}>
            <div style={{
              width:'80px', height:'80px', borderRadius:'16px',
              background:'linear-gradient(135deg, #0a72ff, #0050cc)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'36px',
            }}>📡</div>
            <div style={{ fontSize:'16px', fontWeight:700, color:'#ddeeff' }}>ATE Gateway</div>
            <div style={{ fontSize:'12px', color:'#6a90b0', lineHeight:1.7 }}>
              الجيل الثاني من أجهزة ATE<br />للتركيب الاحترافي
            </div>
            <button
              onClick={() => router.push('/login')}
              style={{
                marginTop:'8px', padding:'12px 28px', borderRadius:'8px', border:'none',
                background:'linear-gradient(135deg, #00c853, #00e676)',
                color:'#fff', fontSize:'13px', fontWeight:700, cursor:'pointer',
                fontFamily:"'Tajawal', sans-serif", width:'100%',
              }}
            >
              ابدأ الآن ←
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding:'40px 5vw', textAlign:'center',
        borderTop:'1px solid rgba(20,37,64,1)',
        color:'#2e4d6a', fontSize:'12px',
      }}>
        <div style={{ marginBottom:'8px', color:'#6a90b0', fontFamily:"'Rajdhani', sans-serif", letterSpacing:'2px' }}>
          ATE PLATFORM
        </div>
        <div>© 2026 Alarm Transmission System — جميع الحقوق محفوظة</div>
      </footer>

    </div>
  )
}