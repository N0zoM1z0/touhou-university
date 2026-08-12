# Touhou University — Domain invariants (legacy-expanded reference)

This is the expanded domain reference retained from the original workspace rulebook.
Start with repository `AGENTS.md`, `docs/CURRENT_STATE.md` and
`docs/AGENT_HANDBOOK.md`; use this file only for the feature domains being changed.
When a count or path here conflicts with current source, the source plus focused
validator wins and this document must be corrected in the same change.

## Product intent

- Build and maintain a convincing, immersive university website located inside
  Gensokyo.
- The public site should behave like a real university website: informative,
  useful, internally consistent, polished, and playful without becoming a joke
  page.
- The primary deployment is GitHub Pages:
  `https://n0zom1z0.github.io/touhou-university/`.
- The public repository is:
  `https://github.com/N0zoM1z0/touhou-university`.

## Immersion and fan-work notice

- Keep the short unofficial-fan-work notice at the top of the site.
- Keep the fuller rights/fan-work notice in the footer.
- Do **not** insert immersion-breaking labels into normal page content, faculty
  profiles, admissions, research, maps, services, dialogs, or FAQs.
- In particular, public copy must not use phrases such as:
  - “AU / University AU”;
  - “原作錨點 / canon anchor”;
  - “本校轉譯”;
  - “虛構企劃 / fictional project”;
  - “並非官方設定”;
  - “這不是現實旅行指南”.
- Canon/AU/source distinctions still matter internally. Record them in
  `research/` or repository documentation, not in immersive public copy.
- “AU” means “Alternate Universe”. Use the term only in internal research when
  useful.

## Languages

- Every public-facing feature must support:
  - Traditional Chinese (`zh-Hant`);
  - Japanese (`ja`);
  - English (`en`).
- A university-style language switcher must be visible in the global header.
- New copy, form labels, validation messages, dialogs, tables, maps and BBS
  components must be translated in the same change.
- Persist the visitor's language selection locally when possible.

## Required university features

Maintain and extend these as first-class site functions:

- school introduction, motto, traditions, uniform and anniversary;
- faculty and academic schools;
- admissions information and online application;
- campus-visit reservation;
- library and teaching-building availability;
- campus map;
- dining-hall menus;
- course timetable and examination schedule;
- detailed, imaginative Gensokyo research achievements;
- campus life and gallery;
- BBS / campus forum.

Forms should provide meaningful client-side interaction and local persistence.
Do not add analytics or collect real personal data without explicit permission.
Local persistence must be discoverable in the interface: application drafts
and submissions need a “My Applications” view, and authored BBS threads need a
“My Posts” view. Preserve old stored records when data fields evolve.

## Touhou portrayal and research

- Use canon identities, abilities, occupations, relationships and institutions
  as private editorial anchors.
- Do not flatten characters into memes or generic archetypes.
- Do not let university roles domesticate every character into an exemplary
  modern academic. Keep productive friction between institutional rules and
  character motives: Aya may cause the correction she teaches, Marisa may have
  excellent reproducibility and terrible material provenance, Yukari may make
  the rule's boundary unreliable, and faith factions should disagree over
  authority, ritual and resources.
- Invent rich university systems, research programmes and campus traditions as
  needed, while keeping each character recognisable.
- Release research notes live in repository `docs/research/`. A sibling
  `../research/` may exist as an optional workspace mirror; the repository
  must remain understandable without it.
- Do not reproduce official scripts, endings, game assets, screenshots, music,
  scans, or another fan creator's work.
- Recheck the current official Touhou fan-work guidelines before major public
  distribution or monetisation changes.

## Visual assets

- Faculty cards should use character artwork rather than placeholder glyphs.
- Keep multiple visual style sets when practical so the art direction can be
  changed without regenerating the whole roster.
- Generated assets must be saved in the repository, optimised for the web, and
  recorded in the asset provenance documentation.
- Never imitate a named living artist.

## Engineering and release

- The site uses dependency-free semantic HTML, CSS and vanilla JavaScript with
  a zero-dependency Node build step.
- All root page artifacts (`index.html`, `academics.html`, `admissions.html`,
  `research.html`, `ethics.html`, `festival.html`, `fieldwork.html`,
  `commons.html`, `calendar.html`, `campus.html`, `mytu.html`, `library.html`,
  `housing.html`, `incidents.html`, `clinic.html`, `records.html`,
  `careers.html`, `hieda.html` and the deliberately unlisted `phantasm.html`), shared
  `styles.css`, and page bundles `styles-*.css` are generated release
  artifacts. Do not make substantial edits to them directly.
- Author page sections in `src/sections/`, data in `src/data/`, JavaScript in
  `src/js/`, and styles in `src/styles/`.
- Register section/style order in `site.config.mjs`.
- Register each page's required style subset in `site.config.mjs`. Keep
  `styles.css` as the shared core and load a generated `styles-<page>.css`
  alongside it; do not return to one all-feature stylesheet on every page.
- Register complete pages and their section composition in
  `site.config.mjs`; render them through the shared
  `src/index.template.html` shell. Add deep institutional features to the
  appropriate page instead of extending the home page into another monolith.
