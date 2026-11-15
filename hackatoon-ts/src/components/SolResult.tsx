import { useTranslation, type Translate } from '../i18n/useTranslation'
import { type Mission } from '../data/missions'
import { BaseScene } from './BaseScene'
import { rules, type Resources, type SolReport } from '../game/rules.ts'

type SolResultProps = {
  sol: number
  mission: Mission
  value: number
  report: SolReport
  resources: Resources
  /** true si la misión termina con este sol. */
  last: boolean
  onNext: () => void
}

function stormText({ risk, shielded, storm, stormDamage }: SolReport, t: Translate) {
  if (risk.chance === 0) {
    return shielded
      ? t('RESULT.QuietShield')
      : t('RESULT.Quiet')
  }
  if (storm) {
    return shielded
      ? t('RESULT.Shielded')
      : t(stormDamage === 1 ? 'RESULT.StormHitOne' : 'RESULT.StormHitMany', { count: stormDamage })
  }
  return shielded
    ? t('RESULT.MissedShield')
    : t('RESULT.Missed')
}

/** Cierre del sol: cómo salió la tarea, si llegó la tormenta y cuánta energía se cargó. */
export function SolResult({ sol, mission, value, report, resources, last, onNext }: SolResultProps) {
  const { t } = useTranslation()
  const percent = Math.round(mission === 'polvo' ? value * 100 : value)
  const { success, taskEnergy, taskDamage, wearDamage, stormDamage, recharge, risk } = report
  const hearts = taskDamage + wearDamage + stormDamage
  const energy = taskEnergy + recharge

  return (
    <div className="carta carta-centrada">
      <div className="eyebrow">{t('RESULT.Sol', { sol, total: rules.sols })}</div>
      <BaseScene
        resources={resources} risk={risk.level} shield={report.shielded}
        storm={!report.storm ? 'no' : stormDamage > 0 ? 'golpe' : 'detenida'}
      />
      <h2 className="dice" style={{ fontSize: '1.45rem', color: success ? 'var(--life)' : 'var(--alert)' }}>
        {t(`SHIP.${mission}.${success ? 'WinTitle' : 'LoseTitle'}`)}
      </h2>
      <p className="lead">{t(`SHIP.${mission}.${success ? 'WinText' : 'LoseText'}`, { percent })}</p>
      <div className="real"><b>{mission === 'fugas' ? t('RESULT.BipLog') : t('RESULT.Real')}</b>{t(`SHIP.${mission}.Fact`)}</div>

      <div className={`noche${stormDamage > 0 ? ' noche-mal' : ''}`}>
        <b>{t('RESULT.Weather', { risk: t(`WEATHER.Risk.${risk.level}`) })}</b>
        {stormText(report, t)}
      </div>
      {wearDamage > 0 && (
        <div className="noche noche-mal">
          <b>{t('RESULT.Support')}</b>
          {t('RESULT.Wear', { limit: rules.wearLimit })}
        </div>
      )}

      <div className="efectos">
        {energy > 0 && <span className="chip mas">{t('RESULT.Energy', { energy })}</span>}
        {energy === 0 && <span className="chip menos">{t('RESULT.NoEnergy')}</span>}
        {hearts > 0 && <span className="chip menos">{t('RESULT.CrewDamage', { hearts })}</span>}
        {hearts === 0 && <span className="chip mas">{t('RESULT.CrewSafe')}</span>}
      </div>
      {resources.crew > 0 && !last && recharge < rules.recharge && (
        <p className="lead">{t('RESULT.Recharge', { recharge, total: rules.recharge })}</p>
      )}
      <button className="btn" type="button" onClick={onNext}>{last ? t('RESULT.End') : t('RESULT.Next', { sol: sol + 1 })}</button>
    </div>
  )
}
