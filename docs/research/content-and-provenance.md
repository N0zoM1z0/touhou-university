# Website Content and Asset Provenance

## Content architecture

1. **Hero / identity** — institutional identity, current notices and global
   language access, with a concise fan-work notice above the header.
2. **Campus services** — application, room availability, visit reservations,
   dining, schedules, examinations, map and BBS.
3. **School introduction and traditions** — mission, seven schools, motto,
   uniforms and anniversary.
4. **Faculty** — filterable illustrated roster with detailed teaching profiles.
5. **Admissions** — applicant routes, four-stage process, FAQ and an interactive
   locally saved application.
6. **Entrance examinations** — four timed question banks with local scoring,
   attempt history and complete answer explanations.
7. **Research** — complete in-world project files with methods, findings and
   field notes.
8. **Campus life and BBS** — original visual scenes, detailed clubs, rotating
   community news and locally saved community posts.
9. **Footer** — full rights and fan-work notice.

## Copy rules

- Traditional Chinese is the primary language; Japanese and English cover every
  public static string and all interactive data.
- Public institutional copy stays immersive. Editorial source and setting
  distinctions remain in research documentation.
- Numerical institutional data is internally consistent and intentionally
  imaginative.
- No long quotations from official works.
- No payment request, analytics, tracking or remote submission backend.
- Application, visitor and BBS records stay in browser local storage.

## Generated visual assets

All illustrations were generated specifically for this project on
2026-07-24 using the built-in OpenAI image generation tool. They do not use
official game sprites, screenshots, scans or another fan artist's work.

| File | Purpose | Prompt summary |
|---|---|---|
| `assets/images/campus-hero.webp` | home hero | panoramic fantasy university campus combining shrine, library, bamboo pavilion, observatory, lake and mountain |
| `assets/images/campus-hero-mobile.webp` | responsive hero derivative | 960 px web-optimised derivative of the original campus hero |
| `assets/images/library.webp` | campus life / library | twilight hybrid Gothic/Japanese reading room with anonymous students and magical index cards |
| `assets/images/kappa-lab.webp` | engineering field campus | mountain waterfall workshop with kappa-like engineers, copper instruments and hydropower |
| `assets/images/night-festival.webp` | student life | lantern festival with anonymous mixed-species students and geometric spell-card fireworks |
| `assets/images/uniforms.webp` | traditions / uniform | editorial catalogue scene showing summer and winter university uniforms with ink-navy fabric and vermilion cords |
| `assets/images/map/boundary-hall.webp` | map / Boundary Hall | broad red-roofed lecture hall where shrine architecture meets an academic cloister beneath a luminous barrier |
| `assets/images/map/hieda-history-hall.webp` | map / Hieda History Hall | quiet archival hall beside the Human Village with kura storehouses, paper windows and manuscript rooms |
| `assets/images/map/seven-day-laboratory.webp` | map / Seven-Day Laboratory | tall magical laboratory at twilight with seven elemental observatories and glowing experiment windows |
| `assets/images/map/eientei-clinic.webp` | map / Eientei Clinic | lantern-lit medical pavilion deep in a bamboo forest with a calm pharmacy and moon-viewing courtyard |
| `assets/images/faculty/faith-council.webp` | Faith & Coexistence faculty council | Byakuren, Kanako, Miko and Sanae disputing a festival-resource map in a weathered, taped-up seminar room with a donation box, obsolete cassette recorder, sake cups and rain-wrinkled notices |

### Campus map scene set — painted environmental cards

Prompt direction: cohesive wide environmental concept art for an immersive
university map, no characters as the focal point, painterly architectural
detail, restrained navy/vermilion/gold palette, no text, logo or watermark.
Generated in the image tool's default built-in mode.

Tool-owned PNG sources:

- Boundary Hall: `call_PyleKHpuomw57qXCXFiVELx8.png`
- Hieda History Hall: `call_tS0Ui0ov3WDMLTo0TSRcOh80.png`
- Seven-Day Laboratory: `call_3xZCIHQio5Yiszq7l2mnQ0TA.png`
- Eientei Clinic: `call_eFf9AbzWmAf0opr1CO4JaN6G.png`

### Faculty portrait set A — formal academic gouache

Files:

