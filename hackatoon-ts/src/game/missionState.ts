import type { Milestone } from '../data/almanac'
import { missions, type Mission } from '../data/missions'
import { spaceWeather } from '../data/spaceWeather.ts'
import {
  applyPlan, canAfford, initialResources, missionEnding, resolveSol,
  type Ending, type Plan, type Resources, type SolReport, type TaskKind,
} from './rules.ts'

/** Qué tipo de tarea es cada minijuego: da energía o cuida el soporte vital. */
export const taskKinds: Record<Mission, TaskKind> = {
  polvo: 'energia',
  filtro: 'soporte',
  fugas: 'soporte',
  parches: 'soporte',
  ejercicio: 'soporte',
}

/** Tarea de soporte vital y salud que toca cada sol (la otra opción siempre son los paneles). */
const supportRotation = ['filtro', 'ejercicio', 'parches', 'fugas'] as const satisfies readonly Mission[]

export function routineOptions(sol: number): readonly [Mission, Mission] {
  return ['polvo', supportRotation[(sol - 1) % supportRotation.length]]
}

// Cada sol pasa por estas fases, en orden:
//   prep → (experiment) → routine → instructions → playing → solResult
// y la misión completa: intro → 8 soles → end.
export type Phase =
  | { type: 'intro' }
  | { type: 'prep' }
  | { type: 'experiment' }
  | { type: 'routine' }
  | { type: 'instructions'; mission: Mission }
  | { type: 'playing'; mission: Mission }
  | { type: 'solResult'; mission: Mission; value: number; report: SolReport; ending: Ending | null }
  | { type: 'end'; ending: Ending }

/** Lo que pasó en un sol ya terminado (para el resumen final). */
export type SolRecord = { sol: number; plan: Plan; mission: Mission; report: SolReport }

export type GameState = {
  phase: Phase
  /** Sol actual, de 1 a 8. */
  sol: number
  resources: Resources
  /** Lo que el jugador decidió en la Preparación de este sol. */
  plan: Plan
  history: readonly SolRecord[]
  discoveries: ReadonlySet<Milestone>
}

export type GameAction =
  | { type: 'begin' }
  | { type: 'confirmPlan'; plan: Plan }
  | { type: 'experimentDone' }
  | { type: 'choose'; mission: Mission }
  | { type: 'back' }
  | { type: 'start' }
  | { type: 'discover'; milestone: Milestone }
  | { type: 'finish'; success: boolean; value: number; roll: number }
  | { type: 'nextSol' }
  | { type: 'restart' }

const noPlan: Plan = { shield: false, experiment: false }

export const initialGame: GameState = {
  phase: { type: 'intro' },
  sol: 1,
  resources: initialResources,
  plan: noPlan,
  history: [],
  discoveries: new Set(),
}

export function missionReducer(state: GameState, action: GameAction): GameState {
  const { phase, discoveries } = state
  switch (action.type) {
    case 'begin':
      return phase.type === 'intro' ? { ...state, phase: { type: 'prep' } } : state

    case 'confirmPlan':
      if (phase.type !== 'prep' || !canAfford(state.resources, action.plan)) return state
      return {
        ...state,
        plan: action.plan,
        resources: applyPlan(state.resources, action.plan),
        phase: { type: action.plan.experiment ? 'experiment' : 'routine' },
        discoveries: spaceWeather[state.sol - 1].flare ? new Set([...discoveries, 'fulguracion']) : discoveries,
      }

    case 'experimentDone':
      return phase.type === 'experiment' ? { ...state, phase: { type: 'routine' } } : state

    case 'choose':
      if (phase.type !== 'routine' || !routineOptions(state.sol).includes(action.mission)) return state
      return { ...state, phase: { type: 'instructions', mission: action.mission } }

    case 'back':
      return phase.type === 'instructions' ? { ...state, phase: { type: 'routine' } } : state

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
      const { resources, report } = resolveSol(
        state.resources,
        spaceWeather[state.sol - 1],
        state.plan.shield,
        taskKinds[mission],
        action.success,
        action.roll,
      )
      return {
        ...state,
        resources,
        history: [...state.history, { sol: state.sol, plan: state.plan, mission, report }],
        phase: { type: 'solResult', mission, value: action.value, report, ending: missionEnding(resources, state.sol) },
        discoveries: new Set([
          ...discoveries,
          missions[mission].completion,
          ...(report.risk.chance > 0 ? ['particulas' as const] : []),
        ]),
      }
    }

    case 'nextSol':
      if (phase.type !== 'solResult') return state
      if (phase.ending) return { ...state, phase: { type: 'end', ending: phase.ending } }
      return { ...state, sol: state.sol + 1, plan: noPlan, phase: { type: 'prep' } }

    case 'restart':
      // Las fichas descubiertas se conservan entre partidas.
      return { ...initialGame, discoveries, phase: { type: 'prep' } }
  }
}
