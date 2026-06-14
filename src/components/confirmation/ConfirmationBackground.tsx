'use client'

import { useEffect, useRef } from 'react'

export default function ConfirmationBackground() {
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

    const w = () => canvas.width
    const h = () => canvas.height

    // Noeuds réseau (network nodes)
    const nodeCount = 22
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.5 + 1.5,
      pulse: Math.random() * Math.PI * 2,
    }))

    // Paquets de données voyageant le long des connexions
    type Packet = { from: number; to: number; progress: number; speed: number }
    let packets: Packet[] = []

    const spawnPacket = () => {
      const from = Math.floor(Math.random() * nodeCount)
      const to = Math.floor(Math.random() * nodeCount)
      if (from !== to) {
        packets.push({ from, to, progress: 0, speed: 0.006 + Math.random() * 0.01 })
      }
    }

    // Lignes de grille verticales (effet "data stream")
    const streams = Array.from({ length: 8 }, (_, i) => ({
      x: (window.innerWidth / 8) * i + Math.random() * 60,
      offset: Math.random() * 1000,
      speed: 0.5 + Math.random() * 0.8,
      opacity: 0.03 + Math.random() * 0.04,
    }))

    let frame = 0

    const draw = () => {
      animId = requestAnimationFrame(draw)
      t += 0.005
      frame++
      ctx.clearRect(0, 0, w(), h())

      const W = w()
      const H = h()

      // Glow central — point d'origine "succès"
      const cx = W * 0.5
      const cy = H * 0.32
      const coreGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.55)
      coreGrd.addColorStop(0, 'rgba(0,102,255,0.12)')
      coreGrd.addColorStop(0.4, 'rgba(0,80,200,0.05)')
      coreGrd.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = coreGrd
      ctx.fillRect(0, 0, W, H)

      // Grille de fond subtile
      const gridSize = 64
      ctx.strokeStyle = 'rgba(0,102,255,0.025)'
      ctx.lineWidth = 1
      for (let x = 0; x < W; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, H)
        ctx.stroke()
      }
      for (let y = 0; y < H; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(W, y)
        ctx.stroke()
      }

      // Flux verticaux lumineux (data streams)
      streams.forEach((s) => {
        s.offset += s.speed
        const grad = ctx.createLinearGradient(s.x, 0, s.x, H)
        const pos = (s.offset % 200) / 200
        grad.addColorStop(Math.max(0, pos - 0.15), 'rgba(0,102,255,0)')
        grad.addColorStop(pos, `rgba(0,153,255,${s.opacity * 4})`)
        grad.addColorStop(Math.min(1, pos + 0.15), 'rgba(0,102,255,0)')
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(s.x, 0)
        ctx.lineTo(s.x, H)
        ctx.stroke()
      })

      // Anneaux orbitaux concentriques autour du centre
      for (let i = 0; i < 3; i++) {
        const radius = 90 + i * 70
        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0,102,255,${0.06 - i * 0.015})`
        ctx.lineWidth = 1
        ctx.stroke()

        // Point lumineux qui orbite
        const angle = t * (0.6 - i * 0.15) + i * 2
        const px = cx + Math.cos(angle) * radius
        const py = cy + Math.sin(angle) * radius * 0.6
        const dotGrd = ctx.createRadialGradient(px, py, 0, px, py, 8)
        dotGrd.addColorStop(0, 'rgba(80,180,255,0.9)')
        dotGrd.addColorStop(1, 'rgba(0,102,255,0)')
        ctx.beginPath()
        ctx.arc(px, py, 8, 0, Math.PI * 2)
        ctx.fillStyle = dotGrd
        ctx.fill()
      }

      // Coeur central pulsant
      const pulse = 1 + Math.sin(t * 2) * 0.15
      const coreSize = 5 * pulse
      const innerGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreSize * 4)
      innerGrd.addColorStop(0, 'rgba(120,200,255,1)')
      innerGrd.addColorStop(0.3, 'rgba(0,102,255,0.6)')
      innerGrd.addColorStop(1, 'rgba(0,102,255,0)')
      ctx.beginPath()
      ctx.arc(cx, cy, coreSize * 4, 0, Math.PI * 2)
      ctx.fillStyle = innerGrd
      ctx.fill()
      ctx.beginPath()
      ctx.arc(cx, cy, coreSize, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(200,230,255,1)'
      ctx.fill()

      // Mise à jour et dessin des noeuds réseau
      nodes.forEach((n) => {
        n.x += n.vx
        n.y += n.vy
        n.pulse += 0.04
        if (n.x < 0 || n.x > W) n.vx *= -1
        if (n.y < 0 || n.y > H) n.vy *= -1

        const glow = 0.4 + Math.sin(n.pulse) * 0.3
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,153,255,${0.5 + glow * 0.3})`
        ctx.fill()
      })

      // Connexions entre noeuds proches
      nodes.forEach((a, i) => {
        nodes.slice(i + 1).forEach((b) => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist < 180) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(0,102,255,${0.06 * (1 - dist / 180)})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        })
      })

      // Spawn de paquets de données
      if (frame % 25 === 0 && packets.length < 12) {
        spawnPacket()
      }

      // Dessin des paquets voyageant
      packets = packets.filter((p) => p.progress <= 1)
      packets.forEach((p) => {
        p.progress += p.speed
        const a = nodes[p.from]
        const b = nodes[p.to]
        if (!a || !b) return
        const x = a.x + (b.x - a.x) * p.progress
        const y = a.y + (b.y - a.y) * p.progress
        const fade = Math.sin(p.progress * Math.PI)

        const pktGrd = ctx.createRadialGradient(x, y, 0, x, y, 5)
        pktGrd.addColorStop(0, `rgba(120,200,255,${fade})`)
        pktGrd.addColorStop(1, 'rgba(0,102,255,0)')
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, Math.PI * 2)
        ctx.fillStyle = pktGrd
        ctx.fill()
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