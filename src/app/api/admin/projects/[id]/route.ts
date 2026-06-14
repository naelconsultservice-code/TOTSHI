import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const UpdateProjectSchema = z.object({
  titleFr: z.string().min(1).max(200).optional(),
  titleEn: z.string().min(1).max(200).optional(),
  category: z.string().min(1).max(100).optional(),
  descriptionFr: z.string().min(1).optional(),
  descriptionEn: z.string().min(1).optional(),
  problemFr: z.string().min(1).optional(),
  problemEn: z.string().min(1).optional(),
  resultFr: z.string().min(1).optional(),
  resultEn: z.string().min(1).optional(),
  technologies: z.array(z.string()).optional(),
  coverImageUrl: z.string().optional(),
  isPublished: z.boolean().optional(),
  displayOrder: z.number().optional(),
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
  const parsed = UpdateProjectSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Données invalides', details: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const project = await prisma.project.update({
    where: { id },
    data: parsed.data,
  })

  return NextResponse.json(project)
}