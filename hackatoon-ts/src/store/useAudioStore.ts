import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type VolumeChannel = 'musicVolume' | 'effectsVolume'

type AudioStore = Record<VolumeChannel, number> & {
  setVolume: (channel: VolumeChannel, volume: number) => void
}

export const useAudioStore = create<AudioStore>()(
  persist(
    (set) => ({
      musicVolume: 15,
      effectsVolume: 100,
      setVolume: (channel, volume) => set({ [channel]: volume }),
    }),
    {
      name: 'puesto-sol-7-audio',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
