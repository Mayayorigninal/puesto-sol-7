import { useTranslation } from './i18n/useTranslation'
import { useEffect, useRef, useState } from 'react'
import { Almanac } from './components/Almanac'
import { Hud, Navigation, type Tab } from './components/Hud'
import { MissionView } from './components/MissionView'
import type { Mission } from './data/missions'
import { useAudioStore } from './store/useAudioStore'
import { useGameStore } from './store/useGameStore'

const industrialTrack = 'Ambient-Sound-2.wav'
const panelAndFilterTrack = 'Ambient-Sound-3.wav'
const minigameTracks: Record<Mission, string> = {
  ejercicio: 'Musica-1-bg.ogg',
  parches: 'Musica-1-bg.ogg',
  fugas: 'Musica-1-bg.ogg',
  cosecha: industrialTrack,
  antena: industrialTrack,
  polvo: panelAndFilterTrack,
  filtro: panelAndFilterTrack,
}
// La música suena a la mitad: con el control al 100, el volumen real es 50%.
const musicGain = 0.5

export default function App() {
  const { t, rich, language } = useTranslation()
  const [active, setActive] = useState<Tab>('mision')
  const game = useGameStore((state) => state.game)
  const dispatch = useGameStore((state) => state.dispatch)
  const ambientMusicRef = useRef<HTMLAudioElement>(null)
  const minigameMusicRef = useRef<HTMLAudioElement>(null)
  const musicVolume = useAudioStore((state) => state.musicVolume)
  const { phase } = game
  const isPlayingMinigame = phase.type === 'playing'
  const minigameTrack = isPlayingMinigame ? minigameTracks[phase.mission] : undefined

  useEffect(() => {
    document.documentElement.lang = language
    document.title = t('APP.Title')
  }, [language, t])

  useEffect(() => {
    for (const music of [ambientMusicRef.current, minigameMusicRef.current]) {
      if (!music) continue
      music.volume = musicVolume / 100 * musicGain
      music.muted = musicVolume === 0
    }
  }, [musicVolume, minigameTrack])

  useEffect(() => {
    const music = isPlayingMinigame
      ? minigameMusicRef.current
      : ambientMusicRef.current
    if (!music) return

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
  }, [isPlayingMinigame, minigameTrack])

  return (
    <div id="app">
      <audio ref={ambientMusicRef} src={`${import.meta.env.BASE_URL}music/Ambient-Sound.wav`} loop />
      {minigameTrack && <audio key={minigameTrack} ref={minigameMusicRef} src={`${import.meta.env.BASE_URL}music/${minigameTrack}`} loop />}
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
