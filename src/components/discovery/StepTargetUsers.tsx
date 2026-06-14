'use client'

import type { FormData } from './DiscoveryFlow'

type Props = {
  data: FormData
  onChange: (updates: Partial<FormData>) => void
  onNext: () => void
  onPrev: () => void
  locale: string
}

export default function StepTargetUsers({ data, onChange, onNext, onPrev, locale }: Props) {
  const fr = locale === 'fr'

  function updateTargetUsers(field: string, value: string) {
    onChange({ targetUsers: { ...data.targetUsers, [field]: value } })
  }

  const isValid = data.targetUsers.profile.trim().length >= 2

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-2">
        {fr ? 'Utilisateurs cibles' : 'Target users'}
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        {fr ? 'Qui va utiliser votre solution ?' : 'Who will use your solution?'}
      </p>

      <div className="flex flex-col gap-4 mb-8">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">
            {fr ? 'Profil des utilisateurs *' : 'User profile *'}
          </label>
          <input
            type="text"
            value={data.targetUsers.profile}
            onChange={(e) => updateTargetUsers('profile', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                       text-white placeholder-gray-600 focus:outline-none
                       focus:border-[#0066FF]/50 transition-colors"
            placeholder={fr ? 'Ex: Gestionnaires de PME, 30-50 ans...' : 'Ex: SMB managers, 30-50 years...'}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              {fr ? 'Volume estimé d\'utilisateurs' : 'Estimated user volume'}
            </label>
            <select
              value={data.targetUsers.estimatedVolume}
              onChange={(e) => updateTargetUsers('estimatedVolume', e.target.value)}
              aria-label={fr ? 'Volume estimé' : 'Estimated volume'}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                         text-white focus:outline-none focus:border-[#0066FF]/50"
            >
              <option value="" className="bg-[#0A0A0F]">{fr ? 'Sélectionner...' : 'Select...'}</option>
              {['< 100', '100 - 1 000', '1 000 - 10 000', '10 000 - 100 000', '> 100 000'].map((v) => (
                <option key={v} value={v} className="bg-[#0A0A0F]">{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              {fr ? 'Géographie cible' : 'Target geography'}
            </label>
            <input
              type="text"
              value={data.targetUsers.geography}
              onChange={(e) => updateTargetUsers('geography', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                         text-white placeholder-gray-600 focus:outline-none
                         focus:border-[#0066FF]/50 transition-colors"
              placeholder={fr ? 'France, Afrique, Monde...' : 'France, Africa, World...'}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              {fr ? 'Niveau technique' : 'Technical level'}
            </label>
            <div className="flex flex-col gap-2">
              {[
                { value: 'non_technique', labelFr: '🟢 Non technique', labelEn: '🟢 Non-technical' },
                { value: 'mixte', labelFr: '🟡 Mixte', labelEn: '🟡 Mixed' },
                { value: 'technique', labelFr: '🔵 Technique', labelEn: '🔵 Technical' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateTargetUsers('techLevel', opt.value)}
                  className={`text-left px-3 py-2 rounded-xl border text-sm transition-all
                    ${data.targetUsers.techLevel === opt.value
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
            <label className="block text-sm text-gray-400 mb-2">
              {fr ? "Type d'accès" : 'Access type'}
            </label>
            <div className="flex flex-col gap-2">
              {[
                { value: 'interne', labelFr: '🏠 Interne (équipe)', labelEn: '🏠 Internal (team)' },
                { value: 'externe', labelFr: '🌐 Externe (clients)', labelEn: '🌐 External (clients)' },
                { value: 'les_deux', labelFr: '🔄 Les deux', labelEn: '🔄 Both' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateTargetUsers('accessType', opt.value)}
                  className={`text-left px-3 py-2 rounded-xl border text-sm transition-all
                    ${data.targetUsers.accessType === opt.value
                      ? 'border-[#0066FF] bg-[#0066FF]/10 text-white'
                      : 'border-white/8 text-gray-400 hover:border-white/20'
                    }`}
                >
                  {fr ? opt.labelFr : opt.labelEn}
                </button>
              ))}
            </div>
          </div>
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