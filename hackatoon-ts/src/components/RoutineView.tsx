import { missions, type Mission } from '../data/missions'
import { routineOptions, taskKinds } from '../game/missionState'
import { rules, type Resources } from '../game/rules.ts'
import { Icon } from './Icon'

type RoutineViewProps = {
  sol: number
  resources: Resources
  onChoose: (mission: Mission) => void
}

function days(count: number) {
  return count === 1 ? '1 sol' : `${count} soles`
}

/** Fase de Rutina: la tripulación solo alcanza para una tarea, y la otra se queda sin hacer. */
export function RoutineView({ sol, resources, onChoose }: RoutineViewProps) {
  const { dust, wear } = resources
  const wearNext = wear + 1 >= rules.wearLimit

  const consequence = (mission: Mission) => taskKinds[mission] === 'energia'
    ? {
        gain: 'Da energía y los paneles vuelven a cargar bien.',
        cost: wearNext
          ? `Ojo: el soporte vital lleva ${days(wear)} sin revisión. Si hoy tampoco, la tripulación pierde 1 ❤.`
          : 'El soporte vital se queda sin revisar hoy.',
        warn: wearNext,
      }
    : {
        gain: 'Cuida el aire de la tripulación. Si fallas, pierdes 1 ❤.',
        cost: dust > 0
          ? `Los paneles llevan ${days(dust)} empolvándose: cada vez cargan menos energía.`
          : 'Los paneles se empolvan y mañana cargan menos energía.',
        warn: dust >= rules.recharge - 1,
      }

  return (
    <div className="carta">
      <Icon name="i-bip" className="grande" />
      <div className="quien">Sol {sol} · Rutina · BIP</div>
      <h2 className="dice">Capitán, hay dos pendientes y la tripulación solo alcanza para uno. El reglamento dice que elige usted.</h2>
      <div className="ops">
        {routineOptions(sol).map((mission) => {
          const { gain, cost, warn } = consequence(mission)
          return (
            <button key={mission} className="op" type="button" onClick={() => onChoose(mission)}>
              {missions[mission].option}
              <small>{gain}</small>
              <small className={warn ? 'op-aviso' : ''}>{cost}</small>
            </button>
          )
        })}
      </div>
    </div>
  )
}
