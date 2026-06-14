import Link from 'next/link'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'

export default async function RealisationsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isFr = locale === 'fr'

  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    orderBy: { displayOrder: 'asc' },
  })

  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10
                          rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-[#0066FF] rounded-full" />
            <span className="text-sm text-gray-400">
              {isFr ? 'Nos réalisations' : 'Our work'}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {isFr ? 'Projets réalisés' : 'Completed projects'}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {isFr
              ? 'Des solutions concrètes livrées pour des clients réels.'
              : 'Concrete solutions delivered for real clients.'}
          </p>
        </div>

        {/* Projects grid or empty state */}
        {projects.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="text-2xl font-bold text-white mb-3">
              {isFr ? 'Projets en cours de publication' : 'Projects coming soon'}
            </h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              {isFr
                ? "Notre portfolio se remplit progressivement. Revenez bientôt pour découvrir nos réalisations."
                : "Our portfolio is being filled progressively. Come back soon to discover our work."}
            </p>
            <Link
              href={`/${locale}/demarrer-mon-projet`}
              className="inline-block bg-[#0066FF] hover:bg-[#0052CC] text-white
                         font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              {isFr ? 'Démarrer votre projet →' : 'Start your project →'}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/${locale}/realisations/${project.slug}`}
                className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden
                           hover:border-[#0066FF]/30 hover:bg-white/5 transition-all group"
              >
                {project.coverImageUrl ? (
                  <div className="aspect-video bg-white/5 overflow-hidden">
                    <img
                      src={project.coverImageUrl}
                      alt={isFr ? project.titleFr : project.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-[#0066FF]/10 to-transparent
                                  flex items-center justify-center">
                    <span className="text-4xl">💻</span>
                  </div>
                )}
                <div className="p-5">
                  <span className="text-xs text-[#0066FF] font-medium uppercase tracking-wide">
                    {project.category}
                  </span>
                  <h3 className="text-white font-bold text-lg mt-1 mb-2 group-hover:text-[#0066FF] transition-colors">
                    {isFr ? project.titleFr : project.titleEn}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                    {isFr ? project.descriptionFr : project.descriptionEn}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span key={tech} className="text-xs bg-white/5 text-gray-400
                                                   px-2 py-1 rounded-lg">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}