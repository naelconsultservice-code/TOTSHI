'use client'

import { useState, useRef, useEffect } from 'react'
import type { FormData } from './DiscoveryFlow'

type Props = {
  data: FormData
  onChange: (updates: Partial<FormData>) => void
  onNext: () => void
  locale: string
}

// Liste des indicatifs téléphoniques
const DIAL_CODES = [
  { code: 'AF', dial: '+93', flag: '🇦🇫', name: 'Afghanistan' },
  { code: 'DZ', dial: '+213', flag: '🇩🇿', name: 'Algérie' },
  { code: 'DE', dial: '+49', flag: '🇩🇪', name: 'Allemagne' },
  { code: 'SA', dial: '+966', flag: '🇸🇦', name: 'Arabie Saoudite' },
  { code: 'BE', dial: '+32', flag: '🇧🇪', name: 'Belgique' },
  { code: 'BJ', dial: '+229', flag: '🇧🇯', name: 'Bénin' },
  { code: 'BF', dial: '+226', flag: '🇧🇫', name: 'Burkina Faso' },
  { code: 'BI', dial: '+257', flag: '🇧🇮', name: 'Burundi' },
  { code: 'CM', dial: '+237', flag: '🇨🇲', name: 'Cameroun' },
  { code: 'CA', dial: '+1', flag: '🇨🇦', name: 'Canada' },
  { code: 'CF', dial: '+236', flag: '🇨🇫', name: 'Centrafrique' },
  { code: 'CN', dial: '+86', flag: '🇨🇳', name: 'Chine' },
  { code: 'CI', dial: '+225', flag: '🇨🇮', name: "Côte d'Ivoire" },
  { code: 'CD', dial: '+243', flag: '🇨🇩', name: 'RD Congo' },
  { code: 'CG', dial: '+242', flag: '🇨🇬', name: 'Congo' },
  { code: 'EG', dial: '+20', flag: '🇪🇬', name: 'Égypte' },
  { code: 'ES', dial: '+34', flag: '🇪🇸', name: 'Espagne' },
  { code: 'US', dial: '+1', flag: '🇺🇸', name: 'États-Unis' },
  { code: 'ET', dial: '+251', flag: '🇪🇹', name: 'Éthiopie' },
  { code: 'FR', dial: '+33', flag: '🇫🇷', name: 'France' },
  { code: 'GA', dial: '+241', flag: '🇬🇦', name: 'Gabon' },
  { code: 'GH', dial: '+233', flag: '🇬🇭', name: 'Ghana' },
  { code: 'GN', dial: '+224', flag: '🇬🇳', name: 'Guinée' },
  { code: 'IN', dial: '+91', flag: '🇮🇳', name: 'Inde' },
  { code: 'IT', dial: '+39', flag: '🇮🇹', name: 'Italie' },
  { code: 'JP', dial: '+81', flag: '🇯🇵', name: 'Japon' },
  { code: 'KE', dial: '+254', flag: '🇰🇪', name: 'Kenya' },
  { code: 'LB', dial: '+961', flag: '🇱🇧', name: 'Liban' },
  { code: 'LU', dial: '+352', flag: '🇱🇺', name: 'Luxembourg' },
  { code: 'MG', dial: '+261', flag: '🇲🇬', name: 'Madagascar' },
  { code: 'ML', dial: '+223', flag: '🇲🇱', name: 'Mali' },
  { code: 'MA', dial: '+212', flag: '🇲🇦', name: 'Maroc' },
  { code: 'MR', dial: '+222', flag: '🇲🇷', name: 'Mauritanie' },
  { code: 'MU', dial: '+230', flag: '🇲🇺', name: 'Maurice' },
  { code: 'MX', dial: '+52', flag: '🇲🇽', name: 'Mexique' },
  { code: 'NL', dial: '+31', flag: '🇳🇱', name: 'Pays-Bas' },
  { code: 'NE', dial: '+227', flag: '🇳🇪', name: 'Niger' },
  { code: 'NG', dial: '+234', flag: '🇳🇬', name: 'Nigéria' },
  { code: 'PT', dial: '+351', flag: '🇵🇹', name: 'Portugal' },
  { code: 'RW', dial: '+250', flag: '🇷🇼', name: 'Rwanda' },
  { code: 'SN', dial: '+221', flag: '🇸🇳', name: 'Sénégal' },
  { code: 'ZA', dial: '+27', flag: '🇿🇦', name: 'Afrique du Sud' },
  { code: 'CH', dial: '+41', flag: '🇨🇭', name: 'Suisse' },
  { code: 'TZ', dial: '+255', flag: '🇹🇿', name: 'Tanzanie' },
  { code: 'TD', dial: '+235', flag: '🇹🇩', name: 'Tchad' },
  { code: 'TG', dial: '+228', flag: '🇹🇬', name: 'Togo' },
  { code: 'TN', dial: '+216', flag: '🇹🇳', name: 'Tunisie' },
  { code: 'TR', dial: '+90', flag: '🇹🇷', name: 'Turquie' },
  { code: 'UG', dial: '+256', flag: '🇺🇬', name: 'Ouganda' },
  { code: 'GB', dial: '+44', flag: '🇬🇧', name: 'Royaume-Uni' },
]

