import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#060610] flex items-center justify-center px-6">
      <div className="text-center">

        <p className="text-[#0066FF] text-sm font-semibold uppercase tracking-widest mb-4">
          Erreur 404
        </p>

        <h1 className="text-6xl sm:text-8xl font-black text-white mb-4">
          404
        </h1>

        <p className="text-[#8892A4] text-lg mb-8 max-w-md mx-auto">
          Cette page n&apos;existe pas ou a été déplacée.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/fr"
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold
                       px-6 py-3 rounded-xl transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/fr/demarrer-mon-projet"
            className="border border-white/15 hover:border-white/30 text-[#8892A4]
                       hover:text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Démarrer un projet →
          </Link>
        </div>

      </div>
    </div>
  )
}