- Cross-page route ownership lives in `src/js/site-router.js`. Old
  `index.html#route` bookmarks must redirect to their canonical page, while
  new search and navigation links should point to that page directly.
- Use the scripts under `scripts/` for builds, scaffolding, i18n checks and
  image optimisation instead of repeating manual work.
- Stable multilingual interface copy lives in `src/data/i18n.js`. New or
  touched static controls must keep readable Traditional Chinese fallback text
  while declaring `data-i18n="<message-key>"`; translated attributes use
  `data-i18n-aria-label`, `data-i18n-placeholder`, `data-i18n-alt` or
  `data-i18n-title`. The legacy Chinese text-node lookup is a migration
  fallback only: never add new punctuation-coupled lookup behaviour, and never
  use a blanket MutationObserver that could translate applicant or BBS-authored
  text. Domain records should continue to carry structured
  `{ "zh-Hant", ja, en }` values. `check:i18n` must reject duplicate keys,
  unknown explicit keys, interpolation-token drift, missing page title keys
  and unkeyed source-text collisions with different translations.
- Searchable/domain-linked features register their capabilities in
  `src/js/domain-registry.js`. Search and BBS consume that registry rather than
  importing every new feature directly. A domain may provide search entries,
  community projections and change events; PHANTASM must retain
  `officialLedger: false`. Adding a cross-cutting feature means extending one
  domain manifest, not adding parallel hand-maintained lists to Search, BBS
  and My TU.
- Every official `recordCampusEvent` type must have one versioned contract in
  `src/data/event-contracts.js`. Schema-2 events carry a structured `subject`,
  `correlationId`, optional earlier `causationId` and referenced entity list;
  producers must include the IDs needed to reconstruct those relationships.
  My TU obtains event labels from the same contracts. Preserve schema-1
  browser histories by upgrading them chronologically in the shared ledger,
  and run `npm run check:contracts` whenever event producers, payloads or
  lifecycle ordering change. PHANTASM records never receive official event
  contracts.
- The cross-campus Hieda knowledge layer lives in
  `src/data/knowledge-graph.js` and is rendered by `src/js/hieda-index.js`.
  Treat it as a projection and shared navigation layer, never as another
  source of truth or localStorage store. Every graph leaf must keep a stable
  `{ type, id }` reference to an entity owned by its original domain, and its
  visible title, detail and canonical route must resolve from that source at
  render time. Only the short red-thread annotation belongs to the graph.
  Preserve the three shareable route families
  `#hieda-event-<id>`, `#hieda-character-<id>` and
  `#hieda-version-<history-id>`.
- Each visible Hieda dossier must retain at least five distinct record forms,
  resolve every character and campus-history version, and declare schema-2
  event queries for the visitor's own marginalia. Personal marginalia read the
  shared campus ledger and never invent or duplicate an event. New indexed
  domains should extend the source resolver and `domain-registry.js`, then run
  `npm run check:knowledge`; PHANTASM remains outside the official index unless
  a future design explicitly presents it as a denied reverse-side record.
- Build new student-lifecycle systems in four explicit layers: a standalone
  trilingual source-data model under `src/data/`; a stable, version-tolerant
  localStorage model/store module; deduplicated lifecycle events in the shared
  campus ledger; and a focused UI module that uses the shared render-state
  helper for local rerenders. Do not collapse these layers into another
  one-off monolithic script. Extend the same pattern for later housing fees,
  access control, incidents, research workflows, thesis review and governance.
- Data-driven views that replace their own markup must use the shared
  `src/js/render-state.js` helper instead of ad-hoc scroll fixes. Mark stable
  internal scroll regions with `data-preserve-scroll` and restorable controls
  with `data-preserve-focus`; preserve window position when a same-view action
  (selection, filter, add/drop, borrow/return) rerenders the page. The helper's
  tokenised two-frame restore prevents stale renders from overwriting newer
  interaction state.
- Live-filter controls must preserve IME composition. Use the shared
  `src/js/ime-input.js` binding when an `input` event can trigger a render;
  never replace a Chinese or Japanese text field between `compositionstart`
  and `compositionend`.
- Preserve relative URLs so GitHub Pages works under `/touhou-university/`.
- Test desktop and mobile layouts, keyboard operation, dialogs, forms and all
  three languages.
- Printable official documents must use `src/js/print-document.js`: clone the
  fully rendered document body into the direct body-level `.tu-print-root`
  before invoking print. Do not rely on printing a nested dialog while the
  ordinary page is hidden.
- Keep validation proportional. Static checks may validate source/data/build
  contracts, while real button behaviour belongs in the browser smoke flow.
  Preserve regressions for observed failures (IME, select popovers, deep-link
  return/position, printed content); avoid checks that merely search for the
  implementation string of another check.
- Backdrop closing must use `event.target === dialog`; coordinate-based dialog
  checks break native `<select>` popovers in Chromium.
- Timed exam content lives in `src/data/exam.js`; preserve client-side scoring,
  answer explanations and on-device-only history.
- Random community content lives in `src/data/community.js`; locally authored
  BBS posts must survive a topic reshuffle.
