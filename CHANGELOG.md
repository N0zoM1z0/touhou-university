# Changelog

All notable changes to the Touhou University project are recorded here.

## [Unreleased]

### Added

- Added the earned Dream Campus's trilingual PHANTASM common reverse paper:
  nine questions across reverse historiography, non-explosive boundary logic
  and untaken-route causality, totalling 150 marks without a forward-time
  limit.
- Made one completed ordinary EXTRA paper the final opening condition, paying
  off the old unsigned “finish EXTRA first” clue without adding a visible fifth
  admissions card. Blank papers and scored reviews print only from inside the
  dream boundary.
- Added dream-only draft and attempt shelves, a responsive examination desk,
  an adaptive BBS rumour, focused answer-leak validation and end-to-end browser
  coverage for perfect scoring, printing, scroll preservation and official
  ledger isolation.

### Changed

- Reorganized generated site artifacts without changing public routes: the
  nineteen GitHub Pages HTML entries remain at repository root, generated CSS
  bundles now live under `assets/css/`, and the shared page shell now lives at
  `src/templates/page.html`. Build, scaffolding, i18n and maintainer references
  follow the new paths, the section scaffolder now registers its target page
  instead of editing template includes, and builds remove legacy root CSS bundles.
- Re-edited seventy-five high-impact Traditional Chinese, Japanese and English
  copy groups across admissions, BBS, academics, clinical care, fieldwork,
  festivals, ethics, the library and careers, then regenerated all nineteen
  public pages from their owning sources.
- Replaced literal or cross-locale phrasing with native campus language while
  keeping the university's deliberate institutional absurdity, character
  voices and causal jokes intact.
- Rewrote the non-numerical choices across all eight unified-examination
  papers so wrong answers encode plausible reasoning mistakes instead of
  revealing the key through brevity, and replaced the visible A–D cycle with
  balanced paper-specific answer schedules.
- Added question-bank revision handling: older drafts retain their choices as
  a local backup but require fresh confirmation, while older completed attempts
  keep their original scoring and review letters.

### Quality

- Kept source strings, structured datasets, runtime fallbacks and generated
  HTML synchronized under the full build, documentation, localization,
  contract, knowledge, feature and interaction checks.
- Backfilled TU-H-039 with first-parent commit
  `ce2b2e050a6fae11014197031c6fc6ea717f06c5`; planned TU-H-040 uses exact
  subject `Refactor generated site structure`.
- Added unified-examination validation for cyclic answer keys and multilingual
  option-length leakage, plus a browser regression for revision-one drafts and
  completed attempts; regenerated all forty-eight offline papers and keys.

## [0.30.0] - 2026-08-12

### Changed

- Rebuilt the new-agent handoff around a standard repository `AGENTS.md`, an
  audited `docs/CURRENT_STATE.md`, a cross-cutting `docs/AGENT_HANDBOOK.md`
  and a separate expanded domain-invariants reference. A fresh clone no longer
  depends on a parent-directory file or 679 undifferentiated lines of rules.
- Made document authority and reading order explicit: source/validators own
  facts, the current-state page owns the compact snapshot, the handbook owns
  procedure, research owns editorial provenance, the roadmap records completed
  batches/future directions, and the changelog records release effects.
- Reframed `docs/ROADMAP.md` as implementation history rather than a live task
  queue, corrected its records-cabinet count, and added the missing property,
  graduation, employment and documentation batches through this release.
- Audited the research index and explained when a future agent should read each
  note and how the optional workspace mirror relates to the repository copy.

### Added

- Added source-derived `npm run docs:status` output for pages, sections, CSS,
  locales, storage keys, event contracts, Hieda records, employment artwork,
  courses, field stations and offline examinations.
- Added `npm run check:docs` to fail on stale current-state values, incomplete
  page ownership, missing handoff links, lost first-parent/merge rules,
  roadmap/version drift, changelog/version drift and research mirror drift.
- Added a repository-owned `CHANGELOG.md`, so release history survives a fresh
  GitHub clone instead of existing only in the local workspace parent.

### Quality

- Preserved all former long-form domain invariants under
  `docs/AGENT_DOMAIN_RULES.md` while making the first-minute instructions short
  enough to use reliably.
- Added TU-H-036 as the trilingual campus consequence of Akyuu splitting the
  679-line appointment scroll into a gate notice, handbook, current ledger and
  indexed archive—after Aya announced the shorter document had more pages.

## [0.29.1] - 2026-07-29

### Added

- Completed the recruitment rack with seventeen additional original monochrome
  illustrated notices. All twenty-one vacancies now own a distinct visual
  scene rather than falling back to a text-only classified card.
- Gave each employer its own cheap-print material language: shrine offertory
  audit, second-hand object catalogue, moonlit clinic handover, phantom census,
  flying-book husbandry, faith-grid utility sheet, temple dinner mediation,
  mind-reading redaction file, doll labour hearing, silent-stage accident,
  melting-ice inspection, five-version archive, hell heat ledger, rumour
  nightwatch, moving-gate customs, Yesterday Line ticket and tsukumogami
  arbitration docket.

### Changed

- Upgraded the focused employment check so every job must resolve to exactly
  one real poster asset under the existing 300 KiB per-image budget.
- Expanded the visual provenance record and working research notes from four
  representative posters to the complete twenty-one-notice set.
- Backfilled TU-H-034 with first-parent commit
  `c2a6e5dc7d714146af303d07999a651abe919761`; planned TU-H-035 uses exact
  subject `Illustrate every Gensokyo recruitment notice`.

### Quality

- Normalised all new posters to metadata-stripped 760×1188 WebP files with
  lazy loading retained on the recruitment rack.
- Kept exact Traditional Chinese, Japanese and English recruitment copy in
  structured HTML rather than baking generated lettering into images.

## [0.29.0] - 2026-07-29

### Added

- Opened the trilingual Gensokyo Employment Market as a separate maintainable
  section on the existing graduation/careers page.
- Added twenty-one substantive recruitment files spanning the Scarlet Mansion,
  Hakurei Shrine, Kourindou, Eientei, Hakugyokurou, Moriya, Myouren,
  Chireiden, the kappa workshop, Sanzu River, Bunbunmaru, the Prismrivers,
  Hieda, Blazing Hell, Yesterday Line and tsukumogami labour disputes. Every
  file keeps actual duties, settlement, dangerous fine print, a trial task and
  an employer-specific reply.
- Added an interactive Graduate Whereabouts Echo Roll with five counting bases,
  five observation windows and eight deliberately non-exclusive outcomes.
  Valid statements may exceed the denominator; the interface always exposes
  its method instead of publishing one promotional employment rate.
- Added on-device odd-résumé drafts, submitted applications, deterministic
  first-edition employer reviews, applicant edition-two replies and graduate
  whereabouts statements.
- Added four original handmade monochrome recruitment posters for the Scarlet
  zero-minute shift, kappa taped engineering, Sanzu queue appeals and
  crow-tengu advance corrections. The metadata-stripped 760×1188 WebP files
  total under 820 KiB and keep all exact trilingual copy in HTML.

### Changed

- Expanded the records cabinet to 71 registered keys and the campus event
  catalogue to 76 causal types.
- Projected employment applications and whereabouts into Tengu Post, Campus
  BBS, full-site search, My TU and Hieda dossier 12 without duplicating the
  owning local records.
- Expanded the Hieda graph to 82 resolved source leaves, including the
  zero-minute recruitment notice and denominator hearing.
- Added exact `#employment-job-<id>` and
  `#employment-application-<id>` routes alongside stable market, outcome and
  local-record entry points.
- Backfilled TU-H-033 with first-parent commit
  `9949cd1363d9c64e733b627bd2c96ab2399e08f0`; planned TU-H-034 uses exact
  subject `Add Gensokyo employment market and recruitment systems`.

### Quality

- Added a focused employment validator covering all 21 three-language job
  files, denominator changes, local persistence, poster budgets, routes and
  causal contracts.
- Extended the real-browser journey through an exact Scarlet vacancy deep
  link, changing counting rules, odd-résumé submission, edition-two correction,
  whereabouts attestation and ten-event Hieda projection.
