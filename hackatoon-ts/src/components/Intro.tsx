import { useTranslation } from '../i18n/useTranslation'
import { initialResources, rules } from '../game/rules.ts'
import { BaseScene } from './BaseScene'
import { Icon } from './Icon'

/** Pantalla inicial: explica la meta de la misión en tres líneas. */
export function Intro({ onBegin }: { onBegin: () => void }) {
  const { t, rich } = useTranslation()
  return (
    <div className="carta carta-centrada">
      <BaseScene resources={initialResources} />
      <div className="quien">{t('INTRO.Speaker')}</div>
      <h2 className="dice">{t('INTRO.Welcome', { sols: rules.sols })}</h2>
      <ul className="reglas">
        <li><Icon name="i-flask" className="on-ciencia" /><span>{rich('INTRO.Science', { emphasis: <b>{t('INTRO.ScienceEmphasis', { count: rules.scienceGoal })}</b> })}</span></li>
        <li><Icon name="i-heart" className="on-trip" /><span>{rich('INTRO.Crew', { emphasis: <b>{t('INTRO.CrewEmphasis')}</b> })}</span></li>
        <li><Icon name="i-bolt" className="on-energia" /><span>{rich('INTRO.Energy', { emphasis: <b>{t('INTRO.EnergyEmphasis')}</b> })}</span></li>
        <li><Icon name="i-sun" className="on-energia" /><span>{rich('INTRO.Weather', { emphasis: <b>{t('INTRO.WeatherEmphasis')}</b> })}</span></li>
        <li><Icon name="i-base" className="on-ciencia" /><span>{rich('INTRO.Systems', { emphasis: <b>{t('INTRO.SystemsEmphasis')}</b> })}</span></li>
      </ul>
      <button className="btn" type="button" onClick={onBegin}>{t('INTRO.Begin')}</button>
      <p className="credito">{t('WEATHER.Credit')}</p>
    </div>
  )
}
