import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { referenceUpdater } from "../i18n/references.mjs";

test("PO source references follow stable fields after line moves, retaining reviewer notes", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "tu-po-reference-"));
  try {
    await mkdir(path.join(root, "src/js"), { recursive: true });
    const source = '\n\nconst title = catalogText("gate.title");\n';
    const file = path.join(root, "src/js/example.js");
    await writeFile(file, source);
    const entry = { msgctxt: "text:gate.title", comments: ["# Keep the gate name", "#. Title", "#: old.js:400"] };
    await referenceUpdater(root)("ui/example", entry);
    assert.deepEqual(entry.comments, ["# Keep the gate name", "#. Title", "#: src/js/example.js:3"]);
    await writeFile(file, "\n" + source);
    await referenceUpdater(root)("ui/example", entry);
    assert.equal(entry.comments.at(-1), "#: src/js/example.js:4");
  } finally { await rm(root, { recursive: true, force: true }); }
});
