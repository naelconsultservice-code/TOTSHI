import Link from 'next/link'

export default function AdminShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#0A0A0F]">
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0D0D15]
                        border-r border-white/5 flex flex-col z-10">
        <div className="p-6 border-b border-white/5">
          <span className="text-xl font-bold text-white">
            TOT<span className="text-[#0066FF]">SHI</span>
          </span>
          <p className="text-xs text-gray-600 mt-1">Dashboard Admin</p>
        </div>

<nav className="flex-1 p-4 flex flex-col gap-1">
          // Remplace le tableau des liens nav existant par celui-ci :
{[
  { href: '/admin/dashboard', icon: '📊', label: "Vue d'ensemble" },
  { href: '/admin/soumissions', icon: '📋', label: 'Soumissions' },
  { href: '/admin/realisations', icon: '🎨', label: 'Réalisations' },
  { href: '/admin/articles', icon: '📝', label: 'Articles' },
  { href: '/admin/testimonials', icon: '💬', label: 'Témoignages' },  // ← AJOUTER
].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500
                         hover:text-white hover:bg-white/5 transition-all text-sm"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600
                       hover:text-red-400 hover:bg-red-500/5 transition-all text-sm w-full"
          >
            <span>🚪</span>
            <span>Déconnexion</span>
          </Link>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-8 min-h-screen text-white">
        {children}
      </main>
    </div>
  )
}