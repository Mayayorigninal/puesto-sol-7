export const leakSchedule = [0, 1.8, 3.4, 5.2, 6.5, 8, 9.4, 10.6, 11.8]
export const repairTime = 1.25
export const deadline = 22

export function createLeaks() {
  return {
    elapsed: 0,
    oxygen: 100,
    finished: false,
    holes: leakSchedule.map((opensAt, id) => ({
      id,
      opensAt,
      progress: 0,
      sealed: false,
      holders: new Set<string>(),
    })),
  }
}

export type LeakState = ReturnType<typeof createLeaks>

export function advanceLeaks(state: LeakState, seconds: number) {
  if (state.finished) return null
  state.elapsed += seconds
  let exposed = 0
  for (const hole of state.holes) {
    if (hole.opensAt > state.elapsed || hole.sealed) continue
    if (hole.holders.size > 0) {
      hole.progress = Math.min(1, hole.progress + seconds / repairTime)
      hole.sealed = hole.progress >= 1
    } else {
      exposed++
      hole.progress = Math.max(0, hole.progress - seconds * 0.65)
    }
  }
  state.oxygen = Math.max(0, state.oxygen - exposed * seconds * 5.5)
  const success = state.holes.every((hole) => hole.sealed)
  if (success || state.oxygen <= 0 || state.elapsed >= deadline) {
    state.finished = true
    return success
  }
  return null
}
