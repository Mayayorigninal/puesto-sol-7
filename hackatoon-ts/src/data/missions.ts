export const missions = {
  fugas: {
    discovery: 'fuga',
    completion: 'parche',
  },
  parches: {
    discovery: 'micrometeorito',
    completion: 'soyuz',
  },
  polvo: {
    discovery: 'polvo',
    completion: 'arena',
  },
  filtro: {
    discovery: 'co2',
    completion: 'buzon',
  },
} as const

export type Mission = keyof typeof missions
export const missionOptions = ['polvo', 'filtro', 'fugas', 'parches'] as const satisfies readonly Mission[]
