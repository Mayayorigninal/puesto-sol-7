import { spaceWeather } from '../data/spaceWeather.ts'
import { rules, type Resources } from '../game/rules.ts'
import { Icon, type IconName } from './Icon'
import { ResourceBar } from './ResourceBar'

const tabs = [
  { id: 'mision', label: 'Misión', icon: 'i-base' },
  { id: 'hitos', label: 'Hitos', icon: 'i-medal' },
] as const satisfies ReadonlyArray<{ id: string; label: string; icon: IconName }>

export type Tab = (typeof tabs)[number]['id']

type HudProps = {
  sol: number
  /** Soles ya terminados (para la barra de progreso). */
  completed: number
  resources: Resources
}

export function Hud({ sol, completed, resources }: HudProps) {
  const { fecha } = spaceWeather[sol - 1]
  const progress = completed / rules.sols * 100

  return (
    <header className="top">
      <div className="barra">
        <div className="et">SOL <b>{sol}</b> DE {rules.sols}<span className="et-fecha"> · {fecha}</span></div>
        <div className="pista" role="progressbar" aria-label="Progreso de la misión" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
          <i style={{ width: `${progress}%` }} />
        </div>
      </div>
      <ResourceBar resources={resources} />
    </header>
  )
}

export function Navigation({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  return (
    <nav role="tablist" aria-label="Puesto Sol 7">
      {tabs.map(({ id, label, icon }, index) => (
        <button
          key={id} id={`tab-${id}`} type="button" role="tab" aria-selected={active === id}
          aria-controls={`view-${id}`} tabIndex={active === id ? 0 : -1}
          onClick={() => onChange(id)}
          onKeyDown={(event) => {
            const offset = { ArrowLeft: -1, ArrowRight: 1 }[event.key]
            if (!offset) return
            event.preventDefault()
            const next = tabs[(index + offset + tabs.length) % tabs.length].id
            onChange(next)
            document.getElementById(`tab-${next}`)?.focus()
          }}
        >
          <Icon name={icon} />{label}
        </button>
      ))}
    </nav>
  )
}
