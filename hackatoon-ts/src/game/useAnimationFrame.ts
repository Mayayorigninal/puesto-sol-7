import { useEffect, useEffectEvent } from 'react'

export function useAnimationFrame(onFrame: (seconds: number) => boolean) {
  const advance = useEffectEvent(onFrame)

  useEffect(() => {
    let previous = performance.now()
    let frame = requestAnimationFrame(tick)

    function tick(now: number) {
      const seconds = Math.min(0.05, Math.max(0, now - previous) / 1000)
      previous = now
      if (advance(seconds)) frame = requestAnimationFrame(tick)
    }

    return () => cancelAnimationFrame(frame)
  }, [])
}