- Academic catalogue records live in `src/data/schools.js`; keep credits,
  tuition, course tables and progression requirements translated together.
- Campus navigation uses `src/data/routes.js` as a graph over place IDs from
  `src/data/services.js`; new places must be connected by at least one route
  edge and covered by the browser smoke test.
- Transport modes must change the chosen path, not merely multiply a shared
  walking time. Keep walking as the common first/last-mile layer and model
  broom berths, tengu wind stops and rabbit-shuttle stops as real graph edges.
- Research records live in `src/data/research.js`; full records and their
  section cards must be updated together.
- Schools, faculty, research, clubs, BBS records and campus services use the
  overlay router in `src/js/deep-links.js`, with page ownership in
  `src/js/site-router.js`. Preserve stable shareable hashes,
  URL synchronisation and browser Back behaviour when changing dialogs.
  Every registered route family must declare its canonical `anchor` section;
  inline routes such as `map-eientei` also use `position: "always"`. Keep the
  bounded post-load alignment passes so lazy sections, fonts and collapsing
  panels cannot move a direct URL onto the preceding section, and cancel those
  passes as soon as the visitor manually scrolls or points.
  Dynamic inline records must resolve their route-specific DOM target from the
  current route on every alignment pass, with the parent section only as a
  temporary fallback. Never retain an element reference across a focused
  rerender: the old node may be detached while its replacement carries the
  same id.
  Opening a card must save the originating page and exact scroll position.
  Dialog-to-dialog transitions and named stages in one focused workflow each
  remain a single history layer; related stages such as spell-card
  pattern/design/defence must share an explicit `historyGroup`. Only a true
  modal overlay declares `dialog`. Crossing layers—especially opening Search
  over Hieda, governance or a workshop file—must preserve the exact focused
  route beneath it as the return destination.
- My TU lives in `src/js/mytu.js`, with review/editorial data in
  `src/data/mytu.js`. Its campus event stream is maintained by
  `src/js/campus-ledger.js`; new application, examination, visit, BBS and
  future student-lifecycle features must write stable, deduplicated events.
- Live operational state lives in `src/data/live-campus.js`. It must remain a
  deterministic function of an explicit local `Date`: date, three-hour slot
  and lunar phase select the same incidents for every consumer. Dining,
  timetable, room availability, BBS status and route restrictions must read
  that shared snapshot rather than each inventing unrelated randomness.
  Operational restrictions must change graph edges, available modes, rooms or
  records—not only explanatory copy. Scenario/examination fixtures must remain
  explicit and must not silently read the visitor's live campus state.
- The academic workbench uses `src/data/academic-work.js`,
  `src/js/academic-model.js` and `src/js/academic-work.js`. Assignment drafts
  use `tu:academics:drafts`; graded submissions use
  `tu:academics:submissions`; the active timed paper and retained attempts use
  `tu:academics:exam-session` and `tu:academics:exam-attempts`; project and
  defence records use `tu:academics:projects` and `tu:academics:defences`.
  Preserve earlier attempts, full answers, per-question scoring explanations
  and the original defence ruling. Every completed assessment/project action
  must enter the campus ledger; derived BBS reactions must remain separate
  from visitor-authored `tu:bbs:posts`.
- Section migrations must initialize modules from the controls that need them,
  not from an old page-only wrapper. In particular, services initialize from
  `[data-service]`, even on admissions and campus subpages without
  `#services`. Run `npm run check:interactions` and the browser smoke test after
  moving controls between pages; each action family needs one real click flow,
  including any visible “Continue” action.
- Course-registration source data lives in `src/data/courses.js` and reuses
  the canonical titles and credits from `src/data/schools.js`. Preserve all 35
  catalogue courses, trilingual teacher/rule copy, add/drop, waitlists,
  live prerequisites, the eligible-now filter, ordinary and unusual collisions,
  current-course IP transcript rows and printable documents together.
  Currently enrolled prerequisites count immediately so dependent courses
  update without a page reload. The 18-credit value is a soft warning, never a
  registration block. Course selection and the catalogue's internal scroll
  position must survive an add/drop rerender.
  Registrations use `tu:courses:registration`; completed coursework uses
  `tu:courses:transcript`. Both are on-device, version-tolerant records and
  every add/drop/waitlist action must also enter the campus ledger.
- The Misty Lake Library catalogue lives in `src/data/library.js` and its
  circulation UI in `src/js/library.js`. Keep every holding trilingual and
  preserve call-number uniqueness, edition/provenance notes, danger, autonomous
  tendency, current state and course-reserve rules together. Loans use
  `tu:library:loans`; holds use `tu:library:holds`. Returned and cancelled
  entries remain as history rather than being deleted. Borrow, renew, return,
  hold and cancellation actions must enter the campus ledger and appear in My
  TU. Browsing never requires identity; circulation does. Preserve
  `#library-<holding-id>` deep links and printable loan receipts.
