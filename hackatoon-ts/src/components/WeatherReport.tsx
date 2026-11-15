import { useTranslation } from '../i18n/useTranslation'
import { cmeTravelHours, donkiUrl, type SolWeather } from '../data/spaceWeather.ts'
import { stormRisk } from '../game/rules.ts'
import { FlareScale } from './FlareScale'
import { Icon } from './Icon'

/** El reporte de clima espacial del día, con los datos reales de NASA DONKI. */
export function WeatherReport({ weather, hidden = false }: { weather: SolWeather; hidden?: boolean }) {
  const { t, rich, formatDate } = useTranslation()
  if (hidden) {
    return (
      <section className="clima clima-oculto" aria-label={t('WEATHER.NoForecast')}>
        <div className="clima-cab">
          <Icon name="i-sun" />
          <div>
            <div className="eyebrow">{t('WEATHER.HiddenDate', { date: formatDate(weather.date) })}</div>
            <div className="clima-clase">{t('WEATHER.NoSignal')}</div>
            <span className="clima-riesgo">{t('WEATHER.UnknownRisk')}</span>
          </div>
        </div>
        <p className="clima-aviso">{t('WEATHER.HiddenWarning')}</p>
      </section>
    )
  }

  const { flare, flareLink, cmeSpeed, kp, alerts, date } = weather
  const risk = stormRisk(flare)
  const first = flare?.[0]
  const letter = first === 'B' || first === 'C' || first === 'M' || first === 'X' ? first : 'Other'

  return (
    <section className={`clima clima-${risk.level}`} aria-label={t('WEATHER.Report')}>
      <div className="clima-cab">
        <Icon name="i-sun" />
        <div>
          <div className="eyebrow">{t('WEATHER.Date', { date: formatDate(date) })}</div>
          <div className="clima-clase">{flare ? t('WEATHER.Flare', { flare }) : t('WEATHER.Calm')}</div>
          <span className="clima-riesgo">{t(`WEATHER.Risk.${risk.level}`)}</span>
        </div>
      </div>
      <FlareScale flare={flare} />
      <div className="clima-chips">
        {cmeSpeed && <span>{t('WEATHER.Plasma', { speed: cmeSpeed, hours: cmeTravelHours(cmeSpeed) })}</span>}
        {kp && <span>{t('WEATHER.Kp', { kp })}</span>}
        {alerts > 0 && <span>{t(alerts === 1 ? 'WEATHER.AlertOne' : 'WEATHER.AlertMany', { count: alerts })}</span>}
      </div>
      {risk.chance > 0 && <p className="clima-aviso">{rich('WEATHER.Warning', { might: <b>{t('WEATHER.Might')}</b> })}</p>}
      <details className="clima-mas">
        <summary>{t('WEATHER.Explain')}</summary>
        <ul className="clima-datos">
          {flare
            ? <li>{rich('WEATHER.FlareDetail', { letter: <b>{first}</b>, strength: t(`WEATHER.FlareClass.${letter}`) })}</li>
            : <li>{t('WEATHER.NoFlare')}</li>}
          {cmeSpeed && <li>{rich('WEATHER.PlasmaDetail', { speed: <b>{cmeSpeed} km/s</b>, travel: <b>{t('WEATHER.Hours', { count: cmeTravelHours(cmeSpeed) })}</b> })}</li>}
          {kp && <li>{rich('WEATHER.KpDetail', { index: <b>Kp {kp}</b> })}</li>}
          <li>{t('WEATHER.Regolith')}</li>
        </ul>
      </details>
      <a className="clima-fuente" href={flareLink ?? donkiUrl} target="_blank" rel="noreferrer">{t('WEATHER.Source')}</a>
    </section>
  )
}
