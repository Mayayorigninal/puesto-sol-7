import { useRef, useState } from 'react'
import { Icon } from '../../components/Icon'
import { Meter } from '../../components/Meter'
import { useAnimationFrame } from '../useAnimationFrame'
import { Adapter } from './Adapter'
import { assembly, confusionLevel, createTray, describeStep, shuffle, uses, type Part } from './parts'

export function FilterGame({ onFinish }: { onFinish: (success: boolean, co2: number) => void }) {
  const model = useRef({ step: 0, co2: 28, seal: 0, holding: false, level: 0 })
  const [step, setStep] = useState(0)
  const [co2, setCo2] = useState(28)
  const [seal, setSeal] = useState(0)
  const [tray, setTray] = useState(createTray)
  const [mistakes, setMistakes] = useState<Part[]>([])
  const [note, setNote] = useState('Toca la pieza que pide BIP.')
  const required = assembly[step]
  const level = confusionLevel(co2)

  useAnimationFrame((seconds) => {
    const game = model.current
    game.co2 = Math.min(100, game.co2 + seconds * 3.3)
    setCo2(game.co2)

    const nextLevel = confusionLevel(game.co2)
    if (game.step < assembly.length && nextLevel !== game.level) {
      game.level = nextLevel
      setTray(describeStep(game.step, tray.parts.map(({ id }) => id), nextLevel))
      setMistakes([])
      if (nextLevel === 1) setNote('Empiezas a sentirte pesado…')
      if (nextLevel === 3) setNote('Todo se ve borroso. ¡Rápido!')
    }

    if (game.step === assembly.length) {
      game.seal = game.holding ? Math.min(1, game.seal + seconds / 1.3) : Math.max(0, game.seal - seconds * 1.5)
      setSeal(game.seal)
      if (game.seal >= 1) {
        onFinish(true, game.co2)
        return false
      }
    }

    if (game.co2 >= 100) {
      onFinish(false, game.co2)
      return false
    }
    return true
  })

  function choose(id: Part) {
    const game = model.current
    if (game.step >= assembly.length || game.co2 >= 100) return
    if (id !== assembly[game.step]) {
      game.co2 = Math.min(100, game.co2 + 7)
      setCo2(game.co2)
      setMistakes((parts) => [...parts, id])
      setNote('Negativo. Eso no va ahí. El aire empeora.')
      return
    }

    game.step++
    game.level = confusionLevel(game.co2)
    setStep(game.step)
    setMistakes([])
    const order = tray.parts.map((part) => part.id)
    setTray(describeStep(game.step, game.level >= 1 ? shuffle(order) : order, game.level))
    setNote(game.step === assembly.length ? 'No sueltes hasta que cierre.' : 'Afirmativo. Siguiente.')
  }

  function release() {
    model.current.holding = false
  }

  return (
    <div className="mj">
      <Meter label="CO₂ en la cabina" text={`${Math.round(co2)}%`} value={co2} color={co2 > 80 ? 'var(--alert)' : co2 > 55 ? 'var(--sun)' : 'var(--life)'} />
      <Adapter step={step} />
      <div className="radio">
        <Icon name="i-bip" />
        <div aria-live="polite">
          <div className="paso">{required ? `Paso ${step + 1} de ${assembly.length} · ${uses[required]}` : 'Último paso'}</div>
          <div className="pide">{tray.request}</div>
        </div>
      </div>
      {required ? (
        <div className="bandeja" style={{ filter: level === 3 ? 'blur(2.2px)' : level === 2 ? 'blur(1.1px)' : undefined }}>
          {tray.parts.map(({ id, label }) => (
            <button key={id} type="button" className={`pieza${mistakes.includes(id) ? ' mal' : ''}`} onClick={() => choose(id)}>
              <Icon name={`p-${id}`} /><span>{label}</span>
            </button>
          ))}
        </div>
      ) : (
        <button
          type="button" className="btn sellar"
          onPointerDown={(event) => {
            if (!event.isPrimary || event.button !== 0) return
            event.currentTarget.setPointerCapture(event.pointerId)
            model.current.holding = true
          }}
          onLostPointerCapture={release}
          onBlur={release}
          onKeyDown={(event) => {
            if (event.key === ' ' || event.key === 'Enter') {
              event.preventDefault()
              model.current.holding = true
            }
          }}
          onKeyUp={(event) => {
            if (event.key === ' ' || event.key === 'Enter') release()
          }}
        >
          <i style={{ width: `${seal * 100}%` }} /><span>Mantén presionado para pegar la cinta</span>
        </button>
      )}
      <div className="mj-nota" aria-live="polite">{note}</div>
    </div>
  )
}
