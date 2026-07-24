import { courseCatalogue } from "../src/data/courses.js";
import { libraryFacets, libraryHoldings } from "../src/data/library.js";

const locales = ["zh-Hant", "ja", "en"];
const errors = [];
const ids = new Set();
const callNumbers = new Set();
const courses = new Set(courseCatalogue.map((course) => course.code));

function localized(value, path) {
  if (!value || typeof value !== "object") {
    errors.push(`${path} must be localized`);
    return;
  }
  for (const locale of locales) {
    if (typeof value[locale] !== "string" || !value[locale].trim()) errors.push(`${path}.${locale} is missing`);
  }
}

if (libraryHoldings.length !== 19) errors.push(`expected 19 holdings, found ${libraryHoldings.length}`);

for (const [index, holding] of libraryHoldings.entries()) {
  const path = `holding[${index}]`;
  if (!holding.id || ids.has(holding.id)) errors.push(`${path}.id is missing or duplicated`);
  if (!holding.callNumber || callNumbers.has(holding.callNumber)) errors.push(`${path}.callNumber is missing or duplicated`);
  ids.add(holding.id);
  callNumbers.add(holding.callNumber);

  for (const field of ["title", "author", "subject", "edition", "origin", "location", "note"]) {
    localized(holding[field], `${path}.${field}`);
  }
  if (!libraryFacets.schools[holding.school]) errors.push(`${path}.school is invalid`);
  if (!libraryFacets.wills[holding.will]) errors.push(`${path}.will is invalid`);
  if (!libraryFacets.dangers[holding.danger]) errors.push(`${path}.danger is invalid`);
  if (!libraryFacets.states[holding.state]) errors.push(`${path}.state is invalid`);
  if (!["loan", "reference"].includes(holding.circulation)) errors.push(`${path}.circulation is invalid`);
  if (!Number.isInteger(holding.loanDays) || holding.loanDays < 0) errors.push(`${path}.loanDays is invalid`);
  if (!Number.isInteger(holding.renewalLimit) || holding.renewalLimit < 0) errors.push(`${path}.renewalLimit is invalid`);
  if (holding.circulation === "reference" && (holding.loanDays || holding.renewalLimit)) {
    errors.push(`${path} reference holdings cannot have loan terms`);
  }
  if (holding.circulation === "loan" && holding.loanDays < 1) errors.push(`${path} loan holdings need a loan period`);
  for (const code of holding.accessCourses || []) {
    if (!courses.has(code)) errors.push(`${path}.accessCourses includes unknown course ${code}`);
  }
}

for (const [facet, values] of Object.entries(libraryFacets)) {
  for (const [id, value] of Object.entries(values)) localized(value, `facets.${facet}.${id}`);
}

if (errors.length) {
  console.error(`Library validation failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

console.log(`Library data valid: ${libraryHoldings.length} trilingual holdings, ${callNumbers.size} unique call numbers.`);
