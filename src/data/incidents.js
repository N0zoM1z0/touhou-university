import { text as catalogText } from "../generated/i18n/data/incidents.js";

const hypothesis = (id, title, rationale) => ({ id, title, rationale });
const evidence = (id, kind, title, body, source, reliability) => ({ id, kind, title, body, source, reliability });
const testimony = (id, speaker, role, statement, tension) => ({ id, speaker, role, statement, tension });
const action = (id, title, body, caution, effects) => ({ id, title, body, caution, effects, reversible: true });

export const incidentCases = [
  {
    id: "late-bell-seven",
    code: "TU-IR-142",
    mark: "鐘",
    severity: "amber",
    status: "open",
    reportedAt: "2026-07-25T00:42:00.000Z",
    location: catalogText("incidentCases.late-bell-seven.location"),
    title: catalogText("incidentCases.late-bell-seven.title"),
    lede: catalogText("incidentCases.late-bell-seven.lede"),
    dispatch: catalogText("incidentCases.late-bell-seven.dispatch"),
    affected: catalogText("incidentCases.late-bell-seven.affected"),
    signal: catalogText("incidentCases.late-bell-seven.signal"),
    unit: catalogText("incidentCases.late-bell-seven.unit"),
    truthHypothesis: "roster-lag",
    simulation: { baseline: 31, confound: 17, drift: 9, missing: 14, version: 12 },
    hypotheses: [
      hypothesis("roster-lag", catalogText("incidentCases.late-bell-seven.hypotheses.0.roster-lag.1"), catalogText("incidentCases.late-bell-seven.hypotheses.0.roster-lag.2")),
      hypothesis("wing-reflection", catalogText("incidentCases.late-bell-seven.hypotheses.1.wing-reflection.1"), catalogText("incidentCases.late-bell-seven.hypotheses.1.wing-reflection.2")),
      hypothesis("expectation", catalogText("incidentCases.late-bell-seven.hypotheses.2.expectation.1"), catalogText("incidentCases.late-bell-seven.hypotheses.2.expectation.2")),
    ],
    evidence: [
      evidence("tower-log", "instrument", catalogText("incidentCases.late-bell-seven.evidence.0.tower-log.2"), catalogText("incidentCases.late-bell-seven.evidence.0.tower-log.3"), catalogText("incidentCases.late-bell-seven.evidence.0.tower-log.4"), 92),
      evidence("roll-page", "record", catalogText("incidentCases.late-bell-seven.evidence.1.roll-page.2"), catalogText("incidentCases.late-bell-seven.evidence.1.roll-page.3"), catalogText("incidentCases.late-bell-seven.evidence.1.roll-page.4"), 86),
      evidence("roof-audio", "trace", catalogText("incidentCases.late-bell-seven.evidence.2.roof-audio.2"), catalogText("incidentCases.late-bell-seven.evidence.2.roof-audio.3"), catalogText("incidentCases.late-bell-seven.evidence.2.roof-audio.4"), 78),
      evidence("extra-edition", "media", catalogText("incidentCases.late-bell-seven.evidence.3.extra-edition.2"), catalogText("incidentCases.late-bell-seven.evidence.3.extra-edition.3"), catalogText("incidentCases.late-bell-seven.evidence.3.extra-edition.4"), 64),
    ],
    testimony: [
      testimony("student-17", catalogText("incidentCases.late-bell-seven.testimony.0.student-17.1"), catalogText("incidentCases.late-bell-seven.testimony.0.student-17.2"), catalogText("incidentCases.late-bell-seven.testimony.0.student-17.3"), catalogText("incidentCases.late-bell-seven.testimony.0.student-17.4")),
      testimony("aya", catalogText("incidentCases.late-bell-seven.testimony.1.aya.1"), catalogText("incidentCases.late-bell-seven.testimony.1.aya.2"), catalogText("incidentCases.late-bell-seven.testimony.1.aya.3"), catalogText("incidentCases.late-bell-seven.testimony.1.aya.4")),
      testimony("nitori", catalogText("incidentCases.late-bell-seven.testimony.2.nitori.1"), catalogText("incidentCases.late-bell-seven.testimony.2.nitori.2"), catalogText("incidentCases.late-bell-seven.testimony.2.nitori.3"), catalogText("incidentCases.late-bell-seven.testimony.2.nitori.4")),
    ],
    actions: [
      action("freeze-roster", catalogText("incidentCases.late-bell-seven.actions.0.freeze-roster.1"), catalogText("incidentCases.late-bell-seven.actions.0.freeze-roster.2"), catalogText("incidentCases.late-bell-seven.actions.0.freeze-roster.3"), { version: -18 }),
      action("calibrate-clocks", catalogText("incidentCases.late-bell-seven.actions.1.calibrate-clocks.1"), catalogText("incidentCases.late-bell-seven.actions.1.calibrate-clocks.2"), catalogText("incidentCases.late-bell-seven.actions.1.calibrate-clocks.3"), { drift: -14 }),
      action("quiet-trial", catalogText("incidentCases.late-bell-seven.actions.2.quiet-trial.1"), catalogText("incidentCases.late-bell-seven.actions.2.quiet-trial.2"), catalogText("incidentCases.late-bell-seven.actions.2.quiet-trial.3"), { confound: -15 }),
      action("move-berth", catalogText("incidentCases.late-bell-seven.actions.3.move-berth.1"), catalogText("incidentCases.late-bell-seven.actions.3.move-berth.2"), catalogText("incidentCases.late-bell-seven.actions.3.move-berth.3"), { confound: -8 }),
    ],
    reactions: [
      { category: "notice", author: catalogText("incidentCases.late-bell-seven.reactions.0.author"), title: catalogText("incidentCases.late-bell-seven.reactions.0.title"), body: catalogText("incidentCases.late-bell-seven.reactions.0.body") },
      { category: "course", author: catalogText("incidentCases.late-bell-seven.reactions.1.author"), title: catalogText("incidentCases.late-bell-seven.reactions.1.title"), body: catalogText("incidentCases.late-bell-seven.reactions.1.body") },
      { category: "notice", author: catalogText("incidentCases.late-bell-seven.reactions.2.author"), title: catalogText("incidentCases.late-bell-seven.reactions.2.title"), body: catalogText("incidentCases.late-bell-seven.reactions.2.body") },
    ],
  },
  {
    id: "fourth-lantern-loop",
    code: "TU-IR-147",
    mark: "竹",
    severity: "red",
    status: "open",
    reportedAt: "2026-07-25T02:18:00.000Z",
    location: catalogText("incidentCases.fourth-lantern-loop.location"),
    title: catalogText("incidentCases.fourth-lantern-loop.title"),
    lede: catalogText("incidentCases.fourth-lantern-loop.lede"),
    dispatch: catalogText("incidentCases.fourth-lantern-loop.dispatch"),
    affected: catalogText("incidentCases.fourth-lantern-loop.affected"),
    signal: catalogText("incidentCases.fourth-lantern-loop.signal"),
    unit: catalogText("incidentCases.fourth-lantern-loop.unit"),
    truthHypothesis: "firmware-drift",
    simulation: { baseline: 38, confound: 12, drift: 21, missing: 11, version: 24 },
    hypotheses: [
      hypothesis("firmware-drift", catalogText("incidentCases.fourth-lantern-loop.hypotheses.0.firmware-drift.1"), catalogText("incidentCases.fourth-lantern-loop.hypotheses.0.firmware-drift.2")),
      hypothesis("tewi-label", catalogText("incidentCases.fourth-lantern-loop.hypotheses.1.tewi-label.1"), catalogText("incidentCases.fourth-lantern-loop.hypotheses.1.tewi-label.2")),
      hypothesis("lunar-fold", catalogText("incidentCases.fourth-lantern-loop.hypotheses.2.lunar-fold.1"), catalogText("incidentCases.fourth-lantern-loop.hypotheses.2.lunar-fold.2")),
    ],
    evidence: [
      evidence("firmware-stubs", "instrument", catalogText("incidentCases.fourth-lantern-loop.evidence.0.firmware-stubs.2"), catalogText("incidentCases.fourth-lantern-loop.evidence.0.firmware-stubs.3"), catalogText("incidentCases.fourth-lantern-loop.evidence.0.firmware-stubs.4"), 95),
      evidence("paper-fours", "trace", catalogText("incidentCases.fourth-lantern-loop.evidence.1.paper-fours.2"), catalogText("incidentCases.fourth-lantern-loop.evidence.1.paper-fours.3"), catalogText("incidentCases.fourth-lantern-loop.evidence.1.paper-fours.4"), 72),
      evidence("moon-log", "environment", catalogText("incidentCases.fourth-lantern-loop.evidence.2.moon-log.2"), catalogText("incidentCases.fourth-lantern-loop.evidence.2.moon-log.3"), catalogText("incidentCases.fourth-lantern-loop.evidence.2.moon-log.4"), 58),
      evidence("ticket-times", "record", catalogText("incidentCases.fourth-lantern-loop.evidence.3.ticket-times.2"), catalogText("incidentCases.fourth-lantern-loop.evidence.3.ticket-times.3"), catalogText("incidentCases.fourth-lantern-loop.evidence.3.ticket-times.4"), 89),
    ],
    testimony: [
      testimony("conductor", catalogText("incidentCases.fourth-lantern-loop.testimony.0.conductor.1"), catalogText("incidentCases.fourth-lantern-loop.testimony.0.conductor.2"), catalogText("incidentCases.fourth-lantern-loop.testimony.0.conductor.3"), catalogText("incidentCases.fourth-lantern-loop.testimony.0.conductor.4")),
      testimony("tewi", catalogText("incidentCases.fourth-lantern-loop.testimony.1.tewi.1"), catalogText("incidentCases.fourth-lantern-loop.testimony.1.tewi.2"), catalogText("incidentCases.fourth-lantern-loop.testimony.1.tewi.3"), catalogText("incidentCases.fourth-lantern-loop.testimony.1.tewi.4")),
      testimony("eirin", catalogText("incidentCases.fourth-lantern-loop.testimony.2.eirin.1"), catalogText("incidentCases.fourth-lantern-loop.testimony.2.eirin.2"), catalogText("incidentCases.fourth-lantern-loop.testimony.2.eirin.3"), catalogText("incidentCases.fourth-lantern-loop.testimony.2.eirin.4")),
    ],
    actions: [
      action("lock-firmware", catalogText("incidentCases.fourth-lantern-loop.actions.0.lock-firmware.1"), catalogText("incidentCases.fourth-lantern-loop.actions.0.lock-firmware.2"), catalogText("incidentCases.fourth-lantern-loop.actions.0.lock-firmware.3"), { version: -24 }),
      action("calibrate-lanterns", catalogText("incidentCases.fourth-lantern-loop.actions.1.calibrate-lanterns.1"), catalogText("incidentCases.fourth-lantern-loop.actions.1.calibrate-lanterns.2"), catalogText("incidentCases.fourth-lantern-loop.actions.1.calibrate-lanterns.3"), { drift: -19 }),
      action("cloud-control", catalogText("incidentCases.fourth-lantern-loop.actions.2.cloud-control.1"), catalogText("incidentCases.fourth-lantern-loop.actions.2.cloud-control.2"), catalogText("incidentCases.fourth-lantern-loop.actions.2.cloud-control.3"), { confound: -12, missing: -8 }),
      action("remove-labels", catalogText("incidentCases.fourth-lantern-loop.actions.3.remove-labels.1"), catalogText("incidentCases.fourth-lantern-loop.actions.3.remove-labels.2"), catalogText("incidentCases.fourth-lantern-loop.actions.3.remove-labels.3"), { confound: -10 }),
    ],
    reactions: [
      { category: "notice", author: catalogText("incidentCases.fourth-lantern-loop.reactions.0.author"), title: catalogText("incidentCases.fourth-lantern-loop.reactions.0.title"), body: catalogText("incidentCases.fourth-lantern-loop.reactions.0.body") },
      { category: "market", author: catalogText("incidentCases.fourth-lantern-loop.reactions.1.author"), title: catalogText("incidentCases.fourth-lantern-loop.reactions.1.title"), body: catalogText("incidentCases.fourth-lantern-loop.reactions.1.body") },
      { category: "club", author: catalogText("incidentCases.fourth-lantern-loop.reactions.2.author"), title: catalogText("incidentCases.fourth-lantern-loop.reactions.2.title"), body: catalogText("incidentCases.fourth-lantern-loop.reactions.2.body") },
    ],
  },
  {
    id: "flying-book-window",
    code: "TU-IR-151",
    mark: "書",
    severity: "amber",
    status: "open",
    reportedAt: "2026-07-25T03:06:00.000Z",
    location: catalogText("incidentCases.flying-book-window.location"),
    title: catalogText("incidentCases.flying-book-window.title"),
    lede: catalogText("incidentCases.flying-book-window.lede"),
    dispatch: catalogText("incidentCases.flying-book-window.dispatch"),
    affected: catalogText("incidentCases.flying-book-window.affected"),
    signal: catalogText("incidentCases.flying-book-window.signal"),
    unit: catalogText("incidentCases.flying-book-window.unit"),
    truthHypothesis: "pressure-flock",
    simulation: { baseline: 27, confound: 22, drift: 7, missing: 16, version: 8 },
    hypotheses: [
      hypothesis("pressure-flock", catalogText("incidentCases.flying-book-window.hypotheses.0.pressure-flock.1"), catalogText("incidentCases.flying-book-window.hypotheses.0.pressure-flock.2")),
      hypothesis("shelf-protest", catalogText("incidentCases.flying-book-window.hypotheses.1.shelf-protest.1"), catalogText("incidentCases.flying-book-window.hypotheses.1.shelf-protest.2")),
      hypothesis("fairy-lure", catalogText("incidentCases.flying-book-window.hypotheses.2.fairy-lure.1"), catalogText("incidentCases.flying-book-window.hypotheses.2.fairy-lure.2")),
    ],
    evidence: [
      evidence("clasp-telemetry", "instrument", catalogText("incidentCases.flying-book-window.evidence.0.clasp-telemetry.2"), catalogText("incidentCases.flying-book-window.evidence.0.clasp-telemetry.3"), catalogText("incidentCases.flying-book-window.evidence.0.clasp-telemetry.4"), 94),
      evidence("window-log", "environment", catalogText("incidentCases.flying-book-window.evidence.1.window-log.2"), catalogText("incidentCases.flying-book-window.evidence.1.window-log.3"), catalogText("incidentCases.flying-book-window.evidence.1.window-log.4"), 88),
      evidence("margin-petition", "record", catalogText("incidentCases.flying-book-window.evidence.2.margin-petition.2"), catalogText("incidentCases.flying-book-window.evidence.2.margin-petition.3"), catalogText("incidentCases.flying-book-window.evidence.2.margin-petition.4"), 83),
      evidence("fairy-audio", "trace", catalogText("incidentCases.flying-book-window.evidence.3.fairy-audio.2"), catalogText("incidentCases.flying-book-window.evidence.3.fairy-audio.3"), catalogText("incidentCases.flying-book-window.evidence.3.fairy-audio.4"), 76),
    ],
    testimony: [
      testimony("librarian", catalogText("incidentCases.flying-book-window.testimony.0.librarian.1"), catalogText("incidentCases.flying-book-window.testimony.0.librarian.2"), catalogText("incidentCases.flying-book-window.testimony.0.librarian.3"), catalogText("incidentCases.flying-book-window.testimony.0.librarian.4")),
      testimony("book-four", catalogText("incidentCases.flying-book-window.testimony.1.book-four.1"), catalogText("incidentCases.flying-book-window.testimony.1.book-four.2"), catalogText("incidentCases.flying-book-window.testimony.1.book-four.3"), catalogText("incidentCases.flying-book-window.testimony.1.book-four.4")),
      testimony("cirno", catalogText("incidentCases.flying-book-window.testimony.2.cirno.1"), catalogText("incidentCases.flying-book-window.testimony.2.cirno.2"), catalogText("incidentCases.flying-book-window.testimony.2.cirno.3"), catalogText("incidentCases.flying-book-window.testimony.2.cirno.4")),
    ],
    actions: [
      action("window-baffle", catalogText("incidentCases.flying-book-window.actions.0.window-baffle.1"), catalogText("incidentCases.flying-book-window.actions.0.window-baffle.2"), catalogText("incidentCases.flying-book-window.actions.0.window-baffle.3"), { confound: -17 }),
      action("single-book-trials", catalogText("incidentCases.flying-book-window.actions.1.single-book-trials.1"), catalogText("incidentCases.flying-book-window.actions.1.single-book-trials.2"), catalogText("incidentCases.flying-book-window.actions.1.single-book-trials.3"), { missing: -13, confound: -8 }),
      action("shelf-mediation", catalogText("incidentCases.flying-book-window.actions.2.shelf-mediation.1"), catalogText("incidentCases.flying-book-window.actions.2.shelf-mediation.2"), catalogText("incidentCases.flying-book-window.actions.2.shelf-mediation.3"), { confound: -12 }),
      action("ending-silence", catalogText("incidentCases.flying-book-window.actions.3.ending-silence.1"), catalogText("incidentCases.flying-book-window.actions.3.ending-silence.2"), catalogText("incidentCases.flying-book-window.actions.3.ending-silence.3"), { confound: -9 }),
    ],
    reactions: [
      { category: "notice", author: catalogText("incidentCases.flying-book-window.reactions.0.author"), title: catalogText("incidentCases.flying-book-window.reactions.0.title"), body: catalogText("incidentCases.flying-book-window.reactions.0.body") },
      { category: "course", author: catalogText("incidentCases.flying-book-window.reactions.1.author"), title: catalogText("incidentCases.flying-book-window.reactions.1.title"), body: catalogText("incidentCases.flying-book-window.reactions.1.body") },
      { category: "club", author: catalogText("incidentCases.flying-book-window.reactions.2.author"), title: catalogText("incidentCases.flying-book-window.reactions.2.title"), body: catalogText("incidentCases.flying-book-window.reactions.2.body") },
    ],
  },
  {
    id: "headline-yesterday",
    code: "TU-IR-158",
    mark: "報",
    severity: "red",
    status: "open",
    reportedAt: "2026-07-25T04:12:00.000Z",
    location: catalogText("incidentCases.headline-yesterday.location"),
    title: catalogText("incidentCases.headline-yesterday.title"),
    lede: catalogText("incidentCases.headline-yesterday.lede"),
    dispatch: catalogText("incidentCases.headline-yesterday.dispatch"),
    affected: catalogText("incidentCases.headline-yesterday.affected"),
    signal: catalogText("incidentCases.headline-yesterday.signal"),
    unit: catalogText("incidentCases.headline-yesterday.unit"),
    truthHypothesis: "cache-mix",
    simulation: { baseline: 24, confound: 19, drift: 13, missing: 18, version: 29 },
    hypotheses: [
      hypothesis("cache-mix", catalogText("incidentCases.headline-yesterday.hypotheses.0.cache-mix.1"), catalogText("incidentCases.headline-yesterday.hypotheses.0.cache-mix.2")),
      hypothesis("aya-forecast", catalogText("incidentCases.headline-yesterday.hypotheses.1.aya-forecast.1"), catalogText("incidentCases.headline-yesterday.hypotheses.1.aya-forecast.2")),
      hypothesis("history-pull", catalogText("incidentCases.headline-yesterday.hypotheses.2.history-pull.1"), catalogText("incidentCases.headline-yesterday.hypotheses.2.history-pull.2")),
    ],
    evidence: [
      evidence("layout-cache", "version", catalogText("incidentCases.headline-yesterday.evidence.0.layout-cache.2"), catalogText("incidentCases.headline-yesterday.evidence.0.layout-cache.3"), catalogText("incidentCases.headline-yesterday.evidence.0.layout-cache.4"), 97),
      evidence("valve-audio", "trace", catalogText("incidentCases.headline-yesterday.evidence.1.valve-audio.2"), catalogText("incidentCases.headline-yesterday.evidence.1.valve-audio.3"), catalogText("incidentCases.headline-yesterday.evidence.1.valve-audio.4"), 81),
      evidence("lotus-gear", "material", catalogText("incidentCases.headline-yesterday.evidence.2.lotus-gear.2"), catalogText("incidentCases.headline-yesterday.evidence.2.lotus-gear.3"), catalogText("incidentCases.headline-yesterday.evidence.2.lotus-gear.4"), 93),
      evidence("chronicle-index", "record", catalogText("incidentCases.headline-yesterday.evidence.3.chronicle-index.2"), catalogText("incidentCases.headline-yesterday.evidence.3.chronicle-index.3"), catalogText("incidentCases.headline-yesterday.evidence.3.chronicle-index.4"), 90),
    ],
    testimony: [
      testimony("aya-press", catalogText("incidentCases.headline-yesterday.testimony.0.aya-press.1"), catalogText("incidentCases.headline-yesterday.testimony.0.aya-press.2"), catalogText("incidentCases.headline-yesterday.testimony.0.aya-press.3"), catalogText("incidentCases.headline-yesterday.testimony.0.aya-press.4")),
      testimony("akyuu", catalogText("incidentCases.headline-yesterday.testimony.1.akyuu.1"), catalogText("incidentCases.headline-yesterday.testimony.1.akyuu.2"), catalogText("incidentCases.headline-yesterday.testimony.1.akyuu.3"), catalogText("incidentCases.headline-yesterday.testimony.1.akyuu.4")),
      testimony("nitori-workshop", catalogText("incidentCases.headline-yesterday.testimony.2.nitori-workshop.1"), catalogText("incidentCases.headline-yesterday.testimony.2.nitori-workshop.2"), catalogText("incidentCases.headline-yesterday.testimony.2.nitori-workshop.3"), catalogText("incidentCases.headline-yesterday.testimony.2.nitori-workshop.4")),
    ],
    actions: [
      action("purge-cache", catalogText("incidentCases.headline-yesterday.actions.0.purge-cache.1"), catalogText("incidentCases.headline-yesterday.actions.0.purge-cache.2"), catalogText("incidentCases.headline-yesterday.actions.0.purge-cache.3"), { version: -26 }),
      action("forecast-label", catalogText("incidentCases.headline-yesterday.actions.1.forecast-label.1"), catalogText("incidentCases.headline-yesterday.actions.1.forecast-label.2"), catalogText("incidentCases.headline-yesterday.actions.1.forecast-label.3"), { confound: -13 }),
      action("version-lock", catalogText("incidentCases.headline-yesterday.actions.2.version-lock.1"), catalogText("incidentCases.headline-yesterday.actions.2.version-lock.2"), catalogText("incidentCases.headline-yesterday.actions.2.version-lock.3"), { version: -18, drift: -6 }),
      action("independent-check", catalogText("incidentCases.headline-yesterday.actions.3.independent-check.1"), catalogText("incidentCases.headline-yesterday.actions.3.independent-check.2"), catalogText("incidentCases.headline-yesterday.actions.3.independent-check.3"), { confound: -16 }),
    ],
    reactions: [
      { category: "notice", author: catalogText("incidentCases.headline-yesterday.reactions.0.author"), title: catalogText("incidentCases.headline-yesterday.reactions.0.title"), body: catalogText("incidentCases.headline-yesterday.reactions.0.body") },
      { category: "course", author: catalogText("incidentCases.headline-yesterday.reactions.1.author"), title: catalogText("incidentCases.headline-yesterday.reactions.1.title"), body: catalogText("incidentCases.headline-yesterday.reactions.1.body") },
      { category: "notice", author: catalogText("incidentCases.headline-yesterday.reactions.2.author"), title: catalogText("incidentCases.headline-yesterday.reactions.2.title"), body: catalogText("incidentCases.headline-yesterday.reactions.2.body") },
    ],
  },
  {
    id: "dorm-window-chair",
    code: "TU-IR-163",
    mark: "椅",
    severity: "green",
    status: "open",
    reportedAt: "2026-07-25T05:24:00.000Z",
    location: catalogText("incidentCases.dorm-window-chair.location"),
    title: catalogText("incidentCases.dorm-window-chair.title"),
    lede: catalogText("incidentCases.dorm-window-chair.lede"),
    dispatch: catalogText("incidentCases.dorm-window-chair.dispatch"),
    affected: catalogText("incidentCases.dorm-window-chair.affected"),
    signal: catalogText("incidentCases.dorm-window-chair.signal"),
    unit: catalogText("incidentCases.dorm-window-chair.unit"),
    truthHypothesis: "emergent-tsukumogami",
    simulation: { baseline: 19, confound: 24, drift: 11, missing: 20, version: 10 },
    hypotheses: [
      hypothesis("emergent-tsukumogami", catalogText("incidentCases.dorm-window-chair.hypotheses.0.emergent-tsukumogami.1"), catalogText("incidentCases.dorm-window-chair.hypotheses.0.emergent-tsukumogami.2")),
      hypothesis("matoi-phasing", catalogText("incidentCases.dorm-window-chair.hypotheses.1.matoi-phasing.1"), catalogText("incidentCases.dorm-window-chair.hypotheses.1.matoi-phasing.2")),
      hypothesis("familiar-prank", catalogText("incidentCases.dorm-window-chair.hypotheses.2.familiar-prank.1"), catalogText("incidentCases.dorm-window-chair.hypotheses.2.familiar-prank.2")),
    ],
    evidence: [
      evidence("night-grid", "trace", catalogText("incidentCases.dorm-window-chair.evidence.0.night-grid.2"), catalogText("incidentCases.dorm-window-chair.evidence.0.night-grid.3"), catalogText("incidentCases.dorm-window-chair.evidence.0.night-grid.4"), 87),
      evidence("scratch-text", "material", catalogText("incidentCases.dorm-window-chair.evidence.1.scratch-text.2"), catalogText("incidentCases.dorm-window-chair.evidence.1.scratch-text.3"), catalogText("incidentCases.dorm-window-chair.evidence.1.scratch-text.4"), 91),
      evidence("boundary-dust", "material", catalogText("incidentCases.dorm-window-chair.evidence.2.boundary-dust.2"), catalogText("incidentCases.dorm-window-chair.evidence.2.boundary-dust.3"), catalogText("incidentCases.dorm-window-chair.evidence.2.boundary-dust.4"), 75),
      evidence("old-receipt", "record", catalogText("incidentCases.dorm-window-chair.evidence.3.old-receipt.2"), catalogText("incidentCases.dorm-window-chair.evidence.3.old-receipt.3"), catalogText("incidentCases.dorm-window-chair.evidence.3.old-receipt.4"), 66),
    ],
    testimony: [
      testimony("matoi-room", catalogText("incidentCases.dorm-window-chair.testimony.0.matoi-room.1"), catalogText("incidentCases.dorm-window-chair.testimony.0.matoi-room.2"), catalogText("incidentCases.dorm-window-chair.testimony.0.matoi-room.3"), catalogText("incidentCases.dorm-window-chair.testimony.0.matoi-room.4")),
      testimony("chacha", catalogText("incidentCases.dorm-window-chair.testimony.1.chacha.1"), catalogText("incidentCases.dorm-window-chair.testimony.1.chacha.2"), catalogText("incidentCases.dorm-window-chair.testimony.1.chacha.3"), catalogText("incidentCases.dorm-window-chair.testimony.1.chacha.4")),
      testimony("fire-mouse", catalogText("incidentCases.dorm-window-chair.testimony.2.fire-mouse.1"), catalogText("incidentCases.dorm-window-chair.testimony.2.fire-mouse.2"), catalogText("incidentCases.dorm-window-chair.testimony.2.fire-mouse.3"), catalogText("incidentCases.dorm-window-chair.testimony.2.fire-mouse.4")),
    ],
    actions: [
      action("empty-room-camera", catalogText("incidentCases.dorm-window-chair.actions.0.empty-room-camera.1"), catalogText("incidentCases.dorm-window-chair.actions.0.empty-room-camera.2"), catalogText("incidentCases.dorm-window-chair.actions.0.empty-room-camera.3"), { missing: -15, confound: -8 }),
      action("phase-control", catalogText("incidentCases.dorm-window-chair.actions.1.phase-control.1"), catalogText("incidentCases.dorm-window-chair.actions.1.phase-control.2"), catalogText("incidentCases.dorm-window-chair.actions.1.phase-control.3"), { confound: -17 }),
      action("familiar-control", catalogText("incidentCases.dorm-window-chair.actions.2.familiar-control.1"), catalogText("incidentCases.dorm-window-chair.actions.2.familiar-control.2"), catalogText("incidentCases.dorm-window-chair.actions.2.familiar-control.3"), { confound: -14, missing: -7 }),
      action("provisional-seat", catalogText("incidentCases.dorm-window-chair.actions.3.provisional-seat.1"), catalogText("incidentCases.dorm-window-chair.actions.3.provisional-seat.2"), catalogText("incidentCases.dorm-window-chair.actions.3.provisional-seat.3"), { confound: -5 }),
    ],
    reactions: [
      { category: "notice", author: catalogText("incidentCases.dorm-window-chair.reactions.0.author"), title: catalogText("incidentCases.dorm-window-chair.reactions.0.title"), body: catalogText("incidentCases.dorm-window-chair.reactions.0.body") },
      { category: "market", author: catalogText("incidentCases.dorm-window-chair.reactions.1.author"), title: catalogText("incidentCases.dorm-window-chair.reactions.1.title"), body: catalogText("incidentCases.dorm-window-chair.reactions.1.body") },
      { category: "course", author: catalogText("incidentCases.dorm-window-chair.reactions.2.author"), title: catalogText("incidentCases.dorm-window-chair.reactions.2.title"), body: catalogText("incidentCases.dorm-window-chair.reactions.2.body") },
    ],
  },
];

