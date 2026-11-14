import { create } from 'zustand'
import {
  countLeaking,
  createPatches,
  leakRate,
  patchDeadline,
  rotatePatch,
  type Patch,
} from '../game/patches/patches'

export type PatchStatus = 'playing' | 'won' | 'lost'

type PatchStore = {
  elapsed: number
  oxygen: number
  status: PatchStatus
  patches: Patch[]
  /** Empieza una partida nueva. */
  reset: () => void
  /** Avanza la simulación `seconds` segundos (se llama en cada cuadro). */
  tick: (seconds: number) => void
  /** Gira un parche 90°. */
  rotate: (id: number) => void
}

function fresh() {
  return { elapsed: 0, oxygen: 100, status: 'playing' as PatchStatus, patches: createPatches() }
}

// Este store solo vive mientras dura el minijuego, por eso no se persiste.
// El resultado final se manda a useGameStore con dispatch({ type: 'finish' }).
export const usePatchStore = create<PatchStore>()((set, get) => ({
  ...fresh(),

  reset: () => set(fresh()),

  tick: (seconds) => {
    const state = get()
    if (state.status !== 'playing') return

    const elapsed = state.elapsed + seconds

    // Solo se crea un objeto nuevo para los agujeros que se abren en este cuadro.
    // Así, cada <PatchHole> se vuelve a dibujar solo cuando cambia SU parche.
    let changed = false
    const patches = state.patches.map((patch) => {
      if (patch.opened || patch.opensAt > elapsed) return patch
      changed = true
      return { ...patch, opened: true }
    })

    const oxygen = Math.max(0, state.oxygen - countLeaking(patches) * leakRate * seconds)
    const status: PatchStatus = oxygen <= 0 || elapsed >= patchDeadline ? 'lost' : 'playing'

    set({ elapsed, oxygen, status, ...(changed ? { patches } : {}) })
  },

  rotate: (id) => {
    const state = get()
    if (state.status !== 'playing') return
    const current = state.patches[id]
    const next = rotatePatch(current)
    if (next === current) return

    const patches = state.patches.map((patch) => (patch.id === id ? next : patch))
    const won = patches.every((patch) => patch.sealed)
    set({ patches, status: won ? 'won' : state.status })
  },
}))
