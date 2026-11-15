import { useTranslation } from '../i18n/useTranslation'
import { useAudioStore } from '../store/useAudioStore'
import { Icon } from './Icon'

const channels = [
  { key: 'musicVolume', label: 'SETTINGS.Music' },
  { key: 'effectsVolume', label: 'SETTINGS.Effects' },
] as const

export function VolumeControl() {
  const { t, language, setLanguage } = useTranslation()
  const audio = useAudioStore()

  return (
    <details
      className="volume-control"
      onBlur={({ currentTarget, relatedTarget }) => {
        if (!currentTarget.contains(relatedTarget)) currentTarget.open = false
      }}
      onKeyDown={({ key, currentTarget }) => {
        if (key !== 'Escape' || !currentTarget.open) return
        currentTarget.open = false
        currentTarget.querySelector('summary')?.focus()
      }}
    >
      <summary aria-label={t('SETTINGS.Title')} title={t('SETTINGS.Title')}><Icon name="i-volume" /></summary>
      <div className="volume-panel">
        {channels.map(({ key, label }) => (
          <label className="volume-channel" key={key}>
            <span>{t(label)}</span>
            <span aria-hidden="true">{audio[key]} %</span>
            <input
              type="range" min={0} max={100} value={audio[key]} aria-valuetext={`${audio[key]} %`}
              onChange={(event) => audio.setVolume(key, event.currentTarget.valueAsNumber)}
            />
          </label>
        ))}
        <label className="language-control">
          <span>{t('SETTINGS.Language')}</span>
          <select value={language} onChange={(event) => setLanguage(event.currentTarget.value)}>
            <option value="en" lang="en">English</option>
            <option value="es" lang="es">Español</option>
          </select>
        </label>
      </div>
    </details>
  )
}
