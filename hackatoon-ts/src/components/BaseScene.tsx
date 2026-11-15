import { rules, type Resources, type RiskLevel } from '../game/rules.ts'

export type StormView = 'no' | 'detenida' | 'golpe'

type BaseSceneProps = {
  resources: Resources
  /** Riesgo del día: decide qué tan grande se ve la llamarada del Sol. */
  risk?: RiskLevel
  /** Blindaje activo: la tripulación baja al refugio. */
  shield?: boolean
  /** Hay un experimento en marcha en el laboratorio. */
  experimenting?: boolean
  storm?: StormView
}

const flareSize: Record<RiskLevel, number> = { ninguno: 0, bajo: 0.35, medio: 0.65, alto: 1, extremo: 1.3 }
const suitColors = ['#F2B134', '#5B9BF5', '#3FC9A0', '#EF6B4A', '#C58BF2']

// Dónde está cada astronauta en un día normal, y dónde se junta la tripulación en el refugio.
const posts = [[236, 163], [300, 163], [136, 163], [128, 241], [226, 241]] as const
const shelter = [[212, 241], [240, 241], [268, 241], [296, 241], [324, 241]] as const

function Astronaut({ index, x, y, hurt }: { index: number; x: number; y: number; hurt: boolean }) {
  // Dibujo de Joseph (public/assets/astronauta.png). Mide 19 × 34 unidades y se apoya en el piso del cuarto.
  return (
    <g className={`astro${hurt ? ' astro-mal' : ''}`} style={{ transform: `translate(${x}px, ${y}px)` }}>
      <g className="astro-flota" style={{ animationDelay: `${index * -0.7}s` }}>
        <image href={`${import.meta.env.BASE_URL}assets/astronauta.png`} x="-9.500" y="-24" width="19" height="34" />
        <rect x="-3.300" y="0.300" width="4.500" height="3.200" rx=".8" fill={suitColors[index]} />
      </g>
    </g>
  )
}

/** Un aparato científico en la superficie por cada experimento completado. */
function Instrument({ index, ghost }: { index: number; ghost: boolean }) {
  const x = 222 + index * 16
  const shapes = [
    <g key="a"><path d="M0 0v-14" /><path d="M-6 -14a6 6 0 0 0 12 0z" fill="currentColor" /></g>,
    <g key="b"><path d="M0 0v-9" /><rect x="-5" y="-17" width="10" height="8" rx="2" fill="currentColor" /></g>,
    <g key="c"><path d="M-4 0l4 -12l4 12M0 -12v-6" /><circle cy="-19" r="2" fill="currentColor" /></g>,
    <g key="d"><path d="M0 0v-8" /><path d="M-6 -8l12 -7v7z" fill="currentColor" /></g>,
  ]
  return (
    <g transform={`translate(${x} 93)`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* La animación va en un grupo interior para no pisar la posición del exterior. */}
      <g className={ghost ? 'instr-nuevo' : undefined}>{shapes[index % shapes.length]}</g>
    </g>
  )
}

/**
 * La base vista en corte: paneles e instrumentos en la superficie y los cuartos
 * enterrados bajo el suelo lunar (regolito), que frena la radiación.
 * Cada recurso del juego se ve aquí en vez de leerse como un número.
 */
