import Link from 'next/link'
import ConfirmationBackground from '@/components/confirmation/ConfirmationBackground'

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isFr = locale === 'fr'

  const steps = isFr
    ? [
        { icon: '📋', title: 'Brief structuré généré', desc: 'Notre IA a analysé vos réponses et compilé un document complet.' },
        { icon: '🔍', title: 'Analyse en cours', desc: 'Notre équipe étudie la faisabilité technique et le périmètre du projet.' },
        { icon: '📧', title: 'Email de confirmation envoyé', desc: 'Vérifiez votre boîte de réception, y compris les spams.' },
        { icon: '⏱️', title: 'Réponse sous 24h', desc: 'Un membre de notre équipe vous contactera personnellement.' },
      ]
    : [
        { icon: '📋', title: 'Structured brief generated', desc: 'Our AI analyzed your answers and compiled a complete document.' },
        { icon: '🔍', title: 'Analysis in progress', desc: 'Our team is reviewing technical feasibility and project scope.' },
        { icon: '📧', title: 'Confirmation email sent', desc: 'Check your inbox, including spam folder.' },
        { icon: '⏱️', title: 'Response within 24h', desc: 'A team member will personally reach out to you.' },
      ]

  return (
    <div className="relative min-h-screen bg-[#060610] flex items-center justify-center overflow-hidden px-6">

      {/* Animation immersive */}
      <ConfirmationBackground />

      <div className="relative z-10 max-w-2xl w-full py-24">

        {/* Icône succès animée */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-[#0066FF]/20 rounded-full blur-2xl
                            animate-pulse-slow scale-150" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br
                            from-[#0066FF] to-[#0044CC] flex items-center justify-center
                            shadow-2xl shadow-[#0066FF]/30 animate-fade-up">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Titre */}
        <div className="text-center mb-12 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <p className="text-sm font-semibold text-[#0066FF] uppercase tracking-widest mb-3">
            {isFr ? 'Mission lancée' : 'Mission launched'}
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            {isFr ? 'Projet reçu !' : 'Project received!'}
          </h1>
          <p className="text-[#8892A4] text-lg leading-relaxed max-w-md mx-auto">
            {isFr
              ? "Votre vision est entre de bonnes mains. Voici ce qui se passe maintenant."
              : "Your vision is in good hands. Here's what happens next."}
          </p>
        </div>

        {/* Timeline des étapes */}
        <div className="flex flex-col gap-3 mb-12">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="flex items-start gap-4 bg-white/[0.025] border border-white/[0.07]
                         rounded-2xl p-5 backdrop-blur-sm animate-fade-up
                         hover:border-[#0066FF]/20 hover:bg-white/[0.04] transition-all"
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
              <div className="w-11 h-11 rounded-xl bg-[#0066FF]/10 border border-[#0066FF]/20
                              flex items-center justify-center flex-shrink-0 text-xl">
                {step.icon}
              </div>
              <div className="pt-0.5">
                <h3 className="text-white font-semibold text-sm mb-1">{step.title}</h3>
                <p className="text-[#8892A4] text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA retour */}
        <div className="text-center animate-fade-up" style={{ animationDelay: '0.7s' }}>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 border border-white/15
                       hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.05]
                       text-[#8892A4] hover:text-white font-semibold px-7 py-3.5
                       rounded-xl text-sm transition-all hover:-translate-y-0.5"
          >
            <span className="text-base">←</span>
            {isFr ? "Retour à l'accueil" : 'Back to home'}
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-center text-[#374151] text-xs mt-10 animate-fade-up"
           style={{ animationDelay: '0.8s' }}>
          {isFr
            ? "Une question avant notre réponse ? Écrivez-nous directement."
            : 'A question before our response? Write to us directly.'}
        </p>
      </div>
    </div>
  )
}