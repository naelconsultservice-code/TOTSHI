export type TargetUsersScore = {
  profile: string
  estimatedVolume?: string
  geography?: string
  techLevel: string
  accessType: string
}

export type FeaturesScore = {
  selected: Array<{ id: string; label: string; priority: string }>
  freeText?: string
}

export type ConstraintsScore = {
  budget?: string
  timeline?: string
  currentSystem?: string
  technicalConstraints?: string
  references?: string
  urgencyLevel: string
}

export function computeCompletenessScore(data: {
  description: string
  targetUsers: TargetUsersScore
  features: FeaturesScore
  constraints: ConstraintsScore
}): number {
  let score = 0

  // Étape 2 — Type projet (10pts)
  score += 10

  // Étape 3 — Description (25pts)
  if (data.description.length >= 100) score += 10
  if (data.description.length >= 300) score += 10
  if (data.description.length >= 600) score += 5

  // Étape 4 — Utilisateurs cibles (15pts)
  if (data.targetUsers.profile) score += 5
  if (data.targetUsers.estimatedVolume) score += 4
  if (data.targetUsers.geography) score += 3
  if (data.targetUsers.accessType) score += 3

  // Étape 5 — Fonctionnalités (15pts)
  if (data.features.selected.length > 0) score += 8
  if (data.features.selected.length >= 3) score += 4
  if (data.features.freeText && data.features.freeText.length > 0) score += 3

  // Étape 6 — Contraintes (15pts)
  if (data.constraints.budget) score += 5
  if (data.constraints.timeline) score += 4
  if (data.constraints.urgencyLevel) score += 3
  if (data.constraints.references) score += 3

  return Math.min(score, 100)
}