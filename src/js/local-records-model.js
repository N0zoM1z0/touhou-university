import { localRecordRegistry } from "../data/local-records.js";

export const LOCAL_ARCHIVE_FORMAT = "touhou-university-on-device-archive";
export const LOCAL_ARCHIVE_VERSION = 1;
export const LOCAL_ARCHIVE_MAX_BYTES = 8 * 1024 * 1024;

const knownRecords = new Map(localRecordRegistry.map((record) => [record.key, record]));

function browserStorage(kind = "local") {
  try {
    return kind === "session" ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
}

export function utf8Bytes(value = "") {
  if (typeof TextEncoder !== "undefined") return new TextEncoder().encode(String(value)).byteLength;
  return new Blob([String(value)]).size;
}

function parseStoredValue(raw) {
  if (raw === null) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function entryCount(value) {
  if (value === null || value === undefined || value === "") return 0;
  if (Array.isArray(value)) return value.length;
  if (typeof value === "object") {
    const nestedArrays = Object.values(value).filter(Array.isArray);
    if (nestedArrays.length) return Math.max(1, nestedArrays.reduce((total, items) => total + items.length, 0));
    return Object.keys(value).length ? 1 : 0;
  }
  return 1;
}

function storedKeys(storage) {
  if (!storage) return [];
  const keys = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key?.startsWith("tu:")) keys.push(key);
  }
  return keys;
}

function discoveredRecord(key, storage) {
  const known = knownRecords.get(key);
  if (known) return known;
  return {
    key,
    group: "unknown",
    storage,
    portable: storage === "local",
    kind: storage === "session" ? "session" : "record",
    scope: storage === "session" ? "session" : "device",
    title: {
      "zh-Hant": key,
      ja: key,
      en: key,
    },
  };
}

function recordSnapshot(metadata) {
  const storage = browserStorage(metadata.storage);
  let raw = null;
  try {
    raw = storage?.getItem(metadata.key) ?? null;
  } catch {
    raw = null;
  }
  const value = parseStoredValue(raw);
  return {
    ...metadata,
    present: raw !== null,
    raw,
    value,
    entries: entryCount(value),
    bytes: raw === null ? 0 : utf8Bytes(metadata.key) + utf8Bytes(raw),
  };
}

export function collectLocalRecords({ includeEmpty = true } = {}) {
  const catalogued = localRecordRegistry.map(recordSnapshot);
  const cataloguedIds = new Set(catalogued.map((record) => `${record.storage}:${record.key}`));
  const discovered = [];

  for (const storageName of ["local", "session"]) {
    for (const key of storedKeys(browserStorage(storageName))) {
      if (cataloguedIds.has(`${storageName}:${key}`)) continue;
      discovered.push(recordSnapshot(discoveredRecord(key, storageName)));
    }
  }

  const records = [...catalogued, ...discovered];
  return includeEmpty ? records : records.filter((record) => record.present);
}

export async function estimateLocalArchive() {
  const records = collectLocalRecords({ includeEmpty: false });
  const archiveBytes = records.reduce((total, record) => total + record.bytes, 0);
  let originUsage = null;
  let originQuota = null;
  try {
    const estimate = await navigator.storage?.estimate?.();
    originUsage = Number.isFinite(estimate?.usage) ? estimate.usage : null;
    originQuota = Number.isFinite(estimate?.quota) ? estimate.quota : null;
  } catch {
    // The exact origin allowance is optional; the archive byte count remains available.
  }
  return {
    records,
    archiveBytes,
    presentCount: records.length,
    entryCount: records.reduce((total, record) => total + record.entries, 0),
    portableCount: records.filter((record) => record.portable && record.storage === "local").length,
    originUsage,
    originQuota,
  };
}

