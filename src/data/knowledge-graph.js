import { text as catalogText } from "../generated/i18n/data/knowledge-graph.js";
import { academicAssignments } from "./academic-work.js";
import { appraisalObjects } from "./appraisal.js";
import { campusHistory } from "./campus-history.js";
import { newsItems, seededPosts } from "./community.js";
import { courseCatalogue } from "./courses.js";
import { facultyProfiles } from "./faculty.js";
import { governanceProposals } from "./governance.js";
import { residences } from "./housing.js";
import { incidentCases } from "./incidents.js";
import { libraryHoldings } from "./library.js";
import { researchFiles } from "./research.js";
import { spellPatterns } from "./spellcard-workshop.js";
import { ethicsCases } from "./ethics.js";
import {
  festivalGatePlans,
  festivalIncidentPool,
  festivalKinds,
  festivalPowerPlans,
  festivalReviewDesks,
  festivalRoutes,
} from "./festival.js";
import { fieldworkComplications, fieldworkStations } from "./fieldwork.js";
import { propertyItems } from "./property.js";
import { postSeedMessages } from "./post.js";
import { academicCalendarEvents } from "./academic-calendar.js";
import { alumniChapters, careerOpenings } from "./careers.js";
import { employmentJobs, employmentOutcomeKinds } from "./employment.js";
import {
  orientationFirstStops,
  orientationNoticePlans,
  orientationSeason,
  orientationStopSignals,
} from "./orientation.js";


const record = (id, kind, sourceType, sourceId, characters, annotation, extras = {}) => ({
  id,
  kind,
  source: { type: sourceType, id: sourceId, ...(extras.source || {}) },
  characters,
  annotation,
  ...Object.fromEntries(Object.entries(extras).filter(([key]) => key !== "source")),
});

export const knowledgeRecordKinds = Object.freeze({
  case: catalogText("knowledgeRecordKinds.0.case"),
  evidence: catalogText("knowledgeRecordKinds.0.evidence"),
  correction: catalogText("knowledgeRecordKinds.0.correction"),
  report: catalogText("knowledgeRecordKinds.0.report"),
  governance: catalogText("knowledgeRecordKinds.0.governance"),
  community: catalogText("knowledgeRecordKinds.0.community"),
  learning: catalogText("knowledgeRecordKinds.0.learning"),
  research: catalogText("knowledgeRecordKinds.0.research"),
  archive: catalogText("knowledgeRecordKinds.0.archive"),
  object: catalogText("knowledgeRecordKinds.0.object"),
  residence: catalogText("knowledgeRecordKinds.0.residence"),
  ethics: catalogText("knowledgeRecordKinds.0.ethics"),
});

export const knowledgeCharacters = Object.freeze([
  {
    id: "akyuu",
    glyph: "稗",
    name: catalogText("knowledgeCharacters.0.akyuu.name"),
    role: catalogText("knowledgeCharacters.0.akyuu.role"),
  },
  {
    id: "keine",
    glyph: "史",
    facultyId: "keine",
    name: facultyProfiles.keine.name,
    role: catalogText("knowledgeCharacters.0.keine.role"),
  },
  {
    id: "aya",
    glyph: "文",
    facultyId: "aya",
    name: facultyProfiles.aya.name,
    role: catalogText("knowledgeCharacters.0.aya.role"),
  },
  {
    id: "nitori",
    glyph: "河",
    facultyId: "nitori",
    name: facultyProfiles.nitori.name,
    role: catalogText("knowledgeCharacters.0.nitori.role"),
  },
  {
    id: "eirin",
    glyph: "月",
    facultyId: "eirin",
    name: facultyProfiles.eirin.name,
    role: catalogText("knowledgeCharacters.0.eirin.role"),
  },
  {
    id: "reisen",
    glyph: "鈴",
    name: catalogText("knowledgeCharacters.0.reisen.name"),
    role: catalogText("knowledgeCharacters.0.reisen.role"),
  },
  {
    id: "tewi",
    glyph: "兎",
    name: catalogText("knowledgeCharacters.0.tewi.name"),
    role: catalogText("knowledgeCharacters.0.tewi.role"),
  },
  {
    id: "koakuma",
    glyph: "書",
    name: catalogText("knowledgeCharacters.0.koakuma.name"),
    role: catalogText("knowledgeCharacters.0.koakuma.role"),
  },
  {
    id: "cirno",
    glyph: "冰",
    name: catalogText("knowledgeCharacters.0.cirno.name"),
    role: catalogText("knowledgeCharacters.0.cirno.role"),
  },
  {
    id: "patchouli",
    glyph: "七",
    facultyId: "patchouli",
    name: facultyProfiles.patchouli.name,
    role: catalogText("knowledgeCharacters.0.patchouli.role"),
  },
  {
    id: "reimu",
    glyph: "博",
    facultyId: "reimu",
    name: facultyProfiles.reimu.name,
    role: catalogText("knowledgeCharacters.0.reimu.role"),
  },
  {
    id: "marisa",
    glyph: "魔",
    facultyId: "marisa",
    name: facultyProfiles.marisa.name,
    role: catalogText("knowledgeCharacters.0.marisa.role"),
  },
  {
    id: "yukari",
    glyph: "境",
    facultyId: "yukari",
    name: facultyProfiles.yukari.name,
    role: catalogText("knowledgeCharacters.0.yukari.role"),
  },
  {
    id: "rinnosuke",
    glyph: "香",
    name: catalogText("knowledgeCharacters.0.rinnosuke.name"),
    role: catalogText("knowledgeCharacters.0.rinnosuke.role"),
  },
  {
    id: "kogasa",
    glyph: "傘",
    name: catalogText("knowledgeCharacters.0.kogasa.name"),
    role: catalogText("knowledgeCharacters.0.kogasa.role"),
  },
  {
    id: "satori",
    glyph: "心",
    name: catalogText("knowledgeCharacters.0.satori.name"),
    role: catalogText("knowledgeCharacters.0.satori.role"),
  },
  {
    id: "eiki",
    glyph: "裁",
    name: catalogText("knowledgeCharacters.0.eiki.name"),
    role: catalogText("knowledgeCharacters.0.eiki.role"),
  },
  {
    id: "sakuya",
    glyph: "時",
    name: catalogText("knowledgeCharacters.0.sakuya.name"),
    role: catalogText("knowledgeCharacters.0.sakuya.role"),
  },
  {
    id: "kanako",
    glyph: "注",
    name: catalogText("knowledgeCharacters.0.kanako.name"),
    role: catalogText("knowledgeCharacters.0.kanako.role"),
  },
  {
    id: "byakuren",
    glyph: "蓮",
    name: catalogText("knowledgeCharacters.0.byakuren.name"),
    role: catalogText("knowledgeCharacters.0.byakuren.role"),
  },
  {
    id: "miko",
    glyph: "聽",
    name: catalogText("knowledgeCharacters.0.miko.name"),
    role: catalogText("knowledgeCharacters.0.miko.role"),
  },
  {
    id: "youmu",
    glyph: "半",
    name: catalogText("knowledgeCharacters.0.youmu.name"),
    role: catalogText("knowledgeCharacters.0.youmu.role"),
  },
  {
    id: "yuyuko",
    glyph: "幽",
    name: catalogText("knowledgeCharacters.0.yuyuko.name"),
    role: catalogText("knowledgeCharacters.0.yuyuko.role"),
  },
]);

