'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegenerateButton({ submissionId }: { submissionId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleRegenerate() {
    if (!confirm('Régénérer l\'ébauche IA ? L\'ancienne version sera conservée.')) return
    setLoading(true)
    await fetch(`/api/admin/submissions/${submissionId}/regenerate`, {
      method: 'POST',
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={handleRegenerate}
      disabled={loading}
      className="bg-white/5 hover:bg-white/10 disabled:opacity-50 text-gray-300
                 hover:text-white text-sm font-medium px-4 py-2 rounded-xl
                 transition-colors border border-white/8"
    >
      {loading ? '⏳ Génération...' : '🤖 Régénérer IA'}
    </button>
  )
}