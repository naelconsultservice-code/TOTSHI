'use client'

import { useState, useEffect, useRef } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let t = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 180 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.8 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.4 + 0.1,
    }))

    const draw = () => {
      animId = requestAnimationFrame(draw)
      t += 0.006
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const cx = canvas.width * 0.72
      const cy = canvas.height * 0.5

      // Orbites elliptiques
      for (let i = 0; i < 4; i++) {
        const angle = t * (0.35 + i * 0.12) + (i * Math.PI) / 2
        const rx = 200 + i * 55
        const ry = 120 + i * 30
        ctx.beginPath()
        ctx.ellipse(cx, cy, rx, ry, angle * 0.25, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0, 102, 255, ${0.12 - i * 0.02})`
        ctx.lineWidth = 1
        ctx.stroke()

        // Point orbital lumineux
        const dx = cx + Math.cos(angle) * rx
        const dy = cy + Math.sin(angle) * ry
        const grd = ctx.createRadialGradient(dx, dy, 0, dx, dy, 6)
        grd.addColorStop(0, `rgba(0, 180, 255, ${0.9 - i * 0.15})`)
        grd.addColorStop(1, 'rgba(0,102,255,0)')
        ctx.beginPath()
        ctx.arc(dx, dy, 6, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()
      }

      // Globe wireframe
      const R = 130
      for (let lat = -5; lat <= 5; lat++) {
        const y = (lat / 5) * R
        const r = Math.sqrt(Math.max(0, R * R - y * y))
        ctx.beginPath()
        ctx.ellipse(cx, cy + y * 0.4, r, r * 0.35, t * 0.05, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0, 102, 255, ${0.1 + Math.abs(lat) * 0.01})`
        ctx.lineWidth = 0.7
        ctx.stroke()
      }

      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI + t * 0.12
        ctx.beginPath()
        ctx.ellipse(cx, cy, R * Math.abs(Math.sin(a + 0.1)), R * 0.45, a, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0, 102, 255, ${0.06 + Math.abs(Math.cos(a)) * 0.06})`
        ctx.lineWidth = 0.7
        ctx.stroke()
      }

      // Glow central
      const glowGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 180)
      glowGrd.addColorStop(0, 'rgba(0,102,255,0.08)')
      glowGrd.addColorStop(0.5, 'rgba(0,60,180,0.04)')
      glowGrd.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.beginPath()
      ctx.arc(cx, cy, 180, 0, Math.PI * 2)
      ctx.fillStyle = glowGrd
      ctx.fill()

      // Point central
      const coreGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 12)
      coreGrd.addColorStop(0, 'rgba(80,180,255,1)')
      coreGrd.addColorStop(1, 'rgba(0,102,255,0)')
      ctx.beginPath()
      ctx.arc(cx, cy, 12, 0, Math.PI * 2)
      ctx.fillStyle = coreGrd
      ctx.fill()

      // Particules
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 102, 255, ${p.opacity})`
        ctx.fill()
      })

      // Lignes de connexion entre particules proches
      particles.forEach((p, i) => {
        particles.slice(i + 1, i + 4).forEach((q) => {
          const dist = Math.hypot(p.x - q.x, p.y - q.y)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(0,102,255,${0.06 * (1 - dist / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
    />
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError(
        result.error === 'ACCOUNT_LOCKED'
          ? 'Compte bloqué. Réessayez dans 15 minutes.'
          : 'Email ou mot de passe incorrect.'
      )
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070710', position: 'relative' }}>

      {/* Animation plein écran */}
      <AnimatedBackground />

      {/* Overlay sombre pour lisibilité */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse at 70% 50%, rgba(0,0,0,0) 0%, rgba(7,7,16,0.5) 60%)',
        pointerEvents: 'none',
      }} />

      {/* Formulaire centré */}
      <div style={{
        position: 'relative', zIndex: 10,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '48px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'rgba(10, 10, 20, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,102,255,0.06)',
        }}>

          {/* Logo */}
          <div style={{ marginBottom: '36px' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: 'white', letterSpacing: '-0.5px' }}>
              TOT<span style={{ color: '#0066FF' }}>SHI</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '5px' }}>
              <div style={{
                width: '6px', height: '6px', borderRadius: '50%',
                backgroundColor: '#0066FF',
              }} />
              <span style={{ color: '#6b7280', fontSize: '12px' }}>Espace administrateur</span>
            </div>
          </div>

          {/* Titre */}
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'white', margin: '0 0 5px' }}>
              Connexion
            </h1>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
              Accès réservé à l'équipe TOTSHI.
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '6px' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '11px 15px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(0,102,255,0.6)'
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.08)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: '13px', marginBottom: '6px' }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '11px 15px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(0,102,255,0.6)'
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.08)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'
                }}
              />
            </div>

            {error && (
              <div style={{
                backgroundColor: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '10px',
                padding: '10px 14px',
                color: '#f87171',
                fontSize: '13px',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading
                  ? 'linear-gradient(135deg, #0052CC, #003399)'
                  : 'linear-gradient(135deg, #0066FF, #0044CC)',
                color: 'white',
                fontWeight: '600',
                fontSize: '14px',
                padding: '13px',
                borderRadius: '12px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 20px rgba(0,102,255,0.3)',
                transition: 'all 0.2s',
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '14px', height: '14px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                  }} />
                  Connexion...
                </>
              ) : 'Se connecter →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#374151', fontSize: '11px', marginTop: '28px', marginBottom: 0 }}>
            © {new Date().getFullYear()} TOTSHI — Accès sécurisé
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}