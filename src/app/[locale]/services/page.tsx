import Link from 'next/link'
import fr from '@/i18n/fr.json'
import en from '@/i18n/en.json'

const services = [
  {
    icon: '🌐',
    key: 'web',
    features: {
      fr: ['Sites vitrine', 'Applications web SaaS', 'Portails clients', 'Dashboards'],
      en: ['Landing pages', 'SaaS web apps', 'Client portals', 'Dashboards'],
    },
  },
  {
    icon: '📱',
    key: 'mobile',
    features: {
      fr: ['Applications iOS & Android', 'Flutter cross-platform', 'Apps hors-ligne', 'Notifications push'],
      en: ['iOS & Android apps', 'Flutter cross-platform', 'Offline apps', 'Push notifications'],
    },
  },
  {
    icon: '🏢',
    key: 'enterprise',
    features: {
      fr: ['Systèmes de gestion', 'ERP sur mesure', 'CRM métier', 'Automatisation'],
      en: ['Management systems', 'Custom ERP', 'Business CRM', 'Automation'],
    },
  },
  {
    icon: '💳',
    key: 'fintech',
    features: {
      fr: ['Portefeuilles numériques', 'Mobile Money', 'Paiements en ligne', 'Tableaux de bord financiers'],
      en: ['Digital wallets', 'Mobile Money', 'Online payments', 'Financial dashboards'],
    },
  },
  {
    icon: '🤖',
    key: 'ai',
    features: {
      fr: ["Intégration d'IA", 'Automatisation des processus', 'Analyse de données', 'Chatbots métier'],
      en: ['AI integration', 'Process automation', 'Data analysis', 'Business chatbots'],
    },
  },
  {
    icon: '🔒',
    key: 'security',
    features: {
      fr: ["Audit de sécurité", 'Tests de pénétration', 'Conformité RGPD', 'Chiffrement des données'],
      en: ['Security audit', 'Penetration testing', 'GDPR compliance', 'Data encryption'],
    },
  },
]

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = locale === 'fr' ? fr : en
  const isFr = locale === 'fr'

  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10
                          rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-[#0066FF] rounded-full" />
            <span className="text-sm text-gray-400">
              {isFr ? 'Nos services' : 'Our services'}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {t.services.title}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t.services.subtitle}
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {services.map((service) => {
            const item = t.services.items[service.key as keyof typeof t.services.items]
            const featureList = service.features[isFr ? 'fr' : 'en']
            return (
              <div
                key={service.key}
                className="bg-white/3 border border-white/8 rounded-2xl p-6
                           hover:border-[#0066FF]/30 hover:bg-white/5 transition-all group"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-white font-bold text-xl mb-2 group-hover:text-[#0066FF] transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">{item.desc}</p>
                <ul className="flex flex-col gap-1.5">
                  {featureList.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="text-[#0066FF] text-xs">→</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-[#0066FF]/10 to-transparent
                        border border-[#0066FF]/20 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {isFr ? 'Vous avez un projet en tête ?' : 'Got a project in mind?'}
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            {isFr
              ? 'Décrivez votre projet en 10 minutes. Notre IA génère un brief structuré automatiquement.'
              : 'Describe your project in 10 minutes. Our AI automatically generates a structured brief.'}
          </p>
          <Link
            href={`/${locale}/demarrer-mon-projet`}
            className="inline-block bg-[#0066FF] hover:bg-[#0052CC] text-white
                       font-semibold px-8 py-4 rounded-xl text-lg transition-all
                       hover:scale-105 hover:shadow-lg hover:shadow-[#0066FF]/25"
          >
            {t.nav.startProject} →
          </Link>
        </div>
      </div>
    </div>
  )
}