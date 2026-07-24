import { execFileSync } from "node:child_process";
import { campusHistory } from "../src/data/campus-history.js";

function normalizedSubject(value) {
  return String(value).replace(/\s+\(#\d+\)$/, "").trim();
}

const log = execFileSync(
  "git",
  ["log", "--first-parent", "--reverse", "--format=%H%x1f%aI%x1f%s"],
  { encoding: "utf8" },
)
  .trim()
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    const [hash, authoredAt, subject] = line.split("\x1f");
    return { hash, authoredAt, subject, normalized: normalizedSubject(subject) };
  });

const errors = [];
const bySubject = new Map();
const ids = new Set();
const archiveIds = new Set();

for (const entry of campusHistory) {
  const subject = normalizedSubject(entry.commitSubject);
  if (!entry.id || ids.has(entry.id)) errors.push(`Duplicate or missing history id: ${entry.id || "(empty)"}`);
  if (!entry.archiveId || archiveIds.has(entry.archiveId)) {
    errors.push(`Duplicate or missing archive id: ${entry.archiveId || "(empty)"}`);
  }
  if (bySubject.has(subject)) errors.push(`Duplicate commit subject mapping: ${subject}`);
  ids.add(entry.id);
  archiveIds.add(entry.archiveId);
  bySubject.set(subject, entry);
  for (const field of ["era", "title", "summary", "marginalia"]) {
    for (const locale of ["zh-Hant", "ja", "en"]) {
      if (!entry[field]?.[locale]?.trim()) errors.push(`${entry.id}.${field}.${locale} is empty`);
    }
  }
}

for (const commit of log) {
  const entry = bySubject.get(commit.normalized);
  if (!entry) {
    errors.push(`Git commit has no campus-history entry: ${commit.subject}`);
    continue;
  }
  if (entry.commit && entry.commit !== commit.hash) {
    errors.push(`${entry.id} points to ${entry.commit.slice(0, 8)}, expected ${commit.hash.slice(0, 8)}`);
  }
}

const logSubjects = new Set(log.map((commit) => commit.normalized));
const unmatched = campusHistory.filter((entry) => !logSubjects.has(normalizedSubject(entry.commitSubject)));
const unexpected = unmatched.filter((entry) => !entry.planned);
const missingHashes = campusHistory.filter((entry) => !entry.commit);

if (unexpected.length) {
  errors.push(`History entries do not match Git and are not planned: ${unexpected.map((entry) => entry.id).join(", ")}`);
}
if (unmatched.length > 1) {
  errors.push(`Only one next-commit history entry may be planned; found ${unmatched.length}`);
}
if (missingHashes.length > 1) {
  errors.push(
    `Backfill the previous main commit before planning another entry; missing hashes: ${missingHashes
      .map((entry) => entry.id)
      .join(", ")}`,
  );
}
if (missingHashes.length === 1 && missingHashes[0] !== campusHistory.at(-1)) {
  errors.push("Only the newest campus-history entry may omit its final main-branch hash");
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

const planned = unmatched[0];
console.log(
  `Campus history valid: ${log.length} Git commits covered, ${campusHistory.length} immersive records` +
    (planned ? `, next subject planned as “${planned.commitSubject}”.` : "."),
);
