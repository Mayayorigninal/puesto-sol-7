import { LeakGame } from '../game/leaks/LeakGame'
import type { Dispatch } from 'react'
import { DustGame } from '../game/dust/DustGame'
import { FilterGame } from '../game/filter/FilterGame'
import { systemLabels, type missionReducer } from '../game/missionState'
import { missionOptions, missions } from '../data/missions'
import { Icon } from './Icon'

type MissionViewProps = {
  phase: ReturnType<typeof missionReducer>['phase']
  dispatch: Dispatch<Parameters<typeof missionReducer>[1]>
}

export function MissionView({ phase, dispatch }: MissionViewProps) {
  if (phase.type === 'decision') {
    return (
      <div className="carta">
        <Icon name="i-bip" className="grande" />
        <div className="quien">BIP · protocolo de mantenimiento</div>
        <h2 className="dice">Capitán, hay varios pendientes y la tripulación solo alcanza para uno hoy. El reglamento dice que elige usted.</h2>
        <div className="ops">
          {missionOptions.map((mission) => (
            <button key={mission} className="op" type="button" onClick={() => dispatch({ type: 'choose', mission })}>
              {missions[mission].option}<small>{missions[mission].detail}</small>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const mission = missions[phase.mission]
  if (phase.type === 'instructions') {
    return (
      <div className="carta carta-centrada">
        <h2 className="dice" style={{ fontSize: '1.5rem' }}>{mission.title}</h2>
        <p className="lead">{mission.instructions}</p>
        <button className="btn" type="button" onClick={() => dispatch({ type: 'start' })}>¡Ya!</button>
      </div>
    )
  }

  if (phase.type === 'playing') {
    const onFinish = (success: boolean, value: number) => dispatch({ type: 'finish', success, value })
    if (phase.mission === 'fugas') return <LeakGame onFinish={onFinish} />
    return phase.mission === 'polvo'
      ? <DustGame onFinish={onFinish} onSand={() => dispatch({ type: 'discover', milestone: 'arena' })} />
      : <FilterGame onFinish={onFinish} />
  }

  const { success, value, effects } = phase
  const other = missionOptions[(missionOptions.indexOf(phase.mission) + 1) % missionOptions.length]
  return (
    <div className="carta carta-centrada">
      <h2 className="dice" style={{ fontSize: '1.45rem', color: success ? 'var(--life)' : 'var(--alert)' }}>
        {success ? mission.success : mission.failure}
      </h2>
      <p className="lead">{success ? mission.successText : mission.failureText(value)}</p>
      <div className="efectos">
        {effects.map(({ system, amount }) => (
          <span key={system} className={`chip ${amount > 0 ? 'mas' : 'menos'}`}>
            {systemLabels[system]} {amount > 0 ? '+' : ''}{amount}
          </span>
        ))}
      </div>
      <div className="real"><b>{phase.mission === 'fugas' ? 'Bitácora de BIP' : 'Pasó de verdad'}</b>{mission.fact}</div>
      <button className="btn" type="button" onClick={() => dispatch({ type: 'retry', mission: other })}>Probar otra decisión</button>
      <button className="btn sec" type="button" onClick={() => dispatch({ type: 'retry', mission: phase.mission })}>Repetir este minijuego</button>
    </div>
  )
}