export const incidentSeverity = {
  green: catalogText("incidentSeverity.green"),
  amber: catalogText("incidentSeverity.amber"),
  red: catalogText("incidentSeverity.red"),
};

export const evidenceKinds = {
  instrument: catalogText("evidenceKinds.instrument"),
  record: catalogText("evidenceKinds.record"),
  trace: catalogText("evidenceKinds.trace"),
  media: catalogText("evidenceKinds.media"),
  environment: catalogText("evidenceKinds.environment"),
  version: catalogText("evidenceKinds.version"),
  material: catalogText("evidenceKinds.material"),
};

export const incidentRetentionReviewers = {
  aya: {
    name: catalogText("incidentRetentionReviewers.aya.name"),
    role: catalogText("incidentRetentionReviewers.aya.role"),
    note: catalogText("incidentRetentionReviewers.aya.note"),
  },
  marisa: {
    name: catalogText("incidentRetentionReviewers.marisa.name"),
    role: catalogText("incidentRetentionReviewers.marisa.role"),
    note: catalogText("incidentRetentionReviewers.marisa.note"),
  },
  yukari: {
    name: catalogText("incidentRetentionReviewers.yukari.name"),
    role: catalogText("incidentRetentionReviewers.yukari.role"),
    note: catalogText("incidentRetentionReviewers.yukari.note"),
  },
  keine: {
    name: catalogText("incidentRetentionReviewers.keine.name"),
    role: catalogText("incidentRetentionReviewers.keine.role"),
    note: catalogText("incidentRetentionReviewers.keine.note"),
  },
};

export const incidentRetentionReasons = {
  counterexample: catalogText("incidentRetentionReasons.counterexample"),
  method: catalogText("incidentRetentionReasons.method"),
  public: catalogText("incidentRetentionReasons.public"),
  headline: catalogText("incidentRetentionReasons.headline"),
};

export function incidentById(id) {
  return incidentCases.find((record) => record.id === id);
}
