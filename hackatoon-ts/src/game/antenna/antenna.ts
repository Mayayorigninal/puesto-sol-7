// Lógica pura del minijuego «Apunta a la Tierra».
// Un temblor lunar mueve la antena. Mientras mantienes presionado, la antena gira
// (de un lado a otro); al soltar se detiene. Si quedó apuntando a la Tierra,
// el mensaje sale y tarda lo mismo que la luz real en llegar: ~1.3 segundos.

export const duration = 22
/** Conexiones que hacen falta para ganar. */
export const goal = 3
/** La Tierra casi no se mueve en el cielo de la Luna: su ángulo es fijo (grados desde la vertical). */
export const earthAngle = 28
/** Distancia media Tierra-Luna (km) y velocidad de la luz (km/s). */
export const lightDelay = Math.round(384_400 / 299_792 * 10) / 10

const range = 75
const sweepSpeed = 48
/** Margen (grados) para que la señal se considere buena. */
export const tolerance = 10
const quakeTime = 0.9

export type AntennaPhase = 'temblor' | 'apuntando' | 'enviando'
export type Antenna = {
  elapsed: number
  phase: AntennaPhase
  /** Segundos en la fase actual. */
  time: number
  angle: number
  /** Dirección del giro: 1 o -1. */
  direction: number
  holding: boolean
  connections: number
}

function knockedAngle(random: () => number) {
  // Después del temblor la antena queda lejos de la Tierra (al menos 35°).
  for (;;) {
    const angle = -range + random() * range * 2
    if (Math.abs(angle - earthAngle) >= 35) return angle
  }
}

export function createAntenna(random: () => number = Math.random): Antenna {
  return { elapsed: 0, phase: 'temblor', time: 0, angle: knockedAngle(random), direction: 1, holding: false, connections: 0 }
}

/** Qué tan buena es la señal, de 0 a 1. */
export function signal(antenna: Pick<Antenna, 'angle'>) {
  return Math.max(0, 1 - Math.abs(antenna.angle - earthAngle) / 70)
}

export function aimed(antenna: Pick<Antenna, 'angle'>) {
  return Math.abs(antenna.angle - earthAngle) <= tolerance
}

export function setHolding(antenna: Antenna, holding: boolean) {
  antenna.holding = holding
}

export function updateAntenna(antenna: Antenna, seconds: number, random: () => number = Math.random) {
  antenna.elapsed += seconds
  antenna.time += seconds

  if (antenna.phase === 'temblor') {
    if (antenna.time >= quakeTime) { antenna.phase = 'apuntando'; antenna.time = 0 }
    return
  }

  if (antenna.phase === 'enviando') {
    if (antenna.time >= lightDelay) {
      antenna.connections += 1
      antenna.phase = 'temblor'
      antenna.time = 0
      antenna.angle = knockedAngle(random)
    }
    return
  }

  // apuntando
  if (antenna.holding) {
    antenna.angle += antenna.direction * sweepSpeed * seconds
    if (antenna.angle > range) { antenna.angle = range; antenna.direction = -1 }
    if (antenna.angle < -range) { antenna.angle = -range; antenna.direction = 1 }
  } else if (aimed(antenna)) {
    antenna.phase = 'enviando'
    antenna.time = 0
  }
}

export function antennaDone(antenna: Antenna) {
  return antenna.connections >= goal || antenna.elapsed >= duration
}
