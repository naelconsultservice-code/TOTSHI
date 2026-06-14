export type Language = 'fr' | 'en'

export type FeaturePriority = 'indispensable' | 'souhaitable' | 'futur'

export type TargetUsers = {
  profile: string
  estimatedVolume?: string
  geography?: string
  techLevel: 'non_technique' | 'mixte' | 'technique'
  accessType: 'interne' | 'externe' | 'les_deux'
}

export type FeatureItem = {
  id: string
  label: string
  priority: FeaturePriority
}

export type Features = {
  selected: FeatureItem[]
  freeText?: string
}

export type Constraints = {
  budget?: string
  timeline?: string
  currentSystem?: string
  technicalConstraints?: string
  references?: string
  urgencyLevel: 'faible' | 'normal' | 'urgent' | 'critique'
}

export type SubmissionStatus =
  | 'NOUVEAU'
  | 'EN_COURS'
  | 'BRIEF_ENVOYE'
  | 'EN_ATTENTE_CLIENT'
  | 'PROPOSITION_ENVOYEE'
  | 'CONFIRME'
  | 'NON_QUALIFIE'
  | 'ARCHIVE'

export type ProjectType =
  | 'SITE_WEB'
  | 'APP_WEB'
  | 'APP_MOBILE'
  | 'SYSTEME_GESTION'
  | 'ECOMMERCE'
  | 'MARKETPLACE'
  | 'ERP_CRM'
  | 'FINTECH'
  | 'IA_AUTOMATISATION'
  | 'AUTRE'