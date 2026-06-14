'use client'

import { useState } from 'react'
import type { FormData } from './DiscoveryFlow'

type Props = {
  data: FormData
  onChange: (updates: Partial<FormData>) => void
  onSubmit: () => void
  onPrev: () => void
  submitting: boolean
  error: string
  locale: string
}

export default function StepReview({ data, onChange, onSubmit, onPrev, submitting, error, locale }: Props) {
  const fr = locale === 'fr'

  const sections = [
    {
      title: fr ? 'Vos informations' : 'Your information',
      items: [
        { label: fr ? 'Nom' : 'Name', value: `${data.firstName} ${data.lastName}` },
        { label: 'Email', value: data.email },
        { label: fr ? 'Téléphone' : 'Phone', value: data.phone || '—' },
        { label: fr ? 'Entreprise' : 'Company', value: data.company || '—' },
        { label: fr ? 'Pays' : 'Country', value: data.country },
        { label: fr ? 'Secteur' : 'Sector', value: data.sector },
      ],
    },
    {
      title: fr ? 'Votre projet' : 'Your project',
      items: [
        { label: fr ? 'Type' : 'Type', value: data.projectType.replace(/_/g, ' ') },
        { label: fr ? 'Description' : 'Description', value: data.description },
      ],
    },
    {
      title: fr ? 'Utilisateurs cibles' : 'Target users',
      items: [
        { label: fr ? 'Profil' : 'Profile', value: data.targetUsers.profile },
        { label: fr ? 'Volume' : 'Volume', value: data.targetUsers.estimatedVolume || '—' },
        { label: fr ? 'Géographie' : 'Geography', value: data.targetUsers.geography || '—' },
        { label: fr ? 'Niveau tech' : 'Tech level', value: data.targetUsers.techLevel },
        { label: fr ? 'Accès' : 'Access', value: data.targetUsers.accessType },
      ],
    },
  ]

  if (data.constraints.budget || data.constraints.timeline) {
    sections.push({
      title: fr ? 'Contraintes' : 'Constraints',
      items: [
        { label: fr ? 'Budget' : 'Budget', value: data.constraints.budget || '—' },
        { label: fr ? 'Délai' : 'Timeline', value: data.constraints.timeline || '—' },
        { label: fr ? 'Urgence' : 'Urgency', value: data.constraints.urgencyLevel },
      ],
    })
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-2">
        {fr ? 'Récapitulatif' : 'Summary'}
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        {fr
          ? 'Vérifiez vos informations avant de soumettre votre projet.'
          : 'Review your information before submitting your project.'}
      </p>

      {/* Sections récap */}
      <div className="flex flex-col gap-4 mb-6">
        {sections.map((section) => (
          <div key={section.title} className="bg-white/3 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#0066FF] text-xs font-semibold uppercase tracking-wide mb-3">
              {section.title}
            </h3>
            <div className="flex flex-col gap-2">
              {section.items.map(({ label, value }) => (
                <div key={label} className="flex gap-3">
                  <span className="text-gray-600 text-sm min-w-24 flex-shrink-0">{label}</span>
                  <span className="text-gray-300 text-sm break-words">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {data.features.selected.length > 0 && (
          <div className="bg-white/3 rounded-xl p-4 border border-white/5">
            <h3 className="text-[#0066FF] text-xs font-semibold uppercase tracking-wide mb-3">
              {fr ? 'Fonctionnalités' : 'Features'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.features.selected.map((f) => (
                <span
                  key={f.id}
                  className={`text-xs px-2.5 py-1 rounded-full
                    ${f.priority === 'indispensable'
                      ? 'bg-red-500/10 text-red-400'
                      : f.priority === 'souhaitable'
                      ? 'bg-yellow-500/10 text-yellow-400'
                      : 'bg-blue-500/10 text-blue-400'
                    }`}
                >
                  {f.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bouton retour pour modifier */}
      <button
        onClick={onPrev}
        className="text-sm text-gray-500 hover:text-gray-300 transition-colors mb-6 block"
      >
        ← {fr ? 'Modifier une étape' : 'Edit a step'}
      </button>

      {/* Consentement RGPD */}
      <div
        onClick={() => onChange({ gdprConsent: !data.gdprConsent })}
        className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer
                    transition-all mb-6
                    ${data.gdprConsent
                      ? 'border-[#0066FF]/40 bg-[#0066FF]/5'
                      : 'border-white/8 hover:border-white/20'
                    }`}
      >
        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center
                        flex-shrink-0 mt-0.5 transition-all
                        ${data.gdprConsent ? 'border-[#0066FF] bg-[#0066FF]' : 'border-white/20'}`}>
          {data.gdprConsent && <span className="text-white text-xs">✓</span>}
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">
          {fr
            ? "J'accepte que TOTSHI collecte et utilise mes données pour traiter ma demande. Ces données ne seront jamais partagées avec des tiers."
            : "I agree that TOTSHI collects and uses my data to process my request. This data will never be shared with third parties."}
        </p>
      </div>

      {/* Erreur */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3
                        text-red-400 text-sm mb-4">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={onSubmit}
        disabled={!data.gdprConsent || submitting}
        className="w-full bg-[#0066FF] hover:bg-[#0052CC] disabled:opacity-40
                   disabled:cursor-not-allowed text-white font-semibold py-4
                   rounded-xl transition-all text-lg hover:scale-[1.01]
                   hover:shadow-lg hover:shadow-[#0066FF]/25"
      >
        {submitting
          ? (fr ? '⏳ Traitement en cours...' : '⏳ Processing...')
          : (fr ? '🚀 Soumettre mon projet' : '🚀 Submit my project')}
      </button>

      <p className="text-center text-gray-600 text-xs mt-4">
        {fr
          ? '🔒 Vos données sont sécurisées. Réponse sous 24h.'
          : '🔒 Your data is secure. Response within 24h.'}
      </p>
    </div>
  )
}