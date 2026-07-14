import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { dice } from '../game/rules'
import type { Die, Difficulty } from '../game/rules'

type SettingsStore = {
  difficulty: Difficulty
  diceKit: Die[]
  mobs: boolean
  theme: string
  setDifficulty: (difficulty: Difficulty) => void
  toggleDie: (die: Die) => void
  setMobs: (mobs: boolean) => void
  setTheme: (theme: string) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      difficulty: 'medium',
      diceKit: ['d6', 'd8'],
      mobs: true,
      theme: 'Crystal Cave',
      setDifficulty: (difficulty) => set({ difficulty }),
      toggleDie: (die) =>
        set((state) => {
          if (state.diceKit.includes(die)) {
            return state.diceKit.length > 1
              ? { diceKit: state.diceKit.filter((item) => item !== die) }
              : state
          }

          return {
            diceKit: [...state.diceKit, die].sort(
              (first, second) => dice.indexOf(first) - dice.indexOf(second),
            ),
          }
        }),
      setMobs: (mobs) => set({ mobs }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'auto-dm-settings',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: ({ difficulty, diceKit, mobs, theme }) => ({
        difficulty,
        diceKit,
        mobs,
        theme,
      }),
    },
  ),
)
