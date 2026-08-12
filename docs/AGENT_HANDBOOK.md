# Touhou University agent handbook

This is the operational manual for a fresh coding agent. Product invariants
are in the repository [AGENTS.md](../AGENTS.md); current counts and page
ownership are in [CURRENT_STATE.md](CURRENT_STATE.md); detailed domain-specific
rules are in [AGENT_DOMAIN_RULES.md](AGENT_DOMAIN_RULES.md).

## 1. First ten minutes

```bash
git status -sb
npm run docs:status
npm run check:docs
```

Then inspect only the owning feature files. Do not begin by reading every
module or every research note. Existing uncommitted changes belong to the user
unless proven otherwise.

For a normal feature, identify:

- the page entry in `site.config.mjs`;
- the HTML partial in `src/sections/`;
- the trilingual source data in `src/data/`;
- the pure/persistent model in `src/js/*-model.js` when applicable;
- the focused UI module in `src/js/` and its initializer in `src/js/main.js`;
- its domain manifest, event contracts, local-record registrations, Hieda
  references and focused validator;
- its research note and generated-asset provenance, if content/art changes.

## 2. Build architecture

The project is dependency-free semantic HTML, CSS and vanilla JavaScript with a
Node standard-library build.

```text
src/index.template.html     shared page shell
src/sections/*.html         authored institutional sections
src/styles/*.css            authored core/feature styles
src/data/*.js               trilingual records and deterministic rules
src/js/*.js                 models, stores, renderers and shared controllers
site.config.mjs             page/section/style/preload registry
scripts/build.mjs           generates root HTML and CSS bundles
scripts/build-gaokao-*.mjs  generates 48 offline papers/answers
*.html, styles*.css         committed generated GitHub Pages artifacts
downloads/gaokao/           committed generated examination artifacts
```

The forty-eight downloads are the eight ordinary humanities/science papers.
The single PHANTASM common reverse paper is deliberately rendered and printed
only inside the opened dream campus; it is not a ninth admissions download.

Never make a substantive fix only in generated HTML/CSS. Edit source, run
`npm run build`, and commit both the source and regenerated artifacts.

New deep institutional features belong on the appropriate subpage. Do not
grow `index.html` back into a single monolith. Register new pages, section order
and the smallest relevant CSS subset in `site.config.mjs`.

## 3. Data ownership and projections

Student-lifecycle features normally use four layers:

1. standalone trilingual source data under `src/data/`;
2. version-tolerant persistence and pure rules in a model/store module;
3. structured, deduplicated official lifecycle events;
4. a focused UI renderer using shared interaction helpers.

The owner stores facts. Other systems project them:

```text
owning data/store
├── focused feature UI
├── campus ledger → My TU timeline
├── domain registry → Search and derived BBS
├── Tengu Post or live-campus notices when relevant
├── local records cabinet
└── Hieda source reference and red-thread annotation
```

Never write derived BBS/news/search/Hieda records into the visitor-authored
store. Never copy another domain's truth into a convenient second checklist.

### Official events

Every `recordCampusEvent` type must have exactly one contract in
`src/data/event-contracts.js`. Schema-2 events require a stable subject,
correlation ID, payload IDs and, where applicable, an allowed earlier cause.
Run `npm run check:contracts` after producer, payload or lifecycle changes.
PHANTASM never receives an official event contract. This includes its reverse
examination: eligibility may read a completed ordinary EXTRA attempt, but its
draft and result remain dream records and never become official assessment.

### On-device records

Every durable `tu:` localStorage/sessionStorage key belongs in
`src/data/local-records.js` in the same change. Stores must tolerate older
records and preserve completed history rather than silently replacing it.
The records cabinet owns lossless export/import/delete; individual features own
normalisation and migration. `tu:phantasm:pass` is the sole non-portable session
record.

### Hieda and domain registry

`src/js/domain-registry.js` is the single capability list for Search and BBS.
`src/data/knowledge-graph.js` contains stable `{ type, id }` leaves and short
annotations only; titles/details/routes resolve from original domains at render
time. Run `npm run check:knowledge` when extending it.

## 4. Three-language content

- Supported locales are `zh-Hant`, `ja`, and `en`.
- Stable shell/control text uses explicit keys in `src/data/i18n.js` plus
  readable Traditional Chinese fallback markup and `data-i18n` attributes.
- Domain records carry `{ "zh-Hant", ja, en }` values together.
- The old Chinese text-node lookup is migration fallback only. Do not create
  punctuation-coupled keys or translate user-authored application/BBS text.
- Translate labels, validation, empty/error states, ARIA text, placeholders,
  image alternatives, print copy and dynamic replies in the same change.

Run `npm run check:i18n`. A translation is incomplete if the happy path is
translated but error, saved-record or mobile text is not.

## 5. Interaction, routes and rendering