export function BaseScene({ resources, risk = 'ninguno', shield = false, experimenting = false, storm = 'no' }: BaseSceneProps) {
  const { energy, crew, science, dust, wear } = resources
  const flare = flareSize[risk]
  const cells = 6
  const dustLevel = Math.min(dust, rules.recharge)
  const wearColor = wear >= rules.wearLimit ? '#EF6B4A' : wear === 1 ? '#F2B134' : '#3FC9A0'
  const done = experimenting ? science - 1 : science

  const label = [
    `Base lunar. Energía: ${energy}.`,
    `Tripulación: ${crew} de ${rules.crewMax}${shield ? ', en el refugio' : ''}.`,
    `Experimentos: ${science} de ${rules.scienceGoal}.`,
    dust > 0 ? 'Los paneles tienen polvo.' : 'Paneles limpios.',
    storm === 'golpe' ? 'Una tormenta de partículas alcanzó a la tripulación.' : storm === 'detenida' ? 'El refugio detuvo la tormenta de partículas.' : '',
  ].join(' ')

  return (
    <svg className={`base base-${storm}${shield ? ' base-blindada' : ''}`} viewBox="0 0 360 270" role="img" aria-label={label}>
      {/* cielo */}
      <rect width="360" height="100" rx="14" fill="#070B16" />
      {[[150, 18], [205, 40], [262, 14], [300, 58], [118, 52], [340, 34], [232, 66]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 2 ? 1 : 1.500} fill="#E8EDF7" opacity=".7" />
      ))}
      <circle cx="318" cy="30" r="11" fill="#5B9BF5" /><path d="M311 26q5 -4 9 0t7 2" stroke="#BFE3C8" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* el Sol y su llamarada */}
      <g transform="translate(46 44)">
        {flare > 0 && (
          <g className="sol-llamarada" style={{ transform: `scale(${1 + flare * 0.9})` }}>
            <path d="M0 -30L8 -12L28 -16L16 0L28 16L8 12L0 30L-8 12L-28 16L-16 0L-28 -16L-8 -12Z" fill={risk === 'alto' || risk === 'extremo' ? '#EF6B4A' : '#F2B134'} opacity=".55" />
          </g>
        )}
        <circle r="19" fill="#F2B134" /><circle r="13" fill="#FFD76A" />
        <g fill="#7A4A00"><circle cx="-5" cy="-2" r="1.800" /><circle cx="5" cy="-2" r="1.800" /></g>
        <path d={flare >= 1 ? 'M-5 6q5 -4 10 0' : 'M-5 4q5 4 10 0'} stroke="#7A4A00" strokeWidth="1.800" fill="none" strokeLinecap="round" />
      </g>

      {/* suelo lunar */}
      <path d="M0 96q40 -7 90 -2t100 -1t90 1t80 -2V270H0Z" fill="#59627A" />
      <path d="M0 96q40 -7 90 -2t100 -1t90 1t80 -2v9q-40 4 -80 2t-90 0t-100 1t-90 2Z" fill="#9AA3B8" />
      <g fill="#474F66"><ellipse cx="30" cy="268" rx="26" ry="5" /><ellipse cx="180" cy="187" rx="5" ry="2" /><ellipse cx="350" cy="186" rx="8" ry="3" /><ellipse cx="8" cy="150" rx="6" ry="9" /></g>

      {/* paneles solares */}
      {[26, 62, 98].map((x) => (
        <g key={x} transform={`translate(${x} 92)`}>
          <path d="M0 0v-12" stroke="#C9D1E0" strokeWidth="3" strokeLinecap="round" />
          <g transform="rotate(-18 0 -14)">
            <rect x="-15" y="-21" width="30" height="13" rx="3" fill={dustLevel === 0 ? '#5B9BF5' : dustLevel === 1 ? '#6F86A8' : '#8B7E6A'} stroke="#DCE4F2" strokeWidth="1.500" />
            <path d="M-5 -21v13M5 -21v13" stroke="#DCE4F2" strokeWidth="1" opacity=".7" />
            {dustLevel > 0 && <g fill="#C4A478">{[[-10, -17], [-1, -12], [8, -18], [10, -11], [-6, -11]].slice(0, dustLevel === 1 ? 3 : 5).map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r="2.200" />)}</g>}
            {dustLevel === 0 && <path className="panel-brillo" d="M-11 -18l5 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" />}
          </g>
        </g>
      ))}

      {/* entrada y aparatos científicos */}
      <path d="M160 96a20 18 0 0 1 40 0Z" fill="#D8DEE9" /><rect x="172" y="82" width="16" height="14" rx="4" fill="#27314A" />
      <rect x="176" y="96" width="8" height="18" fill="#D8DEE9" />
      <g color="#5B9BF5">
        {Array.from({ length: Math.min(science, rules.sols) }, (_, i) => <Instrument key={i} index={i} ghost={experimenting && i === done} />)}
      </g>

      {/* cuartos bajo el regolito */}
      <g className="cuartos" fontFamily="var(--data)" fontSize="7" letterSpacing=".6" fill="#8A95AD">
        <rect className="cuarto" x="16" y="114" width="160" height="70" rx="12" />
        <rect className="cuarto" x="184" y="114" width="160" height="70" rx="12" />
        <rect className="cuarto" x="16" y="192" width="160" height="70" rx="12" />
        <rect className="cuarto cuarto-refugio" x="184" y="192" width="160" height="70" rx="12" />
        <text x="26" y="127">BATERÍAS</text><text x="194" y="127">LABORATORIO</text>
        <text x="26" y="205">SOPORTE VITAL</text><text x="194" y="205" className="txt-refugio">REFUGIO</text>
      </g>

      {/* baterías: una por punto de energía (dibujo de Joseph: public/assets/bateria.png) */}
      {Array.from({ length: cells }, (_, i) => (
        <image
          key={i} href={`${import.meta.env.BASE_URL}assets/bateria.png`}
          x={24 + i * 15} y="133" width="14" height="22"
          className={i < energy ? 'celda-llena' : 'celda-vacia'}
        />
      ))}
      {energy > cells && <text x="28" y="176" fontFamily="var(--display)" fontSize="10" fontWeight="700" fill="#F2B134">+{energy - cells}</text>}

      {/* laboratorio */}
      <g transform="translate(266 150)">
        <rect x="-16" y="16" width="32" height="4" rx="2" fill="#2A3348" />
        <path d="M-4 -12h8M-3 -12v9l-8 15q-2 4 3 4h16q5 0 3 -4l-8 -15v-9" fill="none" stroke="#E8EDF7" strokeWidth="2.200" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-7 6h14l4 8q1 2 -2 2h-18q-3 0 -2 -2Z" fill="#5B9BF5" opacity={science > 0 ? 1 : 0.25} />
        {experimenting && <g fill="#CFE3FF"><circle className="burbuja b1" cx="-3" cy="8" r="2" /><circle className="burbuja b2" cx="3" cy="10" r="1.600" /></g>}
      </g>
      <text x="334" y="176" textAnchor="end" fontFamily="var(--display)" fontSize="11" fontWeight="700" fill="#5B9BF5">{science}/{rules.scienceGoal}</text>

      {/* soporte vital: la luz avisa cuánto lleva sin mantenimiento */}
      <g transform="translate(54 236)">
        <rect x="-12" y="-18" width="24" height="36" rx="10" fill="#D8DEE9" /><rect x="-5" y="-23" width="10" height="6" rx="2" fill="#9AA3B8" />
        <text y="4" textAnchor="middle" fontFamily="var(--display)" fontSize="10" fontWeight="700" fill="#27314A">O₂</text>
        <circle className={wear >= rules.wearLimit ? 'luz-alerta' : ''} cx="24" cy="-12" r="5" fill={wearColor} />
      </g>

      {/* refugio */}
      <g className="escudo" transform="translate(326 211)">
        <path d="M0 -8l8 3v5q0 7 -8 10q-8 -3 -8 -10v-5Z" />
      </g>

      {/* tripulación */}
      {Array.from({ length: rules.crewMax }, (_, i) => {
        const [x, y] = (shield ? shelter : posts)[i]
        return <Astronaut key={i} index={i} x={x} y={y} hurt={i >= crew} />
      })}

      {/* tormenta de partículas */}
      {storm !== 'no' && (
        <g className="particulas" stroke="#FF8A6B" strokeWidth="2.200" strokeLinecap="round">
          {Array.from({ length: 16 }, (_, i) => (
            <path key={i} d="M0 0l-5 12" style={{ transform: `translate(${28 + i * 21}px, -14px)`, animationDelay: `${(i * 0.37) % 1.100}s` }} />
          ))}
        </g>
      )}
    </svg>
  )
}
