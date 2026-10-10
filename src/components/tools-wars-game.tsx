'use client'

import { useCallback, useEffect, useState } from 'react'
import { Swords, RotateCcw, Trophy, Gamepad2, Sparkles } from 'lucide-react'

type Weapon = 'shield' | 'daggers' | 'scythe' | 'wand'
type Fighter = {
  x: number; y: number; vx: number; vy: number; hp: number; maxHp: number; radius: number
  cooldown: number; flash: number; facing: number; weapon: Weapon; color: string
  name: string; side: 'left' | 'right'
}
type Shot = { x: number; y: number; vx: number; vy: number; life: number; owner: 'left' | 'right'; color: string; radius: number }
const WEAPONS: Record<Weapon, { label: string; icon: string; color: string; damage: number; reach: number; speed: number; description: string }> = {
  shield: { label: 'Shield', icon: '🛡️', color: '#5dd6ff', damage: 13, reach: 74, speed: 5.2, description: 'Tahan serangan, lalu dorong lawan dengan bash.' },
  daggers: { label: 'Daggers', icon: '🗡️', color: '#ff5b8a', damage: 8, reach: 65, speed: 8.2, description: 'Gerakan cepat dan combo jarak dekat.' },
  scythe: { label: 'Scythe', icon: '⚔️', color: '#c084fc', damage: 18, reach: 112, speed: 4.7, description: 'Sabetan lebar dengan jangkauan panjang.' },
  wand: { label: 'Wand', icon: '🪄', color: '#ffc857', damage: 11, reach: 250, speed: 5.5, description: 'Tembakkan orb sihir dari jarak jauh.' },
}
const OPTIONS: Weapon[] = ['shield', 'daggers', 'scythe', 'wand']

