# Domestic placement and field-inquiry passport notes

Research and implementation date: 2026-07-26
Public implementation: `fieldwork.html`

## Editorial premise

The fieldwork passport is an academic workflow, not a tourism checklist.
Going somewhere is insufficient: a student states a question, receives a
dispatch order, checks the site's entry conditions, encounters something that
does not follow the plan, records a first response, and returns observation
with provenance, incident notes and an explicit research-use decision.

A seal certifies that traceable learning returned. It does not certify that a
host agreed with the student's conclusion, that a dispute was resolved, or
that the site remained stable while the form was being completed.

The initial brainstorm named only eight broad locations. The implemented
system expands these into 24 distinct stations, so major social, religious,
lunar, afterlife and underground settings are not compressed into generic
“fieldwork.”

## Character and setting anchors

Working character dossiers from
`/home/pentester/Project/gensokyo-monochrome-heart/skills/touhou-character-*`
were used to preserve recognisable frictions:

- Sakuya's time manipulation makes Scarlet Mansion sequence logs meaningful
  while elapsed-time claims remain disputed; Patchouli creates library,
  source-version and access constraints rather than generic magic ambience.
- Youmu's half-human/half-phantom role makes phantom headcounts and garden duty
  operational questions; Yuyuko turns presence, appetite and guest counts into
  a deliberately unstable register at Hakugyokurou.
- Rinnosuke can identify names and likely uses of Outside World objects, while
  wear, actual operation and the object's own response may disagree.
- Satori makes access, repetition, recording, analysis and publication
  separate decisions; “not written down” is not treated as “not processed.”
- Eirin, Reisen and Tewi make Eientei and the Bamboo Forest different stations:
  clinical exposure and source quality at one, route reproducibility and
  deceptive shortcuts at the other.
- Kanako, Sanae, Byakuren and Miko preserve competition over infrastructure,
  public space, recruitment and “the sole entrance,” instead of becoming one
  frictionless faith-services department.
- Aya can teach correction while publishing before the fieldworker returns;
  Marisa can value reproducibility while producing materials of uncertain
  custody. The system keeps these contradictions visible.
- Reimu's rule remains practical: an exit and a stopping signal must work in
  the field, not merely read well in a permit.

These are internal design anchors. Public station copy remains fully
in-universe and does not expose editorial labels.

## Station network

The 24 stations are grouped for filtering and map legibility, not to imply
that their borders are uncontested:

1. Hakurei Shrine — boundary seam patrol and donation-box evidence.
2. Human Village / Terakoya — oral history, notice correction and public life.
3. Hieda Residence — versions, missing leaves and contradiction indexing.
4. Kourindou — drift-object names, use and provenance.
5. Misty Lake — ecological transects and fairy disturbance.
6. Scarlet Devil Mansion — stopped-time duty logs and relative chronology.
7. Forest of Magic — reproducibility and material custody.
8. Alice's Workshop — autonomous dolls and authorship.
9. Garden of the Sun — seasonal ecology and territorial stopping rules.
10. Nameless Hill — toxic exposure and Medicine's refusal.
11. Youkai Trail / Night Sparrow stall — foodways, song and witness effects.
12. Youkai Mountain / Bunbunmaru — reporting, embargo and source correction.
13. Genbu Ravine — kappa prototypes, calibration and tape-repaired equipment.
14. Moriya Shrine — faith infrastructure, power and ownership claims.
15. Giant Toad Pond — sanctuary ecology and offerings.
16. Myouren Temple — coexistence, night shelter and recruitment boundaries.
17. Hall of Dreams' Great Mausoleum — public petitions and ten simultaneous
   accounts.
18. Eientei — lunar medicine, exposure and confidential care.
19. Bamboo Forest — route reproducibility, rescue markers and shortcut bias.
20. Hakugyokurou — phantom census, garden work and feast attendance.
21. Sanzu River — fare, distance, testimony and jurisdiction.
22. Former Hell / Old Capital — contest rules, damage and post-feast repair.
23. Chireiden — mental privacy, unsubmitted information and animal care.
24. Hell of Blazing Fires — nuclear heat, cooling versions and evacuation.

## Workflow and data decisions

- `tu:fieldwork:draft` keeps one autosaved dispatch draft.
- `tu:fieldwork:placements` keeps every dispatch, permit, check-in,
  complication response, return log and supervisor review.
- `tu:fieldwork:passport` keeps passport identity and immutable visit seals.
- Only checked-in/responded duty blocks another departure. Several future
  permits may exist, but one passport cannot be actively outside twice.
- Risk is never averaged into a score. Missing equipment or an unsuitable exit
  route creates explicit conditions.
- Each site maps to one of 12 complications; every complication has three
  materially different first responses producing clear, conditional or
  contested evidence posture.
- Direct observation, source kind, source/version note, evidence code,
  incident type, incident annex and research disposition remain distinct.
- First visits grant the station's normal credit. Repeat visits receive a
  0.25-credit return seal and never overwrite the first record.
- The five formal events form one causal chain:
  `fieldwork.application.submitted` →
  `fieldwork.departure.checked` →
  `fieldwork.complication.handled` →
  `fieldwork.observation.logged` →
  `fieldwork.return.certified`.
- Search, My TU, map notices and BBS are projections from the same station and
  placement data. They do not create duplicate authored records.

## Interaction and visual direction

The page uses a paper passport, wooden route board, field slips and red-thread
annotations. The 24-node map is code-native and lightweight; it avoids a large
illustration download while retaining clickable geography and responsive
layout. Filters are IME-safe. Exact station and placement routes are shareable,
browser-history aware and reopen the corresponding layer. Dispatch orders,
return certifications and the passport use the shared print/PDF document
pipeline.

The visual system deliberately permits uneven stamps, crossing route lines,
annotation strips and conditional red marks. It should look administered, but
not as though Gensokyo has been made perfectly orderly.

## Validation boundary

`scripts/check-fieldwork.mjs` validates all 24 IDs/codes, three languages,
cross-disciplinary tags, equipment/tasks, complications, travel modes,
dispatch assessment, active-duty exclusion, full Scarlet Mansion lifecycle,
repeat seals, storage registration, event contracts, search and BBS
projection. Browser smoke coverage performs the actual station → dispatch →
check-in → map notice → response → return → passport → BBS flow and checks the
mobile page width.

