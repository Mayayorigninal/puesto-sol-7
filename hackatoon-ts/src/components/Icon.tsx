import type { ComponentProps } from 'react'

export type IconName =
  | 'i-bolt' | 'i-ox' | 'i-crop' | 'i-trip' | 'i-medal' | 'i-lock' | 'i-persona' | 'i-base' | 'i-bip'
  | 'i-shield' | 'i-flask' | 'i-heart' | 'i-sun' | 'i-volume'
  | 'p-bolsa' | 'p-carton' | 'p-cinta' | 'p-manguera' | 'p-cuchara' | 'p-linterna'

export function Icon({ name, ...props }: ComponentProps<'svg'> & { name: IconName }) {
  return (
    <svg {...props} aria-hidden="true">
      <use href={`${import.meta.env.BASE_URL}icons.svg#${name}`} />
    </svg>
  )
}
