import { donkiCredit, donkiUrl, sepEventsInWeek, spaceWeather } from '../data/spaceWeather.ts'
import type { SolRecord } from '../game/missionState'
import { rules, type Ending, type Resources } from '../game/rules.ts'
import { Icon } from './Icon'
import { Remo } from './StationStatus'

const endings: Record<Ending, { title: string; text: string; good: boolean }> = {
  ganaste: {
    title: '¡Misión cumplida!',
    text: 'Cuidaste a la tripulación y completaste la ciencia. Así se ve repartir bien la energía.',
    good: true,
  },
  'sin-tripulacion': {
    title: 'Hubo que evacuar el puesto',
    text: 'La tripulación ya no podía seguir. En el espacio, primero va la gente: sin tripulación no hay misión.',
    good: false,
  },
  'sin-ciencia': {
    title: 'Todos a salvo… pero sin la ciencia',
    text: `La tripulación volvió bien, pero faltaron experimentos. Protegerse de todo también cuesta: la misión existía para hacer ciencia.`,
    good: false,
  },
}

type MissionEndProps = {
  ending: Ending
  resources: Resources
  history: readonly SolRecord[]
  onRestart: () => void
}

/** Pantalla final: cómo terminó la misión y qué pasó de verdad esa semana. */
export function MissionEnd({ ending, resources, history, onRestart }: MissionEndProps) {
  const { title, text, good } = endings[ending]
  const storms = history.filter(({ report }) => report.storm).length

  return (
    <div className="carta carta-centrada final">
      <Remo crew={resources.crew} />
      <h2 className="dice" style={{ fontSize: '1.5rem', color: good ? 'var(--life)' : 'var(--alert)' }}>{title}</h2>
      <p className="lead">{text}</p>
      <div className="efectos">
        <span className={`chip ${resources.science >= rules.scienceGoal ? 'mas' : 'menos'}`}>Ciencia {resources.science}/{rules.scienceGoal}</span>
        <span className={`chip ${resources.crew > 0 ? 'mas' : 'menos'}`}>Tripulación {resources.crew}/{rules.crewMax}</span>
        <span className="chip mas">Soles {history.length}/{rules.sols}</span>
      </div>

      <ol className="bitacora" aria-label="Bitácora de la misión">
        {history.map(({ sol, plan, report }) => (
          <li key={sol} className={report.stormDamage > 0 ? 'mal' : ''}>
            <span className="bit-sol">Sol {sol}</span>
            <span className="bit-clase">{spaceWeather[sol - 1].flare ?? '—'}</span>
            <span className="bit-iconos">
              <Icon name="i-shield" className={plan.shield ? 'on-blindaje' : ''} />
              <Icon name="i-flask" className={plan.experiment ? 'on-ciencia' : ''} />
            </span>
            <span className="bit-nota">{report.storm ? (report.stormDamage > 0 ? `Tormenta: −${report.stormDamage} ${report.stormDamage === 1 ? 'corazón' : 'corazones'}` : 'Tormenta detenida') : 'Sin tormenta'}</span>
          </li>
        ))}
      </ol>

      <div className="real">
        <b>Lo que pasó de verdad</b>
        Las fulguraciones de este juego son reales: ocurrieron del 3 al 10 de octubre de 2026 y la más fuerte fue una M6.7.
        {' '}En esa semana de verdad, la NASA registró <strong>{sepEventsInWeek} tormentas de partículas</strong>
        {storms > 0 ? `; en tu partida llegaron ${storms}, porque el juego tira los dados` : ''}.
        {' '}Pero nadie podía saberlo antes: por eso, ante cada alerta, los astronautas tienen que decidir igual que tú.
      </div>
      <a className="clima-fuente" href={donkiUrl} target="_blank" rel="noreferrer">{donkiCredit} ↗</a>
      <button className="btn" type="button" onClick={onRestart}>Jugar otra vez</button>
    </div>
  )
}
