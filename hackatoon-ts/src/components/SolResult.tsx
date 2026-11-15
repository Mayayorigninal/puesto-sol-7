import { missions, type Mission } from '../data/missions'
import { BaseScene } from './BaseScene'
import { riskLabels, rules, type Resources, type SolReport } from '../game/rules.ts'

type SolResultProps = {
  sol: number
  mission: Mission
  value: number
  report: SolReport
  resources: Resources
  /** true si la misión termina con este sol. */
  last: boolean
  onNext: () => void
}

function stormText({ risk, shielded, storm, stormDamage }: SolReport) {
  if (risk.chance === 0) {
    return shielded
      ? 'El Sol estuvo tranquilo. El blindaje no hizo falta y gastó energía.'
      : 'El Sol estuvo tranquilo. No pasó nada.'
  }
  if (storm) {
    return shielded
      ? '¡Llegó una tormenta de partículas! El blindaje protegió a toda la tripulación.'
      : `¡Llegó una tormenta de partículas y no había blindaje! La tripulación pierde ${stormDamage} ${stormDamage === 1 ? 'corazón' : 'corazones'}.`
  }
  return shielded
    ? 'La tormenta de partículas no llegó. El blindaje no hizo falta esta vez… pero nadie podía saberlo.'
    : 'Te arriesgaste y la tormenta de partículas no llegó. Esta vez hubo suerte.'
}

/** Cierre del sol: cómo salió la tarea, si llegó la tormenta y cuánta energía se cargó. */
export function SolResult({ sol, mission, value, report, resources, last, onNext }: SolResultProps) {
  const info = missions[mission]
  const { success, taskEnergy, taskDamage, wearDamage, stormDamage, recharge, risk } = report
  const hearts = taskDamage + wearDamage + stormDamage
  const energy = taskEnergy + recharge

  return (
    <div className="carta carta-centrada">
      <div className="eyebrow">Sol {sol} de {rules.sols} · Resultado</div>
      <BaseScene
        resources={resources} risk={risk.level} shield={report.shielded}
        storm={!report.storm ? 'no' : stormDamage > 0 ? 'golpe' : 'detenida'}
      />
      <h2 className="dice" style={{ fontSize: '1.45rem', color: success ? 'var(--life)' : 'var(--alert)' }}>
        {success ? info.success : info.failure}
      </h2>
      <p className="lead">{success ? info.successText : info.failureText(value)}</p>
      <div className="real"><b>{mission === 'fugas' ? 'Bitácora de BIP' : 'Pasó de verdad'}</b>{info.fact}</div>

      <div className={`noche${stormDamage > 0 ? ' noche-mal' : ''}`}>
        <b>Clima espacial · {riskLabels[risk.level]} · en esta simulación</b>
        {stormText(report)}
      </div>
      {wearDamage > 0 && (
        <div className="noche noche-mal">
          <b>Soporte vital</b>
          Van {rules.wearLimit} soles o más sin mantenimiento y el aire se puso pesado: la tripulación pierde 1 corazón.
        </div>
      )}

      <div className="efectos">
        {energy > 0 && <span className="chip mas">Energía +{energy}</span>}
        {energy === 0 && <span className="chip menos">Energía +0 · paneles empolvados</span>}
        {hearts > 0 && <span className="chip menos">Tripulación −{hearts}</span>}
        {hearts === 0 && <span className="chip mas">Tripulación a salvo</span>}
      </div>
      {resources.crew > 0 && !last && recharge < rules.recharge && (
        <p className="lead">Los paneles tienen polvo: hoy cargaron {recharge} de {rules.recharge}.</p>
      )}
      <button className="btn" type="button" onClick={onNext}>{last ? 'Ver cómo terminó la misión' : `Ir al sol ${sol + 1}`}</button>
    </div>
  )
}
