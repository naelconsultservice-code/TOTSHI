import type { Language } from '@prisma/client'

type BriefData = {
  submissionId: string
  createdAt: Date
  needType: string
  prospect: {
    firstName: string
    lastName: string
    email: string
    phone: string | null
    company: string | null
    country: string
    sector: string
  }
  projectType: string
  description: string
  targetUsers: any
  features: any
  constraints: any
  completenessScore: number | null
}

const needTypeLabels: Record<string, { fr: string; en: string }> = {
  DEVELOPPEMENT: { fr: 'Développement logiciel', en: 'Software development' },
  MARKETING: { fr: 'Marketing & Communication', en: 'Marketing & Communication' },
  CONSULTANCE: { fr: 'Consultance & Stratégie', en: 'Consulting & Strategy' },
  INDETERMINE: { fr: 'À déterminer', en: 'To be determined' },
}

export function compileBrief(data: BriefData, lang: Language = 'fr'): string {
  const fr = lang === 'fr'
  const lines: string[] = []
  const needLabel = needTypeLabels[data.needType]?.[fr ? 'fr' : 'en'] ?? data.needType

  lines.push(fr ? '# BRIEF STRUCTURÉ — TOTSHI' : '# STRUCTURED BRIEF — TOTSHI')
  lines.push(`${fr ? 'Date' : 'Date'} : ${new Date(data.createdAt).toLocaleDateString(fr ? 'fr-FR' : 'en-US')}`)
  lines.push(`${fr ? 'Référence' : 'Reference'} : #${data.submissionId.slice(0, 8).toUpperCase()}`)
  lines.push('')

  lines.push(fr ? '## CATÉGORIE DE BESOIN' : '## NEED CATEGORY')
  lines.push(`${fr ? 'Type' : 'Type'} : ${needLabel}`)
  lines.push(`${fr ? 'Précision' : 'Specification'} : ${data.projectType.replace(/_/g, ' ')}`)
  lines.push('')

  lines.push(fr ? '## PROSPECT' : '## PROSPECT')
  lines.push(`${fr ? 'Nom' : 'Name'} : ${data.prospect.firstName} ${data.prospect.lastName}`)
  lines.push(`Email : ${data.prospect.email}`)
  if (data.prospect.phone) lines.push(`${fr ? 'Téléphone' : 'Phone'} : ${data.prospect.phone}`)
  if (data.prospect.company) lines.push(`${fr ? 'Entreprise' : 'Company'} : ${data.prospect.company}`)
  lines.push(`${fr ? 'Pays' : 'Country'} : ${data.prospect.country}`)
  lines.push(`${fr ? 'Secteur' : 'Sector'} : ${data.prospect.sector}`)
  lines.push('')

  lines.push(fr ? '## DESCRIPTION DU BESOIN' : '## NEED DESCRIPTION')
  lines.push(data.description)
  lines.push('')

  const targetUsers = data.targetUsers ?? {}
  lines.push(fr ? '## CIBLE / UTILISATEURS' : '## TARGET / USERS')
  if (targetUsers.profile) lines.push(`${fr ? 'Profil' : 'Profile'} : ${targetUsers.profile}`)
  if (targetUsers.estimatedVolume) lines.push(`${fr ? 'Volume' : 'Volume'} : ${targetUsers.estimatedVolume}`)
  if (targetUsers.geography) lines.push(`${fr ? 'Géographie' : 'Geography'} : ${targetUsers.geography}`)
  if (targetUsers.techLevel) lines.push(`${fr ? 'Niveau technique' : 'Tech level'} : ${targetUsers.techLevel}`)
  if (targetUsers.accessType) lines.push(`${fr ? "Type d'accès" : 'Access type'} : ${targetUsers.accessType}`)
  lines.push('')

  const features = data.features ?? { selected: [], freeText: '' }
  if (features.selected?.length > 0) {
    lines.push(
      data.needType === 'MARKETING'
        ? (fr ? '## PRESTATIONS SOUHAITÉES' : '## DESIRED SERVICES')
        : data.needType === 'CONSULTANCE'
        ? (fr ? '## LIVRABLES ATTENDUS' : '## EXPECTED DELIVERABLES')
        : (fr ? '## FONCTIONNALITÉS' : '## FEATURES')
    )
    const byPriority: Record<string, string[]> = { indispensable: [], souhaitable: [], futur: [] }
    features.selected.forEach((f: any) => {
      const key = f.priority in byPriority ? f.priority : 'souhaitable'
      byPriority[key].push(f.label)
    })
    if (byPriority.indispensable.length) lines.push(`${fr ? 'Indispensable' : 'Must-have'} : ${byPriority.indispensable.join(', ')}`)
    if (byPriority.souhaitable.length) lines.push(`${fr ? 'Souhaitable' : 'Nice-to-have'} : ${byPriority.souhaitable.join(', ')}`)
    if (byPriority.futur.length) lines.push(`${fr ? 'Phase suivante' : 'Next phase'} : ${byPriority.futur.join(', ')}`)
    if (features.freeText) lines.push(`${fr ? 'Autres éléments' : 'Other elements'} : ${features.freeText}`)
    lines.push('')
  }

  const constraints = data.constraints ?? {}
  lines.push(fr ? '## CONTRAINTES & CONTEXTE' : '## CONSTRAINTS & CONTEXT')
  if (constraints.budget) lines.push(`Budget : ${constraints.budget}`)
  if (constraints.timeline) lines.push(`${fr ? 'Délai' : 'Timeline'} : ${constraints.timeline}`)
  if (constraints.urgencyLevel) lines.push(`${fr ? 'Urgence' : 'Urgency'} : ${constraints.urgencyLevel}`)
  if (constraints.currentSystem) lines.push(`${fr ? 'Système actuel' : 'Current system'} : ${constraints.currentSystem}`)
  if (constraints.references) lines.push(`${fr ? 'Références' : 'References'} : ${constraints.references}`)
  if (constraints.technicalConstraints) lines.push(`${fr ? 'Contraintes techniques' : 'Technical constraints'} : ${constraints.technicalConstraints}`)
  lines.push('')

  lines.push(`${fr ? '## SCORE DE COMPLÉTUDE' : '## COMPLETENESS SCORE'} : ${data.completenessScore ?? 0}/100`)

  return lines.join('\n')
}