'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import fr from '@/i18n/fr.json'
import en from '@/i18n/en.json'

export default function Navbar({ locale }: { locale: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const t = locale === 'fr' ? fr : en
  const otherLocale = locale === 'fr' ? 'en' : 'fr'
  const newPath = pathname.replace(`/${locale}`, `/${otherLocale}`)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: `/${locale}`, label: t.nav.home },
    { href: `/${locale}/services`, label: t.nav.services },
    { href: `/${locale}/realisations`, label: t.nav.portfolio },
    { href: `/${locale}/a-propos`, label: t.nav.about },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#060610]/95 backdrop-blur-xl border-b border-white/5 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <span className="text-xl font-black text-white tracking-tight">
              TOT<span className="text-[#0066FF]">SHI</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive ? 'text-white' : 'text-[#8892A4] hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-5">
            <Link
              href={newPath}
              className="text-xs font-semibold text-[#4A5568] hover:text-[#8892A4]
                         transition-colors uppercase tracking-wider"
            >
              {otherLocale}
            </Link>
            <Link
              href={`/${locale}/demarrer-mon-projet`}
              className="relative inline-flex items-center gap-2 bg-[#0066FF] hover:bg-[#0052CC]
                         text-white text-sm font-semibold px-5 py-2.5 rounded-xl
                         transition-all hover:shadow-lg hover:shadow-[#0066FF]/25
                         hover:-translate-y-0.5"
            >
              {t.nav.startProject}
              <span className="text-xs opacity-70">→</span>
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5"
          >
            <span className={`block h-0.5 bg-white transition-all ${menuOpen ? 'w-5 rotate-45 translate-y-2' : 'w-5'}`} />
            <span className={`block h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0 w-0' : 'w-4'}`} />
            <span className={`block h-0.5 bg-white transition-all ${menuOpen ? 'w-5 -rotate-45 -translate-y-2' : 'w-5'}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/5 pt-4 flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-[#8892A4] hover:text-white transition-colors text-sm font-medium py-1"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 pt-2">
              <Link href={newPath} className="text-xs text-[#4A5568] uppercase font-semibold">
                {otherLocale}
              </Link>
              <Link
                href={`/${locale}/demarrer-mon-projet`}
                onClick={() => setMenuOpen(false)}
                className="bg-[#0066FF] text-white text-sm font-semibold px-4 py-2 rounded-xl flex-1 text-center"
              >
                {t.nav.startProject}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}