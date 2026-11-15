# Puesto Sol 7 — Junior Astronaut Mission Trainer

A mobile-first browser game for kids ages 7–12, made for the **2026 NASA Space Apps Challenge** ("Build a Junior Astronaut Mission Trainer") by team **Josephs Unidos**.

You command a small outpost on the Moon for 8 days (sols). Every sol shows the **real space weather** that happened on that date, taken from NASA DONKI. You have little energy and you can never do everything: protect the crew from radiation, do science to complete the mission, or save power for tomorrow. Then you play a quick *Dumb Ways to Die*-style minigame based on something that really happened to astronauts.

**▶ Play: <https://puesto-sol-7.onrender.com/>** — no download, no account. Works best on a phone in portrait mode.

> Resumen en español: juego para niños de 7 a 12 años. Diriges una base en la Luna durante 8 soles; cada sol muestra el clima espacial real de NASA DONKI y decides en qué gastar la energía. Luego juegas un minijuego basado en un hecho real.

---

## How to play

Each sol has three steps:

1. **Preparation** — Read the real space-weather report for that day (flare class, plasma cloud speed, NASA alerts). Spend energy on **shielding** (the crew moves to the storm shelter), on an **experiment** (mission progress), on both, or save it.
2. **Routine** — The crew only has time for one of two tasks. Pick one and play its minigame. The task you skip has a cost: dirty solar panels charge less, and life support left unchecked for two sols hurts the crew.
3. **Result** — The game rolls whether a particle storm arrives, the panels recharge and the next sol begins.

**You win** by completing 5 experiments in 8 sols with the crew alive. **You lose** if the crew runs out of hearts, or if you protect yourself so much that the science never gets done. No choice is free.

## Minigames and the real events behind them

| Minigame | What you do | Real event / fact |
|---|---|---|
| Clean the panels | Rub the dust; use sand when the wind blows | NASA's InSight lander (Mars, 2021) cleaned a panel by trickling sand into the wind — [NASA](https://www.nasa.gov/centers-and-facilities/jpl/nasas-insight-mars-lander-gets-a-power-boost/) |
| Change the air filter | Build the square-to-round adapter | Apollo 13 "mailbox" CO₂ scrubber adapter (1970) — [NASA](https://www.nasa.gov/image-article/putting-square-peg-round-hole) |
| Fit the patches | Rotate each patch until it fits the hole | 2 mm air leak in Soyuz MS-09, sealed with tape and epoxy (2018) — [NASA ISS blog](https://www.nasa.gov/blogs/spacestation/2018/08/30/international-space-station-status-3/) |
| Stop the leaks | Hold each hole until it seals | Fictional scenario (labeled in-game as "BIP's log") |
| Exercise | Endless runner: jump craters, let meteors pass | Astronauts average about two hours of exercise a day to protect bones and muscles — [NASA](https://www.nasa.gov/missions/station/iss-research/astronaut-exercise) |
| Harvest on time | Tap each plant when its tomatoes are ripe | Veg-05: "Red Robin" dwarf tomatoes grown in the Veggie garden on the ISS (2022–2023) — [NASA](https://science.nasa.gov/biological-physical/investigations/veg-05) · [NTRS](https://ntrs.nasa.gov/citations/20240001505) |
| Point to Earth | Re-aim the antenna after a moonquake; watch the signal take ~1.3 s to reach Earth | Earth stays in about the same spot in the Moon's sky — [NASA StarChild](https://starchild.gsfc.nasa.gov/docs/StarChild/questions/question58.html); Apollo seismometers recorded 28 shallow moonquakes (1969–1977) — [NASA](https://www.nasa.gov/press-release/goddard/2019/Moonquakes) |

## NASA data used

**Space weather — NASA DONKI** (Space Weather Database Of Notifications, Knowledge, Information)

- **What:** solar flares (FLR), coronal mass ejection analyses (CMEAnalysis), geomagnetic storms (GST) and solar energetic particle events (SEP) from **October 3–10, 2026**, retrieved on November 14, 2026 from `https://ccmc.gsfc.nasa.gov/DONKI-API/get/`.
- **How:** each of the 8 sols is one of those real days. The real flare class (B, C, M, X) sets how risky it is to skip shielding that day, and the in-game report shows the flare, the plasma cloud speed (with its travel time to the Moon) and the number of NASA alerts. Every report links to the original DONKI event.
- **Stored, not live.** The game says so on screen. All values live in [`hackatoon-ts/src/data/spaceWeather.ts`](hackatoon-ts/src/data/spaceWeather.ts).
- **What is game design, not NASA data:** the storm probabilities, energy costs and hearts (in [`hackatoon-ts/src/game/rules.ts`](hackatoon-ts/src/game/rules.ts)). In the real week, DONKI recorded **no** particle storms; the end screen tells players this and explains why crews still take shelter after every alert.

The other facts in the game (exercise, Veggie, moonquakes, Apollo 13, InSight, Soyuz MS-09) are linked in the table above.

## Balance

`npm run balance` (inside `hackatoon-ts/`) plays 20,000 automated games per strategy. The rules are tuned so that neither "always protect" nor "never protect" wins consistently — only deciding with the forecast does.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
cd hackatoon-ts
npm ci
npm run dev
```

`npm run build` creates the production build in `hackatoon-ts/dist/`.

Built with React, TypeScript, Vite and Zustand.

## Credits

- **Game design, art direction and original drawings** (heart, astronaut, battery, oxygen tank, solar panels): Joseph Fernando Ruiz López.
- **Plant and pot sprites:** [FREE Pixel Art Flower Pack](https://karsiori.itch.io/free-pixel-art-flower-pack) by Karsiori — CC0 1.0.
- **Fonts:** Fredoka, Nunito and IBM Plex Mono (Google Fonts, SIL Open Font License).
- **Data:** NASA DONKI, plus the NASA sources linked above.

## Use of AI

We used **Claude** (Anthropic), an AI assistant, during development. It wrote most of the source code following the team's design decisions, ran the balance simulations, looked up and verified data against NASA sources, and drafted documentation. The team decided the concept, the game design and every gameplay choice, made the original drawings, tested the game and reviewed all content. Some simple in-game graphics (the Moon base scene, the sun, craters, meteors, the antenna) are drawn with code written by the AI. No AI-generated images, audio or video are used.

## Team — Josephs Unidos

- Joseph Fernando Ruiz López
- Salvador Alejandro González Alvarado
- Antonio Maximiliano Sánchez Bolado

## License

[MIT](LICENSE) for the team's original work. Third-party materials keep their own licenses (see [LICENSE](LICENSE)).
