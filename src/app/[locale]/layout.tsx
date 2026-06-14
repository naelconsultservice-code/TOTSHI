import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n/config'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: 'TOTSHI — Agence de développement logiciel',
  description:
    'TOTSHI conçoit et livre des solutions numériques sur mesure — Web, Mobile, IA, FinTech, Enterprise.',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale as any)) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <Navbar locale={locale} />
      <main>{children}</main>
      <Footer locale={locale} />
    </div>
  )
}