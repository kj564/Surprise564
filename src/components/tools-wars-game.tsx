'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Swords, RotateCcw, Trophy, Gamepad2, Sparkles } from 'lucide-react'

type Weapon = 'shield' | 'daggers' | 'scythe' | 'wand'
type Trait = 'survive' | 'orbital' | 'range' | 'melee'
type SubTrait = 'offense' | 'defense'
type Category = 'speedster' | 'elemental'
type Fighter = {
  x: number; y: number; vx: number; vy: number; hp: number; maxHp: number; radius: number
  cooldown: number; flash: number; burn: number; facing: number; weapon: Weapon; color: string
  name: string; side: 'left' | 'right'; trait: Trait; subTrait: SubTrait; category: Category
  charId: string; bounceCount: number; lastHitAt: number; shieldUntil: number; hitCount: number
}
type Shot = { x: number; y: number; vx: number; vy: number; life: number; owner: 'left' | 'right'; color: string; radius: number }
const WEAPONS: Record<Weapon, { label: string; icon: string; color: string; damage: number; reach: number; speed: number; description: string }> = {
  shield: { label: 'Shield', icon: '🛡️', color: '#5dd6ff', damage: 13, reach: 74, speed: 5.2, description: 'Tahan serangan, lalu dorong lawan dengan bash.' },
  daggers: { label: 'Daggers', icon: '🗡️', color: '#ff5b8a', damage: 8, reach: 65, speed: 8.2, description: 'Gerakan cepat dan combo jarak dekat.' },
  scythe: { label: 'Scythe', icon: '⚔️', color: '#c084fc', damage: 18, reach: 112, speed: 4.7, description: 'Sabetan lebar dengan jangkauan panjang.' },
  wand: { label: 'Wand', icon: '🪄', color: '#ffc857', damage: 11, reach: 250, speed: 5.5, description: 'Tembakkan orb sihir dari jarak jauh.' },
}
const OPTIONS: Weapon[] = ['shield', 'daggers', 'scythe', 'wand']
const TRAITS: { value: Trait; label: string }[] = [{value:'survive',label:'Survive'},{value:'orbital',label:'Orbital'},{value:'range',label:'Range'},{value:'melee',label:'Melee'}]
const SUBTRAITS: { value: SubTrait; label: string }[] = [{value:'offense',label:'Offense'},{value:'defense',label:'Defense'}]
const CATEGORIES: { value: Category; label: string }[] = [{value:'speedster',label:'Speedster'},{value:'elemental',label:'Elemental'}]

// Cellestial is the umbrella class system: 4 Traits × 2 Sub-traits × 2 Sub-categories = 16 archetypes.
const CELESTIAL_CLASSES = TRAITS.flatMap((trait) => SUBTRAITS.flatMap((subTrait) => CATEGORIES.map((category) => ({
  value: `${trait.value}-${subTrait.value}-${category.value}`,
  label: `Cellestial · ${trait.label} / ${subTrait.label} / ${category.label}`,
  trait: trait.value,
  subTrait: subTrait.value,
  category: category.value,
}))))


