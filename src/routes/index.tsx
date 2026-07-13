import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  ChevronLeft,
  ChevronRight,
  Dices,
  Heart,
  Minus,
  Plus,
  Settings,
  Shield,
  Sparkles,
  Swords,
  X,
} from 'lucide-react'
import monsterGuardians from '../assets/monster-guardians.jpg'
import monsterTriptych from '../assets/monster-triptych.jpg'
import { createAdventure, dice, getHeroStats, heroClasses } from '../game/rules'
import type {
  Adventure,
  Die,
  Difficulty,
  Heritage,
  Hero,
  HeroClassId,
  Monster,
} from '../game/rules'

export const Route = createFileRoute('/')({ component: App })

const heritages: Heritage[] = ['Human', 'Elf', 'Dwarf', 'Halfling']
const themes = ['Crystal Cave', 'Forgotten Castle', 'Mossy Ruins']
type Stage = 'start' | 'heroes' | 'ready' | 'play'
type SelectedCard =
  { kind: 'monster'; id: string } | { kind: 'hero'; id: string }

function App() {
  const [stage, setStage] = useState<Stage>('start')
  const [heroCount, setHeroCount] = useState(1)
  const [rooms, setRooms] = useState(4)
  const [heroes, setHeroes] = useState<Hero[]>([])
  const [draftName, setDraftName] = useState('')
  const [draftClass, setDraftClass] = useState<HeroClassId | null>(null)
  const [draftHeritage, setDraftHeritage] = useState<Heritage>('Human')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [diceKit, setDiceKit] = useState<Die[]>(['d6', 'd8'])
  const [mobs, setMobs] = useState(true)
  const [theme, setTheme] = useState(themes[0])
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [adventure, setAdventure] = useState<Adventure | null>(null)
  const [roomIndex, setRoomIndex] = useState(0)
  const [round, setRound] = useState(1)
  const [selectedCard, setSelectedCard] = useState<SelectedCard | null>(null)
  const [health, setHealth] = useState<Record<string, number>>({})

  const encounter = adventure?.encounters[roomIndex]

  const toggleDie = (die: Die) => {
    setDiceKit((current) => {
      if (current.includes(die))
        return current.length > 1
          ? current.filter((item) => item !== die)
          : current
      return [...current, die].sort((a, b) => dice.indexOf(a) - dice.indexOf(b))
    })
  }

  const beginHeroes = () => {
    setHeroes([])
    setDraftName('')
    setDraftClass(null)
    setDraftHeritage('Human')
    setStage('heroes')
  }

  const saveHero = () => {
    if (!draftClass) return
    const number = heroes.length + 1
    const hero: Hero = {
      id: `hero-${number}-${Date.now()}`,
      name: draftName.trim() || `Hero ${number}`,
      classId: draftClass,
      heritage: draftHeritage,
    }
    const next = [...heroes, hero]
    setHeroes(next)
    if (next.length === heroCount) {
      setStage('ready')
      return
    }
    setDraftName('')
    setDraftClass(null)
    setDraftHeritage('Human')
  }

  const startAdventure = () => {
    const nextAdventure = createAdventure({
      heroes,
      rooms,
      difficulty,
      diceKit,
      mobs,
      theme,
    })
    const nextHealth: Record<string, number> = {}
    heroes.forEach((hero) => {
      nextHealth[hero.id] = heroClasses[hero.classId].health
    })
    nextAdventure.encounters.forEach((nextEncounter) => {
      nextEncounter.monsters.forEach((monster) => {
        nextHealth[monster.id] = monster.health
      })
    })
    setAdventure(nextAdventure)
    setHealth(nextHealth)
    setRoomIndex(0)
    setRound(1)
    setSelectedCard({
      kind: 'monster',
      id: nextAdventure.encounters[0].monsters[0].id,
    })
    setStage('play')
  }

  const updateHealth = (id: string, amount: number) => {
    setHealth((current) => ({
      ...current,
      [id]: Math.max(0, (current[id] ?? 0) + amount),
    }))
  }

  const nextRoom = () => {
    if (!adventure || roomIndex === adventure.encounters.length - 1) return
    const nextIndex = roomIndex + 1
    const nextEncounter = adventure.encounters[nextIndex]
    setRoomIndex(nextIndex)
    setRound(1)
    setSelectedCard({ kind: 'monster', id: nextEncounter.monsters[0].id })
  }

  const selected = getSelectedCard(selectedCard, adventure, encounter)

  return (
    <main
      className={
        stage === 'play' ? 'game-shell game-shell--play' : 'game-shell'
      }
    >
      <button
        className="corner-settings"
        onClick={() => setSettingsOpen(true)}
        aria-label="Open settings"
      >
        <Settings size={21} />
      </button>
      {stage === 'start' && (
        <StartScreen
          heroCount={heroCount}
          rooms={rooms}
          onHeroCount={setHeroCount}
          onRooms={setRooms}
          onContinue={beginHeroes}
        />
      )}
      {stage === 'heroes' && (
        <HeroScreen
          current={heroes.length + 1}
          total={heroCount}
          name={draftName}
          classId={draftClass}
          heritage={draftHeritage}
          onName={setDraftName}
          onClass={setDraftClass}
          onHeritage={setDraftHeritage}
          onBack={() => setStage('start')}
          onContinue={saveHero}
        />
      )}
      {stage === 'ready' && (
        <ReadyScreen
          heroes={heroes}
          rooms={rooms}
          theme={theme}
          onBack={() => setStage('heroes')}
          onStart={startAdventure}
        />
      )}
      {stage === 'play' && adventure && encounter && selected && (
        <PlayScreen
          adventure={adventure}
          encounter={encounter}
          roomIndex={roomIndex}
          round={round}
          selected={selected}
          health={health}
          onSelect={setSelectedCard}
          onHealth={updateHealth}
          onRound={() => setRound((current) => current + 1)}
          onNextRoom={nextRoom}
        />
      )}
      {settingsOpen && (
        <SettingsPanel
          difficulty={difficulty}
          diceKit={diceKit}
          mobs={mobs}
          theme={theme}
          onDifficulty={setDifficulty}
          onToggleDie={toggleDie}
          onMobs={setMobs}
          onTheme={setTheme}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </main>
  )
}

function StartScreen({
  heroCount,
  rooms,
  onHeroCount,
  onRooms,
  onContinue,
}: {
  heroCount: number
  rooms: number
  onHeroCount: (value: number) => void
  onRooms: (value: number) => void
  onContinue: () => void
}) {
  return (
    <section className="setup-screen">
      <div className="setup-heading">
        <p className="kicker">A real-dice dungeon helper</p>
        <h1>Set the table.</h1>
        <p>Make a quick dungeon, then use the cards while you play together.</p>
      </div>
      <div className="count-grid">
        <CounterCard
          label="Heroes"
          value={heroCount}
          note="players at the table"
          onChange={onHeroCount}
          min={1}
          max={4}
        />
        <CounterCard
          label="Rooms"
          value={rooms}
          note="the last room is the boss"
          onChange={onRooms}
          min={3}
          max={7}
        />
      </div>
      <button className="primary-cta" onClick={onContinue}>
        Create the heroes <ChevronRight />
      </button>
    </section>
  )
}

function CounterCard({
  label,
  value,
  note,
  onChange,
  min,
  max,
}: {
  label: string
  value: number
  note: string
  onChange: (value: number) => void
  min: number
  max: number
}) {
  return (
    <article className="counter-card">
      <p>{label}</p>
      <div>
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value === min}
          aria-label={`Decrease ${label}`}
        >
          <Minus />
        </button>
        <strong>{value}</strong>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value === max}
          aria-label={`Increase ${label}`}
        >
          <Plus />
        </button>
      </div>
      <small>{note}</small>
    </article>
  )
}

