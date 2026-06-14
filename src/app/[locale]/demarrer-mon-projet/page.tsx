import DiscoveryFlow from '@/components/discovery/DiscoveryFlow'
import fr from '@/i18n/fr.json'
import en from '@/i18n/en.json'

export default async function DemarrerMonProjetPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = locale === 'fr' ? fr : en

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            {t.discovery.title}
          </h1>
          <p className="text-gray-400">{t.discovery.subtitle}</p>
        </div>
        <DiscoveryFlow locale={locale} />
      </div>
    </div>
  )
}