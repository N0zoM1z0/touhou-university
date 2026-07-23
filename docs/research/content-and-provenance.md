# Website Content and Asset Provenance

## Content architecture

1. **Hero / identity** — immediately states that the university is fictional and
   the site is an unofficial fan work.
2. **School introduction** — mission, three principles, world map concept and
   AU status.
3. **Faculties** — filterable roster grounded in character anchors.
4. **Admissions** — applicant routes, four-stage process, FAQ and non-functional
   “download” interaction for a fictional prospectus.
5. **Research** — fictional projects with explicit AU framing.
6. **Campus life** — original visual scenes and student clubs.
7. **News / footer** — current-looking institutional polish without pretending
   to be an official publication.

## Copy rules

- Traditional Chinese is the primary language.
- Japanese names appear for identity and atmosphere, not to imply an official
  Japanese release.
- Numerical “facts” are deliberately whimsical and marked as AU/internal data.
- No long quotations from official works.
- No false real-world application form, payment request or collection of
  personal data.
- Links to admissions content remain within the page; email addresses use
  reserved `.example` domains.

## Generated visual assets

All four illustrations were generated specifically for this project on
2026-07-24 using the built-in OpenAI image generation tool. They do not use
official game sprites, screenshots, scans or another fan artist's work.

| File | Purpose | Prompt summary |
|---|---|---|
| `assets/images/campus-hero.webp` | home hero | panoramic fantasy university campus combining shrine, library, bamboo pavilion, observatory, lake and mountain |
| `assets/images/library.webp` | campus life / library | twilight hybrid Gothic/Japanese reading room with anonymous students and magical index cards |
| `assets/images/kappa-lab.webp` | engineering field campus | mountain waterfall workshop with kappa-like engineers, copper instruments and hydropower |
| `assets/images/night-festival.webp` | student life | lantern festival with anonymous mixed-species students and geometric spell-card fireworks |

Shared constraints:

- original editorial gouache/ink composition;
- no named-artist imitation;
- no text, logos or watermark;
- no official character portrait;
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

