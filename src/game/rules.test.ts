import { describe, expect, it } from 'vitest'
import { chooseDie, createAdventure, type AdventureOptions } from './rules'

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
    const monsters = adventure.encounters.flatMap((encounter) => encounter.monsters)

    expect(adventure.encounters).toHaveLength(4)
    expect(adventure.encounters.at(-1)?.isBoss).toBe(true)
    expect(monsters.every((monster) => options.diceKit.includes(monster.damageDie))).toBe(true)
  })

  it('keeps encounters to one monster when mobs are disabled', () => {
    const adventure = createAdventure(options)

    expect(adventure.encounters.slice(0, -1).every((encounter) => encounter.monsters)).toBeTruthy()
    expect(adventure.encounters.slice(0, -1).every((encounter) => encounter.monsters.length === 1)).toBe(true)
  })

  it('picks the closest available die when a card asks for an unavailable die', () => {
    expect(chooseDie('d12', ['d4', 'd8'])).toBe('d8')
    expect(chooseDie('d4', ['d6', 'd8'])).toBe('d6')
  })
})
