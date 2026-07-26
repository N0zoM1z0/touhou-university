# 幻想鄉立東方大學

An immersive, responsive university portal for Gensokyo.

> 本站為東方Project非官方二次創作，與上海愛麗絲幻樂團及 ZUN 無關。  
> Touhou Project 原作：ZUN（上海愛麗絲幻樂團）。

Live site: <https://n0zom1z0.github.io/touhou-university/>

## Included

- school introduction, motto, traditions, uniforms and anniversary;
- seven schools with full trilingual catalogues, eight illustrated core
  faculty profiles, and a four-seat Faith & Coexistence faculty council;
- Traditional Chinese, Japanese and English language switching;
- eleven ordinary generated, shareable pages for the home portal, academics,
  admissions, research, campus incidents, campus life, My TU, the Misty Lake
  Library, housing, campus healthcare and the on-device records cabinet, with
  legacy one-page hashes redirected to their new canonical locations;
- one deliberately unlisted PHANTASM page that opens only after six different
  student-lifecycle choices leave reverse-side seals; date, eight-phase moon
  and three-hour duty bells then rotate its real entrance across five ordinary
  services, with a wrong-door release that prevents permanent lockout. Its
  ninth-period courses, shifting dream map, reverse public defence and
  `TU-DREAM-TRANSCRIPT` remain in a separate dream ledger that cannot alter
  official My TU records, while four lunar phases replace the site name,
  crest and favicon after entry;
- online application with autosaved drafts, application references and a
  device-local application history;
- a My TU student-record centre with an on-device campus identity, unified
  lifecycle ledger, joint faculty application reviews and printable decision
  letters;
- a unified on-device records cabinet that discovers every `tu:` local or
  session file, catalogues 50 known keys across university shelves, shows exact
  UTF-8 usage and browser-origin visibility, opens raw contents, exports a
  SHA-256-sealed JSON box, validates imports before writing, preserves or
  explicitly overwrites name collisions, and destroys one file, one shelf or
  everything; the short-lived PHANTASM passage is visible when present but
  never portable;
- an on-device registrar covering all 35 catalogue courses, with search,
  add/drop, waitlists, live prerequisite recalculation, an eligible-now filter,
  real timetable collisions, soft overload warnings, saved schedules, academic
  records and printable registration documents;
- a separate My TU academic workbench with four fully marked course
  assignments, Unicode-safe autosaved drafts, retained answer slips, an
  18-minute methods examination, instant per-question explanations and a
  printable combined transcript;
- thesis and spell-card project dossiers with falsifiable claims, method and
  stopping rules, a three-examiner public defence, retained rulings and linked
  campus-BBS reactions;
- an interactive spell-card design and ethics workshop with five lightweight
  flight patterns, live parameter tuning, keyboard/pointer play, six
  deliberately non-averaged reviewers, sealed revisions, printable files and
  a second public-defence path whose ruling, conditions and dissent enter My TU
  and generate three linked BBS versions;
- campus-visit reservations with autosaved drafts, visitor references and a
  device-local “My Campus Visits” archive;
- a real Misty Lake Library catalogue with 19 trilingual holdings, search and
  state/risk/collection filters, course-reserve access, borrowing, holds,
  renewals, returns, retained history and printable loan receipts;
- a Kourindou × Misty Lake Library drift-object appraisal office with eight
  complete trilingual object dossiers, competing original-use hypotheses,
  non-invasive tests, new Gensokyo uses, destination and object-agency
  decisions, autosaved drafts, retained shareable records and visibly
  contested-but-never-established conclusions;
- a complete residential-life system with five trilingual residence files,
  twelve concrete rooms, nine potential roommate profiles, autosaved needs,
  explained compatibility and friction, three ranked offers, accept/pass
  decisions, shared-living notes and room-transfer requests;
