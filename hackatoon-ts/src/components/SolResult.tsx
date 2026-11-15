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
  const count = Math.round(value)
  const percent = mission === 'polvo' ? Math.round(value * 100) : count
  const { success, taskEnergy, taskDamage, wearDamage, stormDamage, recharge, risk, oxygenPaid, airDamage, hungerDamage, harvested, forecastLost } = report
  const hearts = taskDamage + wearDamage + stormDamage + airDamage + hungerDamage
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
      <p className="lead">{t(`SHIP.${mission}.${success ? 'WinText' : 'LoseText'}`, { percent, count })}</p>
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
      {hungerDamage > 0 && (
        <div className="noche noche-mal">
          <b>{t('RESULT.Pantry')}</b>
          {t('RESULT.Hunger')}
        </div>
      )}
      {airDamage > 0 && (
        <div className="noche noche-mal">
          <b>{t('RESULT.Oxygen')}</b>
          {t('RESULT.AirDamage')}
        </div>
      )}
      {forecastLost && !last && resources.crew > 0 && (
        <div className="noche noche-mal">
          <b>{t('RESULT.Comms')}</b>
          {t('RESULT.ForecastLost')}
        </div>
      )}

      <div className="efectos">
        <span className="chip mas">{t('RESULT.Panels', { energy })}</span>
        {oxygenPaid > 0 && <span className="chip menos">{t('RESULT.OxygenPaid', { count: oxygenPaid })}</span>}
        {harvested > 0 && <span className="chip mas">{t('RESULT.FoodGained', { count: harvested })}</span>}
        <span className="chip menos">{t('RESULT.FoodSpent', { count: rules.foodPerSol })}</span>
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
