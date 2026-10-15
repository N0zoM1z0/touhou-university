import { text as catalogText } from "../generated/i18n/ui/property-model.js";
import {
  propertyArbiters,
  propertyDispositionLabels,
  propertyItem,
  propertyItems,
  propertyLocalized,
} from "../data/property.js";

const CLAIMS_KEY = "tu:property:claims";
const MAX_CLAIMS = 60;

export const propertyStorageKeys = Object.freeze({ claims: CLAIMS_KEY });

function readJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function validDate(value, fallback = new Date().toISOString()) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
}

function text(value, limit = 1200) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function makeId(now = new Date(), index = 1) {
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join("");
  return `TU-PA-${stamp}-${String(index).padStart(2, "0")}`;
}

function normalizeClaim(value) {
  if (!value || typeof value !== "object" || !value.id || !propertyItem(value.itemId)) return null;
  const item = propertyItem(value.itemId);
  const responseIds = item.responses.map(([id]) => id);
  return {
    schema: 1,
    id: text(value.id, 100),
    itemId: item.id,
    claimant: text(value.claimant, 100),
    relationship: ["holder", "finder", "custodian", "object", "witness", "other"].includes(value.relationship)
      ? value.relationship
      : "other",
    evidence: text(value.evidence, 1600),
    requestedDisposition: responseIds.includes(value.requestedDisposition)
      ? value.requestedDisposition
      : responseIds[0],
    acceptsObjectVoice: Boolean(value.acceptsObjectVoice),
    acceptsConditions: Boolean(value.acceptsConditions),
    status: value.status === "resolved" ? "resolved" : "hearing",
    submittedAt: validDate(value.submittedAt),
    resolvedAt: value.resolvedAt ? validDate(value.resolvedAt) : null,
    disposition: responseIds.includes(value.disposition) ? value.disposition : null,
    rulingNumber: text(value.rulingNumber, 120) || null,
  };
}

function emit(reason, detail = {}) {
  window.dispatchEvent(new CustomEvent("tu:propertychange", {
    detail: { reason, ...detail },
  }));
}

export function propertyClaims() {
  const values = readJson(CLAIMS_KEY, []);
  return (Array.isArray(values) ? values : []).map(normalizeClaim).filter(Boolean);
}

export function propertyClaim(id) {
  return propertyClaims().find((claim) => claim.id === id) || null;
}

export function submitPropertyClaim(itemId, input, now = new Date()) {
  const item = propertyItem(itemId);
  if (!item) return { error: "item" };
  const claimant = text(input?.claimant, 100);
  const evidence = text(input?.evidence, 1600);
  if (claimant.length < 2) return { error: "claimant" };
  if (evidence.length < 18) return { error: "evidence" };
  if (!input?.acceptsObjectVoice) return { error: "voice" };
  const claims = propertyClaims();
  const record = normalizeClaim({
    schema: 1,
    id: makeId(now, claims.length + 1),
    itemId: item.id,
    claimant,
    relationship: input.relationship,
    evidence,
    requestedDisposition: input.requestedDisposition,
    acceptsObjectVoice: input.acceptsObjectVoice,
    acceptsConditions: input.acceptsConditions,
    status: "hearing",
    submittedAt: now.toISOString(),
    resolvedAt: null,
    disposition: null,
  });
  writeJson(CLAIMS_KEY, [...claims, record].slice(-MAX_CLAIMS));
  emit("claim-submitted", { claimId: record.id, itemId: item.id });
  return { claim: record };
}

export function propertyOpinions(claimId) {
  const claim = propertyClaim(claimId);
  if (!claim) return [];
  const item = propertyItem(claim.itemId);
  const detailed = claim.evidence.length >= 80;
  return propertyArbiters.map((arbiter) => {
    let standing = "conditional";
    let note;
    if (arbiter.id === "kogasa") {
      standing = claim.acceptsObjectVoice ? "heard" : "returned";
      note = claim.relationship === "object"
        ? catalogText("propertyOpinions.0")
        : catalogText("propertyOpinions.0.2", { "zh-Hant": {value0: propertyLocalized(item.statement, "zh-Hant")}, "ja": {value0: propertyLocalized(item.statement, "ja")}, "en": {value0: propertyLocalized(item.statement, "en")} });
    } else if (arbiter.id === "rinnosuke") {
      standing = detailed ? "traceable" : "inspect";
      note = detailed
        ? catalogText("propertyOpinions.0.3")
        : catalogText("propertyOpinions.0.4");
    } else if (arbiter.id === "akyuu") {
      standing = "contested";
      note = catalogText("propertyOpinions.0.5", { "zh-Hant": {value0: item.jurisdictions.length}, "ja": {value0: item.jurisdictions.length}, "en": {value0: item.jurisdictions.length} });
    } else {
      standing = claim.acceptsConditions ? "appealable" : "blocked";
      note = claim.acceptsConditions
        ? catalogText("propertyOpinions.0.6")
        : catalogText("propertyOpinions.0.7");
    }
    return { ...arbiter, standing, note };
  });
}

export function resolvePropertyClaim(claimId, disposition, now = new Date()) {
  const claims = propertyClaims();
  const index = claims.findIndex((claim) => claim.id === claimId);
  if (index < 0) return { error: "claim" };
  const claim = claims[index];
  if (claim.status === "resolved") return { claim, alreadyResolved: true };
  const item = propertyItem(claim.itemId);
  if (!item.responses.some(([id]) => id === disposition)) return { error: "disposition" };
  if (!claim.acceptsConditions && disposition !== "hearing" && disposition !== "hold") return { error: "conditions" };
  const next = {
    ...claim,
    status: "resolved",
    disposition,
    resolvedAt: now.toISOString(),
    rulingNumber: `${item.code}/判/${String(propertyItems.indexOf(item) + 1).padStart(2, "0")}`,
  };
  claims[index] = next;
  writeJson(CLAIMS_KEY, claims);
  emit("claim-resolved", { claimId: next.id, itemId: next.itemId, disposition });
  return { claim: next };
}

export function propertyCommunityPosts(locale = "zh-Hant") {
  return propertyClaims()
    .filter((claim) => claim.status === "resolved")
    .slice(-4)
    .reverse()
    .map((claim, index) => {
      const item = propertyItem(claim.itemId);
      const label = propertyLocalized(propertyDispositionLabels[claim.disposition], locale);
      return {
        id: `property-${claim.id}`,
        category: "campus",
        author: catalogText("propertyCommunityPosts.0.author")[locale],
        title: locale === "ja"
          ? `${propertyLocalized(item.name, locale)}：${label}`
          : locale === "en"
            ? `${propertyLocalized(item.name, locale)}: ${label}`
            : `${propertyLocalized(item.name, locale)}：${label}`,
        body: catalogText("propertyCommunityPosts.0.body", { [locale]: locale === "ja" ? {value0: claim.rulingNumber} : locale === "en" ? {value0: claim.rulingNumber} : {value0: claim.rulingNumber} })[locale],
        createdAt: claim.resolvedAt,
        seedOrder: index,
      };
    });
}

export function propertyClaimSummary(claim, locale = "zh-Hant") {
  const item = propertyItem(claim.itemId);
  return {
    item,
    disposition: claim.disposition
      ? propertyLocalized(propertyDispositionLabels[claim.disposition], locale)
      : propertyLocalized(catalogText("propertyClaimSummary.disposition.0"), locale),
  };
}
