# Puesto Sol 7 — Junior Astronaut Mission Trainer

We’re Josephs Unidos, and we built Puesto Sol 7 for the 2026 NASA Space Apps Challenge, “Build a Junior Astronaut Mission Trainer.” It’s a browser game for kids ages 7–12.

You have eight sols to run a small Moon outpost. Check the space weather, decide how to spend your energy, and play a short minigame to take care of one of the base’s systems. Finish five experiments and get your crew through the mission.

[Play Puesto Sol 7](https://puesto-sol-7.onrender.com/). On a phone, hold it upright. The speaker icon opens the language and volume controls. The game starts in English, and you can switch to Spanish there.

> En español. Tienes ocho soles para completar cinco experimentos y cuidar a tu tripulación. Abre el icono del altavoz para jugar en español o ajustar el volumen.

## How to play

1. **Preparation.** If the antenna has a signal, check the forecast. Spend energy on shielding, an experiment, or both. You can also save it for tomorrow.
2. **Routine.** The game offers the two most urgent tasks across power, life support, food and communications. Pick one. Dust builds up on neglected panels, the crew loses a heart after three sols without life-support maintenance, and the forecast stops coming after two sols without a successful antenna repair.
3. **Result.** The game checks for a particle storm. The panels recharge, the base spends one unit of energy on oxygen, and the crew eats one ration. An empty pantry costs the crew a heart.

The mission ends early if the crew runs out of hearts.

## Minigames and the real events behind them

| Minigame | What you do | Real event / fact |
|---|---|---|
| Clean the panels | Wipe off dust or drop sand when the wind picks up | NASA's InSight lander used sand and wind to clear dust from a solar panel in 2021. [NASA](https://www.nasa.gov/centers-and-facilities/jpl/nasas-insight-mars-lander-gets-a-power-boost/) |
| Change the air filter | Build the square-to-round adapter | Apollo 13 "mailbox" CO₂ scrubber adapter (1970) — [NASA](https://www.nasa.gov/image-article/putting-square-peg-round-hole) |
| Fit the patches | Rotate each patch until it fits the hole | 2 mm air leak in Soyuz MS-09, sealed with tape and epoxy (2018) — [NASA ISS blog](https://www.nasa.gov/blogs/spacestation/2018/08/30/international-space-station-status-3/) |
| Stop the leaks | Hold each hole until it seals | Fictional scenario (labeled in-game as "BIP's log") |
| Exercise | Jump over craters and let meteors pass overhead during a 20-second run | Astronauts average about two hours of exercise a day to protect bones and muscles. [NASA](https://www.nasa.gov/missions/station/iss-research/astronaut-exercise/) |
| Harvest on time | Tap each plant when its tomatoes are ripe | For Veg-05, astronauts grew dwarf Red Robin tomatoes on the ISS. [NASA Science](https://science.nasa.gov/biological-physical/investigations/veg-05-rjtim/) · [NASA technical report](https://ntrs.nasa.gov/citations/20240001505) |
| Point to Earth | Aim the antenna after a moonquake and send three messages | Earth stays in roughly the same part of the lunar sky. Apollo seismometers recorded 28 shallow moonquakes. [NASA StarChild](https://starchild.gsfc.nasa.gov/docs/StarChild/questions/question58.html) · [NASA moonquake report](https://www.nasa.gov/news-release/shrinking-moon-may-be-generating-moonquakes/) |

## Space weather data

The eight sols use a snapshot from October 3–10, 2026, retrieved from NASA DONKI on November 14, 2026. It includes solar flares (FLR), coronal mass ejection analyses (CMEAnalysis), geomagnetic storms (GST) and solar energetic particle events (SEP). Available forecasts link to DONKI or to the original flare record. [NASA DONKI](https://ccmc.gsfc.nasa.gov/tools/DONKI/) · [Data used by the game](hackatoon-ts/src/data/spaceWeather.ts)

The snapshot lists zero particle storms. In the game, the flare class sets the chance of a simulated storm. The end screen compares what happened during the mission with the NASA record. The game also models energy costs and crew health. [Simulation rules](hackatoon-ts/src/game/rules.ts)

## Balance

`npm run balance` runs 20,000 simulated missions for each strategy at each of three minigame win rates. It reports mission success, crew loss and unfinished science.

## Run locally

Use Node.js 22.18 or later in the 22.x series, or Node.js 24 or later.

```sh
cd hackatoon-ts
npm ci
npm run dev
```

Open the local URL Vite prints. Run `npm run build` for the production files in `hackatoon-ts/dist/` and `npm run lint` to check the code. The game uses React, TypeScript, Vite and Zustand. [Developer notes](hackatoon-ts/README.md)

## Credits

- **Game design, art direction and original drawings** (heart, astronaut, battery, oxygen tank, solar panels): Joseph Fernando Ruiz López.
- **Plant and pot sprites:** [FREE Pixel Art Flower Pack](https://karsiori.itch.io/free-pixel-art-flower-pack) by Karsiori — CC0 1.0.
- **Music and sound effects:** Freesound. See [LICENSE](LICENSE) for individual credits, source links and licenses.
- **Fonts:** Fredoka, Nunito and IBM Plex Mono (Google Fonts, SIL Open Font License).
- **Data:** NASA DONKI, plus the NASA sources linked above.

## Use of AI

We designed the game, drew the original sprites and tested the mission. Claude (Anthropic) wrote much of the code from our design, including some of the code-drawn scenery, and helped with the balance simulations, NASA research and documentation. Codex (OpenAI) helped implement translations and audio playback, resolve merge conflicts and edit the documentation.

## Team — Josephs Unidos

- Joseph Fernando Ruiz López
- Salvador Alejandro González Alvarado
- Antonio Maximiliano Sánchez Bolado

## License

The team’s original work is available under the MIT license. The full license text and third-party credits are in [LICENSE](LICENSE).
