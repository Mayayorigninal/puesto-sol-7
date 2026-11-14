import { useLayoutEffect } from 'react'
import { Hull } from '../../components/Hull'
import { usePatchStore } from '../../store/usePatchStore'
import { useAnimationFrame } from '../useAnimationFrame'
import { PatchHole } from './PatchHole'
import { PatchClock, PatchCounter, PatchOxygen } from './PatchHud'
import { patchLayout } from './patches'

type PatchGameProps = { onFinish: (success: boolean, oxygen: number) => void }

export function PatchGame({ onFinish }: PatchGameProps) {
  const reset = usePatchStore((state) => state.reset)
  const tick = usePatchStore((state) => state.tick)
  const critical = usePatchStore((state) => state.oxygen < 30)

  // useLayoutEffect corre antes de pintar y antes que useAnimationFrame,
  // así nunca se ve (ni se simula) un cuadro de la partida anterior.
  useLayoutEffect(() => reset(), [reset])

  useAnimationFrame((seconds) => {
    tick(seconds)
    const { status, oxygen } = usePatchStore.getState()
    if (status === 'playing') return true
    onFinish(status === 'won', oxygen)
    return false
  })

  return (
    <div className="mj leak-game patch-game">
      <div className="leak-heading">
        <div>
          <div className="eyebrow">Emergencia · micrometeoritos</div>
          <h2>¡Encaja los parches!</h2>
        </div>
        <PatchClock />
      </div>
      <PatchOxygen />
      <Hull critical={critical}>
        {patchLayout.map((_, id) => <PatchHole key={id} id={id} />)}
      </Hull>
      <PatchCounter />
      <p className="mj-nota">Toca un parche para girarlo 90°. Se sella cuando su forma coincide con el agujero.</p>
    </div>
  )
}
