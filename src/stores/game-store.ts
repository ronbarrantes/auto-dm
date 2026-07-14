import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Adventure, Heritage, Hero, HeroClassId } from '../game/rules'

export type Stage = 'start' | 'heroes' | 'ready' | 'play'
export type SelectedCard =
  { kind: 'monster'; id: string } | { kind: 'hero'; id: string }

type GameState = {
  stage: Stage
  heroCount: number
  rooms: number
  heroes: Hero[]
  draftName: string
  draftClass: HeroClassId | null
  draftHeritage: Heritage
  adventure: Adventure | null
  roomIndex: number
  round: number
  selectedCard: SelectedCard | null
  health: Record<string, number>
}

type GameStore = GameState & {
  beginHeroSetup: () => void
  resetGame: () => void
  setStage: (stage: Stage) => void
  setHeroCount: (heroCount: number) => void
  setRooms: (rooms: number) => void
  setHeroes: (heroes: Hero[]) => void
  setDraftName: (draftName: string) => void
  setDraftClass: (draftClass: HeroClassId | null) => void
  setDraftHeritage: (draftHeritage: Heritage) => void
  setAdventure: (adventure: Adventure | null) => void
  setRoomIndex: (roomIndex: number) => void
  setRound: (round: number) => void
  setSelectedCard: (selectedCard: SelectedCard | null) => void
  setHealth: (health: Record<string, number>) => void
  updateHealth: (id: string, amount: number) => void
}

const getInitialGameState = (): GameState => ({
  stage: 'start',
  heroCount: 1,
  rooms: 4,
  heroes: [],
  draftName: '',
  draftClass: null,
  draftHeritage: 'Human',
  adventure: null,
  roomIndex: 0,
  round: 1,
  selectedCard: null,
  health: {},
})

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...getInitialGameState(),
      beginHeroSetup: () =>
        set({
          stage: 'heroes',
          heroes: [],
          draftName: '',
          draftClass: null,
          draftHeritage: 'Human',
        }),
      resetGame: () => set(getInitialGameState()),
      setStage: (stage) => set({ stage }),
      setHeroCount: (heroCount) => set({ heroCount }),
      setRooms: (rooms) => set({ rooms }),
      setHeroes: (heroes) => set({ heroes }),
      setDraftName: (draftName) => set({ draftName }),
      setDraftClass: (draftClass) => set({ draftClass }),
      setDraftHeritage: (draftHeritage) => set({ draftHeritage }),
      setAdventure: (adventure) => set({ adventure }),
      setRoomIndex: (roomIndex) => set({ roomIndex }),
      setRound: (round) => set({ round }),
      setSelectedCard: (selectedCard) => set({ selectedCard }),
      setHealth: (health) => set({ health }),
      updateHealth: (id, amount) =>
        set((state) => ({
          health: {
            ...state.health,
            [id]: Math.max(0, (state.health[id] ?? 0) + amount),
          },
        })),
    }),
    {
      name: 'auto-dm-game',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: ({
        stage,
        heroCount,
        rooms,
        heroes,
        draftName,
        draftClass,
        draftHeritage,
        adventure,
        roomIndex,
        round,
        selectedCard,
        health,
      }) => ({
        stage,
        heroCount,
        rooms,
        heroes,
        draftName,
        draftClass,
        draftHeritage,
        adventure,
        roomIndex,
        round,
        selectedCard,
        health,
      }),
    },
  ),
)
