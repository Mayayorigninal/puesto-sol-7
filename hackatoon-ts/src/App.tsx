import { useTranslation } from './i18n/useTranslation'
import { useEffect, useRef, useState } from 'react'
import { Almanac } from './components/Almanac'
import { Hud, Navigation, type Tab } from './components/Hud'
import { MissionView } from './components/MissionView'
import { useAudioStore } from './store/useAudioStore'
import { useGameStore } from './store/useGameStore'

export default function App() {
  const { t, rich, language } = useTranslation()
  const [active, setActive] = useState<Tab>('mision')
  const game = useGameStore((state) => state.game)
  const dispatch = useGameStore((state) => state.dispatch)
  const musicRef = useRef<HTMLAudioElement>(null)
  const musicVolume = useAudioStore((state) => state.musicVolume)
  const isPlayingMinigame = game.phase.type === 'playing'

  useEffect(() => {
    document.documentElement.lang = language
    document.title = t('APP.Title')
  }, [language, t])

  useEffect(() => {
    const music = musicRef.current
    if (!music) return

    music.volume = musicVolume / 100
    music.muted = musicVolume === 0
  }, [musicVolume])

  useEffect(() => {
    const music = musicRef.current
    if (!music || isPlayingMinigame) return

    const playMusic = () => {
      if (music.paused) void music.play().catch(() => {})
    }

    // El primer clic permite iniciar el audio si el navegador bloqueó la reproducción automática.
    document.addEventListener('click', playMusic)
    playMusic()

    return () => {
      document.removeEventListener('click', playMusic)
      music.pause()
    }
  }, [isPlayingMinigame])

  return (
    <div id="app">
      <audio ref={musicRef} src={`${import.meta.env.BASE_URL}music/727090__joshkeylowf__back-from-space.wav`} loop />
      <div className="station-brand">{rich('APP.Brand', { station: t('APP.Station'), sol: <span>Sol 7</span> })}</div>
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
        <p>{t('APP.Rotate')}</p>
      </div>
    </div>
  )
}
