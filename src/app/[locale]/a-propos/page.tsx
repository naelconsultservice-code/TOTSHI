import Link from 'next/link'

export default async function AProposPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isFr = locale === 'fr'

  const values = isFr
    ? [
        { icon: '🎯', title: 'Orienté résultats', desc: "Chaque ligne de code sert un objectif business. Nous ne développons pas pour développer — nous livrons de la valeur." },
        { icon: '🔍', title: 'Rigueur technique', desc: "Architecture solide, code maintenable, tests systématiques. Nos solutions survivent à la croissance." },
        { icon: '🤝', title: 'Transparence totale', desc: "Vous savez toujours où en est votre projet. Pas de surprises, pas de zones grises." },
        { icon: '⚡', title: 'Livraison rapide', desc: "Notre processus de discovery automatisé réduit le temps de lancement. Du brief au code en un temps record." },
      ]
    : [
        { icon: '🎯', title: 'Results-oriented', desc: "Every line of code serves a business goal. We don't develop for the sake of it — we deliver value." },
        { icon: '🔍', title: 'Technical rigor', desc: "Solid architecture, maintainable code, systematic testing. Our solutions survive growth." },
        { icon: '🤝', title: 'Total transparency', desc: "You always know where your project stands. No surprises, no grey areas." },
        { icon: '⚡', title: 'Fast delivery', desc: "Our automated discovery process reduces launch time. From brief to code in record time." },
      ]

  const process = isFr
    ? [
        { step: '01', title: 'Discovery structuré', desc: "Vous décrivez votre projet en 7 étapes guidées. Notre IA génère un brief complet automatiquement." },
        { step: '02', title: 'Architecture & planification', desc: "Nous concevons l'architecture technique, la base de données et l'API avant d'écrire une ligne de code." },
        { step: '03', title: 'Développement itératif', desc: "Livraisons régulières. Vous voyez votre produit prendre forme à chaque sprint." },
        { step: '04', title: 'Tests & déploiement', desc: "Tests exhaustifs, déploiement sécurisé, documentation complète. Votre produit est prêt pour la production." },
      ]
    : [
        { step: '01', title: 'Structured discovery', desc: "You describe your project in 7 guided steps. Our AI automatically generates a complete brief." },
        { step: '02', title: 'Architecture & planning', desc: "We design the technical architecture, database and API before writing a single line of code." },
        { step: '03', title: 'Iterative development', desc: "Regular deliveries. You see your product take shape with every sprint." },
        { step: '04', title: 'Testing & deployment', desc: "Exhaustive testing, secure deployment, complete documentation. Your product is production-ready." },
      ]

  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10
                          rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-[#0066FF] rounded-full" />
            <span className="text-sm text-gray-400">
              {isFr ? 'À propos de TOTSHI' : 'About TOTSHI'}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            {isFr
              ? "L'agence qui pense avant de coder"
              : 'The agency that thinks before it codes'}
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
            {isFr
              ? "TOTSHI est une agence de développement logiciel spécialisée dans la conception et la livraison de solutions numériques sur mesure. Web, Mobile, Enterprise, FinTech, IA et Cybersécurité — nous construisons des systèmes qui durent."
              : "TOTSHI is a software development agency specialized in designing and delivering custom digital solutions. Web, Mobile, Enterprise, FinTech, AI and Cybersecurity — we build systems that last."}
          </p>
        </div>

        {/* Fondateur */}
        <div className="bg-gradient-to-br from-[#0066FF]/5 to-transparent
                        border border-[#0066FF]/15 rounded-3xl p-8 mb-20">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-[#0066FF]/20 flex items-center
                            justify-center flex-shrink-0 text-3xl">
              👨‍💻
            </div>
            <div>
              <p className="text-[#0066FF] text-sm font-medium mb-1">
                {isFr ? 'Fondateur & Principal Engineer' : 'Founder & Principal Engineer'}
              </p>
              <h2 className="text-white font-bold text-2xl mb-3">Felly Itumba</h2>
              <p className="text-gray-400 leading-relaxed">
                {isFr
                  ? "Ingénieur logiciel spécialisé dans l'architecture de systèmes complexes. TOTSHI est né d'un constat simple : les agences génériques livrent du code, pas des solutions. Notre approche combine rigueur d'ingénierie et compréhension des enjeux business pour des résultats qui comptent."
                  : "Software engineer specialized in complex system architecture. TOTSHI was born from a simple observation: generic agencies deliver code, not solutions. Our approach combines engineering rigor with business understanding for results that matter."}
              </p>
            </div>
          </div>
        </div>

        {/* Valeurs */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            {isFr ? 'Nos valeurs' : 'Our values'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((v) => (
              <div key={v.title} className="bg-white/3 border border-white/8 rounded-2xl p-6">
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Processus */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            {isFr ? 'Notre processus' : 'Our process'}
          </h2>
          <div className="flex flex-col gap-4">
            {process.map((p, i) => (
              <div key={p.step} className="flex gap-5 items-start">
                <div className="w-12 h-12 bg-[#0066FF] rounded-xl flex items-center
                                justify-center text-white font-bold text-sm flex-shrink-0">
                  {p.step}
                </div>
                <div className="flex-1 bg-white/3 border border-white/8 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-1">{p.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-[#0066FF]/10 to-transparent
                        border border-[#0066FF]/20 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            {isFr ? 'Travaillons ensemble' : "Let's work together"}
          </h2>
          <p className="text-gray-400 mb-8">
            {isFr
              ? 'Décrivez votre projet — réponse sous 24h.'
              : 'Describe your project — response within 24h.'}
          </p>
          <Link
            href={`/${locale}/demarrer-mon-projet`}
            className="inline-block bg-[#0066FF] hover:bg-[#0052CC] text-white
                       font-semibold px-8 py-4 rounded-xl text-lg transition-all
                       hover:scale-105 hover:shadow-lg hover:shadow-[#0066FF]/25"
          >
            {isFr ? 'Démarrer mon projet →' : 'Start my project →'}
          </Link>
        </div>
      </div>
    </div>
  )
}