- an Eientei campus hospital and Hakurei Gate infirmary with live waiting
  boards, autosaved symptom triage, check-in and consultation records, twelve
  unusual medicines and aids, dose-by-dose prescriptions, six four-stage
  recovery programmes, retained printable care files and linked patient BBS
  reactions;
- a five-case Campus Incident Centre with trilingual evidence, conflicting
  testimony, falsifiable hypotheses and reversible first responses; a
  persistent research simulator models confounding, drift, missingness and
  equipment/data-version changes instead of rewarding sample size alone;
- saved experiment slips and closure files that enter the My TU campus ledger,
  campus-wire ticker and three incident-specific BBS reactions, each linked
  back to the shareable source case; unsupported theories may be retained only
  through a reviewer-signed, explicitly confirmed red-thread closure that
  stays visibly marked contested everywhere it appears;
- a shared Live Campus clock whose local date, three-hour duty shift and lunar
  phase drive classroom availability, rotating dining menus, the day’s classes,
  room moves, BBS timestamps/activity, weather, transport closures and route
  delays together;
- a four-proposal campus governance bell with visible policy consequences,
  deterministic stakeholder counts, replaceable on-device votes, My TU events
  and linked BBS discussion;
- illustrated interactive campus map with seven place cards, live arrival
  estimates and four genuinely different transport networks with first/last
  mile walking segments;
- a time-, date- and lunar-phase-aware Eientei/Bamboo Forest focus map whose
  available routes genuinely change under full and new moons;
- five complete Gensokyo research records, including a six-part spell-card
  readability and fairness study;
- a living Hieda campus chronicle that maps every first-parent Git revision to
  a trilingual in-universe history record, correction note and real version
  source, while mechanical merge commits separately expose their second-parent
  functional change without confusing the two SHAs;
- four timed entrance-exam banks with instant scoring, full saved answer
  records and reopenable reviews;
- a 150-mark Gensokyo Unified Examination (`幻想鄉統一學力試驗`) with
  humanities/sciences tracks at
  NORMAL, HARD, LUNATIC and EXTRA difficulty, autosaved progress, full answer
  archives, instant scoring and 48 trilingual offline paper/answer downloads;
- rotating campus news, detailed clubs and a locally persistent, shuffled BBS
  with autosaved drafts and a dedicated “My Posts” view;
- full-site search, Visitor/Applicant/Current Student route gateways, and
  browser-history-aware deep links for schools, faculty, research, clubs,
  services and BBS records, including exact mobile scroll restoration after
  closing nested cards;
- responsive navigation, keyboard-friendly dialogs and reduced-motion support;
- two interchangeable faculty portrait art directions.
- an interactive “unresolved matters” board where faculty competence,
  personality and university rules visibly collide.

All interactive records stay in the visitor's browser. This static GitHub Pages
site has no analytics, trackers, remote JavaScript or submission backend.
Submitted applications can be reopened from “My Applications”; authored BBS
threads remain available under “My Posts” even after topics are reshuffled.

## Project structure

```text
src/
  data/       translated faculty, research, service and interface content
  js/         independent interaction modules
  sections/   page partials, one institutional section per file
  styles/     base and feature-specific stylesheets
scripts/      build, preview, validation, scaffolding and asset helpers
*.html        twelve generated GitHub Pages artifacts; one is deliberately hidden
styles.css    generated shared CSS artifact
styles-*.css  generated per-page CSS artifacts
site.config.mjs
```

Edit `src/`, not the generated root HTML pages or root `styles*.css` bundles.

## Common commands

No package installation is required; the build uses Node.js standard-library
modules only.

