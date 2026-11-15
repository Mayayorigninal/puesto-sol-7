import { useTranslation } from '../../i18n/useTranslation'
import type { CSSProperties } from 'react'
import { usePatchStore } from '../../store/usePatchStore'
import { PatchShape } from './PatchShape'

/** Un agujero del casco con su parche encima. Tocarlo gira el parche 90°. */
export function PatchHole({ id }: { id: number }) {
  const { t } = useTranslation()
  // Selector: este componente solo se vuelve a dibujar cuando cambia su propio parche.
  const patch = usePatchStore((state) => state.patches[id])
  const rotate = usePatchStore((state) => state.rotate)

  if (!patch.opened) return null

  const { x, y, shape, target, turns, sealed } = patch
  const state = sealed ? 'patch-sealed' : 'patch-leaking'

  return (
    <button
      type="button"
      className={'patch-slot ' + state}
      style={{ '--x': x + '%', '--y': y + '%' } as CSSProperties}
      aria-label={t(sealed ? 'CABIN.SealedHole' : 'PATCH.OpenHole', { number: id + 1 })}
      aria-disabled={sealed}
      onClick={() => rotate(id)}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <PatchShape shape={shape} turns={target} className="patch-hole" />
        <PatchShape shape={shape} turns={turns} className="patch-plate" />
      </svg>
      {!sealed && <span className="patch-air" aria-hidden="true" />}
    </button>
  )
}
