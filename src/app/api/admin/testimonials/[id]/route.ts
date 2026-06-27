import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const UpdateTestimonialSchema = z.object({
  clientName: z.string().min(2).max(150).optional(),
  clientRole: z.string().max(150).optional(),
  clientCompany: z.string().max(150).optional(),
  clientAvatarUrl: z.string().optional(),
  contentFr: z.string().min(10).optional(),
  contentEn: z.string().min(10).optional(),
  rating: z.number().min(1).max(5).optional(),
  projectSlug: z.string().optional(),
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
  const parsed = UpdateTestimonialSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Données invalides', details: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const testimonial = await prisma.testimonial.update({
    where: { id },
    data: parsed.data,
  })

  return NextResponse.json(testimonial)
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

  await prisma.testimonial.delete({ where: { id } })

  return NextResponse.json({ success: true })
}