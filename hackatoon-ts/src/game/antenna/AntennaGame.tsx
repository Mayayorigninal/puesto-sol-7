import { useTranslation } from '../../i18n/useTranslation'
import { useEffect, useState, type PointerEvent } from 'react'
import { Meter } from '../../components/Meter'
import { useAnimationFrame } from '../useAnimationFrame'
import {
  aimed, antennaDone, createAntenna, duration, earthAngle, goal, lightDelay, setHolding, signal, updateAntenna,
  type Antenna, type AntennaPhase,
} from './antenna'

type AntennaGameProps = { onFinish: (success: boolean, connections: number) => void }

// Pivote de la antena y distancia a la que se dibuja la Tierra (unidades del SVG).
const pivot = { x: 180, y: 182 }
const earthDistance = 140
const toRadians = (degrees: number) => degrees * Math.PI / 180
const earth = {
  x: pivot.x + Math.sin(toRadians(earthAngle)) * earthDistance,
  y: pivot.y - Math.cos(toRadians(earthAngle)) * earthDistance,
}

type View = { remaining: number; connections: number; angle: number; phase: AntennaPhase; progress: number; signal: number }

function snapshot(antenna: Antenna): View {
  return {
    remaining: Math.max(0, Math.ceil(duration - antenna.elapsed)),
    connections: antenna.connections,
    angle: Math.round(antenna.angle * 2) / 2,
    phase: antenna.phase,
    progress: antenna.phase === 'enviando' ? Math.min(1, antenna.time / lightDelay) : 0,
    signal: Math.round(signal(antenna) * 100),
  }
}

/** Minijuego de comunicaciones: reapuntar la antena hacia la Tierra después de un temblor. */
export function AntennaGame({ onFinish }: AntennaGameProps) {
  const { t } = useTranslation()
  // La simulación se crea una sola vez y solo se modifica dentro de callbacks.
  const [antenna] = useState(createAntenna)
  const [view, setView] = useState(() => snapshot(antenna))

  // Con teclado: mantener la barra espaciadora.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.code !== 'Space') return
      event.preventDefault()
      setHolding(antenna, event.type === 'keydown')
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onKey)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('keyup', onKey) }
  }, [antenna])

  useAnimationFrame((seconds) => {
    updateAntenna(antenna, seconds)
    const next = snapshot(antenna)
    setView((current) => (
      current.remaining === next.remaining && current.connections === next.connections && current.angle === next.angle
        && current.phase === next.phase && current.progress === next.progress ? current : next
    ))
    if (!antennaDone(antenna)) return true
    onFinish(antenna.connections >= goal, antenna.connections)
    return false
  })

  const press = (event: PointerEvent) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture?.(event.pointerId)
    setHolding(antenna, true)
  }
  const release = () => setHolding(antenna, false)

  const note = t(`ANTENNA.Note.${view.phase}`, { seconds: lightDelay })
  const good = aimed({ angle: view.angle })
  const pulse = {
    x: pivot.x + (earth.x - pivot.x) * view.progress,
    y: pivot.y - 30 + (earth.y - pivot.y + 30) * view.progress,
  }

  return (
    <div className="mj antena-juego">
      <Meter label={t('DUST.Time')} text={`${view.remaining} s`} value={view.remaining / duration * 100} color="var(--muted)" />
      <Meter label={t('ANTENNA.Signal')} text={t('ANTENNA.Messages', { count: view.connections, goal })} value={view.signal} color={good ? 'var(--life)' : 'var(--shield)'} />
      <div
        className={`antena-caja fase-${view.phase}`}
        onPointerDown={press} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}
      >
        <svg viewBox="0 0 360 220" role="img" aria-label={t('ANTENNA.Image', { signal: view.signal, note })}>
          <rect width="360" height="220" fill="#070B16" />
          {[[30, 30], [80, 70], [140, 20], [205, 90], [320, 120], [60, 120], [300, 30], [250, 140]].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="1.300" fill="#E8EDF7" opacity=".7" />
          ))}

          {/* la Tierra: siempre en el mismo lugar del cielo */}
          <g transform={`translate(${earth.x} ${earth.y})`}>
            {view.phase === 'enviando' && view.progress >= 0.98 && <circle r="26" fill="none" stroke="#3FC9A0" strokeWidth="3" className="antena-recibido" />}
            <circle r="17" fill="#5B9BF5" />
            <path d="M-11 -5q6 -6 11 0t9 3M-8 7q5 -3 9 1" stroke="#BFE3C8" strokeWidth="3.500" fill="none" strokeLinecap="round" />
          </g>

          {/* haz: se ve verde cuando apunta bien */}
          <g transform={`rotate(${view.angle} ${pivot.x} ${pivot.y - 30})`}>
            <path d={`M${pivot.x - 4} ${pivot.y - 34}L${pivot.x - 22} 10H${pivot.x + 22}L${pivot.x + 4} ${pivot.y - 34}Z`}
              fill={good ? '#3FC9A0' : '#5B9BF5'} opacity={good ? 0.28 : 0.12} />
          </g>

          {/* pulso del mensaje viajando a la Tierra */}
          {view.phase === 'enviando' && <circle cx={pulse.x} cy={pulse.y} r="5" fill="#3FC9A0" className="antena-pulso" />}

          {/* suelo y antena */}
          <path d="M0 190q60 -8 120 -2t120 -1t120 3V220H0Z" fill="#9AA3B8" />
          <rect x={pivot.x - 4} y={pivot.y - 30} width="8" height="40" rx="3" fill="#D8DEE9" />
          <g className="antena-plato" transform={`rotate(${view.angle} ${pivot.x} ${pivot.y - 30})`}>
            <path d={`M${pivot.x - 26} ${pivot.y - 44}Q${pivot.x} ${pivot.y - 18} ${pivot.x + 26} ${pivot.y - 44}Z`} fill="#EFF3F8" stroke="#27314A" strokeWidth="2" />
            <path d={`M${pivot.x} ${pivot.y - 34}V${pivot.y - 60}`} stroke="#27314A" strokeWidth="2.500" strokeLinecap="round" />
            <circle cx={pivot.x} cy={pivot.y - 62} r="3.500" fill={good ? '#3FC9A0' : '#EF6B4A'} />
          </g>
        </svg>
        {view.phase === 'temblor' && <div className="antena-aviso">{t('ANTENNA.Quake')}</div>}
      </div>
      <button
        className="btn antena-boton" type="button"
        onPointerDown={press} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}
      >
        {t('ANTENNA.Hold')}
      </button>
      <p className="mj-nota" aria-live="polite">{note}</p>
    </div>
  )
}