- The Kourindou × Misty Lake drift-object appraisal office lives beside the
  library catalogue. Its trilingual object files are in
  `src/data/appraisal.js`, version-tolerant persistence and assessment rules
  are in `src/js/appraisal-model.js`, and the focused interface is in
  `src/js/appraisal.js`. Preserve each object's code, physical condition,
  three observations, three competing original-use hypotheses, three
  non-invasive tests, three possible Gensokyo uses, actual operation/caution,
  agency baseline and all four disagreeing marginal voices (Rinnosuke, Ran,
  Nitori and Kogasa) together. Completion requires at least two observations,
  one test, one hypothesis, a new use, destination and agency assessment.
  Knowing a name or original purpose must never imply knowing safe operation.
  An unsupported hypothesis may enter the archive only through explicit
  contested retention with a named reviewer, written reason and second
  confirmation; retain `verdict: "unsupported"` and never present it as
  established. Later supported work may point back to the contested record as
  a correction. Drafts use `tu:appraisal:drafts`; completed files use
  `tu:appraisal:records`. Completion and library cataloguing enter the campus
  ledger/My TU, while generated BBS reactions remain derived views rather than
  visitor-authored `tu:bbs:posts`. Preserve `#library-appraisal`,
  `#appraisal-object-<id>`, `#appraisal-record-<id>` and
  `#appraisal-records` as shareable routes. Keep the bench visually rooted in
  repaired Kourindou woodwork and library paper records; it should not become
  a generic modern SaaS dashboard.
- The interactive spell-card design and ethics workshop lives on the research
  page. Its trilingual patterns, venues, visual/sound cues, six reviewers and
  defence questions live in `src/data/spellcard-workshop.js`; version-tolerant
  assessment/storage lives in `src/js/spellcard-workshop-model.js`; the focused
  interface and lightweight Canvas sandbox live in
  `src/js/spellcard-workshop.js`. Preserve the six genuinely independent
  review axes: Reimu for declared rules/exits, Marisa for expression and
  reproducibility, Aya for audience readability, Nitori for collision/runtime
  stability, Eirin for stimulation/fatigue/stopping, and the Misty Lake Fairy
  Chorus for shared sound, play and rehearsal. Never average them into a
  single ethics/fairness score or discard the dissenting review after a public
  ruling. The sandbox is intentionally formula-driven rather than a physics
  engine: cap it at 72 simultaneous shots, throttle around 30 fps, cap device
  pixel ratio, and pause rendering outside the viewport while keeping a
  visitor's explicit pause state separate. Drafts use
  `tu:spellcards:draft`; sealed versions use `tu:spellcards:designs`; public
  three-question defence records use `tu:spellcards:defences`. Saving and
  defending enter the campus ledger/My TU; three post-defence BBS reactions
  are derived views and never visitor-authored posts. Preserve
  `#spellcard-workshop`, `#spellcard-records`,
  `#spellcard-design-<id>` and `#spellcard-defence-<id>` as exact shareable
  routes, and keep printable design/defence dossiers on the shared print desk.
- The standalone Gensokyo Research Ethics Review Board lives on
  `ethics.html`. Its five specimen disputes, structured targets/methods and
  reviewer identities live in `src/data/ethics.js`; pure assessment,
  normalisation and version-tolerant persistence live in
  `src/js/ethics-model.js`; and the focused submission/file UI lives in
  `src/js/ethics.js`. Preserve five genuinely independent seats: Eirin handles
  dose/risk/stopping; Satori handles mental access and read-without-recording;
  Akyuu/Keine handle records, correction, deletion receipts and forgetting;
  Eiki handles rights, responsibility and appeal; Reimu handles simple rules
  that can actually be enforced in the field. Never calculate a total ethics
  score, let a majority erase a block, or discard minority opinions.
  Submissions create immutable version-linked protocols and reviews; amendment
  supersedes rather than overwrites, and withdrawal retains the review record.
  Drafts use `tu:ethics:drafts`, formal plans use `tu:ethics:protocols`, and
  five-seat opinions use `tu:ethics:reviews`. Register and preserve the four
  official event types `ethics.protocol.submitted`,
  `ethics.review.completed`, `ethics.protocol.amended` and
  `ethics.protocol.withdrawn`; derived BBS reactions never become authored
  `tu:bbs:posts`. Preserve `#ethics-board`, `#ethics-records`,
  `#ethics-case-<id>` and `#ethics-protocol-<id>` as exact shareable routes,
  and keep formal rulings on the shared print desk.
- The standalone festival operations room lives on `festival.html`. Keep
  festival dossiers, routes, stages, infrastructure, review desks and field
  incidents in `src/data/festival.js`; pure assessment, version-tolerant
  persistence, field effects and route/clinic projections belong in
  `src/js/festival-model.js`; the focused operations/file UI belongs in
  `src/js/festival.js`. Preserve six independent desks—Hakurei exits, kappa
  power/recovery, Eientei medicine, Bunbunmaru publicity, three-faith gate
  ownership, and residence/fairy shared night life. A return blocks opening;
  conditions and objections survive in permits and reports. Never create an
  aggregate festival success score or let one desk sign for another. Drafts,
  permits and operations use `tu:festival:draft`, `tu:festival:plans` and
  `tu:festival:operations`. Register and preserve the five event types
  `festival.plan.submitted`, `festival.permit.issued`,
  `festival.shift.started`, `festival.incident.resolved` and
  `festival.report.closed`. A live operation may be merged by consumers into
  routing and clinic pressure, but must not mutate the deterministic
  `liveCampusSnapshot()` source. Closure releases live overlays without
  deleting the event trail. Derived BBS posts never become visitor-authored
  `tu:bbs:posts`. Preserve `#festival-operations`, `#festival-records`,
  `#festival-plan-<id>` and `#festival-operation-<id>` as exact shareable
  routes, and keep permits/reports on the shared print desk.
