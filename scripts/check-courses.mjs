import { courseCatalogue, courseDays, coursePeriods, courseTerm } from "../src/data/courses.js";
import { schools } from "../src/data/schools.js";

const failures = [];
const locales = ["zh-Hant", "ja", "en"];
const codes = new Set(courseCatalogue.map((course) => course.code));

if (courseCatalogue.length !== 35 || codes.size !== 35) {
  failures.push(`Expected 35 unique catalogue courses; found ${courseCatalogue.length} records and ${codes.size} codes.`);
}
if (courseTerm.creditLimit !== 18) failures.push("The current registration credit limit must remain 18.");

for (const [schoolId, school] of Object.entries(schools)) {
  const expected = new Set(school.courses.map(([code]) => code));
  const actual = new Set(courseCatalogue.filter((course) => course.schoolId === schoolId).map((course) => course.code));
  if (expected.size !== actual.size || [...expected].some((code) => !actual.has(code))) {
    failures.push(`${schoolId} registration records do not match its canonical school catalogue.`);
  }
}

for (const course of courseCatalogue) {
  if (!course.instructor || !course.note || locales.some((locale) => !course.title?.[locale] || !course.instructor?.[locale] || !course.note?.[locale])) {
    failures.push(`${course.code} is missing trilingual title, instructor, or course-rule copy.`);
  }
  if (!courseDays[course.day]) failures.push(`${course.code} uses unknown day ${course.day}.`);
  if (!coursePeriods[course.period]) failures.push(`${course.code} uses unknown period ${course.period}.`);
  if (!Number.isInteger(course.capacity) || !Number.isInteger(course.occupied) || course.capacity < 1 || course.occupied < 0) {
    failures.push(`${course.code} has invalid capacity data.`);
  }
  for (const prerequisite of course.prerequisites || []) {
    if (!codes.has(prerequisite)) failures.push(`${course.code} references missing prerequisite ${prerequisite}.`);
    if (prerequisite === course.code) failures.push(`${course.code} requires itself.`);
  }
  for (const conflict of course.conflictsWith || []) {
    if (!codes.has(conflict)) failures.push(`${course.code} references missing conflict ${conflict}.`);
    if (!courseCatalogue.find((candidate) => candidate.code === conflict)?.conflictsWith?.includes(course.code)) {
      failures.push(`${course.code} / ${conflict} unusual collision is not reciprocal.`);
    }
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Course registration valid: ${courseCatalogue.length} courses, ${Object.keys(schools).length} schools, ${locales.length} locales, ${courseCatalogue.filter((course) => course.occupied >= course.capacity).length} full sections.`);