- Recorded the employment model, character/place anchors and generated asset
  provenance in both the working research pack and repository mirror.

## [0.28.0] - 2026-07-28

### Added

- Opened the standalone trilingual Graduation Board, Careers Office and
  Hyakki Yagyo Alumni Association on an eighteenth ordinary public page.
- Added a real eight-desk graduation audit across credits/cores, coursework
  and exams, public defence, ethics, fieldwork, library, housing and unresolved
  incident/property/chronology records. Missing evidence blocks the degree;
  accepted conditions and disputes print unchanged, while isolated PHANTASM
  work appears only as a reverse-side ±3 trace.
- Added four time/lifespan tracks, twelve detailed Gensokyo career
  destinations with transparent fit/friction matching and single-dispatch
  crow-tengu referrals, plus eight problem-based alumni chapters with a
  date/moon/bell-varying lantern route.
- Added degree-gated alumni profiles, Hyakki Yagyo RSVP and returning
  fieldwork mentorship with explicit boundaries.

### Changed

- Expanded the local records cabinet to 68 registered keys across twelve known
  shelves and the official campus event catalogue to 73 causal types.
- Projected graduation, careers and alumni into My TU, full-site search,
  Campus BBS and Hieda dossier 12 without duplicating source records.
- Expanded the Hieda graph to twelve dossiers, 23 character slips and 80
  resolved source leaves.
- Backfilled the property/post/calendar chronicle with first-parent commit
  `9bfa07a8363fa4f29635fe6e2d21831c8d18b2d4`; planned TU-H-033 uses the exact
  subject `Add Gensokyo graduation careers and alumni systems`.
- Fixed overlapping route precedence so a concrete graduation audit no longer
  falls back to the graduation landing desk after submission or direct entry.

### Quality

- Added a focused graduation/careers/alumni validator covering the eight
  independent requirements, official/dream credit isolation, 12 destinations,
  8 chapters, 5 files, 7 event contracts and all canonical routes.
- Extended the real-browser journey through audit, degree, alumni activation,
  reunion, mentorship, career matching, referral, Hieda projection, exact deep
  links and all nineteen desktop/mobile page builds.

## [0.27.0] - 2026-07-27

### Added

- Opened a standalone trilingual Campus Commons containing the Tsukumogami
  Lost Property & Property Rights Tribunal and Crow-Tengu Campus Post.
- Added ten substantive object disputes and persistent claims with four
  independent opinions from Kogasa, Rinnosuke, Akyuu and Eiki. Rulings retain
  every seat, require a separate disposition, print as formal files and never
  use an aggregate ownership score.
- Added eight seeded, versioned and deliberately non-linear notices, plus
  derived property summons, calendar reminders and visitor dispatches. The
  inbox records source, trust, delivery/version metadata, read versus
  read-aloud state, pins, acknowledgement and correction requests.
- Opened a standalone trilingual Gensokyo Academic Calendar with five seasons,
  fourteen annual/lunar event files and separate effects on courses,
  transport, library and clinic operations. Leaves can be bookmarked, printed
  and exported as iCalendar without freezing live world state.

### Changed

- Expanded the generated site to seventeen ordinary public pages plus the
  unlisted PHANTASM page, the records cabinet to 63 registered keys, and the
  official event catalogue to 66 causal types.
- Calendar date, season, moon and duty bell now change the shared route graph,
  facility hours/capacity, timetable, dining, clinic load and map wooden
  notice while remaining distinct from the two deterministic daily incidents.
- Property rulings, outgoing post and saved calendar leaves now project into
  full-site search, BBS and My TU without duplicating authored records.
- Expanded the Hieda graph to eleven dossiers, 23 character slips and 74
  resolved leaves. Dossier 11 binds object testimony, property custody, an
  early admission letter, post correction, disputed spring, lunar notices,
  local ledger marginalia and the exact Git-backed chronicle leaf.
- Backfilled the prior fieldwork chronicle with first-parent commit
  `4aa3492f076a0d63356401eda707f17bf4ed700a`; the commons/calendar leaf remains
  planned against the exact subject
  `Add Gensokyo property post and calendar systems`.

### Quality

- Added a focused validator for trilingual object files, separate hearing
  seats, post versions and delivery channels, calendar events/effect domains,
  local-storage registration, event contracts, search, BBS and live-campus
  projections.
- Extended real-browser coverage through a full claim/ruling, post
  acknowledgement/correction, public dispatch, calendar bookmark/Post
  projection, My TU recovery, six-leaf Hieda cross-file and desktop/mobile
  overflow checks.
- Visually inspected Campus Commons and Academic Calendar at 1440 px and
  390 px, then tightened mobile inbox indicators, empty agenda height and the
  no-active-incident calendar message.

## [0.26.0] - 2026-07-26

### Added

- Opened a standalone trilingual Domestic Placement & Field Inquiry Passport
  with 24 substantive work sites across eight regions: Hakurei Shrine, the
  Village and Hieda archives, Kourindou, Misty Lake, Scarlet Devil Mansion,
  two Forest of Magic workshops, Garden of the Sun, Nameless Hill, Youkai
  Trail, the mountain and ravine, Moriya Shrine, Giant Toad Pond, Myouren
  Temple, the Great Mausoleum, Eientei, Bamboo Forest, Hakugyokurou, Sanzu
  River, Old Capital, Chireiden and the Blazing Hell ruins.
- Gave every station its own host, supervisor, troublesome collaborator,
  premise, entry rule, shift, risk and stopping note, field ethics, three
  equipment items, work tasks, source forms, route conditions, complication
  and named passport seal.
- Added an autosaved dispatch desk for the field question, date, travel mode,
  ability-use declaration, exit plan, equipment and refusal acknowledgement.
  It issues approval or explicit conditions without an aggregate risk score.
- Added check-in, 12 rotating field complications with three non-equivalent
  first responses each, provenance-aware return logs, incident annexes,
  supervisor review and explicit research-data disposition.
- Added printable dispatch orders, return certifications and a field passport.
  First visits earn normal station credit; repeats retain the original file
  and add a visibly smaller 0.25-credit return seal.

### Changed

- Expanded the generated site to fifteen ordinary public pages plus the
  unlisted PHANTASM page, the records cabinet to 59 registered keys, and the
  official event catalogue to 59 causal types.
- Field duty now appears on the live campus map until return. Dispatch and
  return records project into full-site search, linked BBS posts and My TU
  without creating duplicate authored data.
- Expanded the Hieda graph to ten dossiers, 23 character slips and 68 resolved
  leaves. Dossier 10 cross-links Scarlet stopped-time duty, Hakugyokurou
  phantom headcounts, Kourindou object testimony, Chireiden mental privacy,
  local field events and the exact fieldwork chronicle version.
- Corrected the public home statistic from 18 to the implemented 24 field
  stations, and added fieldwork to desktop/mobile student-service navigation.
- Backfilled the prior festival chronicle record with the exact first-parent
  commit `ace8f152b5bf2810bf7a58e300d44ac7ed8a26a5`; the fieldwork history leaf
  remains planned against the exact subject `Add Gensokyo fieldwork passport
  system` until that first-parent commit exists.

### Quality

- Added a focused fieldwork validator covering 24 unique stations and codes,
  three-language completeness, cross-disciplinary indexing, equipment and
  tasks, complications, route-mode effects, qualitative permit assessment,
  active-duty exclusion, a full Scarlet Mansion lifecycle, repeat seals,
  storage registration, event contracts, search and BBS projection.
- Extended real-browser smoke coverage through exact station deep links,
  dispatch, check-in, map notice, complication response, return certification,
  passport, BBS, My TU, all generated pages and the 17-link mobile menu.
- Visually inspected the code-native route board and station catalogue at
  1440×1000 and 390×844; the mobile map remains readable without loading a
  separate bitmap.

## [0.25.0] - 2026-07-26

### Added

