import { useTranslation } from '../../i18n/useTranslation'
import { Meter } from '../../components/Meter'
import { usePatchStore } from '../../store/usePatchStore'
import { countLeaking, patchDeadline } from './patches'

// Cada pieza del HUD lee del store solo el número que muestra.
// Si el selector devuelve un número redondeado, React solo vuelve a
// dibujar cuando ese número cambia, no en cada cuadro de animación.

export function PatchClock() {
  const secondsLeft = usePatchStore((state) => Math.max(0, Math.ceil(patchDeadline - state.elapsed)))
  return <span className="leak-clock">{secondsLeft} s</span>
}

export function PatchOxygen() {
  const { t } = useTranslation()
  const oxygen = usePatchStore((state) => Math.ceil(state.oxygen))
  return (
    <Meter
      label={t('CABIN.Oxygen')}
      text={oxygen + '%'}
      value={oxygen}
      color={oxygen < 30 ? 'var(--alert)' : 'var(--life)'}
    />
  )
}

export function PatchCounter() {
  const { t } = useTranslation()
  const total = usePatchStore((state) => state.patches.length)
  const sealed = usePatchStore((state) => state.patches.filter((patch) => patch.sealed).length)
  const leaking = usePatchStore((state) => countLeaking(state.patches))
  return (
    <div className="leak-status" aria-live="polite">
      <span>{t('CABIN.Sealed', { sealed, total })}</span>
      <span>{leaking > 0 ? t(leaking === 1 ? 'CABIN.LeakOne' : 'CABIN.LeakMany', { count: leaking }) : t('CABIN.Contained')}</span>
    </div>
  )
}
