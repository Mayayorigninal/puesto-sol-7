import { useState } from 'react'
import { spaceWeather } from '../data/spaceWeather.ts'
import { applyPlan, canAfford, planCost, rules, stormRisk, type Plan, type Resources } from '../game/rules.ts'
import { BaseScene } from './BaseScene'
import { Icon, type IconName } from './Icon'
import { WeatherReport } from './WeatherReport'

type PrepViewProps = {
  sol: number
  resources: Resources
  onConfirm: (plan: Plan) => void
}

type ChoiceProps = {
  icon: IconName
  title: string
  detail: string
  cost: number
  active: boolean
  disabled: boolean
  className: string
  onToggle: () => void
}

function Choice({ icon, title, detail, cost, active, disabled, className, onToggle }: ChoiceProps) {
  return (
    <button type="button" className={`prep-op ${className}`} aria-pressed={active} disabled={disabled} onClick={onToggle}>
      <Icon name={icon} />
      <span className="prep-txt">{title}<small>{disabled ? 'No te alcanza la energía.' : detail}</small></span>
      <span className="prep-costo"><Icon name="i-bolt" />{cost}</span>
    </button>
  )
}

/** Fase de Preparación: ves el clima espacial del día y decides en qué gastar la energía. */
export function PrepView({ sol, resources, onConfirm }: PrepViewProps) {
  const [plan, setPlan] = useState<Plan>({ shield: false, experiment: false })
  const weather = spaceWeather[sol - 1]
  const risk = stormRisk(weather.flare)
  const left = resources.energy - planCost(plan)

  function toggle(key: keyof Plan) {
    const next = { ...plan, [key]: !plan[key] }
    if (canAfford(resources, next)) setPlan(next)
  }
  const blocked = (key: keyof Plan) => !plan[key] && !canAfford(resources, { ...plan, [key]: true })

  return (
    <div className="carta prep">
      <div>
        <div className="eyebrow">Sol {sol} de {rules.sols} · Preparación</div>
        <h2 style={{ marginTop: 4 }}>¿En qué gastamos la energía hoy?</h2>
      </div>
      <BaseScene resources={applyPlan(resources, plan)} risk={risk.level} shield={plan.shield} experimenting={plan.experiment} />
      <WeatherReport weather={weather} />
      <div className="prep-ops">
        <Choice
          icon="i-shield" className="prep-blindaje" title="Activar el blindaje" cost={rules.shieldCost}
          detail={risk.chance > 0 ? 'La tripulación baja al refugio. Si llega una tormenta, está a salvo.' : 'Hoy no hay alerta: sería gastar energía de más.'}
          active={plan.shield} disabled={blocked('shield')} onToggle={() => toggle('shield')}
        />
        <Choice
          icon="i-flask" className="prep-ciencia" title="Hacer un experimento" cost={rules.experimentCost}
          detail={`Avanza la misión. Llevas ${resources.science} de ${rules.scienceGoal}.`}
          active={plan.experiment} disabled={blocked('experiment')} onToggle={() => toggle('experiment')}
        />
      </div>
      <p className="prep-saldo" aria-live="polite">
        Te {left === 1 ? 'queda' : 'quedan'} <b><Icon name="i-bolt" />{left}</b> de energía.
        {!plan.shield && !plan.experiment && ' Si no gastas nada, la guardas para mañana.'}
      </p>
      <button className="btn" type="button" onClick={() => onConfirm(plan)}>Empezar el día</button>
    </div>
  )
}