- Opened a standalone trilingual Spring Spell-card Lantern / Boundary
  Matriculation operations room with two festival dossiers, four procession
  networks, stages, danmaku altitude/density/cues, visitor capacity, kappa and
  Moriya power plans, food courts, fairy zones, Eientei aid stations, three
  competing sole gates, press policy and Prismriver closing hours.
- Added six genuinely independent review desks for exits, power/recovery,
  medicine, publicity, faith ownership and shared night life. A return blocks
  opening; conditional and contested permits preserve every objection and
  never collapse into an overall success score.
- Added seven Gensokyo field incidents and three non-equivalent first responses
  per incident. Each live operation draws four cases; decisions alter
  attendance, delay, power, clinic presentations, route closures and
  unresolved disputes before a printable closing report can be filed.
- Added stable links for the operations desk, local records, individual
  permits and live/closed operations, plus printable six-desk permits and
  closing files.

### Changed

- Live festival slips now merge into the campus route graph and Eientei
  workload without contaminating the deterministic world snapshot. Closing
  the festival releases both overlays while retaining the historical record.
- Festival permits, live wires and Aya's closing extras now project into the
  shared BBS; permits and duty history appear in My TU and full-site search;
  all three storage keys are visible, exportable and deletable in the on-device
  records cabinet.
- Expanded the generated site to fourteen ordinary public pages plus the
  unlisted PHANTASM page, the records cabinet to 56 keys, the event catalogue
  to 54 causal types, and the Hieda graph to nine dossiers, 21 characters and
  62 resolved leaves.
- Added Hieda dossier 09 around the same festival's permit, procession,
  disputed power diagram, Aya's early extra, three-faith gate rota, local
  event trail and exact first-parent chronicle entry.

### Quality

- Added a focused festival validator for trilingual completeness, independent
  desks, unsafe-plan return, full open/respond/close lifecycle, route/clinic
  activation and release, storage, events, search and BBS projection.
- Extended browser smoke coverage through a real six-desk submission, opening
  bell, four field responses, closing report, linked BBS posts, My TU history,
  and desktop/mobile overflow checks.

## [0.24.0] - 2026-07-26

### Added

- Opened a standalone trilingual Gensokyo Research Ethics Review Board with
  five independent seats: Eirin for dose and stopping, Satori for mental
  privacy, Akyuu/Keine for records and forgetting, Eiki for rights and appeal,
  and Reimu for rules that can actually be enforced in the field.
- Expanded five complete specimen cases around Reisen's undisclosed
  wavelength orientation study, Satori's read-without-recording claim,
  Sakuya's stopped-time control group, Keine's deletion of history as data
  deletion, and Drift Reader 77 refusing dismantlement despite Kourindou's
  custody claim.
- Added a real submission lifecycle with per-case autosaved drafts, structured
  ability/data/consent choices, five-seat pre-review, formal protocols,
  immutable review files, linked amendments, explicit withdrawal and
  printable/shareable rulings. Blocks, conditions and minority opinions remain
  separate; the board never manufactures an aggregate ethics score.
- Registered the three new on-device files and four official lifecycle event
  types, and projected completed reviews into My TU, full-site search, linked
  BBS reactions, incident source files and a new Hieda five-consents dossier.

### Changed

- Expanded the ordinary generated site from twelve to thirteen public pages
  while keeping PHANTASM as the fourteenth, unlisted page. Research, academic
  navigation, mobile navigation and the footer now lead to the ethics board.
- Extended the Hieda index to eight dossiers, eighteen characters and 55
  resolved leaves, including Satori, Eiki, Sakuya and a live ethics event
  marginalia chain.
- Expanded the local records cabinet to 53 catalogued keys and the campus
  event contract catalogue to 49 types with a submitted → reviewed → amended
  → reviewed → withdrawn causal fixture.

### Quality

- Added a focused ethics validator covering three-language completeness,
  independent reviewer identity, specimen outcomes, non-averaging, repairable
  disputes, storage registration, routes, search and event contracts.
- Browser regression now performs the full drift-object path: contested v1,
  approved safeguarded v2, retained version chain, five-opinion printable
  ruling, explicit withdrawal, derived BBS discussion, My TU events, exact
  deep links, trilingual rerendering and 390px layout.
- The campus chronicle backfills the exact `2471778` first-parent commit for
  the Hieda knowledge graph and stages the planned “Add Gensokyo research
  ethics review board” entry without confusing a future feature commit with
  main history.

## [0.23.0] - 2026-07-26

### Added

- Opened the standalone `hieda.html` campus knowledge graph with seven
  trilingual cross-files, 49 resolved source leaves and three shareable reading
  modes: event, character, and first-parent version/time.
- Added fifteen character index slips, contradiction notes, exact source links,
  chronology links and on-device personal marginalia derived from the shared
  schema-2 campus ledger.
- Added exact governance proposal deep links so a graph leaf for the full-moon
  library rule no longer opens the first airspace motion.
- Added `check:knowledge`, which rejects missing source IDs, routes, characters,
  translations, event contracts, chronicle versions or dossiers with fewer
  than five genuinely different record forms.

### Changed

- Extended the shared domain registry and site search with Hieda event,
  character and version entries instead of maintaining a separate search list.
- Distinguished focused page routes, dialog overlays and named workflow groups
  in the shared history controller. Search now returns to the exact Hieda or
  governance view beneath it, while spell-card pattern/design/defence stages
  still occupy one returnable workshop layer.
- Expanded the ordinary generated site from eleven to twelve public pages
  while keeping PHANTASM as the thirteenth, unlisted page.
- Added the Hieda index to desktop, mobile and footer navigation and bumped the
  site package to `0.23.0`.

### Quality

- Browser coverage now verifies event-to-character inversion, version/time
  projection, local-ledger marginalia, browser Back restoration, exact
  governance source selection, trilingual rerendering and mobile overflow.
- The campus chronicle now backfills the exact `c04334b` first-parent commit
  for the registry infrastructure and stages one new planned Hieda entry
  without confusing it with a feature branch or merge second parent.

## [0.22.0] - 2026-07-26

### Added

- A versioned campus-event contract catalogue covering all 45 official event
  types. New ledger entries identify their subject, workflow correlation,
  immediate cause and referenced campus entities instead of relying only on
  stringly typed payload conventions.
- A campus domain registry that supplies full-site search records, derived BBS
  projections and their change signals from one capability catalogue.
- Explicit `data-i18n` and translated-attribute support with readable
  Traditional Chinese fallback content. Global navigation, contextual
  collision cases, page titles and accessibility labels now use stable keys.
- `npm run check:contracts`, including lifecycle fixtures for admissions,
  visits, examinations, courses, library loans and holds, housing, incidents,
  coursework, clinic care, appraisal and spell-card defence.

### Changed

- Existing schema-1 event ledgers are upgraded chronologically to schema 2
  without discarding event IDs, actors, timestamps or payloads. Causation is
  reconstructed only from an allowed earlier event sharing a workflow or
  entity reference.
- Search and BBS no longer maintain their own imports for every participating
  feature, while My TU obtains all 45 trilingual event labels from the event
  contract catalogue.
- The i18n checker now validates duplicate and explicit keys, page-title
  registration, interpolation variables and ambiguous source text. Four
  existing same-Chinese/different-translation collisions can no longer silently
  select the wrong English copy.

### Quality

- Browser coverage validates schema/version, subjects, correlations,
  earlier-only causation links and representative admissions, housing, clinic,
  incident and spell-card chains from real UI interactions.
- Browser coverage also verifies contextual English translations, the records
  page title, registry-backed library search, all linked BBS projections and
  the rule that PHANTASM never enters the official ledger.

## [0.21.0] - 2026-07-26

### Added

- A focused, trilingual `records.html` on-device records cabinet linked from
  Campus Services, student-service navigation, My TU, full-site search and the
  footer.
- Fifty catalogued `tu:` storage keys across nine ordinary/reverse-side
  shelves, plus runtime discovery of future unregistered keys. Each written
  file shows its content count, exact UTF-8 footprint, storage location,
  visibility scope and safely escaped raw contents.
