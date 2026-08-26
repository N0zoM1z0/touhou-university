# Touhou University implementation history and future directions

This document records the dependency-aware feature batches that built the
current site. Its document role is implementation history, not current
authority or an automatic task queue. It is **not** a promise that every
historical “follow-up” remains the next task.

- Current release, counts and ownership: `docs/CURRENT_STATE.md`
- Durable implementation procedure: `docs/AGENT_HANDBOOK.md`
- User-visible release detail: `CHANGELOG.md`

The original idea inventory lived in `/tmp/vc_sth.txt`; `/tmp` is ephemeral and
must not be required to understand or maintain the repository. Historical
follow-up bullets below are idea provenance only. New work begins from the
user's current request and current source, not by automatically implementing
the oldest follow-up.

## Foundation already in place

- My TU local identity and student lifecycle
- joint professor application review and printable decisions
- unified campus event ledger
- persistent applications, visits, exams and BBS posts
- shareable deep links and trilingual public UI

## Batch 1 — Living campus chronicle

Status: implemented in 0.9.0.

- map every first-parent Git commit to one immersive campus-history entry
- preserve the real commit subject as the editorial source
- expose the chronicle through the existing Traditions area, search and
  shareable `#chronicle-*` routes
- fail validation when a commit is not represented

## Batch 2 — Course registration and transcript

Status: implemented in 0.10.0.

- searchable course catalogue derived from school and faculty data
- add/drop, waitlists, capacity, prerequisites and real timetable conflicts
- Touhou-specific conflicts involving moon phases, nested classrooms and
  boundary-adjacent courses
- saved enrolments, course events in the campus ledger, My TU timetable and
  printable registration confirmation
- printable academic records include completed local transcript entries,
  current IP coursework and non-credit examination evidence

## Batch 3 — Usable library

Status: core circulation implemented in 0.11.0.

- nineteen searchable trilingual holdings with editions, provenance, danger,
  autonomous tendencies and unusual availability states
- borrowing, holds, renewal, returns and retained on-device circulation history
- current or completed course records unlock course-reserve holdings
- printable loan receipts, shareable holding hashes, full-site search, My TU
  summary and campus-ledger integration
- follow-up: lost-book reports and examination-result access rules

## Batch 4 — Housing and roommate allocation

Status: implemented in 0.12.0.

- needs questionnaire, residence matching and compatibility reasoning
- full-moon, wing-span, water, familiar, sleep-danmaku and wall-use constraints
- saved assignments, room-change requests and generated dorm incidents
- five shareable residence files, twelve concrete rooms and nine trilingual
  potential-roommate profiles
- My TU summary, full-site search and campus-ledger integration

## Batch 5 — Incident and research loop

Status: implemented in 0.13.0.

- five shareable incident files with evidence, testimony, hypotheses and
  reversible actions
- persistent research-lab simulator with confounding, drift, missingness,
  version changes, false-confidence outcomes and retained experiment slips
- on-device closure files, My TU summary and campus-ledger integration
- three BBS reactions and one campus-wire item generated from every resolved
  case, all linked back to the source dossier
- reviewer-signed red-thread preservation for rejected, inconclusive and
  false-confidence findings, with explicit confirmation and an unsupported
  warning retained across the archive, BBS, campus wire and My TU

## Batch 6 — Thesis, governance and live campus

Status: core workbench and operations layer implemented in 0.14.0.

- four marked course assignments, a timed methods examination, retained
  answers, per-question explanations and a printable combined transcript
- thesis/spell-card project dossiers, three-examiner simulated defence, stored
  rulings and two linked BBS reactions per completed defence
- four public proposals with stakeholder counts, three policy outcomes,
  replaceable on-device voting, My TU events and BBS linkage
- one deterministic Live Campus clock separated from examination fixtures;
  date, three-hour shift and lunar phase jointly affect facilities, dining,
  routes, timetable and BBS state
