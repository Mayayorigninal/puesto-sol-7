// Lógica pura del minijuego «Encaja los parches» (estilo "tap to rotate").
// No depende de React: el store de Zustand la usa y se puede probar sola.

/** Cuarto de vuelta: 0, 1, 2 o 3 (0°, 90°, 180°, 270°). */
export type Quarter = 0 | 1 | 2 | 3

/**
 * Siluetas de los agujeros en una caja de 100 × 100.
 * Ninguna se ve igual al girarla 90°, 180° o 270°, así que cada una
 * tiene una sola posición correcta.
 */
export const shapes = {
  ele: '22,14 46,14 46,60 84,60 84,86 22,86',
  te: '14,18 86,18 86,44 62,44 62,86 38,86 38,44 14,44',
  flecha: '50,10 90,84 50,64 10,84',
  grieta: '16,32 40,12 54,30 82,18 88,52 66,60 72,88 40,78 24,58',
} as const

export type ShapeId = keyof typeof shapes

/** Segundos que dura la emergencia. */
export const patchDeadline = 20
/** Oxígeno (%) que se pierde por segundo por cada agujero sin sellar. */
export const leakRate = 3.5

/**
 * Dónde aparece cada agujero (en % del casco), qué forma tiene y
 * en qué segundo se abre. Las posiciones evitan la ventana central.
 */
export const patchLayout = [
  { x: 13, y: 20, shape: 'ele', opensAt: 0 },
  { x: 87, y: 50, shape: 'flecha', opensAt: 0.6 },
  { x: 37, y: 79, shape: 'te', opensAt: 1.8 },
  { x: 87, y: 20, shape: 'grieta', opensAt: 3 },
  { x: 13, y: 79, shape: 'flecha', opensAt: 4.2 },
  { x: 63, y: 79, shape: 'ele', opensAt: 5.4 },
  { x: 13, y: 50, shape: 'grieta', opensAt: 6.6 },
  { x: 87, y: 79, shape: 'te', opensAt: 7.8 },
] as const satisfies ReadonlyArray<{ x: number; y: number; shape: ShapeId; opensAt: number }>

export type Patch = {
  id: number
  x: number
  y: number
  shape: ShapeId
  opensAt: number
  /** Orientación del agujero. */
  target: Quarter
  /**
   * Cuartos de vuelta que lleva el parche. Solo crece (nunca vuelve a 0)
   * para que la animación CSS siempre gire hacia el mismo lado.
   */
  turns: number
  opened: boolean
  sealed: boolean
}

function randomQuarter(random: () => number) {
  return Math.floor(random() * 4) as Quarter
}

/** El parche encaja cuando su giro, módulo 4, coincide con el del agujero. */
export function isAligned(patch: Pick<Patch, 'turns' | 'target'>) {
  return patch.turns % 4 === patch.target
}

/** Crea los parches con el agujero en una orientación al azar y el parche siempre mal girado. */
export function createPatches(random: () => number = Math.random): Patch[] {
  return patchLayout.map((spot, id) => {
    const target = randomQuarter(random)
    const offset = 1 + Math.floor(random() * 3) // 1, 2 o 3 toques para encajar
    return { id, ...spot, target, turns: target + offset, opened: false, sealed: false }
  })
}

/** Devuelve el parche girado un cuarto de vuelta (y sellado si ya encaja). */
export function rotatePatch(patch: Patch): Patch {
  if (!patch.opened || patch.sealed) return patch
  const turned = { ...patch, turns: patch.turns + 1 }
  return { ...turned, sealed: isAligned(turned) }
}

export function countLeaking(patches: readonly Patch[]) {
  return patches.filter((patch) => patch.opened && !patch.sealed).length
}