export const knowledgeDossiers = Object.freeze([
  {
    id: "late-bell-seven",
    glyph: "鐘",
    code: "HIEDA / 01",
    title: catalogText("knowledgeDossiers.0.late-bell-seven.title"),
    lead: catalogText("knowledgeDossiers.0.late-bell-seven.lead"),
    tension: catalogText("knowledgeDossiers.0.late-bell-seven.tension"),
    characters: ["akyuu", "keine", "aya", "nitori", "reimu"],
    versions: ["five-cases-three-headlines", "three-hour-bell-and-public-defence", "translation-keys-tie-the-red-ledger-thread", "five-records-share-one-red-thread"],
    eventQueries: [
      { types: ["incident.experiment.completed", "incident.resolved"], refs: ["incident-case:late-bell-seven"] },
      { types: ["governance.vote.cast"], refs: ["governance-proposal:airspace-practicals"] },
      { types: ["course.enrolled", "course.waitlisted", "course.dropped"], refs: ["course:2026-autumn:BIS-132"] },
    ],
    records: [
      record("official-case", "case", "incident", "late-bell-seven", ["reimu", "akyuu"], catalogText("knowledgeDossiers.0.late-bell-seven.records.0.official-case.5")),
      record("tower-log", "evidence", "incident-evidence", "tower-log", ["nitori"], catalogText("knowledgeDossiers.0.late-bell-seven.records.1.tower-log.5"), { source: { caseId: "late-bell-seven" } }),
      record("roll-page", "correction", "incident-evidence", "roll-page", ["keine"], catalogText("knowledgeDossiers.0.late-bell-seven.records.2.roll-page.5"), { source: { caseId: "late-bell-seven" } }),
      record("extra-edition", "report", "incident-evidence", "extra-edition", ["aya"], catalogText("knowledgeDossiers.0.late-bell-seven.records.3.extra-edition.5"), { source: { caseId: "late-bell-seven" } }),
      record("airspace-rule", "governance", "governance", "airspace-practicals", ["aya", "reimu"], catalogText("knowledgeDossiers.0.late-bell-seven.records.4.airspace-rule.5")),
      record("airspace-bbs", "community", "bbs-seed", "9", ["aya"], catalogText("knowledgeDossiers.0.late-bell-seven.records.5.airspace-bbs.5")),
      record("three-reports", "research", "research", "reports", ["aya", "keine"], catalogText("knowledgeDossiers.0.late-bell-seven.records.6.three-reports.5")),
    ],
  },
  {
    id: "flying-book-window",
    glyph: "書",
    code: "HIEDA / 02",
    title: catalogText("knowledgeDossiers.0.flying-book-window.title"),
    lead: catalogText("knowledgeDossiers.0.flying-book-window.lead"),
    tension: catalogText("knowledgeDossiers.0.flying-book-window.tension"),
    characters: ["akyuu", "koakuma", "cirno", "patchouli", "marisa"],
    versions: ["seven-doors-and-misty-desk", "five-cases-three-headlines", "translation-keys-tie-the-red-ledger-thread", "five-records-share-one-red-thread"],
    eventQueries: [
      { types: ["incident.experiment.completed", "incident.resolved"], refs: ["incident-case:flying-book-window"] },
      { types: ["book.borrowed", "book.renewed", "book.returned", "book.held", "book.hold.cancelled"], refs: ["library-holding:flying-index", "library-holding:shelf-negotiation-minutes"] },
      { types: ["governance.vote.cast"], refs: ["governance-proposal:fullmoon-library"] },
    ],
    records: [
      record("official-case", "case", "incident", "flying-book-window", ["koakuma", "cirno"], catalogText("knowledgeDossiers.0.flying-book-window.records.0.official-case.5")),
      record("margin-petition", "evidence", "incident-evidence", "margin-petition", ["koakuma"], catalogText("knowledgeDossiers.0.flying-book-window.records.1.margin-petition.5"), { source: { caseId: "flying-book-window" } }),
      record("flying-index", "object", "library", "flying-index", ["patchouli", "koakuma"], catalogText("knowledgeDossiers.0.flying-book-window.records.2.flying-index.5")),
      record("library-rule", "governance", "governance", "fullmoon-library", ["patchouli"], catalogText("knowledgeDossiers.0.flying-book-window.records.3.library-rule.5")),
      record("window-bbs", "community", "bbs-seed", "5", ["koakuma"], catalogText("knowledgeDossiers.0.flying-book-window.records.4.window-bbs.5")),
      record("grimoire-course", "learning", "course", "MTP-143", ["patchouli"], catalogText("knowledgeDossiers.0.flying-book-window.records.5.grimoire-course.5")),
      record("shelf-minutes", "correction", "library", "shelf-negotiation-minutes", ["akyuu", "koakuma"], catalogText("knowledgeDossiers.0.flying-book-window.records.6.shelf-minutes.5")),
    ],
  },
  {
    id: "headline-yesterday",
    glyph: "昨",
    code: "HIEDA / 03",
    title: catalogText("knowledgeDossiers.0.headline-yesterday.title"),
    lead: catalogText("knowledgeDossiers.0.headline-yesterday.lead"),
    tension: catalogText("knowledgeDossiers.0.headline-yesterday.tension"),
    characters: ["akyuu", "aya", "keine", "nitori", "yukari"],
    versions: ["living-version-chronicle", "five-cases-three-headlines", "red-thread-preservation-desk", "translation-keys-tie-the-red-ledger-thread", "five-records-share-one-red-thread"],
    eventQueries: [
      { types: ["incident.experiment.completed", "incident.resolved"], refs: ["incident-case:headline-yesterday"] },
      { types: ["academic.assignment.graded"], refs: ["assignment:his-yesterday-editions"] },
      { types: ["governance.vote.cast"], refs: ["governance-proposal:red-thread-appeal"] },
      { types: ["book.borrowed", "book.renewed", "book.returned", "book.held"], refs: ["library-holding:corrections-headlines", "library-holding:three-yesterdays"] },
    ],
    records: [
      record("official-case", "case", "incident", "headline-yesterday", ["aya", "akyuu", "nitori"], catalogText("knowledgeDossiers.0.headline-yesterday.records.0.official-case.5")),
      record("layout-cache", "report", "incident-evidence", "layout-cache", ["aya"], catalogText("knowledgeDossiers.0.headline-yesterday.records.1.layout-cache.5"), { source: { caseId: "headline-yesterday" } }),
      record("chronicle-index", "correction", "incident-evidence", "chronicle-index", ["akyuu", "keine"], catalogText("knowledgeDossiers.0.headline-yesterday.records.2.chronicle-index.5"), { source: { caseId: "headline-yesterday" } }),
      record("reports-research", "research", "research", "reports", ["aya", "keine"], catalogText("knowledgeDossiers.0.headline-yesterday.records.3.reports-research.5")),
      record("yesterday-assignment", "learning", "assignment", "his-yesterday-editions", ["keine", "akyuu"], catalogText("knowledgeDossiers.0.headline-yesterday.records.4.yesterday-assignment.5")),
      record("red-thread-rule", "governance", "governance", "red-thread-appeal", ["aya", "akyuu"], catalogText("knowledgeDossiers.0.headline-yesterday.records.5.red-thread-rule.5")),
      record("headline-holding", "object", "library", "corrections-headlines", ["aya", "akyuu"], catalogText("knowledgeDossiers.0.headline-yesterday.records.6.headline-holding.5")),
    ],
  },
  {
    id: "fourth-lantern-loop",
    glyph: "燈",
    code: "HIEDA / 04",
    title: catalogText("knowledgeDossiers.0.fourth-lantern-loop.title"),
    lead: catalogText("knowledgeDossiers.0.fourth-lantern-loop.lead"),
    tension: catalogText("knowledgeDossiers.0.fourth-lantern-loop.tension"),
    characters: ["akyuu", "eirin", "reisen", "tewi", "nitori"],
    versions: ["five-cases-three-headlines", "two-clinics-and-one-missing-token", "three-hour-bell-and-public-defence", "five-records-share-one-red-thread"],
    eventQueries: [
      { types: ["incident.experiment.completed", "incident.resolved"], refs: ["incident-case:fourth-lantern-loop"] },
      { types: ["book.borrowed", "book.renewed", "book.returned", "book.held"], refs: ["library-holding:fourth-lantern-manual"] },
    ],
    records: [
      record("official-case", "case", "incident", "fourth-lantern-loop", ["eirin", "tewi"], catalogText("knowledgeDossiers.0.fourth-lantern-loop.records.0.official-case.5")),
      record("firmware-stubs", "evidence", "incident-evidence", "firmware-stubs", ["nitori", "tewi"], catalogText("knowledgeDossiers.0.fourth-lantern-loop.records.1.firmware-stubs.5"), { source: { caseId: "fourth-lantern-loop" } }),
      record("moon-log", "correction", "incident-evidence", "moon-log", ["eirin", "reisen"], catalogText("knowledgeDossiers.0.fourth-lantern-loop.records.2.moon-log.5"), { source: { caseId: "fourth-lantern-loop" } }),
      record("lantern-manual", "object", "library", "fourth-lantern-manual", ["nitori"], catalogText("knowledgeDossiers.0.fourth-lantern-loop.records.3.lantern-manual.5")),
      record("bamboo-bbs", "community", "bbs-seed", "2", ["tewi", "reisen"], catalogText("knowledgeDossiers.0.fourth-lantern-loop.records.4.bamboo-bbs.5")),
      record("clinic-route-course", "learning", "course", "LML-351", ["eirin", "reisen"], catalogText("knowledgeDossiers.0.fourth-lantern-loop.records.5.clinic-route-course.5")),
      record("clinic-route-news", "report", "news", "clinic-route", ["eirin", "reisen"], catalogText("knowledgeDossiers.0.fourth-lantern-loop.records.6.clinic-route-news.5")),
    ],
  },
  {
    id: "dorm-window-chair",
    glyph: "椅",
    code: "HIEDA / 05",
    title: catalogText("knowledgeDossiers.0.dorm-window-chair.title"),
    lead: catalogText("knowledgeDossiers.0.dorm-window-chair.lead"),
    tension: catalogText("knowledgeDossiers.0.dorm-window-chair.tension"),
    characters: ["akyuu", "yukari", "reimu", "kogasa", "aya"],
    versions: ["five-halls-and-one-chair", "five-cases-three-headlines", "red-thread-preservation-desk", "five-records-share-one-red-thread"],
    eventQueries: [
      { types: ["incident.experiment.completed", "incident.resolved"], refs: ["incident-case:dorm-window-chair"] },
      { types: ["housing.application.submitted", "housing.assignment.accepted"], refs: ["residence:hakurei-east"] },
      { types: ["governance.vote.cast"], refs: ["governance-proposal:red-thread-appeal"] },
    ],
    records: [
      record("official-case", "case", "incident", "dorm-window-chair", ["yukari", "kogasa"], catalogText("knowledgeDossiers.0.dorm-window-chair.records.0.official-case.5")),
      record("scratch-text", "evidence", "incident-evidence", "scratch-text", ["kogasa"], catalogText("knowledgeDossiers.0.dorm-window-chair.records.1.scratch-text.5"), { source: { caseId: "dorm-window-chair" } }),
      record("old-receipt", "correction", "incident-evidence", "old-receipt", ["akyuu"], catalogText("knowledgeDossiers.0.dorm-window-chair.records.2.old-receipt.5"), { source: { caseId: "dorm-window-chair" } }),
      record("hakurei-east", "residence", "residence", "hakurei-east", ["reimu"], catalogText("knowledgeDossiers.0.dorm-window-chair.records.3.hakurei-east.5")),
      record("boundary-course", "learning", "course", "BIS-271", ["yukari"], catalogText("knowledgeDossiers.0.dorm-window-chair.records.4.boundary-course.5")),
      record("red-thread-rule", "governance", "governance", "red-thread-appeal", ["akyuu", "aya"], catalogText("knowledgeDossiers.0.dorm-window-chair.records.5.red-thread-rule.5")),
      record("shelf-negotiation", "object", "library", "shelf-negotiation-minutes", ["kogasa", "akyuu"], catalogText("knowledgeDossiers.0.dorm-window-chair.records.6.shelf-negotiation.5")),
    ],
  },
  {
    id: "drift-reader-77",
    glyph: "漂",
    code: "HIEDA / 06",
    title: catalogText("knowledgeDossiers.0.drift-reader-77.title"),
    lead: catalogText("knowledgeDossiers.0.drift-reader-77.lead"),
    tension: catalogText("knowledgeDossiers.0.drift-reader-77.tension"),
    characters: ["akyuu", "rinnosuke", "nitori", "kogasa", "yukari", "reimu"],
    versions: ["eight-objects-on-a-seven-object-shelf", "kappa-cabinets-reveal-their-drawers", "translation-keys-tie-the-red-ledger-thread", "five-records-share-one-red-thread"],
    eventQueries: [
      { types: ["appraisal.completed", "appraisal.catalogued"], refs: ["appraisal-object:frozen-reader"] },
      { types: ["book.borrowed", "book.renewed", "book.returned", "book.held"], refs: ["library-holding:outside-drift-catalogue"] },
      { types: ["course.enrolled", "course.waitlisted", "course.dropped"], refs: ["course:2026-autumn:BIS-271"] },
    ],
    records: [
      record("object-file", "object", "appraisal", "frozen-reader", ["rinnosuke", "nitori", "kogasa"], catalogText("knowledgeDossiers.0.drift-reader-77.records.0.object-file.5")),
      record("drift-research", "research", "research", "boundary", ["yukari", "akyuu"], catalogText("knowledgeDossiers.0.drift-reader-77.records.1.drift-research.5")),
      record("drift-catalogue", "object", "library", "outside-drift-catalogue", ["akyuu", "rinnosuke"], catalogText("knowledgeDossiers.0.drift-reader-77.records.2.drift-catalogue.5")),
      record("boundary-course", "learning", "course", "BIS-271", ["yukari"], catalogText("knowledgeDossiers.0.drift-reader-77.records.3.boundary-course.5")),
      record("wire-bbs", "community", "bbs-seed", "11", ["nitori", "rinnosuke"], catalogText("knowledgeDossiers.0.drift-reader-77.records.4.wire-bbs.5")),
      record("lost-umbrella-news", "report", "news", "unknown-umbrella", ["kogasa", "reimu"], catalogText("knowledgeDossiers.0.drift-reader-77.records.5.lost-umbrella-news.5")),
      record("appraisal-history", "archive", "history", "eight-objects-on-a-seven-object-shelf", ["akyuu", "rinnosuke", "nitori", "kogasa"], catalogText("knowledgeDossiers.0.drift-reader-77.records.6.appraisal-history.5")),
    ],
  },
  {
    id: "spellcard-six-seals",
    glyph: "符",
    code: "HIEDA / 07",
    title: catalogText("knowledgeDossiers.0.spellcard-six-seals.title"),
    lead: catalogText("knowledgeDossiers.0.spellcard-six-seals.lead"),
    tension: catalogText("knowledgeDossiers.0.spellcard-six-seals.tension"),
    characters: ["akyuu", "reimu", "marisa", "aya", "nitori"],
    versions: ["six-seals-refuse-one-average", "three-hour-bell-and-public-defence", "translation-keys-tie-the-red-ledger-thread", "five-records-share-one-red-thread"],
    eventQueries: [
      { types: ["spellcard.design.saved", "spellcard.defence.completed"], refs: [] },
      { types: ["course.enrolled", "course.waitlisted", "course.dropped"], refs: ["course:2026-autumn:BIS-204"] },
    ],
    records: [
      record("pattern", "case", "spell-pattern", "amulet-fan", ["reimu", "marisa"], catalogText("knowledgeDossiers.0.spellcard-six-seals.records.0.pattern.5")),
      record("spellcard-research", "research", "research", "spellcard", ["reimu", "marisa", "nitori"], catalogText("knowledgeDossiers.0.spellcard-six-seals.records.1.spellcard-research.5")),
      record("spellcard-course", "learning", "course", "BIS-204", ["reimu"], catalogText("knowledgeDossiers.0.spellcard-six-seals.records.2.spellcard-course.5")),
      record("telegraph-holding", "object", "library", "spellcard-telegraph", ["reimu", "nitori"], catalogText("knowledgeDossiers.0.spellcard-six-seals.records.3.telegraph-holding.5")),
      record("red-thread-rule", "governance", "governance", "red-thread-appeal", ["aya", "akyuu"], catalogText("knowledgeDossiers.0.spellcard-six-seals.records.4.red-thread-rule.5")),
      record("lantern-call", "report", "news", "spell-lantern", ["aya", "reimu"], catalogText("knowledgeDossiers.0.spellcard-six-seals.records.5.lantern-call.5")),
      record("workshop-history", "archive", "history", "six-seals-refuse-one-average", ["akyuu", "reimu", "marisa", "aya", "nitori"], catalogText("knowledgeDossiers.0.spellcard-six-seals.records.6.workshop-history.5")),
    ],
  },
  {
    id: "consent-five-seats",
    glyph: "諾",
    code: "HIEDA / 08",
    title: catalogText("knowledgeDossiers.0.consent-five-seats.title"),
    lead: catalogText("knowledgeDossiers.0.consent-five-seats.lead"),
    tension: catalogText("knowledgeDossiers.0.consent-five-seats.tension"),
    characters: ["akyuu", "eirin", "satori", "keine", "eiki", "reimu", "sakuya", "reisen", "rinnosuke", "kogasa"],
    versions: ["six-seals-refuse-one-average", "five-records-share-one-red-thread", "five-seats-refuse-one-average"],
    eventQueries: [
      {
        types: ["ethics.protocol.submitted", "ethics.review.completed", "ethics.protocol.amended", "ethics.protocol.withdrawn"],
        refs: [
          "ethics-case:reisen-undisclosed-wave",
          "ethics-case:satori-no-notes",
          "ethics-case:sakuya-frozen-control",
          "ethics-case:keine-history-deletion",
          "ethics-case:drift-object-refusal",
        ],
      },
    ],
    records: [
      record("reisen-consent", "case", "ethics-case", "reisen-undisclosed-wave", ["eirin", "reisen", "reimu"], catalogText("knowledgeDossiers.0.consent-five-seats.records.0.reisen-consent.5")),
      record("satori-processing", "evidence", "ethics-case", "satori-no-notes", ["satori", "eiki", "akyuu"], catalogText("knowledgeDossiers.0.consent-five-seats.records.1.satori-processing.5")),
      record("sakuya-control", "research", "ethics-case", "sakuya-frozen-control", ["sakuya", "eirin", "reimu"], catalogText("knowledgeDossiers.0.consent-five-seats.records.2.sakuya-control.5")),
      record("keine-receipt", "correction", "ethics-case", "keine-history-deletion", ["keine", "eiki", "akyuu"], catalogText("knowledgeDossiers.0.consent-five-seats.records.3.keine-receipt.5")),
      record("object-assent", "object", "ethics-case", "drift-object-refusal", ["rinnosuke", "kogasa", "eiki"], catalogText("knowledgeDossiers.0.consent-five-seats.records.4.object-assent.5")),
      record("ethics-history", "archive", "history", "five-seats-refuse-one-average", ["akyuu", "eirin", "satori", "keine", "eiki", "reimu"], catalogText("knowledgeDossiers.0.consent-five-seats.records.5.ethics-history.5")),
    ],
  },
  {
    id: "festival-six-desks",
    glyph: "祭",
    code: "HIEDA / 09",
    title: catalogText("knowledgeDossiers.0.festival-six-desks.title"),
    lead: catalogText("knowledgeDossiers.0.festival-six-desks.lead"),
    tension: catalogText("knowledgeDossiers.0.festival-six-desks.tension"),
    characters: ["akyuu", "reimu", "nitori", "eirin", "aya", "yukari", "kanako", "byakuren", "miko"],
    versions: ["six-desks-open-one-contested-gate", "translation-keys-tie-the-red-ledger-thread", "five-records-share-one-red-thread"],
    eventQueries: [
      {
        types: [
          "festival.plan.submitted",
          "festival.permit.issued",
          "festival.shift.started",
          "festival.incident.resolved",
          "festival.report.closed",
        ],
        refs: [],
      },
    ],
    records: [
      record("festival-brief", "case", "festival-kind", "spring-lantern", ["reimu", "aya", "akyuu"], catalogText("knowledgeDossiers.0.festival-six-desks.records.0.festival-brief.5")),
      record("six-desk-sheet", "governance", "festival-desk", "faith", ["kanako", "byakuren", "miko", "reimu"], catalogText("knowledgeDossiers.0.festival-six-desks.records.1.six-desk-sheet.5")),
      record("procession-line", "evidence", "festival-route", "three-faith-loop", ["yukari", "reimu", "byakuren"], catalogText("knowledgeDossiers.0.festival-six-desks.records.2.procession-line.5")),
      record("mixed-power", "evidence", "festival-power", "mixed-grid", ["nitori", "kanako"], catalogText("knowledgeDossiers.0.festival-six-desks.records.3.mixed-power.5")),
      record("aya-opening", "report", "festival-incident", "aya-early-opening", ["aya", "akyuu", "reimu"], catalogText("knowledgeDossiers.0.festival-six-desks.records.4.aya-opening.5")),
      record("gate-claim", "correction", "festival-gate", "rotating", ["kanako", "byakuren", "miko", "yukari"], catalogText("knowledgeDossiers.0.festival-six-desks.records.5.gate-claim.5")),
      record("festival-history", "archive", "history", "six-desks-open-one-contested-gate", ["akyuu", "reimu", "nitori", "eirin", "aya", "kanako", "byakuren", "miko"], catalogText("knowledgeDossiers.0.festival-six-desks.records.6.festival-history.5")),
    ],
  },
  {
    id: "fieldwork-twenty-four-seals",
    glyph: "旅",
    code: "HIEDA / 10",
    title: catalogText("knowledgeDossiers.0.fieldwork-twenty-four-seals.title"),
    lead: catalogText("knowledgeDossiers.0.fieldwork-twenty-four-seals.lead"),
    tension: catalogText("knowledgeDossiers.0.fieldwork-twenty-four-seals.tension"),
    characters: ["akyuu", "keine", "sakuya", "patchouli", "rinnosuke", "satori", "youmu", "yuyuko"],
    versions: ["twenty-four-seals-return-with-red-thread", "translation-keys-tie-the-red-ledger-thread", "five-records-share-one-red-thread"],
    eventQueries: [{
      types: [
        "fieldwork.application.submitted",
        "fieldwork.departure.checked",
        "fieldwork.complication.handled",
        "fieldwork.observation.logged",
        "fieldwork.return.certified",
      ],
      refs: [],
    }],
    records: [
      record("scarlet-duty", "evidence", "fieldwork-station", "scarlet-devil-mansion", ["sakuya", "patchouli"], catalogText("knowledgeDossiers.0.fieldwork-twenty-four-seals.records.0.scarlet-duty.5")),
      record("phantom-roll", "evidence", "fieldwork-station", "hakugyokurou", ["youmu", "yuyuko"], catalogText("knowledgeDossiers.0.fieldwork-twenty-four-seals.records.1.phantom-roll.5")),
      record("object-statement", "object", "fieldwork-station", "kourindou", ["rinnosuke"], catalogText("knowledgeDossiers.0.fieldwork-twenty-four-seals.records.2.object-statement.5")),
      record("unsubmitted-thought", "ethics", "fieldwork-station", "chireiden", ["satori"], catalogText("knowledgeDossiers.0.fieldwork-twenty-four-seals.records.3.unsubmitted-thought.5")),
      record("ghost-headcount", "correction", "fieldwork-complication", "ghost-headcount", ["youmu", "yuyuko", "akyuu"], catalogText("knowledgeDossiers.0.fieldwork-twenty-four-seals.records.4.ghost-headcount.5")),
      record("fieldwork-history", "archive", "history", "twenty-four-seals-return-with-red-thread", ["akyuu", "keine", "sakuya", "youmu"], catalogText("knowledgeDossiers.0.fieldwork-twenty-four-seals.records.5.fieldwork-history.5")),
    ],
  },
  {
    id: "commons-early-letter",
    glyph: "便",
    code: "HIEDA / 11",
    title: catalogText("knowledgeDossiers.0.commons-early-letter.title"),
    lead: catalogText("knowledgeDossiers.0.commons-early-letter.lead"),
    tension: catalogText("knowledgeDossiers.0.commons-early-letter.tension"),
    characters: ["kogasa", "rinnosuke", "akyuu", "eiki", "aya", "keine", "yukari"],
    versions: ["lost-things-appeal-mail-arrives-before-spring", "twenty-four-seals-return-with-red-thread", "five-records-share-one-red-thread"],
    eventQueries: [{
      types: [
        "property.claim.submitted",
        "property.ruling.issued",
        "post.message.acknowledged",
        "post.correction.requested",
        "post.notice.dispatched",
        "calendar.event.saved",
        "calendar.event.removed",
      ],
      refs: [],
    }],
    records: [
      record("sunny-umbrella", "object", "property-item", "umbrella-rain-claim", ["kogasa", "rinnosuke", "akyuu", "eiki"], catalogText("knowledgeDossiers.0.commons-early-letter.records.0.sunny-umbrella.5")),
      record("early-admission", "report", "post-message", "admission-before-application", ["aya", "akyuu"], catalogText("knowledgeDossiers.0.commons-early-letter.records.1.early-admission.5")),
      record("spring-not-received", "correction", "calendar-event", "spring-snow-dispute", ["keine", "yukari"], catalogText("knowledgeDossiers.0.commons-early-letter.records.2.spring-not-received.5")),
      record("full-moon-mail", "evidence", "calendar-event", "full-moon-special", ["keine", "aya"], catalogText("knowledgeDossiers.0.commons-early-letter.records.3.full-moon-mail.5")),
      record("same-serial-ear", "object", "property-item", "outside-earbud", ["rinnosuke", "akyuu", "aya"], catalogText("knowledgeDossiers.0.commons-early-letter.records.4.same-serial-ear.5")),
      record("commons-history", "archive", "history", "lost-things-appeal-mail-arrives-before-spring", ["akyuu", "kogasa", "aya", "keine"], catalogText("knowledgeDossiers.0.commons-early-letter.records.5.commons-history.5")),
    ],
  },
  {
    id: "graduation-before-enrolment",
    glyph: "卒",
    code: "HIEDA / 12",
    title: catalogText("knowledgeDossiers.0.graduation-before-enrolment.title"),
    lead: catalogText("knowledgeDossiers.0.graduation-before-enrolment.lead"),
    tension: catalogText("knowledgeDossiers.0.graduation-before-enrolment.tension"),
    characters: ["akyuu", "keine", "aya", "yukari", "eiki", "reimu", "sakuya", "youmu", "yuyuko"],
    versions: ["employment-denominator-refuses-one-rate", "degree-arrives-nine-minutes-after-alumni-invitation", "lost-things-appeal-mail-arrives-before-spring", "five-records-share-one-red-thread"],
    eventQueries: [{
      types: [
        "graduation.audit.requested",
        "graduation.degree.issued",
        "career.plan.submitted",
        "career.referral.sent",
        "employment.application.submitted",
        "employment.application.responded",
        "employment.outcome.attested",
        "alumni.profile.activated",
        "alumni.reunion.rsvp",
        "alumni.mentorship.offered",
      ],
      refs: [],
    }],
    records: [
      record("graduation-capstone", "learning", "course", "HRS-410", ["akyuu", "keine"], catalogText("knowledgeDossiers.0.graduation-before-enrolment.records.0.graduation-capstone.5")),
      record("missing-year-job", "case", "career-opening", "terakoya-missing-year", ["keine", "akyuu"], catalogText("knowledgeDossiers.0.graduation-before-enrolment.records.1.missing-year-job.5")),
      record("zero-minute-recruitment", "report", "employment-job", "scarlet-zero-minute-maid", ["sakuya", "akyuu", "eiki"], catalogText("knowledgeDossiers.0.graduation-before-enrolment.records.2.zero-minute-recruitment.5")),
      record("denominator-hearing", "correction", "employment-outcome", "multiple", ["akyuu", "keine", "aya", "yukari", "youmu", "yuyuko"], catalogText("knowledgeDossiers.0.graduation-before-enrolment.records.3.denominator-hearing.5")),
      record("late-arrival-alumni", "community", "alumni-chapter", "higan-late-arrivals", ["eiki", "akyuu"], catalogText("knowledgeDossiers.0.graduation-before-enrolment.records.4.late-arrival-alumni.5")),
      record("early-invitation", "report", "post-message", "admission-before-application", ["aya", "akyuu"], catalogText("knowledgeDossiers.0.graduation-before-enrolment.records.5.early-invitation.5")),
      record("phantom-count", "evidence", "fieldwork-station", "hakugyokurou", ["youmu", "yuyuko"], catalogText("knowledgeDossiers.0.graduation-before-enrolment.records.6.phantom-count.5")),
      record("graduation-history", "archive", "history", "degree-arrives-nine-minutes-after-alumni-invitation", ["akyuu", "keine", "aya", "yukari"], catalogText("knowledgeDossiers.0.graduation-before-enrolment.records.7.graduation-history.5")),
    ],
  },
  {
    id: "first-bell-three-gates",
    glyph: "到",
    code: "HIEDA / 13",
    title: catalogText("knowledgeDossiers.0.first-bell-three-gates.title"),
    lead: catalogText("knowledgeDossiers.0.first-bell-three-gates.lead"),
    tension: catalogText("knowledgeDossiers.0.first-bell-three-gates.tension"),
    characters: ["akyuu", "reimu", "aya", "yukari", "marisa"],
    versions: ["first-bell-keeps-three-fields", "lost-things-appeal-mail-arrives-before-spring", "five-records-share-one-red-thread"],
    eventQueries: [{
      types: [
        "orientation.dossier.opened",
        "orientation.arrival.confirmed",
        "orientation.boundary.confirmed",
        "orientation.matriculated",
      ],
      refs: [],
    }],
    records: [
      record("arrival-season", "case", "orientation-season", "first-bell-2026", ["akyuu", "reimu", "yukari"], catalogText("knowledgeDossiers.0.first-bell-three-gates.records.0.arrival-season.5")),
      record("wood-bell-stop", "governance", "orientation-signal", "wood-bell", ["reimu", "yukari"], catalogText("knowledgeDossiers.0.first-bell-three-gates.records.1.wood-bell-stop.5")),
      record("tengu-correction", "correction", "orientation-notice", "tengu-correction", ["aya", "akyuu"], catalogText("knowledgeDossiers.0.first-bell-three-gates.records.2.tengu-correction.5")),
      record("first-course", "learning", "orientation-first-stop", "first-course", ["marisa", "akyuu"], catalogText("knowledgeDossiers.0.first-bell-three-gates.records.3.first-course.5")),
      record("arrival-notice", "report", "news", "first-bell-arrival", ["aya", "akyuu"], catalogText("knowledgeDossiers.0.first-bell-three-gates.records.4.arrival-notice.5")),
      record("first-bell-history", "archive", "history", "first-bell-keeps-three-fields", ["akyuu", "reimu", "aya", "yukari", "marisa"], catalogText("knowledgeDossiers.0.first-bell-three-gates.records.5.first-bell-history.5")),
    ],
  },
]);

