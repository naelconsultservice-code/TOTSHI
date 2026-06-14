'use client'

import type { FormData } from './DiscoveryFlow'

type Props = {
  data: FormData
  onChange: (updates: Partial<FormData>) => void
  onNext: () => void
  onPrev: () => void
  locale: string
}

const guidingQuestions: Record<string, { fr: string[]; en: string[] }> = {
  SITE_WEB: {
    fr: ['Quel est l\'objectif principal du site ?', 'Qui sont vos visiteurs cibles ?', 'Avez-vous un site existant à remplacer ?'],
    en: ['What is the main goal of the site?', 'Who are your target visitors?', 'Do you have an existing site to replace?'],
  },
  APP_MOBILE: {
    fr: ['Quel problème résout l\'application ?', 'iOS, Android ou les deux ?', 'Avez-vous une maquette ou wireframe ?'],
    en: ['What problem does the app solve?', 'iOS, Android or both?', 'Do you have a mockup or wireframe?'],
  },
  FINTECH: {
    fr: ['Quel service financier proposez-vous ?', 'Quelles réglementations s\'appliquent ?', 'Intégration Mobile Money prévue ?'],
    en: ['What financial service do you offer?', 'What regulations apply?', 'Mobile Money integration planned?'],
  },
  DEFAULT: {
    fr: ['Quel problème cherchez-vous à résoudre ?', 'Qui utilisera ce système ?', 'Avez-vous des contraintes techniques spécifiques ?'],
    en: ['What problem are you trying to solve?', 'Who will use this system?', 'Do you have specific technical constraints?'],
  },
}

export default function StepDescription({ data, onChange, onNext, onPrev, locale }: Props) {
  const fr = locale === 'fr'
  const questions = guidingQuestions[data.projectType] ?? guidingQuestions.DEFAULT
  const hints = fr ? questions.fr : questions.en
  const charCount = data.description.length
  const isValid = charCount >= 100

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-2">
        {fr ? 'Décrivez votre projet' : 'Describe your project'}
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        {fr
          ? 'Plus vous êtes précis, meilleure sera l\'ébauche générée. Minimum 100 caractères.'
          : 'The more specific you are, the better the generated draft. Minimum 100 characters.'}
      </p>

      {/* Questions de guidage */}
      <div className="bg-[#0066FF]/5 border border-[#0066FF]/15 rounded-xl p-4 mb-4">
        <p className="text-[#0066FF] text-xs font-medium mb-2">
          {fr ? '💡 Questions à considérer :' : '💡 Questions to consider:'}
        </p>
        <ul className="flex flex-col gap-1">
          {hints.map((q, i) => (
            <li key={i} className="text-gray-400 text-xs">• {q}</li>
          ))}
        </ul>
      </div>

      <div className="relative mb-8">
        <textarea
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={8}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                     text-white placeholder-gray-600 focus:outline-none
                     focus:border-[#0066FF]/50 transition-colors resize-none"
          placeholder={
            fr
              ? "Décrivez votre projet en détail : le problème à résoudre, les fonctionnalités souhaitées, le contexte..."
              : "Describe your project in detail: the problem to solve, desired features, context..."
          }
        />
        <div className={`text-right text-xs mt-1 ${isValid ? 'text-green-400' : 'text-gray-600'}`}>
          {charCount} / 100 {fr ? 'caractères minimum' : 'characters minimum'}
        </div>
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
          disabled={!isValid}
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