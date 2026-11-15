import { useTranslation, type Translate } from '../i18n/useTranslation'
import type { Mission } from '../data/missions'
import { routineOptions, taskKinds } from '../game/missionState'
import { rules, type Resources, type TaskKind } from '../game/rules.ts'
import { BaseScene } from './BaseScene'

type RoutineViewProps = {
  sol: number
  resources: Resources
  shield: boolean
  onChoose: (mission: Mission) => void
}

function days(count: number, t: Translate) {
  return t(count === 1 ? 'COMMON.OneSol' : 'COMMON.ManySols', { count })
}

/** Lo que se gana al hacer una tarea de este sistema. */
function gain(mission: Mission, t: Translate) {
  switch (taskKinds[mission]) {
    case 'energia': return t('ROUTINE.PanelGain')
    case 'comida': return t('ROUTINE.HarvestGain', { success: rules.harvest.success, failure: rules.harvest.failure })
    case 'comms': return t('ROUTINE.CommsGain')
    case 'soporte': return t(mission === 'ejercicio' ? 'ROUTINE.ExerciseGain' : 'ROUTINE.SupportGain')
  }
}

/** Lo que pasa con el otro sistema si hoy no se atiende. `warn` = habrá daño o se perderá algo. */
function neglect(kind: TaskKind, resources: Resources, t: Translate): { text: string; warn: boolean } {
  const { dust, wear, food, silence } = resources
  switch (kind) {
    case 'energia':
      return dust > 0
        ? { text: t('ROUTINE.DustCost', { days: days(dust, t) }), warn: dust >= 2 }
        : { text: t('ROUTINE.SkipPanels'), warn: false }
    case 'soporte':
      return (wear + 1) % rules.wearLimit === 0
        ? { text: t('ROUTINE.WearCost', { days: days(wear, t) }), warn: true }
        : { text: t('ROUTINE.SkipSupport'), warn: false }
    case 'comida': {
      const remaining = food - rules.foodPerSol
      return remaining < 0
        ? { text: t('ROUTINE.EmptyPantry'), warn: true }
        : { text: t(remaining === 1 ? 'ROUTINE.SkipHarvestOne' : 'ROUTINE.SkipHarvestMany', { count: remaining }), warn: remaining <= 1 }
    }
    case 'comms':
      return silence + 1 >= rules.commsLimit
        ? { text: t('ROUTINE.NoForecast'), warn: true }
        : { text: t('ROUTINE.SkipComms'), warn: false }
  }
}

/** Fase de Rutina: la tripulación solo alcanza para una tarea, y la otra se queda sin hacer. */
export function RoutineView({ sol, resources, shield, onChoose }: RoutineViewProps) {
  const { t } = useTranslation()
  const options = routineOptions(resources, sol)

  return (
    <div className="carta">
      <BaseScene resources={resources} shield={shield} />
      <div className="quien">{t('ROUTINE.Sol', { sol })}</div>
      <h2 className="dice">{t('ROUTINE.Title')}</h2>
      <div className="ops">
        {options.map((mission, index) => {
          const other = neglect(taskKinds[options[1 - index]], resources, t)
          return (
            <button key={mission} className="op" type="button" onClick={() => onChoose(mission)}>
              {t(`SHIP.${mission}.Option`)}
              <small><b className="op-et op-gana">{t('ROUTINE.Gain')}</b>{gain(mission, t)}</small>
              <small className={other.warn ? 'op-aviso' : ''}><b className="op-et op-pierde">{t('ROUTINE.Cost')}</b>{other.text}</small>
            </button>
          )
        })}
      </div>
    </div>
  )
}
