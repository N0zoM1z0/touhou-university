# PHANTASM dream-campus design notes

Research and design date: 2026-07-26
Public implementation: `touhou_university_website/phantasm.html`

## Editorial premise

The dream campus is the counterfactual reverse of the ordinary university.
It is not a password page, a completion badge, or an isolated joke. Ordinary
student actions create rejected alternatives: the answer not submitted, the
option not voted for, the hypothesis excluded at closure, the room declined,
the class dropped, and the method consciously left unused. PHANTASM begins
only when the visitor has produced enough real institutional history for those
alternatives to form a second student record.

This gives Doremy Sweet a recognisable domain without making her merely a
generic dream guide. Yukari treats the distinction between official and dream
records as a negotiable boundary; Keine is forced to catalogue mutually
exclusive histories; Reimu insists that invalid dream credits cannot be used
to reduce ordinary tuition. Their conflict is more important than explaining
the campus as a system.

## Six hard seals

All six conditions must be satisfied on the same device:

1. submit and receive a grade for a course assignment;
2. cast a campus-governance vote;
3. close a campus incident;
4. decline a housing offer;
5. drop an enrolled course;
6. complete an academic defence whose project records a deliberately unused
   route of at least 18 characters.

The direct URL remains behind the same gate. The conditions are intentionally
distributed across separate ordinary services so routine browsing cannot
accidentally unlock the page.

## Clue budget on the ordinary site

The ordinary site does not advertise an eleventh destination. Small traces
increase with progress:

- a footer maintenance slip refers to an unnecessary ninth box;
- My TU eventually shows a crossed-out ninth-period row;
- the map notice develops a marginal direction to the reverse side;
- search can surface a low-confidence ninth-period record;
- BBS rumours repeat inconsistent descriptions of a bell, timetable and room.

Before eligibility these are atmosphere, not links. Once all six seals exist,
the same surfaces may point to the boundary gate. Desktop and mobile primary
navigation must never list PHANTASM.

## Campus contents

The hidden campus contains six courses derived from the untaken choices:

- `PH-009` practicum in routes not taken;
- `DRM-404` dream historiography for events that did not occur;
- `GOV-000` Shadow Senate;
- `DOR-013` residential life with a declined roommate;
- `LIB-NULL` negative library circulation;
- `BND-∞` survey of floors, boundaries and waking directions.

The six-node map shifts when the ninth bell changes between before, ninth,
after and never. A visitor may enrol in three courses and submit a reverse
public defence. Doremy, Yukari, Keine and Reimu preserve separate rulings,
conditions and dissent rather than collapsing the encounter into a numerical
score.

The printable output is explicitly headed:

```text
TU-DREAM-TRANSCRIPT
未選路線學籍副本
Not valid outside the dream boundary
```

## PHANTASM reverse examination

The earlier unsigned BBS/history slip—“finish EXTRA first”—now has a literal
payoff. Once the dream campus is open, one completed ordinary humanities or
science EXTRA attempt makes a common reverse paper appear. Score is irrelevant:
EXTRA proves that the candidate has followed one difficult world-line to its
end, rather than that they guessed the dream's password.

The paper is not a fifth admissions difficulty. It has nine questions in three
sections for 150 marks and no timer, because the ninth strike does not promise
forward time:

1. reverse-side historiography preserves incompatible files without retrying
   an official closure;
2. boundary and contradiction reasoning retains local inconsistency without
   allowing arbitrary conclusions;
3. untaken causality and record boundaries distinguish a simulated branch from
   an identified waking counterfactual.

The final questions deliberately combine provenance, mechanism-linked
missingness after Doremy consumes a dream, circular citation, boundary-aware
identity and non-transferable credits. Yukari can preserve both sides, Keine
can catalogue their lineage, and Reimu can still refuse to let dream marks pay
an ordinary obligation. Answer letters are non-cyclic and options are checked
for multilingual length leakage by `scripts/check-phantasm-exam.mjs`.

Only an opened dream campus renders the desk. It can print a blank reverse
paper and a scored review, both carrying `Not valid outside the dream boundary`;
there is intentionally no ordinary admissions card or offline download.

## Record isolation

Official lifecycle events are inputs to the unlock and counterfactual
fragments, but dream actions are never official outputs. PHANTASM uses:

- `tu:phantasm:state`
- `tu:phantasm:transcripts`
- `tu:phantasm:exam:draft`
- `tu:phantasm:exam:attempts`
- `tu:phantasm:boundary` for bounded wrong-door traces
- session-only `tu:phantasm:pass` for one temporary passage

It must not call the shared campus-ledger writer. Enrolment, bell changes,
reverse defence and waking cannot enter `tu:campus:ledger`, My TU, ordinary
course registration or the official transcript. This separation is both a
technical invariant and the joke: the university can deny the dream because
the dream keeps better records of being denied.

## 0.20 lunar-boundary revision

The six seals qualify a visitor but no longer identify a permanent door. A
small shared calendar model derives a local day key, one of eight lunar phases
and one of eight three-hour duty slots. Those values deterministically rotate
the live source among the footer, My TU reverse timetable, wooden map notice,
search index and BBS. New and full moons may admit two source surfaces at once.

Every date has two normal opening slots; new and full moons have three. This
keeps the boundary genuinely time-dependent while avoiding an unlucky date
with no solution. Waiting is not the only solution: three distinct wrong
surfaces on first entry, two after a previous dream, or finitely repeated
attempts at one surface wear a temporary six-hour session seam. Thus confusion
is part of the fiction, but permanent lockout is not.

The current lunar profile also supplies one of four dream identities:
moonless, waxing ninth-period, full-moon reverse, or waning untaken-route.
Only after successful passage does the ordinary university name, crest,
favicon, theme colour and footer motto change. The locked boundary deliberately
retains ordinary branding so the transformation reads as an arrival rather
than advance advertising.

## Working sources and boundaries

- feature inventory and counterfactual-record concept:
  `/tmp/vc_sth.txt`;
- local character dossiers used as editorial reminders:
  `/home/pentester/Project/gensokyo-monochrome-heart/design/04_characters/`;
- existing Touhou University data models for courses, governance, incidents,
  housing, library and academic defence.

No official dialogue, game asset, music, screenshot or character sprite is
copied into the implementation. The university systems, courses and records
are project-original fan-work material.
