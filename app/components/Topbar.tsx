'use client'
import { useEffect, useState } from 'react'
import { useLang } from '../lib/LangContext'

interface TopbarProps { title: string; titleEn: string }

export default function Topbar({ title, titleEn }: TopbarProps) {
  const { t, dir } = useLang()
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('ar-SA'))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div dir={dir} style={{
      background: '#091220', borderBottom: '1px solid rgba(26,48,80,.8)',
      padding: '14px 24px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#6090b0', fontFamily: 'IBM Plex Mono, monospace' }}>
        <span style={{ color: '#304560' }}>ATE</span>
        <span style={{ color: '#304560' }}>·</span>
        <span style={{ color: '#e0f0ff', fontWeight: 700 }}>{t(title, titleEn)}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '11px', color: '#304560', fontFamily: 'IBM Plex Mono, monospace' }}>{time}</span>
        <span style={{ fontSize: '11px', color: '#00e676', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00e676', display: 'inline-block' }}></span>
          {t('متصل', 'Online')}
        </span>
      </div>
    </div>
  )
}