async function sha256(value) {
  if (!window.crypto?.subtle) return null;
  const digest = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function createLocalArchive() {
  const records = collectLocalRecords({ includeEmpty: false })
    .filter((record) => record.portable && record.storage === "local")
    .map((record) => ({
      key: record.key,
      storage: "local",
      value: record.raw,
    }));
  const payload = {
    format: LOCAL_ARCHIVE_FORMAT,
    version: LOCAL_ARCHIVE_VERSION,
    exportedAt: new Date().toISOString(),
    origin: window.location.origin,
    records,
  };
  const digest = await sha256(JSON.stringify(payload));
  return {
    ...payload,
    checksum: digest ? `sha256:${digest}` : null,
  };
}

function archiveError(code, detail = "") {
  const error = new Error(code);
  error.code = code;
  error.detail = detail;
  return error;
}

export async function parseLocalArchive(text) {
  const bytes = utf8Bytes(text);
  if (!text || bytes > LOCAL_ARCHIVE_MAX_BYTES) throw archiveError("archive-size");

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw archiveError("archive-json");
  }
  if (parsed?.format !== LOCAL_ARCHIVE_FORMAT || parsed?.version !== LOCAL_ARCHIVE_VERSION) {
    throw archiveError("archive-format");
  }
  if (!Array.isArray(parsed.records) || parsed.records.length > 500) throw archiveError("archive-records");

  const seen = new Set();
  const records = parsed.records.map((record) => {
    const metadata = knownRecords.get(record?.key);
    if (
      !record
      || typeof record.key !== "string"
      || !record.key.startsWith("tu:")
      || record.key.length > 160
      || record.storage !== "local"
      || typeof record.value !== "string"
      || utf8Bytes(record.value) > LOCAL_ARCHIVE_MAX_BYTES
      || seen.has(record.key)
    ) {
      throw archiveError("archive-record", record?.key || "");
    }
    if (metadata?.encoding === "json") {
      try {
        JSON.parse(record.value);
      } catch {
        throw archiveError("archive-record", record.key);
      }
    }
    seen.add(record.key);
    return {
      ...record,
      known: Boolean(metadata),
      conflict: browserStorage("local")?.getItem(record.key) !== null,
      portable: metadata?.portable !== false,
      bytes: utf8Bytes(record.key) + utf8Bytes(record.value),
    };
  });

  if (parsed.checksum) {
    if (!/^sha256:[a-f0-9]{64}$/.test(parsed.checksum)) throw archiveError("archive-checksum");
    const { checksum, ...payload } = parsed;
    const digest = await sha256(JSON.stringify(payload));
    if (!digest || checksum !== `sha256:${digest}`) throw archiveError("archive-checksum");
  }

  return {
    ...parsed,
    records,
    bytes,
    conflicts: records.filter((record) => record.conflict).length,
    unknown: records.filter((record) => !record.known).length,
    blocked: records.filter((record) => !record.portable).length,
  };
}

function emitArchiveChange(detail) {
  window.dispatchEvent(new CustomEvent("tu:archivechange", { detail }));
}

export function removeLocalRecord(key, storageName = "local") {
  if (!String(key).startsWith("tu:")) return false;
  const storage = browserStorage(storageName);
  if (!storage || storage.getItem(key) === null) return false;
  storage.removeItem(key);
  emitArchiveChange({ type: "removed", key, storage: storageName });
  return true;
}

export function removeLocalRecords(records) {
  let removed = 0;
  for (const record of records) {
    if (removeLocalRecord(record.key, record.storage)) removed += 1;
  }
  emitArchiveChange({ type: "removed-many", removed });
  return removed;
}

export function clearTouhouLocalData() {
  const records = collectLocalRecords({ includeEmpty: false });
  const removed = removeLocalRecords(records);
  emitArchiveChange({ type: "cleared", removed });
  return removed;
}

export function importLocalArchive(archive, { collision = "preserve" } = {}) {
  if (!archive?.records || !["preserve", "overwrite"].includes(collision)) {
    throw archiveError("archive-import");
  }
  const storage = browserStorage("local");
  if (!storage) throw archiveError("archive-storage");

  const candidates = archive.records.filter((record) => record.portable);
  const changes = [];
  const skipped = [];
  for (const record of candidates) {
    const previous = storage.getItem(record.key);
    if (previous !== null && collision === "preserve") {
      skipped.push(record.key);
      continue;
    }
    changes.push({ key: record.key, value: record.value, previous });
  }

  try {
    changes.forEach((record) => storage.setItem(record.key, record.value));
  } catch (error) {
    changes.forEach((record) => {
      if (record.previous === null) storage.removeItem(record.key);
      else storage.setItem(record.key, record.previous);
    });
    throw archiveError("archive-quota", error?.message || "");
  }

  const result = {
    imported: changes.length,
    skipped: skipped.length,
    blocked: archive.records.length - candidates.length,
  };
  emitArchiveChange({ type: "imported", ...result });
  return result;
}

export function localRecordMetadata(key) {
  return knownRecords.get(key) || null;
}
