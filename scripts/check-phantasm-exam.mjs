import {
  phantasmExamCopy,
  phantasmExamMeta,
  phantasmExamQuestions,
  phantasmExamSections,
} from "../src/data/phantasm-exam.js";

const locales = ["zh-Hant", "ja", "en"];
const failures = [];
const translated = (value) => locales.every((locale) => typeof value?.[locale] === "string" && value[locale].trim());
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const optionLength = (value, locale) => locale === "en"
  ? value.trim().split(/\s+/u).length
  : (value.match(/[\p{L}\p{N}]/gu) || []).length;

check(phantasmExamMeta.total === 150, "PHANTASM reverse paper must remain 150 marks.");
check(phantasmExamMeta.questionCount === 9 && phantasmExamQuestions.length === 9, "PHANTASM reverse paper must keep nine questions.");
check(phantasmExamMeta.requiredDifficulty === "extra", "PHANTASM paper must require one completed ordinary EXTRA paper.");
check(phantasmExamSections.length === 3, "PHANTASM reverse paper must keep three distinct reasoning sections.");
check(phantasmExamQuestions.reduce((sum, question) => sum + question.points, 0) === phantasmExamMeta.total, "PHANTASM question marks do not total 150.");
check(new Set(phantasmExamQuestions.map((question) => question.id)).size === phantasmExamQuestions.length, "PHANTASM question ids are not unique.");
check(new Set(phantasmExamMeta.answerSchedule).size === 4, "PHANTASM answer schedule does not use all four positions.");

for (const section of phantasmExamSections) {
  check(translated(section.title) && translated(section.note), `${section.id} lacks trilingual section copy.`);
  check(phantasmExamQuestions.filter((question) => question.sectionId === section.id).length === 3, `${section.id} must contain three questions.`);
}

for (const [index, question] of phantasmExamQuestions.entries()) {
  check(question.answer === phantasmExamMeta.answerSchedule[index], `${question.id} does not match the explicit answer schedule.`);
  check([16, 18].includes(question.points), `${question.id} has an unexpected point value.`);
  check(translated(question.evidence) && translated(question.prompt) && translated(question.explanation), `${question.id} lacks trilingual source material.`);
  check(question.options.length === 4 && question.options.every(translated), `${question.id} must have four trilingual options.`);
  for (const locale of locales) {
    const normalized = question.options.map((option) => option[locale].trim().toLocaleLowerCase(locale));
    check(new Set(normalized).size === 4, `${question.id}/${locale} has duplicate options.`);
  }
}

for (const locale of locales) {
  const c = phantasmExamCopy[locale];
  check(c && c.invalid === "Not valid outside the dream boundary", `${locale} lost the reverse-exam validity warning.`);
  check(Array.isArray(c?.rules) && c.rules.length === 4, `${locale} lacks the four reverse-exam rules.`);
  let uniqueLongest = 0;
  let ratioTotal = 0;
  for (const question of phantasmExamQuestions) {
    const lengths = question.options.map((option) => optionLength(option[locale], locale));
    const correctLength = lengths[question.answer];
    const longest = Math.max(...lengths);
    if (correctLength === longest && lengths.filter((length) => length === longest).length === 1) uniqueLongest += 1;
    const distractorMean = lengths.reduce((sum, length, index) => sum + (index === question.answer ? 0 : length), 0) / 3;
    ratioTotal += correctLength / distractorMean;
  }
  check(uniqueLongest <= 4, `${locale}: correct choice is uniquely longest in ${uniqueLongest}/9 PHANTASM questions.`);
  check(ratioTotal / phantasmExamQuestions.length <= 1.3, `${locale}: correct PHANTASM choices are too long on average.`);
}

if (failures.length) {
  console.error(`PHANTASM examination check failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log("PHANTASM examination valid: one gated trilingual reverse paper, 9 questions, 3 reasoning sections, 150 marks, isolated records, and bounded length cues.");
