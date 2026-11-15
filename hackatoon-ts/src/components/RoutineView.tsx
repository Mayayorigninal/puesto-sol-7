import { useTranslation } from '../i18n/useTranslation'
import { type Mission } from '../data/missions'
import { routineOptions, taskKinds } from '../game/missionState'
import { rules, type Resources, type TaskKind } from '../game/rules.ts'
import { BaseScene } from './BaseScene'

type RoutineViewProps = {
  sol: number
  resources: Resources
  shield: boolean
  onChoose: (mission: Mission) => void
}

/** Fase de Rutina: la tripulación solo alcanza para una tarea, y la otra se queda sin hacer. */
export function RoutineView({ sol, resources, shield, onChoose }: RoutineViewProps) {
  const { t } = useTranslation()
  const { dust, wear } = resources
  const wearNext = wear + 1 >= rules.wearLimit
  const days = (count: number) => t(count === 1 ? 'COMMON.OneSol' : 'COMMON.ManySols', { count })

  const consequence = (mission: Mission) => taskKinds[mission] === 'energia'
    ? {
        gain: t('ROUTINE.PanelGain'),
        cost: wearNext
          ? t('ROUTINE.WearCost', { days: days(wear) })
          : t('ROUTINE.SkipSupport'),
        warn: wearNext,
      }
    : {
        gain: t('ROUTINE.SupportGain'),
        cost: dust > 0
          ? t('ROUTINE.DustCost', { days: days(dust) })
          : t('ROUTINE.SkipPanels'),
        warn: dust >= rules.recharge - 1,
      }
function days(count: number) {
  return count === 1 ? '1 sol' : `${count} soles`
}

/** Lo que se gana al hacer una tarea de este sistema. */
function gain(mission: Mission, kind: TaskKind) {
  switch (kind) {
    case 'energia': return 'Paneles limpios: cargan más energía cada sol.'
    case 'comida': return `Llena la despensa: +${rules.harvest.success} raciones (si sale mal, +${rules.harvest.failure}).`
    case 'comms': return 'Recupera la señal: mañana sí llegará el pronóstico del clima espacial.'
    case 'soporte': return `${mission === 'ejercicio' ? 'Mantiene fuertes los huesos y músculos de la tripulación' : 'Cuida el aire de la tripulación'}. Si fallas, pierdes 1 corazón.`
  }
}

/** Lo que pasa con el otro sistema si hoy no se atiende. `warn` = habrá daño o se perderá algo. */
function neglect(kind: TaskKind, resources: Resources): { text: string; warn: boolean } {
  const { dust, wear, food, silence } = resources
  switch (kind) {
    case 'energia':
      return dust > 0
        ? { text: `Los paneles se quedan sin limpiar (ya llevan ${days(dust)} con polvo) y cargan cada vez menos.`, warn: dust >= 2 }
        : { text: 'Los paneles se quedan sin limpiar y se empiezan a empolvar.', warn: false }
    case 'soporte':
      return (wear + 1) % rules.wearLimit === 0
        ? { text: `El soporte vital lleva ${days(wear)} sin revisión: si tampoco lo revisas hoy, la tripulación pierde 1 corazón.`, warn: true }
        : { text: 'El soporte vital se queda sin revisar hoy.', warn: false }
    case 'comida':
      return food - rules.foodPerSol < 0
        ? { text: '¡La despensa está vacía! Si nadie cosecha, la tripulación pierde 1 corazón.', warn: true }
        : { text: `Nadie cosecha hoy. En la despensa quedarán ${food - rules.foodPerSol} raciones.`, warn: food - rules.foodPerSol <= 1 }
    case 'comms':
      return silence + 1 >= rules.commsLimit
        ? { text: 'La antena sigue sin señal: mañana no llegará el pronóstico del clima espacial.', warn: true }
        : { text: 'La antena se queda sin revisar hoy.', warn: false }
  }
}

/** Fase de Rutina: la tripulación solo alcanza para una tarea, y la otra se queda sin hacer. */
export function RoutineView({ sol, resources, shield, onChoose }: RoutineViewProps) {
  const options = routineOptions(resources, sol)

  return (
    <div className="carta">
      <BaseScene resources={resources} shield={shield} />
      <div className="quien">{t('ROUTINE.Sol', { sol })}</div>
      <h2 className="dice">{t('ROUTINE.Title')}</h2>
      <div className="ops">
        {options.map((mission, index) => {
          const other = neglect(taskKinds[options[1 - index]], resources)
          return (
            <button key={mission} className="op" type="button" onClick={() => onChoose(mission)}>
              {t(`SHIP.${mission}.Option`)}
              <small><b className="op-et op-gana">{t('ROUTINE.Gain')}</b>{gain}</small>
              <small className={warn ? 'op-aviso' : ''}><b className="op-et op-pierde">{t('ROUTINE.Cost')}</b>{cost}</small>
            </button>
          )
        })}
      </div>
    </div>
  )
}
