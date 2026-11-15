import { useTranslation } from '../i18n/useTranslation'
import { rules, type Resources } from '../game/rules.ts'
import { Icon } from './Icon'

/** Los recursos de la misión, siempre visibles arriba. */
export function ResourceBar({ resources }: { resources: Resources }) {
  const { t } = useTranslation()

  const { energy, crew, science, food } = resources
  return (
    <div className="recursos">
      <div className="recurso rec-energia" role="img" aria-label={t('HUD.Energy', { energy })}>
        <Icon name="i-bolt" /><span className="n">{energy}</span>
      </div>
      <div className={`recurso rec-trip${crew <= 2 ? ' bajo' : ''}`} role="img" aria-label={t('HUD.Crew', { crew, total: rules.crewMax })}>
        {Array.from({ length: rules.crewMax }, (_, index) => (
          <img key={index} src={`${import.meta.env.BASE_URL}assets/corazon.png`} alt="" className={`corazon${index < crew ? '' : ' vacio'}`} />
        ))}
      </div>
      <div className={`recurso rec-comida${food <= 1 ? ' bajo' : ''}`} role="img" aria-label={t(food === 1 ? 'HUD.FoodOne' : 'HUD.FoodMany', { count: food })}>
        <img src={`${import.meta.env.BASE_URL}assets/granja/planta-lista.png`} alt="" /><span className="n">{food}</span>
      </div>
      <div className="recurso rec-ciencia" role="img" aria-label={t('HUD.Science', { science, goal: rules.scienceGoal })}>
        <Icon name="i-flask" /><span className="n">{science}<small>/{rules.scienceGoal}</small></span>
      </div>
    </div>
  )
}
