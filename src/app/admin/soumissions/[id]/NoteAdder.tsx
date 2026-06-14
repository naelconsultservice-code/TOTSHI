'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NoteAdder({ submissionId }: { submissionId: string }) {
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!note.trim()) return
    setLoading(true)
    await fetch(`/api/admin/submissions/${submissionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note }),
    })
    setNote('')
    setLoading(false)
    router.refresh()
  }

  return (
    <div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Ajouter une note..."
        rows={3}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2
                   text-white text-xs placeholder-gray-600 focus:outline-none
                   focus:border-[#0066FF]/50 resize-none mb-2"
      />
      <button
        onClick={handleSubmit}
        disabled={loading || !note.trim()}
        className="w-full bg-white/5 hover:bg-white/10 disabled:opacity-50
                   text-gray-300 text-xs font-medium py-2 rounded-xl transition-colors"
      >
        {loading ? 'Ajout...' : 'Ajouter la note'}
      </button>
    </div>
  )
}