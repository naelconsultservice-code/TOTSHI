import { getSubmissions } from '@/services/submission.service'
import Link from 'next/link'
import AdminShell from '@/components/admin/AdminShell'
export const dynamic = 'force-dynamic'

const statusColors: Record<string, string> = {
  NOUVEAU: 'bg-blue-500/10 text-blue-400',
  EN_COURS: 'bg-yellow-500/10 text-yellow-400',
  BRIEF_ENVOYE: 'bg-purple-500/10 text-purple-400',
  EN_ATTENTE_CLIENT: 'bg-orange-500/10 text-orange-400',
  PROPOSITION_ENVOYEE: 'bg-indigo-500/10 text-indigo-400',
  CONFIRME: 'bg-green-500/10 text-green-400',
  NON_QUALIFIE: 'bg-red-500/10 text-red-400',
  ARCHIVE: 'bg-gray-500/10 text-gray-500',
}

const statusLabels: Record<string, string> = {
  NOUVEAU: 'Nouveau', EN_COURS: 'En cours', BRIEF_ENVOYE: 'Brief envoyé',
  EN_ATTENTE_CLIENT: 'En attente', PROPOSITION_ENVOYEE: 'Proposition',
  CONFIRME: 'Confirmé', NON_QUALIFIE: 'Non qualifié', ARCHIVE: 'Archivé',
}

const needTypeBadge: Record<string, { label: string; className: string }> = {
  MARKETING: { label: '📈 Marketing', className: 'bg-purple-500/10 text-purple-400' },
  CONSULTANCE: { label: '🧭 Conseil', className: 'bg-orange-500/10 text-orange-400' },
  INDETERMINE: { label: '🤔 À qualifier', className: 'bg-gray-500/10 text-gray-500' },
  DEVELOPPEMENT: { label: '💻 Dev', className: 'bg-blue-500/10 text-blue-400' },
}

export default async function SoumissionsPage({
  searchParams,
}: {
  searchParams: { status?: string; page?: string; needType?: string }
}) {
  const page = parseInt(searchParams.page ?? '1')
  const status = searchParams.status
  const { submissions, pagination } = await getSubmissions({ status, page, limit: 20 })

  return (
    <AdminShell>
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Soumissions</h1>
            <p className="text-gray-500 mt-1">{pagination.total} soumission(s) au total</p>
          </div>
        </div>

        {/* Filtres statut */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['', 'NOUVEAU', 'EN_COURS', 'CONFIRME', 'ARCHIVE'].map((s) => (
            <Link
              key={s}
              href={s ? `/admin/soumissions?status=${s}` : '/admin/soumissions'}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                ${status === s || (!status && !s)
                  ? 'bg-[#0066FF] text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
            >
              {s ? (statusLabels[s] ?? s) : 'Tous'}
            </Link>
          ))}
        </div>

        <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
          {submissions.length === 0 ? (
            <div className="p-12 text-center text-gray-600">Aucune soumission trouvée.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs text-gray-600 font-medium px-6 py-4">Date</th>
                  <th className="text-left text-xs text-gray-600 font-medium px-6 py-4">Prospect</th>
                  <th className="text-left text-xs text-gray-600 font-medium px-6 py-4">Type</th>
                  <th className="text-left text-xs text-gray-600 font-medium px-6 py-4">Score</th>
                  <th className="text-left text-xs text-gray-600 font-medium px-6 py-4">Statut</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => {
                  const needType = (sub as any).needType ?? 'DEVELOPPEMENT'
                  const badge = needTypeBadge[needType] ?? needTypeBadge.DEVELOPPEMENT
                  return (
                    <tr key={sub.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(sub.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-white font-medium">
                          {sub.prospect.firstName} {sub.prospect.lastName}
                        </p>
                        <p className="text-xs text-gray-600">{sub.prospect.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit ${badge.className}`}>
                            {badge.label}
                          </span>
                          <span className="text-xs text-gray-500">
                            {sub.projectType.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-[#0066FF]">
                          {sub.completenessScore ?? 0}/100
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full
                          ${statusColors[sub.status] ?? 'bg-gray-500/10 text-gray-400'}`}>
                          {statusLabels[sub.status] ?? sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/soumissions/${sub.id}`}
                          className="text-xs text-[#0066FF] hover:text-white transition-colors"
                        >
                          Voir →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/admin/soumissions?page=${p}${status ? `&status=${status}` : ''}`}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm
                  ${page === p ? 'bg-[#0066FF] text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}