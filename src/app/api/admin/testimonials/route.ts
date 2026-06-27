import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const CreateTestimonialSchema = z.object({
  clientName: z.string().min(2).max(150),
  clientRole: z.string().max(150).optional(),
  clientCompany: z.string().max(150).optional(),
  clientAvatarUrl: z.string().url().optional().or(z.literal('')),
  contentFr: z.string().min(10),
  contentEn: z.string().min(10),
  rating: z.number().min(1).max(5).default(5),
  projectSlug: z.string().optional().or(z.literal('')),
  isPublished: z.boolean().default(false),
  displayOrder: z.number().default(0),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const testimonials = await prisma.testimonial.findMany({
    orderBy: { displayOrder: 'asc' },
  })

  return NextResponse.json(testimonials)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = CreateTestimonialSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Données invalides', details: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const testimonial = await prisma.testimonial.create({
    data: {
      ...parsed.data,
      clientAvatarUrl: parsed.data.clientAvatarUrl || null,
      projectSlug: parsed.data.projectSlug || null,
    },
  })

  return NextResponse.json(testimonial, { status: 201 })
}