- The standalone domestic-placement and field-inquiry passport lives on
  `fieldwork.html`. Keep the eight regions, ten discipline filters, travel
  modes, twelve rotating complications and all twenty-four station dossiers
  in `src/data/fieldwork.js`; pure assessment, version-tolerant normalisation,
  storage, route estimates, passport summaries and map/BBS projections belong
  in `src/js/fieldwork-model.js`; the focused map, dispatch, field-response,
  return, passport and printable-file UI belongs in `src/js/fieldwork.js`.
  Every station must retain a real premise, entry rule, supervisor,
  collaborator/friction source, shift, risk, field ethics, exactly three
  equipment items, substantive tasks, source forms, route data, complication
  and distinctive seal. Red Mansion and Hakugyokurou are work sites, not
  tourism cards. A dispatch states a question, ability plan and exit route;
  assessment may approve or attach conditions but must never average risk into
  a score. Only one checked-in placement may be active, and every check-in
  reveals three non-equivalent responses to a field complication. Return
  separates direct observation, testimony/inference, provenance, incidents and
  research-use scope. A seal proves traceable learning returned; it does not
  make a disputed conclusion true. Preserve every visit: first duty grants the
  station credit and repeats add a smaller 0.25-credit return seal without
  overwriting the old file. Drafts, lifecycle files and the passport use
  `tu:fieldwork:draft`, `tu:fieldwork:placements` and
  `tu:fieldwork:passport`. Register and preserve
  `fieldwork.application.submitted`, `fieldwork.departure.checked`,
  `fieldwork.complication.handled`, `fieldwork.observation.logged` and
  `fieldwork.return.certified` as one causal chain. Map notices, search, My TU
  and BBS are derived views and must not create duplicate visitor-authored
  records. Preserve `#fieldwork-stations`, `#fieldwork-dispatch`,
  `#fieldwork-passport`, `#fieldwork-records`, `#fieldwork-station-<id>` and
  `#fieldwork-placement-<id>` as exact shareable routes. Formal dispatch,
  return and passport documents use the shared print desk.
- The public campus commons lives on `commons.html`, with Tsukumogami property
  hearings and Crow-Tengu Post as sibling desks rather than one blended store.
  Keep the ten object disputes and four jurisdictions in `src/data/property.js`;
  Kogasa asks about object voice/neglect, Rinnosuke material identity/use,
  Akyuu provenance/correction, and Eiki custody/remedy/appeal. These four
  opinions remain independently visible and are never averaged or replaced by
  a majority. Claims and rulings persist in `tu:property:claims`. Keep seeded
  notices, trust/source/version labels and delivery channels in
  `src/data/post.js`; read/pin/aloud/acknowledgement/correction state belongs
  in `tu:post:state`, while visitor dispatches belong in
  `tu:post:dispatches`. Pure storage, normalisation, events and projections
  belong in `src/js/property-model.js` and `src/js/post-model.js`; the focused
  UI belongs in `src/js/commons.js`. Preserve the exact route families
  `#property-desk`, `#property-records`, `#property-item-<id>`,
  `#property-claim-<id>`, `#post-inbox`, `#post-compose`, `#post-records`,
  `#post-message-<id>` and `#post-dispatch-<id>`.
- The Gensokyo academic calendar lives on `calendar.html`. Keep five seasons,
  fourteen annual/lunar event files and their four separate course, transport,
  library and clinic effects in `src/data/academic-calendar.js`; bookmark
  persistence, derived BBS/Post notices and iCalendar generation belong in
  `src/js/academic-calendar-model.js`; the calendar/leaf/agenda UI belongs in
  `src/js/academic-calendar.js`. Bookmarks use
  `tu:calendar:bookmarks`. Preserve `#academic-calendar`,
  `#calendar-today`, `#calendar-agenda` and `#calendar-event-<id>`.
  `liveCampusSnapshot().calendar.activeEvents` must remain separate from the
  two deterministic ordinary daily incidents, while its route rules and
  facility effects are merged by consumers. The map's wooden notice may quote
  either layer. A saved leaf is only a reminder and must never freeze the
  world's date, duty bell or moon.
- Register and preserve `property.claim.submitted`,
  `property.ruling.issued`, `post.message.acknowledged`,
  `post.correction.requested`, `post.notice.dispatched`,
  `calendar.event.saved` and `calendar.event.removed`. Property, post and
  calendar views in Search, My TU, BBS, the records cabinet and Hieda are
  projections of these owning stores, never duplicate authored records.
