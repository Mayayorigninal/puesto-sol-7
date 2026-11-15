// Lógica pura del minijuego «¡Cosecha a tiempo!».
// Cada maceta crece sola. Hay que tocarla justo cuando está lista:
//  - antes de tiempo: la planta se arranca y vuelve a empezar (no da nada);
//  - si te tardas: se seca y hay que volver a sembrar.

export const duration = 20
/** Cosechas que hacen falta para ganar. */
export const goal = 8
export const potCount = 4

const readyWindow = { start: 1.6, end: 1.0 }
const witherTime = 1.1

export type PotStage = 'creciendo' | 'lista' | 'seca'
export type Pot = {
  stage: PotStage
  /** Segundos que lleva en la etapa actual. */
  time: number
  /** Segundos que tarda en crecer esta siembra. */
  growTime: number
}
export type Harvest = { elapsed: number; harvested: number; early: number; withered: number; pots: Pot[] }
export type TapResult = 'cosecha' | 'temprano' | 'seca'

function sow(random: () => number): Pot {
  return { stage: 'creciendo', time: 0, growTime: 2.4 + random() * 2.2 }
}

export function createHarvest(random: () => number = Math.random): Harvest {
  // Las primeras siembras empiezan con distinto avance para que no maduren todas juntas.
  const pots = Array.from({ length: potCount }, (_, index) => {
    const pot = sow(random)
    pot.time = pot.growTime * (index / potCount) * 0.8
    return pot
  })
  return { elapsed: 0, harvested: 0, early: 0, withered: 0, pots }
}

/** Cuánto tiempo dura «lista» una planta: se acorta conforme avanza el turno. */
export function readyTime(elapsed: number) {
  return readyWindow.start + (readyWindow.end - readyWindow.start) * Math.min(1, elapsed / duration)
}

/** Avance del crecimiento de 0 a 1 (para dibujar la planta más grande). */
export function growth(pot: Pot) {
  return pot.stage === 'creciendo' ? Math.min(1, pot.time / pot.growTime) : 1
}

export function updateHarvest(harvest: Harvest, seconds: number, random: () => number = Math.random) {
  harvest.elapsed += seconds
  harvest.pots = harvest.pots.map((pot) => {
    const time = pot.time + seconds
    if (pot.stage === 'creciendo' && time >= pot.growTime) return { ...pot, stage: 'lista', time: 0 }
    if (pot.stage === 'lista' && time >= readyTime(harvest.elapsed)) {
      harvest.withered += 1
      return { ...pot, stage: 'seca', time: 0 }
    }
    if (pot.stage === 'seca' && time >= witherTime) return sow(random)
    return { ...pot, time }
  })
}

export function tapPot(harvest: Harvest, index: number, random: () => number = Math.random): TapResult {
  const pot = harvest.pots[index]
  const result: TapResult = pot.stage === 'lista' ? 'cosecha' : pot.stage === 'creciendo' ? 'temprano' : 'seca'
  if (result === 'cosecha') harvest.harvested += 1
  if (result === 'temprano') harvest.early += 1
  harvest.pots = harvest.pots.map((current, i) => (i === index ? sow(random) : current))
  return result
}

export function harvestDone(harvest: Harvest) {
  return harvest.harvested >= goal || harvest.elapsed >= duration
}