- A usage desk with a common localStorage reference gauge and the browser's
  optional origin-wide estimate, alongside plain-language explanations of
  browser-profile, origin, interface, dream and tab-session visibility.
- One-click versioned JSON export with a SHA-256 seal, whole-file validated
  import, preserve-current and explicit overwrite collision policies, and
  per-file, per-shelf and complete `tu:`-namespace deletion.

### Changed

- My TU now links to the complete data cabinet and displays how many university
  storage files exist across localStorage and sessionStorage.
- The site now builds twelve pages, 27 content sections and 13 page-specific
  CSS bundles; the records page remains a focused subpage instead of extending
  the home or My TU monolith.

### Safety and quality

- Import validation checks format version, size, key namespace, duplicate
  keys, storage kind, individual value size and checksum before any write.
  Quota failures roll back every touched key.
- The short-lived PHANTASM session passage is visible and deletable only after
  it exists but is never included in a portable archive; dream files remain
  separate from the official campus ledger.
- Browser coverage performs a real sealed export/parse/import round trip,
  file-input import, raw-file dialog, individual deletion, three-language
  rerender and complete clear inside an isolated profile, plus 390px layout.

## [0.20.0] - 2026-07-26

### Added

- A deterministic lunar boundary after PHANTASM's six hard lifecycle seals:
  local date, eight-phase moon and three-hour duty bell now rotate the real
  entrance among the footer, My TU, wooden map notice, search and BBS.
- Two guaranteed normal opening slots every local day, plus a third slot and
  twin entrances at new and full moon. Cryptic clues identify the current
  paper surface without exposing an ordinary navigation item or countdown.
- A bounded wrong-door release: three distinct failed surfaces on a first
  visit, two after a previous dream, or finitely repeated attempts at one
  surface wear a temporary six-hour passage through the paper.
- Four trilingual dream-campus identities for new, waxing, full and waning
  moons. Successful entry now changes the university name, visible vector
  crest, favicon, theme colour and footer motto; the locked gate keeps the
  ordinary institutional shell.

### Changed

- Live Campus day, time-band and lunar helpers now come from a small shared
  time module, so ordinary PHANTASM whispers can use the same moon without
  loading the full operations dataset on every page.
- PHANTASM links carry a short current-slot trace and are cleaned from the URL
  after passage. Saved transcript deep links continue to work during the
  session and return to the rotating gate after an explicit wake.
- Browser and data checks now cover 48 fixture days, all eight lunar phases,
  all five entrance surfaces, daily reachability, wrong-door release, dynamic
  branding, favicon replacement and continued ledger isolation.

### Fixed

- A previously unlocked dream no longer bypasses the changing boundary merely
  because `unlockedAt` exists; re-entry requires a live source, a worn paper
  seam or an existing session passage.
- Boundary failures and temporary passage are stored separately from official
  campus events and dream transcripts; waking clears only the session passage.

## [0.19.0] - 2026-07-26

### Added

- A deliberately unlisted trilingual PHANTASM campus that cannot be opened by
  guessing its URL. Six reverse-side seals require a marked assignment,
  governance vote, resolved incident, declined housing offer, dropped course
  and completed defence that explicitly preserves an unused route.
- Subtle ordinary-campus traces in the footer, My TU reverse timetable, map
  notice, search and BBS; clues grow with genuine lifecycle progress without
  placing an eleventh page in the primary navigation.
- Six dream courses, six shifting map locations and visitor-specific
  counterfactual records in which rejected hypotheses, uncast votes, declined
  rooms, dropped courses and unused methods continue their own student life.
- A three-course dream registration and reverse public defence chaired by
  Doremy, Yukari, Keine and Reimu, with retained rulings, conditions, dissent,
  exact deep links and printable `TU-DREAM-TRANSCRIPT` records.

### Changed

- Academic project dossiers can retain a deliberately unused route, making the
  methodological choice visible in the ordinary defence before it becomes a
  possible reverse-side seal.
- The browser regression now verifies the complete six-system unlock,
  ninth-bell map changes, trilingual dream rendering, BBS linkage, exact
  transcript positioning and mobile layout.

### Fixed

- Dream enrolments, bell state and defence records use their own two storage
  keys and never enter the official campus ledger, course transcript or My TU.
- Direct visits remain at the boundary gate until all six official traces
  exist, preventing source inspection or a shared URL from bypassing the
  intended PHANTASM route.

## [0.18.0] - 2026-07-26

### Added

- An interactive trilingual spell-card design and ethics workshop on the
  research page, with five pattern skeletons, four venues, visual/sound cues,
  live campus conditions and a lightweight keyboard, pointer and touch Canvas
  flight test capped at 72 simultaneous shots.
- Six independent workshop reviews from Reimu, Marisa, Aya, Nitori, Eirin and
  the Misty Lake Fairy Chorus. Their rule, expression, audience, runtime,
  stimulation and shared-space objections remain separate instead of being
  averaged into a false universal fairness score.
- Persistent autosaved drafts, sealed design revisions and a three-seat,
  three-question public defence with retained rulings, conditions and dissent;
  records enter My TU and the shared campus ledger and can be printed or shared
  through exact deep links.
- Three derived BBS reactions for every completed public defence, each linking
  back to the same record while retaining Aya’s headline, the panel’s ruling
  and the fairy chorus’s rehearsal objection as distinct versions.
- A proportional data validator for translations, reviewer coverage and
  defence choices, plus browser regression flows for Chinese IME naming,
  design/defence persistence, printing, BBS linkage and exact positioning.

### Changed

- Research navigation, full-site search and My TU now expose the design bench,
  the visitor’s saved spell-card files and their lifecycle events.
- The sandbox throttles to roughly 30 fps, caps device-pixel work, pauses when
  outside the viewport and keeps manual pause distinct from visibility pause.

### Fixed

- Clicking a specific item on the drift-object submission shelf now remains
  aligned to that object’s focused workbench after dynamic rerenders instead
  of settling at the top of the appraisal office.
- The shared deep-link aligner re-resolves dynamic route targets on every
  bounded correction pass, preventing replaced DOM nodes from turning exact
  record links into stale section-level positions.
- The spell-card declaration ring clamps its first-frame progress, preventing
  a sub-millisecond timing difference from producing an invalid negative
  Canvas radius.

## [0.17.0] - 2026-07-26

### Added

- A trilingual Kourindou × Misty Lake Library drift-object appraisal office
  with eight complete Outside World object files, physical evidence,
  competing original-use hypotheses, non-invasive checks, Gensokyo reuse
  proposals, destination decisions and object-agency assessments.
- A persistent appraisal lifecycle with autosaved per-object drafts,
  supported/provisional findings, explicit red-pencil retention for
  unsupported but interesting theories, later correction links and shareable
  object and record addresses.
- Character-specific review from Rinnosuke, Ran, Nitori and Kogasa, preserving
  their disagreement over names, provenance, mechanisms, disassembly and
  whether a forgotten object ought to be consulted.
- Live appraisal-desk hours, queue pressure and weekly objects tied to the
  shared campus clock, plus generated library/BBS reactions and My TU
  campus-ledger records.
- A focused drift-object data validator and browser regression flows covering
  both an evidence-supported catalogue entry and a deliberately retained,
  visibly unsupported theory.

### Changed

- The Misty Lake Library now exposes two equal shareable entrances: ordinary
  circulation and the appraisal bench.
- Full-site search indexes the appraisal office and all eight objects without
  adding the object register to initial page startup.

### Fixed

- Incident-centre regression checks now count their own red-thread discussion
  separately from contested appraisal posts instead of treating every red
  pencil on campus as the same case.

## [0.16.1] - 2026-07-26

### Fixed

- Service and search loading guards now begin listening before the larger page
  modules settle, so the first click is preserved even on a slower Outside
  World connection. This production-only startup race was found during the
  final GitHub Pages browser patrol after 0.16.0.
- Campus history now records the exact 0.16.0 squash commit and reserves the
  next record for this startup correction.

## [0.16.0] - 2026-07-26

### Added

- A shared A4 print-document path for admission decisions, course records,
  academic transcripts, library receipts and clinical care slips. Each flow
  now prints a direct body-level clone of its fully rendered content.