- The PHANTASM dream campus is an earned counterfactual layer, not a password,
  badge or easily clicked Easter egg. Its six seals require six distinct
  official lifecycle traces: `academic.assignment.graded`,
  `governance.vote.cast`, `incident.resolved`, `housing.offer.declined`,
  `course.dropped`, and a completed academic defence whose source project
  contains a deliberately unused route of at least 18 characters. A direct
  visit to `phantasm.html` must remain gated until all six exist. Do not add the
  page to desktop or mobile primary navigation. Ordinary pages may reveal only
  restrained clues through the footer, My TU reverse timetable, map notice,
  search and BBS. After the six seals are complete, these five surfaces are
  also the only valid entrance sources. Date, the shared eight-phase lunar
  calculation and three-hour duty bell rotate the resonant source and two
  daily opening slots; new and full moons may add a third slot and a second
  simultaneous source. Preserve deterministic schedules, coverage of all five
  sources and at least two normal windows on every local day. Difficulty must
  not become permanent exclusion: three distinct wrong doors on a first visit,
  or two after a previous entry, create a bounded session-only paper seam.
  Repeated attempts at one door also reach a finite release. Do not replace
  this with random chance, an unbounded real-world wait or a visible password.
  Source copy, courses, map nodes, four lunar brand profiles and examiners live in
  `src/data/phantasm.js`; lightweight ordinary-page eligibility belongs in
  `src/js/phantasm-gate.js`; shared light date/moon helpers live in
  `src/data/campus-time.js`; dream derivation and storage live in
  `src/js/phantasm-model.js`; hints and the hidden interface live in
  `src/js/phantasm-hints.js` and `src/js/phantasm.js`. After successful entry,
  switch the header/footer university name, vector crest, favicon, theme colour
  and motto to the current new/waxing/full/waning dream profile; the locked
  boundary retains ordinary university branding. Preserve the shifting
  ninth bell, six courses, three-course ceiling, visitor-specific
  counterfactual fragments, reverse public defence, exact transcript links and
  the line `Not valid outside the dream boundary`. Most importantly, dream
  state is not official state: never call `recordCampusEvent` from PHANTASM and
  never copy its enrolments, rulings or transcripts into
  `tu:campus:ledger`, My TU or the ordinary transcript.
- The unified on-device records cabinet lives on `records.html`. Its
  trilingual shelf/key catalogue is `src/data/local-records.js`, lossless
  storage/export/import/delete logic is `src/js/local-records-model.js`, and
  focused UI is `src/js/local-records.js`. Every durable `tu:` localStorage or
  sessionStorage key must be entered in that catalogue in the same change that
  introduces the key; runtime discovery must still expose unknown future
  `tu:` keys rather than hiding them. Preserve exact raw string values during
  export/import so version-tolerant owning modules can perform their own
  migrations later. Archives use the versioned
  `touhou-university-on-device-archive` JSON envelope and a SHA-256 checksum;
  validate the complete file and every key before any write. Default imports
  preserve current same-name records, while overwriting requires an explicit
  user choice. If a write fails, roll back every key touched by that import.
  Deletion must work per record, per shelf and across the complete `tu:`
  namespace only after a clear confirmation; never add a deletion event to the
  campus ledger because doing so would recreate data immediately after a clear.
  Show exact university-file UTF-8 usage separately from the browser's optional
  origin-wide storage estimate, and explain browser-profile/origin/tab
  visibility in all three languages. PHANTASM reverse-side records may appear
  only after they exist; `tu:phantasm:pass` remains visible and deletable but
  non-portable, and must never enter an exported archive.
- Housing source data lives in `src/data/housing.js`, allocation/storage logic
  in `src/js/housing-model.js`, and presentation in `src/js/housing.js`.
  Preserve the five residences, concrete room inventory, trilingual roommate
  profiles, explicit compatibility reasons and visible friction together.
  Housing drafts use `tu:housing:draft`; submitted applications,
  assignments and room-change requests use `tu:housing:applications`,
  `tu:housing:assignments` and `tu:housing:room-changes`. Accepting or passing
  an offer and submitting or withdrawing a transfer must enter the campus
  ledger. Keep `#housing`, `#housing-application`, `#housing-account` and
  `#housing-residence-<id>` shareable. Browsing is public; submission requires
  a My TU identity.
- Campus healthcare source data lives in `src/data/clinic.js`, triage and
  persistence in `src/js/clinic-model.js`, and presentation in
  `src/js/clinic.js`. Preserve both care sites, all complaint groups, medicine
  and aid records, rotating waiting-room patients, and every four-step recovery
  programme together; `npm run check:clinic` enforces their translations and
  cross-record links. Draft triage uses `tu:clinic:triage-draft`; check-ins and
  consultations use `tu:clinic:visits`; prescriptions and dose progress use
  `tu:clinic:prescriptions`; recovery progress uses
  `tu:clinic:care-plans`. Browsing, triage and pharmacy reference access remain
  public; records may use a My TU identity when one exists but must also work
  for a visitor. Queue and duty estimates must read the shared deterministic
  Live Campus snapshot instead of inventing independent randomness. Check-in,
  consultation, dispensing, dose and therapy actions enter the shared campus
  ledger and My TU; generated pharmacy/recovery BBS posts are derived views and
  must remain separate from visitor-authored `tu:bbs:posts`. Preserve
  `#clinic`, `#clinic-pharmacy`, `#clinic-medicine-<id>`,
  `#clinic-recovery` and `#clinic-account` as shareable routes, and retain
  printable care records.
