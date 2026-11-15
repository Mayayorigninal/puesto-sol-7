# Puesto Sol 7 — código del juego

Puesto Sol 7 es un juego de navegador para el reto **Build a Junior Astronaut Mission Trainer** de NASA Space Apps 2026. En el [README principal](../README.md) están las reglas, las fuentes de la NASA y los créditos.

## Ejecutar

Desde `hackatoon-ts/`, usa Node.js 22.18 o posterior de la serie 22.x, o Node.js 24 en adelante.

```sh
npm ci
npm run dev
```

Abre la dirección que imprima Vite. `npm run lint` revisa el código y `npm run build` genera la versión de producción en `dist/`.

## Cómo se juega

1. **Preparación.** Si la antena tiene señal, revisa el pronóstico. Puedes gastar energía en blindaje, en un experimento o en ambos. También puedes guardarla para el día siguiente.
2. **Rutina.** Elige una de las dos tareas más urgentes de la base. Pueden ser de energía, soporte vital, comida o comunicaciones. Cada tarea tiene su minijuego.
3. **Resultado.** El juego comprueba si hubo tormenta, recarga los paneles y descuenta la energía para producir oxígeno y una ración para alimentar a la tripulación.

Ganas si completas cinco experimentos en ocho soles y la tripulación sigue viva.

## Datos y simulación

El juego usa una copia de los datos de NASA DONKI del 3 al 10 de octubre de 2026. Los registros y enlaces están en [spaceWeather.ts](src/data/spaceWeather.ts). Las probabilidades de tormenta, los costos de energía y el daño a la tripulación se definen en [rules.ts](src/game/rules.ts).

`npm run balance` simula 20 000 partidas por estrategia para cada una de tres tasas de éxito en los minijuegos. Al final muestra cuántas misiones se completaron, cuántas perdieron a la tripulación y cuántas quedaron sin terminar los experimentos.

## Traducciones

El juego arranca en inglés. Puedes cambiar a español desde **Volumen e idioma** (el icono del altavoz, junto a los recursos). El navegador recuerda la elección.

Los catálogos están en `src/i18n/EN/En.json` y `src/i18n/ES/Es.json`. Usa la misma clave en ambos archivos. En React, llama a `useTranslation()` y usa `t('SHIP.parches.WinText')` para obtener el texto. Para valores variables, escribe `{{percent}}` en el JSON y pásalo como `{ percent }` al llamar a `t`.

## Estructura

- `src/components` contiene las pantallas y los componentes compartidos.
- `src/data` contiene el clima espacial y los identificadores de misiones y fichas.
- `src/i18n` reúne los catálogos y la selección de idioma.
- `src/game` contiene las reglas, las fases de la misión y la lógica de los minijuegos.
- `src/store` guarda la partida y los ajustes en el navegador.
- `src/styles` contiene los estilos.
- `scripts/balance.ts` ejecuta el simulador.

La licencia del proyecto y los créditos del arte, la música y los efectos están en [LICENSE](../LICENSE).
