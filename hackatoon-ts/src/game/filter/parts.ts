import type { Translate } from '../../i18n/useTranslation'

export const assembly = ['bolsa', 'carton', 'cinta', 'manguera'] as const
export type Part = (typeof assembly)[number] | 'cuchara' | 'linterna'

export function shuffle(parts: Part[]) {
  const shuffled = [...parts]
  for (let index = shuffled.length - 1; index > 0; index--) {
    const next = Math.floor(Math.random() * (index + 1))
    const part = shuffled[index]
    shuffled[index] = shuffled[next]
    shuffled[next] = part
  }
  return shuffled
}

export function confusionLevel(co2: number) {
  return co2 > 80 ? 3 : co2 > 62 ? 2 : co2 > 48 ? 1 : 0
}

export function scramble(text: string, level: number) {
  const letters = [...text]
  if (letters.length < 3) return text
  for (let count = 0; count < level * 2; count++) {
    const index = 1 + Math.floor(Math.random() * (letters.length - 2))
    if (letters[index] === ' ' || letters[index + 1] === ' ') continue
    const letter = letters[index]
    letters[index] = letters[index + 1]
    letters[index + 1] = letter
  }
  return letters.join('')
}

export function describeStep(step: number, parts: Part[], level: number, t: Translate) {
  const required = assembly[step]
  return {
    request: required ? scramble(t(`FILTER.Part.${required}`).toUpperCase(), level) : t('FILTER.SealRequest'),
    parts: parts.map((id) => ({ id, label: scramble(t(`FILTER.Part.${id}`), level) })),
  }
}

export function createTray() {
  return shuffle([...assembly, 'cuchara', 'linterna'])
}
