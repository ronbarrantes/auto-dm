import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Check, ChevronRight, Dices, Heart, Minus, Plus, RotateCcw, Sparkles, Swords } from 'lucide-react'
import monsterTriptych from '../assets/monster-triptych.jpg'
import {
  createAdventure,
  dice,
  getActorOrder,
  getHeroStats,
  heroClasses,
  type Adventure,
  type Die,
  type Heritage,
  type Hero,
  type HeroClassId,
} from '../game/rules'

export const Route = createFileRoute('/')({ component: App })

const heritages: Heritage[] = ['Human', 'Elf', 'Dwarf', 'Halfling']
const themes = ['Crystal Cave', 'Forgotten Castle', 'Mossy Ruins']

function createHero(id: string, name: string, classId: HeroClassId, heritage: Heritage): Hero {
  return { id, name, classId, heritage }
}

function App() {
  const [heroes, setHeroes] = useState<Hero[]>([createHero('hero-1', 'Ava', 'wizard', 'Elf')])
  const [name, setName] = useState('Max')
  const [classId, setClassId] = useState<HeroClassId>('paladin')
  const [heritage, setHeritage] = useState<Heritage>('Human')
  const [rooms, setRooms] = useState(4)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [diceKit, setDiceKit] = useState<Die[]>(['d6', 'd8'])
  const [mobs, setMobs] = useState(true)
  const [theme, setTheme] = useState(themes[0])
  const [adventure, setAdventure] = useState<Adventure | null>(null)
  const [roomIndex, setRoomIndex] = useState(0)
  const [round, setRound] = useState(1)
  const [actorIndex, setActorIndex] = useState(0)
  const [health, setHealth] = useState<Record<string, number>>({})
  const [rollPrompt, setRollPrompt] = useState('Pick an action, then roll a real die at the table.')

  const encounter = adventure?.encounters[roomIndex]
  const actors = adventure && encounter ? getActorOrder(adventure, encounter) : []
  const actor = actors[actorIndex]

  const addHero = () => {
    const trimmedName = name.trim() || `Hero ${heroes.length + 1}`
    setHeroes((current) => [...current, createHero(`hero-${Date.now()}`, trimmedName, classId, heritage)])
    setName('')
  }

  const removeHero = (heroId: string) => {
    if (heroes.length > 1) setHeroes((current) => current.filter((hero) => hero.id !== heroId))
  }

  const toggleDie = (die: Die) => {
    setDiceKit((current) => {
      if (current.includes(die)) return current.length > 1 ? current.filter((item) => item !== die) : current
      return [...current, die].sort((a, b) => dice.indexOf(a) - dice.indexOf(b))
    })
  }

  const startAdventure = () => {
    const nextAdventure = createAdventure({ heroes, rooms, difficulty, diceKit, mobs, theme })
    const startingHealth: Record<string, number> = {}

    heroes.forEach((hero) => {
      startingHealth[hero.id] = heroClasses[hero.classId].health
    })
    nextAdventure.encounters.forEach((nextEncounter) => {
      nextEncounter.monsters.forEach((monster) => {
        startingHealth[monster.id] = monster.health
      })
    })

    setAdventure(nextAdventure)
    setHealth(startingHealth)
    setRoomIndex(0)
    setRound(1)
    setActorIndex(0)
    setRollPrompt(`Room 1 is ready. Roll d20: ${nextAdventure.targetRoll}+ means your action works.`)
  }

  const updateHealth = (id: string, amount: number) => {
    setHealth((current) => ({ ...current, [id]: Math.max(0, (current[id] ?? 0) + amount) }))
  }

  const endTurn = () => {
    if (!actors.length) return
    const nextIndex = actorIndex + 1
    if (nextIndex === actors.length) {
      setActorIndex(0)
      setRound((current) => current + 1)
      setRollPrompt('A new combat round begins. Check who acts first.')
      return
    }
    setActorIndex(nextIndex)
    setRollPrompt('Choose an action, roll the die on the card, then apply the result.')
  }

  const nextRoom = () => {
    if (!adventure || roomIndex >= adventure.encounters.length - 1) return
    setRoomIndex((current) => current + 1)
    setRound(1)
    setActorIndex(0)
    setRollPrompt(`Room ${roomIndex + 2} is ready. Take a breath, then begin a new combat round.`)
  }

  if (!adventure || !encounter) {
    return (
      <main className="app-frame app-main">
        <section className="welcome-panel rise-in">
          <div>
            <p className="eyebrow">Your real dice. Your real table.</p>
            <h1>Make tonight's dungeon feel just right.</h1>
            <p className="welcome-panel__copy">Create heroes, pick the dice you actually want to use, and Auto DM builds simple monster cards for your adventure.</p>
          </div>
          <div className="welcome-panel__emblem" aria-hidden="true"><Dices size={46} /></div>
        </section>

        <section className="setup-grid" aria-label="Adventure setup">
          <div className="setup-card setup-card--heroes rise-in" style={{ animationDelay: '90ms' }}>
            <div className="section-heading">
              <div><p className="eyebrow">Step 1</p><h2>Build your party</h2></div>
              <span className="count-badge">{heroes.length} hero{heroes.length === 1 ? '' : 'es'}</span>
            </div>
            <div className="hero-list">
              {heroes.map((hero) => {
                const heroClass = heroClasses[hero.classId]
                return (
                  <article className="hero-chip" key={hero.id}>
                    <span className="hero-chip__icon">{heroClass.icon}</span>
                    <span><strong>{hero.name}</strong><small>{hero.heritage} {heroClass.label}</small></span>
                    <button className="icon-button" disabled={heroes.length === 1} onClick={() => removeHero(hero.id)} aria-label={`Remove ${hero.name}`}>×</button>
                  </article>
                )
              })}
            </div>
            <div className="hero-form">
              <label><span>Hero name</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="New hero" /></label>
              <label><span>Class</span><select value={classId} onChange={(event) => setClassId(event.target.value as HeroClassId)}>{Object.entries(heroClasses).map(([id, heroClass]) => <option key={id} value={id}>{heroClass.icon} {heroClass.label} - {heroClass.role}</option>)}</select></label>
              <label><span>Heritage</span><select value={heritage} onChange={(event) => setHeritage(event.target.value as Heritage)}>{heritages.map((option) => <option key={option}>{option}</option>)}</select></label>
              <button className="secondary-button" onClick={addHero}><Plus size={17} /> Add hero</button>
            </div>
          </div>

          <div className="setup-card rise-in" style={{ animationDelay: '160ms' }}>
            <div className="section-heading"><div><p className="eyebrow">Step 2</p><h2>Choose the adventure</h2></div></div>
            <div className="settings-stack">
              <label><span>Dungeon feeling</span><select value={theme} onChange={(event) => setTheme(event.target.value)}>{themes.map((option) => <option key={option}>{option}</option>)}</select></label>
              <label><span>Number of rooms <b>{rooms}</b></span><input type="range" min="3" max="7" value={rooms} onChange={(event) => setRooms(Number(event.target.value))} /><small>One final room is always the boss.</small></label>
              <fieldset><legend>How hard should it feel?</legend><div className="choice-row">{(['easy', 'medium', 'hard'] as const).map((option) => <button className={difficulty === option ? 'choice-card is-selected' : 'choice-card'} key={option} onClick={() => setDifficulty(option)}><strong>{option}</strong><small>{option === 'easy' ? 'A gentle start' : option === 'medium' ? 'Brave and balanced' : 'A big challenge'}</small></button>)}</div></fieldset>
              <label className="toggle-row"><span><b>Let monsters appear in mobs</b><small>For example, three goblins in one room.</small></span><input type="checkbox" checked={mobs} onChange={(event) => setMobs(event.target.checked)} /><i aria-hidden="true" /></label>
            </div>
          </div>

          <div className="setup-card setup-card--dice rise-in" style={{ animationDelay: '230ms' }}>
            <div className="section-heading"><div><p className="eyebrow">Step 3</p><h2>Pick your Dice Kit</h2><p>Auto DM will only use selected dice on cards.</p></div></div>
            <div className="die-kit"><span className="die-token die-token--fixed">d20 <Check size={14} /></span>{dice.map((die) => <button className={diceKit.includes(die) ? 'die-token is-selected' : 'die-token'} onClick={() => toggleDie(die)} key={die}>{die}</button>)}</div>
            <p className="tip-box"><Sparkles size={18} /> d20 decides if an action works. Your selected dice decide damage and healing.</p>
            <button className="primary-button" onClick={startAdventure}>Build my dungeon <ChevronRight size={19} /></button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="app-frame app-main adventure-view">
      <section className="adventure-topline rise-in">
        <div><p className="eyebrow">{adventure.theme} · {difficulty} mode</p><h1>{encounter.title}</h1><p>{encounter.intro}</p></div>
        <button className="secondary-button" onClick={() => setAdventure(null)}><RotateCcw size={17} /> New adventure</button>
      </section>

      <section className="room-trail" aria-label="Dungeon rooms">
        {adventure.encounters.map((item, index) => <button onClick={() => { setRoomIndex(index); setRound(1); setActorIndex(0) }} className={index === roomIndex ? 'room-dot is-current' : index < roomIndex ? 'room-dot is-complete' : 'room-dot'} key={item.id}><span>{item.isBoss ? '★' : item.room}</span><small>{item.isBoss ? 'Boss' : `Room ${item.room}`}</small></button>)}
      </section>

      <section className="combat-layout">
        <div className="combat-stage rise-in">
          <div className="round-banner"><span>Combat round</span><strong>{round}</strong><small>Roll d20: {adventure.targetRoll}+ works</small></div>
          <div className="turn-card">
            <p className="eyebrow">Acting now</p>
            <div className="turn-card__name"><span>{actor?.icon}</span><div><h2>{actor?.name}</h2><p>{actor?.kind === 'hero' ? 'Choose an action.' : 'Choose a target, then roll for the monster.'}</p></div></div>
            {actor?.kind === 'hero' ? <HeroActions hero={adventure.heroes.find((hero) => hero.id === actor.id)!} diceKit={adventure.diceKit} targetRoll={adventure.targetRoll} onPrompt={setRollPrompt} /> : <MonsterActions monster={encounter.monsters.find((monster) => monster.id === actor?.id)!} targetRoll={adventure.targetRoll} onPrompt={setRollPrompt} />}
            <div className="roll-callout"><Dices size={20} /><span>{rollPrompt}</span></div>
            <button className="primary-button" onClick={endTurn}>Finish turn <ChevronRight size={19} /></button>
          </div>
        </div>

        <aside className="combat-sidebar rise-in" style={{ animationDelay: '80ms' }}>
          <div className="sidebar-heading"><div><p className="eyebrow">The heroes</p><h2>Keep everyone in the story</h2></div></div>
          {adventure.heroes.map((hero) => <HealthCard key={hero.id} icon={heroClasses[hero.classId].icon} name={hero.name} subtitle={`${hero.heritage} ${heroClasses[hero.classId].label}`} health={health[hero.id] ?? 0} maxHealth={heroClasses[hero.classId].health} onChange={(amount) => updateHealth(hero.id, amount)} />)}
        </aside>
      </section>

      <section className="monster-section rise-in" style={{ animationDelay: '150ms' }}>
        <div className="section-heading"><div><p className="eyebrow">Monster cards</p><h2>What the table needs right now</h2></div><span className="count-badge">{encounter.monsters.length} foe{encounter.monsters.length === 1 ? '' : 's'}</span></div>
        <div className="monster-grid">{encounter.monsters.map((monster) => <MonsterCard key={monster.id} monster={monster} health={health[monster.id] ?? 0} onChange={(amount) => updateHealth(monster.id, amount)} />)}</div>
        <div className="room-next"><p>{roomIndex === adventure.encounters.length - 1 ? 'The final boss is here. Tell the ending your table earns.' : 'When the room feels complete, move deeper into the dungeon.'}</p>{roomIndex < adventure.encounters.length - 1 && <button className="secondary-button" onClick={nextRoom}>Go to room {roomIndex + 2} <ChevronRight size={17} /></button>}</div>
      </section>
    </main>
  )
}

function HeroActions({ hero, diceKit, targetRoll, onPrompt }: { hero: Hero; diceKit: Die[]; targetRoll: number; onPrompt: (message: string) => void }) {
  const stats = getHeroStats(hero, diceKit)
  return <div className="action-grid"><button onClick={() => onPrompt(`Standard attack: roll d20. ${targetRoll}+ hits, then roll ${stats.damageDie} for damage.`)}><Swords size={18} /><span><b>Standard attack</b><small>d20, then {stats.damageDie}</small></span></button><button onClick={() => onPrompt(`${stats.label}'s special move: ${stats.action}`)}><Sparkles size={18} /><span><b>Signature move</b><small>{stats.action}</small></span></button><button onClick={() => onPrompt('Use an item: read the item card, then follow its die instruction.')}><Heart size={18} /><span><b>Use an item</b><small>Potions, shields, and tools</small></span></button></div>
}

function MonsterActions({ monster, targetRoll, onPrompt }: { monster: Adventure['encounters'][number]['monsters'][number]; targetRoll: number; onPrompt: (message: string) => void }) {
  return <div className="action-grid"><button onClick={() => onPrompt(`${monster.action}: pick a hero, roll d20. ${targetRoll}+ hits, then roll ${monster.damageDie}.`)}><Swords size={18} /><span><b>{monster.action}</b><small>d20, then {monster.damageDie}</small></span></button><button onClick={() => onPrompt(monster.special)}><Sparkles size={18} /><span><b>Special move</b><small>{monster.special}</small></span></button></div>
}

function HealthCard({ icon, name, subtitle, health, maxHealth, onChange }: { icon: string; name: string; subtitle: string; health: number; maxHealth: number; onChange: (amount: number) => void }) {
  return <article className="health-card"><span className="health-card__icon">{icon}</span><div className="health-card__copy"><strong>{name}</strong><small>{subtitle}</small><div className="health-meter"><span style={{ width: `${Math.max(0, Math.min(100, health / maxHealth * 100))}%` }} /></div></div><div className="health-controls"><button onClick={() => onChange(-1)} aria-label={`Reduce ${name} health`}><Minus size={14} /></button><b>{health}</b><button onClick={() => onChange(1)} aria-label={`Increase ${name} health`}><Plus size={14} /></button></div></article>
}

function MonsterCard({ monster, health, onChange }: { monster: Adventure['encounters'][number]['monsters'][number]; health: number; onChange: (amount: number) => void }) {
  const position = monster.art === 'goblin' ? 'left center' : monster.art === 'skeleton' ? 'center center' : monster.art === 'slime' ? 'right center' : 'center center'
  return <article className={monster.isBoss ? 'monster-card monster-card--boss' : 'monster-card'}><div className="monster-card__art" style={{ backgroundImage: `url(${monsterTriptych})`, backgroundPosition: position }}><span>{monster.icon}</span></div><div className="monster-card__body"><div className="monster-card__title"><div><p>{monster.isBoss ? 'Final boss' : 'Monster'}</p><h3>{monster.name}</h3></div><div className="mini-health"><Heart size={14} fill="currentColor" /> {health}</div></div><div className="monster-card__move"><span>On its turn</span><b>{monster.action}</b><small>Roll d20 to hit, then roll <strong>{monster.damageDie}</strong>.</small></div><div className="monster-card__special"><Sparkles size={16} /><span>{monster.special}</span></div><div className="monster-card__health"><button onClick={() => onChange(-1)} aria-label={`Reduce ${monster.name} health`}><Minus size={14} /></button><span>Health <b>{health}</b></span><button onClick={() => onChange(1)} aria-label={`Increase ${monster.name} health`}><Plus size={14} /></button></div></div></article>
}
