import { useState } from 'react'
import { Almanac } from './components/Almanac'
import { Hud, Navigation, type Tab } from './components/Hud'
import { MissionView } from './components/MissionView'
import { StationStatus } from './components/StationStatus'
import { useGameStore } from './store/useGameStore'

export default function App() {
  const [active, setActive] = useState<Tab>('mision')
  const game = useGameStore((state) => state.game)
  const dispatch = useGameStore((state) => state.dispatch)

  return (
    <div id="app">
      <div className="station-brand">Puesto <span>Sol 7</span></div>
      <Hud energy={game.systems.energia} completed={game.phase.type === 'result'} />
      <section className="view pad" id="view-estado" role="tabpanel" aria-labelledby="tab-estado" hidden={active !== 'estado'}>
        <StationStatus values={game.systems} />
      </section>
      <section className="view pad" id="view-hitos" role="tabpanel" aria-labelledby="tab-hitos" hidden={active !== 'hitos'}>
        <Almanac discoveries={game.discoveries} />
      </section>
      <section className="view" id="view-mision" role="tabpanel" aria-labelledby="tab-mision" hidden={active !== 'mision'}>
        <main className="campo">
          <MissionView phase={game.phase} dispatch={dispatch} />
        </main>
      </section>
      <Navigation active={active} onChange={setActive} />
    </div>
  )
}
