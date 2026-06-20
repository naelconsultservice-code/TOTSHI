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
  const needType = data.needType

  function updateTargetUsers(field: string, value: string) {
    onChange({ targetUsers: { ...data.targetUsers, [field]: value } })
  }

  const isValid = data.targetUsers.profile.trim().length >= 2

  // ─────────────────────────────────────────
  // DÉVELOPPEMENT — utilisateurs de l'app/système
  // ─────────────────────────────────────────
  if (needType === 'DEVELOPPEMENT') {
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
                {fr ? "Volume d'utilisateurs estimé" : 'Estimated user volume'}
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
                {fr ? 'Niveau technique des utilisateurs' : 'Users technical level'}
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

        <NavButtons onPrev={onPrev} onNext={onNext} isValid={isValid} fr={fr} />
      </div>
    )
  }

  // ─────────────────────────────────────────
  // MARKETING — cible / audience
  // ─────────────────────────────────────────
  if (needType === 'MARKETING') {
    return (
      <div>
        <h2 className="text-xl font-bold text-white mb-2">
          {fr ? 'Votre audience cible' : 'Your target audience'}
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {fr ? 'Qui voulez-vous atteindre avec vos actions marketing ?' : 'Who do you want to reach with your marketing actions?'}
        </p>

        <div className="flex flex-col gap-4 mb-8">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              {fr ? 'Profil de votre client cible *' : 'Target customer profile *'}
            </label>
            <input
              type="text"
              value={data.targetUsers.profile}
              onChange={(e) => updateTargetUsers('profile', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                         text-white placeholder-gray-600 focus:outline-none
                         focus:border-[#0066FF]/50 transition-colors"
              placeholder={fr ? 'Ex: Femmes 25-40 ans, urbaines, intéressées par...' : 'Ex: Women 25-40, urban, interested in...'}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                {fr ? 'Taille de votre audience actuelle' : 'Current audience size'}
              </label>
              <select
                value={data.targetUsers.estimatedVolume}
                onChange={(e) => updateTargetUsers('estimatedVolume', e.target.value)}
                aria-label={fr ? 'Taille audience' : 'Audience size'}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                           text-white focus:outline-none focus:border-[#0066FF]/50"
              >
                <option value="" className="bg-[#0A0A0F]">{fr ? 'Sélectionner...' : 'Select...'}</option>
                {fr
                  ? ['Pas encore de communauté', '< 1 000 abonnés', '1 000 - 10 000', '10 000 - 50 000', '> 50 000']
                  : ['No community yet', '< 1,000 followers', '1,000 - 10,000', '10,000 - 50,000', '> 50,000']
                ).map((v) => (
                  <option key={v} value={v} className="bg-[#0A0A0F]">{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                {fr ? 'Zone géographique ciblée' : 'Target geographic area'}
              </label>
              <input
                type="text"
                value={data.targetUsers.geography}
                onChange={(e) => updateTargetUsers('geography', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                           text-white placeholder-gray-600 focus:outline-none
                           focus:border-[#0066FF]/50 transition-colors"
                placeholder={fr ? 'Local, national, international...' : 'Local, national, international...'}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              {fr ? 'Canaux actuellement utilisés' : 'Currently used channels'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { value: 'aucun', labelFr: '🚫 Aucun', labelEn: '🚫 None' },
                { value: 'social', labelFr: '📱 Réseaux sociaux', labelEn: '📱 Social media' },
                { value: 'site_web', labelFr: '🌐 Site web', labelEn: '🌐 Website' },
                { value: 'email', labelFr: '📧 Email', labelEn: '📧 Email' },
                { value: 'pub_payante', labelFr: '💰 Pub payante', labelEn: '💰 Paid ads' },
                { value: 'mixte', labelFr: '🔄 Plusieurs canaux', labelEn: '🔄 Multiple channels' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateTargetUsers('accessType', opt.value)}
                  className={`text-left px-3 py-2 rounded-xl border text-xs transition-all
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

        <NavButtons onPrev={onPrev} onNext={onNext} isValid={isValid} fr={fr} />
      </div>
    )
  }

  // ─────────────────────────────────────────
  // CONSULTANCE — organisation / contexte
  // ─────────────────────────────────────────
  if (needType === 'CONSULTANCE') {
    return (
      <div>
        <h2 className="text-xl font-bold text-white mb-2">
          {fr ? 'Votre organisation' : 'Your organization'}
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {fr ? 'Aidez-nous à comprendre le contexte de votre mission.' : 'Help us understand the context of your mission.'}
        </p>

        <div className="flex flex-col gap-4 mb-8">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              {fr ? "Qui sera concerné par l'accompagnement *" : 'Who will be involved in the support *'}
            </label>
            <input
              type="text"
              value={data.targetUsers.profile}
              onChange={(e) => updateTargetUsers('profile', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                         text-white placeholder-gray-600 focus:outline-none
                         focus:border-[#0066FF]/50 transition-colors"
              placeholder={fr ? 'Ex: Direction générale, équipe opérationnelle...' : 'Ex: Executive team, operations team...'}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                {fr ? "Taille de l'organisation" : 'Organization size'}
              </label>
              <select
                value={data.targetUsers.estimatedVolume}
                onChange={(e) => updateTargetUsers('estimatedVolume', e.target.value)}
                aria-label={fr ? 'Taille organisation' : 'Organization size'}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                           text-white focus:outline-none focus:border-[#0066FF]/50"
              >
                <option value="" className="bg-[#0A0A0F]">{fr ? 'Sélectionner...' : 'Select...'}</option>
                {fr
                  ? ['Indépendant / Solo', '2 - 10 employés', '11 - 50 employés', '51 - 200 employés', '> 200 employés']
                  : ['Solo / Freelance', '2 - 10 employees', '11 - 50 employees', '51 - 200 employees', '> 200 employees']
                ).map((v) => (
                  <option key={v} value={v} className="bg-[#0A0A0F]">{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                {fr ? "Localisation de l'organisation" : 'Organization location'}
              </label>
              <input
                type="text"
                value={data.targetUsers.geography}
                onChange={(e) => updateTargetUsers('geography', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                           text-white placeholder-gray-600 focus:outline-none
                           focus:border-[#0066FF]/50 transition-colors"
                placeholder={fr ? 'Ville, pays...' : 'City, country...'}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              {fr ? 'Maturité digitale actuelle' : 'Current digital maturity'}
            </label>
            <div className="flex flex-col gap-2">
              {[
                { value: 'debutant', labelFr: '🌱 Débutant — peu d\'outils digitaux', labelEn: '🌱 Beginner — few digital tools' },
                { value: 'intermediaire', labelFr: '🌿 Intermédiaire — outils basiques en place', labelEn: '🌿 Intermediate — basic tools in place' },
                { value: 'avance', labelFr: '🌳 Avancé — cherche à optimiser', labelEn: '🌳 Advanced — looking to optimize' },
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
        </div>

        <NavButtons onPrev={onPrev} onNext={onNext} isValid={isValid} fr={fr} />
      </div>
    )
  }

  // ─────────────────────────────────────────
  // INDÉTERMINÉ — version simple
  // ─────────────────────────────────────────
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-2">
        {fr ? 'Qui est concerné ?' : 'Who is involved?'}
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        {fr ? 'Décrivez les personnes concernées par votre besoin.' : 'Describe the people involved in your need.'}
      </p>

      <div className="flex flex-col gap-4 mb-8">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">
            {fr ? 'Qui est concerné *' : 'Who is involved *'}
          </label>
          <input
            type="text"
            value={data.targetUsers.profile}
            onChange={(e) => updateTargetUsers('profile', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                       text-white placeholder-gray-600 focus:outline-none
                       focus:border-[#0066FF]/50 transition-colors"
            placeholder={fr ? 'Ex: Moi-même, mon équipe, mes clients...' : 'Ex: Myself, my team, my customers...'}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">
            {fr ? 'Contexte géographique' : 'Geographic context'}
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

      <NavButtons onPrev={onPrev} onNext={onNext} isValid={isValid} fr={fr} />
    </div>
  )
}

function NavButtons({
  onPrev, onNext, isValid, fr,
}: { onPrev: () => void; onNext: () => void; isValid: boolean; fr: boolean }) {
  return (
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
  )
}