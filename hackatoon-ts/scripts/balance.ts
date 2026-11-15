// Comprueba el balance del juego jugando miles de partidas automáticas.
// Uso:  node scripts/balance.ts        (Node 22.18 o más nuevo)
//
// La meta: que ni «protegerse siempre» ni «nunca protegerse» ganen seguido,
// y que solo quien decide con criterio gane de forma consistente.

import { spaceWeather } from '../src/data/spaceWeather.ts'
import {
  applyPlan, canAfford, initialResources, missionEnding, resolveSol, rules, stormRisk,
  type Ending, type Plan, type Resources, type TaskKind,
} from '../src/game/rules.ts'

type Strategy = {
  name: string
  plan: (resources: Resources, sol: number) => Plan
  task: (resources: Resources, sol: number) => TaskKind
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

const riskOf = (sol: number) => stormRisk(spaceWeather[sol - 1].flare)
const sensibleTask = (resources: Resources): TaskKind =>
  resources.wear + 1 >= rules.wearLimit ? 'soporte' : 'energia'

const strategies: Strategy[] = [
  {
    name: 'Protegerse siempre (blindaje ante cualquier alerta, ciencia si sobra)',
    plan: (r, sol) => afford(r, { shield: riskOf(sol).chance > 0, experiment: true }, 'shield'),
    task: sensibleTask,
  },
  {
    name: 'Nunca protegerse (solo ciencia)',
    plan: (r) => afford(r, { shield: false, experiment: true }, 'experiment'),
    task: sensibleTask,
  },
  {
    name: 'Con criterio (blindaje en riesgo alto, o medio con poca tripulación)',
    plan: (r, sol) => {
      const risk = riskOf(sol)
      const shield = risk.level === 'alto' || risk.level === 'extremo' || (risk.level === 'medio' && r.crew <= 2)
      const needed = rules.scienceGoal - r.science
      return afford(r, { shield, experiment: needed > 0 }, shield ? 'shield' : 'experiment')
    },
    task: sensibleTask,
  },
  {
    name: 'Solo paneles (nunca da mantenimiento al soporte vital)',
    plan: (r, sol) => afford(r, { shield: riskOf(sol).chance >= 0.4, experiment: true }, 'experiment'),
    task: () => 'energia',
  },
  {
    name: 'Solo soporte vital (nunca limpia los paneles)',
    plan: (r, sol) => afford(r, { shield: riskOf(sol).chance >= 0.4, experiment: true }, 'experiment'),
    task: () => 'soporte',
  },
]

function play(strategy: Strategy, skill: number): { ending: Ending; science: number } {
  let resources = initialResources
  for (let sol = 1; sol <= rules.sols; sol++) {
    const plan = strategy.plan(resources, sol)
    resources = applyPlan(resources, plan)
    const task = strategy.task(resources, sol)
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
