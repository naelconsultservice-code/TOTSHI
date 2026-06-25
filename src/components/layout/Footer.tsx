import Link from 'next/link'
import fr from '@/i18n/fr.json'
import en from '@/i18n/en.json'

export default function Footer({ locale }: { locale: string }) {
  const t = locale === 'fr' ? fr : en
  const year = new Date().getFullYear()
  const isFr = locale === 'fr'

  return (
    <footer className="border-t border-white/5 bg-[#060610]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-center md:text-left">

          {/* Brand */}
          <div className="md:col-span-2 flex flex-col items-center md:items-start">
            <span className="text-2xl font-black text-white">
              TOT<span className="text-[#0066FF]">SHI</span>
            </span>
            <p className="mt-4 text-[#8892A4] text-sm leading-relaxed max-w-sm">
              {isFr
                ? "Agence de transformation numérique — développement logiciel, marketing digital et conseil stratégique pour accompagner la croissance de votre activité."
                : "Digital transformation agency — software development, digital marketing and strategic consulting to support your business growth."}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-4">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-[#4A5568]">
                {isFr ? 'Disponible pour nouveaux projets' : 'Available for new projects'}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-center md:items-start">
            <p className="text-xs font-semibold text-white uppercase tracking-widest mb-5">
              {isFr ? 'Navigation' : 'Navigation'}
            </p>
            <div className="flex flex-col items-center md:items-start gap-3">
              {[
                { href: `/${locale}`, label: t.nav.home },
                { href: `/${locale}/services`, label: t.nav.services },
                { href: `/${locale}/realisations`, label: t.nav.portfolio },
                { href: `/${locale}/blog`, label: 'Blog' },
                { href: `/${locale}/a-propos`, label: t.nav.about },
                { href: `/${locale}/contact`, label: 'Contact' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#8892A4] hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center md:items-start">
            <p className="text-xs font-semibold text-white uppercase tracking-widest mb-5">
              {isFr ? 'Démarrer' : 'Get started'}
            </p>
            <p className="text-sm text-[#8892A4] mb-4 leading-relaxed">
              {isFr
                ? 'Un projet en tête ? Décrivez-le en 10 minutes.'
                : 'Got a project? Describe it in 10 minutes.'}
            </p>
            <Link
              href={`/${locale}/demarrer-mon-projet`}
              className="inline-flex items-center gap-2 bg-[#0066FF] hover:bg-[#0052CC]
                         text-white text-sm font-semibold px-4 py-2.5 rounded-xl
                         transition-all hover:shadow-lg hover:shadow-[#0066FF]/20"
            >
              {t.nav.startProject}
              <span className="text-xs opacity-70">→</span>
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row
                        justify-center sm:justify-between items-center gap-4 text-center">
          <p className="text-xs text-[#4A5568]">
            © {year} TOTSHI. {t.footer.rights}.
          </p>
          <div className="flex items-center justify-center gap-6">
            <Link
              href={`/${locale === 'fr' ? 'en' : 'fr'}`}
              className="text-xs text-[#4A5568] hover:text-[#8892A4] transition-colors uppercase font-semibold tracking-wider"
            >
              {locale === 'fr' ? 'English' : 'Français'}
            </Link>
            <Link
              href={`/${locale}/confidentialite`}
              className="text-xs text-[#4A5568] hover:text-[#8892A4] transition-colors"
            >
              {t.footer.privacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}