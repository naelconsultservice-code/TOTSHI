import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { triggerAIGeneration } from '@/services/ai-generation.service'

export async function POST(
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
    include: { prospect: true },
  })

  if (!submission) {
    return NextResponse.json(
      { error: 'Soumission introuvable' },
      { status: 404 }
    )
  }

  try {
    await triggerAIGeneration(submission.id, submission.prospect.language)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la régénération' },
      { status: 500 }
    )
  }
}