```bash
npm run dev                 # rebuild on change and serve at localhost:4173
npm run build               # generate twelve pages and shared/per-page CSS bundles
npm run check               # build + i18n coverage + JS syntax
npm run check:gaokao        # marks, translations, rotation-safe explanations, key balance and offline files
npm run check:courses       # catalogue parity, translations, times, capacity, prerequisites and unusual conflicts
npm run check:library       # holdings, translations, facets, loan terms and course-reserve references
npm run check:appraisal     # drift objects, evidence, hypotheses, tests, reuse and reviewer records
npm run check:spellcards    # patterns, venues, six independent reviewers and public-defence choices
npm run check:phantasm      # seals, lunar entrances, reachable release, dream brands and isolation
npm run check:records       # on-device key catalogue, translations, scopes and non-portable session pass
npm run check:housing       # residences, rooms, features, roommate profiles and translations
npm run check:incidents     # case structure, translations, evidence, actions and BBS reactions
npm run check:clinic        # sites, complaints, medicines, therapies, links and translations
npm run check:interactions  # button/action contracts and subpage initializer coverage
npm run check:live          # rotating campus state, route effects, governance and academic scoring
npm run test:browser        # headless Chrome interaction and mobile smoke test
npm run capture -- --page=campus.html#map --section=map --width=390 --height=844
npm run capture -- --page=admissions.html#gaokao --section=gaokao --click='[data-gaokao-difficulty="extra"];;[data-gaokao-start="humanities"]'
npm run capture -- --page=mytu.html#my-tu --section=my-tu --storage='{"tu:identity":{"id":"TU-S-DEMO"}}'
npm run capture -- --page=library.html#library --section=library --width=390 --height=844
npm run capture -- --page=housing.html#housing-application --section=housing --width=390 --height=844
npm run capture -- --page=incidents.html#incident-simulator --section=incident-center --width=390 --height=844
npm run capture -- --page=clinic.html#clinic-pharmacy --section=clinic --width=390 --height=844
npm run capture -- --page=campus.html#live-campus --section=live-campus --width=1440 --height=1000
npm run capture -- --page=mytu.html#academic-defense --section=my-tu --storage='{"tu:identity":{"id":"TU-S-DEMO","name":"外界人類"}}'
npm run new:section -- news # scaffold and register a new section
npm run portraits -- set-b  # switch the active faculty art direction
scripts/optimize-images.sh input.png output.webp 1600x1200
```

Set a different preview port with `PORT=4180 npm run dev`.

### Adding content

- Add or revise faculty, research and campus-service records in `src/data/`.
- Add academic catalogues in `src/data/schools.js`; add places, transport modes
  and graph edges in `src/data/services.js` and `src/data/routes.js`.
- Keep registration metadata in `src/data/courses.js`; current registrations
  and transcript records use `tu:courses:registration` and
  `tu:courses:transcript` without leaving the browser.
- Keep course assignments, timed course examinations and defence questions in
  `src/data/academic-work.js`; persistence/scoring belongs in
  `src/js/academic-model.js`, and the focused My TU UI belongs in
  `src/js/academic-work.js`. Never discard earlier attempts or answer-level
  explanations.
- Keep operational incidents, menu/timetable pools and room state in
  `src/data/live-campus.js`. Every consumer should read one deterministic
  snapshot for the same local time slot; route restrictions must affect graph
  construction in `src/data/routes.js`.
- Keep library metadata in `src/data/library.js`; loans and holds use
  `tu:library:loans` and `tu:library:holds`, retaining completed history on the
  visitor's device.
- Keep drift-object dossiers in `src/data/appraisal.js`, assessment and
  persistence in `src/js/appraisal-model.js`, and the workbench in
  `src/js/appraisal.js`. Drafts and records use `tu:appraisal:drafts` and
  `tu:appraisal:records`; unsupported conclusions require explicit contested
  retention and must remain labelled unsupported in My TU and BBS.
- Keep spell-card workshop patterns, venues, cues, reviewers and defence
  choices in `src/data/spellcard-workshop.js`; assessment and version-tolerant
  persistence belong in `src/js/spellcard-workshop-model.js`, and the focused
  Canvas/UI belongs in `src/js/spellcard-workshop.js`. Do not collapse six
  conflicting reviews into one fairness score. Drafts, sealed versions and
  defences use the three `tu:spellcards:*` records.
