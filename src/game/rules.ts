export const dice = ['d4', 'd6', 'd8', 'd10', 'd12'] as const

export type Die = (typeof dice)[number]
export type Difficulty = 'easy' | 'medium' | 'hard'
export type HeroClassId =
  'paladin' | 'cleric' | 'wizard' | 'rogue' | 'ranger' | 'fighter'
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
  seed?: number
}

export type Monster = {
  id: string
  name: string
  icon: string
  health: number
  defense: number
  damageDie: Die
  action: string
  special: string
  art: 'goblin' | 'skeleton' | 'slime' | 'shadow'
  image: MonsterImage
  isBoss?: boolean
}

export type MonsterImage = {
  source: string
  position: 'left' | 'center' | 'right'
  isSprite: boolean
}

const placeholderImages = {
  goblin: { source: monsterTriptych, position: 'left', isSprite: true },
  skeleton: { source: monsterTriptych, position: 'center', isSprite: true },
  slime: { source: monsterTriptych, position: 'right', isSprite: true },
  shadow: { source: monsterGuardians, position: 'right', isSprite: true },
} as const satisfies Record<Monster['art'], MonsterImage>

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
    attackDie: 'd8',
    action: 'Shield a friend: take 1 hit for them.',
  },
  cleric: {
    label: 'Cleric',
    role: 'Healer',
    icon: '✨',
    health: 9,
    attackDie: 'd6',
    action: 'Heal a hero: roll your damage die to restore health.',
  },
  wizard: {
    label: 'Wizard',
    role: 'Magic',
    icon: '🔮',
    health: 7,
    attackDie: 'd10',
    action: 'Fireball: on a hit, every monster loses 1 health.',
  },
  rogue: {
    label: 'Rogue',
    role: 'Quick attacker',
    icon: '🗡️',
    health: 8,
    attackDie: 'd8',
    action: 'Sneak attack: roll two d20s and keep the bigger one.',
  },
  ranger: {
    label: 'Ranger',
    role: 'Reliable attacker',
    icon: '🏹',
    health: 9,
    attackDie: 'd8',
    action: 'Aim: your next hit cannot be Dodged.',
  },
  fighter: {
    label: 'Fighter',
    role: 'Brave attacker',
    icon: '⚔️',
    health: 11,
    attackDie: 'd8',
    action: 'Power strike: use the next larger die you own.',
  },
} satisfies Record<
  HeroClassId,
  {
    label: string
    role: string
    icon: string
    health: number
    attackDie: Die
    action: string
  }
>

const difficultyRules = {
  easy: { targetRoll: 9, healthBoost: 0, label: 'Easy' },
  medium: { targetRoll: 11, healthBoost: 1, label: 'Medium' },
  hard: { targetRoll: 13, healthBoost: 2, label: 'Hard' },
} satisfies Record<
  Difficulty,
  { targetRoll: number; healthBoost: number; label: string }
>

