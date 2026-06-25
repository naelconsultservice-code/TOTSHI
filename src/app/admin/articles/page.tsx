'use client'

import { useState, useEffect } from 'react'
import AdminShell from '@/components/admin/AdminShell'

type Article = {
  id: string
  slug: string
  titleFr: string
  titleEn: string
  category: string
  isPublished: boolean
  readingMinutes: number
  createdAt: string
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    slug: '', titleFr: '', titleEn: '',
    excerptFr: '', excerptEn: '',
    contentFr: '', contentEn: '',
    category: '', coverImageUrl: '',
    readingMinutes: 5, isPublished: false,
  })

  useEffect(() => {
    fetch('/api/admin/articles')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setArticles(data)
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    setError('')
    const res = await fetch('/api/admin/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      const newArticle = await res.json()
      setArticles((prev) => [newArticle, ...prev])
      setShowForm(false)
      setForm({
        slug: '', titleFr: '', titleEn: '',
        excerptFr: '', excerptEn: '',
        contentFr: '', contentEn: '',
        category: '', coverImageUrl: '',
        readingMinutes: 5, isPublished: false,
      })
    } else {
      const data = await res.json()
      setError(data.error ?? 'Erreur lors de la création')
    }
    setSaving(false)
  }

  async function togglePublish(id: string, current: boolean) {
    await fetch(`/api/admin/articles/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !current }),
    })
    setArticles((prev) =>
      prev.map((a) => a.id === id ? { ...a, isPublished: !current } : a)
    )
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cet article ?')) return
    await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' })
    setArticles((prev) => prev.filter((a) => a.id !== id))
  }

  const inputClass = `w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
    text-white placeholder-gray-600 focus:outline-none focus:border-[#0066FF]/50
    transition-colors text-sm`

  return (
    <AdminShell>
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Articles</h1>
            <p className="text-gray-500 mt-1">Gestion du blog</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold
                       px-5 py-2.5 rounded-xl transition-colors text-sm"
          >
            {showForm ? 'Annuler' : '+ Nouvel article'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white/3 border border-white/8 rounded-2xl p-6 mb-8">
            <h2 className="text-white font-semibold mb-5">Nouvel article</h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3
                              text-red-400 text-sm mb-4">{error}</div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Slug (URL unique) *</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className={inputClass} placeholder="seo-pme-2026" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Catégorie *</label>
                <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className={inputClass} placeholder="Marketing, Développement, Conseil..." />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Titre (FR) *</label>
                <input value={form.titleFr} onChange={(e) => setForm({ ...form, titleFr: e.target.value })}
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Titre (EN) *</label>
                <input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                  className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Extrait (FR) — 1-2 phrases *</label>
                <textarea rows={2} value={form.excerptFr}
                  onChange={(e) => setForm({ ...form, excerptFr: e.target.value })}
                  className={inputClass + ' resize-none'} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Extrait (EN) *</label>
                <textarea rows={2} value={form.excerptEn}
                  onChange={(e) => setForm({ ...form, excerptEn: e.target.value })}
                  className={inputClass + ' resize-none'} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Contenu (FR) — séparez les paragraphes par une ligne vide *</label>
                <textarea rows={10} value={form.contentFr}
                  onChange={(e) => setForm({ ...form, contentFr: e.target.value })}
                  className={inputClass + ' resize-none font-mono text-xs'} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Contenu (EN) *</label>
                <textarea rows={10} value={form.contentEn}
                  onChange={(e) => setForm({ ...form, contentEn: e.target.value })}
                  className={inputClass + ' resize-none font-mono text-xs'} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-xs text-gray-500 mb-1">URL image de couverture</label>
                <input value={form.coverImageUrl}
                  onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
                  className={inputClass} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Temps de lecture (min)</label>
                <input type="number" value={form.readingMinutes}
                  onChange={(e) => setForm({ ...form, readingMinutes: parseInt(e.target.value) || 5 })}
                  className={inputClass} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer"
                onClick={() => setForm({ ...form, isPublished: !form.isPublished })}>
                <div className={`w-10 h-5 rounded-full transition-colors relative
                  ${form.isPublished ? 'bg-[#0066FF]' : 'bg-white/10'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all
                    ${form.isPublished ? 'left-5' : 'left-0.5'}`} />
                </div>
                <span className="text-sm text-gray-400">
                  {form.isPublished ? 'Publié immédiatement' : 'Brouillon'}
                </span>
              </label>
              <button onClick={handleSave}
                disabled={saving || !form.slug || !form.titleFr || !form.contentFr}
                className="bg-[#0066FF] hover:bg-[#0052CC] disabled:opacity-40 text-white
                           font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm">
                {saving ? 'Enregistrement...' : 'Publier l\'article'}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-gray-600 text-sm">Chargement...</div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <p className="text-4xl mb-4">📝</p>
            <p>Aucun article. Créez votre premier article.</p>
          </div>
        ) : (
          <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs text-gray-600 font-medium px-6 py-4">Article</th>
                  <th className="text-left text-xs text-gray-600 font-medium px-6 py-4">Catégorie</th>
                  <th className="text-left text-xs text-gray-600 font-medium px-6 py-4">Statut</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b border-white/5 hover:bg-white/2">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium text-sm">{article.titleFr}</p>
                      <p className="text-gray-600 text-xs">/{article.slug}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{article.category}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => togglePublish(article.id, article.isPublished)}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors
                          ${article.isPublished
                            ? 'bg-green-500/10 text-green-400 hover:bg-red-500/10 hover:text-red-400'
                            : 'bg-gray-500/10 text-gray-500 hover:bg-green-500/10 hover:text-green-400'
                          }`}>
                        {article.isPublished ? 'Publié' : 'Brouillon'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(article.id)}
                        className="text-xs text-red-500/70 hover:text-red-400 transition-colors">
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  )
}