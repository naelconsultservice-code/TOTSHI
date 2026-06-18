import { getSubmissionDetail } from '@/services/submission.service'
import { notFound } from 'next/navigation'
import StatusUpdater from './StatusUpdater'
import NoteAdder from './NoteAdder'
import RegenerateButton from './RegenerateButton'

export default async function SubmissionDetailPage({
  params,
}: {
  params: { id: string }
}) {
  let submission
  try {
    submission = await getSubmissionDetail(params.id)
  } catch {
    notFound()
  }

  const brief = submission.documents.find((d) => d.type === 'BRIEF')
  const draft = submission.documents.find((d) => d.type === 'DRAFT_CDC')

  const targetUsers = submission.targetUsers as any
  const features = submission.features as any
  const constraints = submission.constraints as any

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-gray-600 text-sm mb-1">
            #{submission.id.slice(0, 8).toUpperCase()}
          </p>
          <h1 className="text-2xl font-bold text-white">
            {submission.prospect.firstName} {submission.prospect.lastName}
          </h1>
          <p className="text-gray-500 mt-1">
            {submission.projectType.replace(/_/g, ' ')} ·{' '}
            {new Date(submission.createdAt).toLocaleDateString('fr-FR')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#0066FF] font-semibold">
            Score: {submission.completenessScore ?? 0}/100
          </span>
          <RegenerateButton submissionId={submission.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left column */}
        <div className="lg:col-span-1 flex flex-col gap-4">

          {/* Prospect info */}
          <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4 text-sm">Prospect</h2>
            <div className="flex flex-col gap-2 text-sm">
              {[
                { label: 'Email', value: submission.prospect.email },
                { label: 'Téléphone', value: submission.prospect.phone ?? '—' },
                { label: 'Entreprise', value: submission.prospect.company ?? '—' },
                { label: 'Pays', value: submission.prospect.country },
                { label: 'Secteur', value: submission.prospect.sector },
                { label: 'Langue', value: submission.prospect.language.toUpperCase() },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-2">
                  <span className="text-gray-600">{label}</span>
                  <span className="text-gray-300 text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4 text-sm">Statut</h2>
            <StatusUpdater
              submissionId={submission.id}
              currentStatus={submission.status}
            />
          </div>

          {/* Status history */}
          <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4 text-sm">Historique</h2>
            <div className="flex flex-col gap-2">
              {submission.statusHistory.map((h) => (
                <div key={h.id} className="text-xs text-gray-600">
                  <span className="text-gray-400">{h.toStatus}</span>
                  {' · '}
                  {new Date(h.createdAt).toLocaleDateString('fr-FR')}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4 text-sm">Notes internes</h2>
            <div className="flex flex-col gap-2 mb-4">
              {submission.notes.length === 0 ? (
                <p className="text-gray-600 text-xs">Aucune note</p>
              ) : (
                submission.notes.map((note) => (
                  <div key={note.id} className="bg-white/3 rounded-xl p-3">
                    <p className="text-gray-300 text-xs leading-relaxed">
                      {note.content}
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                      {new Date(note.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                ))
              )}
            </div>
            <NoteAdder submissionId={submission.id} />
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Project details */}
          <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4 text-sm">Description du projet</h2>
            <p className="text-gray-300 text-sm leading-relaxed">{submission.description}</p>
          </div>

          {/* Target users */}
          <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4 text-sm">Utilisateurs cibles</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Profil', value: targetUsers?.profile },
                { label: 'Volume', value: targetUsers?.estimatedVolume },
                { label: 'Géographie', value: targetUsers?.geography },
                { label: 'Niveau tech', value: targetUsers?.techLevel },
                { label: 'Type accès', value: targetUsers?.accessType },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-gray-600 text-xs mb-1">{label}</p>
                  <p className="text-gray-300">{value || '—'}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          {features?.selected?.length > 0 && (
            <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
              <h2 className="text-white font-semibold mb-4 text-sm">Fonctionnalités</h2>
              <div className="flex flex-wrap gap-2">
                {features.selected.map((f: any) => (
                  <span
                    key={f.id}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium
                      ${f.priority === 'indispensable'
                        ? 'bg-green-500/10 text-green-400'
                        : f.priority === 'souhaitable'
                        ? 'bg-yellow-500/10 text-yellow-400'
                        : 'bg-gray-500/10 text-gray-400'
                      }`}
                  >
                    {f.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Constraints */}
          <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4 text-sm">Contraintes</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Budget', value: constraints?.budget },
                { label: 'Délai', value: constraints?.timeline },
                { label: 'Urgence', value: constraints?.urgencyLevel },
                { label: 'Système actuel', value: constraints?.currentSystem },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-gray-600 text-xs mb-1">{label}</p>
                  <p className="text-gray-300">{value || '—'}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Brief */}
          {brief && (
            <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
              <h2 className="text-white font-semibold mb-4 text-sm">Brief structuré</h2>
              <pre className="text-xs text-gray-400 whitespace-pre-wrap leading-relaxed
                              bg-black/20 rounded-xl p-4 overflow-auto max-h-64">
                {brief.content}
              </pre>
            </div>
          )}

          {/* Draft CDC */}
          {draft && (
            <div className="bg-[#0066FF]/5 border border-[#0066FF]/20 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold text-sm">
                  Ébauche CDC — v{draft.version}
                </h2>
                <span className={`text-xs px-2 py-1 rounded-full
                  ${draft.generationStatus === 'COMPLETED'
                    ? 'bg-green-500/10 text-green-400'
                    : draft.generationStatus === 'GENERATING'
                    ? 'bg-yellow-500/10 text-yellow-400'
                    : 'bg-red-500/10 text-red-400'
                  }`}>
                  {draft.generationStatus}
                </span>
              </div>
              {draft.generationStatus === 'COMPLETED' && (
                <pre className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed
                                bg-black/20 rounded-xl p-4 overflow-auto max-h-96">
                  {draft.content}
                </pre>
              )}
              {draft.generationStatus === 'FAILED' && (
                <p className="text-red-400 text-sm">{draft.errorMessage}</p>
              )}
              {draft.generationStatus === 'PROCESSING' && (
                <p className="text-yellow-400 text-sm">Génération en cours...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}