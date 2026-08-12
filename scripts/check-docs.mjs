import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { projectStatus } from "./project-status.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspace = path.dirname(root);
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const read = (relative) => readFile(path.join(root, relative), "utf8");

const required = [
  "AGENTS.md",
  "CHANGELOG.md",
  "README.md",
  "docs/CURRENT_STATE.md",
  "docs/AGENT_HANDBOOK.md",
  "docs/AGENT_DOMAIN_RULES.md",
  "docs/ROADMAP.md",
  "docs/research/README.md",
];
for (const file of required) {
  try {
    await access(path.join(root, file));
  } catch {
    failures.push(`Missing agent/repository document: ${file}`);
  }
}

const status = await projectStatus();
const current = await read("docs/CURRENT_STATE.md");
const readme = await read("README.md");
const agents = await read("AGENTS.md");
const handbook = await read("docs/AGENT_HANDBOOK.md");
const roadmap = await read("docs/ROADMAP.md");
const changelog = await read("CHANGELOG.md");

const portableDocuments = new Map([
  ["AGENTS.md", agents],
  ["README.md", readme],
  ["docs/CURRENT_STATE.md", current],
  ["docs/AGENT_HANDBOOK.md", handbook],
  ["docs/AGENT_DOMAIN_RULES.md", await read("docs/AGENT_DOMAIN_RULES.md")],
  ["docs/research/README.md", await read("docs/research/README.md")],
]);
for (const [relative, contents] of portableDocuments) {
  check(!contents.includes("/home/pentester/"), `${relative} depends on a machine-specific absolute path.`);
  for (const match of contents.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].split("#", 1)[0];
    if (!target || /^(?:https?:|mailto:)/.test(target)) continue;
    try {
      await access(path.resolve(root, path.dirname(relative), target));
    } catch {
      failures.push(`Broken local documentation link in ${relative}: ${match[1]}`);
    }
  }
}

const expectedCurrentLines = [
  `Release: \`${status.version}\``,
  `| Generated pages | ${status.pages} |`,
  `| Ordinary public pages | ${status.ordinaryPages} |`,
  `| Deliberately hidden pages | ${status.hiddenPages} (\`phantasm.html\`) |`,
  `| Unique content sections | ${status.sections} |`,
  `| CSS bundles | ${status.cssBundles} |`,
  `| Supported locales | ${status.locales} (\`zh-Hant\`, \`ja\`, \`en\`) |`,
  `| Registered on-device keys | ${status.localRecordKeys} |`,
  `| Known records shelves | ${status.localRecordShelves} |`,
  `| Official event contracts | ${status.eventContracts} |`,
  `| Hieda dossiers / characters / source leaves | ${status.knowledgeDossiers} / ${status.knowledgeCharacters} / ${status.knowledgeLeaves} |`,
  `| Employment vacancies / illustrated posters | ${status.employmentJobs} / ${status.employmentPosters} |`,
  `| Catalogue courses | ${status.courses} |`,
  `| Fieldwork stations | ${status.fieldworkStations} |`,
  `| Offline unified-exam files | ${status.offlineExamFiles} |`,
];
expectedCurrentLines.forEach((line) => check(current.includes(line), `CURRENT_STATE.md is stale or missing: ${line}`));

check((current.match(/^\| `[^`]+\.html` \|/gm) || []).length === status.pages, "CURRENT_STATE.md page-ownership table does not cover every generated page.");
check(readme.includes("docs/CURRENT_STATE.md") && readme.includes("docs/AGENT_HANDBOOK.md"), "README.md does not route maintainers to the audited handoff documents.");
check(agents.includes("docs/CURRENT_STATE.md") && agents.includes("docs/AGENT_DOMAIN_RULES.md"), "AGENTS.md is missing the documented reading route.");
check(handbook.includes("git log --first-parent") && handbook.includes("changeCommit"), "Agent handbook does not preserve first-parent/merge history rules.");
check(
  roadmap.includes("implementation history, not current\nauthority or an automatic task queue")
    && roadmap.includes(`implemented in ${status.version}`),
  "ROADMAP.md still presents old batches as current truth.",
);

const releaseHeadings = [...changelog.matchAll(/^## \[([^\]]+)\]/gm)].map((match) => match[1]);
check(releaseHeadings[0] === "Unreleased", "CHANGELOG.md must begin with Unreleased.");
check(releaseHeadings[1] === status.version, `CHANGELOG.md latest release is ${releaseHeadings[1] || "missing"}, expected ${status.version}.`);

const researchRelease = path.join(root, "docs", "research");
const researchWorking = path.join(workspace, "research");
try {
  const files = (await readdir(researchRelease)).filter((file) => file.endsWith(".md"));
  await access(researchWorking);
  for (const file of files) {
    const releaseCopy = await readFile(path.join(researchRelease, file));
    let workingCopy;
    try {
      workingCopy = await readFile(path.join(researchWorking, file));
    } catch {
      failures.push(`Working research mirror is missing ${file}.`);
      continue;
    }
    check(releaseCopy.equals(workingCopy), `Research mirror drift: docs/research/${file} differs from ../research/${file}.`);
  }
} catch {
  // A standalone clone has no sibling working mirror; the repository copy is sufficient.
}

if (failures.length) {
  console.error(`Documentation check failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(
  `Documentation current: ${status.pages} pages, ${status.localRecordKeys} keys, ${status.eventContracts} events, `
  + `${status.knowledgeDossiers}/${status.knowledgeCharacters}/${status.knowledgeLeaves} Hieda index, `
  + `${status.employmentJobs}/${status.employmentPosters} employment notices, release ${status.version}.`,
);
