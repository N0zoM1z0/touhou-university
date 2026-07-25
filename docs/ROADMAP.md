# Touhou University feature batches

This roadmap turns the idea inventory in `/tmp/vc_sth.txt` into dependency-aware
batches. It is an internal implementation document, not public website copy.

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

## Cross-cutting tracks

- official document generator grows alongside every lifecycle feature
- unlocks should reveal new campus content rather than generic badges
- open datasets and a small data explorer should connect research, exams and
  incident evidence