const sourceCollections = {
  incident: incidentCases,
  governance: governanceProposals,
  news: newsItems,
  course: courseCatalogue,
  assignment: academicAssignments,
  library: libraryHoldings,
  appraisal: appraisalObjects,
  residence: residences,
  history: campusHistory,
  "spell-pattern": spellPatterns,
  "ethics-case": ethicsCases,
  "festival-kind": festivalKinds,
  "festival-route": festivalRoutes,
  "festival-power": festivalPowerPlans,
  "festival-gate": festivalGatePlans,
  "festival-desk": festivalReviewDesks,
  "festival-incident": festivalIncidentPool,
  "fieldwork-station": fieldworkStations,
  "fieldwork-complication": fieldworkComplications,
  "property-item": propertyItems,
  "post-message": postSeedMessages,
  "calendar-event": academicCalendarEvents,
  "career-opening": careerOpenings,
  "employment-job": employmentJobs,
  "employment-outcome": employmentOutcomeKinds,
  "alumni-chapter": alumniChapters,
  "orientation-season": [orientationSeason],
  "orientation-signal": orientationStopSignals,
  "orientation-notice": orientationNoticePlans,
  "orientation-first-stop": orientationFirstStops,
};

const localized = (value, locale) => value?.[locale] || value?.["zh-Hant"] || value || "";

