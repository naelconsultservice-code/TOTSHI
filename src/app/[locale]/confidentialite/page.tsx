export default async function ConfidentialitePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isFr = locale === 'fr'

  const sectionsFr = [
    {
      title: '1. Responsable du traitement',
      content: "TOTSHI, agence de transformation numérique, est responsable du traitement des données personnelles collectées via ce site. Pour toute question relative à vos données, contactez-nous à itumbafelly@gmail.com."
    },
    {
      title: '2. Données collectées',
      content: "Lorsque vous utilisez notre formulaire « Démarrer mon projet », nous collectons : votre nom, prénom, adresse email, numéro de téléphone (optionnel), nom d'entreprise (optionnel), pays, secteur d'activité, ainsi que la description et les caractéristiques de votre projet. Aucune donnée sensible (santé, opinions, données bancaires) n'est demandée via ce formulaire."
    },
    {
      title: '3. Finalité du traitement',
      content: "Ces données sont utilisées exclusivement pour : analyser votre demande de projet, générer un brief structuré à l'aide d'un assistant IA, vous recontacter avec une proposition adaptée, et améliorer nos services. Aucune donnée n'est utilisée à des fins de prospection commerciale tierce ou revendue."
    },
    {
      title: '4. Base légale',
      content: "Le traitement est fondé sur votre consentement explicite, recueilli au moment de la soumission du formulaire, ainsi que sur l'intérêt légitime de TOTSHI à répondre à votre demande commerciale."
    },
    {
      title: '5. Hébergement et sécurité',
      content: "Vos données sont stockées sur des serveurs sécurisés situés dans l'Union Européenne (Supabase, région Frankfurt), avec chiffrement en transit (HTTPS/TLS) et au repos. L'accès aux données est restreint aux membres autorisés de l'équipe TOTSHI via authentification sécurisée."
    },
    {
      title: '6. Durée de conservation',
      content: "Les données de prospection sont conservées pendant 24 mois à compter du dernier contact, sauf si une relation contractuelle est établie, auquel cas la durée légale de conservation applicable s'applique."
    },
    {
      title: '7. Vos droits',
      content: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation du traitement, de portabilité et d'opposition concernant vos données. Pour exercer ces droits, contactez-nous à itumbafelly@gmail.com. Vous disposez également du droit d'introduire une réclamation auprès de l'autorité de protection des données compétente."
    },
    {
      title: '8. Sous-traitants',
      content: "Nous utilisons les services suivants pour traiter vos données : Supabase (hébergement base de données, UE), Resend (envoi d'emails transactionnels), Anthropic (génération du brief par IA — les données transmises ne sont pas utilisées pour entraîner leurs modèles). Chacun de ces prestataires applique ses propres mesures de sécurité conformes au RGPD."
    },
    {
      title: '9. Cookies',
      content: "Ce site utilise uniquement des cookies techniques nécessaires à son fonctionnement (préférence de langue, session administrateur). Aucun cookie publicitaire ou de tracking tiers n'est utilisé."
    },
    {
      title: '10. Modifications',
      content: "Cette politique de confidentialité peut être mise à jour. La date de dernière modification est indiquée ci-dessous."
    },
  ]

  const sectionsEn = [
    {
      title: '1. Data Controller',
      content: "TOTSHI, a digital transformation agency, is the controller for the personal data collected through this website. For any questions regarding your data, contact us at itumbafelly@gmail.com."
    },
    {
      title: '2. Data Collected',
      content: "When you use our \"Start my project\" form, we collect: your first and last name, email address, phone number (optional), company name (optional), country, industry sector, and the description and characteristics of your project. No sensitive data (health, opinions, banking details) is requested through this form."
    },
    {
      title: '3. Purpose of Processing',
      content: "This data is used exclusively to: analyze your project request, generate a structured brief using an AI assistant, contact you with a tailored proposal, and improve our services. No data is used for third-party marketing purposes or sold."
    },
    {
      title: '4. Legal Basis',
      content: "Processing is based on your explicit consent, collected at the time of form submission, as well as on TOTSHI's legitimate interest in responding to your business inquiry."
    },
    {
      title: '5. Hosting and Security',
      content: "Your data is stored on secure servers located in the European Union (Supabase, Frankfurt region), with encryption in transit (HTTPS/TLS) and at rest. Access to data is restricted to authorized TOTSHI team members via secure authentication."
    },
    {
      title: '6. Retention Period',
      content: "Prospecting data is kept for 24 months from the last contact, unless a contractual relationship is established, in which case the applicable legal retention period applies."
    },
    {
      title: '7. Your Rights',
      content: "In accordance with GDPR, you have the right to access, rectify, erase, restrict processing, port, and object regarding your data. To exercise these rights, contact us at itumbafelly@gmail.com. You also have the right to lodge a complaint with the competent data protection authority."
    },
    {
      title: '8. Subprocessors',
      content: "We use the following services to process your data: Supabase (database hosting, EU), Resend (transactional emails), Anthropic (AI brief generation — data submitted is not used to train their models). Each provider applies its own GDPR-compliant security measures."
    },
    {
      title: '9. Cookies',
      content: "This site only uses technical cookies necessary for its operation (language preference, admin session). No advertising or third-party tracking cookies are used."
    },
    {
      title: '10. Changes',
      content: "This privacy policy may be updated. The last modification date is indicated below."
    },
  ]

  const sections = isFr ? sectionsFr : sectionsEn

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
          {isFr ? 'Politique de confidentialité' : 'Privacy Policy'}
        </h1>
        <p className="text-[#4A5568] text-sm mb-12">
          {isFr ? 'Dernière mise à jour : Juin 2026' : 'Last updated: June 2026'}
        </p>

        <div className="flex flex-col gap-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-white font-bold text-lg mb-2">{section.title}</h2>
              <p className="text-[#8892A4] text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}