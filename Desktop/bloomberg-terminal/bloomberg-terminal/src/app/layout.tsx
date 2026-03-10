import type { Metadata } from 'next'
import { IBM_Plex_Sans, IBM_Plex_Mono, IBM_Plex_Sans_Condensed } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/shared/Sidebar'
import { MobileNav } from '@/components/shared/MobileNav'
import { TopBar } from '@/components/shared/TopBar'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { AlertNotificationManager } from '@/hooks/useAlertNotifications'
import { Toaster } from 'react-hot-toast'

const ibmSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
})
const ibmMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
})
const ibmCondensed = IBM_Plex_Sans_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'Bairagi Research Capital — Indian Market Intelligence',
  description: 'Professional market intelligence platform by Bairagi Research Capital.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${ibmSans.variable} ${ibmMono.variable} ${ibmCondensed.variable} font-sans bg-terminal-bg text-text-primary antialiased`}>
        <AuthProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-y-auto bg-terminal-bg bg-grid-pattern bg-grid">
                {children}
              </main>
            </div>
          </div>
          <MobileNav />
          <AlertNotificationManager />
        </AuthProvider>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#12121f',
              color: '#e8e8f0',
              border: '1px solid #1a1a2e',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
            },
          }}
        />
      </body>
    </html>
  )
}
