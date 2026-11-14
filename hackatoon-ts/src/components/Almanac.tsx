import { milestones, type Milestone } from '../data/almanac'
import { Icon } from './Icon'

export function Almanac({ discoveries }: { discoveries: ReadonlySet<Milestone> }) {
  return (
    <div className="hitos">
      <div>
        <div className="eyebrow">Almanaque</div>
        <h2 style={{ marginTop: 4 }}>Lo que vas descubriendo</h2>
        <p className="lead" style={{ marginTop: 6 }}>Cada cosa que te pasa abre su ficha, con lo que significa de verdad.</p>
      </div>
      <div className="hitos">
        {milestones.map(({ id, title, description, source }) => {
          const discovered = discoveries.has(id)
          return (
            <article key={id} className={`hito${discovered ? '' : ' bloqueado'}`}>
              <div className="cab">
                <Icon name={discovered ? 'i-medal' : 'i-lock'} />
                <h3>{discovered ? title : 'Por descubrir'}</h3>
              </div>
              <p>{discovered ? description : 'Se abre cuando te topes con esto en la misión.'}</p>
              {discovered && <div className="fuente">{source}</div>}
            </article>
          )
        })}
      </div>
    </div>
  )
}
