// Clima espacial REAL del 3 al 10 de octubre de 2026.
// Fuente: NASA DONKI (Space Weather Database Of Notifications, Knowledge, Information),
// consultado el 14 de noviembre de 2026 en https://ccmc.gsfc.nasa.gov/DONKI-API/get/
// (endpoints FLR, CMEAnalysis, GST y SEP). Son datos guardados, no en vivo.
//
// - flare: la fulguración más intensa del día (clase de rayos X medida por GOES).
// - cmeSpeed: velocidad (km/s) de la eyección de masa coronal más rápida que salió ese día.
// - kp: índice Kp máximo de la tormenta geomagnética de ese día (escala 0–9), si la hubo.
// - alerts: avisos oficiales enviados ese día por la oficina Moon to Mars de la NASA.
// En toda la semana DONKI no registró ninguna tormenta de partículas (SEP).

export const donkiCredit = 'Clima espacial real · NASA DONKI · 3–10 oct 2026 · datos guardados, no en vivo'
export const donkiUrl = 'https://ccmc.gsfc.nasa.gov/tools/DONKI/'
export const sepEventsInWeek = 0

export type SolWeather = {
  sol: number
  date: string
  fecha: string
  flare: string | null
  flareLink: string | null
  cmeSpeed: number | null
  kp: number | null
  alerts: number
}

export const spaceWeather: readonly SolWeather[] = [
  { sol: 1, date: '2026-10-03', fecha: '3 oct 2026', flare: null, flareLink: null, cmeSpeed: null, kp: null, alerts: 0 },
  { sol: 2, date: '2026-10-04', fecha: '4 oct 2026', flare: 'B9.3', flareLink: 'https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/48957/-1', cmeSpeed: 336, kp: 5.67, alerts: 2 },
  { sol: 3, date: '2026-10-05', fecha: '5 oct 2026', flare: 'M1.0', flareLink: 'https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/48985/-1', cmeSpeed: 701, kp: null, alerts: 0 },
  { sol: 4, date: '2026-10-06', fecha: '6 oct 2026', flare: 'M1.8', flareLink: 'https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/48987/-1', cmeSpeed: 573, kp: null, alerts: 0 },
  { sol: 5, date: '2026-10-07', fecha: '7 oct 2026', flare: 'C7.9', flareLink: 'https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/49010/-1', cmeSpeed: 310, kp: null, alerts: 0 },
  { sol: 6, date: '2026-10-08', fecha: '8 oct 2026', flare: 'M6.7', flareLink: 'https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/49015/-1', cmeSpeed: 868, kp: null, alerts: 2 },
  { sol: 7, date: '2026-10-09', fecha: '9 oct 2026', flare: 'M1.3', flareLink: 'https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/49045/-1', cmeSpeed: 391, kp: null, alerts: 0 },
  { sol: 8, date: '2026-10-10', fecha: '10 oct 2026', flare: 'M6.4', flareLink: 'https://ccmc.gsfc.nasa.gov/DONKI/view/FLR/49057/-1', cmeSpeed: 844, kp: 7, alerts: 4 },
]

/** Distancia media del Sol a la Tierra y la Luna, en km. */
const sunDistanceKm = 149_600_000

/** Horas que tarda en llegar una nube de plasma que viaja a `speed` km/s (velocidad constante). */
export function cmeTravelHours(speed: number) {
  return Math.round(sunDistanceKm / speed / 3600)
}