// Egyptian Cellestial roster: character identity drives visual emblems and passive/active combat effects.
type EgyptianCharacter = {
  id: string; name: string; epithet: string; lore: string; visual: string; legendaryWeapon: string
  mechanic: string; trait: Trait; subTrait: SubTrait; category: Category; color: string; weapon: Weapon
}
const EGYPTIAN_CHARACTERS: EgyptianCharacter[] = [
  { id:'horus', name:'HORUS', epithet:'The Falcon Blitz', lore:'Dewa langit dan pelindung kerajaan.', visual:'Bola lapis lazuli, mahkota elang, jejak bulu emas.', legendaryWeapon:'Khopesh of the Sky King', mechanic:'Momentum Slash: damage meningkat hingga 15% saat bergerak cepat; hit memberi dorongan kecil.', trait:'melee', subTrait:'offense', category:'speedster', color:'#32c5ee', weapon:'scythe' },
  { id:'set', name:'SET', epithet:'The Chaos Reaver', lore:'Dewa gurun, badai, dan kekacauan.', visual:'Bola merah, retakan bara, pusaran pasir.', legendaryWeapon:'Was-Scepter of the Red Tempest', mechanic:'Scorch Mark: burn lebih kuat dan knockback meningkat setelah pantulan dinding.', trait:'melee', subTrait:'offense', category:'elemental', color:'#f06445', weapon:'scythe' },
  { id:'bastet', name:'BASTET', epithet:'The Moonstep Guardian', lore:'Dewi kucing dan perlindungan rumah tangga.', visual:'Bola biru malam, telinga kucing, simbol bulan perak.', legendaryWeapon:'Twin Blades of Bubastis', mechanic:'Catlike Deflection: menerima 18% lebih sedikit damage; serangan balik mendapat bonus kecil.', trait:'melee', subTrait:'defense', category:'speedster', color:'#7e9cff', weapon:'daggers' },
  { id:'sekhmet', name:'SEKHMET', epithet:'The Solar Aegis', lore:'Dewi singa perang dan kekuatan matahari.', visual:'Bola merah-emas dengan surai api dan cakram matahari.', legendaryWeapon:'Solar Khopesh of Sekhmet', mechanic:'Furnace Counter: memantulkan 15% damage yang diterima dan burn singkat pada serangan.', trait:'melee', subTrait:'defense', category:'elemental', color:'#ff9d43', weapon:'shield' },
  { id:'thoth', name:'THOTH', epithet:'The Moonshot Savant', lore:'Dewa kebijaksanaan, tulisan, dan perhitungan waktu.', visual:'Bola pirus-putih, kepala ibis, rune bulan.', legendaryWeapon:'Bow of the Measured Moon', mechanic:'Calculated Trajectory: proyektil lebih cepat dan memantul sekali dari dinding dengan damage 70%.', trait:'range', subTrait:'offense', category:'speedster', color:'#75e6d2', weapon:'wand' },
  { id:'ra', name:'RA', epithet:'The Solar Artillery', lore:'Dewa matahari dan pencipta dalam tradisi Mesir.', visual:'Bola emas, kepala elang, cincin matahari.', legendaryWeapon:"Aten's Sun Lance", mechanic:'Solar Detonation: proyektil elemental meledak kecil saat mengenai target dan memberi burn.', trait:'range', subTrait:'offense', category:'elemental', color:'#ffca55', weapon:'wand' },
  { id:'neith', name:'NEITH', epithet:'The Swift Weaver', lore:'Dewi perburuan, perang, dan tenunan.', visual:'Bola biru tua dengan pola benang emas.', legendaryWeapon:'Loomstring Bow', mechanic:'Weaver’s Guard: sesudah terkena hit, mendapat pengurangan damage 15% singkat; tembakan dapat ricochet.', trait:'range', subTrait:'defense', category:'speedster', color:'#68a8ff', weapon:'wand' },
  { id:'isis', name:'ISIS', epithet:'The Veil of Aset', lore:'Dewi sihir dan perlindungan.', visual:'Bola putih-pirus dengan sayap cahaya dan kabut.', legendaryWeapon:'Scepter of the Thousand Veils', mechanic:'Mystic Ward: hit proyektil memulihkan 2 HP dan memberi ward singkat.', trait:'range', subTrait:'defense', category:'elemental', color:'#8de8e0', weapon:'wand' },
  { id:'anhur', name:'ANHUR', epithet:'The Solar Spear Dancer', lore:'Dewa perang yang dikaitkan dengan kekuatan singa.', visual:'Bola perunggu dengan tombak mini berputar.', legendaryWeapon:'Spear of the Four Horizons', mechanic:'Velocity Spiral: orbit bergerak lebih cepat; kontak orbit punya cooldown pendek namun damage moderat.', trait:'orbital', subTrait:'offense', category:'speedster', color:'#f0bb62', weapon:'daggers' },
  { id:'sobek', name:'SOBEK', epithet:'The Flood Maw', lore:'Dewa buaya dan kekuatan sungai Nil.', visual:'Bola zamrud bersisik dengan pusaran air.', legendaryWeapon:'Trident of the Primeval Nile', mechanic:'Flood Mark: hit elemental mendorong lawan lebih jauh; setiap beberapa hit memicu semburan tambahan.', trait:'orbital', subTrait:'offense', category:'elemental', color:'#57d4a2', weapon:'scythe' },
  { id:'ptah', name:'PTAH', epithet:'The Celestial Architect', lore:'Dewa pencipta dan pelindung para perajin.', visual:'Bola teal dengan ukiran geometris dan lempeng orbit.', legendaryWeapon:"Shaper's Orbit", mechanic:'Perfect Angle: membelokkan sebagian proyektil dan mendapat boost kecil setiap pantulan dinding.', trait:'orbital', subTrait:'defense', category:'speedster', color:'#60d4cf', weapon:'shield' },
  { id:'nut', name:'NUT', epithet:'The Firmament Keeper', lore:'Dewi langit dan hamparan bintang.', visual:'Bola biru malam dengan cincin konstelasi.', legendaryWeapon:'Ring of the Heavenly Vault', mechanic:'Firmament Barrier: mengurangi damage proyektil dan burn; orbit memperlambat lawan sesaat.', trait:'orbital', subTrait:'defense', category:'elemental', color:'#9a9cff', weapon:'shield' },
  { id:'wepwawet', name:'WEPWAWET', epithet:'The Pathbreaker', lore:'Dewa serigala pembuka jalan.', visual:'Bola perak-abu dengan jejak pasir putih.', legendaryWeapon:'Standard of the Opener', mechanic:'Endless Pursuit: memulihkan sedikit HP pada pantulan dinding, dengan batas pemulihan.', trait:'survive', subTrait:'offense', category:'speedster', color:'#cbd5e1', weapon:'daggers' },
  { id:'hathor', name:'HATHOR', epithet:'The Ember of Renewal', lore:'Dewi musik, cinta, dan kegembiraan.', visual:'Bola merah-emas, tanduk sapi, gelombang resonansi.', legendaryWeapon:'Sistrum of the Burning Dawn', mechanic:'Ember Rebirth: sebagian kecil damage serangan dipulihkan sebagai HP; burn ringan.', trait:'survive', subTrait:'offense', category:'elemental', color:'#ff8f70', weapon:'scythe' },
  { id:'osiris', name:'OSIRIS', epithet:'The Undying King', lore:'Dewa alam baka, kebangkitan, dan penghakiman.', visual:'Bola giok berbalut linen putih dan mahkota Atef.', legendaryWeapon:'Crook and Flail of the Resurrected King', mechanic:"King's Recovery: pulih perlahan setelah 2 detik tanpa terkena serangan; defensif saat HP rendah.", trait:'survive', subTrait:'defense', category:'speedster', color:'#75d69b', weapon:'shield' },
  { id:'khepri', name:'KHEPRI', epithet:'The Eternal Dawn', lore:'Dewa scarab yang melambangkan matahari terbit dan pembaruan.', visual:'Bola emas dengan cangkang scarab hijau-biru.', legendaryWeapon:'Solar Scarab Aegis', mechanic:'Dawnfire Rebound: setiap 4 pantulan memicu pulse kecil; menerima 25% lebih sedikit damage dari hit pertama setelah pulse.', trait:'survive', subTrait:'defense', category:'elemental', color:'#e7c75c', weapon:'shield' },
]
const getCharacter = (id: string) => EGYPTIAN_CHARACTERS.find((c) => c.id === id) ?? EGYPTIAN_CHARACTERS[0]

