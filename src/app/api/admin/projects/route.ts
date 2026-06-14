import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const ProjectSchema = z.object({
  slug: z.string().min(1).max(200),
  titleFr: z.string().min(1).max(200),
  titleEn: z.string().min(1).max(200),
  category: z.string().min(1).max(100),
  descriptionFr: z.string().min(1),
  descriptionEn: z.string().min(1),
  problemFr: z.string().min(1),
  problemEn: z.string().min(1),
  resultFr: z.string().min(1),
  resultEn: z.string().min(1),
  technologies: z.array(z.string()).min(1),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  isPublished: z.boolean().default(false),
  displayOrder: z.number().default(0),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const projects = await prisma.project.findMany({
    orderBy: { displayOrder: 'asc' },
  })

  return NextResponse.json(projects)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = ProjectSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Données invalides', details: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const project = await prisma.project.create({ data: parsed.data })
  return NextResponse.json(project, { status: 201 })
}