- Dynamic facility hours, closure notes and vacancy counts shared by the room
  finder, campus map and Misty Lake Library, plus a rotating wooden map notice
  and the Outside World applicant's route-algorithm credit.
- Responsive WebP derivatives for campus scenes, map cards, uniforms and both
  faculty portrait sets.

### Changed

- Global navigation is grouped into university/academics and
  admissions/student services, with a compact mobile equivalent and complete
  focus isolation.
- Joint faculty review now quotes and responds separately to an application's
  question, method and field needs; stored older reviews remain readable.
- Generated CSS is split into a shared core and ten page-specific bundles.
  Independent feature modules initialize in parallel, while full-site search
  and its large index load only on first use.
- Small functional copy was raised to readable supporting sizes across
  services, academic units, faculty, research, BBS, the chronicle and student
  lifecycle systems.
- The static interaction check no longer tries to prove behaviour by searching
  source strings; actual interactions and all five printable document paths
  remain in the browser regression flow.

### Fixed

- Non-home navigation remains visible against the parchment header at the top
  of the page, and the home service grid no longer mixes unexplained red,
  navy, green and white states.
- The clinic now exposes a prominent Start Care entry in both its page masthead
  and clinical hero.
- Footer email links retain their own addresses, clinic receives its correct
  three-language document title, visit dates use the local calendar, filter
  buttons publish accessibility state, and malformed URL fragments no longer
  abort initialization.
- Dynamically rendered academic, library, clinic and housing deep links now
  have concrete target elements; instant correction passes no longer inherit
  smooth scrolling from the document.
- The external third-party audit's claim that production was still the old
  single page was rejected after evidence review: one false alert among eight
  concrete findings, or a 12.5% false-positive rate.

## [0.15.0] - 2026-07-25

### Added

- A dedicated trilingual Campus Healthcare page joining the Hakurei Gate
  infirmary and Eientei University Hospital, with shareable overview, pharmacy,
  medicine, recovery and personal-record routes.
- Autosaved symptom triage covering eight complaint groups, intensity, onset,
  mobility, lunar sensitivity and containment. The resulting urgency band,
  destination, clinician, queue estimate, medicines and recovery options are
  explained before check-in.
- A complete on-device care lifecycle: check-in, consultation, generated
  prescription, dispensing, dose-by-dose completion, six four-stage recovery
  programmes and retained printable care records.
- Twelve imaginative medicines and therapeutic aids with trilingual
  indications, cautions, dosage, provenance and live stock presentation, plus
  seven rotating waiting-room patients whose predicaments retain their
  character conflicts.
- Clinic entries in My TU, the unified campus ledger, global search, campus
  navigation, services, the Eientei focus map and derived pharmacy/recovery BBS
  conversations.
- A clinic-data validator and a full browser regression flow from a Chinese IME
  triage draft through consultation, prescription, dosage, rehabilitation,
  care receipt, BBS and mobile navigation.

### Changed

- Hospital queues now derive from the shared Live Campus date, duty shift,
  lunar phase and operational pressure, so maps, facility status and triage
  describe the same campus rather than unrelated random states.
- The generated site now has ten focused institutional pages instead of
  extending the home portal with another large section.

### Quality

- The healthcare feature follows the durable four-layer lifecycle pattern:
  standalone trilingual data, version-tolerant local records, deduplicated
  campus events and render-state-safe focused UI.
- Pharmacy filtering preserves Chinese and Japanese IME composition; desktop
  and 390px mobile healthcare views were visually inspected.

## [0.14.0] - 2026-07-25

### Added

- A shared, deterministic Live Campus clock. Local date, time slot and lunar
  phase now select two duty incidents every three hours; the same state drives
  room availability, dining rotation, the day’s six classes, room moves,
  weather, BBS activity, transport closures and route delays.
- A trilingual campus operations board and four-proposal governance bell.
  Every proposal exposes three materially different outcomes, deterministic
  stakeholder totals and a replaceable on-device vote; votes enter the My TU
  event ledger and generate a visibly distinct linked BBS reaction.
- A complete My TU academic workbench with four imaginative course assignments,
  autosaved Unicode-capable drafts, instant per-question marking, retained
  answer slips and explanations.
- An 18-minute cross-school methods examination whose clock continues off-page,
  whose answers autosave, and whose completed attempts remain in the on-device
  transcript.
- Thesis and spell-card project dossiers with falsifiable claims, method and
  stopping-rule fields, a three-examiner public defence and scored
  pass/conditional/revise rulings. Completed defences generate two linked BBS
  reactions.
- A combined transcript that keeps every attempt while calculating each
  assessment’s best result, includes assignments, course exams and defences,
  and opens as a printable academic document.
- Static interaction-contract validation plus browser flows for admissions,
  campus services, card continuations, clubs, governance, routes, coursework,
  examinations, defences and transcripts.

### Changed

- Seeded BBS records now carry real deterministic timestamps and display live
  minutes, hours or days rather than fixed age strings. Online/topic totals and
  the last-sync clock follow the active campus shift.
- Dining, room, class and examination services render from current state
  instead of fixed tables. Route delays and closures are applied to graph edges
  before pathfinding rather than appended as decorative notices.
- My TU now compiles governance, assignment, course-exam, research-project and
  defence events into the same on-device lifecycle ledger.
- The campus chronicle records the completed red-thread release using the
  canonical first-parent main SHA and pre-authors the next Live Campus entry.

### Fixed

- Service controls outside the old home-page `#services` section now initialize
  wherever a `[data-service]` action is present. This repairs “find nearby
  facilities”, the Admissions Guide’s application button, the direct online
  application call to action and equivalent subpage service controls.
- Service-dialog close origins now fall back to the page’s map or main content
  instead of a missing home-only anchor.
- Governance-generated BBS posts no longer inherit the incident-post class
  merely because both kinds of records are generated.

## [0.13.1] - 2026-07-25

### Added

- A red-thread contested-closure route for rejected, inconclusive and
  false-confidence incident findings. The flow assigns an in-character
  reviewer, requires a concrete retention reason and explicit second
  confirmation, then records the original verdict instead of pretending the
  theory was established.
- Contested closures now generate visibly marked campus-wire and BBS reactions,
  appear in the My TU event ledger, and retain the reviewer, reason and
  unsupported warning in the on-device case archive.
- The Hieda Chronicle source drawer now shows the canonical main-branch commit
  and, for mechanical GitHub merge commits only, the second-parent functional
  change as separate links and subjects.

### Fixed

- Campus-history validation no longer confuses a merge commit on the
  first-parent main history with the feature/head commit merged into it.
  Historical main subjects are checked exactly, including GitHub `(#N)`
  suffixes and mechanical merge subjects.

### Quality

- Durable contributor guidance now defines canonical squash, merge and
  first-parent history handling, and forbids replacing a main SHA with a local
  branch or PR-head SHA.
- Browser regression coverage now completes both an established incident
  closure and an explicitly confirmed contested closure through archive, BBS,
  news and My TU, and verifies the chronicle's dual-source merge display.
- The red-thread review was visually checked at desktop and 390px mobile
  widths; the full build, localisation, syntax, data and browser suites pass.

## [0.13.0] - 2026-07-25

### Added

- A dedicated, shareable Campus Incident Centre with five fully trilingual
  case files: the latecomer-only bell heard by punctual students, looping
  rabbit shuttles, a flying library book, an early-arriving yesterday headline
  and the dormitory window chair requesting roommate status.
- Each case contains four evidence/record items with source and reliability,
  three testimonies whose speakers retain their institutional conflicts,
  three falsifiable hypotheses and four reversible first responses with visible
  field consequences.
- A persistent research simulator that varies sample size and replication
  while separately modelling controls, randomisation, instrument calibration,
  version locking, confounding, drift, missingness and data/equipment versions.
  Weak designs can produce explicit false-confidence results rather than being
  rescued by a large number alone.
- On-device workbench choices, experiment slips and resolution files using
  `tu:incidents:workbench`, `tu:incidents:experiments` and
  `tu:incidents:resolutions`, with stable `#incident-*` links.
