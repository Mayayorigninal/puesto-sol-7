export const missions = {
  fugas: {
    discovery: 'fuga',
    completion: 'parche',
  },
  parches: {
    discovery: 'micrometeorito',
    completion: 'soyuz',
  },
  ejercicio: {
    discovery: 'ejercicio',
    completion: 'huesos',
  },
  cosecha: {
    discovery: 'veggie',
    completion: 'tomates',
  },
  antena: {
    discovery: 'tierra-fija',
    completion: 'temblores',
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
export const missionOptions = ['polvo', 'filtro', 'fugas', 'parches', 'ejercicio', 'cosecha', 'antena'] as const satisfies readonly Mission[]
