import { donkiCredit } from '../data/spaceWeather.ts'
import { initialResources, rules } from '../game/rules.ts'
import { BaseScene } from './BaseScene'
import { Icon } from './Icon'

/** Pantalla inicial: explica la meta de la misión en tres líneas. */
export function Intro({ onBegin }: { onBegin: () => void }) {
  return (
    <div className="carta carta-centrada">
      <BaseScene resources={initialResources} />
      <div className="quien">BIP · computadora del puesto</div>
      <h2 className="dice">Capitán, bienvenido al Puesto Sol 7, en la Luna. Tenemos {rules.sols} soles de misión.</h2>
      <ul className="reglas">
        <li><Icon name="i-flask" className="on-ciencia" /><span>Completa <b>{rules.scienceGoal} experimentos</b> antes de que termine la misión.</span></li>
        <li><Icon name="i-heart" className="on-trip" /><span>No dejes que la <b>tripulación</b> se quede sin corazones.</span></li>
        <li><Icon name="i-bolt" className="on-energia" /><span>Todo cuesta <b>energía</b>, y nunca alcanza para todo.</span></li>
        <li><Icon name="i-sun" className="on-energia" /><span>Cada sol verás el <b>clima espacial real</b> de ese día… si la antena tiene señal.</span></li>
        <li><Icon name="i-base" className="on-ciencia" /><span>Hay <b>4 sistemas</b>: energía, soporte vital, comida y antena. Cada día solo alcanza para cuidar uno.</span></li>
      </ul>
      <button className="btn" type="button" onClick={onBegin}>Empezar la misión</button>
      <p className="credito">{donkiCredit}</p>
    </div>
  )
}
