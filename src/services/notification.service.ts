import { resend } from '@/lib/resend'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!
const FROM_EMAIL = 'TOTSHI <onboarding@resend.dev>'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!

export async function sendProspectConfirmation(params: {
  email: string
  firstName: string
  language: string
  submissionId: string
}) {
  const isFr = params.language === 'fr'

  await resend.emails.send({
    from: FROM_EMAIL,
    to: params.email,
    subject: isFr
      ? 'Votre projet a bien été reçu — TOTSHI'
      : 'Your project has been received — TOTSHI',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #0066FF; font-size: 24px; margin-bottom: 24px;">
          ${isFr ? 'Bonjour' : 'Hello'} ${params.firstName},
        </h1>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          ${isFr
            ? 'Votre demande de projet a bien été reçue. Notre équipe va analyser vos besoins et vous recontacter dans les plus brefs délais.'
            : 'Your project request has been received. Our team will analyze your needs and get back to you as soon as possible.'}
        </p>
        <p style="color: #666; font-size: 14px; margin-top: 16px;">
          ${isFr ? 'Référence' : 'Reference'}: <strong>#${params.submissionId.slice(0, 8).toUpperCase()}</strong>
        </p>
        <div style="margin-top: 32px; padding: 20px; background: #f5f5f5; border-radius: 8px;">
          <p style="color: #333; font-size: 14px; margin: 0;">
            ${isFr
              ? '✅ Brief reçu → 🤖 Analyse IA → 👨‍💻 Réponse personnalisée'
              : '✅ Brief received → 🤖 AI Analysis → 👨‍💻 Personalized response'}
          </p>
        </div>
        <p style="color: #999; font-size: 12px; margin-top: 32px;">
          TOTSHI — ${isFr ? 'Agence de développement logiciel' : 'Software development agency'}
        </p>
      </div>
    `,
  })
}

export async function sendAdminNotification(params: {
  submissionId: string
  prospectName: string
  projectType: string
  brief: string
  draftCdc: string
  language: string
}) {
  const dashboardUrl = `${SITE_URL}/admin/soumissions/${params.submissionId}`

  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `[TOTSHI] Nouvelle soumission — ${params.prospectName} — ${params.projectType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #0066FF; font-size: 24px; margin-bottom: 8px;">
          Nouvelle soumission reçue
        </h1>
        <p style="color: #666; font-size: 14px; margin-bottom: 24px;">
          Référence: <strong>#${params.submissionId.slice(0, 8).toUpperCase()}</strong>
        </p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr style="background: #f5f5f5;">
            <td style="padding: 12px; font-weight: bold; width: 40%;">Prospect</td>
            <td style="padding: 12px;">${params.prospectName}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold;">Type de projet</td>
            <td style="padding: 12px;">${params.projectType.replace(/_/g, ' ')}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 12px; font-weight: bold;">Langue</td>
            <td style="padding: 12px;">${params.language.toUpperCase()}</td>
          </tr>
        </table>

        <a href="${dashboardUrl}"
           style="display: inline-block; background: #0066FF; color: white;
                  padding: 12px 24px; border-radius: 6px; text-decoration: none;
                  font-weight: bold; margin-bottom: 32px;">
          Voir dans le Dashboard →
        </a>

        <hr style="border: 1px solid #eee; margin: 32px 0;" />

        <h2 style="color: #333; font-size: 16px;">Brief structuré</h2>
        <pre style="background: #f5f5f5; padding: 16px; border-radius: 6px;
                    font-size: 12px; overflow-x: auto; white-space: pre-wrap;">
${params.brief}
        </pre>

        <h2 style="color: #333; font-size: 16px; margin-top: 24px;">Ébauche CDC générée par IA</h2>
        <pre style="background: #f0f7ff; padding: 16px; border-radius: 6px;
                    font-size: 12px; overflow-x: auto; white-space: pre-wrap;">
${params.draftCdc}
        </pre>
      </div>
    `,
  })
}

export async function sendErrorAlert(params: {
  submissionId: string
  errorMessage: string
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `[TOTSHI] ⚠️ Erreur génération IA — #${params.submissionId.slice(0, 8)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #FF3333; font-size: 24px;">⚠️ Erreur génération IA</h1>
        <p>La génération IA a échoué pour la soumission
           <strong>#${params.submissionId.slice(0, 8).toUpperCase()}</strong>.</p>
        <p>La soumission est sauvegardée. Vous pouvez régénérer manuellement depuis le dashboard.</p>
        <p style="color: #666; font-size: 12px; margin-top: 24px;">
          Erreur: ${params.errorMessage}
        </p>
        <a href="${SITE_URL}/admin/soumissions/${params.submissionId}"
           style="display: inline-block; background: #0066FF; color: white;
                  padding: 12px 24px; border-radius: 6px; text-decoration: none;">
          Accéder à la soumission →
        </a>
      </div>
    `,
  })
}