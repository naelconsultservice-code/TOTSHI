import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const CreateArticleSchema = z.object({
  slug: z.string().min(3).max(150),
  titleFr: z.string().min(3).max(200),
  titleEn: z.string().min(3).max(200),
  excerptFr: z.string().min(10).max(300),
  excerptEn: z.string().min(10).max(300),
  contentFr: z.string().min(50),
  contentEn: z.string().min(50),
  category: z.string().min(2).max(100),
  coverImageUrl: z.string().optional(),
  author: z.string().optional(),
  readingMinutes: z.number().optional(),
  isPublished: z.boolean().optional(),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(articles)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = CreateArticleSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Données invalides', details: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const existing = await prisma.article.findUnique({
    where: { slug: parsed.data.slug },
  })

  if (existing) {
    return NextResponse.json(
      { error: 'Ce slug existe déjà' },
      { status: 409 }
    )
  }

  const article = await prisma.article.create({
    data: {
      ...parsed.data,
      author: parsed.data.author ?? 'TOTSHI',
      readingMinutes: parsed.data.readingMinutes ?? 5,
      isPublished: parsed.data.isPublished ?? false,
      publishedAt: parsed.data.isPublished ? new Date() : null,
    },
  })

  return NextResponse.json(article, { status: 201 })
}