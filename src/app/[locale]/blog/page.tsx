import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isFr = locale === 'fr'

  let articles: any[] = []
  try {
    articles = await prisma.article.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
    })
  } catch {
    // DB inaccessible en local — fonctionne en production
  }


  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10
                          rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-[#0066FF] rounded-full" />
            <span className="text-sm text-gray-400">Blog</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {isFr ? 'Ressources & Insights' : 'Resources & Insights'}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {isFr
              ? 'Nos analyses sur le développement, le marketing digital et la transformation numérique.'
              : 'Our insights on development, digital marketing and digital transformation.'}
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-6">📝</div>
            <h2 className="text-2xl font-bold text-white mb-3">
              {isFr ? 'Premiers articles à venir' : 'First articles coming soon'}
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              {isFr
                ? 'Nous préparons du contenu de qualité sur nos domaines d\'expertise.'
                : 'We are preparing quality content on our areas of expertise.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/${locale}/blog/${article.slug}`}
                className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden
                           hover:border-[#0066FF]/30 hover:bg-white/5 transition-all group"
              >
                {article.coverImageUrl ? (
                  <div className="aspect-video bg-white/5 overflow-hidden">
                    <img
                      src={article.coverImageUrl}
                      alt={isFr ? article.titleFr : article.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-[#0066FF]/10 to-transparent
                                  flex items-center justify-center">
                    <span className="text-4xl">📄</span>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-[#0066FF] font-medium uppercase tracking-wide">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-600">·</span>
                    <span className="text-xs text-gray-600">
                      {article.readingMinutes} {isFr ? 'min de lecture' : 'min read'}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#0066FF] transition-colors">
                    {isFr ? article.titleFr : article.titleEn}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                    {isFr ? article.excerptFr : article.excerptEn}
                  </p>
                  {article.publishedAt && (
                    <p className="text-gray-700 text-xs mt-4">
                      {new Date(article.publishedAt).toLocaleDateString(isFr ? 'fr-FR' : 'en-US')}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}