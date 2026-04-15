import type { Metadata } from 'next'
import './globals.css'
import ClientLayout from './components/ClientLayout'

export const metadata: Metadata = {
  title: 'ATE — بوابة العملاء',
  description: 'ATE Client Portal',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&family=Rajdhani:wght@600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#060c14' }}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}