- Every completed simulation and resolution enters the My TU campus ledger.
  Closing a case generates a campus-wire item and three character-specific BBS
  reactions that link back to the source dossier without being mistaken for a
  visitor-authored post.
- Incident cases, methods lab, closure archive and generated BBS reactions in
  full-site search, plus global navigation, home services and My TU summaries.
- A dedicated incident-data validator covering translation completeness,
  identifiers, case structure, evidence types, reversible effects and linked
  reaction records.

### Fixed

- The rotating home news module now initializes from its ticker container, so
  both seeded news and event-generated closure notices actually render.
- The expanded nine-page desktop navigation remains legible at common laptop
  and 1440px widths.

### Quality

- Browser regression coverage follows the complete evidence → hypothesis →
  reversible response → controlled simulation → closure → BBS/news → My TU
  loop, including persistence, deep links and mobile overflow checks.
- Desktop case files and the narrow-mobile simulator were visually inspected
  in addition to all standard i18n, syntax, content and history checks.

## [0.12.0] - 2026-07-25

### Added

- A dedicated, shareable Housing page with five detailed residence files,
  twelve concrete rooms, current vacancies, fees, unusual facilities, warden
  notices and direct `#housing-residence-<id>` links.
- An identity-gated trilingual housing-needs form covering preferred halls,
  room type, budget, sleep, noise, cleaning, cooking, moon response, water,
  wingspan, wall passage, familiars and indoor danmaku. Drafts autosave to
  `tu:housing:draft`.
- Deterministic, explainable allocation with three ranked room-and-roommate
  offers. Every offer shows positive compatibility and likely friction rather
  than reducing the decision to an unexplained score.
- Persistent accept/pass decisions, an active room record, generated
  shared-living agreements and room-transfer requests with a provisional
  alternative. Applications, assignments and transfers remain on-device and
  are retained as history.
- Housing records in My TU, the campus event ledger, full-site search, audience
  navigation, home services, global navigation and the Git-backed campus
  chronicle.
- A housing-data validator and explicit architecture rules for future
  student-lifecycle systems: trilingual data, version-tolerant local storage,
  shared event ledger and render-state-safe focused UI modules.

### Fixed

- Library and course-catalogue live search no longer interrupts Chinese or
  Japanese IME composition. Shared IME-safe input bindings wait until text is
  committed before rerendering results.

### Quality

- Browser regression coverage includes housing deep links, form autosave,
  matching, offer decisions, assignment persistence, shared agreements,
  transfer requests, My TU events, all three languages and mobile layout.
- Existing application, visit, examination, BBS, registration, library,
  identity and campus-ledger storage remains intact.

## [0.11.0] - 2026-07-24

### Added

- A shared-shell, seven-page site architecture. The home portal, academics,
  admissions/examinations, research, campus life/BBS, My TU and the Misty Lake
  Library now build as independent GitHub Pages documents instead of one
  continuously growing page.
- Canonical cross-page routing, active global navigation, page breadcrumbs and
  local section navigation. Existing one-page hashes redirect to the correct
  new page, while search results link there directly.
- A complete trilingual Misty Lake Library containing nineteen imaginative
  holdings with call numbers, authorship, subject, edition, provenance,
  location, autonomous-book behaviour, danger, circulation state, loan period
  and renewal rules.
- On-device circulation using `tu:library:loans` and `tu:library:holds`:
  identity-gated borrowing, course-reserve access, five-item loan bags, holds
  for away-from-shelf books, due dates, renewal limits, returns, cancellation
  and retained history.
- Shareable `#library-<holding>` records, library holdings in full-site search,
  My TU loan/hold totals, campus-ledger events and printable loan receipts.
- A library data validator and a page-aware UI capture option.

### Changed

- Course registration now offers an “eligible now” filter that recalculates
  prerequisites and conflicts immediately after every add/drop. A currently
  enrolled prerequisite can unlock its dependent course without a page reload.
- Course selection and internal catalogue scroll position survive dynamic
  rerenders, so an action on a late catalogue record no longer returns the
  visitor to the first course.
- Chronicle, registrar and library lists now share one tokenised render-state
  utility that restores nested scroll positions, page position, focus and
  input selection after data-driven updates. Selecting an older history record
  no longer sends the archive index back to its first row.
- The 18-credit value is now a soft “danmaku density” warning. It remains
  visible in the registrar but no longer blocks students who knowingly choose
  a heavier load.

### Compatibility

- Existing identity, applications, visits, examinations, BBS, course records
  and campus-ledger data remain readable and are never migrated destructively.
- Old URLs such as `index.html#research-spellcard` retain their hash while
  redirecting to the corresponding canonical subpage.

### Quality

- Browser coverage now traverses all seven pages and exercises legacy route
  redirects, select-popover safety, distinct transport networks, live course
  prerequisites, soft overloads, borrowing, renewal, return, hold cancellation,
  printable receipts, My TU ledger integration and nested-scroll restoration
  in both the registrar and university chronicle.
- The standard check validates 19 library records and all generated pages in
  addition to i18n, JavaScript, courses, examinations and Git-backed history.

## [0.10.0] - 2026-07-24

### Added

- A complete trilingual My TU registrar covering all 35 courses from the seven
  school catalogues, with teacher, room, meeting time, capacity, prerequisites
  and an individual in-world course warning.
- Search and school/seat filters, add/drop, persistent waitlists, the 18-credit
  ceiling, ordinary timetable conflict blocking, nested-book conflicts and
  boundary-adjacent scheduling warnings.
- A saved weekly timetable, waitlist desk and My TU summary/ledger integration
  for enrolment, withdrawal and waitlist events.
- Printable registration confirmations and academic records combining
  completed local transcript entries, current IP coursework and non-credit
  entrance/unified examination evidence.
- Searchable `#course-registration` and `#course-<code>` routes, including
  direct access to an individual catalogue record.

### Compatibility

- Current registration uses `tu:courses:registration`; completed coursework
  uses `tu:courses:transcript`. Existing identity, application, examination,
  visit, BBS and campus-ledger records remain unchanged.
- Legacy array-shaped registration data remains readable and registration
  entries can be backfilled into the campus event ledger.

### Quality

- Browser coverage exercises all 35 records, enrolment, a full-course
  waitlist, a genuine timetable collision, withdrawal, persistence, ledger
  events, both printable documents, Japanese direct-course rendering and
  narrow-mobile overflow.
- Desktop catalogue and mobile registrar views were visually inspected.

## [0.9.0] - 2026-07-24

### Added

- A living, trilingual Hieda university chronicle inside the existing
  Traditions area rather than another standalone homepage section.
- Twelve immersive records covering the complete first-parent project history:
  founding, trilingual access, interactive campus services, seven academic
  catalogues, the select-popover repair, faculty friction, real transport,
  unified-exam evolution, public corrections, My TU and boundary alignment.
- A searchable, filterable archive dialog with stable `#chronicle` and
  `#chronicle-<record>` links, browser Back support, per-record marginalia and
  links to the real Git revision used as each record's source.
- An internal feature-batch roadmap covering course registration, the library,
  housing, incident/research loops, governance and Live Campus.

### Engineering

- Added `npm run check:history` / `npm run history:status`. The checker maps
  every first-parent Git subject to exactly one editorial record, validates
  known commit hashes and permits only one planned next-commit entry.
- Future releases must backfill the previous main SHA and pre-author one
  trilingual history page matching the intended commit/PR title; the durable
  procedure is recorded in `AGENTS.MD`.

### Quality

- Browser coverage opens all twelve records, filters corrections, checks
  Chinese/Japanese/English rendering, follows individual deep links, verifies
  the real Git source and tests close restoration.
- The chronicle becomes the ninth audited deep-link family and includes a
  dedicated mobile overflow/heading-clipping regression.
- Portal, desktop archive and mobile archive views were visually inspected.

## [0.8.1] - 2026-07-24

### Fixed

- Direct `#map-eientei` links now remain aligned to the detailed Eientei map
  after the unified-exam module expands above it and the overview map
  collapses.
