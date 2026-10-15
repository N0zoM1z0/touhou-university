import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { readStylesheet, stylesheetReferences } from "../build/styles.mjs";

test("an SVG's internal url() is part of its data URL, not a separate file", () => {
  const svg = `data:image/svg+xml,<svg><g filter='url(%23n)'/></svg>`;
  assert.deepEqual(stylesheetReferences(`.a { background: url("${svg}") } .b { src: url('../font.woff2') }`), [svg, "../font.woff2"]);
});

test("stylesheet includes preserve exact order, nested at-rules and source bytes", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "tu-styles-"));
  try {
    await writeFile(path.join(root, "entry.css"), "/* @include ./a.css */\n/* @include ./b.css */\n");
    await writeFile(path.join(root, "a.css"), ".a { color: red; }\n");
    await writeFile(path.join(root, "b.css"), "@media print { .b { display: none; } }\n");
    assert.equal(await readStylesheet(path.join(root, "entry.css"), root), ".a { color: red; }\n@media print { .b { display: none; } }\n");
    await writeFile(path.join(root, "a.css"), "/* @include ./entry.css */\n");
    await assert.rejects(readStylesheet(path.join(root, "entry.css"), root), /Circular/);
    await writeFile(path.join(root, "a.css"), "/* @include ../outside.css */\n");
    await assert.rejects(readStylesheet(path.join(root, "entry.css"), root), /escapes/);
  } finally { await rm(root, { recursive: true, force: true }); }
});
