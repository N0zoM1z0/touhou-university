# 幻想鄉立東方大學

An immersive, responsive university portal for Gensokyo.

> 本站為東方Project非官方二次創作，與上海愛麗絲幻樂團及 ZUN 無關。  
> Touhou Project 原作：ZUN（上海愛麗絲幻樂團）。

Live site: <https://n0zom1z0.github.io/touhou-university/>

## Included

- school introduction, motto, traditions, uniforms and anniversary;
- seven schools and eight illustrated faculty profiles;
- Traditional Chinese, Japanese and English language switching;
- online application with saved drafts and application references;
- campus-visit reservations and visitor references;
- library/classroom availability, dining menus, timetable and exams;
- illustrated interactive campus map with seven place cards;
- four complete Gensokyo research records;
- four timed entrance-exam banks with instant scoring and answer review;
- rotating campus news, detailed clubs and a locally persistent, shuffled BBS;
- responsive navigation, keyboard-friendly dialogs and reduced-motion support;
- two interchangeable faculty portrait art directions.

All interactive records stay in the visitor's browser. This static GitHub Pages
site has no analytics, trackers, remote JavaScript or submission backend.

## Project structure

```text
src/
  data/       translated faculty, research, service and interface content
  js/         independent interaction modules
  sections/   page partials, one institutional section per file
  styles/     base and feature-specific stylesheets
scripts/      build, preview, validation, scaffolding and asset helpers
index.html    generated GitHub Pages artifact
styles.css    generated GitHub Pages artifact
site.config.mjs
```

Edit `src/`, not the generated `index.html` or `styles.css`.

## Common commands

No package installation is required; the build uses Node.js standard-library
modules only.

```bash
npm run dev                 # rebuild on change and serve at localhost:4173
npm run build               # generate index.html and styles.css
npm run check               # build + i18n coverage + JS syntax
npm run test:browser        # headless Chrome interaction and mobile smoke test
npm run capture -- --section=map --width=390 --height=844
npm run new:section -- news # scaffold and register a new section
npm run portraits -- set-b  # switch the active faculty art direction
scripts/optimize-images.sh input.png output.webp 1600x1200
```

Set a different preview port with `PORT=4180 npm run dev`.

### Adding content

- Add or revise faculty, research and campus-service records in `src/data/`.
- Add exam banks and questions in `src/data/exam.js`; every question stores all
  three languages beside its answer and explanation.
- Add news/BBS seeds in `src/data/community.js`, and club details in
  `src/data/campus.js`.
- Add page structure in `src/sections/`.
- Add feature logic as a focused module in `src/js/` and import it from
  `src/js/main.js`.
- Add styles to the relevant file under `src/styles/`.
- Add every new public string to `src/data/i18n.js`; `npm run check:i18n`
  reports untranslated static copy.
- Register new sections and styles in `site.config.mjs`.

## Research and provenance

Working research is kept in `../research/`, with a release copy under
`docs/research/`. It records the source hierarchy, character mapping, editorial
boundaries, fan-work guideline review and generated-image provenance.

## Rights

- Website code: MIT License.
- Original generated illustrations: created for this project; see
  `docs/research/content-and-provenance.md`.
- Touhou Project and its characters/settings belong to their respective rights
  holders. No official game assets are included.
