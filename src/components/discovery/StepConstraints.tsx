'use client'

import type { FormData } from './DiscoveryFlow'

type Props = {
  data: FormData
  onChange: (updates: Partial<FormData>) => void
  onNext: () => void
  onPrev: () => void
  locale: string
}

export default function StepConstraints({ data, onChange, onNext, onPrev, locale }: Props) {
  const fr = locale === 'fr'

  function updateConstraints(field: string, value: string) {
    onChange({ constraints: { ...data.constraints, [field]: value } })
  }

  const budgetOptions = fr
    ? ['< 5 000 €', '5 000 - 15 000 €', '15 000 - 30 000 €', '30 000 - 60 000 €', '60 000 - 100 000 €', '> 100 000 €', 'À définir']
    : ['< $5,000', '$5,000 - $15,000', '$15,000 - $30,000', '$30,000 - $60,000', '$60,000 - $100,000', '> $100,000', 'To be defined']

  const timelineOptions = fr
    ? ['< 1 mois', '1 - 3 mois', '3 - 6 mois', '6 - 12 mois', '> 12 mois', 'Flexible']
    : ['< 1 month', '1 - 3 months', '3 - 6 months', '6 - 12 months', '> 12 months', 'Flexible']

  const urgencyOptions = [
    { value: 'faible', labelFr: '🟢 Pas urgent', labelEn: '🟢 Not urgent' },
    { value: 'normal', labelFr: '🟡 Normal', labelEn: '🟡 Normal' },
    { value: 'urgent', labelFr: '🟠 Urgent', labelEn: '🟠 Urgent' },
    { value: 'critique', labelFr: '🔴 Critique', labelEn: '🔴 Critical' },
  ]

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-2">
        {fr ? 'Contraintes & contexte' : 'Constraints & context'}
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        {fr ? 'Ces informations nous aident à vous proposer une solution adaptée. Facultatif.' : 'This helps us propose the right solution. Optional.'}
      </p>

      <div className="flex flex-col gap-5 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              {fr ? 'Budget approximatif' : 'Approximate budget'}
            </label>
            <select
              value={data.constraints.budget}
              onChange={(e) => updateConstraints('budget', e.target.value)}
              aria-label={fr ? 'Budget' : 'Budget'}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                         text-white focus:outline-none focus:border-[#0066FF]/50"
            >
              <option value="" className="bg-[#0A0A0F]">{fr ? 'Sélectionner...' : 'Select...'}</option>
              {budgetOptions.map((b) => (
                <option key={b} value={b} className="bg-[#0A0A0F]">{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              {fr ? 'Délai souhaité' : 'Desired timeline'}
            </label>
            <select
              value={data.constraints.timeline}
              onChange={(e) => updateConstraints('timeline', e.target.value)}
              aria-label={fr ? 'Délai' : 'Timeline'}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                         text-white focus:outline-none focus:border-[#0066FF]/50"
            >
              <option value="" className="bg-[#0A0A0F]">{fr ? 'Sélectionner...' : 'Select...'}</option>
              {timelineOptions.map((t) => (
                <option key={t} value={t} className="bg-[#0A0A0F]">{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            {fr ? "Niveau d'urgence" : 'Urgency level'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {urgencyOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateConstraints('urgencyLevel', opt.value)}
                className={`px-3 py-2 rounded-xl border text-sm transition-all
                  ${data.constraints.urgencyLevel === opt.value
                    ? 'border-[#0066FF] bg-[#0066FF]/10 text-white'
                    : 'border-white/8 text-gray-400 hover:border-white/20'
                  }`}
              >
                {fr ? opt.labelFr : opt.labelEn}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">
            {fr ? 'Système actuel à remplacer/intégrer' : 'Current system to replace/integrate'}
          </label>
          <input
            type="text"
            value={data.constraints.currentSystem}
            onChange={(e) => updateConstraints('currentSystem', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                       text-white placeholder-gray-600 focus:outline-none
                       focus:border-[#0066FF]/50 transition-colors"
            placeholder={fr ? 'Ex: Excel, logiciel X, aucun...' : 'Ex: Excel, software X, none...'}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">
            {fr ? 'Références ou inspirations' : 'References or inspirations'}
          </label>
          <input
            type="text"
            value={data.constraints.references}
            onChange={(e) => updateConstraints('references', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                       text-white placeholder-gray-600 focus:outline-none
                       focus:border-[#0066FF]/50 transition-colors"
            placeholder={fr ? 'Ex: airbnb.com, notion.so...' : 'Ex: airbnb.com, notion.so...'}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">
            {fr ? 'Contraintes techniques spécifiques' : 'Specific technical constraints'}
          </label>
          <textarea
            value={data.constraints.technicalConstraints}
            onChange={(e) => updateConstraints('technicalConstraints', e.target.value)}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                       text-white placeholder-gray-600 focus:outline-none
                       focus:border-[#0066FF]/50 resize-none transition-colors"
            placeholder={fr ? 'Ex: hébergement en France, intégration API tierce...' : 'Ex: France hosting, third-party API integration...'}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onPrev} className="flex-1 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white font-semibold py-3 rounded-xl transition-colors">
          ← {fr ? 'Retour' : 'Back'}
        </button>
        <button onClick={onNext} className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold py-3 rounded-xl transition-colors">
          {fr ? 'Continuer →' : 'Continue →'}
        </button>
      </div>
    </div>
  )
}