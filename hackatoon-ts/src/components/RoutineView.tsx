import { missions, type Mission } from '../data/missions'
import { routineOptions, taskKinds } from '../game/missionState'
import { rules, type Resources } from '../game/rules.ts'
import { BaseScene } from './BaseScene'

type RoutineViewProps = {
  sol: number
  resources: Resources
  shield: boolean
  onChoose: (mission: Mission) => void
}

function days(count: number) {
  return count === 1 ? '1 sol' : `${count} soles`
}

/** Fase de Rutina: la tripulación solo alcanza para una tarea, y la otra se queda sin hacer. */
export function RoutineView({ sol, resources, shield, onChoose }: RoutineViewProps) {
  const { dust, wear } = resources
  const wearNext = wear + 1 >= rules.wearLimit

  const consequence = (mission: Mission) => taskKinds[mission] === 'energia'
    ? {
        gain: 'Da energía y los paneles vuelven a cargar bien.',
        cost: wearNext
          ? `El soporte vital lleva ${days(wear)} sin revisión: si tampoco lo revisas hoy, la tripulación pierde 1 corazón.`
          : 'El soporte vital se queda sin revisar hoy.',
        warn: wearNext,
      }
    : {
        gain: `${{ ejercicio: 'Mantiene fuertes los huesos y músculos de la tripulación', cosecha: 'Da comida fresca a la tripulación', antena: 'Recupera la comunicación con la Tierra' }[mission as 'ejercicio' | 'cosecha' | 'antena'] ?? 'Cuida el aire de la tripulación'}. Si fallas, pierdes 1 corazón.`,
        cost: dust > 0
          ? `Los paneles se quedan sin limpiar (ya llevan ${days(dust)} con polvo) y cargan cada vez menos energía.`
          : 'Los paneles se quedan sin limpiar y mañana cargan menos energía.',
        warn: dust >= rules.recharge - 1,
      }

  return (
    <div className="carta">
      <BaseScene resources={resources} shield={shield} />
      <div className="quien">Sol {sol} · Rutina · BIP</div>
      <h2 className="dice">Capitán, hay dos pendientes y la tripulación solo alcanza para uno. El reglamento dice que elige usted.</h2>
      <div className="ops">
        {routineOptions(sol).map((mission) => {
          const { gain, cost, warn } = consequence(mission)
          return (
            <button key={mission} className="op" type="button" onClick={() => onChoose(mission)}>
              {missions[mission].option}
              <small><b className="op-et op-gana">Ganas</b>{gain}</small>
              <small className={warn ? 'op-aviso' : ''}><b className="op-et op-pierde">Pero</b>{cost}</small>
            </button>
          )
        })}
      </div>
    </div>
  )
}