function routeForSource(source) {
  const routes = {
    incident: `incident-case-${source.id}`,
    "incident-evidence": `incident-case-${source.caseId}`,
    governance: `governance-${source.id}`,
    "bbs-seed": `bbs-seed-${source.id}`,
    news: `news-${source.id}`,
    course: `course-${source.id}`,
    assignment: "academic-work",
    research: `research-${source.id}`,
    library: `library-${source.id}`,
    appraisal: `appraisal-object-${source.id}`,
    residence: `housing-residence-${source.id}`,
    history: `chronicle-${source.id}`,
    "spell-pattern": `spellcard-pattern-${source.id}`,
    "ethics-case": `ethics-case-${source.id}`,
    "festival-kind": "festival-operations",
    "festival-route": "festival-operations",
    "festival-power": "festival-operations",
    "festival-gate": "festival-operations",
    "festival-desk": "festival-operations",
    "festival-incident": "festival-operations",
    "fieldwork-station": `fieldwork-station-${source.id}`,
    "fieldwork-complication": "fieldwork-stations",
    "property-item": `property-item-${source.id}`,
    "post-message": `post-message-${source.id}`,
    "calendar-event": `calendar-event-${source.id}`,
    "career-opening": `career-opening-${source.id}`,
    "employment-job": `employment-job-${source.id}`,
    "employment-outcome": "employment-outcomes",
    "alumni-chapter": `alumni-chapter-${source.id}`,
    "orientation-season": "welcome",
    "orientation-signal": "orientation-boundary",
    "orientation-notice": "orientation-boundary",
    "orientation-first-stop": "orientation-first-bell",
  };
  return routes[source.type] || "top";
}

