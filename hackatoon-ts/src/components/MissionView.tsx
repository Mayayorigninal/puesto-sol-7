import type { Dispatch } from 'react'
import { missions } from '../data/missions'
import { DustGame } from '../game/dust/DustGame'
import { FilterGame } from '../game/filter/FilterGame'
import { LeakGame } from '../game/leaks/LeakGame'
import type { GameAction, GameState } from '../game/missionState'
import { PatchGame } from '../game/patches/PatchGame'
import { RunGame } from '../game/run/RunGame'
import { HarvestGame } from '../game/harvest/HarvestGame'
import { AntennaGame } from '../game/antenna/AntennaGame'
import { ExperimentAnim } from './ExperimentAnim'
import { Intro } from './Intro'
import { MissionEnd } from './MissionEnd'
import { PrepView } from './PrepView'
import { RoutineView } from './RoutineView'
import { SolResult } from './SolResult'

type MissionViewProps = {
  game: GameState
  dispatch: Dispatch<GameAction>
}

/** Muestra la pantalla que corresponde a la fase actual de la misión. */
export function MissionView({ game, dispatch }: MissionViewProps) {
  const { phase, sol, resources } = game

  switch (phase.type) {
    case 'intro':
      return <Intro onBegin={() => dispatch({ type: 'begin' })} />

    case 'prep':
      // La key hace que cada sol empiece con las opciones sin marcar.
      return <PrepView key={sol} sol={sol} resources={resources} onConfirm={(plan) => dispatch({ type: 'confirmPlan', plan })} />

    case 'experiment':
      return <ExperimentAnim science={resources.science} onDone={() => dispatch({ type: 'experimentDone' })} />

    case 'routine':
      return <RoutineView sol={sol} resources={resources} shield={game.plan.shield} onChoose={(mission) => dispatch({ type: 'choose', mission })} />

    case 'instructions': {
      const mission = missions[phase.mission]
      return (
        <div className="carta carta-centrada">
          <h2 className="dice" style={{ fontSize: '1.5rem' }}>{mission.title}</h2>
          <p className="lead">{mission.instructions}</p>
          <button className="btn" type="button" onClick={() => dispatch({ type: 'start' })}>¡Ya!</button>
          <button className="btn sec" type="button" onClick={() => dispatch({ type: 'back' })}>Elegir la otra tarea</button>
        </div>
      )
    }

    case 'playing': {
      // El dado de la tormenta se tira aquí y viaja en la acción,
      // para que el reducer siga siendo una función pura.
      const onFinish = (success: boolean, value: number) =>
        dispatch({ type: 'finish', success, value, roll: Math.random() })
      if (phase.mission === 'fugas') return <LeakGame onFinish={onFinish} />
      if (phase.mission === 'parches') return <PatchGame onFinish={onFinish} />
      if (phase.mission === 'ejercicio') return <RunGame onFinish={onFinish} />
      if (phase.mission === 'cosecha') return <HarvestGame onFinish={onFinish} />
      if (phase.mission === 'antena') return <AntennaGame onFinish={onFinish} />
      return phase.mission === 'polvo'
        ? <DustGame onFinish={onFinish} onSand={() => dispatch({ type: 'discover', milestone: 'arena' })} />
        : <FilterGame onFinish={onFinish} />
    }

    case 'solResult':
      return (
        <SolResult
          sol={sol} mission={phase.mission} value={phase.value} report={phase.report}
          resources={resources} last={phase.ending !== null} onNext={() => dispatch({ type: 'nextSol' })}
        />
      )

    case 'end':
      return <MissionEnd ending={phase.ending} resources={resources} history={game.history} onRestart={() => dispatch({ type: 'restart' })} />
  }
}
