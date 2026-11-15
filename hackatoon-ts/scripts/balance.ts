// Comprueba el balance del juego jugando miles de partidas automáticas.
// Uso:  npm run balance   (Node 22.18 o más nuevo)
//
// La meta: que ni «protegerse siempre» ni «nunca protegerse» ganen seguido,
// y que solo quien decide con criterio gane de forma consistente.

import { spaceWeather } from '../src/data/spaceWeather.ts'
import {
  applyPlan, canAfford, forecastHidden, initialResources, missionEnding, resolveSol, routineKinds, rules, stormRisk, urgency,
  type Ending, type Plan, type Resources, type TaskKind,
} from '../src/game/rules.ts'

type Strategy = {
  name: string
  plan: (resources: Resources, sol: number) => Plan
  task: (resources: Resources, options: readonly [TaskKind, TaskKind]) => TaskKind
}

/** Recorta el plan a lo que alcanza con la energía, respetando la prioridad indicada. */
function afford(resources: Resources, wanted: Plan, first: keyof Plan): Plan {
  if (canAfford(resources, wanted)) return wanted
  const only: Plan = { shield: false, experiment: false, [first]: wanted[first] }
  if (canAfford(resources, only)) return only
  const second = first === 'shield' ? 'experiment' : 'shield'
  const other: Plan = { shield: false, experiment: false, [second]: wanted[second] }
  return canAfford(resources, other) ? other : { shield: false, experiment: false }
}

/** Lo que el jugador ve: el riesgo real, o nada si no hay pronóstico. */
const visibleRisk = (r: Resources, sol: number) => forecastHidden(r) ? null : stormRisk(spaceWeather[sol - 1].flare)

/** Elige la tarea más urgente de las dos (un jugador que lee los avisos). */
const urgentTask = (r: Resources, options: readonly [TaskKind, TaskKind]) =>
  urgency(r, options[1]) > urgency(r, options[0]) ? options[1] : options[0]

/** Elige una de las dos al azar, sin leer los avisos. */
const firstTask = (_: Resources, options: readonly [TaskKind, TaskKind]) => options[Math.random() < 0.5 ? 0 : 1]

const strategies: Strategy[] = [
  {
    name: 'Protegerse siempre (blindaje ante cualquier alerta o a ciegas, ciencia si sobra)',
    plan: (r, sol) => {
      const risk = visibleRisk(r, sol)
      return afford(r, { shield: risk === null || risk.chance > 0, experiment: true }, 'shield')
    },
    task: urgentTask,
  },
  {
    name: 'Nunca protegerse (solo ciencia)',
    plan: (r) => afford(r, { shield: false, experiment: true }, 'experiment'),
    task: urgentTask,
  },
  {
    name: 'Con criterio (blindaje en riesgo alto, o medio con poca tripulación; atiende lo más urgente)',
    plan: (r, sol) => {
      const risk = visibleRisk(r, sol)
      const level = risk?.level ?? 'medio'
      const shield = level === 'alto' || level === 'extremo' || (level === 'medio' && r.crew <= 2)
      const needed = rules.scienceGoal - r.science
      const wanted = { shield, experiment: needed > 0 }
      return afford(r, wanted, shield ? 'shield' : 'experiment')
    },
    task: urgentTask,
  },
  {
    name: 'Con criterio en la Preparación, pero elige tareas al azar',
    plan: (r, sol) => {
      const risk = visibleRisk(r, sol)
      const level = risk?.level ?? 'medio'
      const shield = level === 'alto' || level === 'extremo' || (level === 'medio' && r.crew <= 2)
      return afford(r, { shield, experiment: r.science < rules.scienceGoal }, shield ? 'shield' : 'experiment')
    },
    task: firstTask,
  },
]

function play(strategy: Strategy, skill: number): { ending: Ending; science: number } {
  let resources = initialResources
  for (let sol = 1; sol <= rules.sols; sol++) {
    const plan = strategy.plan(resources, sol)
    resources = applyPlan(resources, plan)
    const task = strategy.task(resources, routineKinds(resources, sol))
    const success = Math.random() < skill
    resources = resolveSol(resources, spaceWeather[sol - 1], plan.shield, task, success, Math.random()).resources
    const ending = missionEnding(resources, sol)
    if (ending) return { ending, science: resources.science }
  }
  throw new Error('La misión no terminó')
}

const games = 20_000
for (const skill of [0.6, 0.8, 0.95]) {
  console.log(`\nJugador que gana el ${skill * 100}% de los minijuegos (${games} partidas por estrategia)`)
  for (const strategy of strategies) {
    const count = { ganaste: 0, 'sin-tripulacion': 0, 'sin-ciencia': 0 }
    for (let i = 0; i < games; i++) count[play(strategy, skill).ending]++
    const pct = (n: number) => `${(n / games * 100).toFixed(0).padStart(3)}%`
    console.log(`  gana ${pct(count.ganaste)} · sin tripulación ${pct(count['sin-tripulacion'])} · sin ciencia ${pct(count['sin-ciencia'])}  ${strategy.name}`)
  }
}
