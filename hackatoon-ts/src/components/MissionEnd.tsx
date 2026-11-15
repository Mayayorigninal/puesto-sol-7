import { useTranslation } from '../i18n/useTranslation'
import { donkiUrl, sepEventsInWeek, spaceWeather } from '../data/spaceWeather.ts'
import type { SolRecord } from '../game/missionState'
import { rules, type Ending, type Resources } from '../game/rules.ts'
import { Icon } from './Icon'
import { Remo } from './StationStatus'

type MissionEndProps = {
  ending: Ending
  resources: Resources
  history: readonly SolRecord[]
  onRestart: () => void
}

/** Pantalla final: cómo terminó la misión y qué pasó de verdad esa semana. */
export function MissionEnd({ ending, resources, history, onRestart }: MissionEndProps) {
  const { t, rich } = useTranslation()
  const good = ending === 'ganaste'
  const storms = history.filter(({ report }) => report.storm).length

  return (
    <div className="carta carta-centrada final">
      <Remo crew={resources.crew} />
      <h2 className="dice" style={{ fontSize: '1.5rem', color: good ? 'var(--life)' : 'var(--alert)' }}>{t(`ENDING.${ending}.Title`)}</h2>
      <p className="lead">{t(`ENDING.${ending}.Text`)}</p>
      <div className="efectos">
        <span className={`chip ${resources.science >= rules.scienceGoal ? 'mas' : 'menos'}`}>{t('ENDING.Science', { count: resources.science, goal: rules.scienceGoal })}</span>
        <span className={`chip ${resources.crew > 0 ? 'mas' : 'menos'}`}>{t('ENDING.Crew', { count: resources.crew, max: rules.crewMax })}</span>
        <span className="chip mas">{t('ENDING.Sols', { count: history.length, total: rules.sols })}</span>
      </div>

      <ol className="bitacora" aria-label={t('ENDING.Log')}>
        {history.map(({ sol, plan, report }) => (
          <li key={sol} className={report.stormDamage > 0 ? 'mal' : ''}>
            <span className="bit-sol">{t('ENDING.Sol', { sol })}</span>
            <span className="bit-clase">{spaceWeather[sol - 1].flare ?? '—'}</span>
            <span className="bit-iconos">
              <Icon name="i-shield" className={plan.shield ? 'on-blindaje' : ''} />
              <Icon name="i-flask" className={plan.experiment ? 'on-ciencia' : ''} />
            </span>
            <span className="bit-nota">{report.storm ? (report.stormDamage > 0 ? t(report.stormDamage === 1 ? 'ENDING.StormHitOne' : 'ENDING.StormHitMany', { count: report.stormDamage }) : t('ENDING.StormBlocked')) : t('ENDING.NoStorm')}</span>
          </li>
        ))}
      </ol>

      <div className="real">
        <b>{t('ENDING.Real')}</b>
        {rich('ENDING.RealWeather', { observed: <strong>{t('ENDING.Observed', { count: sepEventsInWeek })}</strong> })}
        {storms > 0 && t(storms === 1 ? 'ENDING.SimulatedOne' : 'ENDING.SimulatedMany', { count: storms })}
        {t('ENDING.Decisions')}
      </div>
      <a className="clima-fuente" href={donkiUrl} target="_blank" rel="noreferrer">{t('WEATHER.Credit')} ↗</a>
      <button className="btn" type="button" onClick={onRestart}>{t('ENDING.Restart')}</button>
    </div>
  )
}
