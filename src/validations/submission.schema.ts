import { z } from 'zod'

export const SubmissionSchema = z.object({
  // Étape 0 — Type de besoin
  needType: z.enum([
    'DEVELOPPEMENT', 'MARKETING', 'CONSULTANCE', 'INDETERMINE'
  ]).default('DEVELOPPEMENT'),

  // Étape 1 — Identification
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  country: z.string().min(2).max(100),
  sector: z.string().min(2).max(100),

  // Étape 2 — Type de projet
  projectType: z.string().min(2).max(100),

  // Étape 3 — Description
  description: z.string().min(10).max(10000),

  // Étape 4 — Utilisateurs cibles
  targetUsers: z.object({
    profile: z.string().min(2).max(500),
    estimatedVolume: z.string().optional(),
    geography: z.string().optional(),
    techLevel: z.string().optional(),
    accessType: z.string().optional(),
  }),

  // Étape 5 — Fonctionnalités / Prestations
  features: z.object({
    selected: z.array(z.object({
      id: z.string(),
      label: z.string(),
      priority: z.string(),
    })).default([]),
    freeText: z.string().optional(),
  }),

  // Étape 6 — Contraintes
  constraints: z.object({
    budget: z.string().optional(),
    timeline: z.string().optional(),
    currentSystem: z.string().optional(),
    technicalConstraints: z.string().optional(),
    references: z.string().optional(),
    urgencyLevel: z.string().optional(),
  }),

  // Méta
  language: z.enum(['fr', 'en']).default('fr'),
  gdprConsent: z.boolean().refine((v) => v === true, {
    message: 'Le consentement RGPD est requis',
  }),
  _hp: z.string().max(0).optional(),
})

export type SubmissionInput = z.infer<typeof SubmissionSchema>