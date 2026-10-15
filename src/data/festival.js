import { text as catalogText } from "../generated/i18n/data/festival.js";

export const festivalKinds = Object.freeze([
  {
    id: "spring-lantern",
    glyph: "燈",
    code: "TU-FEST-SPRING",
    name: catalogText("festivalKinds.0.spring-lantern.name"),
    short: catalogText("festivalKinds.0.spring-lantern.short"),
    premise: catalogText("festivalKinds.0.spring-lantern.premise"),
  },
  {
    id: "boundary-opening",
    glyph: "界",
    code: "TU-FEST-OPEN",
    name: catalogText("festivalKinds.0.boundary-opening.name"),
    short: catalogText("festivalKinds.0.boundary-opening.short"),
    premise: catalogText("festivalKinds.0.boundary-opening.premise"),
  },
]);

export const festivalRoutes = Object.freeze([
  {
    id: "lake-ring",
    glyph: "湖",
    name: catalogText("festivalRoutes.0.lake-ring.name"),
    detail: catalogText("festivalRoutes.0.lake-ring.detail"),
    path: ["gate", "library", "boundary"],
    closedEdges: ["boundary--library"],
    delay: 5,
    capacity: 560,
  },
  {
    id: "vermilion-procession",
    glyph: "朱",
    name: catalogText("festivalRoutes.0.vermilion-procession.name"),
    detail: catalogText("festivalRoutes.0.vermilion-procession.detail"),
    path: ["gate", "boundary", "history"],
    closedEdges: ["boundary--gate"],
    delay: 7,
    capacity: 720,
  },
  {
    id: "mountain-circuit",
    glyph: "山",
    name: catalogText("festivalRoutes.0.mountain-circuit.name"),
    detail: catalogText("festivalRoutes.0.mountain-circuit.detail"),
    path: ["kappa", "magic", "boundary"],
    closedEdges: ["boundary--kappa"],
    delay: 10,
    capacity: 440,
  },
  {
    id: "three-faith-loop",
    glyph: "祀",
    name: catalogText("festivalRoutes.0.three-faith-loop.name"),
    detail: catalogText("festivalRoutes.0.three-faith-loop.detail"),
    path: ["gate", "history", "boundary", "library"],
    closedEdges: ["history--library"],
    delay: 8,
    capacity: 620,
  },
]);

export const festivalStages = Object.freeze([
  {
    id: "boundary-roof",
    name: catalogText("festivalStages.0.boundary-roof.name"),
    capacity: 620,
    power: 32,
    clinic: 4,
    dormNoise: 1,
    note: catalogText("festivalStages.0.boundary-roof.note"),
  },
  {
    id: "lake-bank",
    name: catalogText("festivalStages.0.lake-bank.name"),
    capacity: 520,
    power: 24,
    clinic: 3,
    dormNoise: 2,
    note: catalogText("festivalStages.0.lake-bank.note"),
  },
  {
    id: "hakurei-yard",
    name: catalogText("festivalStages.0.hakurei-yard.name"),
    capacity: 380,
    power: 18,
    clinic: 2,
    dormNoise: 0,
    note: catalogText("festivalStages.0.hakurei-yard.note"),
  },
  {
    id: "history-court",
    name: catalogText("festivalStages.0.history-court.name"),
    capacity: 300,
    power: 14,
    clinic: 1,
    dormNoise: 3,
    note: catalogText("festivalStages.0.history-court.note"),
  },
]);

export const festivalPowerPlans = Object.freeze([
  {
    id: "kappa-grid",
    name: catalogText("festivalPowerPlans.0.kappa-grid.name"),
    capacity: 72,
    backup: 18,
    owner: catalogText("festivalPowerPlans.0.kappa-grid.owner"),
    dispute: catalogText("festivalPowerPlans.0.kappa-grid.dispute"),
  },
  {
    id: "moriya-grid",
    name: catalogText("festivalPowerPlans.0.moriya-grid.name"),
    capacity: 94,
    backup: 24,
    owner: catalogText("festivalPowerPlans.0.moriya-grid.owner"),
    dispute: catalogText("festivalPowerPlans.0.moriya-grid.dispute"),
  },
  {
    id: "mixed-grid",
    name: catalogText("festivalPowerPlans.0.mixed-grid.name"),
    capacity: 84,
    backup: 36,
    owner: catalogText("festivalPowerPlans.0.mixed-grid.owner"),
    dispute: catalogText("festivalPowerPlans.0.mixed-grid.dispute"),
  },
  {
    id: "mini-reactors",
    name: catalogText("festivalPowerPlans.0.mini-reactors.name"),
    capacity: 116,
    backup: 8,
    owner: catalogText("festivalPowerPlans.0.mini-reactors.owner"),
    dispute: catalogText("festivalPowerPlans.0.mini-reactors.dispute"),
  },
]);

