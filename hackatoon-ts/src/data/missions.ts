export const missions = {
  fugas: {
    option: '¡Tapar las fugas!',
    detail: 'El casco se está perforando. Mantén tapados los agujeros antes de perder el oxígeno.',
    title: '¡La nave pierde aire!',
    instructions: 'Mantén pulsado cada agujero durante un momento para pegar un parche. Al soltar antes de tiempo, vuelve a escapar aire. Sella los 9 antes de quedarte sin oxígeno. Con ratón, ve uno por uno; en móvil puedes usar varios dedos.',
    success: '¡Cabina sellada!',
    failure: '¡Evacuación de emergencia!',
    successText: 'Todos los parches aguantan. La tripulación ya puede respirar tranquila.',
    failureText: () => 'BIP cerró la cabina para proteger el resto de la nave. Hay que reparar el casco antes de volver.',
    fact: 'En esta simulación, mantener tapada una fuga detiene la pérdida de aire mientras se fija el parche.',
    discovery: 'fuga',
    completion: 'parche',
  },
  polvo: {
    option: 'Limpiar los paneles',
    detail: 'Están cubiertos de polvo y dan cada vez menos energía. El filtro de aire se queda sin revisar.',
    title: '¡Limpia el panel!',
    instructions: 'Frota con el dedo. Pero ojo: el polvo se vuelve a pegar. Hay otra forma…',
    success: '¡Panel limpio!',
    failure: 'Se acabó el tiempo.',
    successText: 'Los paneles vuelven a rendir. Pero el filtro de aire se quedó otro día sin cambiar.',
    failureText: (cleanliness: number) => `Solo quedó limpio al ${Math.round(cleanliness * 100)}%. Y el filtro de aire sigue sin cambiar.`,
    fact: 'En 2021 la NASA limpió un panel del módulo InSight, en Marte, echándole arena encima. El viento arrastró los granos y estos tumbaron el polvo fino.',
    discovery: 'polvo',
    completion: 'arena',
  },
  filtro: {
    option: 'Cambiar el filtro de aire',
    detail: 'Lleva demasiadas horas de uso. Los paneles siguen sucios otro día.',
    title: '¡Arma el adaptador!',
    instructions: 'El repuesto es cuadrado y la ranura es redonda. Haz lo que BIP te dicte, antes de que el aire se ponga pesado.',
    success: '¡Adaptador sellado!',
    failure: 'El aire se puso irrespirable.',
    successText: 'El filtro cuadrado ya limpia el aire por la ranura redonda. Pero los paneles siguen sucios.',
    failureText: () => 'La tripulación se mareó antes de terminar. Y los paneles siguen sucios.',
    fact: 'En el Apolo 13, tres astronautas armaron este mismo adaptador con bolsas, cartón, cinta gris y una manguera, siguiendo instrucciones por radio. Le decían «el buzón».',
    discovery: 'co2',
    completion: 'buzon',
  },
} as const

export type Mission = keyof typeof missions
export const missionOptions = ['polvo', 'filtro', 'fugas'] as const satisfies readonly Mission[]