const monsterDeck = [
  {
    name: 'Goblin Scout',
    icon: '👺',
    health: 3,
    defense: 9,
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
    defense: 10,
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
    defense: 8,
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
    defense: 10,
    damageDie: 'd6' as Die,
    action: 'Quick bite',
    special: 'If a friend is nearby, roll twice and keep the bigger result.',
    art: 'shadow' as const,
    mob: true,
  },
  {
    name: 'Bat Swarm',
    icon: '🦇',
    health: 3,
    defense: 9,
    damageDie: 'd4' as Die,
    action: 'Fluttering bite',
    special: 'On a 16+, the target cannot Dodge the next attack.',
    art: 'shadow' as const,
    mob: true,
  },
  {
    name: 'Kobold Tinkerer',
    icon: '🧨',
    health: 4,
    defense: 9,
    damageDie: 'd4' as Die,
    action: 'Sling stone',
    special:
      'Once per combat, set a trap. The next hero to miss loses 1 health.',
    art: 'goblin' as const,
    mob: true,
  },
  {
    name: 'Mushroom Sprite',
    icon: '🍄',
    health: 4,
    defense: 8,
    damageDie: 'd4' as Die,
    action: 'Spore puff',
    special: 'On a 16+, the target rolls one die size smaller next turn.',
    art: 'slime' as const,
    mob: true,
  },
  {
    name: 'Fire Beetle',
    icon: '🪲',
    health: 4,
    defense: 11,
    damageDie: 'd6' as Die,
    action: 'Hot shell bump',
    special: 'The first hero to hit it takes 1 damage too.',
    art: 'shadow' as const,
    mob: true,
  },
  {
    name: 'Rat King',
    icon: '🐀',
    health: 5,
    defense: 10,
    damageDie: 'd6' as Die,
    action: 'Tangled tails',
    special: 'If it hits, the target cannot use an item next turn.',
    art: 'shadow' as const,
    mob: true,
  },
  {
    name: 'Web Spider',
    icon: '🕷️',
    health: 5,
    defense: 11,
    damageDie: 'd6' as Die,
    action: 'Web toss',
    special: 'On a 16+, the target must roll 12+ to attack next turn.',
    art: 'shadow' as const,
    mob: true,
  },
  {
    name: 'Crystal Crab',
    icon: '🦀',
    health: 6,
    defense: 12,
    damageDie: 'd6' as Die,
    action: 'Shiny claw snap',
    special: 'Block the first hit each combat.',
    art: 'shadow' as const,
    mob: false,
  },
  {
    name: 'Ghost Lantern',
    icon: '🏮',
    health: 5,
    defense: 10,
    damageDie: 'd6' as Die,
    action: 'Chilling glow',
    special: 'On a 16+, every hero loses 1 health.',
    art: 'skeleton' as const,
    mob: false,
  },
  {
    name: 'Stone Gargoyle',
    icon: '🗿',
    health: 7,
    defense: 12,
    damageDie: 'd8' as Die,
    action: 'Stone claw',
    special: 'The first hit only deals 1 damage.',
    art: 'shadow' as const,
    mob: false,
  },
  {
    name: 'Cave Troll',
    icon: '👹',
    health: 8,
    defense: 11,
    damageDie: 'd8' as Die,
    action: 'Club stomp',
    special: 'After it takes 3 damage in one turn, it loses its next attack.',
    art: 'shadow' as const,
    mob: false,
  },
  {
    name: 'Shadow Knight',
    icon: '🗡️',
    health: 7,
    defense: 13,
    damageDie: 'd8' as Die,
    action: 'Midnight slash',
    special: 'Dodge the first attack each combat.',
    art: 'skeleton' as const,
    mob: false,
  },
  {
    name: 'Bog Witch',
    icon: '🧙',
    health: 6,
    defense: 10,
    damageDie: 'd8' as Die,
    action: 'Bubble blast',
    special: 'On a 16+, the target cannot use a Magic Attack next turn.',
    art: 'slime' as const,
    mob: false,
  },
  {
    name: 'Clockwork Sentry',
    icon: '⚙️',
    health: 7,
    defense: 12,
    damageDie: 'd8' as Die,
    action: 'Gear punch',
    special: 'The hero who hurt it last must be its next target.',
    art: 'shadow' as const,
    mob: false,
  },
  {
    name: 'Treasure Mimic',
    icon: '📦',
    health: 6,
    defense: 11,
    damageDie: 'd8' as Die,
    action: 'Surprise chomp',
    special: 'Its first attack gets +2 to the d20 roll.',
    art: 'shadow' as const,
    mob: false,
  },
  {
    name: 'Giant Rat',
    icon: '🐀',
    health: 3,
    defense: 9,
    damageDie: 'd4' as Die,
    action: 'Nipping bite',
    special: 'On a 16+, the target drops 1 item for a turn.',
    art: 'shadow' as const,
    mob: true,
  },
  {
    name: 'Sewer Crocodile',
    icon: '🐊',
    health: 7,
    defense: 11,
    damageDie: 'd8' as Die,
    action: 'Snap and roll',
    special: 'On a 16+, the target cannot Dodge next turn.',
    art: 'shadow' as const,
    mob: false,
  },
  {
    name: 'Moss Golem',
    icon: '🪨',
    health: 8,
    defense: 12,
    damageDie: 'd8' as Die,
    action: 'Mossy slam',
    special: 'The first hit against it deals only 1 damage.',
    art: 'shadow' as const,
    mob: false,
  },
  {
    name: 'Cave Bear',
    icon: '🐻',
    health: 8,
    defense: 10,
    damageDie: 'd8' as Die,
    action: 'Big claw swipe',
    special: 'On a 16+, it attacks the same hero again next round.',
    art: 'shadow' as const,
    mob: false,
  },
  {
    name: 'Bone Archer',
    icon: '🏹',
    health: 5,
    defense: 11,
    damageDie: 'd6' as Die,
    action: 'Rattling arrow',
    special: 'On a 16+, the target cannot Block next turn.',
    art: 'skeleton' as const,
    mob: true,
  },
  {
    name: 'Ember Imp',
    icon: '😈',
    health: 4,
    defense: 12,
    damageDie: 'd4' as Die,
    action: 'Tiny fire bolt',
    special: 'The first hero it hits loses 1 extra health.',
    art: 'slime' as const,
    mob: true,
  },
  {
    name: 'Ooze Blob',
    icon: '🟢',
    health: 6,
    defense: 8,
    damageDie: 'd6' as Die,
    action: 'Gooey slap',
    special: 'On a 16+, the target rolls once on their next attack.',
    art: 'slime' as const,
    mob: true,
  },
  {
    name: 'Thorny Vine Beast',
    icon: '🌿',
    health: 7,
    defense: 10,
    damageDie: 'd6' as Die,
    action: 'Thorn lash',
    special: 'On a 16+, the target loses their next reaction.',
    art: 'slime' as const,
    mob: false,
  },
  {
    name: 'Haunted Armor',
    icon: '🛡️',
    health: 7,
    defense: 13,
    damageDie: 'd8' as Die,
    action: 'Empty helmet strike',
    special: 'Block the first attack each combat.',
    art: 'skeleton' as const,
    mob: false,
  },
  {
    name: 'Ice Sprite',
    icon: '❄️',
    health: 4,
    defense: 11,
    damageDie: 'd4' as Die,
    action: 'Frost puff',
    special: 'On a 16+, the target rolls one die size smaller next turn.',
    art: 'slime' as const,
    mob: true,
  },
  {
    name: 'Swamp Lizard',
    icon: '🦎',
    health: 6,
    defense: 10,
    damageDie: 'd6' as Die,
    action: 'Tail whip',
    special: 'If it misses, it may roll again next round.',
    art: 'shadow' as const,
    mob: false,
  },
  {
    name: 'Dark Fairy',
    icon: '🧚',
    health: 4,
    defense: 12,
    damageDie: 'd4' as Die,
    action: 'Mischief spark',
    special: 'On a 16+, the target cannot use a Magic Attack next turn.',
    art: 'slime' as const,
    mob: true,
  },
  {
    name: 'Dungeon Owlbear',
    icon: '🦉',
    health: 9,
    defense: 11,
    damageDie: 'd10' as Die,
    action: 'Beak and claw',
    special: 'After it takes 3 damage in one turn, it loses its next attack.',
    art: 'shadow' as const,
    mob: false,
  },
  {
    name: 'Lava Lizard',
    icon: '🌋',
    health: 6,
    defense: 11,
    damageDie: 'd8' as Die,
    action: 'Molten spit',
    special: 'The first hero to hit it takes 1 damage too.',
    art: 'shadow' as const,
    mob: false,
  },
  {
    name: 'Cursed Pirate',
    icon: '🏴‍☠️',
    health: 6,
    defense: 11,
    damageDie: 'd8' as Die,
    action: 'Ghostly cutlass',
    special: 'On a 16+, the target cannot use an item next turn.',
    art: 'skeleton' as const,
    mob: false,
  },
  {
    name: 'Sand Scorpion',
    icon: '🦂',
    health: 5,
    defense: 12,
    damageDie: 'd6' as Die,
    action: 'Stinging tail',
    special: 'On a 16+, the target must roll 12+ to attack next turn.',
    art: 'shadow' as const,
    mob: false,
  },
  {
    name: 'Phantom Hound',
    icon: '👻',
    health: 6,
    defense: 12,
    damageDie: 'd8' as Die,
    action: 'Shadow bite',
    special: 'Dodge the first attack each combat.',
    art: 'skeleton' as const,
    mob: false,
  },
  {
    name: 'Cyclops Guard',
    icon: '👁️',
    health: 9,
    defense: 10,
    damageDie: 'd10' as Die,
    action: 'Heavy club swing',
    special: 'On a 16+, every hero loses 1 health.',
    art: 'shadow' as const,
    mob: false,
  },
] as const

