# First Bell new-student arrival notes

Status: implemented for the post-admission 2026 arrival cycle
Editorial owner: admissions-to-student-life boundary
Public page: `welcome.html#welcome`

## Institutional premise

First Bell is not a generic welcome-week checklist and does not award a
collectible badge. It resolves the gap between a formal admission decision and
the first ordinary act of student life. The file asks three questions that
remain useful when Gensokyo makes the expected route unreliable:

1. Which route from Hakurei Gate reaches the admitting school today?
2. Which stop or exit signal can this student personally recognise, and which
   detour notice will they verify?
3. Which real campus destination should open after the bell?

The final choices lead to course registration, housing, campus societies or
festival operations. Completion is therefore a route into an owning feature,
not a reward invented solely for orientation.

## Admission boundary

The public blank file and its rules are available to every visitor. A personal
arrival file opens only when the same browser contains a My TU identity, a
submitted application, and the latest matching joint review with outcome
`admitted`. `conditional`, `supplement`, `interview`, missing-review and
missing-application states remain visibly distinct. Welcome copy never
promotes them to formal admission.

The arrival store cites stable identity, application and review identifiers.
It does not copy the student's known name, research question, needs or the
committee's prose into a second source of truth. The renderer may show those
fields by reading their owners at display time.

## Character friction

- Akyuu insists that the arrival file cite the original admission edition and
  that public projections remain nameless.
- Reimu treats a usable exit and a personally recognisable stop signal as
  stronger than any claim that one gate is universally correct.
- Yukari keeps the route boundary unstable: several gates may each claim to be
  the sole entrance, but that does not weaken the student's stop condition.
- Aya can move a detour notice fastest and can publish an arrival count before
  its denominator exists. Her correction trail is preserved instead of making
  her an agreeable communications officer.
- Marisa chooses a real first course and immediately makes the bell striker's
  provenance a separate problem. Excellent experiment, terrible checkout.

No public copy claims that these disputes are external editorial facts. They
are campus consequences of the characters' existing motives translated into
the university's rules.

## Route and accessibility decisions

Arrival routing reuses the same live-campus, academic-calendar and festival
overlay as the public map. It does not maintain a friendlier orientation-only
map. The three stop signals are deliberately non-equivalent:

- wooden bells are auditory and explicitly unsuitable when they cannot be
  reliably heard;
- red-and-white lamps add a pulsing base rather than relying on colour alone;
- a paired vermilion cord requires acknowledgement from both people without
  allowing the companion to decide for the student.

Stop signal and notification channel remain separate fields. Fast delivery is
not treated as proof that the correct version arrived.

## Records, events and projections

Owning record: `tu:orientation:dossiers`, registered with the records cabinet.
The model tolerates unknown/older fields and keeps up to twenty historical
files without rewriting completed files.

Official causal sequence:

1. `orientation.dossier.opened`
2. `orientation.arrival.confirmed`
3. `orientation.boundary.confirmed`
4. `orientation.matriculated`

The event correlation is the stable dossier ID. Search and BBS read the owning
model through the domain registry. BBS receives status, institutional copy and
a deep link, never a student name or application text. My TU counts the owning
file and directs formally admitted students to First Bell. Hieda dossier 13
links stable source leaves and official events without becoming another
student store.

## Visual and asset provenance

The page uses original CSS composition only: cream administrative paper, ink
navy, vermilion cord/seals, ruled grids and a printable arrival slip. No
official Touhou asset, screenshot, music, scan, third-party fan work or
generated raster image was added. The absence of confetti and mascots is
intentional; the visual joke is an institution taking a supernatural arrival
file completely seriously.

## Verification contract

`npm run check:orientation` covers trilingual source records, the admission
gate, route/boundary/first-destination lifecycle, source-reference privacy,
storage registration, event contracts, routes, Search and nameless BBS
projection. Browser coverage must also exercise a formally admitted path,
language switching, the printable result, focus/scroll continuity and mobile
overflow.
