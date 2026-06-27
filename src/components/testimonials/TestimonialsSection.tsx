import { prisma } from '@/lib/prisma'

type Props = {
  locale: string
}

const STARS = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

export default async function TestimonialsSection({ locale }: Props) {
  const isFr = locale === 'fr'

  let testimonials: any[] = []
  try {
    testimonials = await prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: 'asc' },
      take: 6,
    })
  } catch {
    return null
  }

  if (testimonials.length === 0) return null

  return (
    <section className="py-28 px-6 lg:px-8 bg-white/[0.015] border-y border-white/5">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-[#0066FF] uppercase tracking-widest mb-4">
            {isFr ? 'Ce que disent nos clients' : 'What our clients say'}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5">
            {isFr ? 'Ils nous font confiance' : 'They trust us'}
          </h2>
          <p className="text-[#8892A4] text-lg max-w-xl mx-auto leading-relaxed">
            {isFr
              ? 'Des résultats concrets pour des clients réels.'
              : 'Concrete results for real clients.'}
          </p>
        </div>

        {/* Grille */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white/[0.025] border border-white/[0.07] rounded-2xl p-6
                         hover:border-[#0066FF]/20 hover:bg-white/[0.04] transition-all duration-300
                         flex flex-col"
            >
              {/* Étoiles */}
              <div className="text-yellow-400 text-sm mb-4">{STARS(t.rating)}</div>

              {/* Contenu */}
              <p className="text-[#8892A4] text-sm leading-relaxed flex-1 mb-5">
                &ldquo;{isFr ? t.contentFr : t.contentEn}&rdquo;
              </p>

              {/* Client */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                {t.clientAvatarUrl ? (
                  <img
                    src={t.clientAvatarUrl}
                    alt={t.clientName}
                    className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div
                    className="w-9 h-9 rounded-full bg-[#0066FF]/15 flex items-center
                                justify-center text-[#0066FF] font-bold text-sm flex-shrink-0"
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
    </section>
  )
}