- Every school, faculty, research, campus, club, BBS, service and search route
  now declares its canonical background section, preventing shared URLs from
  opening over unrelated content.
- Ordinary section hashes now account for the fixed header and are corrected
  through bounded post-load passes when fonts, images or lazy sections change
  the document height. Pointer, touch, wheel and keyboard input cancels those
  passes immediately so visitor scrolling always wins.

### Quality

- Browser regression coverage cold-loads `#map-eientei` on desktop and mobile,
  injects the late unified-exam layout shift, checks every static hash found in
  site navigation and checks all eight deep-link route families within six
  pixels of their intended target.

## [0.8.0] - 2026-07-24

### Added

- My TU, a trilingual on-device student-record centre where visitors create a
  campus identity with a local student number, species/identity, origin,
  preferred school and lunar/housing needs.
- A unified campus event ledger that backfills existing applications, entrance
  exams, unified exams, visit reservations and BBS posts, then records new
  submissions and removals without uploading personal data.
- Joint faculty application review. Each school convenes three recognisable,
  disagreeing reviewers; the saved decision combines the applicant's question,
  method, needs and best on-device examination evidence.
- Printable admission/selection letters containing application and review
  references, the reviewing school, decision conditions, committee signatures
  and an on-device verification weave.
- My TU entry points in the desktop header, mobile navigation, campus services
  and full-site search.
- A `--storage='<json>'` UI-capture option for visually checking populated
  local-only states without hand-editing browser profiles.

### Fixed

- Closing a card on mobile now returns to the exact page and scroll position
  from which it was opened.
- Moving from one card or search layer into another service/card replaces the
  active overlay route instead of stacking it, so closing the final view no
  longer resurfaces a stale deep link.

### Changed

- Renamed the public Traditional Chinese “幻想鄉高考” label to the more
  setting-appropriate “幻想鄉統一學力試驗” (short form: “統一試驗”) across
  the website, search, My TU and printable papers. Existing `#gaokao` routes,
  download paths and `tu:gaokao:*` local records remain compatible.

### Compatibility

- My TU compiles the existing `tu:application:submissions`, `tu:visits`,
  `tu:exam:history`, `tu:gaokao:attempts` and `tu:bbs:posts` stores without
  rewriting or deleting them. New identity, review and event data use separate
  versioned storage keys.

### Quality

- Browser coverage now creates an identity, aggregates all five existing
  record families, performs a three-professor review, opens a printable
  decision and verifies its 121-cell mark.
- Mobile regression coverage closes both a direct content card and a nested
  card-to-service flow, asserting the original `#campus` route and scroll
  position are restored within four pixels.
- My TU onboarding, populated dashboard, mobile identity card and printable
  notice were visually inspected.

## [0.7.1] - 2026-07-24

### Fixed

- Removed a rotated-answer contradiction in EXTRA question `EX-M01`: its
  online and offline key correctly shows D after balancing, while the
  explanation now identifies the `G–W–E` route instead of incorrectly saying
  “option B.”
- Made LUNATIC route question `LU-M01` explicit that the three-minute
  verification at B must finish before boarding and that a departed service
  cannot be boarded.
- Reframed `LU-M03` as five completed daily updates followed by that night's
  full-moon settlement, and stated the composition order as `τ∘σ⁵`.

### Changed

- Online instructions, offline covers and higher-difficulty dossier labels now
  state that lunar phase, time, route and version conditions are self-contained
  within each question rather than inherited from the live campus map.

### Quality

- Unified-exam validation now rejects trilingual explanations that hardcode
  choice letters, preventing future answer-position rotation mismatches.
- Browser regression coverage checks the self-contained-state rule and the
  corrected EXTRA offline answer explanation.

## [0.7.0] - 2026-07-24

### Added

- Four genuine Gensokyo Unified Examination difficulties: NORMAL, HARD,
  LUNATIC and EXTRA, each available for humanities and sciences tracks while
  retaining four subjects and a 150-mark total.
- Forty-five new trilingual higher-difficulty dossier questions. LUNATIC
  requires cross-reading lunar conditions, route graphs, policy versions and
  conflicting testimony; EXTRA follows cache versions, sensor calibration,
  failure timelines, archival selection and identifiable experiment designs.
- A discoverable on-device unified-exam answer archive with full answers,
  per-subject scoring, completion references and reopenable item explanations.
- Full, reopenable on-device answer records for the four timed entrance-exam
  banks while retaining older score-only summaries.
- Autosaved campus-visit drafts and a “My Campus Visits” archive with visitor
  passes, dates, party size, arrival gate, access needs and local deletion.
- Forty-eight self-contained offline unified-exam files covering three
  languages, two tracks, four difficulties and separate paper/answer editions.

### Changed

- Replaced the former lettered-paper naming with Touhou-style difficulty names
  throughout the website, downloads and printable covers.
- Rebalanced every online/offline unified paper so correct choices are evenly
  distributed across A, B, C and D.
- The UI capture helper now waits for lazy-loaded click targets and accepts a
  `;;`-separated sequence for capturing multi-step interactions.

### Compatibility

- Existing application, visit and BBS records remain under their original
  storage keys. Legacy unified-exam drafts are migrated to NORMAL without
  changing the intended selected options; old score-only exam records remain
  visible as summaries.
- Removed the twelve obsolete `GKE-2026-A` generated downloads after replacing
  them with the 48 difficulty-specific files.

### Quality

- Browser regression coverage now submits and reopens full entrance-exam and
  EXTRA answer records, restores a visit draft, reopens a stored visitor pass,
  verifies all four difficulty selectors and downloads an offline EXTRA paper.
- All eight unified papers total 150 marks; NORMAL answer keys are balanced
  6/6/6/6 and every higher paper is balanced 3/3/3/3 across A/B/C/D.
- W3C Nu validation passes with zero errors or warnings. Lighthouse desktop
  scores are Performance 97, Accessibility 100, Best Practices 100 and SEO
  100; mobile scores are 74, 100, 96 and 100 respectively.

## [0.6.0] - 2026-07-24

### Added

- Central deep-link routing for school catalogues, faculty profiles, research
  files, clubs, BBS threads and campus-service dialogs. Opening an item now
  updates the URL, browser Back closes or restores the previous layer, and
  direct links such as `#research-spellcard` open the intended record.
- A copy-link affordance on shareable content views plus full-site search
  across schools, faculty, research, services, clubs, BBS records and campus
  destinations, with `/` and `Ctrl/Cmd+K` keyboard access.
- Visitor, Applicant and Current Student campus gateways with four relevant
  destinations each and a locally remembered audience choice.
- A focused Eientei and Bamboo Forest map with ten named locations, live local
  date/time, calculated lunar phase, a lunar preview control and real
  shortest-path changes for full-moon diversions, new-moon shortcuts, night
  lantern routes and the day's shifting bamboo direction.
- The 2026 Gensokyo Unified Higher Examination: separate humanities and
  sciences tracks, four subjects and 24 questions per track, 150 marks,
  90-minute timer, autosaved answers, instant subject scoring, answer review
  and on-device attempt history.
- Twelve self-contained offline examination files covering three languages,
  two tracks and separate question/answer editions; each can be printed or
  saved as PDF without a connection.

### Changed

- Mobile campus-map nodes retain compact, high-contrast place names instead of
  hiding every label on narrow screens.
- The release build now minifies the generated CSS, assigns asynchronous image
  decoding, delays rendering of off-screen sections and lazy-loads the large
  unified-examination module near its section.
- Recompressed the mobile hero derivative from roughly 101 KB to 70 KB and
  expanded the image helper with an optional ffmpeg WebP encoder.

### Quality

- Browser regression coverage now exercises browser Back and direct hashes,
  search-to-record navigation, audience persistence, lunar-phase route
  changes, the 24-question unified exam, offline-file availability and mobile
  map-label visibility.
- W3C Nu validation passes with zero errors or warnings.
- Lighthouse scores: desktop Performance 97 and all other categories 100;
  mobile Performance 77 with Accessibility, Best Practices and SEO at 100.
  Mobile LCP improved from the prior 6.3-second baseline to 5.1 seconds.

