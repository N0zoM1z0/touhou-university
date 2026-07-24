import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  gaokaoDifficulties,
  gaokaoMeta,
  gaokaoQuestionsFor,
  gaokaoTracks,
} from "../src/data/gaokao.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const locales = ["zh-Hant", "ja", "en"];
const failures = [];

function translated(value) {
  return value && locales.every((locale) => typeof value[locale] === "string" && value[locale].trim());
}

for (const [difficultyId, difficulty] of Object.entries(gaokaoDifficulties)) {
  if (!translated(difficulty.description)) failures.push(`${difficultyId}: difficulty description is incomplete.`);
  for (const trackId of Object.keys(gaokaoTracks)) {
    const questions = gaokaoQuestionsFor(trackId, difficultyId);
    const ids = new Set();
    const answers = [0, 0, 0, 0];
    let total = 0;
    for (const question of questions) {
      total += question.points;
      if (ids.has(question.id)) failures.push(`${difficultyId}/${trackId}: duplicate question ${question.id}.`);
      ids.add(question.id);
      if (!translated(question.prompt) || !translated(question.explanation)) {
        failures.push(`${question.id}: prompt or explanation is not trilingual.`);
      }
      if (!Array.isArray(question.options) || question.options.length !== 4 || !question.options.every(translated)) {
        failures.push(`${question.id}: exactly four trilingual options are required.`);
      }
      if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer > 3) {
        failures.push(`${question.id}: answer index is invalid.`);
      } else {
        answers[question.answer] += 1;
      }
      if (difficultyId !== "normal" && !translated(question.evidence)) {
        failures.push(`${question.id}: higher-difficulty question lacks a trilingual dossier.`);
      }
    }
    const expectedCount = difficultyId === "normal" ? 24 : 12;
    if (questions.length !== expectedCount) {
      failures.push(`${difficultyId}/${trackId}: expected ${expectedCount} questions, found ${questions.length}.`);
    }
    if (total !== gaokaoMeta.total) {
      failures.push(`${difficultyId}/${trackId}: expected ${gaokaoMeta.total} marks, found ${total}.`);
    }
    if (Math.max(...answers) - Math.min(...answers) > 0) {
      failures.push(`${difficultyId}/${trackId}: answer positions are unbalanced (${answers.join("/")}).`);
    }
    for (const locale of locales) {
      for (const suffix of ["paper", "answers"]) {
        const filename = `${gaokaoMeta.edition.toLowerCase()}-${locale}-${difficultyId}-${trackId}-${suffix}.html`;
        try {
          await access(path.join(root, "downloads", "gaokao", filename));
        } catch {
          failures.push(`Missing offline file: ${filename}.`);
        }
      }
    }
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Unified examination valid: 8 papers, 150 marks each, trilingual dossiers, balanced A/B/C/D keys, 48 offline files.");