export const festivalFoodCourts = Object.freeze([
  {
    id: "village-court",
    name: catalogText("festivalFoodCourts.0.village-court.name"),
    capacity: 480,
    routeNode: "history",
    note: catalogText("festivalFoodCourts.0.village-court.note"),
  },
  {
    id: "lake-stalls",
    name: catalogText("festivalFoodCourts.0.lake-stalls.name"),
    capacity: 360,
    routeNode: "library",
    note: catalogText("festivalFoodCourts.0.lake-stalls.note"),
  },
  {
    id: "boundary-yard",
    name: catalogText("festivalFoodCourts.0.boundary-yard.name"),
    capacity: 300,
    routeNode: "boundary",
    note: catalogText("festivalFoodCourts.0.boundary-yard.note"),
  },
]);

export const festivalFairyZones = Object.freeze([
  {
    id: "lake-lawn",
    name: catalogText("festivalFairyZones.0.lake-lawn.name"),
    drift: 1,
    noise: 2,
    note: catalogText("festivalFairyZones.0.lake-lawn.note"),
  },
  {
    id: "history-court",
    name: catalogText("festivalFairyZones.0.history-court.name"),
    drift: 0,
    noise: 1,
    note: catalogText("festivalFairyZones.0.history-court.note"),
  },
  {
    id: "mobile-cloud",
    name: catalogText("festivalFairyZones.0.mobile-cloud.name"),
    drift: 4,
    noise: 3,
    note: catalogText("festivalFairyZones.0.mobile-cloud.note"),
  },
]);

export const festivalAidPlans = Object.freeze([
  {
    id: "gate-infirmary",
    name: catalogText("festivalAidPlans.0.gate-infirmary.name"),
    capacity: 12,
    travel: 4,
    note: catalogText("festivalAidPlans.0.gate-infirmary.note"),
  },
  {
    id: "eientei-station",
    name: catalogText("festivalAidPlans.0.eientei-station.name"),
    capacity: 20,
    travel: 8,
    note: catalogText("festivalAidPlans.0.eientei-station.note"),
  },
  {
    id: "dual-station",
    name: catalogText("festivalAidPlans.0.dual-station.name"),
    capacity: 32,
    travel: 3,
    note: catalogText("festivalAidPlans.0.dual-station.note"),
  },
]);

export const festivalGatePlans = Object.freeze([
  {
    id: "hakurei",
    name: catalogText("festivalGatePlans.0.hakurei.name"),
    claimant: catalogText("festivalGatePlans.0.hakurei.claimant"),
    dispute: 2,
  },
  {
    id: "moriya",
    name: catalogText("festivalGatePlans.0.moriya.name"),
    claimant: catalogText("festivalGatePlans.0.moriya.claimant"),
    dispute: 3,
  },
  {
    id: "myouren",
    name: catalogText("festivalGatePlans.0.myouren.name"),
    claimant: catalogText("festivalGatePlans.0.myouren.claimant"),
    dispute: 3,
  },
  {
    id: "rotating",
    name: catalogText("festivalGatePlans.0.rotating.name"),
    claimant: catalogText("festivalGatePlans.0.rotating.claimant"),
    dispute: 0,
  },
]);

export const festivalPressPlans = Object.freeze([
  {
    id: "aya-live",
    name: catalogText("festivalPressPlans.0.aya-live.name"),
    early: true,
    reach: 5,
    note: catalogText("festivalPressPlans.0.aya-live.note"),
  },
  {
    id: "joint-desk",
    name: catalogText("festivalPressPlans.0.joint-desk.name"),
    early: false,
    reach: 3,
    note: catalogText("festivalPressPlans.0.joint-desk.note"),
  },
  {
    id: "notice-only",
    name: catalogText("festivalPressPlans.0.notice-only.name"),
    early: false,
    reach: 1,
    note: catalogText("festivalPressPlans.0.notice-only.note"),
  },
]);

export const festivalMusicPlans = Object.freeze([
  {
    id: "sunset-only",
    name: catalogText("festivalMusicPlans.0.sunset-only.name"),
    endOffset: 190,
    noise: 0,
  },
  {
    id: "prismriver-evening",
    name: catalogText("festivalMusicPlans.0.prismriver-evening.name"),
    endOffset: 270,
    noise: 2,
  },
  {
    id: "ghost-afterhours",
    name: catalogText("festivalMusicPlans.0.ghost-afterhours.name"),
    endOffset: 360,
    noise: 5,
  },
]);

