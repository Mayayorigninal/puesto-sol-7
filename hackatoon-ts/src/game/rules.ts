// Reglas de la misión: cuánto cuesta cada cosa y qué pasa al terminar cada sol.
// Es lógica pura (sin React) para poder probarla y balancearla con
// `node scripts/balance.ts`.
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
  startEnergy: 2,
  shieldCost: 2,
  experimentCost: 2,
  /** Energía que dan los paneles limpios cada sol. Cada día sin limpiarlos quita 1. */
  recharge: 2,
  /** Energía extra por limpiar los paneles (si sale bien / si sale mal). */
  cleanBonus: { success: 1, failure: 0 },
  /** Soles seguidos sin mantenimiento de soporte vital antes de que la tripulación lo resienta. */
  wearLimit: 2,
} as const

export type RiskLevel = 'ninguno' | 'bajo' | 'medio' | 'alto' | 'extremo'
export const riskLabels: Record<RiskLevel, string> = {
  ninguno: 'Sin riesgo',
  bajo: 'Riesgo bajo',
  medio: 'Riesgo medio',
  alto: 'Riesgo alto',
  extremo: 'Riesgo extremo',
}
export type Risk = { level: RiskLevel; chance: number; damage: number }

const riskByLevel: Record<RiskLevel, Risk> = {
  ninguno: { level: 'ninguno', chance: 0, damage: 0 },
  bajo: { level: 'bajo', chance: 0.1, damage: 1 },
  medio: { level: 'medio', chance: 0.4, damage: 1 },
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
  /** Soles seguidos sin limpiar los paneles. */
  dust: number
  /** Soles seguidos sin dar mantenimiento al soporte vital. */
  wear: number
}

export const initialResources: Resources = {
  energy: rules.startEnergy,
  crew: rules.crewMax,
  science: 0,
  dust: 0,
  wear: 0,
}

export type Plan = { shield: boolean; experiment: boolean }
export type TaskKind = 'energia' | 'soporte'

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

export type SolReport = {
  taskKind: TaskKind
  success: boolean
  /** Energía ganada por la tarea de paneles. */
  taskEnergy: number
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
  let { energy, crew, dust, wear } = resources
  let taskEnergy = 0
  let taskDamage = 0
  let wearDamage = 0

  if (taskKind === 'energia') {
    taskEnergy = success ? rules.cleanBonus.success : rules.cleanBonus.failure
    // Si sale mal, los paneles quedan igual de sucios (pero no peor).
    if (success) dust = 0
    wear += 1
    if (wear >= rules.wearLimit) wearDamage = 1
  } else {
    if (!success) taskDamage = 1
    wear = 0
    dust += 1
  }

  const risk = stormRisk(weather.flare)
  const storm = roll < risk.chance
  const stormDamage = storm && !shielded ? risk.damage : 0

  const recharge = Math.max(0, rules.recharge - dust)
  energy += taskEnergy + recharge
  crew = Math.max(0, crew - taskDamage - wearDamage - stormDamage)

  return {
    resources: { ...resources, energy, crew, dust, wear },
    report: { taskKind, success, taskEnergy, taskDamage, wearDamage, risk, shielded, storm, stormDamage, recharge },
  }
}

export type Ending = 'ganaste' | 'sin-tripulacion' | 'sin-ciencia'

/** Devuelve cómo terminó la misión, o null si todavía sigue. */
export function missionEnding(resources: Resources, sol: number): Ending | null {
  if (resources.crew <= 0) return 'sin-tripulacion'
  if (sol < rules.sols) return null
  return resources.science >= rules.scienceGoal ? 'ganaste' : 'sin-ciencia'
}
