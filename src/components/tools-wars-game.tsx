'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Swords, Shield, Zap, RotateCcw, Trophy, Gamepad2, Sparkles } from 'lucide-react'

type Weapon = 'shield' | 'daggers' | 'scythe' | 'wand'
type Fighter = {
  x: number; y: number; vx: number; vy: number; hp: number; maxHp: number
  cooldown: number; flash: number; facing: number; weapon: Weapon; color: string
  name: string; controls: 'left' | 'right'
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
  const keysRef = useRef<Set<string>>(new Set())
  const [leftWeapon, setLeftWeapon] = useState<Weapon>('shield')
  const [rightWeapon, setRightWeapon] = useState<Weapon>('daggers')
  const [playing, setPlaying] = useState(false)
  const [roundKey, setRoundKey] = useState(0)
  const [winner, setWinner] = useState<string | null>(null)
  const [leftHp, setLeftHp] = useState(100)
  const [rightHp, setRightHp] = useState(100)
  const [muted, setMuted] = useState(true)

  const resetRound = useCallback(() => {
    keysRef.current.clear()
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
    let left: Fighter = { x: 0, y: 0, vx: 3.1, vy: -2, hp: 100, maxHp: 100, cooldown: 0, flash: 0, facing: 1, weapon: leftWeapon, color: '#5dd6ff', name: 'PLAYER 1', controls: 'left' }
    let right: Fighter = { x: 0, y: 0, vx: -3.1, vy: -1, hp: 100, maxHp: 100, cooldown: 0, flash: 0, facing: -1, weapon: rightWeapon, color: '#ff5b8a', name: 'PLAYER 2', controls: 'right' }
    let shots: Shot[] = []
    let leftShown = 100
    let rightShown = 100
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
    const keyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (['arrowleft','arrowright','arrowup',' ','/'].includes(key)) e.preventDefault()
      keysRef.current.add(key)
    }
    const keyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key.toLowerCase())
    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)

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
      const bob = Math.sin(t / 140 + (f.controls === 'left' ? 0 : 2)) * 2
      ctx.save()
      ctx.shadowColor = f.color; ctx.shadowBlur = f.flash > 0 ? 28 : 16
      const grad = ctx.createRadialGradient(f.x - 10, f.y - 12 + bob, 2, f.x, f.y + bob, 31)
      grad.addColorStop(0, '#ffffff'); grad.addColorStop(.18, f.color); grad.addColorStop(1, f.controls === 'left' ? '#087da8' : '#a3124d')
      ctx.fillStyle = grad
      ctx.beginPath(); ctx.arc(f.x, f.y + bob, 27, 0, Math.PI * 2); ctx.fill()
      ctx.shadowBlur = 0; ctx.strokeStyle = '#ffffffaa'; ctx.lineWidth = 2; ctx.stroke()
      ctx.fillStyle = '#101326'; ctx.beginPath(); ctx.arc(f.x + f.facing * 7, f.y - 5 + bob, 4, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(f.x + f.facing * 8, f.y - 6 + bob, 1.5, 0, Math.PI * 2); ctx.fill()
      ctx.restore()
      drawWeapon(f, t)
    }
    const attack = (f: Fighter, other: Fighter) => {
      const spec = WEAPONS[f.weapon]
      if (f.cooldown > 0) return
      f.cooldown = f.weapon === 'daggers' ? 20 : f.weapon === 'wand' ? 38 : 32
      if (f.weapon === 'wand') {
        shots.push({ x: f.x + f.facing * 36, y: f.y - 8, vx: f.facing * 7.8, vy: (other.y - f.y) * .025, life: 95, owner: f.controls, color: spec.color, radius: 9 })
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
      ctx.fillStyle = '#5dd6ff'; ctx.fillText('P1 • ' + WEAPONS[left.weapon].label.toUpperCase(), w*.25, 24)
      ctx.fillStyle = '#ff7da7'; ctx.fillText('P2 • ' + WEAPONS[right.weapon].label.toUpperCase(), w*.75, 24)
      const floor = h - 24
      ctx.strokeStyle = '#ffffff44'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0,floor); ctx.lineTo(w,floor); ctx.stroke()
      ctx.fillStyle = '#ffffff0d'; ctx.fillRect(0,floor,w,24)
      if (playing && !ended) {
        const keys = keysRef.current
        const step = (f: Fighter, other: Fighter) => {
          const leftSide = f.controls === 'left'
          const goLeft = keys.has(leftSide ? 'a' : 'arrowleft') || keys.has(leftSide ? 'a' : 'arrowleft')
          const goRight = keys.has(leftSide ? 'd' : 'arrowright')
          const jump = keys.has(leftSide ? 'w' : 'arrowup')
          const hit = keys.has(leftSide ? 'f' : '/')
          if (goLeft) f.vx -= .48*dt
          if (goRight) f.vx += .48*dt
          if (jump && f.y > h*.30 && Math.abs(f.vy)<1.2) f.vy = -8.8
          if (hit) attack(f, other)
          f.vx *= Math.pow(.986,dt); f.vy += .36*dt
          f.x += f.vx*dt; f.y += f.vy*dt
          if (f.x < 32) { f.x=32; f.vx=Math.abs(f.vx)*.78 }
          if (f.x > w-32) { f.x=w-32; f.vx=-Math.abs(f.vx)*.78 }
          if (f.y > floor-27) { f.y=floor-27; f.vy=-Math.abs(f.vy)*.83; if(Math.abs(f.vy)<1.5) f.vy=0 }
          if (f.y < 55) { f.y=55; f.vy=Math.abs(f.vy)*.7 }
          f.facing = other.x >= f.x ? 1 : -1
          f.cooldown = Math.max(0,f.cooldown-dt); f.flash = Math.max(0,f.flash-dt)
        }
        step(left,right); step(right,left)
        const dx=right.x-left.x, dy=right.y-left.y, dist=Math.hypot(dx,dy)
        if (dist < 55 && dist > 0) {
          const push=(55-dist)*.055
          left.vx -= dx/dist*push; right.vx += dx/dist*push
          left.vy -= dy/dist*push*.3; right.vy += dy/dist*push*.3
        }
        shots = shots.filter(s => s.life > 0 && s.x > -20 && s.x < w+20 && s.y > 0 && s.y < h)
        for (const s of shots) {
          s.x += s.vx*dt; s.y += s.vy*dt; s.life -= dt
          ctx.save(); ctx.shadowColor=s.color; ctx.shadowBlur=20; ctx.fillStyle=s.color
          ctx.beginPath(); ctx.arc(s.x,s.y,s.radius,0,Math.PI*2); ctx.fill(); ctx.restore()
          const target=s.owner==='left'?right:left
          if (Math.hypot(s.x-target.x,s.y-target.y)<32) {
            const blocked=target.weapon==='shield'
            target.hp=Math.max(0,target.hp-WEAPONS.wand.damage*(blocked?.55:1))
            target.flash=10; target.vx+=(s.owner==='left'?1:-1)*4; target.vy-=2
            s.life=0
          }
        }
        if (frame%6===0) { setLeftHp(Math.round(left.hp)); setRightHp(Math.round(right.hp)) }
        if (left.hp<=0 || right.hp<=0) {
          ended=true
          const winnerName=left.hp<=0?'PLAYER 2':'PLAYER 1'
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
        ctx.fillText(winner ? 'Rematch time — choose your weapon and fight again.' : 'Pilih senjata, lalu tekan MULAI PERTARUNGAN.',w/2,h/2+20)
      }
      raf=requestAnimationFrame(draw)
    }
    raf=requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf); window.removeEventListener('resize',resize)
      window.removeEventListener('keydown',keyDown); window.removeEventListener('keyup',keyUp)
    }
  }, [leftWeapon,rightWeapon,playing,roundKey,winner])

  const hold = (key: string, active: boolean) => {
    if (active) keysRef.current.add(key)
    else keysRef.current.delete(key)
  }
  const weaponSelect = (side: 'left' | 'right', value: Weapon) => {
    if (side === 'left') setLeftWeapon(value); else setRightWeapon(value)
    setPlaying(false); setWinner(null); setLeftHp(100); setRightHp(100)
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
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"/> LOCAL MULTIPLAYER <span className="hidden sm:inline">• 2 PLAYERS</span></div>
        </header>

        <section className="mb-5 grid gap-3 md:grid-cols-2">
          {[{side:'left' as const,title:'PLAYER 1',weapon:leftWeapon,color:'#5dd6ff',hp:leftHp},{side:'right' as const,title:'PLAYER 2',weapon:rightWeapon,color:'#ff5b8a',hp:rightHp}].map((p) => (
            <div key={p.side} className="rounded-2xl border border-white/10 bg-white/[.045] p-4 backdrop-blur">
              <div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{background:p.color,boxShadow:`0 0 14px ${p.color}`}}/><span className="text-xs font-black tracking-[.22em] text-slate-300">{p.title}</span></div><span className="font-mono text-sm font-bold" style={{color:p.color}}>{p.hp} HP</span></div>
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
          <div className="grid gap-3 border-t border-white/10 bg-black/20 p-4 sm:grid-cols-2 sm:p-5">
            <div><p className="mb-2 text-xs font-black tracking-widest text-cyan-200">PLAYER 1 CONTROLS</p><p className="text-xs leading-6 text-slate-400"><kbd className="keycap">A</kbd> <kbd className="keycap">D</kbd> move · <kbd className="keycap">W</kbd> jump · <kbd className="keycap">F</kbd> attack</p></div>
            <div><p className="mb-2 text-xs font-black tracking-widest text-pink-200">PLAYER 2 CONTROLS</p><p className="text-xs leading-6 text-slate-400"><kbd className="keycap">←</kbd> <kbd className="keycap">→</kbd> move · <kbd className="keycap">↑</kbd> jump · <kbd className="keycap">/</kbd> attack</p></div>
          </div>
        </section>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[.035] p-4"><Sparkles size={20} className="mt-0.5 shrink-0 text-amber-200"/><div><p className="text-sm font-bold">Pilih matchup, kuasai arena.</p><p className="mt-1 text-xs leading-5 text-slate-400">Shield meredam damage, Daggers bergerak cepat, Scythe punya jangkauan sabetan luas, dan Wand menembakkan orb sihir.</p></div></div>
          <button onClick={resetRound} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-7 py-4 text-sm font-black tracking-wide text-[#090b17] shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.02] active:scale-[.98]"><RotateCcw size={18}/>{winner ? 'REMATCH' : playing ? 'RESET & FIGHT' : 'MULAI PERTARUNGAN'}</button>
        </div>

        <section className="mt-5 rounded-2xl border border-white/10 bg-white/[.03] p-4 sm:p-5"><div className="mb-3 flex items-center gap-2"><Trophy size={17} className="text-amber-300"/><h2 className="text-xs font-black tracking-[.25em] text-slate-300">ARSENAL / QUICK GUIDE</h2></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{OPTIONS.map(w=><div key={w} className="flex gap-3 rounded-xl border border-white/5 bg-black/10 p-3"><span className="text-2xl">{WEAPONS[w].icon}</span><div><p className="text-sm font-extrabold" style={{color:WEAPONS[w].color}}>{WEAPONS[w].label}</p><p className="mt-1 text-xs leading-5 text-slate-400">{WEAPONS[w].description}</p></div></div>)}</div></section>
        <footer className="py-6 text-center text-[10px] tracking-[.22em] text-slate-600">TOOLS WARS · LOCAL 2-PLAYER BRAWLER · BUILT TO BOUNCE</footer>
      </div>
      <style jsx global>{`
        .keycap { display:inline-flex; min-width:23px; justify-content:center; border:1px solid #ffffff25; border-bottom-width:2px; border-radius:6px; background:#ffffff0b; padding:0 5px; color:#e2e8f0; font:700 10px ui-monospace,monospace; }
      `}</style>
    </main>
  )
}
