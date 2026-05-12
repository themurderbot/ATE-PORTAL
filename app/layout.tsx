import type { Metadata, Viewport } from 'next'
import './globals.css'
import ClientLayout from './components/ClientLayout'
import ServiceWorkerRegister from './components/ServiceWorkerRegister'
import InstallPrompt from './components/InstallPrompt'

export const metadata: Metadata = {
  title: 'Weqayah',
  description: 'منصة إدارة أجهزة إنذار الحريق',
  applicationName: 'Weqayah',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Weqayah',
  },
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: '#060c14',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&family=Rajdhani:wght@600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#060c14' }}>
        <ServiceWorkerRegister />
        <InstallPrompt />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}