// Liste des pays pour le sélecteur pays
const COUNTRIES = [
  'Afghanistan', 'Algérie', 'Allemagne', 'Angola', 'Arabie Saoudite',
  'Argentine', 'Australie', 'Autriche', 'Belgique', 'Bénin',
  'Brésil', 'Burkina Faso', 'Burundi', 'Cameroun', 'Canada',
  'Centrafrique', 'Chine', 'Colombie', "Côte d'Ivoire", 'RD Congo',
  'Congo', 'Égypte', 'Espagne', 'États-Unis', 'Éthiopie',
  'France', 'Gabon', 'Ghana', 'Grèce', 'Guinée',
  'Inde', 'Indonésie', 'Italie', 'Japon', 'Kenya',
  'Liban', 'Luxembourg', 'Madagascar', 'Mali', 'Maroc',
  'Mauritanie', 'Maurice', 'Mexique', 'Mozambique', 'Pays-Bas',
  'Niger', 'Nigéria', 'Ouganda', 'Pakistan', 'Portugal',
  'Roumanie', 'Royaume-Uni', 'Rwanda', 'Sénégal', 'Afrique du Sud',
  'Suisse', 'Tanzanie', 'Tchad', 'Togo', 'Tunisie',
  'Turquie', 'Ukraine', 'Autre',
].sort()

