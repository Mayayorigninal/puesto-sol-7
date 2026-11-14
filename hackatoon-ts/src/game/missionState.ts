import type { Milestone } from '../data/almanac'
import { missions, type Mission } from '../data/missions'

export const initialSystems = { energia: 40, oxigeno: 100, comida: 100, tripulacion: 100 }
export type Systems = typeof initialSystems

export const systemLabels = {
  energia: 'Energía',
  oxigeno: 'Oxígeno',
  comida: 'Comida',
  tripulacion: 'Tripulación',
}

function missionEffects(mission: Mission, success: boolean) {
  if (mission === 'polvo') {
    return [
      { system: 'energia', amount: success ? 25 : 6 },
      { system: 'oxigeno', amount: -12 },
    ] as const
  }
  return success
    ? [{ system: 'oxigeno', amount: 6 }, { system: 'energia', amount: -10 }] as const
    : [
        { system: 'oxigeno', amount: -26 },
        { system: 'tripulacion', amount: -12 },
        { system: 'energia', amount: -10 },
      ] as const
}

type Phase =
  | { type: 'decision' }
  | { type: 'instructions'; mission: Mission }
  | { type: 'playing'; mission: Mission }
  | {
      type: 'result'
      mission: Mission
      success: boolean
      value: number
      effects: ReturnType<typeof missionEffects>
    }

type GameState = { phase: Phase; systems: Systems; discoveries: ReadonlySet<Milestone> }
type GameAction =
  | { type: 'choose'; mission: Mission }
  | { type: 'start' }
  | { type: 'discover'; milestone: Milestone }
  | { type: 'finish'; success: boolean; value: number }
  | { type: 'retry'; mission: Mission }

export const initialGame: GameState = {
  phase: { type: 'decision' },
  systems: initialSystems,
  discoveries: new Set(),
}

export function missionReducer(state: GameState, action: GameAction): GameState {
  const { phase, discoveries } = state
  switch (action.type) {
    case 'choose':
      return { ...state, phase: { type: 'instructions', mission: action.mission } }
    case 'start':
      if (phase.type !== 'instructions') return state
      return {
        ...state,
        phase: { type: 'playing', mission: phase.mission },
        discoveries: new Set([...discoveries, missions[phase.mission].discovery]),
      }
    case 'discover':
      if (discoveries.has(action.milestone)) return state
      return { ...state, discoveries: new Set([...discoveries, action.milestone]) }
    case 'finish': {
      if (phase.type !== 'playing') return state
      const { mission } = phase
      const { success, value } = action
      const effects = missionEffects(mission, success)
      const systems = { ...state.systems }
      for (const { system, amount } of effects) {
        const total = Math.max(0, systems[system] + amount)
        systems[system] = system === 'energia' ? total : Math.min(100, total)
      }
      return {
        systems,
        phase: { type: 'result', mission, success, value, effects },
        discoveries: new Set([...discoveries, missions[mission].completion]),
      }
    }
    case 'retry':
      return { ...initialGame, discoveries, phase: { type: 'instructions', mission: action.mission } }
  }
}
