import Link from 'next/link'
import fr from '@/i18n/fr.json'
import en from '@/i18n/en.json'

const services = [
  { icon: '🌐', key: 'web' },
  { icon: '📱', key: 'mobile' },
  { icon: '🏢', key: 'enterprise' },
  { icon: '💳', key: 'fintech' },
  { icon: '🤖', key: 'ai' },
  { icon: '🔒', key: 'security' },
  { icon: '📈', key: 'marketing' },
  { icon: '🧭', key: 'consulting' },
]

const stats = [
  { value: '8', labelFr: "Domaines d'expertise", labelEn: 'Areas of expertise' },
  { value: '24h', labelFr: 'Délai de réponse', labelEn: 'Response time' },
  { value: '100%', labelFr: 'Sur mesure', labelEn: 'Tailor-made' },
]

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = locale === 'fr' ? fr : en
  const isFr = locale === 'fr'

  return (
    <div className="bg-[#060610]">

      {/* ═══════════════════════════════════════ HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Background gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px]
                          bg-[#0066FF]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px]
                          bg-[#0044CC]/5 rounded-full blur-[100px]" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center pt-24">

          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 border border-[#0066FF]/20
                          bg-[#0066FF]/5 rounded-full px-4 py-2 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse" />
            <span className="text-sm text-[#8892A4] font-medium">{t.hero.badge}</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white
                         leading-[1.1] tracking-tight mb-7">
            {t.hero.title}{' '}
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r
                               from-[#0066FF] to-[#3399FF]">
                {t.hero.titleHighlight}
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-[#8892A4] max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            {t.hero.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${locale}/demarrer-mon-projet`}
              className="group relative inline-flex items-center gap-3 bg-[#0066FF]
                         hover:bg-[#0052CC] text-white font-semibold px-8 py-4 rounded-xl
                         text-base transition-all hover:-translate-y-0.5
                         hover:shadow-xl hover:shadow-[#0066FF]/25 w-full sm:w-auto justify-center"
            >
              {t.hero.cta}
              <span className="text-white/70 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href={`/${locale}/realisations`}
              className="inline-flex items-center gap-2 border border-white/20
                         hover:border-white/40 bg-white/[0.02] text-[#8892A4] hover:text-white
                         font-semibold px-8 py-4 rounded-xl text-base
                         transition-all hover:-translate-y-0.5 w-full sm:w-auto justify-center"
            >
              {t.hero.ctaSecondary}
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs text-[#4A5568] uppercase tracking-widest font-medium">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-[#4A5568] to-transparent" />
        </div>
      </section>

      {/* ═══════════════════════════════════════ STATS */}
      <section className="border-y border-white/5 bg-white/[0.015]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.value} className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[#8892A4]">
                  {isFr ? stat.labelFr : stat.labelEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ SERVICES */}
      <section className="py-28 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          <div className="max-w-2xl mb-16 text-center md:text-left mx-auto md:mx-0">
            <p className="text-sm font-semibold text-[#0066FF] uppercase tracking-widest mb-4">
              {isFr ? 'Nos expertises' : 'Our expertise'}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 leading-tight">
              {t.services.title}
            </h2>
            <p className="text-[#8892A4] text-lg leading-relaxed">
              {t.services.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service) => {
              const item = t.services.items[service.key as keyof typeof t.services.items]
              return (
                <div
                  key={service.key}
                  className="group relative bg-white/[0.025] border border-white/[0.07]
                             rounded-2xl p-7 hover:border-[#0066FF]/25 hover:bg-white/[0.04]
                             transition-all duration-300 cursor-default"
                >
                  <div className="text-3xl mb-5">{service.icon}</div>
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#0066FF]
                                 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[#8892A4] text-sm leading-relaxed">{item.desc}</p>

                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r
                                  from-transparent via-[#0066FF]/0 to-transparent
                                  group-hover:via-[#0066FF]/30 transition-all duration-300" />
                </div>
              )
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              href={`/${locale}/services`}
              className="inline-flex items-center gap-2 text-[#0066FF] hover:text-white
                         font-semibold text-sm transition-colors"
            >
              {isFr ? 'Voir tous nos services' : 'View all services'}
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ PROCESSUS */}
      <section className="py-28 px-6 lg:px-8 bg-white/[0.015] border-y border-white/5">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#0066FF] uppercase tracking-widest mb-4">
              {isFr ? 'Notre approche' : 'Our approach'}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5">
              {t.process.title}
            </h2>
            <p className="text-[#8892A4] text-lg max-w-xl mx-auto leading-relaxed">
              {t.process.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(['1', '2', '3'] as const).map((step, i) => (
              <div key={step} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px
                                  bg-gradient-to-r from-[#0066FF]/20 to-transparent
                                  -translate-y-0.5 z-0" />
                )}
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-[#0066FF]/10 border border-[#0066FF]/20
                                  rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-[#0066FF] font-black text-xl">{step}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3">
                    {t.process.steps[step].title}
                  </h3>
                  <p className="text-[#8892A4] text-sm leading-relaxed">
                    {t.process.steps[step].desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ CTA FINAL */}
      <section className="py-32 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl border border-[#0066FF]/15 overflow-hidden">

            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0066FF]/8 via-[#0044CC]/4 to-transparent" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066FF]/8 rounded-full blur-3xl" />

            <div className="relative z-10 p-12 sm:p-16 text-center">
              <p className="text-sm font-semibold text-[#0066FF] uppercase tracking-widest mb-5">
                {isFr ? 'Prêt à démarrer ?' : 'Ready to start?'}
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 leading-tight">
                {t.cta.title}
              </h2>
              <p className="text-[#8892A4] text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                {t.cta.subtitle}
              </p>
              <Link
                href={`/${locale}/demarrer-mon-projet`}
                className="inline-flex items-center gap-3 bg-[#0066FF] hover:bg-[#0052CC]
                           text-white font-bold px-10 py-5 rounded-xl text-lg
                           transition-all hover:-translate-y-0.5
                           hover:shadow-2xl hover:shadow-[#0066FF]/30"
              >
                {t.cta.button}
                <span className="text-white/70">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}