function findSource(source) {
  if (source.type === "incident-evidence") {
    return incidentCases
      .find((incident) => incident.id === source.caseId)
      ?.evidence.find((item) => item.id === source.id);
  }
  if (source.type === "bbs-seed") return seededPosts[Number(source.id)] || null;
  if (source.type === "research") return researchFiles[source.id] || null;
  return sourceCollections[source.type]?.find((item) => item.id === source.id || item.code === source.id) || null;
}

export function resolveKnowledgeRecord(recordEntry, locale = "zh-Hant") {
  const source = findSource(recordEntry.source);
  if (!source) return null;
  let title = "";
  let detail = "";

  switch (recordEntry.source.type) {
    case "incident":
      title = localized(source.title, locale);
      detail = `${source.code} · ${localized(source.location, locale)}`;
      break;
    case "incident-evidence":
      title = localized(source.title, locale);
      detail = `${localized(source.source, locale)} · ${localized(source.reliability, locale)}`;
      break;
    case "governance":
      title = localized(source.title, locale);
      detail = `${source.code} · ${localized(source.sponsor, locale)}`;
      break;
    case "bbs-seed":
      title = localized(source[2], locale);
      detail = `${localized(source[1], locale)} · BBS`;
      break;
    case "news":
      title = localized(source.title, locale);
      detail = `${source.date} · ${localized(source.category, locale)}`;
      break;
    case "course":
      title = `${source.code} · ${localized(source.title, locale)}`;
      detail = localized(source.instructor, locale);
      break;
    case "assignment":
      title = localized(source.title, locale);
      detail = `${source.courseCode} · ${localized(source.teacher, locale)}`;
      break;
    case "research":
      title = localized(source.title, locale);
      detail = source.kicker;
      break;
    case "library":
      title = localized(source.title, locale);
      detail = `${source.callNumber} · ${localized(source.author, locale)}`;
      break;
    case "appraisal":
      title = localized(source.name, locale);
      detail = `${source.code} · ${localized(source.workingTitle, locale)}`;
      break;
    case "residence":
      title = localized(source.name, locale);
      detail = localized(source.area, locale);
      break;
    case "history":
      title = localized(source.title, locale);
      detail = `${source.archiveId} · ${localized(source.era, locale)}`;
      break;
    case "spell-pattern":
      title = localized(source.name, locale);
      detail = localized(source.premise, locale);
      break;
    case "ethics-case":
      title = localized(source.title, locale);
      detail = `${source.code} · ${localized(source.conflict, locale)}`;
      break;
    case "festival-kind":
      title = localized(source.name, locale);
      detail = `${source.code} · ${localized(source.short, locale)}`;
      break;
    case "festival-route":
      title = localized(source.name, locale);
      detail = localized(source.detail, locale);
      break;
    case "festival-power":
      title = localized(source.name, locale);
      detail = `${localized(source.owner, locale)} · ${localized(source.dispute, locale)}`;
      break;
    case "festival-gate":
      title = localized(source.name, locale);
      detail = localized(source.claimant, locale);
      break;
    case "festival-desk":
      title = localized(source.name, locale);
      detail = localized(source.question, locale);
      break;
    case "festival-incident":
      title = localized(source.title, locale);
      detail = localized(source.body, locale);
      break;
    case "fieldwork-station":
      title = localized(source.name, locale);
      detail = `${source.code} · ${localized(source.supervisor, locale)}`;
      break;
    case "fieldwork-complication":
      title = localized(source.title, locale);
      detail = localized(source.detail, locale);
      break;
    case "property-item":
      title = localized(source.name, locale);
      detail = `${source.code} · ${localized(source.statement, locale)}`;
      break;
    case "post-message":
      title = localized(source.subject, locale);
      detail = `${localized(source.source, locale)} · v${source.version}`;
      break;
    case "calendar-event":
      title = localized(source.title, locale);
      detail = `${source.code} · ${localized(source.window, locale)}`;
      break;
    case "career-opening":
      title = localized(source.title, locale);
      detail = `${source.code} · ${localized(source.institution, locale)}`;
      break;
    case "employment-job":
      title = localized(source.title, locale);
      detail = `${source.code} · ${localized(source.employer, locale)}`;
      break;
    case "employment-outcome":
      title = localized(source.title, locale);
      detail = localized(source.note, locale);
      break;
    case "alumni-chapter":
      title = localized(source.title, locale);
      detail = `${localized(source.steward, locale)} · ${localized(source.meeting, locale)}`;
      break;
    case "orientation-season":
      title = localized(source.title, locale);
      detail = `${source.code} · ${localized(source.window, locale)}`;
      break;
    case "orientation-signal":
    case "orientation-notice":
    case "orientation-first-stop":
      title = localized(source.name, locale);
      detail = localized(source.detail, locale);
      break;
    default:
      return null;
  }

  return {
    ...recordEntry,
    route: routeForSource(recordEntry.source),
    title,
    detail,
    annotation: localized(recordEntry.annotation, locale),
    kindLabel: localized(knowledgeRecordKinds[recordEntry.kind], locale),
    source,
  };
}

