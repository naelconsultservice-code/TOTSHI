export type BriefData = {
  submissionId: string
  createdAt: Date
  prospect: {
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    company?: string | null
    country: string
    sector: string
  }
  projectType: string
  description: string
  targetUsers: any
  features: any
  constraints: any
  completenessScore?: number | null
}

export function compileBrief(data: BriefData, language: 'fr' | 'en'): string {
  const isFr = language === 'fr'
  const p = data.prospect
  const targetUsers = data.targetUsers as any
  const features = data.features as any
  const constraints = data.constraints as any

  const featuresList =
    (features?.selected ?? [])
      .map((f: any) => `  - ${f.label} [${f.priority}]`)
      .join('\n') || (isFr ? '  Non renseigné' : '  Not specified')

  const date = new Date(data.createdAt).toLocaleString(
    isFr ? 'fr-FR' : 'en-US'
  )

  return `
${'═'.repeat(51)}
${isFr ? 'BRIEF PROJET — TOTSHI' : 'PROJECT BRIEF — TOTSHI'}
${isFr ? `Soumission #${data.submissionId.slice(0, 8).toUpperCase()} — ${date}` : `Submission #${data.submissionId.slice(0, 8).toUpperCase()} — ${date}`}
${'═'.repeat(51)}

${isFr ? 'INFORMATIONS PROSPECT' : 'PROSPECT INFORMATION'}
  ${isFr ? 'Nom' : 'Name'}           : ${p.firstName} ${p.lastName}
  Email          : ${p.email}
  ${isFr ? 'Téléphone' : 'Phone'}    : ${p.phone ?? (isFr ? 'Non renseigné' : 'Not provided')}
  ${isFr ? 'Entreprise' : 'Company'} : ${p.company ?? (isFr ? 'Non renseigné' : 'Not provided')}
  ${isFr ? 'Pays' : 'Country'}       : ${p.country}
  ${isFr ? 'Secteur' : 'Sector'}     : ${p.sector}
  ${isFr ? 'Langue' : 'Language'}    : ${language.toUpperCase()}

${isFr ? 'TYPE DE PROJET' : 'PROJECT TYPE'}
  ${isFr ? 'Catégorie' : 'Category'} : ${data.projectType.replace(/_/g, ' ')}

${isFr ? 'DESCRIPTION DU PROJET' : 'PROJECT DESCRIPTION'}
  ${data.description}

${isFr ? 'UTILISATEURS CIBLES' : 'TARGET USERS'}
  ${isFr ? 'Profil' : 'Profile'}          : ${targetUsers?.profile ?? '-'}
  ${isFr ? 'Volume estimé' : 'Est. volume'}: ${targetUsers?.estimatedVolume ?? '-'}
  ${isFr ? 'Géographie' : 'Geography'}    : ${targetUsers?.geography ?? '-'}
  ${isFr ? 'Niveau tech' : 'Tech level'}  : ${targetUsers?.techLevel ?? '-'}
  ${isFr ? 'Type accès' : 'Access type'}  : ${targetUsers?.accessType ?? '-'}

${isFr ? 'FONCTIONNALITÉS SOUHAITÉES' : 'DESIRED FEATURES'}
${featuresList}
  ${isFr ? 'Notes libres' : 'Free notes'} : ${features?.freeText || (isFr ? 'Non renseigné' : 'Not specified')}

${isFr ? 'CONTRAINTES & CONTEXTE' : 'CONSTRAINTS & CONTEXT'}
  ${isFr ? 'Budget' : 'Budget'}           : ${constraints?.budget || '-'}
  ${isFr ? 'Délai' : 'Timeline'}          : ${constraints?.timeline || '-'}
  ${isFr ? 'Système actuel' : 'Current system'} : ${constraints?.currentSystem || '-'}
  ${isFr ? 'Contraintes tech' : 'Tech constraints'}: ${constraints?.technicalConstraints || '-'}
  ${isFr ? 'Références' : 'References'}   : ${constraints?.references || '-'}
  ${isFr ? 'Urgence' : 'Urgency'}         : ${constraints?.urgencyLevel || '-'}

${'═'.repeat(51)}
${isFr ? `SCORE DE COMPLÉTUDE : ${data.completenessScore ?? 0} / 100` : `COMPLETENESS SCORE: ${data.completenessScore ?? 0} / 100`}
${'═'.repeat(51)}
`.trim()
}