- Campus incident source data lives in `src/data/incidents.js`, workbench,
  simulation and closure persistence in `src/js/incident-model.js`, and the
  focused UI in `src/js/incidents.js`. Preserve case codes, four evidence
  records, three conflicting testimonies, three falsifiable hypotheses, four
  reversible actions and three post-closure BBS reactions per case unless the
  data validator is intentionally revised. The simulator must keep
  confounding, instrument drift, missingness and equipment/data versions
  structurally distinct; increasing sample size alone must never erase them.
  Workbench choices use `tu:incidents:workbench`, experiment slips use
  `tu:incidents:experiments`, and closure records use
  `tu:incidents:resolutions`. Experiments and closures enter the shared campus
  ledger and My TU. Incident-linked BBS/news records are derived from closure
  data and must not be written into visitor-authored `tu:bbs:posts`.
  An unsupported, rejected, inconclusive or false-confidence result may be
  preserved only through the explicit red-thread contested-closure flow: keep
  the original verdict visible, require a second user confirmation, a named
  reviewer and a retention reason, and store `disposition: "contested"`.
  Derived BBS/news/My TU records must preserve the unsupported warning and must
  never restyle a contested claim as established.
  Preserve `#incident-center`, `#incident-case-<id>`,
  `#incident-simulator` and `#incident-records` as shareable routes.
- The living university chronicle lives in `src/data/campus-history.js` and is
  rendered by `src/js/chronicle.js`. Every first-parent Git commit must map to
  exactly one rich trilingual in-universe history entry through the exact
  subject stored in `commitSubject`; `npm run check:history` enforces coverage,
  subjects, parents and hashes.
  The source fields have strict meanings:
  - `commit` is only the exact SHA returned by `git log --first-parent main`.
    Never put a local feature-branch commit, PR head or a merge commit's second
    parent in this field.
  - `commitSubject` is the exact subject of that same first-parent main commit,
    including a GitHub `(#N)` suffix or a mechanical
    `Merge pull request #N from ...` subject. Never rewrite it into the feature
    title.
  - Only a mechanical multi-parent merge uses `changeCommit` and
    `changeSubject`: they are the merge's second parent and that parent's exact
    subject. They are a secondary human-readable change source and never
    replace the canonical `commit`.
  - For a squash merge, the new squash commit on main is the canonical
    `commit`; the former local/PR head is not recorded as `changeCommit`.
  Before preparing a new commit/PR:
  1. synchronise main first, then inspect
     `git log --first-parent -1 --format='%H%n%P%n%s' main`; backfill the
     previous newest entry's missing `commit` with that main SHA, copy that
     exact subject into `commitSubject`, and remove its `planned` flag;
  2. add one newest `planned: true` entry with `commit: null` and a
     `commitSubject` matching the intended commit/PR title exactly;
  3. run `npm run history:status` after committing. Leave the newest entry
     planned on the feature branch; only a later run after the change reaches
     main may backfill its final main SHA. Never infer that SHA from the current
     feature branch.
  Do not mechanically expose a raw commit subject as the public story. Preserve
  it as the version source, but write an immersive campus consequence and
  marginal note in all three languages.
- The Eientei focus map must continue to derive its default state from the
  visitor's local date, time and calculated lunar phase. Preview controls must
  change real route edges, not only map colours or explanatory text.
- The Gensokyo Unified Examination lives in `src/data/gaokao.js`. Its public
  Traditional Chinese name is `幻想鄉統一學力試驗` (short form `統一試驗`);
  keep the legacy internal `gaokao` route, filenames, modules and storage keys
  for bookmark and local-record compatibility. Keep both
  humanities and sciences tracks at 150 marks across NORMAL, HARD, LUNATIC and
  EXTRA. Higher-difficulty dossiers live in `src/data/gaokao-advanced.js`.
  LUNATIC must require genuine cross-source reasoning; EXTRA must require
  version, telemetry, fault-timeline or identifiable-design reasoning rather
  than merely shorter timing or sillier distractors. Preserve autosave, full
  on-device answer records and scoring, and regenerate all 48 trilingual
  offline paper/answer files on build. Since answer positions are rotated,
  explanations must identify the correct content or result and never hardcode
  “option A/B/C/D” or an equivalent translated answer letter.
