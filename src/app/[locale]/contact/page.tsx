'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import CalendlyEmbed from '@/components/booking/CalendlyEmbed'

export default function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)
  const isFr = locale === 'fr'
  const [showCalendly, setShowCalendly] = useState(false)

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen">
      <div className="max-w-2xl mx-auto text-center">

        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10
                        rounded-full px-4 py-2 mb-8">
          <div className="w-2 h-2 bg-[#0066FF] rounded-full" />
          <span className="text-sm text-gray-400">Contact</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white mb-5">
          {isFr ? "Parlons d'autre chose ?" : 'Something else on your mind?'}
        </h1>

        <p className="text-[#8892A4] text-lg leading-relaxed mb-12 max-w-lg mx-auto">
          {isFr
            ? "Pas encore sûr de votre besoin ? Réservez un appel de 30 minutes pour en discuter directement. Pour un projet déjà défini, notre formulaire guidé reste le moyen le plus efficace."
            : "Not sure about your need yet? Book a 30-minute call to discuss it directly. For an already defined project, our guided form remains the most efficient way."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href={`/${locale}/demarrer-mon-projet`}
            className="inline-flex items-center gap-2 bg-[#0066FF] hover:bg-[#0052CC]
                       text-white font-semibold px-7 py-3.5 rounded-xl text-sm
                       transition-all hover:-translate-y-0.5 w-full sm:w-auto justify-center"
          >
            {isFr ? "J'ai un projet →" : 'I have a project →'}
          </Link>
          <button
            onClick={() => setShowCalendly(!showCalendly)}
            className="inline-flex items-center gap-2 border border-white/15
                       hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.05]
                       text-[#8892A4] hover:text-white font-semibold px-7 py-3.5
                       rounded-xl text-sm transition-all hover:-translate-y-0.5 w-full sm:w-auto justify-center"
          >
            📅 {isFr ? 'Réserver un appel' : 'Book a call'}
          </button>
        </div>

        {showCalendly && (
          <div className="mb-12 animate-fade-up">
            <CalendlyEmbed locale={locale} />
          </div>
        )}

        <div className="border-t border-white/5 pt-10">
          <p className="text-[#8892A4] text-sm mb-3">
            {isFr ? 'Ou écrivez-nous directement' : 'Or write to us directly'}
          </p>
          <a
            href="mailto:itumbafelly@gmail.com"
            className="text-[#0066FF] hover:text-white font-medium text-sm transition-colors"
          >
            itumbafelly@gmail.com
          </a>
        </div>

        <p className="text-center text-[#374151] text-xs mt-10">
          {isFr ? 'Réponse généralement sous 24 à 48h.' : 'Reply usually within 24 to 48h.'}
        </p>
      </div>
    </div>
  )
}