import ProjectTestimonials from '@/components/testimonials/ProjectTestimonials'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
export const dynamic = 'force-dynamic'

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const isFr = locale === 'fr'

  const project = await prisma.project.findUnique({
    where: { slug, isPublished: true },
  })

  if (!project) notFound()

  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href={`/${locale}`} className="hover:text-gray-400 transition-colors">
            {isFr ? 'Accueil' : 'Home'}
          </Link>
          <span>›</span>
          <Link href={`/${locale}/realisations`} className="hover:text-gray-400 transition-colors">
            {isFr ? 'Réalisations' : 'Portfolio'}
          </Link>
          <span>›</span>
          <span className="text-gray-400">
            {isFr ? project.titleFr : project.titleEn}
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <span className="text-[#0066FF] text-sm font-medium uppercase tracking-wide">
            {project.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-4">
            {isFr ? project.titleFr : project.titleEn}
          </h1>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span key={tech} className="bg-white/5 border border-white/10 text-gray-400
                                          text-xs px-3 py-1 rounded-full">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Image */}
        {project.coverImageUrl && (
          <div className="rounded-2xl overflow-hidden mb-10 border border-white/8">
            <img
              src={project.coverImageUrl}
              alt={isFr ? project.titleFr : project.titleEn}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
              <h2 className="text-[#0066FF] text-xs font-semibold uppercase tracking-wide mb-3">
                {isFr ? 'Description' : 'Description'}
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {isFr ? project.descriptionFr : project.descriptionEn}
              </p>
            </div>

            <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
              <h2 className="text-[#0066FF] text-xs font-semibold uppercase tracking-wide mb-3">
                {isFr ? 'Problème résolu' : 'Problem solved'}
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {isFr ? project.problemFr : project.problemEn}
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#0066FF]/10 to-transparent
                            border border-[#0066FF]/20 rounded-2xl p-6">
              <h2 className="text-[#0066FF] text-xs font-semibold uppercase tracking-wide mb-3">
                {isFr ? 'Résultat obtenu' : 'Result achieved'}
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {isFr ? project.resultFr : project.resultEn}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
              <h3 className="text-white font-semibold text-sm mb-3">
                {isFr ? 'Technologies' : 'Technologies'}
              </h3>
              <div className="flex flex-col gap-2">
                {project.technologies.map((tech) => (
                  <div key={tech} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#0066FF] rounded-full" />
                    <span className="text-gray-400 text-sm">{tech}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href={`/${locale}/demarrer-mon-projet`}
              className="bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold
                         px-5 py-3 rounded-xl text-center text-sm transition-colors"
            >
              {isFr ? 'Projet similaire ? →' : 'Similar project? →'}
            </Link>
          </div>
        </div>

      {/* Témoignages liés au projet */}
        <ProjectTestimonials projectSlug={slug} locale={locale} />

        <Link
          href={`/${locale}/realisations`}
          className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          ← {isFr ? 'Retour aux réalisations' : 'Back to portfolio'}
        </Link>

        <Link
          href={`/${locale}/realisations`}
          className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          ← {isFr ? 'Retour aux réalisations' : 'Back to portfolio'}
        </Link>
      </div>
    </div>
  )
}