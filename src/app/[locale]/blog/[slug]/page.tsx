import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const isFr = locale === 'fr'

  const article = await prisma.article.findUnique({
    where: { slug, isPublished: true },
  })

  if (!article) notFound()

  const content = isFr ? article.contentFr : article.contentEn

  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href={`/${locale}`} className="hover:text-gray-400 transition-colors">
            {isFr ? 'Accueil' : 'Home'}
          </Link>
          <span>›</span>
          <Link href={`/${locale}/blog`} className="hover:text-gray-400 transition-colors">
            Blog
          </Link>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs text-[#0066FF] font-medium uppercase tracking-wide bg-[#0066FF]/10 px-2.5 py-1 rounded-full">
              {article.category}
            </span>
            <span className="text-xs text-gray-600">
              {article.readingMinutes} {isFr ? 'min de lecture' : 'min read'}
            </span>
            {article.publishedAt && (
              <span className="text-xs text-gray-600">
                · {new Date(article.publishedAt).toLocaleDateString(isFr ? 'fr-FR' : 'en-US')}
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            {isFr ? article.titleFr : article.titleEn}
          </h1>
          <p className="text-gray-500">
            {isFr ? 'Par' : 'By'} {article.author}
          </p>
        </div>

        {article.coverImageUrl && (
          <div className="rounded-2xl overflow-hidden mb-10 border border-white/8">
            <img
              src={article.coverImageUrl}
              alt={isFr ? article.titleFr : article.titleEn}
              className="w-full object-cover"
            />
          </div>
        )}

        <div className="prose prose-invert max-w-none">
          {content.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-gray-300 leading-relaxed mb-5 whitespace-pre-wrap">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-16 pt-10 border-t border-white/5 text-center">
          <p className="text-gray-400 mb-6">
            {isFr ? 'Un projet en tête ?' : 'Got a project in mind?'}
          </p>
          <Link
            href={`/${locale}/demarrer-mon-projet`}
            className="inline-block bg-[#0066FF] hover:bg-[#0052CC] text-white
                       font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            {isFr ? 'Démarrer mon projet →' : 'Start my project →'}
          </Link>
        </div>
      </div>
    </div>
  )
}