import { prisma } from '@/lib/prisma'
import { anthropic } from '@/lib/anthropic'
import { compileBrief } from '@/lib/brief-compiler'
import type { Language } from '@prisma/client'

const SYSTEM_PROMPT_FR = `Tu es un architecte solution senior et expert en rédaction de cahiers des charges logiciels professionnels.

Tu reçois un brief projet soumis par un prospect via le système de discovery de l'agence TOTSHI.

Ta mission est de produire une ébauche structurée de cahier des charges basée sur les informations disponibles.

RÈGLES ABSOLUES :
- Ne jamais inventer des fonctionnalités non mentionnées.
- Identifier clairement les informations manquantes.
- Distinguer les exigences confirmées des inférences logiques.
- Rédiger en français.
- Adopter un ton professionnel adapté à un document technique.
- Ne jamais écrire de sections vides.
- Pour les sections où l'information est insuffisante, noter "[Information à compléter avec le client]"

STRUCTURE DE L'ÉBAUCHE À PRODUIRE :
1. Résumé du projet
2. Problème identifié
3. Utilisateurs cibles
4. Exigences fonctionnelles principales
5. Exigences non-fonctionnelles déduites
6. Fonctionnalités identifiées et leur justification
7. Contraintes identifiées
8. Questions critiques à poser au prospect
9. Recommandations préliminaires
10. Complexité estimée et observations

⚠️ ÉBAUCHE GÉNÉRÉE AUTOMATIQUEMENT — À AFFINER PAR L'ÉQUIPE TOTSHI`

const SYSTEM_PROMPT_EN = `You are a senior solution architect and expert in writing professional software specifications.

You receive a project brief submitted by a prospect through TOTSHI agency's discovery system.

Your mission is to produce a structured draft specification based on the available information.

ABSOLUTE RULES:
- Never invent features not mentioned.
- Clearly identify missing information.
- Distinguish confirmed requirements from logical inferences.
- Write in English.
- Adopt a professional tone appropriate for a technical document.
- Never write empty sections.
- For sections where information is insufficient, note "[Information to be completed with the client]"

DRAFT STRUCTURE TO PRODUCE:
1. Project summary
2. Identified problem
3. Target users
4. Main functional requirements
5. Inferred non-functional requirements
6. Identified features and their justification
7. Identified constraints
8. Critical questions to ask the prospect
9. Preliminary recommendations
10. Estimated complexity and observations

⚠️ AUTO-GENERATED DRAFT — TO BE REFINED BY TOTSHI TEAM`

export async function triggerAIGeneration(
  submissionId: string,
  language: Language
) {
  const submission = await prisma.submission.findUniqueOrThrow({
    where: { id: submissionId },
    include: { prospect: true },
  })

  const lang = language === 'fr' ? 'fr' : 'en'

  const lastDoc = await prisma.generatedDocument.findFirst({
    where: { submissionId, type: 'DRAFT_CDC' },
    orderBy: { version: 'desc' },
  })
  const nextVersion = (lastDoc?.version ?? 0) + 1

  const draftDocument = await prisma.generatedDocument.create({
    data: {
      submissionId,
      type: 'DRAFT_CDC',
      content: '',
      language,
      generationStatus: 'PROCESSING',
      version: nextVersion,
    },
  })

  try {
    const brief = compileBrief(
      {
        submissionId: submission.id,
        createdAt: submission.createdAt,
        prospect: submission.prospect,
        projectType: submission.projectType,
        description: submission.description,
        targetUsers: submission.targetUsers,
        features: submission.features,
        constraints: submission.constraints,
        completenessScore: submission.completenessScore,
      },
      lang
    )

    await prisma.generatedDocument.create({
      data: {
        submissionId,
        type: 'BRIEF',
        content: brief,
        language,
        generationStatus: 'COMPLETED',
        version: nextVersion,
      },
    })

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: lang === 'fr' ? SYSTEM_PROMPT_FR : SYSTEM_PROMPT_EN,
      messages: [{ role: 'user', content: brief }],
    })

    const content = message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as any).text)
      .join('\n')

    await prisma.generatedDocument.update({
      where: { id: draftDocument.id },
      data: { content, generationStatus: 'COMPLETED' },
    })

    const { sendAdminNotification } = await import(
      '@/services/notification.service'
    )
    await sendAdminNotification({
      submissionId,
      prospectName: `${submission.prospect.firstName} ${submission.prospect.lastName}`,
      projectType: submission.projectType,
      brief,
      draftCdc: content,
      language: lang,
    })

    return { success: true, content }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Erreur inconnue'

    await prisma.generatedDocument.update({
      where: { id: draftDocument.id },
      data: { generationStatus: 'FAILED', errorMessage },
    })

    const { sendErrorAlert } = await import('@/services/notification.service')
    await sendErrorAlert({ submissionId, errorMessage })

    throw error
  }
}