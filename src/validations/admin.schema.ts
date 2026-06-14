import { z } from 'zod'

export const UpdateSubmissionSchema = z.object({
  status: z
    .enum([
      'NOUVEAU',
      'EN_COURS',
      'BRIEF_ENVOYE',
      'EN_ATTENTE_CLIENT',
      'PROPOSITION_ENVOYEE',
      'CONFIRME',
      'NON_QUALIFIE',
      'ARCHIVE',
    ])
    .optional(),
  note: z.string().min(1).max(5000).optional(),
})

export const LoginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
})

export type UpdateSubmissionInput = z.infer<typeof UpdateSubmissionSchema>
export type LoginInput = z.infer<typeof LoginSchema>