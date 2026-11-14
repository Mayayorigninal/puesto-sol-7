export const columns = 20
export const rows = 13
export const duration = 22
export const target = 0.8

type SandWave = { position: number; sweptColumns: number }

export function createPanel() {
  return {
    dust: Array.from({ length: columns * rows }, () => 0.88 + Math.random() * 0.1),
    caps: Array<number>(columns * rows).fill(1),
    waves: [] as SandWave[],
    elapsed: 0,
    windy: false,
    windChangesAt: 2.6,
    heldTarget: 0,
    sand: 3,
  }
}

export type Panel = ReturnType<typeof createPanel>

export function scrubPanel(panel: Panel, x: number, y: number) {
  const column = x * columns
  const row = y * rows
  for (let index = 0; index < panel.dust.length; index++) {
    const dx = index % columns + 0.5 - column
    const dy = Math.floor(index / columns) + 0.5 - row
    if (dx * dx + dy * dy < 3.4) panel.dust[index] = 0
  }
}

export function updatePanel(panel: Panel, seconds: number) {
  panel.elapsed += seconds
  if (panel.elapsed >= panel.windChangesAt) {
    panel.windy = !panel.windy
    panel.windChangesAt = panel.elapsed + (panel.windy ? 1.5 : 1.9 + Math.random() * 1.6)
  }

  let dustTotal = 0
  for (let index = 0; index < panel.dust.length; index++) {
    const settled = panel.caps[index] * 0.6
    if (panel.dust[index] < settled) {
      panel.dust[index] = Math.min(settled, panel.dust[index] + 0.16 * seconds)
    }
    dustTotal += panel.dust[index]
  }

  for (const wave of panel.waves) {
    wave.position += seconds / 0.9
    const end = Math.min(columns, Math.floor(wave.position * columns) + 1)
    for (let column = wave.sweptColumns; column < end; column++) {
      for (let row = 0; row < rows; row++) {
        const index = row * columns + column
        panel.caps[index] *= 0.55
        panel.dust[index] = Math.min(panel.dust[index], panel.caps[index])
      }
    }
    wave.sweptColumns = end
  }
  panel.waves = panel.waves.filter((wave) => wave.position < 1)

  const cleanliness = 1 - dustTotal / panel.dust.length
  panel.heldTarget = cleanliness >= target ? panel.heldTarget + seconds : 0
  return cleanliness
}
