export const milestones = [
  'fulguracion', 'particulas', 'fuga', 'parche', 'micrometeorito', 'soyuz', 'polvo', 'arena', 'co2', 'buzon',
] as const

export type Milestone = (typeof milestones)[number]
