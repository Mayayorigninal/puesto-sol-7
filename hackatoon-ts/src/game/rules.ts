// Reglas de la misión: cuánto cuesta cada cosa y qué pasa al terminar cada sol.
// Es lógica pura (sin React) para poder probarla y balancearla con
// `npm run balance` (scripts/balance.ts).
//
// OJO: las clases de fulguración vienen de NASA DONKI y son reales.
// Las probabilidades y los costos de este archivo son DISEÑO DEL JUEGO,
// no datos de la NASA.

import { spaceWeather, type SolWeather } from '../data/spaceWeather.ts'

export const rules = {
  sols: spaceWeather.length,
  crewMax: 5,
  /** Experimentos que hay que completar para ganar. */
  scienceGoal: 5,
  startEnergy: 3,
  shieldCost: 2,
  experimentCost: 2,
  /** Energía que cargan los paneles limpios cada sol. Cada 2 soles con polvo quitan 1, hasta un mínimo. */
  recharge: 3,
  minRecharge: 1,
  /** Energía extra por limpiar bien los paneles. */
  cleanBonus: 1,
  /** Energía que gasta el soporte vital cada sol para producir oxígeno. */
  oxygenCost: 1,
  /** Soles seguidos sin mantenimiento de soporte vital antes de que la tripulación lo resienta. */
  wearLimit: 3,
  startFood: 4,
  foodMax: 6,
  /** Raciones que come la tripulación cada sol. */
  foodPerSol: 1,
  /** Raciones que da la cosecha (si sale bien / si sale mal). */
  harvest: { success: 3, failure: 1 },
  /** Soles sin revisar la antena antes de que se pierda el pronóstico. */
  commsLimit: 2,
} as const

export type RiskLevel = 'ninguno' | 'bajo' | 'medio' | 'alto' | 'extremo'
export type Risk = { level: RiskLevel; chance: number; damage: number }

const riskByLevel: Record<RiskLevel, Risk> = {
  ninguno: { level: 'ninguno', chance: 0, damage: 0 },
  bajo: { level: 'bajo', chance: 0.1, damage: 1 },
  medio: { level: 'medio', chance: 0.3, damage: 1 },
  alto: { level: 'alto', chance: 0.7, damage: 2 },
  extremo: { level: 'extremo', chance: 0.85, damage: 3 },
}

/**
 * Riesgo de tormenta de partículas según la clase de la fulguración.
 * Cada letra (B, C, M, X) es unas 10 veces más intensa que la anterior.
 */
export function stormRisk(flare: string | null): Risk {
  if (!flare) return riskByLevel.ninguno
  const letter = flare[0]
  const size = Number(flare.slice(1))
  if (letter === 'X') return riskByLevel.extremo
  if (letter === 'M') return size >= 5 ? riskByLevel.alto : riskByLevel.medio
  if (letter === 'C') return riskByLevel.bajo
  return riskByLevel.ninguno
}

export type Resources = {
  energy: number
  crew: number
  science: number
  /** Raciones en la despensa. */
  food: number
  /** Soles seguidos sin limpiar los paneles. */
  dust: number
  /** Soles seguidos sin dar mantenimiento al soporte vital. */
  wear: number
  /** Soles seguidos sin revisar la antena. */
  silence: number
}

export const initialResources: Resources = {
  energy: rules.startEnergy,
  crew: rules.crewMax,
  science: 0,
  food: rules.startFood,
  dust: 0,
  wear: 0,
  silence: 0,
}

/** Sin antena, el pronóstico de clima espacial (que llega desde la Tierra) no se recibe. */
export function forecastHidden(resources: Pick<Resources, 'silence'>) {
  return resources.silence >= rules.commsLimit
}

export type Plan = { shield: boolean; experiment: boolean }

/** Los cuatro sistemas de la base. Cada sol solo se puede atender uno. */
export type TaskKind = 'energia' | 'soporte' | 'comida' | 'comms'
export const taskKindOrder: readonly TaskKind[] = ['energia', 'soporte', 'comida', 'comms']

export function planCost(plan: Plan) {
  return (plan.shield ? rules.shieldCost : 0) + (plan.experiment ? rules.experimentCost : 0)
}

export function canAfford(resources: Resources, plan: Plan) {
  return planCost(plan) <= resources.energy
}

/** Fase de Preparación: se paga la energía y, si hubo experimento, sube la ciencia. */
export function applyPlan(resources: Resources, plan: Plan): Resources {
  return {
    ...resources,
    energy: resources.energy - planCost(plan),
    science: resources.science + (plan.experiment ? 1 : 0),
  }
}

/**
 * Qué tan urgente es atender cada sistema, de 0 a 3 (más alto = más urgente).
 * El tope de 3 hace que, cuando todo está mal, las opciones vayan rotando.
 */