export const festivalReviewDesks = Object.freeze([
  {
    id: "reimu",
    glyph: "退",
    name: catalogText("festivalReviewDesks.0.reimu.name"),
    question: catalogText("festivalReviewDesks.0.reimu.question"),
  },
  {
    id: "nitori",
    glyph: "電",
    name: catalogText("festivalReviewDesks.0.nitori.name"),
    question: catalogText("festivalReviewDesks.0.nitori.question"),
  },
  {
    id: "eirin",
    glyph: "診",
    name: catalogText("festivalReviewDesks.0.eirin.name"),
    question: catalogText("festivalReviewDesks.0.eirin.question"),
  },
  {
    id: "aya",
    glyph: "号",
    name: catalogText("festivalReviewDesks.0.aya.name"),
    question: catalogText("festivalReviewDesks.0.aya.question"),
  },
  {
    id: "faith",
    glyph: "門",
    name: catalogText("festivalReviewDesks.0.faith.name"),
    question: catalogText("festivalReviewDesks.0.faith.question"),
  },
  {
    id: "residence",
    glyph: "夜",
    name: catalogText("festivalReviewDesks.0.residence.name"),
    question: catalogText("festivalReviewDesks.0.residence.question"),
  },
]);

export const festivalIncidentPool = Object.freeze([
  {
    id: "aya-early-opening",
    glyph: "早",
    title: catalogText("festivalIncidentPool.0.aya-early-opening.title"),
    body: catalogText("festivalIncidentPool.0.aya-early-opening.body"),
    responses: [
      {
        id: "correction-slip",
        label: catalogText("festivalIncidentPool.0.aya-early-opening.responses.correction-slip.label"),
        effects: { delay: 6, attendance: -20, clinic: 0, power: 0, dispute: 0 },
      },
      {
        id: "open-early",
        label: catalogText("festivalIncidentPool.0.aya-early-opening.responses.open-early.label"),
        effects: { delay: -4, attendance: 90, clinic: 3, power: 8, dispute: 1 },
      },
      {
        id: "ask-keine",
        label: catalogText("festivalIncidentPool.0.aya-early-opening.responses.ask-keine.label"),
        effects: { delay: 12, attendance: 10, clinic: 0, power: 1, dispute: 2 },
      },
    ],
  },
  {
    id: "power-votive-plaques",
    glyph: "電",
    title: catalogText("festivalIncidentPool.0.power-votive-plaques.title"),
    body: catalogText("festivalIncidentPool.0.power-votive-plaques.body"),
    responses: [
      {
        id: "shed-lantern-row",
        label: catalogText("festivalIncidentPool.0.power-votive-plaques.responses.shed-lantern-row.label"),
        effects: { delay: 2, attendance: -10, clinic: -1, power: -18, dispute: 0 },
      },
      {
        id: "grant-shrine-stage",
        label: catalogText("festivalIncidentPool.0.power-votive-plaques.responses.grant-shrine-stage.label"),
        effects: { delay: 0, attendance: 25, clinic: 0, power: -10, dispute: 2 },
      },
      {
        id: "hand-crank",
        label: catalogText("festivalIncidentPool.0.power-votive-plaques.responses.hand-crank.label"),
        effects: { delay: 8, attendance: 0, clinic: 1, power: -24, dispute: 0 },
      },
    ],
  },
  {
    id: "fairy-lantern-drift",
    glyph: "妖",
    title: catalogText("festivalIncidentPool.0.fairy-lantern-drift.title"),
    body: catalogText("festivalIncidentPool.0.fairy-lantern-drift.body"),
    responses: [
      {
        id: "widen-exit",
        label: catalogText("festivalIncidentPool.0.fairy-lantern-drift.responses.widen-exit.label"),
        effects: { delay: 9, attendance: -15, clinic: -3, power: -4, dispute: 0, closeExtraEdge: "boundary--magic" },
      },
      {
        id: "parade-cloud",
        label: catalogText("festivalIncidentPool.0.fairy-lantern-drift.responses.parade-cloud.label"),
        effects: { delay: 3, attendance: 35, clinic: 2, power: 2, dispute: 1 },
      },
      {
        id: "ring-recall",
        label: catalogText("festivalIncidentPool.0.fairy-lantern-drift.responses.ring-recall.label"),
        effects: { delay: 5, attendance: 5, clinic: 1, power: 0, dispute: 1 },
      },
    ],
  },
  {
    id: "prismriver-airless-noise",
    glyph: "音",
    title: catalogText("festivalIncidentPool.0.prismriver-airless-noise.title"),
    body: catalogText("festivalIncidentPool.0.prismriver-airless-noise.body"),
    responses: [
      {
        id: "end-encore",
        label: catalogText("festivalIncidentPool.0.prismriver-airless-noise.responses.end-encore.label"),
        effects: { delay: 0, attendance: -30, clinic: -1, power: -7, dispute: 0 },
      },
      {
        id: "move-lake",
        label: catalogText("festivalIncidentPool.0.prismriver-airless-noise.responses.move-lake.label"),
        effects: { delay: 11, attendance: 20, clinic: 1, power: 5, dispute: 1, closeExtraEdge: "gate--library" },
      },
      {
        id: "silent-ruling",
        label: catalogText("festivalIncidentPool.0.prismriver-airless-noise.responses.silent-ruling.label"),
        effects: { delay: 4, attendance: 0, clinic: 0, power: 0, dispute: 2 },
      },
    ],
  },
  {
    id: "full-moon-book-flock",
    glyph: "本",
    title: catalogText("festivalIncidentPool.0.full-moon-book-flock.title"),
    body: catalogText("festivalIncidentPool.0.full-moon-book-flock.body"),
    responses: [
      {
        id: "count-spines",
        label: catalogText("festivalIncidentPool.0.full-moon-book-flock.responses.count-spines.label"),
        effects: { delay: 3, attendance: 17, clinic: 0, power: 1, dispute: 0 },
      },
      {
        id: "performers",
        label: catalogText("festivalIncidentPool.0.full-moon-book-flock.responses.performers.label"),
        effects: { delay: 1, attendance: 0, clinic: 1, power: 3, dispute: 1 },
      },
      {
        id: "library-recall",
        label: catalogText("festivalIncidentPool.0.full-moon-book-flock.responses.library-recall.label"),
        effects: { delay: 7, attendance: -12, clinic: 0, power: 0, dispute: 1 },
      },
    ],
  },
  {
    id: "rain-border-pocket",
    glyph: "雨",
    title: catalogText("festivalIncidentPool.0.rain-border-pocket.title"),
    body: catalogText("festivalIncidentPool.0.rain-border-pocket.body"),
    responses: [
      {
        id: "move-boundary",
        label: catalogText("festivalIncidentPool.0.rain-border-pocket.responses.move-boundary.label"),
        effects: { delay: 4, attendance: 0, clinic: -1, power: 4, dispute: 2 },
      },
      {
        id: "paper-capes",
        label: catalogText("festivalIncidentPool.0.rain-border-pocket.responses.paper-capes.label"),
        effects: { delay: 6, attendance: -5, clinic: 0, power: 0, dispute: 1 },
      },
      {
        id: "pause-lanterns",
        label: catalogText("festivalIncidentPool.0.rain-border-pocket.responses.pause-lanterns.label"),
        effects: { delay: 14, attendance: -25, clinic: -2, power: -12, dispute: 0 },
      },
    ],
  },
  {
    id: "gate-claimants",
    glyph: "門",
    title: catalogText("festivalIncidentPool.0.gate-claimants.title"),
    body: catalogText("festivalIncidentPool.0.gate-claimants.body"),
    responses: [
      {
        id: "rotate-bell",
        label: catalogText("festivalIncidentPool.0.gate-claimants.responses.rotate-bell.label"),
        effects: { delay: 8, attendance: 0, clinic: 0, power: 0, dispute: 0 },
      },
      {
        id: "three-ribbons",
        label: catalogText("festivalIncidentPool.0.gate-claimants.responses.three-ribbons.label"),
        effects: { delay: 5, attendance: 20, clinic: 0, power: 2, dispute: 2 },
      },
      {
        id: "yukari-gate",
        label: catalogText("festivalIncidentPool.0.gate-claimants.responses.yukari-gate.label"),
        effects: { delay: 2, attendance: 35, clinic: 2, power: 3, dispute: 4, closeExtraEdge: "boundary--history" },
      },
    ],
  },
]);

