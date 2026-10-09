'use client'

import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  rotation: number
  vr: number
  color: string
  shape: 'rect' | 'circle'
  life: number
}

const COLORS = [
  '#fda4af', '#f9a8d4', '#f0abfc', '#fcd34d', '#fde68a',
  '#fbcfe8', '#fff', '#fb7185',
]

/** Canvas-based confetti — enhanced version dari Perfect 2 (80 particles). */
export function Confetti({ trigger }: { trigger: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number | null>(null)
  const activeRef = useRef(false)

  useEffect(() => {
    if (!trigger) return
    activeRef.current = true
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // Spawn 80 confetti particles
    for (let i = 0; i < 80; i++) {
      particlesRef.current.push({
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * 100,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 4 + 3,
        size: Math.random() * 10 + 5,
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
        life: 1,
      })
    }

    const render = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      const arr = particlesRef.current
      const next: Particle[] = []
      for (let i = 0; i < arr.length; i++) {
        const p = arr[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.08
        p.vx *= 0.995
        p.rotation += p.vr
        if (p.y > h + 20) {
          p.life -= 0.05
        }
        if (p.life > 0) {
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rotation)
          ctx.globalAlpha = Math.max(p.life, 0)
          ctx.fillStyle = p.color
          if (p.shape === 'rect') {
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
          } else {
            ctx.beginPath()
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
            ctx.fill()
          }
          ctx.restore()
          next.push(p)
        }
      }
      particlesRef.current = next

      if (activeRef.current && next.length > 0) {
        rafRef.current = requestAnimationFrame(render)
      } else {
        activeRef.current = false
      }
    }
    rafRef.current = requestAnimationFrame(render)

    // Auto-stop after 6 seconds
    const stopTimer = setTimeout(() => {
      activeRef.current = false
    }, 6000)

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      clearTimeout(stopTimer)
      activeRef.current = false
    }
  }, [trigger])

  if (!trigger) return null
  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[60]"
      aria-hidden
    />
  )
}