export default function ToolsWarsGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [leftWeapon, setLeftWeapon] = useState<Weapon>('shield')
  const [rightWeapon, setRightWeapon] = useState<Weapon>('daggers')
  const [leftColor, setLeftColor] = useState('#36d7ff')
  const [rightColor, setRightColor] = useState('#ff4f91')
  const [leftName, setLeftName] = useState('NOVA')
  const [rightName, setRightName] = useState('RAVEN')
  const [leftRadius, setLeftRadius] = useState(27)
  const [rightRadius, setRightRadius] = useState(27)
  const [playing, setPlaying] = useState(true)
  const [roundKey, setRoundKey] = useState(0)
  const [winner, setWinner] = useState<string | null>(null)
  const [leftHp, setLeftHp] = useState(100)
  const [rightHp, setRightHp] = useState(100)

  const resetRound = useCallback(() => {
    setWinner(null)
    setLeftHp(100)
    setRightHp(100)
    setRoundKey((n) => n + 1)
    setPlaying(true)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf = 0
    let last = 0
    let frame = 0
    let left: Fighter = { x: 0, y: 0, vx: 3.1, vy: -2, hp: 100, maxHp: 100, radius: leftRadius, cooldown: 0, flash: 0, facing: 1, weapon: leftWeapon, color: leftColor, name: leftName || 'NOVA', side: 'left' }
    let right: Fighter = { x: 0, y: 0, vx: -3.1, vy: -1, hp: 100, maxHp: 100, radius: rightRadius, cooldown: 0, flash: 0, facing: -1, weapon: rightWeapon, color: rightColor, name: rightName || 'RAVEN', side: 'right' }
    let shots: Shot[] = []
    let ended = false
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(rect.width * dpr))
      canvas.height = Math.max(1, Math.floor(rect.height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      left.x = rect.width * 0.27; right.x = rect.width * 0.73
      left.y = right.y = rect.height * 0.47
    }
    resize()
    window.addEventListener('resize', resize)
    const drawWeapon = (f: Fighter, t: number) => {
      ctx.save(); ctx.translate(f.x, f.y); ctx.scale(f.facing, 1)
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'
      if (f.weapon === 'shield') {
        ctx.fillStyle = '#a5f3fc'; ctx.strokeStyle = '#e0faff'; ctx.lineWidth = 2
        ctx.beginPath(); ctx.moveTo(21, -19); ctx.lineTo(43, -14); ctx.lineTo(41, 7); ctx.lineTo(30, 18); ctx.lineTo(19, 7); ctx.closePath(); ctx.fill(); ctx.stroke()
        ctx.strokeStyle = '#0891b2'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(30,-12); ctx.lineTo(30,10); ctx.stroke()
      } else if (f.weapon === 'daggers') {
        ctx.strokeStyle = '#fff1f5'; ctx.lineWidth = 4
        ctx.beginPath(); ctx.moveTo(20,-9); ctx.lineTo(40,-25); ctx.moveTo(22,6); ctx.lineTo(42,20); ctx.stroke()
        ctx.strokeStyle = '#fb7185'; ctx.lineWidth = 5
        ctx.beginPath(); ctx.moveTo(19,-11); ctx.lineTo(26,-4); ctx.moveTo(20,7); ctx.lineTo(27,0); ctx.stroke()
      } else if (f.weapon === 'scythe') {
        ctx.strokeStyle = '#e9d5ff'; ctx.lineWidth = 4
        ctx.beginPath(); ctx.moveTo(23,17); ctx.lineTo(42,-27); ctx.stroke()
        ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 5
        ctx.beginPath(); ctx.moveTo(41,-27); ctx.quadraticCurveTo(63,-31,57,-9); ctx.quadraticCurveTo(51,-21,41,-17); ctx.stroke()
      } else {
        ctx.strokeStyle = '#fde68a'; ctx.lineWidth = 5
        ctx.beginPath(); ctx.moveTo(22,13); ctx.lineTo(43,-15); ctx.stroke()
        ctx.fillStyle = '#fff1b8'; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 14
        ctx.beginPath(); ctx.arc(47,-20,7,0,Math.PI*2); ctx.fill(); ctx.shadowBlur = 0
        ctx.strokeStyle = '#fff7d6'; ctx.lineWidth = 2
        ctx.beginPath(); ctx.arc(47,-20,11 + Math.sin(t/120)*2,0,Math.PI*2); ctx.stroke()
      }
      ctx.restore()
    }
    const drawBall = (f: Fighter, t: number) => {
      const bob = Math.sin(t / 140 + (f.side === 'left' ? 0 : 2)) * 2
      ctx.save()
      ctx.shadowColor = f.color; ctx.shadowBlur = f.flash > 0 ? 28 : 16
      const grad = ctx.createRadialGradient(f.x - f.radius * .36, f.y - f.radius * .44 + bob, 2, f.x, f.y + bob, f.radius + 4)
      grad.addColorStop(0, '#ffffff'); grad.addColorStop(.18, f.color); grad.addColorStop(1, f.side === 'left' ? '#087da8' : '#a3124d')
      ctx.fillStyle = grad
      ctx.beginPath(); ctx.arc(f.x, f.y + bob, f.radius, 0, Math.PI * 2); ctx.fill()
      ctx.shadowBlur = 0; ctx.strokeStyle = '#ffffffaa'; ctx.lineWidth = 2; ctx.stroke()
      ctx.fillStyle = '#101326'; ctx.beginPath(); ctx.arc(f.x + f.facing * f.radius * .26, f.y - 5 + bob, Math.max(3, f.radius * .15), 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(f.x + f.facing * f.radius * .3, f.y - 6 + bob, Math.max(1.2, f.radius * .055), 0, Math.PI * 2); ctx.fill()
      ctx.restore()
      drawWeapon(f, t)
    }
    const attack = (f: Fighter, other: Fighter) => {
      const spec = WEAPONS[f.weapon]
      if (f.cooldown > 0) return
      f.cooldown = f.weapon === 'daggers' ? 20 : f.weapon === 'wand' ? 38 : 32
      if (f.weapon === 'wand') {
        shots.push({ x: f.x + f.facing * 36, y: f.y - 8, vx: f.facing * 7.8, vy: (other.y - f.y) * .025, life: 95, owner: f.side, color: spec.color, radius: 9 })
        return
      }
      const dx = other.x - f.x, dy = other.y - f.y
      if (Math.abs(dx) < spec.reach && Math.abs(dy) < (f.weapon === 'scythe' ? 92 : 58) && Math.sign(dx || f.facing) === f.facing) {
        const dmg = spec.damage
        other.hp = Math.max(0, other.hp - dmg)
        other.flash = 9
        const block = other.weapon === 'shield' ? .55 : 1
        other.hp = Math.min(100, other.hp + dmg * (1-block))
        other.vx += f.facing * (f.weapon === 'shield' ? 8 : f.weapon === 'scythe' ? 7 : 5)
        other.vy -= f.weapon === 'shield' ? 3 : 4
      }
    }
    const draw = (now: number) => {
      const rect = canvas.getBoundingClientRect()
      const w = rect.width, h = rect.height
      if (!w || !h) { raf = requestAnimationFrame(draw); return }
      const dt = Math.min(2, (now - (last || now)) / 16.67 || 1); last = now; frame++
      ctx.clearRect(0, 0, w, h)
      const bg = ctx.createLinearGradient(0, 0, w, h); bg.addColorStop(0, '#14162c'); bg.addColorStop(1, '#1f1233')
      ctx.fillStyle = bg; ctx.fillRect(0,0,w,h)
      ctx.strokeStyle = '#8b8ba533'; ctx.lineWidth = 1
      for (let x=0; x<w; x+=36) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke() }
      for (let y=0; y<h; y+=36) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke() }
      ctx.strokeStyle = '#ffffff15'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(w/2,0); ctx.lineTo(w/2,h); ctx.stroke()
      for (let i=0;i<18;i++) {
        const x = (i*97 + frame*.22) % w, y = (i*53 + Math.sin(frame/40+i)*22) % h
        ctx.fillStyle = '#ffffff35'; ctx.fillRect(x,y,2,2)
      }
      ctx.fillStyle = '#fff'; ctx.font = '700 10px ui-monospace, monospace'; ctx.textAlign = 'center'
      ctx.fillStyle = '#5dd6ff'; ctx.fillText(left.name + ' • ' + WEAPONS[left.weapon].label.toUpperCase(), w*.25, 24)
      ctx.fillStyle = '#ff7da7'; ctx.fillText(right.name + ' • ' + WEAPONS[right.weapon].label.toUpperCase(), w*.75, 24)
      const floor = h - 24
      ctx.strokeStyle = '#ffffff44'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0,floor); ctx.lineTo(w,floor); ctx.stroke()
      ctx.fillStyle = '#ffffff0d'; ctx.fillRect(0,floor,w,24)
      if (playing && !ended) {
        const step = (f: Fighter, other: Fighter) => {
          const dx = other.x - f.x
          const dy = other.y - f.y
          const distance = Math.max(1, Math.hypot(dx, dy))
          const spec = WEAPONS[f.weapon]
          f.facing = dx >= 0 ? 1 : -1
          // AI steers toward its opponent, but wand users try to keep some distance.
          const preferred = f.weapon === 'wand' ? 185 : f.weapon === 'scythe' ? 72 : 48
          if (distance > preferred + 12) f.vx += Math.sign(dx) * (f.weapon === 'wand' ? .10 : .19) * dt
          else if (distance < preferred - 18) f.vx -= Math.sign(dx) * .14 * dt
          // Small autonomous hops keep the fight lively without player input.
          if (f.y >= floor - f.radius - 1 && Math.random() < .012 * dt) f.vy = -5.5 - Math.random() * 2
          if (Math.abs(dy) > 45 && f.y >= floor - f.radius - 1) f.vx += Math.sign(dx) * .08 * dt
          if (distance <= spec.reach + f.radius * .35 || f.weapon === 'wand') attack(f, other)
          f.vx = Math.max(-6.5, Math.min(6.5, f.vx))
          f.vx *= Math.pow(.992,dt); f.vy += .36*dt
          f.x += f.vx*dt; f.y += f.vy*dt
          if (f.x < f.radius) { f.x=f.radius; f.vx=Math.abs(f.vx)*.82 }
          if (f.x > w-f.radius) { f.x=w-f.radius; f.vx=-Math.abs(f.vx)*.82 }
          if (f.y > floor-f.radius) { f.y=floor-f.radius; f.vy=-Math.abs(f.vy)*.83; if(Math.abs(f.vy)<1.5) f.vy=0 }
          if (f.y < 55) { f.y=55; f.vy=Math.abs(f.vy)*.7 }
          f.cooldown = Math.max(0,f.cooldown-dt); f.flash = Math.max(0,f.flash-dt)
        }
        step(left,right); step(right,left)
        const dx=right.x-left.x, dy=right.y-left.y, dist=Math.hypot(dx,dy)
        if (dist < left.radius + right.radius + 1 && dist > 0) {
          const push=(left.radius + right.radius + 1-dist)*.055
          left.vx -= dx/dist*push; right.vx += dx/dist*push
          left.vy -= dy/dist*push*.3; right.vy += dy/dist*push*.3
        }
        shots = shots.filter(s => s.life > 0 && s.x > -20 && s.x < w+20 && s.y > 0 && s.y < h)
        for (const s of shots) {
          s.x += s.vx*dt; s.y += s.vy*dt; s.life -= dt
          ctx.save(); ctx.shadowColor=s.color; ctx.shadowBlur=20; ctx.fillStyle=s.color
          ctx.beginPath(); ctx.arc(s.x,s.y,s.radius,0,Math.PI*2); ctx.fill(); ctx.restore()
          const target=s.owner==='left'?right:left
          if (Math.hypot(s.x-target.x,s.y-target.y)<target.radius + s.radius) {
            const blocked=target.weapon==='shield'
            target.hp=Math.max(0,target.hp-WEAPONS.wand.damage*(blocked?.55:1))
            target.flash=10; target.vx+=(s.owner==='left'?1:-1)*4; target.vy-=2
            s.life=0
          }
        }
        if (frame%6===0) { setLeftHp(Math.round(left.hp)); setRightHp(Math.round(right.hp)) }
        if (left.hp<=0 || right.hp<=0) {
          ended=true
          const winnerName=left.hp<=0?(right.name || 'RAVEN'):(left.name || 'NOVA')
          setWinner(winnerName)
          setPlaying(false)
        }
      }
      drawBall(left,now); drawBall(right,now)
      if (left.flash>0) { ctx.strokeStyle='#ffffffcc';ctx.lineWidth=3;ctx.beginPath();ctx.arc(left.x,left.y,34,0,Math.PI*2);ctx.stroke() }
      if (right.flash>0) { ctx.strokeStyle='#ffffffcc';ctx.lineWidth=3;ctx.beginPath();ctx.arc(right.x,right.y,34,0,Math.PI*2);ctx.stroke() }
      if (!playing || ended) {
        ctx.fillStyle='#080916aa';ctx.fillRect(0,0,w,h)
        ctx.textAlign='center';ctx.fillStyle='#fff';ctx.font='900 22px system-ui'
        ctx.fillText(winner ? winner+' WINS!' : 'READY TO FIGHT?',w/2,h/2-5)
        ctx.fillStyle='#b8bdd7';ctx.font='12px system-ui'
        ctx.fillText(winner ? 'Rematch time — choose your weapon and fight again.' : 'Pilih senjata, lalu mulai simulasi pertarungan.',w/2,h/2+20)
      }
      raf=requestAnimationFrame(draw)
    }
    raf=requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf); window.removeEventListener('resize',resize)
    }
  }, [leftWeapon,rightWeapon,leftColor,rightColor,leftName,rightName,leftRadius,rightRadius,playing,roundKey,winner])

  const weaponSelect = (side: 'left' | 'right', value: Weapon) => {
    if (side === 'left') setLeftWeapon(value); else setRightWeapon(value)
    setPlaying(true); setWinner(null); setLeftHp(100); setRightHp(100); setRoundKey(n => n + 1)
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#0b0c18] text-white selection:bg-fuchsia-500/30">
      <div className="pointer-events-none fixed inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 15% 10%, #1b8aa0 0, transparent 28%), radial-gradient(circle at 85% 15%, #9b2874 0, transparent 30%), radial-gradient(circle at 50% 100%, #48226b 0, transparent 40%)' }} />
      <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-200 shadow-lg shadow-cyan-500/10"><Swords size={25}/></div>
            <div><p className="text-xs font-bold tracking-[.35em] text-cyan-200">BOUNCING BALL BRAWL</p><h1 className="text-2xl font-black tracking-tight sm:text-3xl">TOOLS <span className="text-fuchsia-300">WARS</span></h1></div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"/> AUTO BATTLE <span className="hidden sm:inline">• AI VS AI</span></div>
        </header>

        <section className="mb-5 rounded-2xl border border-fuchsia-300/20 bg-white/[.04] p-4 sm:p-5"><div className="mb-4 flex items-center gap-2"><Sparkles size={18} className="text-fuchsia-200"/><div><h2 className="text-sm font-black tracking-[.2em]">CUSTOM BALL MAKER</h2><p className="mt-1 text-xs text-slate-400">Bikin identitas bola sendiri: nama, warna, ukuran, dan senjatanya.</p></div></div><div className="grid gap-4 md:grid-cols-2"><div className="rounded-xl border border-cyan-200/15 bg-black/20 p-4"><div className="mb-3 flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-full border-2 border-white/60 shadow-lg" style={{background:leftColor,boxShadow:`0 0 22px ${leftColor}`}}/><div><p className="text-xs font-black tracking-widest text-cyan-200">BALL 01</p><p className="text-[11px] text-slate-400">Custom fighter kiri</p></div></div><label className="mb-1 block text-xs font-bold text-slate-300">Nama bola</label><input maxLength={14} value={leftName} onChange={e=>setLeftName(e.target.value.toUpperCase())} placeholder="NOVA" className="mb-3 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-cyan-300/60"/><div className="mb-3 flex items-center justify-between gap-3"><label className="text-xs font-bold text-slate-300">Warna inti</label><input aria-label="Warna bola 1" type="color" value={leftColor} onChange={e=>setLeftColor(e.target.value)} className="h-9 w-14 cursor-pointer rounded border-0 bg-transparent"/></div><div className="flex items-center justify-between gap-3"><label className="text-xs font-bold text-slate-300">Ukuran bola <span className="font-mono text-cyan-200">{leftRadius}px</span></label><input aria-label="Ukuran bola 1" type="range" min={21} max={36} value={leftRadius} onChange={e=>setLeftRadius(Number(e.target.value))} className="w-28 accent-cyan-300"/></div></div><div className="rounded-xl border border-pink-200/15 bg-black/20 p-4"><div className="mb-3 flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-full border-2 border-white/60 shadow-lg" style={{background:rightColor,boxShadow:`0 0 22px ${rightColor}`}}/><div><p className="text-xs font-black tracking-widest text-pink-200">BALL 02</p><p className="text-[11px] text-slate-400">Custom fighter kanan</p></div></div><label className="mb-1 block text-xs font-bold text-slate-300">Nama bola</label><input maxLength={14} value={rightName} onChange={e=>setRightName(e.target.value.toUpperCase())} placeholder="RAVEN" className="mb-3 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-pink-300/60"/><div className="mb-3 flex items-center justify-between gap-3"><label className="text-xs font-bold text-slate-300">Warna inti</label><input aria-label="Warna bola 2" type="color" value={rightColor} onChange={e=>setRightColor(e.target.value)} className="h-9 w-14 cursor-pointer rounded border-0 bg-transparent"/></div><div className="flex items-center justify-between gap-3"><label className="text-xs font-bold text-slate-300">Ukuran bola <span className="font-mono text-pink-200">{rightRadius}px</span></label><input aria-label="Ukuran bola 2" type="range" min={21} max={36} value={rightRadius} onChange={e=>setRightRadius(Number(e.target.value))} className="w-28 accent-pink-300"/></div></div></div></section>

        <section className="mb-5 grid gap-3 md:grid-cols-2">
          {[{side:'left' as const,title:'PLAYER 1',weapon:leftWeapon,color:'#5dd6ff',hp:leftHp},{side:'right' as const,title:'PLAYER 2',weapon:rightWeapon,color:'#ff5b8a',hp:rightHp}].map((p) => (
            <div key={p.side} className="rounded-2xl border border-white/10 bg-white/[.045] p-4 backdrop-blur">
              <div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{background:p.color,boxShadow:`0 0 14px ${p.color}`}}/><span className="text-xs font-black tracking-[.22em] text-slate-300">{p.side === 'left' ? leftName || 'NOVA' : rightName || 'RAVEN'}</span></div><span className="font-mono text-sm font-bold" style={{color:p.color}}>{p.hp} HP</span></div>
              <div className="mb-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full transition-all duration-150" style={{width:`${p.hp}%`,background:p.color,boxShadow:`0 0 16px ${p.color}`}}/></div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {OPTIONS.map((weapon) => <button key={weapon} onClick={()=>weaponSelect(p.side,weapon)} className={`rounded-xl border px-2 py-3 text-left transition hover:-translate-y-0.5 ${p.weapon===weapon?'border-white/50 bg-white/10':'border-white/10 bg-black/10 hover:bg-white/5'}`}><span className="mb-1 block text-xl">{WEAPONS[weapon].icon}</span><span className="block text-xs font-extrabold">{WEAPONS[weapon].label}</span><span className="mt-1 hidden text-[10px] leading-tight text-slate-400 sm:block">{WEAPONS[weapon].description}</span></button>)}
              </div>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#121426] shadow-2xl shadow-black/40">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5"><div className="flex items-center gap-2 text-sm font-extrabold"><Gamepad2 size={17} className="text-cyan-200"/> THE ARENA <span className="text-xs font-normal text-slate-500">/ ROUND {roundKey || 1}</span></div><div className="flex gap-2"><span className="rounded-full bg-cyan-300/10 px-3 py-1 text-[10px] font-bold tracking-widest text-cyan-200">BOUNCE PHYSICS</span><span className="rounded-full bg-fuchsia-300/10 px-3 py-1 text-[10px] font-bold tracking-widest text-fuchsia-200">WEAPON COMBAT</span></div></div>
          <canvas ref={canvasRef} className="block h-[340px] w-full sm:h-[430px] md:h-[490px]" aria-label="Arena game Tools Wars. Player one uses A D W F. Player two uses arrow keys and slash."/>
          <div className="border-t border-white/10 bg-black/20 px-4 py-3 text-center text-xs text-slate-400">AUTO SIMULATION · Bola bergerak, memilih jarak, melompat, dan menyerang sendiri. Kamu cukup memilih build dan menonton pertarungan.</div>
        </section>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[.035] p-4"><Sparkles size={20} className="mt-0.5 shrink-0 text-amber-200"/><div><p className="text-sm font-bold">Atur matchup, lalu saksikan pertarungan.</p><p className="mt-1 text-xs leading-5 text-slate-400">Kedua bola dikendalikan AI: bergerak, menjaga jarak sesuai senjata, melompat, dan menyerang otomatis.</p></div></div>
          <button onClick={resetRound} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-7 py-4 text-sm font-black tracking-wide text-[#090b17] shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.02] active:scale-[.98]"><RotateCcw size={18}/>{winner ? 'REMATCH' : playing ? 'RESET & FIGHT' : 'MULAI PERTARUNGAN'}</button>
        </div>

        <section className="mt-5 rounded-2xl border border-white/10 bg-white/[.03] p-4 sm:p-5"><div className="mb-3 flex items-center gap-2"><Trophy size={17} className="text-amber-300"/><h2 className="text-xs font-black tracking-[.25em] text-slate-300">ARSENAL / QUICK GUIDE</h2></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{OPTIONS.map(w=><div key={w} className="flex gap-3 rounded-xl border border-white/5 bg-black/10 p-3"><span className="text-2xl">{WEAPONS[w].icon}</span><div><p className="text-sm font-extrabold" style={{color:WEAPONS[w].color}}>{WEAPONS[w].label}</p><p className="mt-1 text-xs leading-5 text-slate-400">{WEAPONS[w].description}</p></div></div>)}</div></section>
        <footer className="py-6 text-center text-[10px] tracking-[.22em] text-slate-600">TOOLS WARS · AUTO WEAPON BALL SIMULATOR · BUILT TO BOUNCE</footer>
      </div>
    </main>
  )
}