- Application storage keys are `tu:application:draft` and
  `tu:application:submissions`; BBS keys are `tu:bbs:draft` and
  `tu:bbs:posts`. Campus visits use `tu:visit:draft` and `tu:visits`; entrance
  exams use `tu:exam:history`; unified exams use `tu:gaokao:draft` and
  `tu:gaokao:attempts`. My TU uses `tu:identity`,
  `tu:application:reviews`, `tu:mytu:selected-application` and
  `tu:campus:ledger`. Course registration uses `tu:courses:registration` and
  `tu:courses:transcript`. Library circulation uses `tu:library:loans` and
  `tu:library:holds`. Drift-object appraisal uses `tu:appraisal:drafts` and
  `tu:appraisal:records`. Housing uses `tu:housing:draft`,
  `tu:housing:applications`, `tu:housing:assignments` and
  `tu:housing:room-changes`. Incident response uses
  `tu:incidents:workbench`, `tu:incidents:experiments` and
  `tu:incidents:resolutions`. Governance uses `tu:governance:votes`.
  Academic work uses `tu:academics:drafts`, `tu:academics:submissions`,
  `tu:academics:exam-session`, `tu:academics:exam-attempts`,
  `tu:academics:projects` and `tu:academics:defences`.
  Campus healthcare uses `tu:clinic:triage-draft`, `tu:clinic:visits`,
  `tu:clinic:prescriptions` and `tu:clinic:care-plans`.
  Spell-card workshop work uses `tu:spellcards:draft`,
  `tu:spellcards:designs` and `tu:spellcards:defences`.
  Research ethics uses `tu:ethics:drafts`, `tu:ethics:protocols` and
  `tu:ethics:reviews`.
  Festival operations uses `tu:festival:draft`, `tu:festival:plans` and
  `tu:festival:operations`.
  Domestic placement uses `tu:fieldwork:draft`,
  `tu:fieldwork:placements` and `tu:fieldwork:passport`.
  Campus commons uses `tu:property:claims`, `tu:post:state` and
  `tu:post:dispatches`; the academic calendar uses
  `tu:calendar:bookmarks`.
  Graduation, careers, employment and alumni use `tu:graduation:audits`,
  `tu:graduation:degrees`, `tu:careers:draft`, `tu:careers:plans`,
  `tu:employment:draft`, `tu:employment:applications`,
  `tu:employment:attestations` and `tu:alumni:profile`. Keep the evidence
  audit, version-tolerant storage,
  causal event production and focused renderer in separate layers. Graduation
  must continue to read the existing course, academic-work, defence, ethics,
  fieldwork, library, housing, incident and property sources rather than
  copying their truth into a second checklist. Missing evidence blocks degree
  issue; conditions and disputes require explicit acceptance and remain
  visible. PHANTASM traces may appear on the degree reverse but must never
  count toward official credits. Preserve exact routes
  `#graduation-audit(-<id>)`, `#graduation-degree-<id>`,
  `#career-office`, `#career-opening-<id>`, `#career-plan-<id>`,
  `#employment-market`, `#employment-job-board`, `#employment-outcomes`,
  `#employment-records`, `#employment-job-<id>` and
  `#employment-application-<id>`,
  `#alumni-association`, `#alumni-profile` and
  `#alumni-chapter-<id>`. Register longer detail prefixes before overlapping
  base prefixes so `#graduation-audit-<id>` cannot be swallowed by
  `#graduation-audit`.
  Employment content lives in `src/data/employment.js`, version-tolerant
  draft/application/attestation logic in `src/js/employment-model.js`, and the
  focused renderer in `src/js/employment.js`; keep it a separate section on
  `careers.html`, not another monolithic careers renderer. Never turn the
  graduate whereabouts roll into one normalised employment percentage.
  Preserve its five counting bases, five observation windows, eight
  non-exclusive outcome kinds and visible denominator-method notes; valid
  statements may exceed the denominator. Recruitment files must keep actual
  work, compensation, the dangerous clause, trial task and employer reply
  together in all three languages. Every vacancy must also resolve through
  `employmentPosterImages` to its own metadata-stripped 760×1188 WebP notice;
  keep the exact trilingual wording in HTML, retain lazy loading on the rack
  and keep each poster below the focused validator's 300 KiB budget.
  Submitting a strange clause only confirms
  it was seen, never that appeal rights were waived. Preserve the applicant's
  edition-two reply rather than overwriting the employer's first review.
  Register and retain `employment.application.submitted`,
  `employment.application.responded` and `employment.outcome.attested`; Post,
  BBS, Search, My TU, the records cabinet and Hieda are projections of the
  owning employment stores, not duplicate authored records.
  PHANTASM uses `tu:phantasm:state`, `tu:phantasm:transcripts` and
  `tu:phantasm:boundary`; all are deliberately isolated dream records and must
  never be folded into the shared campus ledger. Its short-lived
  `tu:phantasm:pass` belongs to `sessionStorage` and must be cleared when the
  visitor explicitly wakes.
  Never silently clear these during ordinary UI
  changes, and keep legacy summary records readable when richer fields are
  added.
- Use `npm run capture -- --page=<file-or-file#hash> --section=<id>
  --width=<px> --height=<px>` for visual checks; `--page` defaults to
  `index.html`. Pass `--click=<selector>` to capture an opened interaction. Separate
  multiple ordered click selectors with `;;`. Pass `--storage='<json>'` to
  seed on-device states such as a populated My TU dashboard.
- Aim for Lighthouse accessibility 95+ and no HTML validation errors.
- Update repository `CHANGELOG.md` for every meaningful user-visible change;
  synchronise an optional workspace-parent mirror when it exists.
- Keep the repository research copy synchronised when research changes.
- Commit intentionally, push, wait for GitHub Pages to finish, and verify the
  production URL before reporting completion.