Route ownership lives in `src/js/site-router.js`; registered overlays and
focused records live in `src/js/deep-links.js`. Preserve canonical page URLs,
old `index.html#...` redirects, stable hashes, browser Back and exact source
scroll positions.

For self-rerendering views:

- use `src/js/render-state.js`;
- mark internal scroll regions with `data-preserve-scroll`;
- mark restorable controls with `data-preserve-focus`;
- use `src/js/ime-input.js` for filters that rerender, so Chinese/Japanese IME
  composition is not destroyed;
- re-resolve dynamic deep-link nodes after each render rather than retaining a
  detached element reference;
- use `event.target === dialog` for backdrop closing so native `<select>`
  popovers are not mistaken for outside clicks.

All links and assets remain relative for the `/touhou-university/` Pages base.

## 6. Print, time and performance

Printable records use `src/js/print-document.js`, which clones the rendered
document into a body-level `.tu-print-root`. Do not attempt to print a hidden
nested dialog.

Operational time comes from an explicit `Date` through
`src/data/live-campus.js` and shared time helpers. Date, three-hour duty slot,
moon and academic-calendar layer must produce deterministic state for every
consumer. Restrictions must change routes, modes, rooms or records—not merely
status prose.

Keep heavy images lazy except intentional hero/preload assets. Optimise project
images, record provenance and inspect actual desktop/mobile output. Do not add a
front-end framework or remote runtime for a feature that fits the existing
architecture.

## 7. Validation matrix

Use the smallest useful check while developing, then widen before handoff.

```bash
npm run build               # regenerate 19 pages, CSS and offline exams
npm run check:docs          # documentation/source agreement
npm run check:<domain>      # focused data/model/route contracts
npm run check               # complete static/data/relationship/history suite
npm run test:browser        # real Chrome interactions and 390px smoke flow
```

Interaction changes, route/history changes, forms, persistence, printing,
dynamic rerenders and mobile UI require `npm run test:browser`. Static checks
should validate data and contracts, not duplicate browser behaviour with string
searches.

Visual inspection:

```bash
npm run capture -- --page=campus.html#map --section=map --width=390 --height=844
npm run capture -- --page=careers.html#employment-job-board \
  --section=employment-job-board --width=1440 --height=1200
```

`--click='selector;;selector'` performs ordered clicks; `--storage='<json>'`
seeds browser records. The capture tool waits for dynamically rendered section
targets.

## 8. Living campus history

`src/data/campus-history.js` maps every first-parent `main` commit to one rich
trilingual campus consequence.

The fields are not interchangeable:

- `commit`: exact SHA from `git log --first-parent main`;
- `commitSubject`: exact subject of that same first-parent commit;
- `changeCommit`/`changeSubject`: only the second parent of a mechanical
  multi-parent merge, never a replacement for canonical history;
- squash merge: the squash commit on `main` is canonical; the old PR/local head
  is not `changeCommit`.

Before committing:

1. Synchronise/inspect `main` and run
   `git log --first-parent -1 --format='%H%n%P%n%s' main`.
2. Backfill the previous planned entry with that exact SHA/subject and remove
   `planned`.
3. Add one new `planned: true`, `commit: null` entry whose `commitSubject`
   exactly matches the intended commit/PR title.
4. Write an immersive three-language consequence and marginal note; do not
   expose raw Git prose as the public story.
5. Commit with the exact subject and run `npm run history:status`.

After the commit exists on first-parent `main`, the checker may resolve the
planned entry. A later change backfills the stored SHA. Never guess a main SHA
from a feature branch or confuse it with a merge second parent.

## 9. Documentation and research

- `docs/CURRENT_STATE.md`: compact audited snapshot; source-derived numbers are
  enforced by `check:docs`.
- `AGENTS.md`: short non-negotiable entry point.
- `docs/AGENT_HANDBOOK.md`: cross-cutting implementation procedure.
- `docs/AGENT_DOMAIN_RULES.md`: durable feature-specific invariants.
- `docs/ROADMAP.md`: completed implementation batches plus explicitly labelled
  future directions, not an active task queue.
- `CHANGELOG.md`: user-visible release changes.
- `docs/research/`: canonical release research/provenance notes.
- optional `../research/`: working mirror; keep byte-identical when present.

Public copy is immersive. Internal research may distinguish canon anchors,
project-original institution design and fallible in-world claims.

## 10. Release and deployment

For an explicitly requested publication:

1. update version and `CHANGELOG.md`;
2. run `npm run check` and risk-appropriate browser/visual checks;
3. run `git diff --check`, inspect scope and commit intentionally;
4. push `main`;
5. wait for the `pages-build-deployment` run to succeed;
6. verify the live canonical page, representative deep links and new assets;
7. report the deployed commit and any relevant local documentation paths.

Do not create a GitHub Release tag unless the user asks for one. Repository
topics such as `touhou` are different from Git tags.
