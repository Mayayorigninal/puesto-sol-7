import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Milestone } from '../data/almanac'
import { initialGame, missionReducer, type GameAction, type GameState } from '../game/missionState'

type GameStore = {
  game: GameState
  dispatch: (action: GameAction) => void
}

// localStorage guarda texto (JSON) y un Set no se puede convertir a JSON,
// así que las fichas descubiertas se guardan como arreglo.
type SavedGame = Omit<GameState, 'discoveries'> & { discoveries: Milestone[] }

export const useGameStore = create<GameStore>()(
  persist<GameStore, [], [], SavedGame | null>(
    (set) => ({
      game: initialGame,
      dispatch: (action) => set((state) => ({
        game: missionReducer(state.game, action),
      })),
    }),
    {
      name: 'puesto-sol-7',
      // Versión 3: se agregaron la despensa, la antena y el costo del oxígeno.
      version: 3,
      storage: createJSONStorage(() => localStorage),
      // Las partidas guardadas con versiones anteriores ya no son compatibles: se descartan.
      migrate: () => null,
      partialize: ({ game }) => ({
        ...game,
        // Un minijuego con tiempo vuelve a empezar desde sus instrucciones al recargar.
        phase: game.phase.type === 'playing'
          ? { type: 'instructions', mission: game.phase.mission }
          : game.phase,
        discoveries: [...game.discoveries],
      }),
      merge: (persisted, current) => {
        const saved = persisted as SavedGame | null | undefined
        if (!saved) return current
        return {
          ...current,
          game: { ...saved, discoveries: new Set(saved.discoveries) },
        }
      },
    },
  ),
)
