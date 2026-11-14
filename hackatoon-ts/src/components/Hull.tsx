import type { ReactNode } from 'react'

type HullProps = {
  critical?: boolean
  label?: string
  className?: string
  children: ReactNode
}

/** Pared interior de la nave (ventana, planeta y rótulo). Los minijuegos ponen sus piezas encima. */
export function Hull({ critical = false, label = 'SOL 7 · CABINA 01', className = '', children }: HullProps) {
  return (
    <div className={['hull', critical ? 'hull-critical' : '', className].filter(Boolean).join(' ')} aria-label="Interior de la nave">
      <div className="hull-window" aria-hidden="true"><div className="hull-planet" /></div>
      <div className="hull-label" aria-hidden="true">{label}</div>
      {children}
    </div>
  )
}
