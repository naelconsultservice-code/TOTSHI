import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UpdateSubmissionSchema } from '@/validations/admin.schema'
import {
  getSubmissionDetail,
  updateSubmissionStatus,
  addInternalNote,
} from '@/services/submission.service'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const submission = await getSubmissionDetail(id)
    return NextResponse.json(submission)
  } catch {
    return NextResponse.json(
      { error: 'Soumission introuvable' },
      { status: 404 }
    )
  }
}

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
  const parsed = UpdateSubmissionSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Données invalides', details: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const { status, note } = parsed.data

  if (status) {
    await updateSubmissionStatus(id, status)
  }

  if (note) {
    await addInternalNote(id, note)
  }

  return NextResponse.json({ success: true })
}