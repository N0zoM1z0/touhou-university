# Campus Commons, Tengu Post, and Academic Calendar Notes

Research and implementation date: 2026-07-27
Public pages: `commons.html`, `calendar.html`

## Editorial premise

These three systems describe one argument from three incompatible clocks:

- an object may deny that it was ever lost;
- an official notice may arrive before the action that caused it;
- the academic calendar may declare spring while Hakugyokurou still refuses
  delivery.

The joke works only if every institution keeps a serious record of its own
part without flattening the contradiction. The public UI therefore presents
real files, versions, hearing seats, effects and appeal paths rather than a
single “correct” flavour-text answer.

## Character and world anchors

- Kogasa Tatara makes neglect and an object's own testimony impossible to
  ignore. Her desk asks whether an item has been maintained, surprised or
  abandoned; it does not decide legal custody.
- Rinnosuke Morichika separates name, wear, probable use and price-tag
  confidence. An appraisal is evidence, not ownership.
- Hieda no Akyuu preserves receipts, catalogue numbers, prior statements and
  corrections without pretending that the archive is omniscient.
- Eiki Shiki asks who may possess, use, repair, appeal and bear the
  consequences. Her ruling cannot substitute for the other three opinions.
- Aya Shameimaru and crow-tengu delivery make speed, source, headline,
  correction and version history visible at the same time.
- Gensokyo's seasons, incidents, lunar nights, Higan, festivals, winter
  hibernation and summer night life are allowed to alter institutional time
  instead of serving as decorative calendar art.

The working anchors come from the project's existing research register,
especially *Curiosities of Lotus Asia*, *Bohemian Archive in Japanese Red*,
*Perfect Memento in Strict Sense*, *Imperishable Night* and the established
character/location notes. No dialogue, game asset or official illustration is
copied.

## Property tribunal

The rack contains ten trilingual disputes: an alarm clock denying its former
owner, a rain-neglected paper umbrella, a bookmark claiming the book was lost,
a wrench treated as a workshop employee, a phantom ribbon with split custody,
a rabbit ticket dated “yesterday”, a drumstick objecting to performance use, a
donation-box key, a teacup with competing care claims and two left earbuds
sharing one serial number.

A claimant states relationship, evidence, requested disposition and whether
the object's voice and attached conditions will be accepted. Four seats then
write separate opinions:

1. Kogasa — object voice, neglect and surprise;
2. Rinnosuke — name, material trace and likely use;
3. Akyuu — provenance, catalogue continuity and correction;
4. Eiki — custody, responsibility, remedy and appeal.

There is deliberately no aggregate ownership score and no majority button.
The final disposition is a separately confirmed ruling that retains all four
opinions and can be printed. Claims remain in `tu:property:claims`.

## Crow-tengu campus post

The seeded inbox has eight notices that demonstrate non-linear delivery:
admission before application, cancellation after the make-up class, an early
festival extra, a uniquely inconsistent gate notice, a disputed library
correction, a moon-rabbit route bulletin, a property summons and a
rain-damaged dormitory notice.

Every letter exposes source kind, trust label, version, creation and delivery
time, correction history, read state, pin state and acknowledgement state.
“Read aloud” is intentionally distinct from “read”; fairies may satisfy one
without satisfying the other. Visitors may request a correction and send
their own public or private notice through three delivery channels. Outgoing
notices remain in `tu:post:dispatches`; per-message state remains in
`tu:post:state`.

Property filings and calendar bookmarks create derived inbox notices. These
are projections of the original record, not duplicate authored BBS posts.

## Gensokyo academic calendar

The calendar has five seasons and fourteen substantial event files. Annual
windows cover winter placement return, hibernation registration, disputed
spring opening, Higan field week, rain-damaged notice week, summer
night-sparrow term, seasonal-energy observation, harvest shrine competition,
maple archive month and winter seal inventory. Full- and new-moon events also
depend on the shared eight-phase lunar clock and duty bell.

Each leaf records four separate campus projections:

- courses and timetable;
- transport and route graph;
- library opening/capacity;
- clinic load or treatment desk.

The live snapshot changes facilities, dining, timetable, route delays and the
map's wooden notice. Calendar events remain in
`liveCampusSnapshot().calendar.activeEvents`, separate from the two ordinary
daily incidents, while their route rules are merged into the shared graph.
This preserves the established deterministic live-campus contract without
making the calendar cosmetic.

Visitors can bookmark leaves in `tu:calendar:bookmarks`, print the calendar,
or download a portable `.ics` file. A bookmark saves a reminder; it does not
freeze the world's date or moon.

## Cross-campus record design

Stable routes:

- `commons.html#property-desk`
- `commons.html#property-item-<id>`
- `commons.html#property-claim-<id>`
- `commons.html#post-inbox`
- `commons.html#post-message-<id>`
- `commons.html#post-dispatch-<id>`
- `calendar.html#academic-calendar`
- `calendar.html#calendar-event-<id>`
- `calendar.html#calendar-agenda`

Seven schema-2 event contracts preserve the lifecycle:

- `property.claim.submitted`
- `property.ruling.issued`
- `post.message.acknowledged`
- `post.correction.requested`
- `post.notice.dispatched`
- `calendar.event.saved`
- `calendar.event.removed`

Search, BBS, My TU and Hieda consume projections from the original records.
Hieda dossier 11 binds six source forms and the exact Git-backed chronicle
leaf without rewriting postal order as causal order.

## Verification baseline

- 10 property files, four independent hearing seats and printable rulings;
- 8 seeded notices plus property/calendar/outgoing projections;
- 14 calendar events, five seasons and four effect domains;
- complete Traditional Chinese, Japanese and English domain copy;
- exact deep links, browser history, local persistence, print and `.ics`;
- 66 registered event contracts, 63 local-record keys and 11 Hieda dossiers;
- desktop and 390 px mobile browser flows with no horizontal overflow.
