import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { initialGame, missionReducer } from '../game/missionState'

type GameState = ReturnType<typeof missionReducer>
type GameAction = Parameters<typeof missionReducer>[1]
type GameStore = {
  game: GameState
  dispatch: (action: GameAction) => void
}

type SavedGame = Omit<GameState, 'discoveries'> & {
  discoveries: Array<GameState['discoveries'] extends ReadonlySet<infer T> ? T : never>
}

export const useGameStore = create<GameStore>()(
  persist<GameStore, [], [], SavedGame>(
    (set) => ({
      game: initialGame,
      dispatch: (action) => set((state) => ({
        game: missionReducer(state.game, action),
      })),
    }),
    {
      name: 'puesto-sol-7',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ game }) => ({
        ...game,
        // A timed challenge starts again from its instructions after a reload.
        phase: game.phase.type === 'playing'
          ? { type: 'instructions', mission: game.phase.mission }
          : game.phase,
        discoveries: [...game.discoveries],
      }),
      merge: (persisted, current) => {
        if (!persisted) return current
        const saved = persisted as SavedGame
        return {
          ...current,
          game: { ...saved, discoveries: new Set(saved.discoveries) },
        }
      },
    },
  ),
)
