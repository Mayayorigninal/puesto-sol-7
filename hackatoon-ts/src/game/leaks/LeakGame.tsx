import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Meter } from '../../components/Meter'
import { useAnimationFrame } from '../useAnimationFrame'
import { advanceLeaks, createLeaks, deadline } from './leaks'

const positions = [
  [22, 26], [74, 65], [73, 23], [26, 72], [48, 47],
  [18, 48], [52, 80], [80, 44], [49, 18],
]

export function LeakGame({ onFinish }: { onFinish: (success: boolean, oxygen: number) => void }) {
  const simulation = useRef(createLeaks())
  const [game, setGame] = useState(createLeaks)

  useEffect(() => {
    function releaseAll() {
      for (const hole of simulation.current.holes) hole.holders.clear()
    }
    window.addEventListener('blur', releaseAll)
    document.addEventListener('visibilitychange', releaseAll)
    return () => {
      window.removeEventListener('blur', releaseAll)
      document.removeEventListener('visibilitychange', releaseAll)
    }
  }, [])

  useAnimationFrame((seconds) => {
    const result = advanceLeaks(simulation.current, seconds)
    setGame({ ...simulation.current, holes: simulation.current.holes.map((hole) => ({ ...hole, holders: new Set(hole.holders) })) })
    if (result !== null) {
      onFinish(result, simulation.current.oxygen)
      return false
    }
    return true
  })

  const sealed = game.holes.filter((hole) => hole.sealed).length
  const exposed = game.holes.filter((hole) => hole.opensAt <= game.elapsed && !hole.sealed && hole.holders.size === 0).length

  return (
    <div className="mj leak-game">
      <div className="leak-heading">
        <div><div className="eyebrow">Emergencia · casco dañado</div><h2>¡Que no se escape el aire!</h2></div>
        <span className="leak-clock">{Math.max(0, Math.ceil(deadline - game.elapsed))} s</span>
      </div>
      <Meter label="Oxígeno de la cabina" text={Math.ceil(game.oxygen) + '%'} value={game.oxygen} color={game.oxygen < 30 ? 'var(--alert)' : 'var(--life)'} />
      <div className={'hull ' + (game.oxygen < 30 ? 'hull-critical' : '')} aria-label="Interior de la nave">
        <div className="hull-window" aria-hidden="true"><div className="hull-planet" /></div>
        <div className="hull-label" aria-hidden="true">SOL 7 · CABINA 01</div>
        {game.holes.map((hole) => {
          if (hole.opensAt > game.elapsed) return null
          const held = hole.holders.size > 0
          return (
            <button
              key={hole.id}
              type="button"
              className={'breach ' + (hole.sealed ? 'breach-sealed' : held ? 'breach-held' : 'breach-open')}
              style={{ left: positions[hole.id][0] + '%', top: positions[hole.id][1] + '%', '--seal': hole.progress * 360 + 'deg' } as CSSProperties}
              aria-label={'Agujero ' + (hole.id + 1) + (hole.sealed ? ', sellado' : ', mantén presionado para taparlo')}
              aria-disabled={hole.sealed}
              onPointerDown={(event) => {
                if (event.button !== 0 || hole.sealed) return
                event.preventDefault()
                event.currentTarget.setPointerCapture(event.pointerId)
                simulation.current.holes[hole.id].holders.add('pointer-' + event.pointerId)
              }}
              onPointerUp={(event) => simulation.current.holes[hole.id].holders.delete('pointer-' + event.pointerId)}
              onPointerCancel={(event) => simulation.current.holes[hole.id].holders.delete('pointer-' + event.pointerId)}
              onLostPointerCapture={(event) => simulation.current.holes[hole.id].holders.delete('pointer-' + event.pointerId)}
              onKeyDown={(event) => {
                if (event.key === ' ' || event.key === 'Enter') {
                  event.preventDefault()
                  simulation.current.holes[hole.id].holders.add('keyboard')
                }
              }}
              onKeyUp={() => simulation.current.holes[hole.id].holders.delete('keyboard')}
              onBlur={() => simulation.current.holes[hole.id].holders.delete('keyboard')}
            >
              <span className="breach-core" aria-hidden="true">{hole.sealed ? '✓' : held ? '✚' : ''}</span>
              <span className="breach-air" aria-hidden="true" />
            </button>
          )
        })}
      </div>
      <div className="leak-status"><span>{sealed} / {game.holes.length} sellados</span><span>{exposed > 0 ? exposed + ' fugas abiertas' : 'Aire contenido'}</span></div>
      <p className="mj-nota">Mantén pulsado cada agujero hasta sellarlo. Puedes usar varios dedos o Tab + espacio.</p>
    </div>
  )
}