## [0.5.0] - 2026-07-24

### Added

- An interactive Office of Unresolved Matters with six trilingual case files
  covering Aya's headline corrections, Marisa's unexplained materials,
  Yukari's moving classroom, Nitori's 129-day tape repair, Reimu's travelling
  donation box and Patchouli's century-scale loan dispute.
- A dedicated Faith & Coexistence faculty council for Byakuren, Kanako, Miko
  and Sanae, plus Eiki as external appeals examiner.
- A new hand-painted faculty-council illustration set in a weathered,
  patched-up seminar room, with a donation box, obsolete Outside recorder,
  rain-wrinkled papers, sake cups and kappa tape repairs.
- Mode-coloured route segments and live path lines on the campus map.

### Changed

- Campus navigation now performs shortest-path search over a walking layer plus
  real, mode-specific networks. Brooms use four berths, tengu use three fixed
  wind stops, and the moon-rabbit shuttle runs only between Boundary Hall and
  Eientei; each mode now produces a different Gate–Kappa route.
- Faculty profiles now include unresolved incidents and portray rules rubbing
  against each character's motives instead of presenting uniformly ideal
  professors.
- Added deliberately handmade visual layers: taped case notes, correction
  stamps, a kappa repair notice and a Hakurei Gate donation-box tally.

### Fixed

- The eighth Campus Services tile, “入學試驗 / Take an Exam,” once again shows
  readable text; its deep-blue special background was previously overwritten
  by the later generic tile rule, leaving white text on a pale surface.

### Quality

- Browser coverage now proves that all four transport modes generate distinct
  paths and segment types, verifies rendered SVG route lines, opens faculty
  case files and Faith profiles, checks unresolved incidents, and guards the
  entrance-exam tile's computed foreground/background styling.
- W3C Nu validation passes with zero errors or warnings. Lighthouse
  accessibility, best-practices and SEO scores are 100 on desktop and mobile;
  desktop performance is 97.

## [0.4.1] - 2026-07-24

### Added

- Discoverable “My Applications” records stored in the visitor's browser,
  including references, submission times, selected schools and expandable
  application details.
- Automatic application-draft saving and restoration, with a visible
  on-device status panel.
- BBS compose-draft autosave, a “My Posts” filter, a local-post count and an
  empty-state explanation before the first post.

### Fixed

- Information cards without a destination no longer expose an inert
  “Continue” button; cards with real actions retain their labelled controls.
- Applying from a school catalogue now preselects that school in the
  application form while still allowing the applicant to change it.
- Newly published BBS threads are immediately revealed under “My Posts”
  instead of remaining hidden by the previously selected board filter.
- Locally authored BBS timestamps now reflect elapsed time after a reload.

### Quality

- Browser regression coverage now checks actionless and actionable info cards,
  school-to-application context, application and BBS draft restoration,
  submitted-application history and the “My Posts” view.
- Device-local record interfaces were visually checked at 1440 px and 390 px.

## [0.4.0] - 2026-07-24

### Added

- A graph-based campus route planner with origin/destination switching,
  shortest-path navigation, live arrival time and distance estimates.
- Four distinctive travel modes: village walking, magic broom, tengu express
  windway and moon-rabbit shuttle, each with trilingual operating guidance.
- Route highlighting on the illustrated map and responsive step-by-step
  itineraries.
- Full trilingual catalogues for all seven schools, covering awards, duration,
  graduation credits, intake, tuition, core courses, studios, fieldwork,
  progression requirements, additional costs and graduate paths.
- A six-part spell-card systems study covering readability, telegraphs,
  movement differences, exit design, a rain-affected field trial and an open
  three-question review standard.

### Changed

- Academic-school rows now open their own catalogues instead of jumping to the
  faculty section.
- Redesigned the admissions guide and online-application actions as a coherent
  two-card portal with a clearer primary action and deadline.
- Changed the research-card layout to a balanced two-column grid for the new
  fifth research record.

### Quality

- Browser smoke coverage now verifies all seven school triggers, catalogue
  curriculum and tuition, four route modes, calculated path markers, live
  estimates and the complete spell-card research file.
- Three-language coverage now includes 304 interface records and 275 static
  public strings.
- Desktop and 390 px mobile visual checks cover school catalogues, admissions,
  route planning and the expanded research grid.

## [0.3.0] - 2026-07-24

### Added

- Four timed, trilingual entrance-exam banks with 32 questions, shuffled order,
  instant client-side scoring, category breakdowns, full answer explanations,
  retakes and locally stored personal-best history.
- Illustrated map place cards for all seven campus locations, including four
  newly generated and web-optimised environmental scenes.
- Detailed interactions for eight clubs, three campus-life gallery stories and
  every rotating news item.
- Fifteen trilingual campus news records and eighteen trilingual BBS seed
  threads, randomly selected and reshuffled on demand.
- Reusable `npm run capture` visual-regression helper for capturing any section
  at desktop or mobile sizes, with an optional interaction trigger.

### Fixed

- Native select popovers no longer make application, room, visit or BBS dialogs
  close by being mistaken for backdrop clicks.
- Added browser regression coverage for selects in both admissions and BBS
  dialogs.

### Changed

- Restyled research actions, BBS controls, clubs and campus gallery affordances
  to match the university's ink, paper and vermilion interface system.
- Upgraded map nodes to update a responsive image, category, description and
  operational metadata card with keyboard support.
- Campus news now rotates every 45 seconds; BBS topics and activity totals can
  be refreshed without losing locally authored posts.

### Quality

- Browser smoke coverage now includes select regression, dynamic news, club
  dialogs, illustrated map updates, a complete scored exam attempt, BBS
  persistence and mobile overflow.
- Desktop and 390 px mobile visual checks cover exam lobby/questions, map place
  cards, club dialogs and redesigned research controls.
- Desktop Lighthouse: Performance 98, Accessibility 100, Best Practices 100,
  SEO 100; HTML validation passes with zero errors.

## [0.2.0] - 2026-07-24

### Added

- Traditional Chinese, Japanese and English language switching with local
  preference persistence and coverage checks for all static page copy.
- Online application with drafts, validation, local records and application
  references.
- Campus-visit reservation with local records and visitor-pass references.
- Live-style library/classroom vacancy finder, dining menus, daily timetable
  and examination schedule.
- Interactive campus map with seven locations and trilingual details.
- Motto, university uniforms, anniversary and founding-festival traditions.
- Four complete imaginative research records with methods, findings, field
  notes and next steps.
- Campus BBS with filters, posting and local persistence.
- Eight faculty portraits in two interchangeable art directions, plus a
  university-uniform illustration.
- Browser smoke test covering languages, applications, room availability,
  research, BBS and mobile navigation.
- Reusable build, live-preview, section scaffolding, i18n, JavaScript checking,
  portrait switching and image optimisation scripts.

### Changed

- Replaced the monolithic page with modular sections, data, JavaScript and
  feature styles under `src/`.
- Made `index.html` and `styles.css` generated GitHub Pages artifacts.
- Expanded faculty profiles and research content while keeping public copy
  immersive.
- Kept fan-work notices at the top and footer while removing internal
  editorial labels from normal university content.

### Quality

- 267 static public text strings covered in three languages.
- Automated JavaScript syntax checks across all source and helper scripts.
- Desktop and 390 px mobile layouts pass horizontal-overflow checks.
- Lighthouse: Performance 93, Accessibility 100, Best Practices 100, SEO 100.
- HTML validation passes with zero errors.

## [0.1.0] - 2026-07-24

### Added

- Initial responsive Touhou University website.
- School introduction, seven academic schools and eight faculty profiles.
- Admissions timeline, research overview, campus-life gallery and FAQ.
- Four original campus illustrations.
- Research pack covering sources, character mapping and asset provenance.
- Public GitHub repository and GitHub Pages deployment.

### Quality

- HTML validation passed.
- Lighthouse scores: Performance 95, Accessibility 100, Best Practices 100,
  SEO 100.
