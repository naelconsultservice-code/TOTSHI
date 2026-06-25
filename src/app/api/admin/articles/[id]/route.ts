import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const UpdateArticleSchema = z.object({
  titleFr: z.string().min(3).max(200).optional(),
  titleEn: z.string().min(3).max(200).optional(),
  excerptFr: z.string().min(10).max(300).optional(),
  excerptEn: z.string().min(10).max(300).optional(),
  contentFr: z.string().min(50).optional(),
  contentEn: z.string().min(50).optional(),
  category: z.string().min(2).max(100).optional(),
  coverImageUrl: z.string().optional(),
  readingMinutes: z.number().optional(),
  isPublished: z.boolean().optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = UpdateArticleSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Données invalides', details: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const current = await prisma.article.findUniqueOrThrow({ where: { id } })

  const data: any = { ...parsed.data }

  if (parsed.data.isPublished === true && !current.isPublished) {
    data.publishedAt = new Date()
  }

  const article = await prisma.article.update({
    where: { id },
    data,
  })

  return NextResponse.json(article)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  await prisma.article.delete({ where: { id } })

  return NextResponse.json({ success: true })
}