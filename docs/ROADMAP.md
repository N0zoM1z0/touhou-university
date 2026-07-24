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

Recommended next.

- searchable course catalogue derived from school and faculty data
- add/drop, waitlists, capacity, prerequisites and real timetable conflicts
- Touhou-specific conflicts involving moon phases, nested classrooms and
  boundary-adjacent courses
- saved enrolments, course events in the campus ledger, My TU timetable and
  printable registration confirmation

## Batch 3 — Usable library

- searchable holdings, editions, danger levels and unusual availability states
- borrowing, holds, renewal, returns and on-device loan history
- course prerequisites and exam outcomes unlock restricted holdings
- lost-book reports and printable loan receipts

## Batch 4 — Housing and roommate allocation

- needs questionnaire, residence matching and compatibility reasoning
- full-moon, wing-span, water, familiar, sleep-danmaku and wall-use constraints
- saved assignments, room-change requests and generated dorm incidents

## Batch 5 — Incident and research loop

- incident response centre with evidence, testimony, hypotheses and reversible
  actions
- research-lab simulator with confounding, drift, missingness and version
  changes
- publishable incident dossiers and research records
- BBS/news reactions generated from resolved campus events

## Batch 6 — Thesis, governance and live campus

- thesis supervision, committee review, spell-card defence and graduation
- public proposals, amendments, stakeholder voting and policy consequences
- explicit Live Campus versus Scenario/Exam state
- time, moon and season affecting facilities, dining, routes, timetable,
  library and BBS together

## Cross-cutting tracks

- official document generator grows alongside every lifecycle feature
- unlocks should reveal new campus content rather than generic badges
- open datasets and a small data explorer should connect research, exams and
  incident evidence
