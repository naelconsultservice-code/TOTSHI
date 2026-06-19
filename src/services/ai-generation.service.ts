import { prisma } from '@/lib/prisma'
import { anthropic } from '@/lib/anthropic'
import { compileBrief } from '@/lib/brief-compiler'
import type { Language } from '@prisma/client'

const SYSTEM_PROMPT_FR = `Tu es un architecte solution senior et expert en rÃ©daction de cahiers des charges logiciels professionnels.

Tu reÃ§ois un brief projet soumis par un prospect via le systÃ¨me de discovery de l'agence TOTSHI.

Ta mission est de produire une Ã©bauche structurÃ©e de cahier des charges basÃ©e sur les informations disponibles.

RÃˆGLES ABSOLUES :
- Ne jamais inventer des fonctionnalitÃ©s non mentionnÃ©es.
- Identifier clairement les informations manquantes.
- Distinguer les exigences confirmÃ©es des infÃ©rences logiques.
- RÃ©diger en franÃ§ais.
- Adopter un ton professionnel adaptÃ© Ã  un document technique.
- Ne jamais Ã©crire de sections vides.
- Pour les sections oÃ¹ l'information est insuffisante, noter "[Information Ã  complÃ©ter avec le client]"

STRUCTURE DE L'Ã‰BAUCHE Ã€ PRODUIRE :
1. RÃ©sumÃ© du projet
2. ProblÃ¨me identifiÃ©
3. Utilisateurs cibles
4. Exigences fonctionnelles principales
5. Exigences non-fonctionnelles dÃ©duites
6. FonctionnalitÃ©s identifiÃ©es et leur justification
7. Contraintes identifiÃ©es
8. Questions critiques Ã  poser au prospect
9. Recommandations prÃ©liminaires
10. ComplexitÃ© estimÃ©e et observations

âš ï¸ Ã‰BAUCHE GÃ‰NÃ‰RÃ‰E AUTOMATIQUEMENT â€” Ã€ AFFINER PAR L'Ã‰QUIPE TOTSHI`

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

âš ï¸ AUTO-GENERATED DRAFT â€” TO BE REFINED BY TOTSHI TEAM`

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
      generationStatus: 'GENERATING',
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