- real route closures/delays and room changes rather than copy-only status
- follow-up: long-running supervision milestones, amendments, enacted-policy
  expiry, graduation review and season-level operations

## Batch 7 — Eientei campus healthcare

Status: implemented in 0.15.0.

- two-site care network joining the Hakurei Gate infirmary and Eientei
  University Hospital, with live shift, lunar and campus-incident pressure
  reflected in queue estimates
- autosaved symptom triage, explicit urgency reasoning, check-in,
  consultation, retained prescriptions and printable care records
- twelve trilingual medicines and aids with indications, cautions, provenance,
  dosage and stock states; dispensing and every completed dose remain on-device
- six four-stage recovery programmes covering ordinary rest, bamboo-route
  orientation, spell-card rehabilitation and stranger conditions
- named waiting-room patients, pharmacy/recovery BBS reactions, shareable
  clinic routes, full-site search, map links, My TU and campus-ledger integration
- follow-up: appointment slots, long-term condition review, stock procurement,
  ward beds and incident-driven mass-casualty drills

## Batch 8 — Navigation, documents and live facilities

Status: implemented in 0.16.0.

- two grouped global navigation cabinets separate university/academic
  information from admissions and student services; active-page state remains
  visible at the top of every generated page
- one shared print-document root copies already rendered My TU decisions,
  registration records, academic transcripts, library receipts and clinical
  slips into an A4 layout before invoking print or PDF save
- joint faculty review preserves distinct readings of each application's
  question, method and declared field needs instead of repeating one generic
  character note
- facility hours, closures and vacancy counts derive from the shared Live
  Campus clock across the room finder, map and library; the map's wooden notice
  rotates with the same state
- page-specific CSS bundles, parallel feature initialization, first-use search
  loading, responsive image derivatives and a readability pass reduce initial
  work without flattening the visual identity
- deep route targets exist in dynamically rendered library, clinic, housing and
  academic views; malformed fragments fail safely and bounded alignment remains
  cancellable by real visitor input
- static interaction checking now validates only the document shell while the
  browser regression suite owns actual behaviour, printable content and
  historically observed failures

## Batch 9 — Kourindou drift-object appraisal

Status: implemented in 0.17.0.

- eight trilingual Outside World object dossiers with physical condition,
  observations, competing original-use hypotheses, non-invasive tests and
  plausible new lives in Gensokyo
- a shared Kourindou/library bench where Rinnosuke, Ran, Nitori and Kogasa
  remain usefully incompatible over names, provenance, mechanisms,
  disassembly and object agency
- per-object autosave, retained records and direct links to every object and
  completed appraisal
- explicit red-pencil preservation for an interesting unsupported hypothesis;
  reviewer, reason, confirmation and the unsupported verdict must travel
  together into the archive and BBS
- live desk conditions, My TU/ledger integration, full-site search and derived
  library/BBS discussion
- follow-up: visitor-submitted object sketches, cross-record provenance chains,
  repair-lab appointments and seasonal Outside World drift batches

## Batch 10 — Operable spell-card design and ethics workshop

Status: implemented in 0.18.0.

- five formula-driven Canvas patterns with a 72-shot ceiling, direct
  keyboard/pointer flight, live parameter controls and shared campus
  conditions, without adding a large physics/runtime dependency
- six independent reviewers covering rules/exits, expression/reproduction,
  audience readability, collision/runtime stability, stimulation/stopping and
  shared sound/play; no aggregate ethics score
- autosaved draft, sealed revisions, exact design routes and printable dossiers
- three-seat public defence with three real questions, retained ruling,
  conditions and named dissent
- My TU/ledger integration and three derived BBS versions linked to the exact
  defence
- dynamic route alignment re-resolves replaced focused records, with the
  drift-object shelf click kept as the regression that first exposed it
- follow-up: visitor-authored pattern sharing without a server, inter-design
  tournament brackets, venue booking and course credit for defended revisions

## Batch 11 — Hidden dream campus / PHANTASM curriculum

Status: implemented in 0.19.0.

