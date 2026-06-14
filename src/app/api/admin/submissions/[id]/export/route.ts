import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      prospect: true,
      documents: { orderBy: { version: 'desc' }, take: 2 },
      notes: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!submission) {
    return NextResponse.json(
      { error: 'Soumission introuvable' },
      { status: 404 }
    )
  }

  const brief = submission.documents.find((d) => d.type === 'BRIEF')
  const draft = submission.documents.find((d) => d.type === 'DRAFT_CDC')

  const exportData = {
    reference: submission.id.slice(0, 8).toUpperCase(),
    date: submission.createdAt,
    prospect: submission.prospect,
    projectType: submission.projectType,
    status: submission.status,
    completenessScore: submission.completenessScore,
    brief: brief?.content ?? '',
    draftCdc: draft?.content ?? '',
  }

  return NextResponse.json(exportData)
}