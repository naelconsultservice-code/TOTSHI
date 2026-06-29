import { NextRequest, NextResponse } from 'next/server'
import { SubmissionSchema } from '@/validations/submission.schema'
import { createSubmission } from '@/services/submission.service'
import { sendProspectConfirmation } from '@/services/notification.service'
import { triggerAIGeneration } from '@/services/ai-generation.service'
import { submissionRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      req.headers.get('x-real-ip') ??
      'unknown'

    // ── Rate limiting : 3 soumissions max par heure par IP ──
    const { success, limit, reset, remaining } = await submissionRateLimit.limit(ip)

    if (!success) {
      return NextResponse.json(
        { error: 'Trop de soumissions. Réessayez dans 1 heure.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          },
        }
      )
    }

    const body = await req.json()
    const parsed = SubmissionSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    if (parsed.data._hp) {
      return NextResponse.json({ success: true }, { status: 200 })
    }

    const { submission, prospect, isDuplicate } = await createSubmission(
      parsed.data,
      ip
    )

    sendProspectConfirmation({
      email: prospect.email,
      firstName: prospect.firstName,
      language: prospect.language,
      submissionId: submission.id,
    }).catch((err) => console.error('[Confirmation Email Error]', err))

    triggerAIGeneration(
      submission.id,
      prospect.language
    ).catch((err) => console.error('[AI Generation Error]', err))

    return NextResponse.json(
      { success: true, submissionId: submission.id, isDuplicate },
      { status: 201 }
    )
  } catch (error) {
    console.error('[POST /api/submissions]', error)
    return NextResponse.json(
      { error: 'Erreur serveur. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}