import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  phantasmBrandProfiles,
  phantasmCopy,
  phantasmCourses,
  phantasmExaminers,
  phantasmNodes,
  phantasmSealOrder,
} from "../src/data/phantasm.js";
import { phantasmExamMeta, phantasmExamQuestions } from "../src/data/phantasm-exam.js";
import {
  PHANTASM_ENTRANCES,
  phantasmBoundarySchedule,
} from "../src/js/phantasm-gate.js";
import { site } from "../site.config.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const locales = ["zh-Hant", "ja", "en"];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const translated = (value) => locales.every((locale) => typeof value?.[locale] === "string" && value[locale].trim());

check(phantasmSealOrder.length === 6 && new Set(phantasmSealOrder).size === 6, "PHANTASM must keep six distinct lifecycle seals.");
check(phantasmCourses.length === 6 && new Set(phantasmCourses.map((course) => course.id)).size === 6, "Dream catalogue must keep six unique courses.");
check(phantasmNodes.length === 6 && new Set(phantasmNodes.map((node) => node.id)).size === 6, "Reverse campus must keep six unique map nodes.");
check(phantasmExaminers.length === 4, "Reverse viva must retain four distinct examiner positions.");
check(Object.keys(phantasmBrandProfiles).sort().join(",") === "full,new,waning,waxing", "Dream Campus must retain four lunar brand profiles.");
check(phantasmExamMeta.requiredDifficulty === "extra" && phantasmExamQuestions.length === 9, "Dream Campus lost its EXTRA-gated PHANTASM reverse paper.");

for (const course of phantasmCourses) {
  check(translated(course.title) && translated(course.teacher) && translated(course.syllabus) && translated(course.assessment), `${course.id} is missing trilingual course material.`);
  check(course.requires ? phantasmSealOrder.includes(course.requires) : course.bonus === "book-returned", `${course.id} has an unknown ordinary-lifecycle condition.`);
}
for (const node of phantasmNodes) {
  check(translated(node.title) && translated(node.role) && translated(node.body), `${node.id} is missing trilingual reverse-map copy.`);
  check(Number.isFinite(node.x) && Number.isFinite(node.y), `${node.id} is missing bounded map coordinates.`);
}
for (const locale of locales) {
  check(phantasmCopy[locale]?.invalid === "Not valid outside the dream boundary", `${locale} lost the dream-transcript boundary line.`);
  check(phantasmCopy[locale]?.moonNames?.length === 8, `${locale} lost the eight-phase lunar boundary labels.`);
}
for (const profile of Object.values(phantasmBrandProfiles)) {
  check(translated(profile.name) && translated(profile.short) && translated(profile.motto), "A lunar Dream Campus brand is missing translations.");
}

const entranceCoverage = new Set();
const moonCoverage = new Set();
for (let day = 0; day < 48; day += 1) {
  const base = new Date(2026, 0, 1 + day, 0, 17);
  const daily = phantasmBoundarySchedule(base);
  moonCoverage.add(daily.lunarPhase);
  check(daily.openSlots.length >= 2 && daily.openSlots.length <= 3, `${daily.dayKey} does not have two or three bounded opening windows.`);
  for (let slot = 0; slot < 8; slot += 1) {
    const schedule = phantasmBoundarySchedule(new Date(2026, 0, 1 + day, slot * 3, 17));
    schedule.activeEntrances.forEach((entrance) => entranceCoverage.add(entrance));
    check(schedule.activeEntrances.every((entrance) => PHANTASM_ENTRANCES.includes(entrance)), `${schedule.signature} selected an unknown entrance.`);
  }
}
check(entranceCoverage.size === PHANTASM_ENTRANCES.length, "Date, moon, and bell rotation does not visit all five ordinary-site entrances.");
check(moonCoverage.size === 8, "Boundary schedule fixtures do not cover all eight lunar phases.");

const page = site.pages.find((candidate) => candidate.id === "phantasm");
check(page?.hidden === true && page?.output === "phantasm.html", "Dream Campus must build as a hidden route, not an ordinary navigation page.");

const [model, examModel, gate, interfaceSource, chrome, router, mytu, map, search, bbs] = await Promise.all([
  readFile(path.join(root, "src/js/phantasm-model.js"), "utf8"),
  readFile(path.join(root, "src/js/phantasm-exam-model.js"), "utf8"),
  readFile(path.join(root, "src/js/phantasm-gate.js"), "utf8"),
  readFile(path.join(root, "src/js/phantasm.js"), "utf8"),
  readFile(path.join(root, "src/sections/chrome.html"), "utf8"),
  readFile(path.join(root, "src/js/site-router.js"), "utf8"),
  readFile(path.join(root, "src/js/mytu.js"), "utf8"),
  readFile(path.join(root, "src/js/map.js"), "utf8"),
  readFile(path.join(root, "src/js/search.js"), "utf8"),
  readFile(path.join(root, "src/js/bbs.js"), "utf8"),
]);
check(!model.includes("recordCampusEvent"), "Dream records must never write to the official campus event ledger.");
check(!examModel.includes("recordCampusEvent") && examModel.includes('difficultyId === phantasmExamMeta.requiredDifficulty'), "PHANTASM examination must stay ledger-isolated and require a completed ordinary EXTRA attempt.");
check(gate.includes("tu:phantasm:boundary") && gate.includes("tu:phantasm:pass"), "Dynamic boundary attempts and short session passage are not isolated.");
check(gate.includes("mercyReady") && gate.includes("PASS_DURATION"), "The lunar boundary can close but has no bounded accessibility release.");
check(interfaceSource.includes("dreamFavicon") && interfaceSource.includes("phantasm-brand-active"), "Entering PHANTASM does not replace the university name and crest/favicon shell.");
check(!chrome.includes("phantasm.html"), "Dream Campus leaked into primary desktop or mobile navigation.");
check(router.includes('phantasm: "phantasm.html"') && router.includes("/^phantasm"), "PHANTASM deep routes do not have an exact page owner.");
check(mytu.includes('"mytu"') && map.includes('"map"') && search.includes('"search"') && bbs.includes('"bbs"'), "One or more rotating ordinary-site entrance sources are not wired.");

if (failures.length) {
  console.error(`PHANTASM boundary check failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log("PHANTASM boundary check passed: six seals, five rotating lunar entrances, reachable wrong-door release, four dream brands, and isolated records.");
