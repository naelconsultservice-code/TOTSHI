'use client'


export default function CalendlyEmbed({ locale }: { locale: string }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]">
      <iframe
        src={`https://calendly.com/itumbafelly/30min?hide_event_type_details=1&hide_gdpr_banner=1&locale=${locale === 'fr' ? 'fr' : 'en'}`}
        width="100%"
        height="700"
        frameBorder="0"
        title="Calendly"
        style={{ minHeight: '700px' }}
      />
    </div>
  )
}