import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TOTSHI — Agence de développement logiciel',
  description:
    'TOTSHI conçoit et livre des solutions numériques sur mesure — Web, Mobile, IA, FinTech, Enterprise.',
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning className={inter.className}>
      <body>{children}</body>
    </html>
  )
}