function CountryCodePicker({
  value, onChange, locale
}: { value: string; onChange: (v: string) => void; locale: string }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const selected = DIAL_CODES.find((d) => d.dial === value) ?? DIAL_CODES.find((d) => d.code === 'FR')!

  const filtered = DIAL_CODES.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.dial.includes(search)
  )

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 bg-white/5 border border-white/10
                   rounded-l-xl px-3 py-3 text-white hover:bg-white/8 transition-colors
                   h-full whitespace-nowrap"
      >
        <span className="text-lg">{selected.flag}</span>
        <span className="text-sm text-gray-300">{selected.dial}</span>
        <span className="text-gray-600 text-xs">▾</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-[#111118] border border-white/10
                        rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-2 border-b border-white/5">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={locale === 'fr' ? 'Rechercher...' : 'Search...'}
              className="w-full bg-white/5 rounded-lg px-3 py-2 text-white text-sm
                         placeholder-gray-600 focus:outline-none"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto max-h-52">
            {filtered.map((d) => (
              <button
                key={d.code}
                type="button"
                onClick={() => { onChange(d.dial); setOpen(false); setSearch('') }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300
                           hover:bg-white/5 transition-colors text-left"
              >
                <span className="text-base">{d.flag}</span>
                <span className="flex-1">{d.name}</span>
                <span className="text-gray-600">{d.dial}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function CountrySelector({
  value, onChange, locale
}: { value: string; onChange: (v: string) => void; locale: string }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const filtered = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => { setOpen(!open); setSearch('') }}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                   text-left transition-colors hover:bg-white/8 focus:outline-none
                   focus:border-[#0066FF]/50"
      >
        <span className={value ? 'text-white' : 'text-gray-600'}>
          {value || (locale === 'fr' ? 'Sélectionner votre pays...' : 'Select your country...')}
        </span>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#111118] border border-white/10
                        rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-2 border-b border-white/5">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={locale === 'fr' ? 'Rechercher un pays...' : 'Search country...'}
              className="w-full bg-white/5 rounded-lg px-3 py-2 text-white text-sm
                         placeholder-gray-600 focus:outline-none"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto max-h-52">
            {filtered.map((country) => (
              <button
                key={country}
                type="button"
                onClick={() => { onChange(country); setOpen(false) }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                  ${value === country
                    ? 'bg-[#0066FF]/10 text-[#0066FF]'
                    : 'text-gray-300 hover:bg-white/5'
                  }`}
              >
                {country}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function StepIdentification({ data, onChange, onNext, locale }: Props) {
  const fr = locale === 'fr'
  const [dialCode, setDialCode] = useState('+33')
  const [phoneNumber, setPhoneNumber] = useState('')

  useEffect(() => {
    if (data.phone) {
      const match = DIAL_CODES.find((d) => data.phone.startsWith(d.dial))
      if (match) {
        setDialCode(match.dial)
        setPhoneNumber(data.phone.slice(match.dial.length).trim())
      }
    }
  }, [])

  function handlePhoneChange(number: string) {
    setPhoneNumber(number)
    onChange({ phone: number ? `${dialCode} ${number}` : '' })
  }

  function handleDialChange(dial: string) {
    setDialCode(dial)
    onChange({ phone: phoneNumber ? `${dial} ${phoneNumber}` : '' })
  }

  function validate() {
    return (
      data.firstName.trim().length >= 2 &&
      data.lastName.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) &&
      data.country.trim().length >= 2 &&
      data.sector.trim().length >= 2
    )
  }

  const inputClass = `w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
    text-white placeholder-gray-600 focus:outline-none
    focus:border-[#0066FF]/50 transition-colors`

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-2">
        {fr ? 'Vos informations' : 'Your information'}
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        {fr ? 'Ces informations nous permettent de vous recontacter.' : 'This information allows us to get back to you.'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">
            {fr ? 'Prénom' : 'First name'} *
          </label>
          <input
            type="text"
            value={data.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            className={inputClass}
            placeholder=""
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">
            {fr ? 'Nom' : 'Last name'} *
          </label>
          <input
            type="text"
            value={data.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            className={inputClass}
            placeholder=""
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1.5">Email *</label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
          className={inputClass}
          placeholder=""
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">
            {fr ? 'Téléphone' : 'Phone'} ({fr ? 'optionnel' : 'optional'})
          </label>
          <div className="flex">
            <CountryCodePicker
              value={dialCode}
              onChange={handleDialChange}
              locale={locale}
            />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className="flex-1 bg-white/5 border border-l-0 border-white/10 rounded-r-xl
                         px-4 py-3 text-white placeholder-gray-600 focus:outline-none
                         focus:border-[#0066FF]/50 transition-colors"
              placeholder={fr ? 'Numéro' : 'Number'}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">
            {fr ? 'Entreprise' : 'Company'} ({fr ? 'optionnel' : 'optional'})
          </label>
          <input
            type="text"
            value={data.company}
            onChange={(e) => onChange({ company: e.target.value })}
            className={inputClass}
            placeholder=""
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">
            {fr ? 'Pays' : 'Country'} *
          </label>
          <CountrySelector
            value={data.country}
            onChange={(v) => onChange({ country: v })}
            locale={locale}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">
            {fr ? "Secteur d'activité" : 'Industry'} *
          </label>
          <input
            type="text"
            value={data.sector}
            onChange={(e) => onChange({ sector: e.target.value })}
            className={inputClass}
            placeholder={fr ? 'Ex: Finance, Santé, Retail...' : 'Ex: Finance, Health, Retail...'}
          />
        </div>
      </div>

      {/* Honeypot invisible */}
      <input
        type="text"
        value={data._hp}
        onChange={(e) => onChange({ _hp: e.target.value })}
        style={{ display: 'none' }}
        tabIndex={-1}
        aria-hidden="true"
      />

      <button
        onClick={onNext}
        disabled={!validate()}
        className="w-full bg-[#0066FF] hover:bg-[#0052CC] disabled:opacity-40
                   disabled:cursor-not-allowed text-white font-semibold py-3
                   rounded-xl transition-colors"
      >
        {fr ? 'Continuer →' : 'Continue →'}
      </button>
    </div>
  )
}