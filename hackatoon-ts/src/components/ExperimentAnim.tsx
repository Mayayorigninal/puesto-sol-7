import { experiments } from '../data/experiments'
import { rules } from '../game/rules.ts'

type ExperimentAnimProps = {
  /** Experimentos completados, contando este. */
  science: number
  onDone: () => void
}

/** Pequeña animación (solo CSS) de un frasco burbujeando al completar un experimento. */
export function ExperimentAnim({ science, onDone }: ExperimentAnimProps) {
  const experiment = experiments[Math.min(science, experiments.length) - 1]
  const missing = Math.max(0, rules.scienceGoal - science)

  return (
    <div className="carta carta-centrada">
      <div className="eyebrow">Laboratorio del puesto</div>
      <svg className="frasco" viewBox="0 0 120 140" aria-hidden="true">
        <path className="frasco-liquido" d="M38 92 L28 118 Q26 126 34 126 H86 Q94 126 92 118 L82 92 Z" />
        <circle className="burbuja b1" cx="48" cy="112" r="5" />
        <circle className="burbuja b2" cx="63" cy="116" r="4" />
        <circle className="burbuja b3" cx="74" cy="110" r="6" />
        <path className="frasco-vidrio" d="M48 14 H72 M52 14 V58 L26 118 Q22 130 34 130 H86 Q98 130 94 118 L68 58 V14" />
      </svg>
      <h2 className="dice" style={{ color: 'var(--shield)' }}>¡{experiment.title} listo!</h2>
      {experiment.fact && <div className="real"><b>Ciencia de verdad</b>{experiment.fact}{experiment.source && <span className="fuente-inline"> — {experiment.source}</span>}</div>}
      <p className="lead">
        {missing > 0
          ? `Llevas ${science} de ${rules.scienceGoal}. ${missing === 1 ? 'Falta 1 experimento' : `Faltan ${missing} experimentos`} para cumplir la misión.`
          : '¡Ya cumpliste la meta científica! Ahora cuida a la tripulación hasta el final.'}
      </p>
      <button className="btn" type="button" onClick={onDone}>A trabajar</button>
    </div>
  )
}
