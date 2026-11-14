import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { Meter } from '../../components/Meter'
import { useAnimationFrame } from '../useAnimationFrame'
import { drawPanel } from './drawPanel'
import { createPanel, duration, scrubPanel, target, updatePanel, type Panel } from './panel'

type DustGameProps = {
  onSand: () => void
  onFinish: (success: boolean, cleanliness: number) => void
}

export function DustGame({ onSand, onFinish }: DustGameProps) {
  const simulation = useRef<Panel | null>(null)
  const [display, setDisplay] = useState({ remaining: duration, cleanliness: 8, windy: false })
  const [sand, setSand] = useState(3)
  const [note, setNote] = useState('Frota el panel con el dedo.')
  const canvas = useRef<HTMLCanvasElement>(null)
  const context = useRef<CanvasRenderingContext2D | null>(null)
  const activePointer = useRef<number | null>(null)

  useEffect(() => {
    const element = canvas.current
    if (!element) return
    const panel = createPanel()
    simulation.current = panel
    element.width = Math.round(400 * window.devicePixelRatio)
    element.height = Math.round(260 * window.devicePixelRatio)
    context.current = element.getContext('2d')
    if (context.current) drawPanel(context.current, panel)
  }, [])

  useAnimationFrame((seconds) => {
    const panel = simulation.current
    if (!panel) return false
    const cleanliness = updatePanel(panel, seconds)
    if (context.current) drawPanel(context.current, panel)
    setDisplay({ remaining: Math.max(0, duration - panel.elapsed), cleanliness: cleanliness * 100, windy: panel.windy })

    const success = panel.heldTarget >= 0.7
    if (success || panel.elapsed >= duration) {
      onFinish(success, cleanliness)
      return false
    }
    return true
  })

  function scrub(event: PointerEvent<HTMLCanvasElement>) {
    const panel = simulation.current
    if (!panel) return
    const bounds = event.currentTarget.getBoundingClientRect()
    scrubPanel(panel, (event.clientX - bounds.left) / bounds.width, (event.clientY - bounds.top) / bounds.height)
  }

  function addSand() {
    const panel = simulation.current
    if (!panel || panel.sand === 0) return
    panel.sand--
    setSand(panel.sand)
    onSand()
    if (panel.windy) {
      panel.waves.push({ position: 0, sweptColumns: 0 })
      setNote('¡Eso! El viento arrastra la arena y tumba el polvo.')
    } else {
      setNote('Sin viento, la arena se quedó ahí tirada.')
    }
  }

  return (
    <div className="mj">
      <Meter label="Tiempo" text={String(Math.ceil(display.remaining))} value={display.remaining / duration * 100} color="var(--muted)" />
      <Meter label="Energía del panel" text="meta 80%" value={display.cleanliness} color="var(--sun)" target={target * 100} />
      <div className="lienzo-caja">
        <canvas
          ref={canvas}
          aria-label="Panel solar cubierto de polvo"
          onPointerDown={(event) => {
            if (event.button !== 0 || activePointer.current !== null) return
            activePointer.current = event.pointerId
            event.currentTarget.setPointerCapture(event.pointerId)
            scrub(event)
          }}
          onPointerMove={(event) => {
            if (activePointer.current === event.pointerId) scrub(event)
          }}
          onLostPointerCapture={(event) => {
            if (activePointer.current === event.pointerId) activePointer.current = null
          }}
        />
        {display.windy && <div className="viento">¡VIENTO!</div>}
      </div>
      <div className="mj-nota" aria-live="polite">{note}</div>
      <div className="polvo-pie">
        <button className="btn" type="button" disabled={sand === 0} onClick={addSand}>Echar arena · {sand}</button>
      </div>
    </div>
  )
}
