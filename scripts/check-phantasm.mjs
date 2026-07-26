import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  phantasmCopy,
  phantasmCourses,
  phantasmExaminers,
  phantasmNodes,
  phantasmSealOrder,
} from "../src/data/phantasm.js";
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
}

const page = site.pages.find((candidate) => candidate.id === "phantasm");
check(page?.hidden === true && page?.output === "phantasm.html", "Dream Campus must build as a hidden route, not an ordinary navigation page.");

const [model, chrome, router] = await Promise.all([
  readFile(path.join(root, "src/js/phantasm-model.js"), "utf8"),
  readFile(path.join(root, "src/sections/chrome.html"), "utf8"),
  readFile(path.join(root, "src/js/site-router.js"), "utf8"),
]);
check(!model.includes("recordCampusEvent"), "Dream records must never write to the official campus event ledger.");
check(!chrome.includes("phantasm.html"), "Dream Campus leaked into primary desktop or mobile navigation.");
check(router.includes('phantasm: "phantasm.html"') && router.includes("/^phantasm"), "PHANTASM deep routes do not have an exact page owner.");

if (failures.length) {
  console.error(`PHANTASM boundary check failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log("PHANTASM boundary check passed: six seals, hidden routing, trilingual dream campus, and isolated dream records.");