- no ordinary navigation entry and no password: six reverse-side seals appear
  only after a marked assignment, governance vote, incident closure, declined
  housing offer, dropped course and a completed defence that explicitly
  records an unused route
- low-volume clues surface through the footer, My TU reverse timetable, map
  notice, full-site search and BBS without identifying a destination too early
- a gated `phantasm.html` contains six ninth-period courses, a six-node map
  whose geometry changes with the ninth bell, counterfactual records generated
  from the visitor's actual untaken choices, and a three-course enrolment limit
- Doremy, Yukari, Keine and Reimu conduct a reverse public defence that retains
  ruling, conditions and dissent in printable `TU-DREAM-TRANSCRIPT` records
- dream state and transcripts remain strictly separate from the official
  campus ledger and My TU; opening, enrolling, defending and waking may never
  manufacture official lifecycle events
- follow-up: dream-only library circulation disputes, mutually exclusive
  semester calendars and a second dream reached by declining the first dream

## Batch 12 — Lunar boundary and changing dream identity

Status: implemented in 0.20.0.

- the six lifecycle seals remain the non-negotiable qualification layer; date,
  eight-phase lunar age and three-hour duty bell now rotate the live entrance
  among footer, My TU, map notice, full-site search and BBS
- each local day has two ordinary opening slots, with a third and a second
  simultaneous entrance at new or full moon; schedules are deterministic
  enough to leave clues without turning into a visible countdown puzzle
- three distinct wrong doors on first entry, or two after a previous dream,
  wear a six-hour session seam through the boundary so unlucky visit timing
  cannot produce permanent lockout
- successful entry removes the query trace and replaces the ordinary
  university name, crest, favicon, theme colour and footer motto with one of
  four moon-profile identities; the ordinary shell returns after waking
- boundary attempts and session passage remain isolated from the campus ledger
  and dream transcript; waking explicitly clears the temporary passage
- follow-up: seasonal entrance riddles, dream-brand print seals and a route
  whose active source depends on what the visitor last refused inside PHANTASM

## Batch 13 — Unified on-device records cabinet

Status: implemented in 0.21.0.

- a focused `records.html` subpage inventories localStorage and sessionStorage
  under the `tu:` namespace; it launched with 50 known records and now
  catalogues 71 keys across twelve known shelves, plus a runtime shelf for
  future unknown keys
- every stored file exposes its record count, exact UTF-8 footprint, storage
  location, visibility scope and escaped raw contents without uploading them
- the usage desk combines the university-file byte total with the browser's
  optional origin-wide storage estimate and clearly distinguishes device,
  interface, dream and tab-session visibility
- one-click export creates a versioned JSON archive with a SHA-256 integrity
  seal; import validates the whole box before writing and offers explicit
  preserve-current or overwrite-same-name collision policies
- deletion works per file, per shelf or across every `tu:` record after a
  confirmation, while failed quota writes roll back the complete import
- the PHANTASM session passage appears only after it exists and is always
  excluded from portable archives; reverse-side files remain separate from
  the official campus ledger
- follow-up: user-selected partial export bundles and human-readable paper
  manifests alongside the lossless JSON archive

## Batch 14 — Gensokyo research ethics review board

Status: implemented in 0.24.0.

- five independent seats review risk/stopping, mental access, record
  deletion/forgetting, rights/appeal and field enforceability without a total
  score
- five complete specimen disputes, autosaved drafts, immutable versioned
  protocols, amendments, withdrawal, printable rulings, My TU, BBS, incident
  and Hieda projections
- follow-up: scheduled continuing review, adverse-event intake and
  reviewer-recusal records

## Batch 15 — Spring lantern / boundary festival operations

Status: implemented in 0.25.0.

- two festival dossiers with route, airspace, danmaku, capacity, power, food,
  fairy, aid, gate, press and Prismriver decisions
- six independent permit desks; returns block opening while conditions and
  objections survive into the formal file
- four-case live operations drawn from seven Gensokyo incidents, with
  response-dependent attendance, delay, power, clinic and dispute outcomes
