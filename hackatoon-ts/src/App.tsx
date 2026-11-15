import { useState } from 'react'
import { Almanac } from './components/Almanac'
import { Hud, Navigation, type Tab } from './components/Hud'
import { MissionView } from './components/MissionView'
import { useGameStore } from './store/useGameStore'

export default function App() {
  const [active, setActive] = useState<Tab>('mision')
  const game = useGameStore((state) => state.game)
  const dispatch = useGameStore((state) => state.dispatch)

  return (
    <div id="app">
      <div className="station-brand">Puesto <span>Sol 7</span></div>
      <Hud sol={game.sol} completed={game.history.length} resources={game.resources} />
      <section className="view pad" id="view-hitos" role="tabpanel" aria-labelledby="tab-hitos" hidden={active !== 'hitos'}>
        <Almanac discoveries={game.discoveries} />
      </section>
      <section className="view" id="view-mision" role="tabpanel" aria-labelledby="tab-mision" hidden={active !== 'mision'}>
        <main className="campo">
          <MissionView game={game} dispatch={dispatch} />
        </main>
      </section>
      <Navigation active={active} onChange={setActive} />
      <div className="girar" role="alert">
        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="2.5" width="10" height="19" rx="2.2" /><path d="M11 18.5h2" /></svg>
        <p>Gira tu teléfono en vertical para jugar.</p>
      </div>
    </div>
  )
}
