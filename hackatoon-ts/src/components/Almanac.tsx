import { useTranslation } from '../i18n/useTranslation'
import { milestones, type Milestone } from '../data/almanac'
import { donkiUrl } from '../data/spaceWeather.ts'
import { Icon } from './Icon'

export function Almanac({ discoveries }: { discoveries: ReadonlySet<Milestone> }) {
  const { t } = useTranslation()
  return (
    <div className="hitos">
      <div>
        <div className="eyebrow">{t('ALMANAC.Label')}</div>
        <h2 style={{ marginTop: 4 }}>{t('ALMANAC.Title')}</h2>
        <p className="lead" style={{ marginTop: 6 }}>{t('ALMANAC.Intro')}</p>
      </div>
      <div className="hitos">
        {milestones.map((id) => {
          const discovered = discoveries.has(id)
          return (
            <article key={id} className={`hito${discovered ? '' : ' bloqueado'}`}>
              <div className="cab">
                <Icon name={discovered ? 'i-medal' : 'i-lock'} />
                <h3>{discovered ? t(`ALMANAC.${id}.Title`) : t('ALMANAC.Locked')}</h3>
              </div>
              <p>{discovered ? t(`ALMANAC.${id}.Description`) : t('ALMANAC.LockedText')}</p>
              {discovered && <div className="fuente">{t(`ALMANAC.${id}.Source`)}</div>}
            </article>
          )
        })}
      </div>
      <a className="clima-fuente" href={donkiUrl} target="_blank" rel="noreferrer">{t('WEATHER.Credit')} ↗</a>
    </div>
  )
}