export function urgency(resources: Resources, kind: TaskKind) {
  const value = {
    energia: resources.dust,
    soporte: resources.wear,
    comida: resources.food <= 1 ? 3 : resources.food === 2 ? 2 : resources.food === 3 ? 1 : 0,
    comms: resources.silence,
  }[kind]
  return Math.min(3, value)
}

/**
 * Los dos sistemas que se ofrecen en la Rutina: los dos más urgentes.
 * Los empates se rompen con un orden que rota cada sol, para que varíen.
 */
export function routineKinds(resources: Resources, sol: number): readonly [TaskKind, TaskKind] {
  const rotated = taskKindOrder.map((_, i) => taskKindOrder[(i + sol - 1) % taskKindOrder.length])
  const sorted = [...rotated].sort((a, b) => urgency(resources, b) - urgency(resources, a))
  return [sorted[0], sorted[1]]
}

export type SolReport = {
  taskKind: TaskKind
  success: boolean
  /** Energía extra por limpiar los paneles. */
  taskEnergy: number
  /** Raciones que dio la cosecha. */
  harvested: number
  /** Corazones perdidos por fallar la tarea de soporte vital. */
  taskDamage: number
  /** Corazones perdidos por dejar el soporte vital sin mantenimiento. */
  wearDamage: number
  risk: Risk
  shielded: boolean
  /** ¿Llegó una tormenta de partículas (en el juego)? */
  storm: boolean
  stormDamage: number
  /** Energía que cargaron los paneles al final del sol. */
  recharge: number
  /** Energía que se gastó en producir oxígeno. */
  oxygenPaid: number
  /** Corazones perdidos porque no alcanzó la energía para el oxígeno. */
  airDamage: number
  /** Corazones perdidos porque se acabó la comida. */
  hungerDamage: number
  /** Mañana no llegará el pronóstico. */
  forecastLost: boolean
}

/**
 * Fase de Rutina + cierre del sol.
 * `roll` es un número al azar entre 0 y 1 que decide si llega la tormenta.
 */
export function resolveSol(
  resources: Resources,
  weather: SolWeather,
  shielded: boolean,
  taskKind: TaskKind,
  success: boolean,
  roll: number,
): { resources: Resources; report: SolReport } {
  let { energy, crew, food, dust, wear, silence } = resources
  let taskEnergy = 0
  let harvested = 0
  let taskDamage = 0
  let wearDamage = 0

  // 1. La tarea que sí se hizo.
  if (taskKind === 'energia') {
    if (success) { dust = 0; taskEnergy = rules.cleanBonus }
  } else dust += 1

  if (taskKind === 'soporte') {
    if (!success) taskDamage = 1
    wear = 0
  } else {
    wear += 1
    // Cada vez que se cumplen 3 soles sin mantenimiento, la tripulación lo resiente.
    if (wear % rules.wearLimit === 0) wearDamage = 1
  }

  if (taskKind === 'comida') {
    harvested = success ? rules.harvest.success : rules.harvest.failure
    food = Math.min(rules.foodMax, food + harvested)
  }

  if (taskKind === 'comms' && success) silence = 0
  else silence += 1

  // 2. El clima espacial.
  const risk = stormRisk(weather.flare)
  const storm = roll < risk.chance
  const stormDamage = storm && !shielded ? risk.damage : 0

  // 3. Fin del sol: los paneles cargan y el soporte vital cobra el oxígeno.
  const recharge = Math.max(rules.minRecharge, rules.recharge - Math.floor(dust / 2))
  energy += taskEnergy + recharge
  const oxygenPaid = Math.min(energy, rules.oxygenCost)
  energy -= oxygenPaid
  const airDamage = oxygenPaid < rules.oxygenCost ? 1 : 0

  // 4. La tripulación come.
  food -= rules.foodPerSol
  const hungerDamage = food < 0 ? 1 : 0
  food = Math.max(0, food)

  crew = Math.max(0, crew - taskDamage - wearDamage - stormDamage - airDamage - hungerDamage)

  const next = { ...resources, energy, crew, food, dust, wear, silence }
  return {
    resources: next,
    report: {
      taskKind, success, taskEnergy, harvested, taskDamage, wearDamage, risk, shielded, storm, stormDamage,
      recharge, oxygenPaid, airDamage, hungerDamage, forecastLost: forecastHidden(next),
    },
  }
}

export type Ending = 'ganaste' | 'sin-tripulacion' | 'sin-ciencia'

/** Devuelve cómo terminó la misión, o null si todavía sigue. */
export function missionEnding(resources: Resources, sol: number): Ending | null {
  if (resources.crew <= 0) return 'sin-tripulacion'
  if (sol < rules.sols) return null
  return resources.science >= rules.scienceGoal ? 'ganaste' : 'sin-ciencia'
}
