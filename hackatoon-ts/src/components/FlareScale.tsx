import { useTranslation } from '../i18n/useTranslation'
const classes = ['B', 'C', 'M', 'X'] as const

/**
 * La escala de fulguraciones: cada letra es unas 10 veces más intensa que la anterior.
 * Marca la clase real del día.
 */
export function FlareScale({ flare }: { flare: string | null }) {
  const { t } = useTranslation()
  const today = flare?.[0]
  return (
    <div className="escala" role="img" aria-label={flare ? t('WEATHER.Scale', { flare }) : t('WEATHER.ScaleEmpty')}>
      {classes.map((letter, index) => (
        <div key={letter} className={`escala-col escala-${letter}${letter === today ? ' hoy' : ''}`}>
          {letter === today && <span className="escala-hoy">{flare}</span>}
          <i style={{ height: `${10 + index * 13}px` }} />
          <b>{letter}</b>
          {index > 0 && <span className="escala-x10" aria-hidden="true">×10</span>}
        </div>
      ))}
    </div>
  )
}
