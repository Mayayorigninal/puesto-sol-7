// Lógica pura del minijuego «¡A correr!» (carrera sin fin, de un solo botón).
// El astronauta corre solo. Tocar = saltar.
//  - Cráter: hay que saltarlo.
//  - Meteorito: pasa a la altura de un salto, así que NO hay que saltar.

/** Tamaño del mundo en unidades de dibujo (el lienzo se escala a esto). */
export const world = { width: 360, height: 200, ground: 158 } as const
/** Segundos que dura la rutina de ejercicio. */
export const duration = 20
/** Con este número de tropiezos se pierde. */
export const maxStumbles = 3

export const astronaut = { x: 64, width: 26, height: 46 } as const
/** Altura (sobre el suelo) a la que vuela el centro de un meteorito, y su radio. */
export const meteor = { altitude: 76, radius: 9 } as const

// En la Luna todo pesa unas 6 veces menos: los saltos son altos y lentos.
const gravity = 800
const jumpSpeed = 360
const startSpeed = 150
const endSpeed = 250
const spawnX = world.width + 30

export type ObstacleKind = 'crater' | 'meteoro'
export type Obstacle = { kind: ObstacleKind; x: number; width: number; hit: boolean }

export type Run = {
  elapsed: number
  /** Altura de los pies sobre el suelo (0 = en el suelo). */
  height: number
  velocity: number
  stumbles: number
  /** Segundos que quedan de «parpadeo» después de un tropiezo. */
  invulnerable: number
  /** Metros recorridos (para mostrar). */
  distance: number
  obstacles: Obstacle[]
  /** Momento en que el siguiente obstáculo debe llegar al astronauta. */
  nextArrival: number
  nextKind: ObstacleKind
}

export function createRun(): Run {
  return {
    elapsed: 0, height: 0, velocity: 0, stumbles: 0, invulnerable: 0, distance: 0,
    obstacles: [], nextArrival: 2.2, nextKind: 'crater',
  }
}

export function runSpeed(elapsed: number) {
  return startSpeed + (endSpeed - startSpeed) * Math.min(1, elapsed / duration)
}

function obstacleSpeed(kind: ObstacleKind, elapsed: number) {
  return runSpeed(elapsed) * (kind === 'meteoro' ? 1.25 : 1)
}

/** Salta si el astronauta está en el suelo. Devuelve true si saltó. */
export function jump(run: Run) {
  if (run.height > 0) return false
  run.velocity = jumpSpeed
  return true
}

function collides(run: Run, obstacle: Obstacle) {
  if (obstacle.kind === 'crater') {
    const inside = astronaut.x > obstacle.x + 4 && astronaut.x < obstacle.x + obstacle.width - 4
    return inside && run.height < 6
  }
  const near = Math.abs(obstacle.x - astronaut.x) < meteor.radius + astronaut.width / 2 - 3
  const headTop = run.height + astronaut.height - 4
  return near && headTop > meteor.altitude - meteor.radius && run.height < meteor.altitude + meteor.radius
}

/** Avanza la simulación `seconds` segundos. */
export function updateRun(run: Run, seconds: number, random: () => number = Math.random) {
  run.elapsed += seconds
  run.invulnerable = Math.max(0, run.invulnerable - seconds)
  run.distance += runSpeed(run.elapsed) * seconds / 30

  // salto
  if (run.height > 0 || run.velocity > 0) {
    run.velocity -= gravity * seconds
    run.height += run.velocity * seconds
    if (run.height <= 0) { run.height = 0; run.velocity = 0 }
  }

  // Los obstáculos se programan por la hora a la que LLEGAN al astronauta,
  // así siempre hay tiempo de aterrizar entre uno y otro (el juego es justo).
  const travel = (spawnX - astronaut.x) / obstacleSpeed(run.nextKind, run.elapsed)
  if (run.nextArrival < duration - 0.4 && run.elapsed >= run.nextArrival - travel) {
    const width = run.nextKind === 'crater' ? 30 + random() * 18 : meteor.radius * 2
    run.obstacles.push({ kind: run.nextKind, x: spawnX, width, hit: false })
    const hurry = 1 - 0.25 * Math.min(1, run.elapsed / duration)
    run.nextArrival += (1.35 + random() * 0.75) * hurry
    run.nextKind = random() < 0.35 ? 'meteoro' : 'crater'
  }

  for (const obstacle of run.obstacles) {
    obstacle.x -= obstacleSpeed(obstacle.kind, run.elapsed) * seconds
    if (!obstacle.hit && run.invulnerable === 0 && collides(run, obstacle)) {
      obstacle.hit = true
      run.stumbles += 1
      run.invulnerable = 1
    }
  }
  run.obstacles = run.obstacles.filter((obstacle) => obstacle.x > -60)
}

export type RunStatus = 'corriendo' | 'completo' | 'fallo'

export function runStatus(run: Run): RunStatus {
  if (run.stumbles >= maxStumbles) return 'fallo'
  return run.elapsed >= duration ? 'completo' : 'corriendo'
}
