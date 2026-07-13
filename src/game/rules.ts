export const dice = ['d4', 'd6', 'd8', 'd10', 'd12'] as const

export type Die = (typeof dice)[number]
export type Difficulty = 'easy' | 'medium' | 'hard'
export type HeroClassId = 'paladin' | 'cleric' | 'wizard' | 'rogue' | 'ranger' | 'fighter'
export type Heritage = 'Human' | 'Elf' | 'Dwarf' | 'Halfling'

export type Hero = {
  id: string
  name: string
  classId: HeroClassId
  heritage: Heritage
}

export type AdventureOptions = {
  heroes: Hero[]
  rooms: number
  difficulty: Difficulty
  diceKit: Die[]
  mobs: boolean
  theme: string
}

export type Monster = {
  id: string
  name: string
  icon: string
  health: number
  damageDie: Die
  action: string
  special: string
  art: 'goblin' | 'skeleton' | 'slime' | 'shadow'
  isBoss?: boolean
}

export type Encounter = {
  id: string
  room: number
  title: string
  intro: string
  monsters: Monster[]
  isBoss: boolean
}

export type Adventure = AdventureOptions & {
  encounters: Encounter[]
  targetRoll: number
}

export const heroClasses = {
  paladin: {
    label: 'Paladin',
    role: 'Protector',
    icon: '🛡️',
    health: 12,
    attackDie: 'd8' as Die,
    action: 'Shield a friend: take 1 hit for them.',
  },
  cleric: {
    label: 'Cleric',
    role: 'Healer',
    icon: '✨',
    health: 9,
    attackDie: 'd6' as Die,
    action: 'Heal a hero: roll your damage die to restore health.',
  },
  wizard: {
    label: 'Wizard',
    role: 'Magic',
    icon: '🔮',
    health: 7,
    attackDie: 'd10' as Die,
    action: 'Fireball: on a hit, every monster loses 1 health.',
  },
  rogue: {
    label: 'Rogue',
    role: 'Quick attacker',
    icon: '🗡️',
    health: 8,
    attackDie: 'd8' as Die,
    action: 'Sneak attack: roll two d20s and keep the bigger one.',
  },
  ranger: {
    label: 'Ranger',
    role: 'Reliable attacker',
    icon: '🏹',
    health: 9,
    attackDie: 'd8' as Die,
    action: 'Aim: your next hit cannot be Dodged.',
  },
  fighter: {
    label: 'Fighter',
    role: 'Brave attacker',
    icon: '⚔️',
    health: 11,
    attackDie: 'd8' as Die,
    action: 'Power strike: use the next larger die you own.',
  },
} satisfies Record<HeroClassId, {
  label: string
  role: string
  icon: string
  health: number
  attackDie: Die
  action: string
}>

const difficultyRules = {
  easy: { targetRoll: 9, healthBoost: 0, label: 'Easy' },
  medium: { targetRoll: 11, healthBoost: 1, label: 'Medium' },
  hard: { targetRoll: 13, healthBoost: 2, label: 'Hard' },
} satisfies Record<Difficulty, { targetRoll: number; healthBoost: number; label: string }>

const monsterDeck = [
  {
    name: 'Goblin Scout',
    icon: '👺',
    health: 3,
    damageDie: 'd4' as Die,
    action: 'Scamper and poke',
    special: 'Dodge the first attack each combat.',
    art: 'goblin' as const,
    mob: true,
  },
  {
    name: 'Rattling Skeleton',
    icon: '💀',
    health: 4,
    damageDie: 'd6' as Die,
    action: 'Rusty sword swing',
    special: 'Block once per combat.',
    art: 'skeleton' as const,
    mob: true,
  },
  {
    name: 'Blue Slime',
    icon: '🫧',
    health: 5,
    damageDie: 'd4' as Die,
    action: 'Sticky bounce',
    special: 'On a 16+, stick to a hero. Their next attack rolls once.',
    art: 'slime' as const,
    mob: true,
  },
  {
    name: 'Cave Wolf',
    icon: '🐺',
    health: 5,
    damageDie: 'd6' as Die,
    action: 'Quick bite',
    special: 'If a friend is nearby, roll twice and keep the bigger result.',
    art: 'shadow' as const,
    mob: true,
  },
  {
    name: 'Stone Gargoyle',
    icon: '🗿',
    health: 7,
    damageDie: 'd8' as Die,
    action: 'Stone claw',
    special: 'The first hit only deals 1 damage.',
    art: 'shadow' as const,
    mob: false,
  },
  {
    name: 'Treasure Mimic',
    icon: '📦',
    health: 6,
    damageDie: 'd8' as Die,
    action: 'Surprise chomp',
    special: 'Its first attack gets +2 to the d20 roll.',
    art: 'shadow' as const,
    mob: false,
  },
] as const