- live operation slips merge into campus routing and Eientei pressure, then
  release at closure; permits and reports reach My TU, BBS, search, records and
  Hieda dossier 09
- follow-up: multi-day volunteer rosters, stall stock ledgers and a second
  night whose route inherits unresolved objections from the first

## Batch 16 — Domestic placement and field-inquiry passport

Status: implemented in 0.26.0.

- 24 trilingual field stations across eight regions, including the Scarlet
  Devil Mansion, Hakugyokurou, Kourindou, Eientei, Chireiden and the Blazing
  Hell ruins; every file carries entry rules, supervisor/friction, risk,
  ethics, equipment, work, sources, route conditions and a distinct seal
- autosaved dispatch questions with ability and exit plans; approval and
  conditional approval remain qualitative and never collapse risk into a score
- check-in, one of 12 rotating complications, three non-equivalent first
  responses, provenance-aware return logs, incident annexes and explicit
  research-data disposition
- printable dispatch, return and passport files; first visits and repeat seals
  coexist, while My TU, map notices, full-site search, BBS, records and five
  causal events project the same lifecycle
- Hieda dossier 10 links Scarlet timekeeping, Hakugyokurou phantom headcounts,
  Kourindou object testimony, Chireiden unsubmitted thought, local events and
  the exact first-parent chronicle version
- follow-up: supervisor countersignatures across two devices, multi-day
  placements and route handoff between neighbouring stations

## Batch 17 — Property, post and academic calendar

Status: implemented in 0.27.0.

- ten object-led lost-property/property-rights files with four independent
  jurisdictions and retained claims/rulings
- a versioned Crow-Tengu Campus Post with local dispatches, acknowledgement,
  correction, trust and delivery-order state
- fourteen annual/lunar academic-calendar events that project into facilities,
  routes, courses, dining, clinic, BBS, My TU and Hieda

## Batch 18 — Graduation, careers and alumni

Status: implemented in 0.28.0.

- an eight-desk graduation audit that reads evidence from owning domains
  instead of copying a second checklist
- twelve substantive destination files with fit, friction, compensation,
  refusal boundaries and causally linked referrals
- eight unresolved-question alumni chapters, local alumni files, reunion
  replies and returning fieldwork mentorship

## Batch 19 — Employment market and whereabouts hearing

Status: implemented in 0.29.0–0.29.1.

- twenty-one detailed Gensokyo vacancies with actual duties, compensation,
  dangerous clauses, trials and employer-specific replies
- five counting bases, five observation windows and eight overlapping graduate
  outcomes that explicitly refuse one promotional employment percentage
- device-local odd résumés, employer first reviews, applicant edition-two
  replies and whereabouts attestations
- one distinct, compressed monochrome recruitment poster for every vacancy

## Batch 20 — Portable agent handoff

Status: implemented in 0.30.0.

- a standard repository `AGENTS.md` entry point that a fresh Codex can discover
- a source-derived current-state snapshot, cross-cutting handbook and separated
  domain-invariant reference
- repository-owned changelog/research indexes and a documentation validator so
  page, key, event, Hieda and employment counts fail loudly when they drift

## Batch 21 — First Bell new-student arrival

Status: implemented in Unreleased.

- a public arrival office with a strict formal-admission gate: conditional,
  supplementary, interview and pending-review editions remain visible but do
  not become new-student records early
- one referenced on-device file that reuses the live campus route graph, keeps
  a personally recognisable stop signal separate from detour notification and
  opens a real first course, housing, society or festival destination
- four causal official events, printable arrival slip, My TU next action,
  newcomer home path, Search, nameless BBS and Hieda projections
- three complete public languages and an original paper, ink and vermilion
  visual system with focused lifecycle and browser verification

## Future directions, not commitments

- official document generator grows alongside every lifecycle feature
- unlocks should reveal new campus content rather than generic badges
- open datasets and a small data explorer should connect research, exams and
  incident evidence
