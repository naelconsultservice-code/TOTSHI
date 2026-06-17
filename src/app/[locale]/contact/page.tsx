import Link from 'next/link'

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isFr = locale === 'fr'

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
            ? "Pour un projet de développement, marketing ou consultance, utilisez notre formulaire guidé — il nous permet de mieux comprendre votre besoin. Pour toute autre question (partenariat, presse, recrutement), écrivez-nous directement."
            : "For a development, marketing or consulting project, use our guided form — it helps us understand your needs better. For any other inquiry (partnership, press, recruitment), reach out directly."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href={`/${locale}/demarrer-mon-projet`}
            className="inline-flex items-center gap-2 bg-[#0066FF] hover:bg-[#0052CC]
                       text-white font-semibold px-7 py-3.5 rounded-xl text-sm
                       transition-all hover:-translate-y-0.5 w-full sm:w-auto justify-center"
          >
            {isFr ? "J'ai un projet →" : 'I have a project →'}
          </Link>

          <a
            href="mailto:itumbafelly@gmail.com"
            className="inline-flex items-center gap-2 border border-white/15
                       hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.05]
                       text-[#8892A4] hover:text-white font-semibold px-7 py-3.5
                       rounded-xl text-sm transition-all hover:-translate-y-0.5 w-full sm:w-auto justify-center"
          >
            ✉️ itumbafelly@gmail.com
          </a>
        </div>




        <p className="text-[#4A5568] text-xs">
          {isFr ? 'Réponse généralement sous 24 à 48h.' : 'Reply usually within 24 to 48h.'}
        </p>
      </div>
    </div>
  )
}