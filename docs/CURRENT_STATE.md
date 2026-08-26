# Touhou University current state

Last audited: 2026-08-26
Release: `0.30.0`
Branch/deployment: `main` → GitHub Pages
Live site: <https://n0zom1z0.github.io/touhou-university/>
Repository: <https://github.com/N0zoM1z0/touhou-university>

This is the compact handoff snapshot. The numbers below are checked by
`npm run check:docs`; update the source and this file together when they change.

## What this project is

An immersive, static, three-language university portal located inside
Gensokyo. It behaves like a real institution—admissions, academics, research,
student records, maps, services, graduation and employment—but its rules are
continually complicated by Touhou characters, abilities, places, testimony and
time. It is not a conventional university theme with Touhou names pasted on.

The browser is the only student-record store. There is no account server,
analytics, tracker, remote JavaScript or form backend. All user-visible
records, exports and deletions therefore need honest device/origin visibility
language.

## Source-derived snapshot

| Item | Current value |
| --- | ---: |
| Generated pages | 20 |
| Ordinary public pages | 19 |
| Deliberately hidden pages | 1 (`phantasm.html`) |
| Unique content sections | 36 |
| CSS bundles | 21 |
| Supported locales | 3 (`zh-Hant`, `ja`, `en`) |
| Registered on-device keys | 74 |
| Known records shelves | 12 |
| Official event contracts | 80 |
| Hieda dossiers / characters / source leaves | 13 / 23 / 88 |
| Employment vacancies / illustrated posters | 21 / 21 |
| Catalogue courses | 35 |
| Fieldwork stations | 24 |
| Offline unified-exam files | 48 |

Run `npm run docs:status` for the same values directly from source.

## Page ownership

`site.config.mjs` is the page/build authority.

| Output | Owns |
| --- | --- |
| `index.html` | home, audience entrances, services, institutional story |
| `academics.html` | seven schools and faculty |
| `admissions.html` | admissions, entrance examination, unified examination |
| `welcome.html` | First Bell new-student arrival, live route, stop signal and first destination |
| `research.html` | research archive and spell-card workshop |
| `ethics.html` | research ethics board |
| `incidents.html` | incident centre and research simulator |
| `festival.html` | lantern/boundary festival operations |
| `fieldwork.html` | 24-station placement passport |
| `commons.html` | property hearings and crow-tengu post |
| `calendar.html` | Gensokyo academic calendar |
| `careers.html` | graduation, career office, employment market, alumni |
| `campus.html` | live campus, governance, maps, clubs and BBS |
| `mytu.html` | identity, applications, courses, assessment and transcript |
| `library.html` | circulation and outside-object appraisal |
| `clinic.html` | triage, pharmacy, prescriptions and recovery |
| `housing.html` | residences, matching, assignments and transfer |
| `records.html` | complete on-device records cabinet |
| `hieda.html` | cross-domain knowledge graph |
| `phantasm.html` | hidden, gated, isolated dream campus and PHANTASM reverse examination |

## Authoritative sources

- Page composition and CSS ownership: `site.config.mjs`
- Public sections: `src/sections/`
- Stable trilingual content: `src/data/`
- Local models, interactions and cross-domain projections: `src/js/`
- Global static copy keys: `src/data/i18n.js`
- Route ownership and overlay behaviour: `src/js/site-router.js` and
  `src/js/deep-links.js`
- Official lifecycle vocabulary: `src/data/event-contracts.js`
- On-device key catalogue: `src/data/local-records.js`
- Search/BBS capability registry: `src/js/domain-registry.js`
- Hieda projection: `src/data/knowledge-graph.js`
- Deterministic operational world state: `src/data/live-campus.js`
- First-parent living history: `src/data/campus-history.js`
- Editorial/source/provenance notes: `docs/research/`
- Generated release artifacts: root HTML, `assets/css/` bundles and `downloads/gaokao/`

## Important boundaries

- Generated artifacts are committed because GitHub Pages serves the repository
  root, but `src/` remains the editable source.
- Hieda, Search, BBS, My TU summaries and Tengu Post messages are projections.
  They must point back to owning records rather than becoming duplicate truth.
- Official campus events are versioned causal facts. Visitor-authored BBS
  posts and derived community reactions are different stores.
- PHANTASM storage, reverse-exam attempts and transcripts are deliberately
  excluded from official credits, My TU and `tu:campus:ledger`.
- `docs/research/` is the repository release copy. The optional sibling
  `../research/` is a working mirror and should match when present.
- `docs/ROADMAP.md` is implementation history plus explicitly labelled future
  directions. It is not an authoritative list of unfinished work.

## Where to begin a new change

1. Find the owning page and domain in this document.
2. Read its `src/data/*`, `src/js/*-model.js`, focused renderer and validator.
3. Read the matching note from `docs/research/README.md`.
4. Search for its stable route, `tu:` keys and event types before inventing new
   ones.
5. Follow [AGENT_HANDBOOK.md](AGENT_HANDBOOK.md) for implementation, testing,
   campus history and publication.
