export const milestones = [
  'fulguracion', 'particulas', 'ejercicio', 'huesos', 'veggie', 'tomates', 'tierra-fija', 'temblores',
  'fuga', 'parche', 'micrometeorito', 'soyuz', 'polvo', 'arena', 'co2', 'buzon',
] as const

export type Milestone = (typeof milestones)[number]
