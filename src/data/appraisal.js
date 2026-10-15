import { values as catalogValues, text as catalogText } from "../generated/i18n/data/appraisal.js";
const l = (zh, ja, en) => ({ "zh-Hant": zh, ja, en });
const evidence = (id, label, detail) => ({ id, label: l(...label), detail: l(...detail) });
const hypothesis = (id, title, claim, isIntended = false) => ({
  id,
  title: l(...title),
  claim: l(...claim),
  isIntended,
});
const test = (id, title, method, result, supports = []) => ({
  id,
  title: l(...title),
  method: l(...method),
  result: l(...result),
  supports,
});
const use = (id, title, note) => ({ id, title: l(...title), note: l(...note) });

export const appraisalDestinations = {
  library: {
    glyph: "書",
    name: catalogText("appraisalDestinations.library.name"),
    note: catalogText("appraisalDestinations.library.note"),
  },
  kourindou: {
    glyph: "香",
    name: catalogText("appraisalDestinations.kourindou.name"),
    note: catalogText("appraisalDestinations.kourindou.note"),
  },
  kappa: {
    glyph: "河",
    name: catalogText("appraisalDestinations.kappa.name"),
    note: catalogText("appraisalDestinations.kappa.note"),
  },
  museum: {
    glyph: "稗",
    name: catalogText("appraisalDestinations.museum.name"),
    note: catalogText("appraisalDestinations.museum.note"),
  },
  sealed: {
    glyph: "封",
    name: catalogText("appraisalDestinations.sealed.name"),
    note: catalogText("appraisalDestinations.sealed.note"),
  },
};

export const appraisalAgencyLevels = {
  none: catalogText("appraisalAgencyLevels.none"),
  watch: catalogText("appraisalAgencyLevels.watch"),
  stirring: catalogText("appraisalAgencyLevels.stirring"),
  objected: catalogText("appraisalAgencyLevels.objected"),
};

export const appraisalReviewers = {
  rinnosuke: {
    name: catalogText("appraisalReviewers.rinnosuke.name"),
    role: catalogText("appraisalReviewers.rinnosuke.role"),
  },
  ran: {
    name: catalogText("appraisalReviewers.ran.name"),
    role: catalogText("appraisalReviewers.ran.role"),
  },
  nitori: {
    name: catalogText("appraisalReviewers.nitori.name"),
    role: catalogText("appraisalReviewers.nitori.role"),
  },
  kogasa: {
    name: catalogText("appraisalReviewers.kogasa.name"),
    role: catalogText("appraisalReviewers.kogasa.role"),
  },
};

