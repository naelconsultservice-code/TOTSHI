'use client'

import type { FormData } from './DiscoveryFlow'

type Props = {
  data: FormData
  onChange: (updates: Partial<FormData>) => void
  onNext: () => void
  onPrev: () => void
  locale: string
}

type FeaturePriority = 'indispensable' | 'souhaitable' | 'futur'

const featuresByType: Record<string, { id: string; labelFr: string; labelEn: string }[]> = {
  SITE_WEB: [
    { id: 'f1', labelFr: 'Page d\'accueil', labelEn: 'Home page' },
    { id: 'f2', labelFr: 'Blog / actualités', labelEn: 'Blog / news' },
    { id: 'f3', labelFr: 'Formulaire de contact', labelEn: 'Contact form' },
    { id: 'f4', labelFr: 'Galerie / portfolio', labelEn: 'Gallery / portfolio' },
    { id: 'f5', labelFr: 'Multilingue', labelEn: 'Multilingual' },
    { id: 'f6', labelFr: 'SEO optimisé', labelEn: 'SEO optimized' },
  ],
  APP_MOBILE: [
    { id: 'f1', labelFr: 'Authentification', labelEn: 'Authentication' },
    { id: 'f2', labelFr: 'Notifications push', labelEn: 'Push notifications' },
    { id: 'f3', labelFr: 'Mode hors-ligne', labelEn: 'Offline mode' },
    { id: 'f4', labelFr: 'Géolocalisation', labelEn: 'Geolocation' },
    { id: 'f5', labelFr: 'Paiement intégré', labelEn: 'Integrated payment' },
    { id: 'f6', labelFr: 'Chat / messagerie', labelEn: 'Chat / messaging' },
  ],
  ECOMMERCE: [
    { id: 'f1', labelFr: 'Catalogue produits', labelEn: 'Product catalog' },
    { id: 'f2', labelFr: 'Panier & commandes', labelEn: 'Cart & orders' },
    { id: 'f3', labelFr: 'Paiement en ligne', labelEn: 'Online payment' },
    { id: 'f4', labelFr: 'Gestion stocks', labelEn: 'Stock management' },
    { id: 'f5', labelFr: 'Espace client', labelEn: 'Customer portal' },
    { id: 'f6', labelFr: 'Avis & notations', labelEn: 'Reviews & ratings' },
  ],
  FINTECH: [
    { id: 'f1', labelFr: 'Portefeuille numérique', labelEn: 'Digital wallet' },
    { id: 'f2', labelFr: 'Transferts d\'argent', labelEn: 'Money transfers' },
    { id: 'f3', labelFr: 'Mobile Money', labelEn: 'Mobile Money' },
    { id: 'f4', labelFr: 'Historique transactions', labelEn: 'Transaction history' },
    { id: 'f5', labelFr: 'Authentification 2FA', labelEn: '2FA Authentication' },
    { id: 'f6', labelFr: 'Rapports financiers', labelEn: 'Financial reports' },
  ],
  DEFAULT: [
    { id: 'f1', labelFr: 'Authentification utilisateurs', labelEn: 'User authentication' },
    { id: 'f2', labelFr: 'Tableau de bord', labelEn: 'Dashboard' },
    { id: 'f3', labelFr: 'Gestion des rôles', labelEn: 'Role management' },
    { id: 'f4', labelFr: 'Notifications email', labelEn: 'Email notifications' },
    { id: 'f5', labelFr: 'Export de données', labelEn: 'Data export' },
    { id: 'f6', labelFr: 'API / intégrations', labelEn: 'API / integrations' },
    { id: 'f7', labelFr: 'Application mobile', labelEn: 'Mobile application' },
    { id: 'f8', labelFr: 'Multilingue', labelEn: 'Multilingual' },
  ],
}

const priorityConfig = [
  { value: 'indispensable' as FeaturePriority, labelFr: '🔴 Indispensable', labelEn: '🔴 Must-have', color: 'text-red-400' },
  { value: 'souhaitable' as FeaturePriority, labelFr: '🟡 Souhaitable', labelEn: '🟡 Nice-to-have', color: 'text-yellow-400' },
  { value: 'futur' as FeaturePriority, labelFr: '🔵 Version future', labelEn: '🔵 Future version', color: 'text-blue-400' },
]

export default function StepFeatures({ data, onChange, onNext, onPrev, locale }: Props) {
  const fr = locale === 'fr'
  const features = featuresByType[data.projectType] ?? featuresByType.DEFAULT

  function toggleFeature(featureId: string, label: string) {
    const existing = data.features.selected.find((f) => f.id === featureId)
    if (existing) {
      onChange({
        features: {
          ...data.features,
          selected: data.features.selected.filter((f) => f.id !== featureId),
        },
      })
    } else {
      onChange({
        features: {
          ...data.features,
          selected: [...data.features.selected, { id: featureId, label, priority: 'indispensable' }],
        },
      })
    }
  }

  function setPriority(featureId: string, priority: FeaturePriority) {
    onChange({
      features: {
        ...data.features,
        selected: data.features.selected.map((f) =>
          f.id === featureId ? { ...f, priority } : f
        ),
      },
    })
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-2">
        {fr ? 'Fonctionnalités souhaitées' : 'Desired features'}
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        {fr
          ? 'Sélectionnez et priorisez les fonctionnalités. Cette étape est facultative.'
          : 'Select and prioritize features. This step is optional.'}
      </p>

      <div className="flex flex-col gap-3 mb-6">
        {features.map((feature) => {
          const selected = data.features.selected.find((f) => f.id === feature.id)
          const label = fr ? feature.labelFr : feature.labelEn
          return (
            <div key={feature.id}>
              <div
                onClick={() => toggleFeature(feature.id, label)}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer
                            transition-all
                            ${selected
                              ? 'border-[#0066FF]/40 bg-[#0066FF]/5'
                              : 'border-white/8 hover:border-white/20'
                            }`}
              >
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center
                                flex-shrink-0 transition-all
                                ${selected ? 'border-[#0066FF] bg-[#0066FF]' : 'border-white/20'}`}>
                  {selected && <span className="text-white text-xs">✓</span>}
                </div>
                <span className={`text-sm ${selected ? 'text-white' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>

              {selected && (
                <div className="flex gap-2 mt-1 ml-8">
                  {priorityConfig.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPriority(feature.id, p.value)}
                      className={`text-xs px-2 py-1 rounded-lg border transition-all
                        ${selected.priority === p.value
                          ? 'border-white/30 bg-white/10 text-white'
                          : 'border-white/8 text-gray-600 hover:text-gray-400'
                        }`}
                    >
                      {fr ? p.labelFr : p.labelEn}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mb-8">
        <label className="block text-sm text-gray-400 mb-1.5">
          {fr ? 'Autres fonctionnalités (libre)' : 'Other features (free text)'}
        </label>
        <textarea
          value={data.features.freeText}
          onChange={(e) => onChange({ features: { ...data.features, freeText: e.target.value } })}
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                     text-white placeholder-gray-600 focus:outline-none
                     focus:border-[#0066FF]/50 resize-none transition-colors"
          placeholder={fr ? 'Décrivez d\'autres fonctionnalités non listées...' : 'Describe other features not listed...'}
        />
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