const bosses = [
  {
    name: 'Young Ember Dragon',
    icon: '🐉',
    health: 14,
    defense: 13,
    damageDie: 'd12' as Die,
    action: 'Flame breath',
    special: 'On a 16+, every hero takes 1 damage.',
  },
  {
    name: 'Maze Minotaur',
    icon: '🐂',
    health: 15,
    defense: 12,
    damageDie: 'd10' as Die,
    action: 'Charging horn',
    special: 'On a hit, the target loses their next reaction.',
  },
  {
    name: 'Moonlit Lich',
    icon: '🧙‍♂️',
    health: 16,
    defense: 13,
    damageDie: 'd10' as Die,
    action: 'Moon beam',
    special: 'Once per combat, every hero loses 1 health.',
  },
  {
    name: 'Iron Golem',
    icon: '🤖',
    health: 18,
    defense: 14,
    damageDie: 'd12' as Die,
    action: 'Iron fist',
    special: 'The first two hits against it each deal only 1 damage.',
  },
] as const

const dieRank = Object.fromEntries(
  dice.map((die, index) => [die, index]),
) as Record<Die, number>

export function chooseDie(preferred: Die, diceKit: Die[]) {
  if (diceKit.includes(preferred)) return preferred

  return diceKit.reduce((closest, die) =>
    Math.abs(dieRank[die] - dieRank[preferred]) <
    Math.abs(dieRank[closest] - dieRank[preferred])
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
  const seed = options.seed ?? Math.floor(Math.random() * monsterDeck.length)
  const partyPower = options.heroes.reduce(
    (total, hero) => total + heroClasses[hero.classId].health,
    0,
  )
  const encounters = Array.from({ length: options.rooms }, (_room, index) => {
    const room = index + 1
    const isBoss = room === options.rooms

    if (isBoss) {
      const boss =
        bosses[(seed + options.rooms + options.heroes.length) % bosses.length]
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
            health: Math.max(
              10,
              boss.health + rule.healthBoost + Math.floor(partyPower / 14),
            ),
            damageDie: chooseDie(boss.damageDie, options.diceKit),
            art: 'shadow' as const,
            image: placeholderImages.shadow,
            isBoss: true,
          },
        ],
      }
    }

    const source =
      monsterDeck[
        (seed + room + options.heroes.length - 1) % monsterDeck.length
      ]
    const canMob = options.mobs && source.mob && room > 1
    const monsterCount =
      canMob && (seed + room + options.heroes.length) % 3 === 0 ? 3 : 1
    const monsters = Array.from(
      { length: monsterCount },
      (_monster, monsterIndex) => ({
        ...source,
        id: `${room}-${monsterIndex}`,
        name:
          monsterCount > 1 ? `${source.name} ${monsterIndex + 1}` : source.name,
        health: source.health + rule.healthBoost + (room > 2 ? 1 : 0),
        damageDie: chooseDie(source.damageDie, options.diceKit),
        image: placeholderImages[source.art],
      }),
    )

    return {
      id: `room-${room}`,
      room,
      title: `Room ${room}: ${monsterCount > 1 ? `${monsterCount} foes` : 'a new foe'}`,
      intro:
        monsterCount > 1
          ? `A small mob of ${source.name}s rushes out.`
          : `A ${source.name} blocks the way.`,
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

  return heroes
    .flatMap((hero, index) => [
      hero,
      ...(monsters[index] ? [monsters[index]] : []),
    ])
    .concat(monsters.slice(heroes.length))
}
import monsterGuardians from '../assets/monster-guardians.jpg'
import monsterTriptych from '../assets/monster-triptych.jpg'
