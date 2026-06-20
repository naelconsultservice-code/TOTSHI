'use client'

import type { FormData } from './DiscoveryFlow'

type Props = {
  data: FormData
  onChange: (updates: Partial<FormData>) => void
  onNext: () => void
  onPrev: () => void
  locale: string
}

const urgencyOptions = [
  { value: 'faible', labelFr: '🟢 Pas urgent', labelEn: '🟢 Not urgent' },
  { value: 'normal', labelFr: '🟡 Normal', labelEn: '🟡 Normal' },
  { value: 'urgent', labelFr: '🟠 Urgent', labelEn: '🟠 Urgent' },
  { value: 'critique', labelFr: '🔴 Critique', labelEn: '🔴 Critical' },
]

export default function StepConstraints({ data, onChange, onNext, onPrev, locale }: Props) {
  const fr = locale === 'fr'
  const needType = data.needType

  function updateConstraints(field: string, value: string) {
    onChange({ constraints: { ...data.constraints, [field]: value } })
  }

  const selectClass = `w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
    text-white focus:outline-none focus:border-[#0066FF]/50`
  const inputClass = `w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
    text-white placeholder-gray-600 focus:outline-none
    focus:border-[#0066FF]/50 transition-colors`

  // ─────────────────────────────────────────
  // DÉVELOPPEMENT
  // ─────────────────────────────────────────
  if (needType === 'DEVELOPPEMENT') {
    const budgetOptions = fr
      ? ['< 5 000 €', '5 000 - 15 000 €', '15 000 - 30 000 €', '30 000 - 60 000 €', '60 000 - 100 000 €', '> 100 000 €', 'À définir']
      : ['< $5,000', '$5,000 - $15,000', '$15,000 - $30,000', '$30,000 - $60,000', '$60,000 - $100,000', '> $100,000', 'To be defined']
    const timelineOptions = fr
      ? ['< 1 mois', '1 - 3 mois', '3 - 6 mois', '6 - 12 mois', '> 12 mois', 'Flexible']
      : ['< 1 month', '1 - 3 months', '3 - 6 months', '6 - 12 months', '> 12 months', 'Flexible']

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
              <label className="block text-sm text-gray-400 mb-1.5">{fr ? 'Budget approximatif' : 'Approximate budget'}</label>
              <select value={data.constraints.budget} onChange={(e) => updateConstraints('budget', e.target.value)} aria-label="Budget" className={selectClass}>
                <option value="" className="bg-[#0A0A0F]">{fr ? 'Sélectionner...' : 'Select...'}</option>
                {budgetOptions.map((b) => <option key={b} value={b} className="bg-[#0A0A0F]">{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">{fr ? 'Délai souhaité' : 'Desired timeline'}</label>
              <select value={data.constraints.timeline} onChange={(e) => updateConstraints('timeline', e.target.value)} aria-label="Timeline" className={selectClass}>
                <option value="" className="bg-[#0A0A0F]">{fr ? 'Sélectionner...' : 'Select...'}</option>
                {timelineOptions.map((t) => <option key={t} value={t} className="bg-[#0A0A0F]">{t}</option>)}
              </select>
            </div>
          </div>

          <UrgencyBlock value={data.constraints.urgencyLevel} onChange={(v) => updateConstraints('urgencyLevel', v)} fr={fr} />

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">{fr ? 'Système actuel à remplacer/intégrer' : 'Current system to replace/integrate'}</label>
            <input type="text" value={data.constraints.currentSystem} onChange={(e) => updateConstraints('currentSystem', e.target.value)} className={inputClass} placeholder={fr ? 'Ex: Excel, logiciel X, aucun...' : 'Ex: Excel, software X, none...'} />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">{fr ? 'Références ou inspirations' : 'References or inspirations'}</label>
            <input type="text" value={data.constraints.references} onChange={(e) => updateConstraints('references', e.target.value)} className={inputClass} placeholder={fr ? 'Ex: airbnb.com, notion.so...' : 'Ex: airbnb.com, notion.so...'} />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">{fr ? 'Contraintes techniques spécifiques' : 'Specific technical constraints'}</label>
            <textarea value={data.constraints.technicalConstraints} onChange={(e) => updateConstraints('technicalConstraints', e.target.value)} rows={3} className={inputClass + ' resize-none'} placeholder={fr ? 'Ex: hébergement en France, intégration API tierce...' : 'Ex: France hosting, third-party API integration...'} />
          </div>
        </div>

        <NavButtons onPrev={onPrev} onNext={onNext} fr={fr} />
      </div>
    )
  }

  // ─────────────────────────────────────────
  // MARKETING
  // ─────────────────────────────────────────
  if (needType === 'MARKETING') {
    const budgetOptions = fr
      ? ['< 500 €/mois', '500 - 2 000 €/mois', '2 000 - 5 000 €/mois', '5 000 - 15 000 €/mois', '> 15 000 €/mois', 'À définir']
      : ['< €500/month', '€500 - €2,000/month', '€2,000 - €5,000/month', '€5,000 - €15,000/month', '> €15,000/month', 'To be defined']
    const timelineOptions = fr
      ? ['Campagne ponctuelle (< 1 mois)', '1 - 3 mois', '3 - 6 mois', 'Accompagnement continu']
      : ['One-off campaign (< 1 month)', '1 - 3 months', '3 - 6 months', 'Ongoing support']

    return (
      <div>
        <h2 className="text-xl font-bold text-white mb-2">
          {fr ? 'Budget & calendrier' : 'Budget & timeline'}
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {fr ? 'Ces informations nous aident à dimensionner la stratégie. Facultatif.' : 'This helps us scale the strategy. Optional.'}
        </p>

        <div className="flex flex-col gap-5 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">{fr ? 'Budget marketing mensuel' : 'Monthly marketing budget'}</label>
              <select value={data.constraints.budget} onChange={(e) => updateConstraints('budget', e.target.value)} aria-label="Budget" className={selectClass}>
                <option value="" className="bg-[#0A0A0F]">{fr ? 'Sélectionner...' : 'Select...'}</option>
                {budgetOptions.map((b) => <option key={b} value={b} className="bg-[#0A0A0F]">{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">{fr ? "Durée de l'engagement" : 'Engagement duration'}</label>
              <select value={data.constraints.timeline} onChange={(e) => updateConstraints('timeline', e.target.value)} aria-label="Timeline" className={selectClass}>
                <option value="" className="bg-[#0A0A0F]">{fr ? 'Sélectionner...' : 'Select...'}</option>
                {timelineOptions.map((t) => <option key={t} value={t} className="bg-[#0A0A0F]">{t}</option>)}
              </select>
            </div>
          </div>

          <UrgencyBlock value={data.constraints.urgencyLevel} onChange={(v) => updateConstraints('urgencyLevel', v)} fr={fr} />

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">{fr ? 'Outils marketing déjà utilisés' : 'Marketing tools already used'}</label>
            <input type="text" value={data.constraints.currentSystem} onChange={(e) => updateConstraints('currentSystem', e.target.value)} className={inputClass} placeholder={fr ? 'Ex: Mailchimp, Canva, aucun...' : 'Ex: Mailchimp, Canva, none...'} />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">{fr ? 'Marques ou comptes qui vous inspirent' : 'Brands or accounts that inspire you'}</label>
            <input type="text" value={data.constraints.references} onChange={(e) => updateConstraints('references', e.target.value)} className={inputClass} placeholder={fr ? 'Ex: @marque1, @marque2...' : 'Ex: @brand1, @brand2...'} />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">{fr ? "Contraintes (charte graphique, secteur réglementé...)" : 'Constraints (brand guidelines, regulated sector...)'}</label>
            <textarea value={data.constraints.technicalConstraints} onChange={(e) => updateConstraints('technicalConstraints', e.target.value)} rows={3} className={inputClass + ' resize-none'} placeholder={fr ? 'Ex: charte graphique existante à respecter...' : 'Ex: existing brand guidelines to follow...'} />
          </div>
        </div>

        <NavButtons onPrev={onPrev} onNext={onNext} fr={fr} />
      </div>
    )
  }

  // ─────────────────────────────────────────
  // CONSULTANCE
  // ─────────────────────────────────────────
  if (needType === 'CONSULTANCE') {
    const budgetOptions = fr
      ? ['< 3 000 €', '3 000 - 10 000 €', '10 000 - 25 000 €', '25 000 - 50 000 €', '> 50 000 €', 'À définir']
      : ['< €3,000', '€3,000 - €10,000', '€10,000 - €25,000', '€25,000 - €50,000', '> €50,000', 'To be defined']
    const timelineOptions = fr
      ? ['Mission courte (< 1 mois)', '1 - 3 mois', '3 - 6 mois', 'Accompagnement long terme']
      : ['Short mission (< 1 month)', '1 - 3 months', '3 - 6 months', 'Long-term support']

    return (
      <div>
        <h2 className="text-xl font-bold text-white mb-2">
          {fr ? 'Budget & calendrier de mission' : 'Mission budget & timeline'}
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {fr ? 'Ces informations nous aident à dimensionner notre intervention. Facultatif.' : 'This helps us scale our intervention. Optional.'}
        </p>

        <div className="flex flex-col gap-5 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">{fr ? 'Budget de la mission' : 'Mission budget'}</label>
              <select value={data.constraints.budget} onChange={(e) => updateConstraints('budget', e.target.value)} aria-label="Budget" className={selectClass}>
                <option value="" className="bg-[#0A0A0F]">{fr ? 'Sélectionner...' : 'Select...'}</option>
                {budgetOptions.map((b) => <option key={b} value={b} className="bg-[#0A0A0F]">{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">{fr ? 'Durée souhaitée' : 'Desired duration'}</label>
              <select value={data.constraints.timeline} onChange={(e) => updateConstraints('timeline', e.target.value)} aria-label="Timeline" className={selectClass}>
                <option value="" className="bg-[#0A0A0F]">{fr ? 'Sélectionner...' : 'Select...'}</option>
                {timelineOptions.map((t) => <option key={t} value={t} className="bg-[#0A0A0F]">{t}</option>)}
              </select>
            </div>
          </div>

          <UrgencyBlock value={data.constraints.urgencyLevel} onChange={(v) => updateConstraints('urgencyLevel', v)} fr={fr} />

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">{fr ? 'Outils et processus actuels' : 'Current tools and processes'}</label>
            <input type="text" value={data.constraints.currentSystem} onChange={(e) => updateConstraints('currentSystem', e.target.value)} className={inputClass} placeholder={fr ? 'Ex: Excel, processus manuels...' : 'Ex: Excel, manual processes...'} />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">{fr ? 'Entreprises ou modèles qui vous inspirent' : 'Companies or models that inspire you'}</label>
            <input type="text" value={data.constraints.references} onChange={(e) => updateConstraints('references', e.target.value)} className={inputClass} placeholder={fr ? 'Ex: entreprise X dans votre secteur...' : 'Ex: company X in your sector...'} />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">{fr ? 'Contraintes organisationnelles' : 'Organizational constraints'}</label>
            <textarea value={data.constraints.technicalConstraints} onChange={(e) => updateConstraints('technicalConstraints', e.target.value)} rows={3} className={inputClass + ' resize-none'} placeholder={fr ? 'Ex: résistance au changement, contraintes RH...' : 'Ex: resistance to change, HR constraints...'} />
          </div>
        </div>

        <NavButtons onPrev={onPrev} onNext={onNext} fr={fr} />
      </div>
    )
  }

  // ─────────────────────────────────────────
  // INDÉTERMINÉ — version simplifiée
  // ─────────────────────────────────────────
  const budgetOptions = fr
    ? ['Pas encore défini', '< 5 000 €', '5 000 - 20 000 €', '> 20 000 €']
    : ['Not defined yet', '< €5,000', '€5,000 - €20,000', '> €20,000']

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-2">
        {fr ? 'Budget & délai' : 'Budget & timeline'}
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        {fr ? 'Une idée approximative suffit. Facultatif.' : 'An approximate idea is enough. Optional.'}
      </p>

      <div className="flex flex-col gap-5 mb-8">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">{fr ? 'Budget envisagé' : 'Estimated budget'}</label>
          <select value={data.constraints.budget} onChange={(e) => updateConstraints('budget', e.target.value)} aria-label="Budget" className={selectClass}>
            <option value="" className="bg-[#0A0A0F]">{fr ? 'Sélectionner...' : 'Select...'}</option>
            {budgetOptions.map((b) => <option key={b} value={b} className="bg-[#0A0A0F]">{b}</option>)}
          </select>
        </div>

        <UrgencyBlock value={data.constraints.urgencyLevel} onChange={(v) => updateConstraints('urgencyLevel', v)} fr={fr} />

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">{fr ? 'Autres précisions' : 'Other details'}</label>
          <textarea value={data.constraints.technicalConstraints} onChange={(e) => updateConstraints('technicalConstraints', e.target.value)} rows={3} className={inputClass + ' resize-none'} placeholder={fr ? 'Tout élément utile à préciser...' : 'Any useful detail to mention...'} />
        </div>
      </div>

      <NavButtons onPrev={onPrev} onNext={onNext} fr={fr} />
    </div>
  )
}

function UrgencyBlock({ value, onChange, fr }: { value: string; onChange: (v: string) => void; fr: boolean }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">{fr ? "Niveau d'urgence" : 'Urgency level'}</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {urgencyOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-2 rounded-xl border text-sm transition-all
              ${value === opt.value
                ? 'border-[#0066FF] bg-[#0066FF]/10 text-white'
                : 'border-white/8 text-gray-400 hover:border-white/20'
              }`}
          >
            {fr ? opt.labelFr : opt.labelEn}
          </button>
        ))}
      </div>
    </div>
  )
}

function NavButtons({ onPrev, onNext, fr }: { onPrev: () => void; onNext: () => void; fr: boolean }) {
  return (
    <div className="flex gap-3">
      <button onClick={onPrev} className="flex-1 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white font-semibold py-3 rounded-xl transition-colors">
        ← {fr ? 'Retour' : 'Back'}
      </button>
      <button onClick={onNext} className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold py-3 rounded-xl transition-colors">
        {fr ? 'Continuer →' : 'Continue →'}
      </button>
    </div>
  )
}