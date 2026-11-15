import { useTranslation } from '../i18n/useTranslation'
import { spaceWeather } from '../data/spaceWeather.ts'
import { rules, type Resources } from '../game/rules.ts'
import { Icon, type IconName } from './Icon'
import { ResourceBar } from './ResourceBar'
import { VolumeControl } from './VolumeControl'

const tabs = [
  { id: 'mision', label: 'NAV.Mission', icon: 'i-base' },
  { id: 'hitos', label: 'NAV.Milestones', icon: 'i-medal' },
] as const satisfies ReadonlyArray<{ id: string; label: string; icon: IconName }>

export type Tab = (typeof tabs)[number]['id']

type HudProps = {
  sol: number
  /** Soles ya terminados (para la barra de progreso). */
  completed: number
  resources: Resources
}

export function Hud({ sol, completed, resources }: HudProps) {
  const { t, rich, formatDate } = useTranslation()
  const { date } = spaceWeather[sol - 1]
  const progress = completed / rules.sols * 100

  return (
    <header className="top">
      <div className="barra">
        <div className="et">{rich('HUD.Sol', { sol: <b>{sol}</b>, total: rules.sols })}<span className="et-fecha"> · {formatDate(date)}</span></div>
        <div className="pista" role="progressbar" aria-label={t('HUD.Progress')} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
          <i style={{ width: `${progress}%` }} />
        </div>
      </div>
      <ResourceBar resources={resources} />
      <VolumeControl />
    </header>
  )
}

export function Navigation({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  const { t } = useTranslation()
  return (
    <nav role="tablist" aria-label={t('APP.Title')}>
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
          <Icon name={icon} />{t(label)}
        </button>
      ))}
    </nav>
  )
}
