import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { useGameStore as gameStore } from './game-store'
import type { useSettingsStore as settingsStore } from './settings-store'

let useGameStore: typeof gameStore
let useSettingsStore: typeof settingsStore

const values = new Map<string, string>()
const storage = {
  getItem: (name: string) => values.get(name) ?? null,
  setItem: (name: string, value: string) => values.set(name, value),
  removeItem: (name: string) => values.delete(name),
}

beforeEach(async () => {
  values.clear()
  vi.resetModules()
  vi.stubGlobal('localStorage', storage)
  ;({ useGameStore } = await import('./game-store'))
  ;({ useSettingsStore } = await import('./settings-store'))
  useGameStore.getState().resetGame()
  useSettingsStore.setState({
    difficulty: 'medium',
    diceKit: ['d6', 'd8'],
    mobs: true,
    theme: 'Crystal Cave',
  })
  useGameStore.persist.clearStorage()
  useSettingsStore.persist.clearStorage()
})

afterEach(() => vi.unstubAllGlobals())

describe('local game saves', () => {
  it('keeps table settings when an ended game is cleared', () => {
    useSettingsStore.getState().setTheme('Mossy Ruins')
    useGameStore.getState().setStage('play')
    useGameStore.getState().setRound(4)

    useGameStore.getState().resetGame()
    useGameStore.persist.clearStorage()

    expect(values.has('auto-dm-game')).toBe(false)
    expect(values.get('auto-dm-settings')).toContain('Mossy Ruins')
    expect(useSettingsStore.getState().theme).toBe('Mossy Ruins')
    expect(useGameStore.getState().stage).toBe('start')
  })

  it('never lets players remove the last damage die', () => {
    useSettingsStore.setState({ diceKit: ['d8'] })

    useSettingsStore.getState().toggleDie('d8')

    expect(useSettingsStore.getState().diceKit).toEqual(['d8'])
  })
})
