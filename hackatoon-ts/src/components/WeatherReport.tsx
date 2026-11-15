import { cmeTravelHours, donkiUrl, type SolWeather } from '../data/spaceWeather.ts'
import { riskLabels, stormRisk } from '../game/rules.ts'
import { Icon } from './Icon'

const flareWords: Record<string, string> = {
  B: 'muy débil',
  C: 'débil',
  M: 'fuerte',
  X: 'la más fuerte que existe',
}

/** El reporte de clima espacial del día, con los datos reales de NASA DONKI. */
export function WeatherReport({ weather }: { weather: SolWeather }) {
  const { flare, flareLink, cmeSpeed, kp, alerts, fecha } = weather
  const risk = stormRisk(flare)

  return (
    <section className={`clima clima-${risk.level}`} aria-label="Reporte de clima espacial">
      <div className="clima-cab">
        <Icon name="i-sun" />
        <div>
          <div className="eyebrow">Clima espacial real · {fecha}</div>
          <div className="clima-clase">{flare ? `Fulguración ${flare}` : 'Sol tranquilo'}</div>
        </div>
        <span className="clima-riesgo">{riskLabels[risk.level]}</span>
      </div>
      <ul className="clima-datos">
        {flare
          ? <li>El Sol soltó un destello de clase <b>{flare[0]}</b> ({flareWords[flare[0]] ?? 'rara'}). Cada letra —B, C, M, X— es unas 10 veces más fuerte que la anterior.</li>
          : <li>Hoy no hubo ninguna fulguración registrada.</li>}
        {cmeSpeed && <li>Salió una nube de plasma a <b>{cmeSpeed} km/s</b>. A esa velocidad, una nube tardaría unas <b>{cmeTravelHours(cmeSpeed)} horas</b> en recorrer la distancia del Sol a la Luna.</li>}
        {kp && <li>Tormenta magnética en la Tierra: <b>Kp {kp}</b> (la escala va de 0 a 9).</li>}
        {alerts > 0 && <li>La NASA mandó <b>{alerts} {alerts === 1 ? 'alerta' : 'alertas'}</b> ese día.</li>}
        {risk.chance > 0 && <li className="clima-aviso">Después de un destello así <b>puede</b> llegar una tormenta de partículas. Nadie sabe si llegará.</li>}
      </ul>
      <a className="clima-fuente" href={flareLink ?? donkiUrl} target="_blank" rel="noreferrer">Fuente: NASA DONKI ↗</a>
    </section>
  )
}
