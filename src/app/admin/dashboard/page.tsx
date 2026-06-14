import { getDashboardStats } from '@/services/submission.service'
import Link from 'next/link'
import AdminShell from '@/components/admin/AdminShell'
export const dynamic = 'force-dynamic'

const statusLabels: Record<string, string> = {
  NOUVEAU: 'Nouveau', EN_COURS: 'En cours', BRIEF_ENVOYE: 'Brief envoyé',
  EN_ATTENTE_CLIENT: 'En attente client', PROPOSITION_ENVOYEE: 'Proposition envoyée',
  CONFIRME: 'Confirmé', NON_QUALIFIE: 'Non qualifié', ARCHIVE: 'Archivé',
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <AdminShell>
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Vue d'ensemble</h1>
          <p className="text-gray-500 mt-1">Tableau de bord TOTSHI</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
            <p className="text-gray-500 text-sm mb-1">Total soumissions</p>
            <p className="text-4xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
            <p className="text-gray-500 text-sm mb-1">7 derniers jours</p>
            <p className="text-4xl font-bold text-[#0066FF]">{stats.last7Days}</p>
          </div>
          <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
            <p className="text-gray-500 text-sm mb-1">Type le plus demandé</p>
            <p className="text-lg font-bold text-white">
              {stats.topProjectType ? stats.topProjectType.replace(/_/g, ' ') : '—'}
            </p>
          </div>
        </div>

        <div className="bg-white/3 border border-white/8 rounded-2xl p-6 mb-8">
          <h2 className="text-white font-semibold mb-4">Par statut</h2>
          <div className="flex flex-col gap-3">
            {stats.byStatus.length === 0 ? (
              <p className="text-gray-600 text-sm">Aucune soumission</p>
            ) : (
              stats.byStatus.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">
                    {statusLabels[item.status] ?? item.status}
                  </span>
                  <span className="bg-[#0066FF]/10 text-[#0066FF] text-sm
                                   font-semibold px-3 py-1 rounded-full">
                    {item._count.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <Link
          href="/admin/soumissions"
          className="inline-flex items-center gap-2 bg-[#0066FF] hover:bg-[#0052CC]
                     text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Voir toutes les soumissions →
        </Link>
      </div>
    </AdminShell>
  )
}