import { prisma } from '@/lib/prisma'

type Props = {
  projectSlug: string
  locale: string
}

const STARS = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

export default async function ProjectTestimonials({ projectSlug, locale }: Props) {
  const isFr = locale === 'fr'

  let testimonials: any[] = []
  try {
    testimonials = await prisma.testimonial.findMany({
      where: { isPublished: true, projectSlug },
      orderBy: { displayOrder: 'asc' },
    })
  } catch {
    return null
  }

  if (testimonials.length === 0) return null

  return (
    <div className="mt-6">
      <h2 className="text-[#0066FF] text-xs font-semibold uppercase tracking-wide mb-4">
        {isFr ? 'Témoignages clients' : 'Client testimonials'}
      </h2>
      <div className="flex flex-col gap-4">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-white/3 border border-white/8 rounded-2xl p-5"
          >
            <div className="text-yellow-400 text-xs mb-3">{STARS(t.rating)}</div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              &ldquo;{isFr ? t.contentFr : t.contentEn}&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-white/5">
              {t.clientAvatarUrl ? (
                <img
                  src={t.clientAvatarUrl}
                  alt={t.clientName}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full bg-[#0066FF]/15 flex items-center
                              justify-center text-[#0066FF] font-bold text-xs flex-shrink-0"
                >
                  {t.clientName.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-white font-semibold text-sm">{t.clientName}</p>
                {(t.clientRole || t.clientCompany) && (
                  <p className="text-gray-600 text-xs">
                    {[t.clientRole, t.clientCompany].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}