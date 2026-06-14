'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const statuses = [
  'NOUVEAU', 'EN_COURS', 'BRIEF_ENVOYE', 'EN_ATTENTE_CLIENT',
  'PROPOSITION_ENVOYEE', 'CONFIRME', 'NON_QUALIFIE', 'ARCHIVE',
]

const statusLabels: Record<string, string> = {
  NOUVEAU: 'Nouveau', EN_COURS: 'En cours', BRIEF_ENVOYE: 'Brief envoyé',
  EN_ATTENTE_CLIENT: 'En attente client', PROPOSITION_ENVOYEE: 'Proposition envoyée',
  CONFIRME: 'Confirmé', NON_QUALIFIE: 'Non qualifié', ARCHIVE: 'Archivé',
}

export default function StatusUpdater({
  submissionId,
  currentStatus,
}: {
  submissionId: string
  currentStatus: string
}) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleChange(newStatus: string) {
    setLoading(true)
    await fetch(`/api/admin/submissions/${submissionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    setStatus(newStatus)
    setLoading(false)
    router.refresh()
  }

  return (
    <select
  value={status}
  onChange={(e) => handleChange(e.target.value)}
  disabled={loading}
  aria-label="Statut de la soumission"
  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2
                 text-white text-sm focus:outline-none focus:border-[#0066FF]/50
                 disabled:opacity-50"
    >
      {statuses.map((s) => (
        <option key={s} value={s} className="bg-[#0A0A0F]">
          {statusLabels[s]}
        </option>
      ))}
    </select>
  )
}