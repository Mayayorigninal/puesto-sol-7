// Los experimentos científicos de la misión, en el orden en que se completan.
// PENDIENTE (Joseph): elegir 8 experimentos reales de la NASA en la Luna y
// poner aquí su nombre, una explicación corta para niños y la fuente.
export type Experiment = { title: string; fact: string | null; source: string | null }

export const experiments: readonly Experiment[] = Array.from({ length: 8 }, (_, index) => ({
  title: `Experimento ${index + 1}`,
  fact: null,
  source: null,
}))