function HeroScreen({
  current,
  total,
  name,
  classId,
  heritage,
  onName,
  onClass,
  onHeritage,
  onBack,
  onContinue,
}: {
  current: number
  total: number
  name: string
  classId: HeroClassId | null
  heritage: Heritage
  onName: (value: string) => void
  onClass: (value: HeroClassId) => void
  onHeritage: (value: Heritage) => void
  onBack: () => void
  onContinue: () => void
}) {
  return (
    <section className="setup-screen hero-screen">
      <div className="step-line">
        <button className="back-button" onClick={onBack}>
          <ChevronLeft /> Back
        </button>
        <span>
          Hero {current} of {total}
        </span>
      </div>
      <div className="setup-heading">
        <p className="kicker">Choose a role</p>
        <h1>Who is this hero?</h1>
      </div>
      <div className="class-grid">
        {Object.entries(heroClasses).map(([id, heroClass]) => (
          <button
            key={id}
            className={
              classId === id ? 'class-choice is-selected' : 'class-choice'
            }
            onClick={() => onClass(id as HeroClassId)}
          >
            <span>{heroClass.icon}</span>
            <strong>{heroClass.label}</strong>
            <small>{heroClass.role}</small>
          </button>
        ))}
      </div>
      <div className="hero-details">
        <label>
          Hero name
          <input
            value={name}
            onChange={(event) => onName(event.target.value)}
            placeholder={`Hero ${current}`}
          />
        </label>
        <fieldset>
          <legend>Heritage</legend>
          <div className="heritage-row">
            {heritages.map((item) => (
              <button
                key={item}
                className={heritage === item ? 'is-selected' : ''}
                onClick={() => onHeritage(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
      <button className="primary-cta" disabled={!classId} onClick={onContinue}>
        {current === total ? 'Review the party' : 'Next hero'} <ChevronRight />
      </button>
    </section>
  )
}

function ReadyScreen({
  heroes,
  rooms,
  theme,
  onBack,
  onStart,
}: {
  heroes: Hero[]
  rooms: number
  theme: string
  onBack: () => void
  onStart: () => void
}) {
  return (
    <section className="setup-screen ready-screen">
      <button className="back-button" onClick={onBack}>
        <ChevronLeft /> Back
      </button>
      <div className="setup-heading">
        <p className="kicker">Adventure ready</p>
        <h1>Bring your dice.</h1>
        <p>
          {rooms} rooms in the {theme}. The final room holds the boss.
        </p>
      </div>
      <div className="party-review">
        {heroes.map((hero) => (
          <article key={hero.id}>
            <span>{heroClasses[hero.classId].icon}</span>
            <div>
              <strong>{hero.name}</strong>
              <small>
                {hero.heritage} {heroClasses[hero.classId].label}
              </small>
            </div>
            <b>{heroClasses[hero.classId].health} HP</b>
          </article>
        ))}
      </div>
      <button className="play-cta" onClick={onStart}>
        <Dices size={31} />
        <span>Play the dungeon</span>
        <small>Build the monster cards</small>
      </button>
    </section>
  )
}

function PlayScreen({
  adventure,
  encounter,
  roomIndex,
  round,
  selected,
  health,
  onSelect,
  onHealth,
  onRound,
  onNextRoom,
}: {
  adventure: Adventure
  encounter: Adventure['encounters'][number]
  roomIndex: number
  round: number
  selected: ReturnType<typeof getSelectedCard>
  health: Record<string, number>
  onSelect: (card: SelectedCard) => void
  onHealth: (id: string, amount: number) => void
  onRound: () => void
  onNextRoom: () => void
}) {
  if (!selected) return null
  const card =
    selected.kind === 'hero' ? (
      <HeroCard
        hero={selected.hero}
        diceKit={adventure.diceKit}
        health={health[selected.hero.id]}
        onHealth={onHealth}
      />
    ) : (
      <MonsterCard
        monster={selected.monster}
        health={health[selected.monster.id]}
        onHealth={onHealth}
        targetRoll={adventure.targetRoll}
      />
    )
  return (
    <section className="play-screen">
      <header className="play-status">
        <span>
          Room {roomIndex + 1} / {adventure.encounters.length}
        </span>
        <span>Round {round}</span>
      </header>
      <div className="card-stage">{card}</div>
      <div className="play-actions">
        <button className="round-button" onClick={onRound}>
          Next combat round
        </button>
        {roomIndex < adventure.encounters.length - 1 && (
          <button className="next-room" onClick={onNextRoom}>
            Next room <ChevronRight />
          </button>
        )}
      </div>
      <nav
        className="card-switcher"
        aria-label="Review current encounter and heroes"
      >
        <div className="switcher-group">
          <span>Foes</span>
          {encounter.monsters.map((monster) => (
            <button
              key={monster.id}
              className={
                selected.kind === 'monster' &&
                selected.monster.id === monster.id
                  ? 'is-active'
                  : ''
              }
              onClick={() => onSelect({ kind: 'monster', id: monster.id })}
            >
              {monster.icon}
              <small>{monster.name.replace(/ [0-9]+$/, '')}</small>
            </button>
          ))}
        </div>
        <div className="switcher-group">
          <span>Heroes</span>
          {adventure.heroes.map((hero) => (
            <button
              key={hero.id}
              className={
                selected.kind === 'hero' && selected.hero.id === hero.id
                  ? 'is-active'
                  : ''
              }
              onClick={() => onSelect({ kind: 'hero', id: hero.id })}
            >
              {heroClasses[hero.classId].icon}
              <small>{hero.name}</small>
            </button>
          ))}
        </div>
      </nav>
    </section>
  )
}

function HeroCard({
  hero,
  diceKit,
  health,
  onHealth,
}: {
  hero: Hero
  diceKit: Die[]
  health: number
  onHealth: (id: string, amount: number) => void
}) {
  const stats = getHeroStats(hero, diceKit)
  return (
    <article className="game-card hero-card">
      <div className="card-ribbon">HERO</div>
      <div className="hero-card__art">
        <span>{stats.icon}</span>
      </div>
      <CardTitle
        name={hero.name}
        subtitle={`${hero.heritage} ${stats.label}`}
        health={health}
        maxHealth={stats.health}
        onHealth={(amount) => onHealth(hero.id, amount)}
      />
      <div className="card-rule">
        <span>
          <Swords /> Standard attack
        </span>
        <p>
          Roll d20. On a hit, roll <b>{stats.damageDie}</b> for damage.
        </p>
      </div>
      <div className="card-rule">
        <span>
          <Sparkles /> Signature move
        </span>
        <p>{stats.action}</p>
      </div>
      <div className="card-rule">
        <span>
          <Shield /> Counter action
        </span>
        <p>Block, dodge, or use an item when a monster attacks.</p>
      </div>
    </article>
  )
}

function MonsterCard({
  monster,
  health,
  onHealth,
  targetRoll,
}: {
  monster: Monster
  health: number
  onHealth: (id: string, amount: number) => void
  targetRoll: number
}) {
  return (
    <article className="game-card monster-card">
      <div className="card-ribbon">{monster.isBoss ? 'BOSS' : 'MONSTER'}</div>
      <div
        className={`monster-art monster-art--${getPortrait(monster).position}`}
        style={{ backgroundImage: `url(${getPortrait(monster).source})` }}
      />
      <CardTitle
        name={monster.name}
        subtitle={`${monster.isBoss ? 'Final challenge' : 'Dungeon foe'} · ${monster.damageDie} damage`}
        health={health}
        maxHealth={monster.health}
        onHealth={(amount) => onHealth(monster.id, amount)}
      />
      <div className="card-rule">
        <span>
          <Swords /> Attack
        </span>
        <p>
          <b>{monster.action}</b>
          <br />
          Roll d20. {targetRoll}+ hits, then roll {monster.damageDie}.
        </p>
      </div>
      <div className="card-rule">
        <span>
          <Sparkles /> Special rule
        </span>
        <p>{monster.special}</p>
      </div>
    </article>
  )
}

function CardTitle({
  name,
  subtitle,
  health,
  maxHealth,
  onHealth,
}: {
  name: string
  subtitle: string
  health: number
  maxHealth: number
  onHealth: (amount: number) => void
}) {
  return (
    <div className="card-title">
      <div>
        <h2>{name}</h2>
        <p>{subtitle}</p>
      </div>
      <div className="health-control">
        <button
          onClick={() => onHealth(-1)}
          aria-label={`Lower ${name} health`}
        >
          <Minus />
        </button>
        <strong>
          <Heart size={14} /> {health}/{maxHealth}
        </strong>
        <button onClick={() => onHealth(1)} aria-label={`Raise ${name} health`}>
          <Plus />
        </button>
      </div>
    </div>
  )
}

function SettingsPanel({
  difficulty,
  diceKit,
  mobs,
  theme,
  onDifficulty,
  onToggleDie,
  onMobs,
  onTheme,
  onClose,
}: {
  difficulty: Difficulty
  diceKit: Die[]
  mobs: boolean
  theme: string
  onDifficulty: (value: Difficulty) => void
  onToggleDie: (die: Die) => void
  onMobs: (value: boolean) => void
  onTheme: (value: string) => void
  onClose: () => void
}) {
  return (
    <div
      className="settings-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Adventure settings"
    >
      <aside className="settings-panel">
        <header>
          <div>
            <p className="kicker">Adventure settings</p>
            <h2>Set the rules</h2>
          </div>
          <button onClick={onClose} aria-label="Close settings">
            <X />
          </button>
        </header>
        <label>
          Dungeon feeling
          <select
            value={theme}
            onChange={(event) => onTheme(event.target.value)}
          >
            {themes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <fieldset>
          <legend>Difficulty</legend>
          <div className="setting-choice-row">
            {(['easy', 'medium', 'hard'] as const).map((item) => (
              <button
                key={item}
                className={difficulty === item ? 'is-selected' : ''}
                onClick={() => onDifficulty(item)}
              >
                <b>{item}</b>
                <small>
                  {item === 'easy'
                    ? 'Gentle start'
                    : item === 'medium'
                      ? 'Balanced'
                      : 'Big challenge'}
                </small>
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Dice kit</legend>
          <p className="setting-help">
            The d20 always decides if actions work. Choose the dice you own for
            damage and healing.
          </p>
          <div className="dice-row">
            <span>d20</span>
            {dice.map((die) => (
              <button
                key={die}
                className={diceKit.includes(die) ? 'is-selected' : ''}
                onClick={() => onToggleDie(die)}
              >
                {die}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={mobs}
            onChange={(event) => onMobs(event.target.checked)}
          />
          <span>
            <b>Monster mobs</b>
            <small>Let up to three smaller monsters appear together.</small>
          </span>
        </label>
      </aside>
    </div>
  )
}

function getSelectedCard(
  selected: SelectedCard | null,
  adventure: Adventure | null,
  encounter: Adventure['encounters'][number] | undefined,
) {
  if (!selected || !adventure || !encounter) return null
  if (selected.kind === 'hero') {
    const hero = adventure.heroes.find((item) => item.id === selected.id)
    return hero ? { kind: 'hero' as const, hero } : null
  }
  const monster =
    encounter.monsters.find((item) => item.id === selected.id) ??
    encounter.monsters[0]
  return { kind: 'monster' as const, monster }
}

function getPortrait(monster: Monster) {
  if (monster.art === 'goblin')
    return { source: monsterTriptych, position: 'left' }
  if (monster.art === 'skeleton')
    return { source: monsterTriptych, position: 'center' }
  if (monster.art === 'slime')
    return { source: monsterTriptych, position: 'right' }
  if (monster.name.includes('Wolf'))
    return { source: monsterGuardians, position: 'left' }
  if (monster.name.includes('Gargoyle') || monster.name.includes('Mimic'))
    return { source: monsterGuardians, position: 'center' }
  return { source: monsterGuardians, position: 'right' }
}