const bosses = [
  {
    name: 'Young Ember Dragon',
    icon: '🐉',
    health: 14,
    damageDie: 'd12' as Die,
    action: 'Flame breath',
    special: 'On a 16+, every hero takes 1 damage.',
  },
  {
    name: 'Maze Minotaur',
    icon: '🐂',
    health: 15,
    damageDie: 'd10' as Die,
    action: 'Charging horn',
    special: 'On a hit, the target loses their next reaction.',
  },
] as const

const dieRank = Object.fromEntries(dice.map((die, index) => [die, index])) as Record<Die, number>

export function chooseDie(preferred: Die, diceKit: Die[]) {
  if (diceKit.includes(preferred)) return preferred

  return diceKit.reduce((closest, die) =>
    Math.abs(dieRank[die] - dieRank[preferred]) < Math.abs(dieRank[closest] - dieRank[preferred])
      ? die
      : closest,
  )
}

export function getDifficultyRule(difficulty: Difficulty) {
  return difficultyRules[difficulty]
}

export function getHeroStats(hero: Hero, diceKit: Die[]) {
  const heroClass = heroClasses[hero.classId]

  return {
    ...heroClass,
    damageDie: chooseDie(heroClass.attackDie, diceKit),
  }
}

export function createAdventure(options: AdventureOptions): Adventure {
  const rule = getDifficultyRule(options.difficulty)
  const partyPower = options.heroes.reduce(
    (total, hero) => total + heroClasses[hero.classId].health,
    0,
  )
  const encounters = Array.from({ length: options.rooms }, (_, index) => {
    const room = index + 1
    const isBoss = room === options.rooms

    if (isBoss) {
      const boss = bosses[(options.rooms + options.heroes.length) % bosses.length]
      return {
        id: `room-${room}`,
        room,
        title: 'Final room: the big challenge',
        intro: `The ${boss.name} guards the end of your ${options.theme.toLowerCase()} dungeon.`,
        isBoss: true,
        monsters: [
          {
            ...boss,
            id: `${room}-boss`,
            health: Math.max(10, boss.health + rule.healthBoost + Math.floor(partyPower / 14)),
            damageDie: chooseDie(boss.damageDie, options.diceKit),
            art: 'shadow',
            isBoss: true,
          },
        ],
      }
    }

    const source = monsterDeck[(room + options.heroes.length - 1) % monsterDeck.length]
    const canMob = options.mobs && source.mob && room > 1
    const monsterCount = canMob && (room + options.heroes.length) % 3 === 0 ? 3 : 1
    const monsters = Array.from({ length: monsterCount }, (_, monsterIndex) => ({
      ...source,
      id: `${room}-${monsterIndex}`,
      name: monsterCount > 1 ? `${source.name} ${monsterIndex + 1}` : source.name,
      health: source.health + rule.healthBoost + (room > 2 ? 1 : 0),
      damageDie: chooseDie(source.damageDie, options.diceKit),
    }))

    return {
      id: `room-${room}`,
      room,
      title: `Room ${room}: ${monsterCount > 1 ? `${monsterCount} foes` : 'a new foe'}`,
      intro: monsterCount > 1 ? `A small mob of ${source.name}s rushes out.` : `A ${source.name} blocks the way.`,
      isBoss: false,
      monsters,
    }
  })

  return {
    ...options,
    encounters,
    targetRoll: rule.targetRoll,
  }
}

export function getActorOrder(adventure: Adventure, encounter: Encounter) {
  const heroes = adventure.heroes.map((hero) => ({
    id: hero.id,
    name: hero.name,
    icon: heroClasses[hero.classId].icon,
    kind: 'hero' as const,
  }))
  const monsters = encounter.monsters.map((monster) => ({
    id: monster.id,
    name: monster.name,
    icon: monster.icon,
    kind: 'monster' as const,
  }))

  return heroes.flatMap((hero, index) => [hero, ...(monsters[index] ? [monsters[index]] : [])]).concat(monsters.slice(heroes.length))
}
