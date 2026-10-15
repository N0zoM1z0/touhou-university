import test from "node:test";
import assert from "node:assert/strict";
import { recordKeyReferences } from "../checks/record-references.mjs";

test("readiness notifications do not become storage records, but actual key uses still do", () => {
  const source = `window.dispatchEvent(new CustomEvent("tu:ready"));
    window.addEventListener("tu:ready", init);
    const KEY = "tu:student:files";
    localStorage.setItem("tu:ready", "a genuine stored record");`;
  assert.deepEqual([...recordKeyReferences(source)], ["tu:student:files", "tu:ready"]);
  assert.equal(recordKeyReferences('new CustomEvent("tu:ready")').size, 0);
});
