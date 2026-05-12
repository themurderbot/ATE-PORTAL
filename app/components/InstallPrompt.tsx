'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'weqayah_install_dismissed_at';
const DISMISS_DURATION_DAYS = 7;

export default function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // مثبّت فعلاً؟ ما نطلع شي
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if ('standalone' in window.navigator && (window.navigator as any).standalone) return;

    // المستخدم أغلق البانر مؤخراً؟
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const days = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (days < DISMISS_DURATION_DAYS) return;
    }

    // كشف iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua) && !(window as any).MSStream;
    setIsIOS(ios);

    // Chrome/Edge/Samsung: ينطلق beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
      setTimeout(() => setShow(true), 3000);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // iOS: ما فيه auto-prompt، نطلع بعد 5 ثواني
    let iosTimer: ReturnType<typeof setTimeout> | null = null;
    if (ios) {
      iosTimer = setTimeout(() => setShow(true), 5000);
    }

    // لما المستخدم يثبّت بنجاح
    const installedHandler = () => {
      setShow(false);
      setInstallEvent(null);
    };
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
      if (iosTimer) clearTimeout(iosTimer);
    };
  }, []);

  const handleInstall = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === 'accepted') {
      setShow(false);
      setInstallEvent(null);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  };

  if (!show) return null;
  if (!installEvent && !isIOS) return null;

  return (
    <>
      <style>{`
        @keyframes weqayahSlideUp {
          from { transform: translateY(120%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          bottom: 16,
          left: 16,
          right: 16,
          zIndex: 9999,
          maxWidth: 460,
          margin: '0 auto',
          background: '#0e1f33',
          border: '1px solid rgba(10, 128, 255, 0.25)',
          borderRadius: 16,
          padding: 14,
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontFamily: 'Tajawal, sans-serif',
          animation: 'weqayahSlideUp 0.35s ease-out',
        }}
      >
        <img
          src="/icon-192.png"
          alt="Weqayah"
          style={{ width: 52, height: 52, borderRadius: 12, flexShrink: 0 }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#e6f0fb', fontSize: 15, fontWeight: 700, marginBottom: 3 }}>
            ثبّت Weqayah
          </div>
          <div style={{ color: '#8aa0b8', fontSize: 12, lineHeight: 1.5 }}>
            {isIOS
              ? 'اضغط على زر المشاركة ⎋ ثم "إضافة إلى الشاشة الرئيسية"'
              : 'افتح المنصة كتطبيق مستقل على شاشتك الرئيسية'}
          </div>
        </div>
        {!isIOS && installEvent && (
          <button
            onClick={handleInstall}
            style={{
              background: '#0a80ff',
              color: 'white',
              border: 'none',
              padding: '9px 18px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: 'inherit',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            تثبيت
          </button>
        )}
        <button
          onClick={handleDismiss}
          aria-label="إغلاق"
          style={{
            background: 'transparent',
            color: '#5a7290',
            border: 'none',
            padding: '4px 8px',
            fontSize: 22,
            cursor: 'pointer',
            flexShrink: 0,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>
    </>
  );
}