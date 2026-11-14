import { calendar } from '../data/almanac'
import { Icon, type IconName } from './Icon'

const tabs = [
  { id: 'estado', label: 'Estado', icon: 'i-persona' },
  { id: 'hitos', label: 'Hitos', icon: 'i-medal' },
  { id: 'mision', label: 'Misión', icon: 'i-base' },
] as const satisfies ReadonlyArray<{ id: string; label: string; icon: IconName }>

export type Tab = (typeof tabs)[number]['id']

export function Hud({ energy, completed }: { energy: number; completed: boolean }) {
  const { sol, fecha } = calendar[0]
  const progress = completed ? sol / calendar.length * 100 : 0

  return (
    <header className="top">
      <div className="barra">
        <div className="et">SOL <b>{sol}</b> DE {calendar.length} · {fecha} · Sol tranquilo</div>
        <div className="pista" role="progressbar" aria-label="Progreso de la misión" aria-valuenow={progress}>
          <i style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="energia" aria-label={`Energía: ${energy}`}>
        <Icon name="i-bolt" className="bolt" />
        <span className="n">{energy}</span>
      </div>
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
