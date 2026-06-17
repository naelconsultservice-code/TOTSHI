'use client'

import type { FormData } from './DiscoveryFlow'

type Props = {
  data: FormData
  onChange: (updates: Partial<FormData>) => void
  onNext: () => void
  onPrev: () => void
  locale: string
}

type Feature = { id: string; labelFr: string; labelEn: string }
type FeaturePriority = 'indispensable' | 'souhaitable' | 'futur'

// Features par type de développement
const devFeatures: Record<string, Feature[]> = {
  SITE_WEB: [
    { id: 'f1', labelFr: "Page d'accueil", labelEn: 'Home page' },
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
    { id: 'f2', labelFr: "Transferts d'argent", labelEn: 'Money transfers' },
    { id: 'f3', labelFr: 'Mobile Money', labelEn: 'Mobile Money' },
    { id: 'f4', labelFr: 'Historique transactions', labelEn: 'Transaction history' },
    { id: 'f5', labelFr: 'Authentification 2FA', labelEn: '2FA Authentication' },
    { id: 'f6', labelFr: 'Rapports financiers', labelEn: 'Financial reports' },
  ],
  DEFAULT_DEV: [
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

// Prestations marketing
const marketingFeatures: Feature[] = [
  { id: 'm1', labelFr: 'Audit de présence digitale', labelEn: 'Digital presence audit' },
  { id: 'm2', labelFr: 'Stratégie éditoriale', labelEn: 'Content strategy' },
  { id: 'm3', labelFr: 'Gestion des réseaux sociaux', labelEn: 'Social media management' },
  { id: 'm4', labelFr: 'Campagnes Google Ads', labelEn: 'Google Ads campaigns' },
  { id: 'm5', labelFr: 'Campagnes Meta Ads', labelEn: 'Meta Ads campaigns' },
  { id: 'm6', labelFr: 'Email marketing & automation', labelEn: 'Email marketing & automation' },
  { id: 'm7', labelFr: 'Création de contenu', labelEn: 'Content creation' },
  { id: 'm8', labelFr: 'Reporting mensuel', labelEn: 'Monthly reporting' },
  { id: 'm9', labelFr: 'Formation équipe marketing', labelEn: 'Marketing team training' },
  { id: 'm10', labelFr: 'Branding & identité visuelle', labelEn: 'Branding & visual identity' },
]

// Prestations consultance
const consultingFeatures: Feature[] = [
  { id: 'c1', labelFr: 'Audit des processus existants', labelEn: 'Existing process audit' },
  { id: 'c2', labelFr: 'Feuille de route digitale', labelEn: 'Digital roadmap' },
  { id: 'c3', labelFr: 'Sélection des outils', labelEn: 'Tool selection' },
  { id: 'c4', labelFr: 'Conduite du changement', labelEn: 'Change management' },
  { id: 'c5', labelFr: 'Formation des équipes', labelEn: 'Team training' },
  { id: 'c6', labelFr: 'Suivi & accompagnement', labelEn: 'Monitoring & support' },
  { id: 'c7', labelFr: 'Analyse concurrentielle', labelEn: 'Competitive analysis' },
  { id: 'c8', labelFr: "Plan d'action priorité", labelEn: 'Priority action plan' },
]

// Objectifs indéterminés
const indeterminateFeatures: Feature[] = [
  { id: 'i1', labelFr: 'Visibilité en ligne', labelEn: 'Online visibility' },
  { id: 'i2', labelFr: 'Automatisation des tâches', labelEn: 'Task automation' },
  { id: 'i3', labelFr: 'Acquisition de clients', labelEn: 'Customer acquisition' },
  { id: 'i4', labelFr: 'Amélioration de la productivité', labelEn: 'Productivity improvement' },
  { id: 'i5', labelFr: 'Application / outil métier', labelEn: 'Business tool / app' },
  { id: 'i6', labelFr: 'Présence sur les réseaux', labelEn: 'Social media presence' },
]

function getFeatures(needType: string, projectType: string): Feature[] {
  if (needType === 'DEVELOPPEMENT') {
    return devFeatures[projectType] ?? devFeatures.DEFAULT_DEV
  }
  if (needType === 'MARKETING') return marketingFeatures
  if (needType === 'CONSULTANCE') return consultingFeatures
  return indeterminateFeatures
}

function getSectionTitle(needType: string, fr: boolean) {
  if (needType === 'MARKETING') return fr ? 'Prestations souhaitées' : 'Desired services'
  if (needType === 'CONSULTANCE') return fr ? 'Livrables attendus' : 'Expected deliverables'
  return fr ? 'Fonctionnalités souhaitées' : 'Desired features'
}

const priorityConfig = [
  { value: 'indispensable' as FeaturePriority, labelFr: '🔴 Indispensable', labelEn: '🔴 Must-have' },
  { value: 'souhaitable' as FeaturePriority, labelFr: '🟡 Souhaitable', labelEn: '🟡 Nice-to-have' },
  { value: 'futur' as FeaturePriority, labelFr: '🔵 Phase suivante', labelEn: '🔵 Next phase' },
]

export default function StepFeatures({ data, onChange, onNext, onPrev, locale }: Props) {
  const fr = locale === 'fr'
  const features = getFeatures(data.needType, data.projectType)
  const sectionTitle = getSectionTitle(data.needType, fr)

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
      <h2 className="text-xl font-bold text-white mb-2">{sectionTitle}</h2>
      <p className="text-gray-500 text-sm mb-6">
        {fr
          ? 'Sélectionnez et priorisez. Cette étape est facultative.'
          : 'Select and prioritize. This step is optional.'}
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
                <div className="flex gap-2 mt-1 ml-8 flex-wrap">
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
          {fr ? 'Autres éléments à préciser' : 'Other elements to specify'}
        </label>
        <textarea
          value={data.features.freeText}
          onChange={(e) => onChange({ features: { ...data.features, freeText: e.target.value } })}
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                     text-white placeholder-gray-600 focus:outline-none
                     focus:border-[#0066FF]/50 resize-none transition-colors"
          placeholder={fr ? 'Précisez tout autre élément important...' : 'Specify any other important element...'}
        />
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
          className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold
                     py-3 rounded-xl transition-colors"
        >
          {fr ? 'Continuer →' : 'Continue →'}
        </button>
      </div>
    </div>
  )
}