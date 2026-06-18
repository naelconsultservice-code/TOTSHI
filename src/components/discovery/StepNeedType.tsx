'use client'

import type { FormData } from './DiscoveryFlow'

type Props = {
  data: FormData
  onChange: (updates: Partial<FormData>) => void
  onNext: () => void
  locale: string
}

const needTypes = [
  {
    id: 'DEVELOPPEMENT',
    icon: '💻',
    titleFr: 'Développement logiciel',
    descFr: 'Site web, application mobile, système de gestion sur mesure',
    titleEn: 'Software development',
    descEn: 'Website, mobile app, custom management system',
  },
  {
    id: 'MARKETING',
    icon: '📈',
    titleFr: 'Marketing & Communication',
    descFr: 'Stratégie digitale, SEO, publicité, réseaux sociaux',
    titleEn: 'Marketing & Communication',
    descEn: 'Digital strategy, SEO, advertising, social media',
  },
  {
    id: 'CONSULTANCE',
    icon: '🧭',
    titleFr: 'Consultance & Stratégie',
    descFr: 'Audit digital, accompagnement à la transformation',
    titleEn: 'Consulting & Strategy',
    descEn: 'Digital audit, transformation support',
  },
  {
    id: 'INDETERMINE',
    icon: '🤔',
    titleFr: 'Je ne sais pas encore',
    descFr: 'Décrivez votre besoin, nous vous orienterons',
    titleEn: "I'm not sure yet",
    descEn: 'Describe your need, we will guide you',
  },
]

export default function StepNeedType({ data, onChange, onNext, locale }: Props) {
  const fr = locale === 'fr'

  function selectAndNext(id: string) {
    onChange({ needType: id, projectType: '' })
    onNext()
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-2">
        {fr ? 'Quel est votre besoin ?' : 'What do you need?'}
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        {fr
          ? 'Cela nous permet de vous poser les bonnes questions ensuite.'
          : 'This helps us ask you the right questions next.'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {needTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => selectAndNext(type.id)}
            className={`flex flex-col items-start gap-3 p-5 rounded-xl border text-left
                        transition-all
                        ${data.needType === type.id
                          ? 'border-[#0066FF] bg-[#0066FF]/10'
                          : 'border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/5'
                        }`}
          >
            <span className="text-3xl">{type.icon}</span>
            <div>
              <h3 className="text-white font-semibold text-base mb-1">
                {fr ? type.titleFr : type.titleEn}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {fr ? type.descFr : type.descEn}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}