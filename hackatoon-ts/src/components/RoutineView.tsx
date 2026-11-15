import { useTranslation } from '../i18n/useTranslation'
import { type Mission } from '../data/missions'
import { routineOptions, taskKinds } from '../game/missionState'
import { rules, type Resources } from '../game/rules.ts'
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

  return (
    <div className="carta">
      <BaseScene resources={resources} shield={shield} />
      <div className="quien">{t('ROUTINE.Sol', { sol })}</div>
      <h2 className="dice">{t('ROUTINE.Title')}</h2>
      <div className="ops">
        {routineOptions(sol).map((mission) => {
          const { gain, cost, warn } = consequence(mission)
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
