'use client'

import { useState, useEffect } from 'react'
import AdminShell from '@/components/admin/AdminShell'

type Testimonial = {
  id: string
  clientName: string
  clientRole: string | null
  clientCompany: string | null
  clientAvatarUrl: string | null
  contentFr: string
  contentEn: string
  rating: number
  projectSlug: string | null
  isPublished: boolean
  displayOrder: number
}

const STARS = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

const emptyForm = {
  clientName: '',
  clientRole: '',
  clientCompany: '',
  clientAvatarUrl: '',
  contentFr: '',
  contentEn: '',
  rating: 5,
  projectSlug: '',
  isPublished: false,
  displayOrder: 0,
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    fetch('/api/admin/testimonials')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setTestimonials(data) })
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    setError('')

    const res = await fetch('/api/admin/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        rating: Number(form.rating),
        displayOrder: Number(form.displayOrder),
      }),
    })

    if (res.ok) {
      const newItem = await res.json()
      setTestimonials((prev) => [...prev, newItem])
      setShowForm(false)
      setForm(emptyForm)
    } else {
      const data = await res.json()
      setError(data.error ?? 'Erreur lors de la création')
    }
    setSaving(false)
  }

  async function togglePublish(id: string, current: boolean) {
    await fetch(`/api/admin/testimonials/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !current }),
    })
    setTestimonials((prev) =>
      prev.map((t) => t.id === id ? { ...t, isPublished: !current } : t)
    )
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce témoignage ?')) return
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' })
    setTestimonials((prev) => prev.filter((t) => t.id !== id))
  }

  const inputClass = `w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
    text-white placeholder-gray-600 focus:outline-none focus:border-[#0066FF]/50
    transition-colors text-sm`

  return (
    <AdminShell>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Témoignages</h1>
            <p className="text-gray-500 mt-1">Gestion des avis clients</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setError('') }}
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold
                       px-5 py-2.5 rounded-xl transition-colors text-sm"
          >
            {showForm ? 'Annuler' : '+ Nouveau témoignage'}
          </button>
        </div>

        {/* Formulaire création */}
        {showForm && (
          <div className="bg-white/3 border border-white/8 rounded-2xl p-6 mb-8">
            <h2 className="text-white font-semibold mb-5">Nouveau témoignage</h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3
                              text-red-400 text-sm mb-4">{error}</div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Nom du client *</label>
                <input
                  value={form.clientName}
                  onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                  className={inputClass}
                  placeholder="Jean Dupont"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Rôle / Poste</label>
                <input
                  value={form.clientRole}
                  onChange={(e) => setForm({ ...form, clientRole: e.target.value })}
                  className={inputClass}
                  placeholder="CEO, Directeur Technique..."
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Entreprise</label>
                <input
                  value={form.clientCompany}
                  onChange={(e) => setForm({ ...form, clientCompany: e.target.value })}
                  className={inputClass}
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">URL avatar (optionnel)</label>
                <input
                  value={form.clientAvatarUrl}
                  onChange={(e) => setForm({ ...form, clientAvatarUrl: e.target.value })}
                  className={inputClass}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Témoignage (FR) *</label>
                <textarea
                  rows={4}
                  value={form.contentFr}
                  onChange={(e) => setForm({ ...form, contentFr: e.target.value })}
                  className={inputClass + ' resize-none'}
                  placeholder="TOTSHI a livré un travail exceptionnel..."
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Témoignage (EN) *</label>
                <textarea
                  rows={4}
                  value={form.contentEn}
                  onChange={(e) => setForm({ ...form, contentEn: e.target.value })}
                  className={inputClass + ' resize-none'}
                  placeholder="TOTSHI delivered exceptional work..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Note (1–5)</label>
                <select
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })}
                  aria-label="Note"
                  className={inputClass}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n} className="bg-[#0A0A0F]">
                      {STARS(n)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Slug projet lié (optionnel)
                </label>
                <input
                  value={form.projectSlug}
                  onChange={(e) => setForm({ ...form, projectSlug: e.target.value })}
                  className={inputClass}
                  placeholder="mon-projet-fintech"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Ordre d'affichage</label>
                <input
                  type="number"
                  value={form.displayOrder}
                  onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setForm({ ...form, isPublished: !form.isPublished })}
              >
                <div className={`w-10 h-5 rounded-full transition-colors relative
                  ${form.isPublished ? 'bg-[#0066FF]' : 'bg-white/10'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all
                    ${form.isPublished ? 'left-5' : 'left-0.5'}`} />
                </div>
                <span className="text-sm text-gray-400">
                  {form.isPublished ? 'Publié immédiatement' : 'Brouillon'}
                </span>
              </label>
              <button
                onClick={handleSave}
                disabled={saving || !form.clientName || !form.contentFr || !form.contentEn}
                className="bg-[#0066FF] hover:bg-[#0052CC] disabled:opacity-40 text-white
                           font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        )}

        {/* Liste */}
        {loading ? (
          <div className="text-gray-600 text-sm">Chargement...</div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <p className="text-4xl mb-4">💬</p>
            <p>Aucun témoignage. Ajoutez votre premier avis client.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white/3 border border-white/8 rounded-2xl p-5
                           hover:border-white/12 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Info client + contenu */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {t.clientAvatarUrl ? (
                      <img
                        src={t.clientAvatarUrl}
                        alt={t.clientName}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#0066FF]/20 flex items-center
                                      justify-center text-[#0066FF] font-bold text-sm flex-shrink-0">
                        {t.clientName.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-semibold text-sm">{t.clientName}</span>
                        {t.clientRole && (
                          <span className="text-gray-500 text-xs">{t.clientRole}</span>
                        )}
                        {t.clientCompany && (
                          <span className="text-gray-600 text-xs">· {t.clientCompany}</span>
                        )}
                      </div>
                      <div className="text-yellow-400 text-xs mt-0.5">{STARS(t.rating)}</div>
                      <p className="text-gray-400 text-sm mt-2 leading-relaxed line-clamp-2">
                        {t.contentFr}
                      </p>
                      {t.projectSlug && (
                        <span className="text-xs text-[#0066FF] mt-1 block">
                          📌 Projet lié : {t.projectSlug}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-700">#{t.displayOrder}</span>
                    <button
                      onClick={() => togglePublish(t.id, t.isPublished)}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors
                        ${t.isPublished
                          ? 'bg-green-500/10 text-green-400 hover:bg-red-500/10 hover:text-red-400'
                          : 'bg-gray-500/10 text-gray-500 hover:bg-green-500/10 hover:text-green-400'
                        }`}
                    >
                      {t.isPublished ? 'Publié' : 'Brouillon'}
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-xs text-red-500/70 hover:text-red-400 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}