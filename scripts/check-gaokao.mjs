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
const hardcodedChoiceReferences = {
  "zh-Hant": /(?:選項|答案|正解)\s*(?:是|為|为|[:：])?\s*[A-DＡ-Ｄ](?![A-Za-z])/iu,
  ja: /(?:答え|解答|正解)\s*(?:は|が|[:：])?\s*[A-DＡ-Ｄ](?![A-Za-z])/iu,
  en: /\b(?:option|choice|answer)\s*(?:is|:)?\s+[A-D]\b/iu,
};

function translated(value) {
  return value && locales.every((locale) => typeof value[locale] === "string" && value[locale].trim());
}

function optionLength(value, locale) {
  return locale === "en"
    ? value.trim().split(/\s+/u).length
    : (value.match(/[\p{L}\p{N}]/gu) || []).length;
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
      for (const locale of locales) {
        if (hardcodedChoiceReferences[locale].test(question.explanation?.[locale] || "")) {
          failures.push(
            `${question.id}: ${locale} explanation hardcodes a choice letter; name the answer content instead.`,
          );
        }
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
    const answerKey = questions.map((question) => question.answer).join("");
    if (answerKey === questions.map((_, index) => index % 4).join("")) {
      failures.push(`${difficultyId}/${trackId}: answer positions follow a visible A/B/C/D cycle.`);
    }
    for (const locale of locales) {
      let uniqueLongest = 0;
      let ratioTotal = 0;
      for (const question of questions) {
        const lengths = question.options.map((option) => optionLength(option[locale], locale));
        const correctLength = lengths[question.answer];
        const longest = Math.max(...lengths);
        if (correctLength === longest && lengths.filter((length) => length === longest).length === 1) {
          uniqueLongest += 1;
        }
        const distractorMean = lengths.reduce(
          (sum, length, index) => sum + (index === question.answer ? 0 : length),
          0,
        ) / 3;
        ratioTotal += correctLength / distractorMean;
      }
      if (uniqueLongest > Math.floor(questions.length / 2)) {
        failures.push(`${difficultyId}/${trackId}/${locale}: correct choice is uniquely longest in ${uniqueLongest}/${questions.length} questions.`);
      }
      const meanRatio = ratioTotal / questions.length;
      if (meanRatio > 1.3) {
        failures.push(`${difficultyId}/${trackId}/${locale}: correct choices average ${meanRatio.toFixed(2)}× distractor length.`);
      }
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

console.log("Unified examination valid: 8 papers, 150 marks each, trilingual dossiers, revision-safe drafts, non-cyclic balanced keys, bounded length cues, 48 offline files.");
