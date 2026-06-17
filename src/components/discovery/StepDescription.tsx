'use client'

import type { FormData } from './DiscoveryFlow'

type Props = {
  data: FormData
  onChange: (updates: Partial<FormData>) => void
  onNext: () => void
  onPrev: () => void
  locale: string
}

type GuidingQuestions = { fr: string[]; en: string[] }

const devQuestions: Record<string, GuidingQuestions> = {
  SITE_WEB: {
    fr: ["Quel est l'objectif principal du site ?", 'Qui sont vos visiteurs cibles ?', 'Avez-vous un site existant à remplacer ?'],
    en: ['What is the main goal of the site?', 'Who are your target visitors?', 'Do you have an existing site to replace?'],
  },
  APP_MOBILE: {
    fr: ["Quel problème résout l'application ?", 'iOS, Android ou les deux ?', 'Avez-vous une maquette ou wireframe ?'],
    en: ['What problem does the app solve?', 'iOS, Android or both?', 'Do you have a mockup or wireframe?'],
  },
  FINTECH: {
    fr: ['Quel service financier proposez-vous ?', "Quelles réglementations s'appliquent ?", 'Intégration Mobile Money prévue ?'],
    en: ['What financial service do you offer?', 'What regulations apply?', 'Mobile Money integration planned?'],
  },
  ECOMMERCE: {
    fr: ['Combien de produits avez-vous ?', 'Quel mode de paiement souhaitez-vous ?', 'Avez-vous un stock à gérer ?'],
    en: ['How many products do you have?', 'What payment methods do you want?', 'Do you have inventory to manage?'],
  },
  DEFAULT_DEV: {
    fr: ['Quel problème cherchez-vous à résoudre ?', 'Qui utilisera ce système ?', 'Avez-vous des contraintes techniques spécifiques ?'],
    en: ['What problem are you trying to solve?', 'Who will use this system?', 'Do you have specific technical constraints?'],
  },
}

const marketingQuestions: Record<string, GuidingQuestions> = {
  SEO_REFERENCEMENT: {
    fr: ['Sur quels mots-clés voulez-vous vous positionner ?', 'Avez-vous un site existant ?', 'Quelle est votre zone géographique cible ?'],
    en: ['Which keywords do you want to rank for?', 'Do you have an existing website?', 'What is your target geographic area?'],
  },
  PUBLICITE_EN_LIGNE: {
    fr: ['Sur quelles plateformes (Google, Facebook, LinkedIn...) ?', 'Quel est votre budget publicitaire mensuel ?', 'Avez-vous déjà lancé des campagnes ?'],
    en: ['On which platforms (Google, Facebook, LinkedIn...)?', 'What is your monthly advertising budget?', 'Have you already run campaigns?'],
  },
  RESEAUX_SOCIAUX: {
    fr: ['Sur quels réseaux êtes-vous présent ?', 'Quelle fréquence de publication souhaitez-vous ?', "Avez-vous déjà une charte graphique ?"],
    en: ['Which social networks are you on?', 'How often do you want to post?', 'Do you already have a visual identity?'],
  },
  DEFAULT_MARKETING: {
    fr: ['Quelle est votre situation actuelle sur le digital ?', 'Quels sont vos objectifs de croissance ?', 'Quel est votre secteur et votre cible client ?'],
    en: ['What is your current digital situation?', 'What are your growth objectives?', 'What is your sector and target customer?'],
  },
}

const consultingQuestions: Record<string, GuidingQuestions> = {
  AUDIT_DIGITAL: {
    fr: ['Quels outils et systèmes utilisez-vous actuellement ?', "Quels sont les points de friction dans vos processus ?", 'Quel est le périmètre de l\'audit ?'],
    en: ['What tools and systems do you currently use?', 'What are the friction points in your processes?', 'What is the scope of the audit?'],
  },
  FORMATION_EQUIPES: {
    fr: ['Combien de personnes à former ?', 'Quel est leur niveau technique actuel ?', 'Quels outils ou compétences cibler ?'],
    en: ['How many people to train?', 'What is their current technical level?', 'Which tools or skills to target?'],
  },
  DEFAULT_CONSULTING: {
    fr: ['Quel est votre défi principal ?', "Où en êtes-vous dans votre transformation ?", 'Quelle est la taille de votre organisation ?'],
    en: ['What is your main challenge?', 'Where are you in your transformation?', 'What is the size of your organization?'],
  },
}

const indeterminateQuestions: GuidingQuestions = {
  fr: ['Décrivez votre situation actuelle.', 'Quel résultat souhaitez-vous atteindre ?', 'Avez-vous déjà essayé des solutions ?'],
  en: ['Describe your current situation.', 'What result do you want to achieve?', 'Have you already tried any solutions?'],
}

function getQuestions(needType: string, projectType: string): GuidingQuestions {
  if (needType === 'DEVELOPPEMENT') {
    return devQuestions[projectType] ?? devQuestions.DEFAULT_DEV
  }
  if (needType === 'MARKETING') {
    return marketingQuestions[projectType] ?? marketingQuestions.DEFAULT_MARKETING
  }
  if (needType === 'CONSULTANCE') {
    return consultingQuestions[projectType] ?? consultingQuestions.DEFAULT_CONSULTING
  }
  return indeterminateQuestions
}

export default function StepDescription({ data, onChange, onNext, onPrev, locale }: Props) {
  const fr = locale === 'fr'
  const questions = getQuestions(data.needType, data.projectType)
  const hints = fr ? questions.fr : questions.en
  const charCount = data.description.length
  const isValid = charCount >= 80

  const placeholder = {
    DEVELOPPEMENT: fr
      ? 'Décrivez votre projet technique en détail...'
      : 'Describe your technical project in detail...',
    MARKETING: fr
      ? 'Décrivez votre situation actuelle et vos objectifs marketing...'
      : 'Describe your current situation and marketing objectives...',
    CONSULTANCE: fr
      ? 'Décrivez votre défi et le contexte de votre organisation...'
      : 'Describe your challenge and your organization context...',
  }[data.needType] ?? (fr
    ? 'Décrivez votre besoin en détail...'
    : 'Describe your need in detail...')

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-2">
        {fr ? 'Décrivez votre besoin' : 'Describe your need'}
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        {fr
          ? 'Plus vous êtes précis, meilleure sera l\'analyse. Minimum 80 caractères.'
          : 'The more specific you are, the better the analysis. Minimum 80 characters.'}
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
          placeholder={placeholder}
        />
        <div className={`text-right text-xs mt-1 ${isValid ? 'text-green-400' : 'text-gray-600'}`}>
          {charCount} / 80 {fr ? 'caractères minimum' : 'characters minimum'}
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