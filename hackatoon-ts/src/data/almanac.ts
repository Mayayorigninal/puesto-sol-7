export const calendar = [
    { sol: 1, fecha: "3 oct 2026",  clase: "tranquilo",   flr: null },
    { sol: 2, fecha: "4 oct 2026",  clase: "tranquilo",   flr: "B9.3" },
    { sol: 3, fecha: "5 oct 2026",  clase: "fulguracion", flr: "M1.0" },
    { sol: 4, fecha: "6 oct 2026",  clase: "fulguracion", flr: "M1.8" },
    { sol: 5, fecha: "7 oct 2026",  clase: "tranquilo",   flr: "C7.9" },
    { sol: 6, fecha: "8 oct 2026",  clase: "tormenta",    flr: "M6.7" },
    { sol: 7, fecha: "9 oct 2026",  clase: "fulguracion", flr: "M1.3" },
    { sol: 8, fecha: "10 oct 2026", clase: "tormenta",    flr: "M6.4" }
  ] as const

export const milestones = [
    { id: "fuga", title: "¡Tenemos una fuga!", description: "El casco de la cabina perdió su sello. Cada agujero abierto reduce el oxígeno disponible en el minijuego.", source: "Bitácora del Puesto Sol 7" },
    { id: "parche", title: "Reparación de emergencia", description: "Mantener presionado un parche permite fijarlo. Si lo sueltas antes de tiempo, la fuga vuelve a abrirse.", source: "Manual de BIP · simulación" },
    { id: "polvo", title: "Polvo lunar", description: "No es tierra normal: es vidrio molido. Como en la Luna no hay viento ni agua, cada granito sigue teniendo filos. Se pega con electricidad estática, por eso si lo frotas vuelve.", source: "NASA — misiones Apolo" },
    { id: "arena", title: "Limpiar con arena", description: "En Marte, el módulo InSight se estaba quedando sin energía por el polvo. La solución fue echarle arena encima: el viento arrastró los granos gruesos y estos tumbaron el polvo fino.", source: "NASA/JPL — misión InSight, 2021" },
    { id: "co2", title: "El aire que exhalas", description: "Lo peligroso no es quedarte sin oxígeno: es que el aire que sacas (CO₂) se quede contigo. Y antes de hacerte daño te pone torpe y con sueño.", source: "NASA — soporte vital" },
    { id: "buzon", title: "El buzón del Apolo 13", description: "Los filtros de repuesto eran cuadrados y la ranura era redonda. Los astronautas armaron un adaptador con bolsas, cartón, cinta gris y una manguera, siguiendo instrucciones por radio.", source: "NASA — Apolo 13, abril de 1970" }
  ] as const

export type Milestone = (typeof milestones)[number]['id']
