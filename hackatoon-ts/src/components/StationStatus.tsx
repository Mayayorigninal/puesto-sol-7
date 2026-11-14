import { systemLabels, type Systems } from '../game/missionState'
import { Icon, type IconName } from './Icon'

const systems = [
  { id: 'oxigeno', color: 'ox', icon: 'i-ox' },
  { id: 'comida', color: 'co', icon: 'i-crop' },
  { id: 'tripulacion', color: 'tr', icon: 'i-trip' },
] as const satisfies ReadonlyArray<{ id: keyof Systems; color: string; icon: IconName }>

function Remo({ health }: { health: number }) {
  const mood = health > 65 ? 'bien' : health > 35 ? 'regular' : 'mal'
  const color = { bien: '#3FC9A0', regular: '#F2B134', mal: '#EF6B4A' }[mood]
  const mouth = { bien: 'M62 97q12 10 24 0', regular: 'M63 100h22', mal: 'M63 103q11 -9 22 0' }[mood]

  return (
    <svg className="remo" viewBox="0 0 148 166" role="img" aria-label="Remo, encargado del puesto">
      <ellipse cx="74" cy="156" rx="38" ry="7" fill="#000" opacity=".3" />
      <rect x="42" y="110" width="64" height="44" rx="17" fill="#D8DEE9" />
      <rect x="55" y="121" width="38" height="20" rx="6" fill={color} opacity=".85" />
      <circle cx="74" cy="81" r="43" fill="#EFF3F8" />
      <circle cx="74" cy="81" r="35" fill="#2A3348" />
      <circle cx="74" cy="85" r="29" fill="#F4D9B8" />
      {mood === 'mal'
        ? <path d="M57 78l9 8M66 78l-9 8M82 78l9 8M91 78l-9 8" stroke="#1A2233" strokeWidth="3.2" strokeLinecap="round" />
        : <g fill="#1A2233"><circle cx="62" cy="82" r="4.6" /><circle cx="86" cy="82" r="4.6" /></g>}
      <path d={mouth} stroke="#1A2233" strokeWidth="3.2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function StationStatus({ values }: { values: Systems }) {
  const { oxigeno, comida, tripulacion } = values
  const health = Math.min(oxigeno, comida, tripulacion)
  const status = health > 65 ? 'Remo está bien.' : health > 35 ? 'Remo aguanta, pero se nota.' : 'Remo está en problemas.'

  return (
    <div className="avatar-wrap">
      <Remo health={health} />
      <div>
        <div className="estado">{status}</div>
        <div className="estado-sub">Sol 1. Oxígeno {oxigeno}, comida {comida}, tripulación {tripulacion}.</div>
      </div>
      <div className="sistemas">
        {systems.map(({ id, color, icon }) => (
          <div key={id} className={`sis ${color}${values[id] <= 25 ? ' bajo' : ''}`}>
            <Icon name={icon} />
            <div className="track" role="meter" aria-label={systemLabels[id]} aria-valuemin={0} aria-valuemax={100} aria-valuenow={values[id]}>
              <div className="fill" style={{ width: `${values[id]}%` }} />
            </div>
            <div className="nom">{systemLabels[id]}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
