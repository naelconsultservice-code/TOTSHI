'use client'

import { useState, useEffect } from 'react'
import AdminShell from '@/components/admin/AdminShell'

type Project = {
  id: string
  slug: string
  titleFr: string
  titleEn: string
  category: string
  technologies: string[]
  isPublished: boolean
  displayOrder: number
}

export default function AdminRealisationsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    slug: '', titleFr: '', titleEn: '', category: '',
    descriptionFr: '', descriptionEn: '', problemFr: '',
    problemEn: '', resultFr: '', resultEn: '',
    technologies: '', coverImageUrl: '', isPublished: false, displayOrder: 0,
  })

  useEffect(() => {
    fetch('/api/admin/projects')
      .then((r) => r.json())
      .then(setProjects)
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    const payload = {
      ...form,
      technologies: form.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      displayOrder: Number(form.displayOrder),
    }
    const res = await fetch('/api/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      const newProject = await res.json()
      setProjects((prev) => [...prev, newProject])
      setShowForm(false)
      setForm({
        slug: '', titleFr: '', titleEn: '', category: '',
        descriptionFr: '', descriptionEn: '', problemFr: '',
        problemEn: '', resultFr: '', resultEn: '',
        technologies: '', coverImageUrl: '', isPublished: false, displayOrder: 0,
      })
    }
    setSaving(false)
  }

  async function togglePublish(id: string, current: boolean) {
    await fetch(`/api/admin/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !current }),
    })
    setProjects((prev) =>
      prev.map((p) => p.id === id ? { ...p, isPublished: !current } : p)
    )
  }

  const inputClass = `w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
    text-white placeholder-gray-600 focus:outline-none focus:border-[#0066FF]/50
    transition-colors text-sm`

  return (
    <AdminShell>
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Réalisations</h1>
            <p className="text-gray-500 mt-1">Gestion du portfolio</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold
                       px-5 py-2.5 rounded-xl transition-colors text-sm"
          >
            {showForm ? 'Annuler' : '+ Nouveau projet'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white/3 border border-white/8 rounded-2xl p-6 mb-8">
            <h2 className="text-white font-semibold mb-5">Nouveau projet</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Slug *</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className={inputClass} placeholder="mon-projet-fintech" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Catégorie *</label>
                <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className={inputClass} placeholder="FinTech, Mobile, Web..." />
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
              {[
                { label: 'Description FR *', field: 'descriptionFr' },
                { label: 'Description EN *', field: 'descriptionEn' },
                { label: 'Problème résolu FR *', field: 'problemFr' },
                { label: 'Problème résolu EN *', field: 'problemEn' },
                { label: 'Résultat obtenu FR *', field: 'resultFr' },
                { label: 'Résultat obtenu EN *', field: 'resultEn' },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label className="block text-xs text-gray-500 mb-1">{label}</label>
                  <textarea rows={3}
                    value={(form as any)[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className={inputClass + ' resize-none'} />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Technologies (virgule) *</label>
                <input value={form.technologies}
                  onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                  className={inputClass} placeholder="Next.js, PostgreSQL" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">URL image</label>
                <input value={form.coverImageUrl}
                  onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
                  className={inputClass} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Ordre</label>
                <input type="number" value={form.displayOrder}
                  onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) })}
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
                  {form.isPublished ? 'Publié' : 'Brouillon'}
                </span>
              </label>
              <button onClick={handleSave}
                disabled={saving || !form.slug || !form.titleFr || !form.technologies}
                className="bg-[#0066FF] hover:bg-[#0052CC] disabled:opacity-40 text-white
                           font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm">
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-gray-600 text-sm">Chargement...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <p className="text-4xl mb-4">🎨</p>
            <p>Aucun projet. Créez votre premier projet portfolio.</p>
          </div>
        ) : (
          <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs text-gray-600 font-medium px-6 py-4">Projet</th>
                  <th className="text-left text-xs text-gray-600 font-medium px-6 py-4">Catégorie</th>
                  <th className="text-left text-xs text-gray-600 font-medium px-6 py-4">Technologies</th>
                  <th className="text-left text-xs text-gray-600 font-medium px-6 py-4">Statut</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-white/5 hover:bg-white/2">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium text-sm">{project.titleFr}</p>
                      <p className="text-gray-600 text-xs">{project.slug}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{project.category}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 2).map((t) => (
                          <span key={t} className="text-xs bg-white/5 text-gray-500 px-2 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => togglePublish(project.id, project.isPublished)}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors
                          ${project.isPublished
                            ? 'bg-green-500/10 text-green-400 hover:bg-red-500/10 hover:text-red-400'
                            : 'bg-gray-500/10 text-gray-500 hover:bg-green-500/10 hover:text-green-400'
                          }`}>
                        {project.isPublished ? 'Publié' : 'Brouillon'}
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