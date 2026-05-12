'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    let updateInterval: ReturnType<typeof setInterval> | null = null;

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });
        console.log('[SW] Registered:', registration.scope);

        // فحص تحديثات كل ساعة
        updateInterval = setInterval(() => {
          registration.update().catch(() => {});
        }, 60 * 60 * 1000);
      } catch (err) {
        console.warn('[SW] Registration failed:', err);
      }
    };

    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register, { once: true });
    }

    return () => {
      if (updateInterval) clearInterval(updateInterval);
    };
  }, []);

  return null;
}