export const festivalKind = (id) => festivalKinds.find((entry) => entry.id === id) || festivalKinds[0];
export const festivalRoute = (id) => festivalRoutes.find((entry) => entry.id === id) || festivalRoutes[0];
export const festivalStage = (id) => festivalStages.find((entry) => entry.id === id) || festivalStages[0];
export const festivalPower = (id) => festivalPowerPlans.find((entry) => entry.id === id) || festivalPowerPlans[0];
export const festivalFoodCourt = (id) => festivalFoodCourts.find((entry) => entry.id === id) || festivalFoodCourts[0];
export const festivalFairyZone = (id) => festivalFairyZones.find((entry) => entry.id === id) || festivalFairyZones[0];
export const festivalAidPlan = (id) => festivalAidPlans.find((entry) => entry.id === id) || festivalAidPlans[0];
export const festivalGatePlan = (id) => festivalGatePlans.find((entry) => entry.id === id) || festivalGatePlans[0];
export const festivalPressPlan = (id) => festivalPressPlans.find((entry) => entry.id === id) || festivalPressPlans[0];
export const festivalMusicPlan = (id) => festivalMusicPlans.find((entry) => entry.id === id) || festivalMusicPlans[0];
export const festivalIncident = (id) => festivalIncidentPool.find((entry) => entry.id === id) || null;

export function festivalLocalized(value, locale = "zh-Hant") {
  return value?.[locale] || value?.["zh-Hant"] || value || "";
}
