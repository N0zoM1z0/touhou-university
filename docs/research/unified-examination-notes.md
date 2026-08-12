# Unified Examination Design Notes

Design revision: 2026-08-13
Runtime question-bank revision: `2`
Scope: the eight ordinary humanities/science × NORMAL/HARD/LUNATIC/EXTRA
papers, plus the separate dream-campus PHANTASM common reverse paper

## What the examination is testing

The unified examination is not a Touhou trivia quiz. It asks whether a
candidate can work inside an institution where notices are corrected, places
retain yesterday's time, eyewitnesses disagree, full moons change operating
rules and kappa instruments have firmware histories. The joke belongs in the
evidence; the answer must still follow from that evidence.

The four difficulties therefore have different contracts:

- **NORMAL** tests one foundational move at a time: distinguish observation
  from inference, read a notice literally, preserve a correction trail, or do
  one transparent calculation.
- **HARD** combines at least two stated records or conditions. A candidate who
  notices only the most colourful clue should land on a plausible distractor.
- **LUNATIC** requires cross-source reasoning: reconcile versions, times,
  routes, witnesses or rules without erasing a contradiction.
- **EXTRA** asks what evidence would identify a claim: version lineage,
  telemetry, missingness, causal comparison, fault timing or a minimally
  sufficient experimental design.

PHANTASM is intentionally outside that four-card ladder. It becomes visible
only after the six dream-campus seals and one completed ordinary EXTRA attempt.
Instead of making EXTRA merely longer, its nine-question common reverse paper
requires the candidate to preserve incompatible worlds at once while keeping
their validity, provenance, missingness and causal claims separate. Its dream
drafts and scores never enter ordinary exam history, My TU or the official
ledger, and it has no admissions-page download.

Humanities papers emphasize wording, archives, testimony, governance and
interpretation. Science papers emphasize measurement, mechanisms, controls,
fault isolation and identifiability. Both tracks share language, mathematics
and Gensokyo common knowledge so that neither can escape careful reading.

## Distractor design contract

Every non-numerical wrong answer should describe a recognizable reasoning
error, not a joke-shaped surrender. Preferred distractor families are:

1. the right clue interpreted under the wrong rule or version;
2. the right method with one necessary condition omitted;
3. correlation or sequence mistaken for causation;
4. a conclusion broader than the evidence permits;
5. an irreversible intervention where a reversible safety step is warranted;
6. a correct operation applied to the wrong unit, population or time window.

Options within an item should use parallel grammar and comparable information
density. The correct answer must not routinely be the only qualified sentence,
the only cautious sentence or the longest sentence. It may be longer when the
reasoning genuinely needs it, but length cannot function as an unofficial
answer key.

Short numerical alternatives are an intentional exception. Values such as
`20%`, `25%`, `40%` and `80%` are naturally terse; manufacturing prose around
them would make the arithmetic less legible rather than more rigorous.

## Revision-two changes

Revision one rotated every paper into the visible `A, B, C, D` cycle and often
paired one detailed correct answer with three visibly thinner alternatives.
Revision two keeps the same learning objectives and correct propositions, but:

- gives each paper an explicit deterministic answer schedule;
- balances A–D without repeating the mechanical four-letter cycle;
- rewrites weak distractors in Traditional Chinese, Japanese and English as
  credible near-misses with parallel syntax;
- preserves separate difficulty identities instead of merely making later
  papers wordier;
- regenerates all forty-eight offline paper/answer HTML files from the same
  authoritative data.

For example, a field-note item no longer contrasts a verifiable count only
against fragments such as “fairies did it.” Its alternatives now include
attribution without evidence, causation inferred from timing, and an anecdotal
baseline treated as a normal range. An EXTRA causal-design item now makes the
wrong designs genuinely tempting—before/after comparison, pooled correlation
or an uncontrolled intervention—while only one option isolates the requested
effect.

## Mechanical guardrails

`scripts/check-gaokao.mjs` treats presentation leakage as a data defect. For
each of the eight assembled papers it verifies:

- 150 marks and the intended subject/question composition;
- balanced answer letters and rejection of the old exact `index % 4` cycle;
- complete Traditional Chinese, Japanese and English prompts, options and
  explanations;
- no more than half of a paper's correct options being uniquely longest;
- mean correct-option length no more than 1.3 times the mean distractor length;
- presence and parity of all forty-eight generated offline files.

English length uses word count; Traditional Chinese and Japanese use visible
letter/number code points. These thresholds catch regression patterns, not
pedagogical quality by themselves. A paper can pass the metric and still need
human review for ambiguity, duplicated meanings or character voice.

`scripts/check-phantasm-exam.mjs` applies the same leakage principle to the
reverse paper while also fixing its nine-item, three-section, 150-mark shape,
EXTRA prerequisite and explicit non-cyclic A/B/C/D schedule.

## Local-record compatibility

Question-bank revision belongs in drafts and completed attempts.

- A revision-one draft keeps its old selections under `legacyAnswers`, clears
  the active revision-two selections and tells the candidate to confirm each
  answer against the revised wording. It does not silently assign an old wrong
  choice to a different new sentence.
- A revision-one completed attempt is scored against the original answer
  positions. Review shows the old chosen letter and an explicit legacy notice,
  while the current correct proposition remains available for study.
- New drafts and attempts carry schema `3` and question-bank revision `2`.

This policy prefers an honest request to reconfirm over a false claim of
lossless migration. The earlier wrong-option prose is not recoverable from an
index alone.

## Provenance boundary

The questions, scenarios, statistics and institutional procedures are
project-original University AU material. Touhou names, abilities and social
roles remain subject to the main source hierarchy in `source-register.md`.
This redesign changes assessment craft, not any canon claim, and introduces no
game script, screenshot, sprite, music or scan.
