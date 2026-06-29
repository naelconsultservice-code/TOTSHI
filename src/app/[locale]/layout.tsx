import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n/config'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isFr = locale === 'fr'

  return {
    title: isFr
      ? 'TOTSHI — Agence de transformation numérique'
      : 'TOTSHI — Digital Transformation Agency',
    description: isFr
      ? 'TOTSHI conçoit et livre des solutions numériques sur mesure — Web, Mobile, IA, FinTech, Enterprise.'
      : 'TOTSHI designs and delivers custom digital solutions — Web, Mobile, AI, FinTech, Enterprise.',
    openGraph: {
      title: isFr
        ? 'TOTSHI — Agence de transformation numérique'
        : 'TOTSHI — Digital Transformation Agency',
      description: isFr
        ? 'Développement logiciel, marketing digital et consultance stratégique.'
        : 'Software development, digital marketing and strategic consulting.',
      url: `https://totshi.vercel.app/${locale}`,
      siteName: 'TOTSHI',
      locale: isFr ? 'fr_FR' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'TOTSHI — Agence de transformation numérique',
      description: isFr
        ? 'Développement logiciel, marketing digital et consultance stratégique.'
        : 'Software development, digital marketing and strategic consulting.',
    },
    robots: { index: true, follow: true },
  }
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