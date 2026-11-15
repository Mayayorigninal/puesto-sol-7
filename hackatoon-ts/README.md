# Puesto Sol 7 — código del juego

> La descripción completa del proyecto, los datos de la NASA, los créditos y el uso de IA están en el [README principal](../README.md).

Juego para el reto **Build a Junior Astronaut Mission Trainer** (NASA Space Apps Challenge 2026).
Diriges un puesto en la Luna durante 8 soles. Cada sol ves el **clima espacial real** de ese día y decides en qué gastar la energía: en blindaje (seguridad) o en experimentos (avanzar la misión). Nunca alcanza para todo.

## Ejecutar

```sh
npm ci
npm run dev
```

Abre la dirección que imprima Vite.

## Cómo se juega

Cada sol tiene tres pasos:

1. **Preparación.** Ves el reporte de clima espacial y gastas energía en blindaje, en un experimento, en los dos o en nada.
2. **Rutina.** Eliges una de dos tareas y juegas su minijuego: limpiar los paneles (da energía) o dar mantenimiento al soporte vital (cuida a la tripulación). La que no eliges se queda sin hacer.
3. **Resultado.** Se resuelve si llegó una tormenta de partículas, los paneles cargan energía y pasas al siguiente sol.

Ganas si completas **5 experimentos** en los 8 soles con la tripulación viva. Pierdes si la tripulación se queda sin corazones, o si llegas al final sin la ciencia.

## Datos de la NASA

- **Qué usamos:** fulguraciones solares (FLR), eyecciones de masa coronal (CMEAnalysis), tormentas geomagnéticas (GST) y tormentas de partículas (SEP) del **3 al 10 de octubre de 2026**, tomadas de [NASA DONKI](https://ccmc.gsfc.nasa.gov/tools/DONKI/) el 14 de noviembre de 2026. Están en `src/data/spaceWeather.ts`, con el enlace de cada evento.
- **Para qué:** cada sol del juego es uno de esos días. La clase real de la fulguración decide qué tan arriesgado es no activar el blindaje.
- **Son datos guardados, no en vivo.** El juego lo dice en pantalla.
- **Qué NO es dato de la NASA:** las probabilidades de tormenta, los costos de energía y los corazones son diseño del juego (`src/game/rules.ts`). En esa semana real DONKI no registró ninguna tormenta de partículas; el juego lo cuenta en la pantalla final.

## Traducciones

El juego arranca en inglés. Puedes cambiar a español desde **Volumen e idioma** (el icono del altavoz, junto a los recursos). El navegador recuerda la elección.

Los catálogos están en `src/i18n/EN/En.json` y `src/i18n/ES/Es.json`. Usa la misma clave en ambos archivos. En React, llama a `useTranslation()` y usa `t('SHIP.parches.WinText')` para obtener el texto. Para valores variables, escribe `{{percent}}` en el JSON y pásalo como `{ percent }` al llamar a `t`.

## Balance

`npm run balance` juega 20,000 partidas automáticas por estrategia. La meta es que ni «protegerse siempre» ni «nunca protegerse» ganen seguido, y que decidir con criterio sí.

## Estructura

- `src/components` — vistas (Preparación, Rutina, Resultado, Final) y piezas compartidas.
- `src/data` — datos de clima espacial e identificadores de misiones y fichas.
- `src/i18n` — catálogos y selección de idioma.
- `src/game` — reglas (`rules.ts`), fases de la misión (`missionState.ts`) y la lógica de cada minijuego.
- `src/store` — estado con Zustand (la partida se guarda en el navegador).
- `src/styles` — estilos.
- `scripts/balance.ts` — simulador de balance.

`npm run lint` revisa el código y `npm run build` compila la aplicación.

## Créditos de arte

- Corazón, astronauta, batería, tanque de O₂ y paneles solares: dibujos originales de Joseph Ruiz.
- Plantas y macetas del invernadero: [FREE Pixel Art Flower Pack](https://karsiori.itch.io/free-pixel-art-flower-pack) de Karsiori, licencia CC0 (ver `public/assets/granja/LICENCIA.txt`).
