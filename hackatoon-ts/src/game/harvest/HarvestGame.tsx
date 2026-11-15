import { useTranslation } from '../../i18n/useTranslation'
import { useState } from 'react'
import { Meter } from '../../components/Meter'
import { useAnimationFrame } from '../useAnimationFrame'
import { createHarvest, duration, goal, growth, harvestDone, tapPot, updateHarvest, type Harvest, type PotStage, type TapResult } from './harvest'

type HarvestGameProps = { onFinish: (success: boolean, harvested: number) => void }

const sprite = (name: string) => `${import.meta.env.BASE_URL}assets/granja/${name}.png`
const plantSprite: Record<PotStage, string> = {
  creciendo: sprite('planta-creciendo'),
  lista: sprite('planta-lista'),
  seca: sprite('planta-seca'),
}
type PotView = { stage: PotStage; growth: number }

function snapshot(harvest: Harvest) {
  return {
    remaining: Math.max(0, Math.ceil(duration - harvest.elapsed)),
    harvested: harvest.harvested,
    // El tamaño se redondea a 10 pasos para no redibujar en cada cuadro.
    pots: harvest.pots.map((pot): PotView => ({ stage: pot.stage, growth: Math.round(growth(pot) * 10) / 10 })),
  }
}
type View = ReturnType<typeof snapshot>

function sameView(a: View, b: View) {
  return a.remaining === b.remaining && a.harvested === b.harvested
    && a.pots.every((pot, i) => pot.stage === b.pots[i].stage && pot.growth === b.pots[i].growth)
}

/** Minijuego de comida: tocar cada planta justo cuando está lista. */
export function HarvestGame({ onFinish }: HarvestGameProps) {
  const { t } = useTranslation()
  // La simulación se crea una sola vez y se modifica solo dentro de callbacks.
  const [harvest] = useState(createHarvest)
  const [view, setView] = useState(() => snapshot(harvest))
  const [note, setNote] = useState<TapResult | null>(null)

  useAnimationFrame((seconds) => {
    updateHarvest(harvest, seconds)
    const next = snapshot(harvest)
    setView((current) => (current && sameView(current, next) ? current : next))
    if (!harvestDone(harvest)) return true
    onFinish(harvest.harvested >= goal, harvest.harvested)
    return false
  })

  function tap(index: number) {
    if (harvestDone(harvest)) return
    setNote(tapPot(harvest, index))
    setView(snapshot(harvest))
  }

  return (
    <div className="mj cosecha">
      <Meter label={t('DUST.Time')} text={`${view.remaining} s`} value={view.remaining / duration * 100} color="var(--muted)" />
      <Meter label={t('HARVEST.Meter')} text={`${view.harvested} / ${goal}`} value={view.harvested / goal * 100} color="var(--crop)" />
      <div className="invernadero" aria-label={t('HARVEST.Greenhouse')}>
        {view.pots.map((pot, index) => (
          <button
            key={index} type="button" className={`maceta maceta-${pot.stage}`}
            aria-label={t(`HARVEST.Pot.${pot.stage}`, { number: index + 1 })}
            onPointerDown={(event) => { event.preventDefault(); tap(index) }}
            onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); tap(index) } }}
          >
            <span className="maceta-luz" aria-hidden="true" />
            <img className="maceta-planta" src={plantSprite[pot.stage]} alt="" draggable={false}
              style={{ transform: `scale(${0.25 + pot.growth * 0.75})` }} />
            <img className="maceta-base" src={sprite('maceta')} alt="" draggable={false} />
          </button>
        ))}
      </div>
      <p className="mj-nota" aria-live="polite">{t(note ? `HARVEST.Note.${note}` : 'HARVEST.Note.Ready')}</p>
    </div>
  )
}