const distanceBetween = (a: Fighter, b: Fighter) => Math.hypot(b.x - a.x, b.y - a.y)

export default function ToolsWarsGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [leftCharacter, setLeftCharacter] = useState('horus')
  const [rightCharacter, setRightCharacter] = useState('bastet')
  const [leftWeapon, setLeftWeapon] = useState<Weapon>('scythe')
  const [rightWeapon, setRightWeapon] = useState<Weapon>('daggers')
  const [leftColor, setLeftColor] = useState('#32c5ee')
  const [rightColor, setRightColor] = useState('#7e9cff')
  const [leftName, setLeftName] = useState('HORUS')
  const [rightName, setRightName] = useState('BASTET')
  const [leftRadius, setLeftRadius] = useState(27)
  const [rightRadius, setRightRadius] = useState(27)
  const [leftTrait, setLeftTrait] = useState<Trait>('melee')
  const [rightTrait, setRightTrait] = useState<Trait>('melee')
  const [leftSubTrait, setLeftSubTrait] = useState<SubTrait>('offense')
  const [rightSubTrait, setRightSubTrait] = useState<SubTrait>('defense')
  const [leftCategory, setLeftCategory] = useState<Category>('speedster')
  const [rightCategory, setRightCategory] = useState<Category>('speedster')
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
    let left: Fighter = { x: 0, y: 0, vx: leftCategory === 'speedster' ? 4.5 : 3.1, vy: leftCategory === 'speedster' ? 2.8 : 2.2, hp: 100, maxHp: 100, radius: leftRadius, cooldown: 0, flash: 0, burn: 0, facing: 1, weapon: leftWeapon, color: leftColor, name: leftName || 'NOVA', side: 'left', trait: leftTrait, subTrait: leftSubTrait, category: leftCategory, charId: leftCharacter, bounceCount: 0, lastHitAt: 0, shieldUntil: 0, hitCount: 0 }
    let right: Fighter = { x: 0, y: 0, vx: rightCategory === 'speedster' ? -4.5 : -3.1, vy: rightCategory === 'speedster' ? -2.8 : -2.1, hp: 100, maxHp: 100, radius: rightRadius, cooldown: 0, flash: 0, burn: 0, facing: -1, weapon: rightWeapon, color: rightColor, name: rightName || 'RAVEN', side: 'right', trait: rightTrait, subTrait: rightSubTrait, category: rightCategory, charId: rightCharacter, bounceCount: 0, lastHitAt: 0, shieldUntil: 0, hitCount: 0 }
    let shots: Shot[] = []
    let ended = false
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(rect.width * dpr))
      canvas.height = Math.max(1, Math.floor(rect.height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      left.x = rect.width * 0.27; right.x = rect.width * 0.73
      left.y = rect.height * 0.35; right.y = rect.height * 0.65
    }
    resize()
    window.addEventListener('resize', resize)
    const drawWeapon = (f: Fighter, t: number) => {
      ctx.save(); ctx.translate(f.x, f.y)
      if (f.trait === 'orbital') ctx.rotate(t / 250 * (f.side === 'left' ? 1 : -1))
      ctx.scale(f.facing, 1)
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
      const character = getCharacter(f.charId)
      const bob = Math.sin(t / 140 + (f.side === 'left' ? 0 : 2)) * 2
      ctx.save()
      ctx.shadowColor = f.color; ctx.shadowBlur = f.flash > 0 ? 28 : 16
      const grad = ctx.createRadialGradient(f.x - f.radius * .36, f.y - f.radius * .44 + bob, 2, f.x, f.y + bob, f.radius + 4)
      grad.addColorStop(0, '#ffffff'); grad.addColorStop(.18, f.color); grad.addColorStop(1, character.color)
      ctx.fillStyle = grad
      ctx.beginPath(); ctx.arc(f.x, f.y + bob, f.radius, 0, Math.PI * 2); ctx.fill()
      ctx.shadowBlur = 0; ctx.strokeStyle = '#ffffffaa'; ctx.lineWidth = 2; ctx.stroke()
      ctx.fillStyle = '#101326'; ctx.beginPath(); ctx.arc(f.x + f.facing * f.radius * .26, f.y - 5 + bob, Math.max(3, f.radius * .15), 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(f.x + f.facing * f.radius * .3, f.y - 6 + bob, Math.max(1.2, f.radius * .055), 0, Math.PI * 2); ctx.fill()
      ctx.font = `900 ${Math.max(10, f.radius * 0.72)}px system-ui`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillStyle = '#101326'; ctx.fillText(({horus:'♜',set:'☼',bastet:'☾',sekhmet:'☀',thoth:'𓅝',ra:'☀',neith:'✳',isis:'𓋹',anhur:'➶',sobek:'≈',ptah:'◇',nut:'✦',wepwawet:'⌁',hathor:'♫',osiris:'♜',khepri:'✺'} as Record<string,string>)[f.charId] || '✦', f.x, f.y + bob + 1)
      ctx.restore()
      drawWeapon(f, t)
    }
    const applyHit = (attacker: Fighter, target: Fighter, rawDamage: number, kind: 'melee' | 'projectile' | 'orbital', angle: number) => {
      const attackerId = attacker.charId
      const targetId = target.charId
      let damage = rawDamage * (attacker.subTrait === 'offense' ? 1.2 : 1) * (attacker.category === 'elemental' ? 1.05 : 1)
      if (attackerId === 'horus') damage *= 1 + Math.min(0.15, Math.hypot(attacker.vx, attacker.vy) / 60)
      if (attackerId === 'thoth' && kind === 'projectile') damage *= 1.05
      if (attackerId === 'anhur' && kind === 'orbital') damage *= 1.08
      if (targetId === 'bastet') damage *= 0.82
      if (targetId === 'nut' && kind === 'projectile') damage *= 0.8
      if (targetId === 'khepri' && target.shieldUntil > 0) damage *= 0.75
      if (targetId === 'sekhmet') damage *= 0.9
      if (targetId === 'neith' && target.shieldUntil > 0) damage *= 0.85
      if (target.trait === 'survive') damage *= 0.9
      else if (target.subTrait === 'defense') damage *= 0.88
      if (target.weapon === 'shield') damage *= 0.72
      target.hp = Math.max(0, target.hp - damage)
      target.flash = 10
      target.lastHitAt = performance.now()
      target.hitCount++
      target.vx += Math.cos(angle) * (attackerId === 'sobek' ? 7 : 4.5)
      target.vy += Math.sin(angle) * (attackerId === 'sobek' ? 7 : 4.5)
      if (attacker.category === 'elemental' || attackerId === 'set' || attackerId === 'ra' || attackerId === 'hathor' || attackerId === 'khepri') {
        target.burn = Math.max(target.burn, attackerId === 'set' ? 150 : 95)
      }
      if (attackerId === 'hathor') attacker.hp = Math.min(attacker.maxHp, attacker.hp + damage * 0.08)
      if (attackerId === 'isis' && kind === 'projectile') { attacker.hp = Math.min(attacker.maxHp, attacker.hp + 2); attacker.shieldUntil = 75 }
      if (targetId === 'sekhmet') attacker.hp = Math.max(0, attacker.hp - damage * 0.15)
      if (targetId === 'neith') target.shieldUntil = 90
      if (targetId === 'ptah' && kind === 'projectile') { target.vx += Math.cos(angle) * 1.5; target.vy += Math.sin(angle) * 1.5 }
      if (attackerId === 'sobek' && attacker.hitCount % 3 === 0) { target.vx += Math.cos(angle) * 2.5; target.vy += Math.sin(angle) * 2.5 }
      if (attackerId === 'ra' && kind === 'projectile') {
        const splashRadius = 46
        if (Math.hypot(target.x - attacker.x, target.y - attacker.y) < 300) target.flash = 12
        // The solar impact adds a modest burst, capped to avoid one-shot explosions.
        target.hp = Math.max(0, target.hp - Math.min(3, damage * 0.18))
      }
      if (attackerId === 'wepwawet' && attacker.bounceCount % 2 === 0) attacker.hp = Math.min(attacker.maxHp, attacker.hp + 1.5)
      if (attackerId === 'osiris' && attacker.hp < 35) attacker.shieldUntil = 90
      if (attackerId === 'khepri' && attacker.bounceCount > 0 && attacker.bounceCount % 4 === 0) {
        target.hp = Math.max(0, target.hp - 2.5)
        attacker.shieldUntil = 100
      }
    }
    const attack = (f: Fighter, other: Fighter) => {
      const spec = WEAPONS[f.weapon]
      if (f.cooldown > 0) return
      f.cooldown = f.weapon === 'daggers' ? 20 : f.weapon === 'wand' ? 38 : 32
      if (f.weapon === 'wand') {
        const projectileSpeed = f.charId === 'thoth' ? 9.2 : f.charId === 'ra' ? 6.2 : 7.8
        shots.push({ x: f.x + f.facing * 36, y: f.y - 8, vx: f.facing * projectileSpeed, vy: (other.y - f.y) * (f.charId === 'thoth' ? .035 : .025), life: f.charId === 'thoth' ? 105 : 95, owner: f.side, color: f.charId === 'ra' ? '#ffcf57' : spec.color, radius: f.charId === 'ra' ? 11 : 9 })
        return
      }
      const dx = other.x - f.x, dy = other.y - f.y
      if (Math.abs(dx) < spec.reach + (f.trait === 'range' ? 75 : 0) && Math.abs(dy) < (f.weapon === 'scythe' ? 92 : 58) && Math.sign(dx || f.facing) === f.facing) {
        const baseDamage = spec.damage * (f.trait === 'melee' && distanceBetween(f, other) < 90 ? 1.15 : 1)
        applyHit(f, other, baseDamage, 'melee', Math.atan2(other.y - f.y, other.x - f.x))
        other.vx += f.facing * (f.weapon === 'shield' ? 3 : f.weapon === 'scythe' ? 2.5 : 1.5)
        other.vy -= f.weapon === 'shield' ? 2 : 1
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
      ctx.fillStyle = left.color; ctx.fillText(left.name + ' • ' + getCharacter(left.charId).epithet.toUpperCase(), w*.25, 24)
      ctx.fillStyle = right.color; ctx.fillText(right.name + ' • ' + getCharacter(right.charId).epithet.toUpperCase(), w*.75, 24)
      const floor = h - 24
      ctx.strokeStyle = '#ffffff44'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0,floor); ctx.lineTo(w,floor); ctx.stroke()
      ctx.fillStyle = '#ffffff0d'; ctx.fillRect(0,floor,w,24)
      if (playing && !ended) {
        const step = (f: Fighter, other: Fighter) => {
          const dx = other.x - f.x
          const dy = other.y - f.y
          const distance = Math.max(1, Math.hypot(dx, dy))
          const spec = WEAPONS[f.weapon]

          // Face the opponent for weapon visuals only; movement is physics-only.
          f.facing = dx >= 0 ? 1 : -1

          // Orbital trait: the weapon physically sweeps around the ball; contact causes damage.
          if (f.trait === 'orbital') {
            const angle = now / 250 * (f.side === 'left' ? 1 : -1)
            const tipX = f.x + Math.cos(angle) * (f.radius + 36)
            const tipY = f.y + Math.sin(angle) * (f.radius + 36)
            if (Math.hypot(other.x - tipX, other.y - tipY) < other.radius + 13 && f.cooldown <= 0) {
              const raw = spec.damage * (f.charId === 'anhur' ? 0.9 : 1)
              applyHit(f, other, raw, 'orbital', angle)
              f.cooldown = f.category === 'speedster' ? 12 : 20
            }
          } else if (distance <= (spec.reach + (f.trait === 'range' ? 75 : 0) + f.radius * .35) || f.weapon === 'wand') attack(f, other)

          // No gravity, steering AI, or random jumps: preserve momentum and bounce
          // off all four arena boundaries.
          const speedCap = f.category === 'speedster' ? 9 : 7
          f.vx = Math.max(-speedCap, Math.min(speedCap, f.vx))
          f.vy = Math.max(-speedCap, Math.min(speedCap, f.vy))
          // Perfectly elastic arena bounce: never damp velocity, so motion continues indefinitely.
          f.x += f.vx * dt
          f.y += f.vy * dt

          let bounced = false
          if (f.x < f.radius) { f.x = f.radius; f.vx = Math.abs(f.vx); bounced = true }
          if (f.x > w - f.radius) { f.x = w - f.radius; f.vx = -Math.abs(f.vx); bounced = true }
          if (f.y < 55 + f.radius) { f.y = 55 + f.radius; f.vy = Math.abs(f.vy); bounced = true }
          if (f.y > floor - f.radius) { f.y = floor - f.radius; f.vy = -Math.abs(f.vy); bounced = true }
          if (bounced) {
            f.bounceCount++
            if (f.charId === 'ptah') { f.vx *= 1.025; f.vy *= 1.025 }
            if (f.charId === 'wepwawet' && f.bounceCount % 2 === 0) f.hp = Math.min(f.maxHp, f.hp + 1.2)
            if (f.charId === 'khepri' && f.bounceCount % 4 === 0) { f.shieldUntil = 100; f.flash = 5 }
          }
          if (f.charId === 'osiris' && now - f.lastHitAt > 2000) f.hp = Math.min(f.maxHp, f.hp + 0.035 * dt)
          if (f.shieldUntil > 0) f.shieldUntil = Math.max(0, f.shieldUntil - dt)
          if (f.trait === 'survive') f.hp = Math.min(f.maxHp, f.hp + 0.012 * dt)
          if (f.burn > 0) { f.hp = Math.max(0, f.hp - 0.055 * dt); f.burn = Math.max(0, f.burn - dt) }
          f.cooldown = Math.max(0, f.cooldown - dt)
          f.flash = Math.max(0, f.flash - dt)
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
            const attacker = s.owner === 'left' ? left : right
            const angle = Math.atan2(target.y - s.y, target.x - s.x)
            applyHit(attacker, target, WEAPONS.wand.damage, 'projectile', angle)
            if (attacker.charId === 'thoth') {
              // Thoth's measured moonshot ricochets once from an arena edge.
              if (s.life > 40 && s.radius > 0) { s.vx *= -1; s.life = Math.min(s.life, 40); s.radius = 6; continue }
            }
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
  }, [leftCharacter,rightCharacter,leftWeapon,rightWeapon,leftColor,rightColor,leftName,rightName,leftRadius,rightRadius,leftTrait,rightTrait,leftSubTrait,rightSubTrait,leftCategory,rightCategory,playing,roundKey,winner])

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
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"/> AUTO BATTLE <span className="hidden sm:inline">• PHYSICS VS WEAPONS</span></div>
        </header>

        <section className="mb-5 rounded-2xl border border-fuchsia-300/20 bg-white/[.04] p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2"><Sparkles size={18} className="text-fuchsia-200"/><div><h2 className="text-sm font-black tracking-[.2em]">EGYPTIAN CELLestial ROSTER</h2><p className="mt-1 text-xs text-slate-400">Pilih salah satu dari 16 Cellestial Egyptian; identitas, warna, senjata legendaris, dan kemampuan khasnya diterapkan ke simulasi.</p></div></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-cyan-200/15 bg-black/20 p-4">
              <div className="mb-3 flex items-center gap-3"><div className="h-12 w-12 rounded-full border-2 border-white/60 shadow-lg" style={{background:leftColor,boxShadow:`0 0 22px ${leftColor}`}}/><div><p className="text-xs font-black tracking-widest text-cyan-200">BALL 01</p><p className="text-[11px] text-slate-400">Petarung kiri</p></div></div>
              <label className="mb-1 block text-xs font-bold text-slate-300">Nama bola</label><input maxLength={14} value={leftName} onChange={e=>setLeftName(e.target.value.toUpperCase())} placeholder="NOVA" className="mb-3 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-cyan-300/60"/>
              <div className="mb-3 flex items-center justify-between gap-3"><label className="text-xs font-bold text-slate-300">Warna inti</label><input aria-label="Warna bola 1" type="color" value={leftColor} onChange={e=>setLeftColor(e.target.value)} className="h-9 w-14 cursor-pointer rounded bg-transparent"/></div>
              <div className="mb-3 flex items-center justify-between gap-3"><label className="text-xs font-bold text-slate-300">Ukuran <span className="font-mono text-cyan-200">{leftRadius}px</span></label><input aria-label="Ukuran bola 1" type="range" min={21} max={36} value={leftRadius} onChange={e=>setLeftRadius(Number(e.target.value))} className="w-28 accent-cyan-300"/></div>
              <label className="mb-3 block text-xs text-slate-300">Karakter Egyptian <select value={leftCharacter} onChange={e=>{const c=getCharacter(e.target.value);setLeftCharacter(c.id);setLeftName(c.name);setLeftColor(c.color);setLeftWeapon(c.weapon);setLeftTrait(c.trait);setLeftSubTrait(c.subTrait);setLeftCategory(c.category);setRoundKey(n=>n+1);setWinner(null);setLeftHp(100);setRightHp(100)}} className="mt-1 w-full rounded-lg border border-amber-300/20 bg-[#17182b] px-2 py-2 text-xs">{EGYPTIAN_CHARACTERS.map(c=><option key={c.id} value={c.id}>{c.name} — {c.epithet}</option>)}</select><span className="mt-1 block text-[10px] text-amber-200">{getCharacter(leftCharacter).legendaryWeapon}</span><span className="mt-1 block text-[10px] leading-4 text-slate-400">{getCharacter(leftCharacter).lore} {getCharacter(leftCharacter).visual} {getCharacter(leftCharacter).mechanic}</span></label>
              <label className="block text-xs text-slate-300">Cellestial Class <select value={`${leftTrait}-${leftSubTrait}-${leftCategory}`} onChange={e=>{const selected=CELESTIAL_CLASSES.find(item=>item.value===e.target.value);if(!selected)return;setLeftTrait(selected.trait);setLeftSubTrait(selected.subTrait);setLeftCategory(selected.category);setRoundKey(n=>n+1);setWinner(null);setLeftHp(100);setRightHp(100)}} className="mt-1 w-full rounded-lg border border-fuchsia-300/20 bg-[#17182b] px-2 py-2 text-xs">{CELESTIAL_CLASSES.map(item=><option key={item.value} value={item.value}>{item.label}</option>)}</select><span className="mt-1 block text-[10px] text-slate-500">16 kombinasi Trait × Sub-trait × Sub-category</span></label>
            </div>
            <div className="rounded-xl border border-pink-200/15 bg-black/20 p-4">
              <div className="mb-3 flex items-center gap-3"><div className="h-12 w-12 rounded-full border-2 border-white/60 shadow-lg" style={{background:rightColor,boxShadow:`0 0 22px ${rightColor}`}}/><div><p className="text-xs font-black tracking-widest text-pink-200">BALL 02</p><p className="text-[11px] text-slate-400">Petarung kanan</p></div></div>
              <label className="mb-1 block text-xs font-bold text-slate-300">Nama bola</label><input maxLength={14} value={rightName} onChange={e=>setRightName(e.target.value.toUpperCase())} placeholder="RAVEN" className="mb-3 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-pink-300/60"/>
              <div className="mb-3 flex items-center justify-between gap-3"><label className="text-xs font-bold text-slate-300">Warna inti</label><input aria-label="Warna bola 2" type="color" value={rightColor} onChange={e=>setRightColor(e.target.value)} className="h-9 w-14 cursor-pointer rounded bg-transparent"/></div>
              <div className="mb-3 flex items-center justify-between gap-3"><label className="text-xs font-bold text-slate-300">Ukuran <span className="font-mono text-pink-200">{rightRadius}px</span></label><input aria-label="Ukuran bola 2" type="range" min={21} max={36} value={rightRadius} onChange={e=>setRightRadius(Number(e.target.value))} className="w-28 accent-pink-300"/></div>
              <label className="mb-3 block text-xs text-slate-300">Karakter Egyptian <select value={rightCharacter} onChange={e=>{const c=getCharacter(e.target.value);setRightCharacter(c.id);setRightName(c.name);setRightColor(c.color);setRightWeapon(c.weapon);setRightTrait(c.trait);setRightSubTrait(c.subTrait);setRightCategory(c.category);setRoundKey(n=>n+1);setWinner(null);setLeftHp(100);setRightHp(100)}} className="mt-1 w-full rounded-lg border border-amber-300/20 bg-[#17182b] px-2 py-2 text-xs">{EGYPTIAN_CHARACTERS.map(c=><option key={c.id} value={c.id}>{c.name} — {c.epithet}</option>)}</select><span className="mt-1 block text-[10px] text-amber-200">{getCharacter(rightCharacter).legendaryWeapon}</span><span className="mt-1 block text-[10px] leading-4 text-slate-400">{getCharacter(rightCharacter).lore} {getCharacter(rightCharacter).visual} {getCharacter(rightCharacter).mechanic}</span></label>
              <label className="block text-xs text-slate-300">Cellestial Class <select value={`${rightTrait}-${rightSubTrait}-${rightCategory}`} onChange={e=>{const selected=CELESTIAL_CLASSES.find(item=>item.value===e.target.value);if(!selected)return;setRightTrait(selected.trait);setRightSubTrait(selected.subTrait);setRightCategory(selected.category);setRoundKey(n=>n+1);setWinner(null);setLeftHp(100);setRightHp(100)}} className="mt-1 w-full rounded-lg border border-fuchsia-300/20 bg-[#17182b] px-2 py-2 text-xs">{CELESTIAL_CLASSES.map(item=><option key={item.value} value={item.value}>{item.label}</option>)}</select><span className="mt-1 block text-[10px] text-slate-500">16 kombinasi Trait × Sub-trait × Sub-category</span></label>
            </div>
          </div>
        </section>

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
          <canvas ref={canvasRef} className="block h-[340px] w-full sm:h-[430px] md:h-[490px]" aria-label="Arena game Tools Wars: bola memantul tanpa gravitasi dan senjata menyerang otomatis."/>
          <div className="border-t border-white/10 bg-black/20 px-4 py-3 text-center text-xs text-slate-400">EGYPTIAN CELLestial · 16 karakter dengan pasif khas, visual emblem, serangan otomatis, dan fisika pantulan tanpa gravitasi.</div>
        </section>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[.035] p-4"><Sparkles size={20} className="mt-0.5 shrink-0 text-amber-200"/><div><p className="text-sm font-bold">Atur matchup, lalu saksikan pertarungan.</p><p className="mt-1 text-xs leading-5 text-slate-400">Bola bergerak hanya berdasarkan momentum dan pantulan arena. Senjata menyerang otomatis saat lawan masuk jangkauan.</p></div></div>
          <button onClick={resetRound} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-7 py-4 text-sm font-black tracking-wide text-[#090b17] shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.02] active:scale-[.98]"><RotateCcw size={18}/>{winner ? 'REMATCH' : playing ? 'RESET & FIGHT' : 'MULAI PERTARUNGAN'}</button>
        </div>

        <section className="mt-5 rounded-2xl border border-white/10 bg-white/[.03] p-4 sm:p-5"><div className="mb-3 flex items-center gap-2"><Trophy size={17} className="text-amber-300"/><h2 className="text-xs font-black tracking-[.25em] text-slate-300">ARSENAL / QUICK GUIDE</h2></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{OPTIONS.map(w=><div key={w} className="flex gap-3 rounded-xl border border-white/5 bg-black/10 p-3"><span className="text-2xl">{WEAPONS[w].icon}</span><div><p className="text-sm font-extrabold" style={{color:WEAPONS[w].color}}>{WEAPONS[w].label}</p><p className="mt-1 text-xs leading-5 text-slate-400">{WEAPONS[w].description}</p></div></div>)}</div></section>
        <footer className="py-6 text-center text-[10px] tracking-[.22em] text-slate-600">TOOLS WARS · AUTO WEAPON BALL SIMULATOR · BUILT TO BOUNCE</footer>
      </div>
    </main>
  )
}
