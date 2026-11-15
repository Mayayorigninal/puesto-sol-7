import { useTranslation } from '../i18n/useTranslation'
import type { ReactNode } from 'react'

type HullProps = {
  critical?: boolean
  className?: string
  children: ReactNode
}

/** Pared interior de la nave (ventana, planeta y rótulo). Los minijuegos ponen sus piezas encima. */
export function Hull({ critical = false, className = '', children }: HullProps) {
  const { t } = useTranslation()
  return (
    <div className={['hull', critical ? 'hull-critical' : '', className].filter(Boolean).join(' ')} aria-label={t('CABIN.Interior')}>
      <div className="hull-window" aria-hidden="true"><div className="hull-planet" /></div>
      <div className="hull-label" aria-hidden="true">{t('CABIN.Sign')}</div>
      {children}
    </div>
  )
}
