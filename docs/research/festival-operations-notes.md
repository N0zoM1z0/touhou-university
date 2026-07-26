# Spring spell-card lantern / boundary matriculation operations notes

Research and implementation date: 2026-07-26
Public implementation: `festival.html`

## Editorial premise

The festival is not a generic event-planning scorecard. It is one night in
which several Gensokyo institutions must operate at once without becoming
unusually obedient:

- Reimu wants a short stopping rule, visible exits, and a gate she can close;
- Nitori wants an honest power diagram, but the firmware label remains under
  kappa tape;
- Eirin treats lunar phase, danmaku density, attendance, and the person nearest
  the stop bell as one medical problem;
- Aya may publish an immaculate opening extra nine minutes before approval;
- Hakurei, Moriya, and Myouren each understand “sole main gate” as both traffic
  control and public ownership;
- residence and fairy representatives must handle sounds, clouds, lawns, and
  lanterns that may not remain where the form put them.

These interests are deliberately not averaged. A returned safety sheet can
block opening; conditions and objections survive in the permit and keep
affecting field operations.

## Two festival dossiers

The operations room supports two related but distinct events:

1. the Spring Spell-card Lantern Festival, centred on readable non-aggressive
   danmaku, spectator cues, falling-object recovery, and lunar medicine;
2. the Boundary Matriculation Festival, centred on procession routes, symbolic
   gates, competing faith speeches, and a campus that may have more than one
   “sole” entrance at the same instant.

Organisers choose date and moon, route, stage, altitude, density, cue time,
visitor capacity, power and backup, food court, fairy zone, aid stations, gate
claim, press desk, Prismriver closing, rain plan, recovery crew, independent
attendance count, stopping rule, and low-stimulation arrangements.

## Six independent desks

The permit retains six separately legible opinions:

| Desk | Question that cannot be delegated |
| --- | --- |
| Hakurei Exit Desk | Can spectators see the stop signal and reach an exit? |
| Kappa Power & Recovery | Are stage, stalls, lights, and backup on one honest drawing? |
| Eientei Medical Desk | Were moon, density, crowd, and nearest stop authority counted together? |
| Bunbunmaru Wire Desk | Does the public see the permit or Aya's conclusion first? |
| Three-Faith Gate Council | Is the sole gate traffic control or unbudgeted ownership? |
| Residence & Fairy Night Desk | Who can promise shared sound, clouds, and lawns stay filed? |

Outcome precedence is return, contested permit, conditional permit, then clear
permit. There is no overall ethics or success score.

## Field operations and consequences

An issued non-returned permit can be opened after the keeper acknowledges every
condition and chooses an organiser, volunteer, or observer duty role. Four
deterministically selected field cases then appear from a seven-case pool:

- Aya's opening extra arriving before Reimu's stamp;
- Moriya votive plaques appearing on kappa distribution boxes;
- fairy lanterns taking their marked cloud elsewhere;
- Prismriver noise that residence walls hear without airborne transmission;
- full-moon books leaving Misty Lake Library to join the procession;
- rain folding a temporary boundary into the route;
- all three faiths arriving with the key to the sole main gate.

Each case offers three non-equivalent first responses. Responses change delay,
attendance, clinic load, power peak, unresolved dispute, and sometimes another
route edge. The operation cannot close until every case has a response.
Closure releases temporary routing but does not erase objections.

## Cross-system projections

- A live operation is merged into the ordinary campus route graph, including
  closed edges, unavailable transport modes, transit-node closures, and added
  delay. It does not alter the deterministic world snapshot itself.
- Expected festival presentations add pressure to the Eientei queue model;
  closure removes that live pressure.
- Permits, live wires, and closing extras are derived BBS posts with exact
  links back to their local files.
- Draft, permits, and operations use three registered on-device record keys.
- Five lifecycle event contracts connect submission, permit, opening, field
  response, and closure in the official campus ledger and My TU.
- Hieda dossier 09 joins the event, route, power diagram, faith desk, Aya's
  early extra, gate rota, local events, and the matching first-parent
  chronicle record without rewriting them as one obedient account.

## Interface and performance

The page is generated as a standalone subpage and its module loads only when
the festival shell exists. It reuses shared render-state preservation,
deep-link routing, local records, event contracts, and print-document support.
The mini route map is HTML/SVG rather than another large bitmap; the existing
responsive festival image is reused. Stable routes include:

- `#festival-operations`
- `#festival-records`
- `#festival-plan-<id>`
- `#festival-operation-<id>`

The feature-specific check validates trilingual data, six unaveraged seats,
unsafe-plan return, full open/respond/close lifecycle, route and clinic
activation/release, local-record registration, event contracts, search, and
BBS projection. Browser smoke covers the real form, opening bell, four field
responses, closing report, BBS links, My TU, desktop width, and mobile width.
