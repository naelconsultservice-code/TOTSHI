'use client'

import type { FormData } from './DiscoveryFlow'

type Props = {
  data: FormData
  onChange: (updates: Partial<FormData>) => void
  onNext: () => void
  onPrev: () => void
  locale: string
}

const projectTypes = [
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

export default function StepProjectType({ data, onChange, onNext, onPrev, locale }: Props) {
  const fr = locale === 'fr'

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-2">
        {fr ? 'Type de projet' : 'Project type'}
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        {fr ? 'Sélectionnez le type qui correspond le mieux à votre projet.' : 'Select the type that best matches your project.'}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {projectTypes.map((type) => (
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