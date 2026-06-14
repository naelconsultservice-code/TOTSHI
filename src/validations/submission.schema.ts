import { z } from 'zod'

export const StepIdentificationSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis').max(100).trim(),
  lastName: z.string().min(2, 'Nom requis').max(100).trim(),
  email: z.string().email('Email invalide').max(255).toLowerCase().trim(),
  phone: z.string().max(50).optional().or(z.literal('')),
  company: z.string().max(200).optional().or(z.literal('')),
  country: z.string().min(2, 'Pays requis').max(100),
  sector: z.string().min(2, "Secteur requis").max(100),
})

export const ProjectTypeSchema = z.enum([
  'SITE_WEB',
  'APP_WEB',
  'APP_MOBILE',
  'SYSTEME_GESTION',
  'ECOMMERCE',
  'MARKETPLACE',
  'ERP_CRM',
  'FINTECH',
  'IA_AUTOMATISATION',
  'AUTRE',
])

export const StepDescriptionSchema = z.object({
  description: z
    .string()
    .min(100, 'Description trop courte — minimum 100 caractères')
    .max(5000)
    .trim(),
})

export const StepTargetUsersSchema = z.object({
  profile: z.string().min(1, 'Profil utilisateur requis').max(500),
  estimatedVolume: z.string().max(200).optional().or(z.literal('')),
  geography: z.string().max(200).optional().or(z.literal('')),
  techLevel: z.enum(['non_technique', 'mixte', 'technique']),
  accessType: z.enum(['interne', 'externe', 'les_deux']),
})

export const FeatureItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  priority: z.enum(['indispensable', 'souhaitable', 'futur']),
})

export const StepFeaturesSchema = z.object({
  selected: z.array(FeatureItemSchema).default([]),
  freeText: z.string().max(2000).optional().or(z.literal('')),
})

export const StepConstraintsSchema = z.object({
  budget: z.string().max(200).optional().or(z.literal('')),
  timeline: z.string().max(200).optional().or(z.literal('')),
  currentSystem: z.string().max(500).optional().or(z.literal('')),
  technicalConstraints: z.string().max(1000).optional().or(z.literal('')),
  references: z.string().max(500).optional().or(z.literal('')),
  urgencyLevel: z.enum(['faible', 'normal', 'urgent', 'critique']),
})

export const SubmissionSchema = z.object({
  firstName: StepIdentificationSchema.shape.firstName,
  lastName: StepIdentificationSchema.shape.lastName,
  email: StepIdentificationSchema.shape.email,
  phone: StepIdentificationSchema.shape.phone,
  company: StepIdentificationSchema.shape.company,
  country: StepIdentificationSchema.shape.country,
  sector: StepIdentificationSchema.shape.sector,
  language: z.enum(['fr', 'en']),
  projectType: ProjectTypeSchema,
  description: StepDescriptionSchema.shape.description,
  targetUsers: StepTargetUsersSchema,
  features: StepFeaturesSchema.optional().default({
    selected: [],
    freeText: '',
  }),
  constraints: StepConstraintsSchema.optional(),
  gdprConsent: z.literal(true),  _hp: z.string().max(0, 'Spam détecté').optional(),
})

export type SubmissionInput = z.infer<typeof SubmissionSchema>