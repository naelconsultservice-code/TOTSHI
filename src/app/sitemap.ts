import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://totshi.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    '', '/services', '/realisations', '/a-propos', '/blog',
    '/contact', '/demarrer-mon-projet', '/confidentialite',
  ]

  const staticUrls: MetadataRoute.Sitemap = []
  for (const locale of ['fr', 'en']) {
    for (const path of staticPaths) {
      staticUrls.push({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.7,
      })
    }
  }

  let articleUrls: MetadataRoute.Sitemap = []
  try {
    const articles = await prisma.article.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    })

    for (const locale of ['fr', 'en']) {
      for (const article of articles) {
        articleUrls.push({
          url: `${BASE_URL}/${locale}/blog/${article.slug}`,
          lastModified: article.updatedAt,
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    }
  } catch {
    // En cas d'échec DB au build, ne pas bloquer le sitemap
  }

  let projectUrls: MetadataRoute.Sitemap = []
  try {
    const projects = await prisma.project.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    })

    for (const locale of ['fr', 'en']) {
      for (const project of projects) {
        projectUrls.push({
          url: `${BASE_URL}/${locale}/realisations/${project.slug}`,
          lastModified: project.updatedAt,
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    }
  } catch {
    // idem
  }

  return [...staticUrls, ...articleUrls, ...projectUrls]
}