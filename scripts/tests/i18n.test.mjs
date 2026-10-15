import test from "node:test";
import assert from "node:assert/strict";
import { parsePo, serializePo, mergeCatalog } from "../i18n/po.mjs";
import { activeEntries, compileCatalog } from "../i18n/catalogs.mjs";
import { bindCatalog } from "../../src/js/locale-catalog.js";
import { renderDefaultCopy } from "../build/translations.mjs";

const entry = (context, text, translation = text, overrides = {}) => ({
  msgctxt: context, msgid: text, msgstr: translation,
  comments: ["#. Campus desk", "#: src/js/example.js:12"], flags: [], ...overrides,
});

test("PO round-trips multiline Unicode, escaped quotes, notes and obsolete memory", () => {
  const text = 'The "gate" moves.\n請保留退路。\t\\ 🦊 '.repeat(8);
  const original = [entry("text:gate", text), entry("text:removed", "Old", "旧", { obsolete: true })];
  const encoded = serializePo(original, "ja");
  const decoded = parsePo(encoded).filter((item) => item.msgctxt);
  assert.equal(decoded[0].msgid, text);
  assert.equal(decoded[0].msgstr, text);
  assert.deepEqual(decoded[0].comments, original[0].comments);
  assert.equal(decoded[1].obsolete, true);
  assert.equal(decoded[1].msgstr, "旧");
});

test("PO rejects malformed or unsupported directives with locations", () => {
  assert.throws(() => parsePo('msgid "broken\nmsgstr "x"', "bad.po"), /bad.po:1/);
  assert.throws(() => parsePo('msgid "x"\nmsgid_plural "xs"\nmsgstr[0] "x"'), /unsupported/);
  assert.throws(() => parsePo('msgid "x"'), /missing msgstr/);
});

test("catalog merging retains translator and editor metadata", () => {
  const old = parsePo(serializePo([entry("text:a", "A", "甲")], "zh-Hant"));
  old[0].msgstr += "Last-Translator: Campus review desk\nX-Generator: Poedit\n";
  old[0].comments.push("# Translation notes: use the campus register");
  const merged = mergeCatalog([entry("text:a", "A")], old);
  const header = parsePo(serializePo(merged, "zh-Hant"))[0].msgstr;
  assert.match(header, /Last-Translator: Campus review desk/);
  assert.match(header, /X-Generator: Poedit/);
  assert.match(header, /Language: zh-Hant/);
  assert.match(serializePo(merged, "zh-Hant"), /# Translation notes: use the campus register/);
});

test("changed source stays pending and removed text remains recoverable", () => {
  const previous = [entry("text:gate", "Old gate", "旧門", { comments: ["# Reviewer: confirm which gate", "#: old.js:1"] }), entry("text:gone", "Gone", "旧文")];
  const merged = mergeCatalog([entry("text:gate", "New gate"), entry("text:new", "New")], previous);
  assert.equal(merged[0].msgstr, "旧門");
  assert.ok(merged[0].flags.includes("fuzzy"));
  assert.ok(merged[0].comments.includes("# Reviewer: confirm which gate"));
  assert.ok(merged[0].comments.some((comment) => comment.startsWith("#| msgid")));
  assert.equal(merged[1].msgstr, "");
  assert.equal(merged[2].obsolete, true);
  const restored = mergeCatalog([entry("text:gone", "Gone")], merged);
  assert.equal(restored[0].msgstr, "旧文");
  assert.equal(restored[0].obsolete, false);
});

test("shipping rejects duplicate, empty, fuzzy and unsynchronised English entries", () => {
  const header = { msgid: "", msgstr: "Language: en\n" };
  for (const [records, reason] of [
    [[entry("text:a", "A"), entry("text:a", "A")], /duplicate context/],
    [[entry("text:a", "A", "")], /empty/],
    [[entry("text:a", "A", "A", { flags: ["fuzzy"] })], /fuzzy/],
    [[entry("text:a", "A", "New A")], /English source changed/],
  ]) assert.throws(() => activeEntries([header, ...records], "en.po", "en"), reason);
});

test("interpolation preserves reordered and repeated values without rewriting the catalog", () => {
  const record = { "zh-Hant": "{name}：{count}/{count}", ja: "{count}・{name}・{count}", en: "{name}: {count}/{count}" };
  const text = bindCatalog({ gate: record }, "test");
  assert.equal(text("gate", { name: "Reimu", count: 2 }).ja, "2・Reimu・2");
  assert.equal(text("gate", { "zh-Hant": { name: "靈夢", count: 3 }, ja: { name: "霊夢", count: 4 }, en: { name: "Reimu", count: 5 } }).ja, "4・霊夢・4");
  assert.equal(text("gate"), record);
  assert.equal(record.ja, "{count}・{name}・{count}");
  assert.throws(() => text("toString"), /Unknown translation/);
});

test("tree compilation retains array shapes and escaped JSON-pointer field names", () => {
  const values = { "zh-Hant": "甲", ja: "乙", en: "A" };
  const generated = compileCatalog({ scope: "ui/example", entries: [
    { context: "tree:copy#/rows/0/label~1detail", values },
    { context: "tree:copy#/rows/1/label~1detail", values },
  ] });
  const tree = JSON.parse(generated.slice(generated.indexOf("export const trees = ") + 21).trim().slice(0, -1));
  assert.deepEqual(tree.copy.ja.rows, [{ "label/detail": "乙" }, { "label/detail": "乙" }]);
});

test("compiled defaults honour PO edits, escape text and preserve mixed-content structure", () => {
  const source = '<p data-i18n="title">Old</p><a href="#x"><!-- i18n:link --> Old <b>↗</b></a><input title="Old" data-i18n-title="help">';
  const result = renderDefaultCopy(source, { title: '<New> & "safe"', link: "新連結", help: 'New "hint"' });
  assert.equal(result, '<p data-i18n="title">&lt;New&gt; &amp; &quot;safe&quot;</p><a href="#x"><!-- i18n:link --> 新連結 <b>↗</b></a><input title="New &quot;hint&quot;" data-i18n-title="help">');
  assert.throws(() => renderDefaultCopy('<p data-i18n="missing">Old</p>', {}), /Unknown markup/);
});