export const appraisalObjects = [
  {
    id: "thermal-printer",
    code: "KML-O-077-18",
    glyph: "票",
    name: catalogText("appraisalObjects.thermal-printer.name"),
    workingTitle: catalogText("appraisalObjects.thermal-printer.workingTitle"),
    arrival: catalogText("appraisalObjects.thermal-printer.arrival"),
    condition: catalogText("appraisalObjects.thermal-printer.condition"),
    evidence: [
      evidence("slot", catalogValues("appraisalObjects.thermal-printer.evidence.0.slot.1"), catalogValues("appraisalObjects.thermal-printer.evidence.0.slot.2")),
      evidence("residue", catalogValues("appraisalObjects.thermal-printer.evidence.1.residue.1"), catalogValues("appraisalObjects.thermal-printer.evidence.1.residue.2")),
      evidence("marks", catalogValues("appraisalObjects.thermal-printer.evidence.2.marks.1"), catalogValues("appraisalObjects.thermal-printer.evidence.2.marks.2")),
    ],
    hypotheses: [
      hypothesis("fortune", catalogValues("appraisalObjects.thermal-printer.hypotheses.0.fortune.1"), catalogValues("appraisalObjects.thermal-printer.hypotheses.0.fortune.2")),
      hypothesis("label-printer", catalogValues("appraisalObjects.thermal-printer.hypotheses.1.label-printer.1"), catalogValues("appraisalObjects.thermal-printer.hypotheses.1.label-printer.2"), true),
      hypothesis("name-stamper", catalogValues("appraisalObjects.thermal-printer.hypotheses.2.name-stamper.1"), catalogValues("appraisalObjects.thermal-printer.hypotheses.2.name-stamper.2")),
    ],
    tests: [
      test("raking-light", catalogValues("appraisalObjects.thermal-printer.tests.0.raking-light.1"), catalogValues("appraisalObjects.thermal-printer.tests.0.raking-light.2"), catalogValues("appraisalObjects.thermal-printer.tests.0.raking-light.3"), ["label-printer"]),
      test("paper-scrap", catalogValues("appraisalObjects.thermal-printer.tests.1.paper-scrap.1"), catalogValues("appraisalObjects.thermal-printer.tests.1.paper-scrap.2"), catalogValues("appraisalObjects.thermal-printer.tests.1.paper-scrap.3"), ["label-printer"]),
      test("passive-port", catalogValues("appraisalObjects.thermal-printer.tests.2.passive-port.1"), catalogValues("appraisalObjects.thermal-printer.tests.2.passive-port.2"), catalogValues("appraisalObjects.thermal-printer.tests.2.passive-port.3"), ["label-printer", "name-stamper"]),
    ],
    uses: [
      use("shelf-labels", catalogValues("appraisalObjects.thermal-printer.uses.0.shelf-labels.1"), catalogValues("appraisalObjects.thermal-printer.uses.0.shelf-labels.2")),
      use("fortune-corrections", catalogValues("appraisalObjects.thermal-printer.uses.1.fortune-corrections.1"), catalogValues("appraisalObjects.thermal-printer.uses.1.fortune-corrections.2")),
      use("valve-tags", catalogValues("appraisalObjects.thermal-printer.uses.2.valve-tags.1"), catalogValues("appraisalObjects.thermal-printer.uses.2.valve-tags.2")),
    ],
    truth: {
      intended: catalogText("appraisalObjects.thermal-printer.truth.intended"),
      operation: catalogText("appraisalObjects.thermal-printer.truth.operation"),
      caution: catalogText("appraisalObjects.thermal-printer.truth.caution"),
    },
    panel: {
      rinnosuke: catalogText("appraisalObjects.thermal-printer.panel.rinnosuke"),
      ran: catalogText("appraisalObjects.thermal-printer.panel.ran"),
      nitori: catalogText("appraisalObjects.thermal-printer.panel.nitori"),
      kogasa: catalogText("appraisalObjects.thermal-printer.panel.kogasa"),
    },
    agencyBase: 1,
  },
  {
    id: "single-earbud",
    code: "KML-O-077-31",
    glyph: "聽",
    name: catalogText("appraisalObjects.single-earbud.name"),
    workingTitle: catalogText("appraisalObjects.single-earbud.workingTitle"),
    arrival: catalogText("appraisalObjects.single-earbud.arrival"),
    condition: catalogText("appraisalObjects.single-earbud.condition"),
    evidence: [
      evidence("mesh", catalogValues("appraisalObjects.single-earbud.evidence.0.mesh.1"), catalogValues("appraisalObjects.single-earbud.evidence.0.mesh.2")),
      evidence("contacts", catalogValues("appraisalObjects.single-earbud.evidence.1.contacts.1"), catalogValues("appraisalObjects.single-earbud.evidence.1.contacts.2")),
      evidence("letter", catalogValues("appraisalObjects.single-earbud.evidence.2.letter.1"), catalogValues("appraisalObjects.single-earbud.evidence.2.letter.2")),
    ],
    hypotheses: [
      hypothesis("whisper-charm", catalogValues("appraisalObjects.single-earbud.hypotheses.0.whisper-charm.1"), catalogValues("appraisalObjects.single-earbud.hypotheses.0.whisper-charm.2")),
      hypothesis("wireless-earbud", catalogValues("appraisalObjects.single-earbud.hypotheses.1.wireless-earbud.1"), catalogValues("appraisalObjects.single-earbud.hypotheses.1.wireless-earbud.2"), true),
      hypothesis("dream-seed", catalogValues("appraisalObjects.single-earbud.hypotheses.2.dream-seed.1"), catalogValues("appraisalObjects.single-earbud.hypotheses.2.dream-seed.2")),
    ],
    tests: [
      test("acoustic", catalogValues("appraisalObjects.single-earbud.tests.0.acoustic.1"), catalogValues("appraisalObjects.single-earbud.tests.0.acoustic.2"), catalogValues("appraisalObjects.single-earbud.tests.0.acoustic.3"), ["wireless-earbud", "whisper-charm"]),
      test("magnetic-map", catalogValues("appraisalObjects.single-earbud.tests.1.magnetic-map.1"), catalogValues("appraisalObjects.single-earbud.tests.1.magnetic-map.2"), catalogValues("appraisalObjects.single-earbud.tests.1.magnetic-map.3"), ["wireless-earbud"]),
      test("case-impression", catalogValues("appraisalObjects.single-earbud.tests.2.case-impression.1"), catalogValues("appraisalObjects.single-earbud.tests.2.case-impression.2"), catalogValues("appraisalObjects.single-earbud.tests.2.case-impression.3"), ["wireless-earbud", "dream-seed"]),
    ],
    uses: [
      use("lost-pair-beacon", catalogValues("appraisalObjects.single-earbud.uses.0.lost-pair-beacon.1"), catalogValues("appraisalObjects.single-earbud.uses.0.lost-pair-beacon.2")),
      use("quiet-exhibit", catalogValues("appraisalObjects.single-earbud.uses.1.quiet-exhibit.1"), catalogValues("appraisalObjects.single-earbud.uses.1.quiet-exhibit.2")),
      use("fairy-metronome", catalogValues("appraisalObjects.single-earbud.uses.2.fairy-metronome.1"), catalogValues("appraisalObjects.single-earbud.uses.2.fairy-metronome.2")),
    ],
    truth: {
      intended: catalogText("appraisalObjects.single-earbud.truth.intended"),
      operation: catalogText("appraisalObjects.single-earbud.truth.operation"),
      caution: catalogText("appraisalObjects.single-earbud.truth.caution"),
    },
    panel: {
      rinnosuke: catalogText("appraisalObjects.single-earbud.panel.rinnosuke"),
      ran: catalogText("appraisalObjects.single-earbud.panel.ran"),
      nitori: catalogText("appraisalObjects.single-earbud.panel.nitori"),
      kogasa: catalogText("appraisalObjects.single-earbud.panel.kogasa"),
    },
    agencyBase: 2,
  },
  {
    id: "transit-card",
    code: "KML-O-077-44",
    glyph: "乘",
    name: catalogText("appraisalObjects.transit-card.name"),
    workingTitle: catalogText("appraisalObjects.transit-card.workingTitle"),
    arrival: catalogText("appraisalObjects.transit-card.arrival"),
    condition: catalogText("appraisalObjects.transit-card.condition"),
    evidence: [
      evidence("route", catalogValues("appraisalObjects.transit-card.evidence.0.route.1"), catalogValues("appraisalObjects.transit-card.evidence.0.route.2")),
      evidence("coil", catalogValues("appraisalObjects.transit-card.evidence.1.coil.1"), catalogValues("appraisalObjects.transit-card.evidence.1.coil.2")),
      evidence("wear", catalogValues("appraisalObjects.transit-card.evidence.2.wear.1"), catalogValues("appraisalObjects.transit-card.evidence.2.wear.2")),
    ],
    hypotheses: [
      hypothesis("fare-card", catalogValues("appraisalObjects.transit-card.hypotheses.0.fare-card.1"), catalogValues("appraisalObjects.transit-card.hypotheses.0.fare-card.2"), true),
      hypothesis("boundary-pass", catalogValues("appraisalObjects.transit-card.hypotheses.1.boundary-pass.1"), catalogValues("appraisalObjects.transit-card.hypotheses.1.boundary-pass.2")),
      hypothesis("luck-card", catalogValues("appraisalObjects.transit-card.hypotheses.2.luck-card.1"), catalogValues("appraisalObjects.transit-card.hypotheses.2.luck-card.2")),
    ],
    tests: [
      test("field-response", catalogValues("appraisalObjects.transit-card.tests.0.field-response.1"), catalogValues("appraisalObjects.transit-card.tests.0.field-response.2"), catalogValues("appraisalObjects.transit-card.tests.0.field-response.3"), ["fare-card", "boundary-pass"]),
      test("route-archive", catalogValues("appraisalObjects.transit-card.tests.1.route-archive.1"), catalogValues("appraisalObjects.transit-card.tests.1.route-archive.2"), catalogValues("appraisalObjects.transit-card.tests.1.route-archive.3"), ["fare-card"]),
      test("boundary-reflection", catalogValues("appraisalObjects.transit-card.tests.2.boundary-reflection.1"), catalogValues("appraisalObjects.transit-card.tests.2.boundary-reflection.2"), catalogValues("appraisalObjects.transit-card.tests.2.boundary-reflection.3"), ["boundary-pass", "fare-card"]),
    ],
    uses: [
      use("route-history", catalogValues("appraisalObjects.transit-card.uses.0.route-history.1"), catalogValues("appraisalObjects.transit-card.uses.0.route-history.2")),
      use("shuttle-token", catalogValues("appraisalObjects.transit-card.uses.1.shuttle-token.1"), catalogValues("appraisalObjects.transit-card.uses.1.shuttle-token.2")),
      use("gate-teaching", catalogValues("appraisalObjects.transit-card.uses.2.gate-teaching.1"), catalogValues("appraisalObjects.transit-card.uses.2.gate-teaching.2")),
    ],
    truth: {
      intended: catalogText("appraisalObjects.transit-card.truth.intended"),
      operation: catalogText("appraisalObjects.transit-card.truth.operation"),
      caution: catalogText("appraisalObjects.transit-card.truth.caution"),
    },
    panel: {
      rinnosuke: catalogText("appraisalObjects.transit-card.panel.rinnosuke"),
      ran: catalogText("appraisalObjects.transit-card.panel.ran"),
      nitori: catalogText("appraisalObjects.transit-card.panel.nitori"),
      kogasa: catalogText("appraisalObjects.transit-card.panel.kogasa"),
    },
    agencyBase: 1,
  },
  {
    id: "unreadable-disc",
    code: "KML-O-077-52",
    glyph: "盤",
    name: catalogText("appraisalObjects.unreadable-disc.name"),
    workingTitle: catalogText("appraisalObjects.unreadable-disc.workingTitle"),
    arrival: catalogText("appraisalObjects.unreadable-disc.arrival"),
    condition: catalogText("appraisalObjects.unreadable-disc.condition"),
    evidence: [
      evidence("rings", catalogValues("appraisalObjects.unreadable-disc.evidence.0.rings.1"), catalogValues("appraisalObjects.unreadable-disc.evidence.0.rings.2")),
      evidence("sleeve", catalogValues("appraisalObjects.unreadable-disc.evidence.1.sleeve.1"), catalogValues("appraisalObjects.unreadable-disc.evidence.1.sleeve.2")),
      evidence("fingerprints", catalogValues("appraisalObjects.unreadable-disc.evidence.2.fingerprints.1"), catalogValues("appraisalObjects.unreadable-disc.evidence.2.fingerprints.2")),
    ],
    hypotheses: [
      hypothesis("music-disc", catalogValues("appraisalObjects.unreadable-disc.hypotheses.0.music-disc.1"), catalogValues("appraisalObjects.unreadable-disc.hypotheses.0.music-disc.2")),
      hypothesis("data-disc", catalogValues("appraisalObjects.unreadable-disc.hypotheses.1.data-disc.1"), catalogValues("appraisalObjects.unreadable-disc.hypotheses.1.data-disc.2"), true),
      hypothesis("moon-fragment", catalogValues("appraisalObjects.unreadable-disc.hypotheses.2.moon-fragment.1"), catalogValues("appraisalObjects.unreadable-disc.hypotheses.2.moon-fragment.2")),
    ],
    tests: [
      test("spectral", catalogValues("appraisalObjects.unreadable-disc.tests.0.spectral.1"), catalogValues("appraisalObjects.unreadable-disc.tests.0.spectral.2"), catalogValues("appraisalObjects.unreadable-disc.tests.0.spectral.3"), ["data-disc", "music-disc"]),
      test("track-map", catalogValues("appraisalObjects.unreadable-disc.tests.1.track-map.1"), catalogValues("appraisalObjects.unreadable-disc.tests.1.track-map.2"), catalogValues("appraisalObjects.unreadable-disc.tests.1.track-map.3"), ["data-disc"]),
      test("sleeve-history", catalogValues("appraisalObjects.unreadable-disc.tests.2.sleeve-history.1"), catalogValues("appraisalObjects.unreadable-disc.tests.2.sleeve-history.2"), catalogValues("appraisalObjects.unreadable-disc.tests.2.sleeve-history.3"), ["data-disc"]),
    ],
    uses: [
      use("sealed-archive", catalogValues("appraisalObjects.unreadable-disc.uses.0.sealed-archive.1"), catalogValues("appraisalObjects.unreadable-disc.uses.0.sealed-archive.2")),
      use("version-teaching", catalogValues("appraisalObjects.unreadable-disc.uses.1.version-teaching.1"), catalogValues("appraisalObjects.unreadable-disc.uses.1.version-teaching.2")),
      use("light-mobile", catalogValues("appraisalObjects.unreadable-disc.uses.2.light-mobile.1"), catalogValues("appraisalObjects.unreadable-disc.uses.2.light-mobile.2")),
    ],
    truth: {
      intended: catalogText("appraisalObjects.unreadable-disc.truth.intended"),
      operation: catalogText("appraisalObjects.unreadable-disc.truth.operation"),
      caution: catalogText("appraisalObjects.unreadable-disc.truth.caution"),
    },
    panel: {
      rinnosuke: catalogText("appraisalObjects.unreadable-disc.panel.rinnosuke"),
      ran: catalogText("appraisalObjects.unreadable-disc.panel.ran"),
      nitori: catalogText("appraisalObjects.unreadable-disc.panel.nitori"),
      kogasa: catalogText("appraisalObjects.unreadable-disc.panel.kogasa"),
    },
    agencyBase: 1,
  },
  {
    id: "disposable-camera",
    code: "KML-O-077-61",
    glyph: "影",
    name: catalogText("appraisalObjects.disposable-camera.name"),
    workingTitle: catalogText("appraisalObjects.disposable-camera.workingTitle"),
    arrival: catalogText("appraisalObjects.disposable-camera.arrival"),
    condition: catalogText("appraisalObjects.disposable-camera.condition"),
    evidence: [
      evidence("lens", catalogValues("appraisalObjects.disposable-camera.evidence.0.lens.1"), catalogValues("appraisalObjects.disposable-camera.evidence.0.lens.2")),
      evidence("counter", catalogValues("appraisalObjects.disposable-camera.evidence.1.counter.1"), catalogValues("appraisalObjects.disposable-camera.evidence.1.counter.2")),
      evidence("warning", catalogValues("appraisalObjects.disposable-camera.evidence.2.warning.1"), catalogValues("appraisalObjects.disposable-camera.evidence.2.warning.2")),
    ],
    hypotheses: [
      hypothesis("spirit-box", catalogValues("appraisalObjects.disposable-camera.hypotheses.0.spirit-box.1"), catalogValues("appraisalObjects.disposable-camera.hypotheses.0.spirit-box.2")),
      hypothesis("single-use-camera", catalogValues("appraisalObjects.disposable-camera.hypotheses.1.single-use-camera.1"), catalogValues("appraisalObjects.disposable-camera.hypotheses.1.single-use-camera.2"), true),
      hypothesis("memory-counter", catalogValues("appraisalObjects.disposable-camera.hypotheses.2.memory-counter.1"), catalogValues("appraisalObjects.disposable-camera.hypotheses.2.memory-counter.2")),
    ],
    tests: [
      test("dark-bag", catalogValues("appraisalObjects.disposable-camera.tests.0.dark-bag.1"), catalogValues("appraisalObjects.disposable-camera.tests.0.dark-bag.2"), catalogValues("appraisalObjects.disposable-camera.tests.0.dark-bag.3"), ["single-use-camera", "memory-counter"]),
      test("capacitor-field", catalogValues("appraisalObjects.disposable-camera.tests.1.capacitor-field.1"), catalogValues("appraisalObjects.disposable-camera.tests.1.capacitor-field.2"), catalogValues("appraisalObjects.disposable-camera.tests.1.capacitor-field.3"), ["single-use-camera"]),
      test("privacy-provenance", catalogValues("appraisalObjects.disposable-camera.tests.2.privacy-provenance.1"), catalogValues("appraisalObjects.disposable-camera.tests.2.privacy-provenance.2"), catalogValues("appraisalObjects.disposable-camera.tests.2.privacy-provenance.3"), ["single-use-camera", "spirit-box"]),
    ],
    uses: [
      use("sealed-history", catalogValues("appraisalObjects.disposable-camera.uses.0.sealed-history.1"), catalogValues("appraisalObjects.disposable-camera.uses.0.sealed-history.2")),
      use("camera-teaching", catalogValues("appraisalObjects.disposable-camera.uses.1.camera-teaching.1"), catalogValues("appraisalObjects.disposable-camera.uses.1.camera-teaching.2")),
      use("three-consented-frames", catalogValues("appraisalObjects.disposable-camera.uses.2.three-consented-frames.1"), catalogValues("appraisalObjects.disposable-camera.uses.2.three-consented-frames.2")),
    ],
    truth: {
      intended: catalogText("appraisalObjects.disposable-camera.truth.intended"),
      operation: catalogText("appraisalObjects.disposable-camera.truth.operation"),
      caution: catalogText("appraisalObjects.disposable-camera.truth.caution"),
    },
    panel: {
      rinnosuke: catalogText("appraisalObjects.disposable-camera.panel.rinnosuke"),
      ran: catalogText("appraisalObjects.disposable-camera.panel.ran"),
      nitori: catalogText("appraisalObjects.disposable-camera.panel.nitori"),
      kogasa: catalogText("appraisalObjects.disposable-camera.panel.kogasa"),
    },
    agencyBase: 2,
  },
  {
    id: "orphan-controller",
    code: "KML-O-077-68",
    glyph: "遊",
    name: catalogText("appraisalObjects.orphan-controller.name"),
    workingTitle: catalogText("appraisalObjects.orphan-controller.workingTitle"),
    arrival: catalogText("appraisalObjects.orphan-controller.arrival"),
    condition: catalogText("appraisalObjects.orphan-controller.condition"),
    evidence: [
      evidence("layout", catalogValues("appraisalObjects.orphan-controller.evidence.0.layout.1"), catalogValues("appraisalObjects.orphan-controller.evidence.0.layout.2")),
      evidence("cable", catalogValues("appraisalObjects.orphan-controller.evidence.1.cable.1"), catalogValues("appraisalObjects.orphan-controller.evidence.1.cable.2")),
      evidence("mass", catalogValues("appraisalObjects.orphan-controller.evidence.2.mass.1"), catalogValues("appraisalObjects.orphan-controller.evidence.2.mass.2")),
    ],
    hypotheses: [
      hypothesis("danmaku-trainer", catalogValues("appraisalObjects.orphan-controller.hypotheses.0.danmaku-trainer.1"), catalogValues("appraisalObjects.orphan-controller.hypotheses.0.danmaku-trainer.2")),
      hypothesis("game-controller", catalogValues("appraisalObjects.orphan-controller.hypotheses.1.game-controller.1"), catalogValues("appraisalObjects.orphan-controller.hypotheses.1.game-controller.2"), true),
      hypothesis("remote-shikigami", catalogValues("appraisalObjects.orphan-controller.hypotheses.2.remote-shikigami.1"), catalogValues("appraisalObjects.orphan-controller.hypotheses.2.remote-shikigami.2")),
    ],
    tests: [
      test("continuity", catalogValues("appraisalObjects.orphan-controller.tests.0.continuity.1"), catalogValues("appraisalObjects.orphan-controller.tests.0.continuity.2"), catalogValues("appraisalObjects.orphan-controller.tests.0.continuity.3"), ["game-controller", "danmaku-trainer"]),
      test("mass-map", catalogValues("appraisalObjects.orphan-controller.tests.1.mass-map.1"), catalogValues("appraisalObjects.orphan-controller.tests.1.mass-map.2"), catalogValues("appraisalObjects.orphan-controller.tests.1.mass-map.3"), ["game-controller"]),
      test("adapter-fit", catalogValues("appraisalObjects.orphan-controller.tests.2.adapter-fit.1"), catalogValues("appraisalObjects.orphan-controller.tests.2.adapter-fit.2"), catalogValues("appraisalObjects.orphan-controller.tests.2.adapter-fit.3"), ["game-controller", "remote-shikigami"]),
    ],
    uses: [
      use("input-teaching", catalogValues("appraisalObjects.orphan-controller.uses.0.input-teaching.1"), catalogValues("appraisalObjects.orphan-controller.uses.0.input-teaching.2")),
      use("danmaku-access", catalogValues("appraisalObjects.orphan-controller.uses.1.danmaku-access.1"), catalogValues("appraisalObjects.orphan-controller.uses.1.danmaku-access.2")),
      use("kappa-prototype", catalogValues("appraisalObjects.orphan-controller.uses.2.kappa-prototype.1"), catalogValues("appraisalObjects.orphan-controller.uses.2.kappa-prototype.2")),
    ],
    truth: {
      intended: catalogText("appraisalObjects.orphan-controller.truth.intended"),
      operation: catalogText("appraisalObjects.orphan-controller.truth.operation"),
      caution: catalogText("appraisalObjects.orphan-controller.truth.caution"),
    },
    panel: {
      rinnosuke: catalogText("appraisalObjects.orphan-controller.panel.rinnosuke"),
      ran: catalogText("appraisalObjects.orphan-controller.panel.ran"),
      nitori: catalogText("appraisalObjects.orphan-controller.panel.nitori"),
      kogasa: catalogText("appraisalObjects.orphan-controller.panel.kogasa"),
    },
    agencyBase: 2,
  },
  {
    id: "orphan-cable",
    code: "KML-O-077-72",
    glyph: "線",
    name: catalogText("appraisalObjects.orphan-cable.name"),
    workingTitle: catalogText("appraisalObjects.orphan-cable.workingTitle"),
    arrival: catalogText("appraisalObjects.orphan-cable.arrival"),
    condition: catalogText("appraisalObjects.orphan-cable.condition"),
    evidence: [
      evidence("ends", catalogValues("appraisalObjects.orphan-cable.evidence.0.ends.1"), catalogValues("appraisalObjects.orphan-cable.evidence.0.ends.2")),
      evidence("strain", catalogValues("appraisalObjects.orphan-cable.evidence.1.strain.1"), catalogValues("appraisalObjects.orphan-cable.evidence.1.strain.2")),
      evidence("shield", catalogValues("appraisalObjects.orphan-cable.evidence.2.shield.1"), catalogValues("appraisalObjects.orphan-cable.evidence.2.shield.2")),
    ],
    hypotheses: [
      hypothesis("charging-data", catalogValues("appraisalObjects.orphan-cable.hypotheses.0.charging-data.1"), catalogValues("appraisalObjects.orphan-cable.hypotheses.0.charging-data.2"), true),
      hypothesis("boundary-thread", catalogValues("appraisalObjects.orphan-cable.hypotheses.1.boundary-thread.1"), catalogValues("appraisalObjects.orphan-cable.hypotheses.1.boundary-thread.2")),
      hypothesis("familiar-leash", catalogValues("appraisalObjects.orphan-cable.hypotheses.2.familiar-leash.1"), catalogValues("appraisalObjects.orphan-cable.hypotheses.2.familiar-leash.2")),
    ],
    tests: [
      test("conductor-map", catalogValues("appraisalObjects.orphan-cable.tests.0.conductor-map.1"), catalogValues("appraisalObjects.orphan-cable.tests.0.conductor-map.2"), catalogValues("appraisalObjects.orphan-cable.tests.0.conductor-map.3"), ["charging-data", "boundary-thread"]),
      test("connector-catalogue", catalogValues("appraisalObjects.orphan-cable.tests.1.connector-catalogue.1"), catalogValues("appraisalObjects.orphan-cable.tests.1.connector-catalogue.2"), catalogValues("appraisalObjects.orphan-cable.tests.1.connector-catalogue.3"), ["charging-data"]),
      test("shield-test", catalogValues("appraisalObjects.orphan-cable.tests.2.shield-test.1"), catalogValues("appraisalObjects.orphan-cable.tests.2.shield-test.2"), catalogValues("appraisalObjects.orphan-cable.tests.2.shield-test.3"), ["charging-data", "boundary-thread"]),
    ],
    uses: [
      use("connector-history", catalogValues("appraisalObjects.orphan-cable.uses.0.connector-history.1"), catalogValues("appraisalObjects.orphan-cable.uses.0.connector-history.2")),
      use("reversible-adapter", catalogValues("appraisalObjects.orphan-cable.uses.1.reversible-adapter.1"), catalogValues("appraisalObjects.orphan-cable.uses.1.reversible-adapter.2")),
      use("catalogue-tether", catalogValues("appraisalObjects.orphan-cable.uses.2.catalogue-tether.1"), catalogValues("appraisalObjects.orphan-cable.uses.2.catalogue-tether.2")),
    ],
    truth: {
      intended: catalogText("appraisalObjects.orphan-cable.truth.intended"),
      operation: catalogText("appraisalObjects.orphan-cable.truth.operation"),
      caution: catalogText("appraisalObjects.orphan-cable.truth.caution"),
    },
    panel: {
      rinnosuke: catalogText("appraisalObjects.orphan-cable.panel.rinnosuke"),
      ran: catalogText("appraisalObjects.orphan-cable.panel.ran"),
      nitori: catalogText("appraisalObjects.orphan-cable.panel.nitori"),
      kogasa: catalogText("appraisalObjects.orphan-cable.panel.kogasa"),
    },
    agencyBase: 1,
  },
  {
    id: "frozen-reader",
    code: "KML-O-077-77",
    glyph: "頁",
    name: catalogText("appraisalObjects.frozen-reader.name"),
    workingTitle: catalogText("appraisalObjects.frozen-reader.workingTitle"),
    arrival: catalogText("appraisalObjects.frozen-reader.arrival"),
    condition: catalogText("appraisalObjects.frozen-reader.condition"),
    evidence: [
      evidence("persistent-page", catalogValues("appraisalObjects.frozen-reader.evidence.0.persistent-page.1"), catalogValues("appraisalObjects.frozen-reader.evidence.0.persistent-page.2")),
      evidence("bezel", catalogValues("appraisalObjects.frozen-reader.evidence.1.bezel.1"), catalogValues("appraisalObjects.frozen-reader.evidence.1.bezel.2")),
      evidence("page", catalogValues("appraisalObjects.frozen-reader.evidence.2.page.1"), catalogValues("appraisalObjects.frozen-reader.evidence.2.page.2")),
    ],
    hypotheses: [
      hypothesis("e-reader", catalogValues("appraisalObjects.frozen-reader.hypotheses.0.e-reader.1"), catalogValues("appraisalObjects.frozen-reader.hypotheses.0.e-reader.2"), true),
      hypothesis("book-prison", catalogValues("appraisalObjects.frozen-reader.hypotheses.1.book-prison.1"), catalogValues("appraisalObjects.frozen-reader.hypotheses.1.book-prison.2")),
      hypothesis("sentence-talisman", catalogValues("appraisalObjects.frozen-reader.hypotheses.2.sentence-talisman.1"), catalogValues("appraisalObjects.frozen-reader.hypotheses.2.sentence-talisman.2")),
    ],
    tests: [
      test("polarization", catalogValues("appraisalObjects.frozen-reader.tests.0.polarization.1"), catalogValues("appraisalObjects.frozen-reader.tests.0.polarization.2"), catalogValues("appraisalObjects.frozen-reader.tests.0.polarization.3"), ["e-reader", "book-prison"]),
      test("port-rubbing", catalogValues("appraisalObjects.frozen-reader.tests.1.port-rubbing.1"), catalogValues("appraisalObjects.frozen-reader.tests.1.port-rubbing.2"), catalogValues("appraisalObjects.frozen-reader.tests.1.port-rubbing.3"), ["e-reader"]),
      test("page-catalogue", catalogValues("appraisalObjects.frozen-reader.tests.2.page-catalogue.1"), catalogValues("appraisalObjects.frozen-reader.tests.2.page-catalogue.2"), catalogValues("appraisalObjects.frozen-reader.tests.2.page-catalogue.3"), ["e-reader", "sentence-talisman"]),
    ],
    uses: [
      use("media-history", catalogValues("appraisalObjects.frozen-reader.uses.0.media-history.1"), catalogValues("appraisalObjects.frozen-reader.uses.0.media-history.2")),
      use("recovery-project", catalogValues("appraisalObjects.frozen-reader.uses.1.recovery-project.1"), catalogValues("appraisalObjects.frozen-reader.uses.1.recovery-project.2")),
      use("unfinished-sentence", catalogValues("appraisalObjects.frozen-reader.uses.2.unfinished-sentence.1"), catalogValues("appraisalObjects.frozen-reader.uses.2.unfinished-sentence.2")),
    ],
    truth: {
      intended: catalogText("appraisalObjects.frozen-reader.truth.intended"),
      operation: catalogText("appraisalObjects.frozen-reader.truth.operation"),
      caution: catalogText("appraisalObjects.frozen-reader.truth.caution"),
    },
    panel: {
      rinnosuke: catalogText("appraisalObjects.frozen-reader.panel.rinnosuke"),
      ran: catalogText("appraisalObjects.frozen-reader.panel.ran"),
      nitori: catalogText("appraisalObjects.frozen-reader.panel.nitori"),
      kogasa: catalogText("appraisalObjects.frozen-reader.panel.kogasa"),
    },
    agencyBase: 3,
  },
];

export function appraisalObject(id) {
  return appraisalObjects.find((item) => item.id === id);
}
