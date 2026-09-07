import { describe, expect, it } from 'vitest'
import {
  chooseDie,
  createAdventure,
  getActorOrder,
  getDungeonDefinition,
  getMonsterCards,
  heroClasses,
} from './rules'
import type { AdventureOptions } from './rules'

const options: AdventureOptions = {
  heroes: [
    { id: 'ava', name: 'Ava', classId: 'wizard', heritage: 'Elf' },
    { id: 'max', name: 'Max', classId: 'paladin', heritage: 'Human' },
  ],
  rooms: 4,
  difficulty: 'medium',
  diceKit: ['d6', 'd8'],
  mobs: false,
  theme: 'Crystal Cave',
}

describe('Auto DM encounter generator', () => {
  it('uses only selected dice and always ends with one boss', () => {
    const adventure = createAdventure(options)
    const monsters = adventure.encounters.flatMap(
      (encounter) => encounter.monsters,
    )

    expect(adventure.encounters).toHaveLength(4)
    expect(adventure.encounters.at(-1)?.isBoss).toBe(true)
    expect(
      monsters.every((monster) => options.diceKit.includes(monster.damageDie)),
    ).toBe(true)
    expect(monsters.every((monster) => monster.defense >= 8)).toBe(true)
  })

  it('keeps encounters to one monster when mobs are disabled', () => {
    const adventure = createAdventure(options)

    expect(
      adventure.encounters
        .slice(0, -1)
        .every((encounter) => encounter.monsters.length === 1),
    ).toBe(true)
  })

  it('can start an adventure with every regular monster', () => {
    const startingMonsters = new Set(
      Array.from({ length: 35 }, (_, seed) => {
        const adventure = createAdventure({ ...options, seed })
        return adventure.encounters[0].monsters[0].name
      }),
    )

    expect(startingMonsters).toHaveLength(35)
  })

  it('provides art for every monster card', () => {
    const cards = getMonsterCards()

    expect(cards).toHaveLength(48)
    expect(cards.every((card) => card.image.source)).toBe(true)
  })

  it('builds a nine-room Backrooms dungeon without repeating entities', () => {
    const adventure = createAdventure({
      ...options,
      rooms: 12,
      mobs: true,
      theme: 'The Backrooms',
      seed: 0,
    })
    const names = adventure.encounters.flatMap((encounter) =>
      encounter.monsters.map((monster) => monster.name),
    )

    expect(adventure.rooms).toBe(9)
    expect(adventure.encounters).toHaveLength(9)
    expect(new Set(names)).toHaveLength(9)
    expect(names.at(-1)).toBe('Bacteria')
    expect(
      adventure.encounters.every(({ monsters }) => monsters.length === 1),
    ).toBe(true)
    expect(adventure.background?.image).toBeTruthy()
  })

  it('offers four equally balanced Wanderer classes only in The Backrooms', () => {
    const backroomsClasses = getDungeonDefinition('The Backrooms').heroClasses
    const classicClasses = getDungeonDefinition('Crystal Cave').heroClasses
    const balanceProfiles = backroomsClasses.map((classId) => {
      const heroClass = heroClasses[classId]
      return [heroClass.health, heroClass.attackDie, heroClass.action]
    })

    expect(backroomsClasses).toEqual([
      'wanderer-1',
      'wanderer-2',
      'wanderer-3',
      'wanderer-4',
    ])
    expect(new Set(balanceProfiles.map(String))).toHaveLength(1)
    expect(classicClasses).not.toContain('wanderer-1')
  })

  it('picks the closest available die when a card asks for an unavailable die', () => {
    expect(chooseDie('d12', ['d4', 'd8'])).toBe('d8')
    expect(chooseDie('d4', ['d6', 'd8'])).toBe('d6')
  })

  it('scales target rolls across every difficulty for a solo hero', () => {
    const soloOptions = {
      ...options,
      heroes: [options.heroes[0]],
    }

    expect(
      createAdventure({ ...soloOptions, difficulty: 'easy' }).targetRoll,
    ).toBe(9)
    expect(
      createAdventure({ ...soloOptions, difficulty: 'medium' }).targetRoll,
    ).toBe(11)
    expect(
      createAdventure({ ...soloOptions, difficulty: 'hard' }).targetRoll,
    ).toBe(13)
  })

  it('creates a monster mob only when the setting is enabled', () => {
    const mobOptions = {
      ...options,
      heroes: [options.heroes[0]],
      rooms: 5,
      mobs: true,
      seed: 0,
    }
    const adventure = createAdventure(mobOptions)

    expect(
      adventure.encounters.some((encounter) => encounter.monsters.length > 1),
    ).toBe(true)
    expect(
      getActorOrder(adventure, adventure.encounters[1]).map(
        (actor) => actor.kind,
      ),
    ).toEqual(['hero', 'monster', 'monster', 'monster'])
  })
})
