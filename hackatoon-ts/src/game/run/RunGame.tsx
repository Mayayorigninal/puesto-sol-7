import { useTranslation } from '../../i18n/useTranslation'
import { useEffect, useRef, useState } from 'react'
import { Meter } from '../../components/Meter'
import { useAnimationFrame } from '../useAnimationFrame'
import { drawRun } from './drawRun'
import { createRun, duration, jump, maxStumbles, runStatus, updateRun, world, type Run } from './run'

type RunGameProps = { onFinish: (success: boolean, meters: number) => void }

/** Minijuego de ejercicio: carrera lunar de un solo botón. */
export function RunGame({ onFinish }: RunGameProps) {
  const { t, rich } = useTranslation()
  const simulation = useRef<Run | null>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const context = useRef<CanvasRenderingContext2D | null>(null)
  const sprite = useRef<HTMLImageElement | null>(null)
  const [display, setDisplay] = useState({ remaining: duration, stumbles: 0, meters: 0 })

  useEffect(() => {
    const element = canvas.current
    if (!element) return
    simulation.current = createRun()
    const ratio = Math.min(3, window.devicePixelRatio || 1)
    element.width = Math.round(world.width * ratio)
    element.height = Math.round(world.height * ratio)
    context.current = element.getContext('2d')
    const image = new Image()
    image.src = `${import.meta.env.BASE_URL}assets/astronauta.png`
    sprite.current = image

    // También se puede saltar con la barra espaciadora o la flecha hacia arriba.
    function onKey(event: KeyboardEvent) {
      if (event.code !== 'Space' && event.code !== 'ArrowUp') return
      event.preventDefault()
      if (simulation.current) jump(simulation.current)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useAnimationFrame((seconds) => {
    const run = simulation.current
    if (!run) return false
    updateRun(run, seconds)
    if (context.current) drawRun(context.current, run, sprite.current)

    const next = { remaining: Math.max(0, Math.ceil(duration - run.elapsed)), stumbles: run.stumbles, meters: Math.floor(run.distance) }
    setDisplay((current) => (
      current.remaining === next.remaining && current.stumbles === next.stumbles && current.meters === next.meters ? current : next
    ))

    const status = runStatus(run)
    if (status === 'corriendo') return true
    onFinish(status === 'completo', run.distance)
    return false
  })

  const tap = () => { if (simulation.current) jump(simulation.current) }

  return (
    <div className="mj run-game">
      <Meter label={t('RUN.Exercise')} text={`${display.remaining} s`} value={(duration - display.remaining) / duration * 100} color="var(--life)" />
      <div className="run-marcador">
        <span className="run-tropiezos" role="img" aria-label={t('RUN.Stumbles', { count: display.stumbles, max: maxStumbles })}>
          {t('RUN.StumblesLabel')}
          {Array.from({ length: maxStumbles }, (_, index) => <i key={index} className={index < display.stumbles ? 'usado' : ''} />)}
        </span>
        <span>{display.meters} m</span>
      </div>
      <div className="lienzo-caja run-caja" onPointerDown={tap}>
        <canvas ref={canvas} aria-label={t('RUN.Canvas')} />
      </div>
      <button className="btn run-saltar" type="button" onPointerDown={tap}>{t('RUN.Jump')}</button>
      <p className="mj-nota">{rich('RUN.Hint', { emphasis: <b>{t('RUN.HintEmphasis')}</b> })}</p>
    </div>
  )
}