export function knowledgeDossier(id) {
  return knowledgeDossiers.find((dossier) => dossier.id === id) || null;
}

export function knowledgeCharacter(id) {
  return knowledgeCharacters.find((character) => character.id === id) || null;
}

export function knowledgeVersions() {
  const ids = new Set(knowledgeDossiers.flatMap((dossier) => dossier.versions));
  return campusHistory.filter((entry) => ids.has(entry.id));
}

function eventReferenceKeys(event) {
  return new Set([
    event?.subject?.kind && event?.subject?.id ? `${event.subject.kind}:${event.subject.id}` : "",
    ...(event?.relations || []).map((relation) => (
      relation?.target?.kind && relation?.target?.id
        ? `${relation.target.kind}:${relation.target.id}`
        : ""
    )),
  ].filter(Boolean));
}

export function dossierMatchesEvent(dossier, event) {
  const references = eventReferenceKeys(event);
  return dossier.eventQueries.some((query) => (
    query.types.includes(event.type)
    && (!query.refs.length || query.refs.some((reference) => references.has(reference)))
  ));
}

export function dossiersForCharacter(characterId) {
  return knowledgeDossiers.filter((dossier) => dossier.characters.includes(characterId));
}

export function dossiersForVersion(versionId) {
  return knowledgeDossiers.filter((dossier) => dossier.versions.includes(versionId));
}