- Keep PHANTASM seals, courses, map nodes and examiners in
  `src/data/phantasm.js`; official-record eligibility and isolated dream
  persistence belong in `src/js/phantasm-model.js`; ordinary-site whispers use
  the lightweight `src/js/phantasm-gate.js` and
  `src/js/phantasm-hints.js`; the hidden page UI belongs in
  `src/js/phantasm.js`. Never add `phantasm.html` to the ordinary navigation,
  never let a direct URL bypass all six seals, and never write dream enrolment
  or defence records to `tu:campus:ledger`. Date, lunar phase and three-hour
  duty slots must rotate all five source entrances while retaining at least
  two opening windows per day; several distinct wrong doors must create a
  bounded session passage so nobody is stranded indefinitely. Persistent
  dream state, transcripts and wrong-door traces use `tu:phantasm:state`,
  `tu:phantasm:transcripts` and `tu:phantasm:boundary`; temporary passage uses
  session-only `tu:phantasm:pass`.
- Keep residences, rooms and roommate profiles in `src/data/housing.js`;
  housing persistence and matching live in `src/js/housing-model.js`.
  Applications, assignments and transfer requests stay in the
  `tu:housing:*` on-device records and enter the shared campus ledger.
- Keep clinic sites, complaint groups, medicines, patients and recovery
  programmes in `src/data/clinic.js`; triage, prescriptions and progression
  belong in `src/js/clinic-model.js`, while `src/js/clinic.js` owns the focused
  interface. Drafts, visits, prescriptions and care plans use
  `tu:clinic:triage-draft`, `tu:clinic:visits`,
  `tu:clinic:prescriptions` and `tu:clinic:care-plans`. The waiting board must
  derive from the same Live Campus snapshot as maps and facilities.
- Keep incident cases in `src/data/incidents.js`, persistence and simulation
  rules in `src/js/incident-model.js`, and presentation in
  `src/js/incidents.js`. Workbench choices, experiment slips and resolutions
  use separate `tu:incidents:*` records. Derived news/BBS reactions must remain
  distinguishable from visitor-authored `tu:bbs:posts`; contested closures must
  keep their unsupported verdict, reviewer and retention reason.
- Add exam banks and questions in `src/data/exam.js`; every question stores all
  three languages beside its answer and explanation.
- Add unified-examination subjects in `src/data/gaokao.js` and higher-difficulty
  dossiers in `src/data/gaokao-advanced.js`; `npm run build` regenerates all
  48 self-contained files under `downloads/gaokao/`.
- Register page ownership through `src/js/site-router.js` and shareable overlay
  routes through `src/js/deep-links.js`; use stable
  routes such as `#research-spellcard`, `#faculty-aya` and `#map-eientei`, and
  give every route family its canonical background `anchor`. Direct links are
  re-aligned while lazy sections and fonts settle, without overriding manual
  scrolling.
- Record new lifecycle actions through `src/js/campus-ledger.js`; My TU
  compiles both new events and legacy application, exam, visit and BBS data.
- Add news/BBS seeds in `src/data/community.js`, and club details in
  `src/data/campus.js`.
- Maintain Git-backed campus history in `src/data/campus-history.js`. Before a
  new release, backfill the previous newest record's main-branch SHA and remove
  its `planned` flag, add one planned record whose `commitSubject` matches the
  intended commit/PR title, and run `npm run history:status`. The canonical
  `commit` always comes from `git log --first-parent main`; only mechanical
  multi-parent merges additionally record the second parent as `changeCommit`.
- Add page structure in `src/sections/`.
- Add feature logic as a focused module in `src/js/` and import it from
  `src/js/main.js`.
- Add styles to the relevant file under `src/styles/`.
- Add every new public string to `src/data/i18n.js`; `npm run check:i18n`
  reports untranslated static copy.
- Register new pages, their sections and styles in `site.config.mjs`.

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
