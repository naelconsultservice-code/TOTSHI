import type { SubmissionInput } from '@/validations/submission.schema'

const needTypeLabels: Record<string, string> = {
  DEVELOPPEMENT: 'Développement logiciel',
  MARKETING: 'Marketing & Communication',
  CONSULTANCE: 'Consultance & Stratégie',
  INDETERMINE: 'À déterminer',
}

export function compileBrief(data: SubmissionInput & { needType: string }): string {
  const lines: string[] = []

  lines.push('# BRIEF STRUCTURÉ — TOTSHI')
  lines.push(`Date : ${new Date().toLocaleDateString('fr-FR')}`)
  lines.push('')

  // Catégorie de besoin
  lines.push('## CATÉGORIE DE BESOIN')
  lines.push(`Type : ${needTypeLabels[data.needType] ?? data.needType}`)
  lines.push(`Précision : ${data.projectType.replace(/_/g, ' ')}`)
  lines.push('')

  // Prospect
  lines.push('## PROSPECT')
  lines.push(`Nom : ${data.firstName} ${data.lastName}`)
  lines.push(`Email : ${data.email}`)
  if (data.phone) lines.push(`Téléphone : ${data.phone}`)
  if (data.company) lines.push(`Entreprise : ${data.company}`)
  lines.push(`Pays : ${data.country}`)
  lines.push(`Secteur : ${data.sector}`)
  lines.push(`Langue : ${data.language.toUpperCase()}`)
  lines.push('')

  // Description
  lines.push('## DESCRIPTION DU BESOIN')
  lines.push(data.description)
  lines.push('')

  // Utilisateurs/cibles
  if (data.needType === 'DEVELOPPEMENT' || data.needType === 'INDETERMINE') {
    lines.push('## UTILISATEURS CIBLES')
    lines.push(`Profil : ${data.targetUsers.profile}`)
    if (data.targetUsers.estimatedVolume) lines.push(`Volume : ${data.targetUsers.estimatedVolume}`)
    if (data.targetUsers.geography) lines.push(`Géographie : ${data.targetUsers.geography}`)
    if (data.targetUsers.techLevel) lines.push(`Niveau technique : ${data.targetUsers.techLevel}`)
    if (data.targetUsers.accessType) lines.push(`Type d'accès : ${data.targetUsers.accessType}`)
  } else {
    lines.push('## CIBLE')
    lines.push(`Description de la cible : ${data.targetUsers.profile}`)
    if (data.targetUsers.geography) lines.push(`Zone géographique : ${data.targetUsers.geography}`)
  }
  lines.push('')

  // Fonctionnalités / Prestations
  if (data.features.selected.length > 0) {
    if (data.needType === 'DEVELOPPEMENT') {
      lines.push('## FONCTIONNALITÉS')
    } else if (data.needType === 'MARKETING') {
      lines.push('## PRESTATIONS SOUHAITÉES')
    } else if (data.needType === 'CONSULTANCE') {
      lines.push('## LIVRABLES ATTENDUS')
    } else {
      lines.push('## ÉLÉMENTS SOUHAITÉS')
    }

    const byPriority: Record<string, string[]> = {
      indispensable: [],
      souhaitable: [],
      futur: [],
    }
    data.features.selected.forEach((f) => {
      const key = f.priority in byPriority ? f.priority : 'souhaitable'
      byPriority[key].push(f.label)
    })
    if (byPriority.indispensable.length) lines.push(`Indispensable : ${byPriority.indispensable.join(', ')}`)
    if (byPriority.souhaitable.length) lines.push(`Souhaitable : ${byPriority.souhaitable.join(', ')}`)
    if (byPriority.futur.length) lines.push(`Phase suivante : ${byPriority.futur.join(', ')}`)

    if (data.features.freeText) {
      lines.push(`Autres éléments : ${data.features.freeText}`)
    }
    lines.push('')
  }

  // Contraintes
  lines.push('## CONTRAINTES & CONTEXTE')
  if (data.constraints.budget) lines.push(`Budget : ${data.constraints.budget}`)
  if (data.constraints.timeline) lines.push(`Délai : ${data.constraints.timeline}`)
  if (data.constraints.urgencyLevel) lines.push(`Urgence : ${data.constraints.urgencyLevel}`)
  if (data.constraints.currentSystem) lines.push(`Système actuel : ${data.constraints.currentSystem}`)
  if (data.constraints.references) lines.push(`Références : ${data.constraints.references}`)
  if (data.constraints.technicalConstraints) lines.push(`Contraintes techniques : ${data.constraints.technicalConstraints}`)
  lines.push('')

  // Score
  const filledFields = [
    data.description.length > 100,
    data.targetUsers.profile.length > 0,
    data.targetUsers.estimatedVolume,
    data.targetUsers.geography,
    data.features.selected.length > 0,
    data.constraints.budget,
    data.constraints.timeline,
    data.constraints.references,
    data.phone,
    data.company,
  ].filter(Boolean).length

  const score = Math.round(50 + (filledFields / 10) * 50)
  lines.push(`## SCORE DE COMPLÉTUDE : ${score}/100`)

  return lines.join('\n')
}