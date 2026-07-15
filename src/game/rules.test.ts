import { describe, expect, it } from 'vitest'
import {
  chooseDie,
  createAdventure,
  getActorOrder,
  getMonsterCards,
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

    expect(cards).toHaveLength(39)
    expect(cards.every((card) => card.image.source)).toBe(true)
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
