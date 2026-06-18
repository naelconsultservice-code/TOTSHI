'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import StepNeedType from './StepNeedType'
import StepIdentification from './StepIdentification'
import StepProjectType from './StepProjectType'
import StepDescription from './StepDescription'
import StepTargetUsers from './StepTargetUsers'
import StepFeatures from './StepFeatures'
import StepConstraints from './StepConstraints'
import StepReview from './StepReview'

export type FormData = {
  needType: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  country: string
  sector: string
  projectType: string
  description: string
  targetUsers: {
    profile: string
    estimatedVolume: string
    geography: string
    techLevel: string
    accessType: string
  }
  features: {
    selected: Array<{ id: string; label: string; priority: string }>
    freeText: string
  }
  constraints: {
    budget: string
    timeline: string
    currentSystem: string
    technicalConstraints: string
    references: string
    urgencyLevel: string
  }
  gdprConsent: boolean
  _hp: string
}

const STORAGE_KEY = 'totshi_discovery_v2'

const initialData: FormData = {
  needType: '',
  firstName: '', lastName: '', email: '', phone: '',
  company: '', country: '', sector: '',
  projectType: '',
  description: '',
  targetUsers: {
    profile: '', estimatedVolume: '', geography: '',
    techLevel: 'non_technique', accessType: 'externe',
  },
  features: { selected: [], freeText: '' },
  constraints: {
    budget: '', timeline: '', currentSystem: '',
    technicalConstraints: '', references: '', urgencyLevel: 'normal',
  },
  gdprConsent: false,
  _hp: '',
}

export default function DiscoveryFlow({ locale }: { locale: string }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialData)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const totalSteps = 8

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const { data, savedStep } = JSON.parse(saved)
        setFormData({ ...initialData, ...data })
        setStep(savedStep)
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ data: formData, savedStep: step }))
    } catch {}
  }, [formData, step])

  function updateData(updates: Partial<FormData>) {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  function nextStep() {
    setStep((s) => Math.min(s + 1, totalSteps))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function prevStep() {
    setStep((s) => Math.max(s - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError('')

    try {
      const payload = { ...formData, language: locale, gdprConsent: true }

      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Une erreur est survenue. Veuillez réessayer.')
        setSubmitting(false)
        return
      }

      localStorage.removeItem(STORAGE_KEY)
      router.push(`/${locale}/confirmation`)
    } catch {
      setError('Erreur réseau. Veuillez vérifier votre connexion.')
      setSubmitting(false)
    }
  }

  const progressPercent = Math.round(((step - 1) / (totalSteps - 1)) * 100)

  const stepLabels = locale === 'fr'
    ? ['Votre besoin', 'Identification', 'Précision', 'Description', 'Utilisateurs', 'Prestations', 'Contraintes', 'Récapitulatif']
    : ['Your need', 'Identification', 'Specification', 'Description', 'Users', 'Services', 'Constraints', 'Summary']

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">
            {locale === 'fr' ? 'Étape' : 'Step'} {step} {locale === 'fr' ? 'sur' : 'of'} {totalSteps}
          </span>
          <span className="text-sm text-[#0066FF] font-medium">
            {stepLabels[step - 1]}
          </span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0066FF] rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between mt-3">
          {stepLabels.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i + 1 < step
                  ? 'bg-[#0066FF]'
                  : i + 1 === step
                  ? 'bg-[#0066FF] ring-4 ring-[#0066FF]/20'
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="bg-white/3 border border-white/8 rounded-2xl p-8">
        {step === 1 && (
          <StepNeedType data={formData} onChange={updateData} onNext={nextStep} locale={locale} />
        )}
        {step === 2 && (
          <StepIdentification data={formData} onChange={updateData} onNext={nextStep} locale={locale} />
        )}
        {step === 3 && (
          <StepProjectType data={formData} onChange={updateData} onNext={nextStep} onPrev={prevStep} locale={locale} />
        )}
        {step === 4 && (
          <StepDescription data={formData} onChange={updateData} onNext={nextStep} onPrev={prevStep} locale={locale} />
        )}
        {step === 5 && (
          <StepTargetUsers data={formData} onChange={updateData} onNext={nextStep} onPrev={prevStep} locale={locale} />
        )}
        {step === 6 && (
          <StepFeatures data={formData} onChange={updateData} onNext={nextStep} onPrev={prevStep} locale={locale} />
        )}
        {step === 7 && (
          <StepConstraints data={formData} onChange={updateData} onNext={nextStep} onPrev={prevStep} locale={locale} />
        )}
        {step === 8 && (
          <StepReview data={formData} onChange={updateData} onSubmit={handleSubmit} onPrev={prevStep} submitting={submitting} error={error} locale={locale} />
        )}
      </div>
    </div>
  )
}