`assets/images/faculty/set-a/{reimu,yukari,keine,patchouli,marisa,eirin,nitori,aya}.webp`

Prompt direction: waist-up formal university portraits, restrained editorial
gouache and ink, parchment-toned backgrounds, character-recognisable clothing
and motifs, consistent academic framing, no text or watermark. This is the
active set in `site.config.mjs`.

Tool-owned PNG sources:

- Reimu: `call_v6aEt3x0vG8QwoZbjtNn68lV.png`
- Yukari: `call_DMm4Ut0nPvHDfjMrNcqC4rRt.png`
- Keine: `call_SiDeEPHldpFRgqdRid0aTgHM.png`
- Patchouli: `call_6cetWdCl8a2ovGCWHqVxkNAk.png`
- Marisa: `call_Vx8kIdLv74f3ZJY3hIiEu9Yf.png`
- Eirin: `call_jbdlwaXYWIWTFZarKf0QFAXr.png`
- Nitori: `call_AOBSlPsoSbHq4yOh3EvUSxiP.png`
- Aya: `call_U7kXeWvJqemqWIMu0ASqmjiS.png`

### Faculty portrait set B — graphic campus poster

Files:

`assets/images/faculty/set-b/{reimu,yukari,keine,patchouli,marisa,eirin,nitori,aya}.webp`

Prompt direction: bold cel-shaded and risograph-like campus poster portraits,
limited character-specific palettes, paper grain, sharp graphic silhouettes,
consistent crop, no text or watermark. The full roster can be activated with
`npm run portraits -- set-b`.

Tool-owned PNG sources:

- Reimu: `call_ZIAL6KzIrn4pvlRmqGDaiFIm.png`
- Yukari: `call_yv9lRSQOrQFqS9whJGcNTYHI.png`
- Keine: `call_nP6cnLbMbr42GsbF65OA0Zzy.png`
- Patchouli: `call_zICM1Kx6VAedYD7IyiovvjgC.png`
- Marisa: `call_VZRUsgFSfmZ8P776naUkv3Iv.png`
- Eirin: `call_5px3AvcxfAPZmXWPYYSwQ26T.png`
- Nitori: `call_qKOSjpHGe2mzYZxwUF8udDbx.png`
- Aya: `call_1CA9qseyQExJV75YGKacvFwK.png`

Uniform tool-owned PNG source:

`call_McLwbDjcTewvJyXP8CzVp7ks.png`

### Faith faculty council — lived-in institutional friction

File:

`assets/images/faculty/faith-council.webp`

Built-in image generation source:

`call_w72z7agtKPjRNneQbc3a7LYF.png`

Generation brief: an original wide ink, watercolor and gouache ensemble scene
of Byakuren Hijiri, Kanako Yasaka, Toyosatomimi no Miko and Sanae Kochiya
arguing over an oversized festival-allocation plan around a table that is too
small. The room was specified as a weathered shrine-side seminar space with
patched plaster, rain-stained windows, a worn donation box, obsolete cassette
recorder, empty sake cups, curled newspaper clippings, temporary notices and
kappa tape repairing both pipe and table leg. The prompt explicitly excluded
monumental architecture, pristine modern-campus surfaces, glossy concept-art
finish, perfect symmetry, legible generated text, logos and named-artist
imitation. Generated 2026-07-24 in the built-in image tool, then resized,
metadata-stripped and converted to 1536×1024 WebP at quality 82.

Shared constraints:

- original editorial gouache/ink composition;
- no named-artist imitation;
- no text, logos or watermark;
- no official character assets;
- no screenshots;
- PG community tone.

Generated PNGs were resized, metadata-stripped and converted to WebP for the
public repository. The tool-owned source copies remain under the local Codex
generated-images directory.

## Code provenance

The website is authored from scratch in semantic HTML, CSS and vanilla
JavaScript. It uses no front-end framework, analytics, trackers, remote
JavaScript, copied theme or icon package. Decorative symbols and the school seal
are code-native HTML/CSS/SVG.

## Release disclaimer

Recommended public wording:

> 本站為東方Project非官方二次創作，與上海愛麗絲幻樂團及 ZUN 無關。  
> Touhou Project 原作：ZUN（上海愛麗絲幻樂團）。
