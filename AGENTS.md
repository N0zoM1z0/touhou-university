# Touhou University — Codex entry point

This file applies to the complete Git repository. It is deliberately short:
durable architecture and domain rules live in the linked handbook instead of
being hidden in one ever-growing instruction wall.

## Read before editing

Read in this order:

1. [Current state](docs/CURRENT_STATE.md) — the release, page map, live counts,
   authoritative sources and known boundaries.
2. [Agent handbook](docs/AGENT_HANDBOOK.md) — architecture, data ownership,
   i18n, persistence, routes, testing, campus history and deployment.
3. [Domain rules](docs/AGENT_DOMAIN_RULES.md) — read only the sections relevant
   to the feature being touched.
4. [Research index](docs/research/README.md) — editorial/source notes; do not
   load every research file for an unrelated code change.
5. [Implementation history](docs/ROADMAP.md) and [changelog](CHANGELOG.md) only
   when release history or future direction matters.

Source code and validators outrank stale prose. When a documented count or
route disagrees with current source, investigate and update the documentation
in the same change; never choose the nicer-looking number.

## Non-negotiable product rules

- The public site is an immersive, convincing university inside Gensokyo—not a
  generic university template and not a joke page. Institutional order and
  Touhou character trouble must remain in productive conflict.
- Ordinary public copy must not say “AU”, “canon anchor”, “fictional project”,
  “not official setting”, or similar immersion-breaking editorial language.
  Keep the short fan-work notice in the header and the full notice in the
  footer; keep source distinctions inside `docs/research/`.
- Every public feature ships in Traditional Chinese (`zh-Hant`), Japanese
  (`ja`) and English (`en`) in the same change.
- This is a static GitHub Pages site. User records remain on the visitor's
  device; do not add analytics, trackers, remote JavaScript, real-data
  collection or a backend without explicit permission.
- Preserve characters' inconvenient motives. Aya may create the correction
  problem, Marisa may have excellent experiments and terrible provenance,
  Yukari may make the rule boundary unreliable, and competing faiths do not
  become one agreeable faculty committee.
- Do not reproduce official game assets, scripts, endings, screenshots, music,
  scans, or another fan creator's work. Record generated-asset provenance and
  never imitate a named living artist.

## Non-negotiable engineering rules

- Author in `src/`, `site.config.mjs`, `scripts/` and documentation. Root
  `*.html`, `styles.css`, `styles-*.css` and `downloads/gaokao/` are generated
  artifacts; regenerate them with `npm run build` rather than hand-editing.
- New lifecycle systems use four layers: trilingual source data, a
  version-tolerant local model/store, official causal events when appropriate,
  and a focused UI renderer. Do not create another monolithic `index.html` or
  one-off all-in-one script.
- Cross-feature Search/BBS capabilities belong in `src/js/domain-registry.js`.
  Official events belong in `src/data/event-contracts.js`. Hieda is a
  projection of owning domains, never a second source of truth.
- Every durable `tu:` storage key must be registered in
  `src/data/local-records.js`. Never silently clear or rewrite older browser
  records during an ordinary UI change.
- Preserve exact shareable routes, browser Back behaviour, focus and scroll
  through local rerenders. Use the shared render-state, IME, deep-link and
  print-document helpers described in the handbook.
- PHANTASM is isolated dream state: no primary-navigation link, no direct gate
  bypass, and no dream event or credit may enter the official campus ledger.
- Never confuse a first-parent `main` commit, a merge commit and its second
  parent. Follow the campus-history procedure in the handbook before commit.

## Working loop

1. Start with `git status -sb`; preserve unrelated user changes.
2. Run `npm run docs:status` to see source-derived project counts.
3. Read the owning data/model/UI modules and focused research note.
4. Make source changes; build generated artifacts with `npm run build`.
5. Run the narrow validator, `npm run check:docs`, then broader checks in
   proportion to risk. Real interaction changes require `npm run test:browser`.
6. Use `npm run capture -- ...` for desktop/mobile visual inspection.
7. Update `CHANGELOG.md`, `docs/CURRENT_STATE.md` when its snapshot changes,
   relevant research/provenance, and the living campus-history entry.
8. If asked to publish: commit intentionally, push `main`, wait for GitHub
   Pages, and verify the production URL and representative assets.

Useful commands and the complete ownership matrix are in
[docs/AGENT_HANDBOOK.md](docs/AGENT_HANDBOOK.md).
