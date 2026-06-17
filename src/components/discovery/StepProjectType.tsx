'use client'

import type { FormData } from './DiscoveryFlow'

type Props = {
  data: FormData
  onChange: (updates: Partial<FormData>) => void
  onNext: () => void
  onPrev: () => void
  locale: string
}

const devTypes = [
  { id: 'SITE_WEB', icon: '🌐', labelFr: 'Site Web', labelEn: 'Website' },
  { id: 'APP_WEB', icon: '💻', labelFr: 'Application Web', labelEn: 'Web App' },
  { id: 'APP_MOBILE', icon: '📱', labelFr: 'Application Mobile', labelEn: 'Mobile App' },
  { id: 'SYSTEME_GESTION', icon: '🗂️', labelFr: 'Système de Gestion', labelEn: 'Management System' },
  { id: 'ECOMMERCE', icon: '🛒', labelFr: 'E-commerce', labelEn: 'E-commerce' },
  { id: 'MARKETPLACE', icon: '🏪', labelFr: 'Marketplace', labelEn: 'Marketplace' },
  { id: 'ERP_CRM', icon: '🏢', labelFr: 'ERP / CRM', labelEn: 'ERP / CRM' },
  { id: 'FINTECH', icon: '💳', labelFr: 'FinTech', labelEn: 'FinTech' },
  { id: 'IA_AUTOMATISATION', icon: '🤖', labelFr: 'IA & Automatisation', labelEn: 'AI & Automation' },
  { id: 'AUTRE', icon: '✨', labelFr: 'Autre', labelEn: 'Other' },
]

const marketingTypes = [
  { id: 'STRATEGIE_DIGITALE', icon: '🎯', labelFr: 'Stratégie digitale', labelEn: 'Digital strategy' },
  { id: 'SEO_REFERENCEMENT', icon: '🔍', labelFr: 'SEO & Référencement', labelEn: 'SEO' },
  { id: 'PUBLICITE_EN_LIGNE', icon: '📣', labelFr: 'Publicité en ligne (Ads)', labelEn: 'Online advertising' },
  { id: 'RESEAUX_SOCIAUX', icon: '📱', labelFr: 'Réseaux sociaux', labelEn: 'Social media' },
  { id: 'CREATION_CONTENU', icon: '✍️', labelFr: 'Création de contenu', labelEn: 'Content creation' },
  { id: 'EMAIL_MARKETING', icon: '📧', labelFr: 'Email marketing', labelEn: 'Email marketing' },
  { id: 'BRANDING_IDENTITE', icon: '🎨', labelFr: 'Branding & Identité', labelEn: 'Branding & Identity' },
  { id: 'MARKETING_COMPLET', icon: '🚀', labelFr: 'Accompagnement complet', labelEn: 'Full marketing support' },
]

const consultingTypes = [
  { id: 'AUDIT_DIGITAL', icon: '🔎', labelFr: 'Audit digital', labelEn: 'Digital audit' },
  { id: 'STRATEGIE_TRANSFORMATION', icon: '🧭', labelFr: 'Stratégie de transformation', labelEn: 'Transformation strategy' },
  { id: 'CHOIX_TECHNOLOGIQUES', icon: '⚙️', labelFr: 'Choix technologiques', labelEn: 'Technology decisions' },
  { id: 'ACCOMPAGNEMENT_PROJET', icon: '🤝', labelFr: 'Accompagnement de projet', labelEn: 'Project support' },
  { id: 'FORMATION_EQUIPES', icon: '🎓', labelFr: 'Formation des équipes', labelEn: 'Team training' },
  { id: 'CONSEIL_CROISSANCE', icon: '📊', labelFr: 'Conseil en croissance', labelEn: 'Growth consulting' },
]

const indeterminateTypes = [
  { id: 'PRESENCE_EN_LIGNE', icon: '🌍', labelFr: 'Améliorer ma présence en ligne', labelEn: 'Improve my online presence' },
  { id: 'AUTOMATISER_PROCESSUS', icon: '⚡', labelFr: 'Automatiser mes processus', labelEn: 'Automate my processes' },
  { id: 'DEVELOPPER_ACTIVITE', icon: '📈', labelFr: 'Développer mon activité', labelEn: 'Grow my business' },
  { id: 'RESOUDRE_PROBLEME', icon: '🔧', labelFr: 'Résoudre un problème spécifique', labelEn: 'Solve a specific problem' },
]

function getTypes(needType: string) {
  switch (needType) {
    case 'DEVELOPPEMENT': return devTypes
    case 'MARKETING': return marketingTypes
    case 'CONSULTANCE': return consultingTypes
    default: return indeterminateTypes
  }
}

function getTitle(needType: string, fr: boolean) {
  switch (needType) {
    case 'DEVELOPPEMENT':
      return fr ? 'Type de développement' : 'Development type'
    case 'MARKETING':
      return fr ? 'Service marketing' : 'Marketing service'
    case 'CONSULTANCE':
      return fr ? 'Type de consultance' : 'Consulting type'
    default:
      return fr ? 'Quel est votre objectif principal ?' : 'What is your main objective?'
  }
}

function getSubtitle(needType: string, fr: boolean) {
  switch (needType) {
    case 'DEVELOPPEMENT':
      return fr ? 'Sélectionnez le type de solution qui correspond à votre besoin.' : 'Select the type of solution that matches your need.'
    case 'MARKETING':
      return fr ? 'Sur quel levier marketing souhaitez-vous agir ?' : 'Which marketing lever do you want to activate?'
    case 'CONSULTANCE':
      return fr ? 'Quel type d\'accompagnement recherchez-vous ?' : 'What type of support are you looking for?'
    default:
      return fr ? 'Cela nous aidera à vous orienter vers la bonne expertise.' : 'This will help us direct you to the right expertise.'
  }
}

export default function StepProjectType({ data, onChange, onNext, onPrev, locale }: Props) {
  const fr = locale === 'fr'
  const types = getTypes(data.needType)

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-2">
        {getTitle(data.needType, fr)}
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        {getSubtitle(data.needType, fr)}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {types.map((type) => (
          <button
            key={type.id}
            onClick={() => onChange({ projectType: type.id })}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border
                        transition-all text-center
                        ${data.projectType === type.id
                          ? 'border-[#0066FF] bg-[#0066FF]/10 text-white'
                          : 'border-white/8 bg-white/3 text-gray-400 hover:border-white/20 hover:text-white'
                        }`}
          >
            <span className="text-2xl">{type.icon}</span>
            <span className="text-xs font-medium leading-tight">
              {fr ? type.labelFr : type.labelEn}
            </span>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onPrev}
          className="flex-1 border border-white/10 hover:border-white/20 text-gray-400
                     hover:text-white font-semibold py-3 rounded-xl transition-colors"
        >
          ← {fr ? 'Retour' : 'Back'}
        </button>
        <button
          onClick={onNext}
          disabled={!data.projectType}
          className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] disabled:opacity-40
                     disabled:cursor-not-allowed text-white font-semibold py-3
                     rounded-xl transition-colors"
        >
          {fr ? 'Continuer →' : 'Continue →'}
        </button>
      </div>
    </div>
  )
}