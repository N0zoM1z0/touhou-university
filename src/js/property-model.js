import {
  propertyArbiters,
  propertyDispositionLabels,
  propertyItem,
  propertyItems,
  propertyLocalized,
} from "../data/property.js";

const CLAIMS_KEY = "tu:property:claims";
const MAX_CLAIMS = 60;
const l = (zhHant, ja, en) => ({ "zh-Hant": zhHant, ja, en });

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
        ? l(
          "申請人自稱就是物件；本席贊成先問它想去哪裡，再問誰帶了收據。",
          "申請人は物件本人。本席は領収書より先に行先を尋ねることに賛成。",
          "The claimant says they are the object; this seat asks where it wants to go before who brought a receipt.",
        )
        : l(
          `物件的「${propertyLocalized(item.statement, "zh-Hant")}」已進入聽證，不准縮成「有點舊」。`,
          `物件の陳述「${propertyLocalized(item.statement, "ja")}」は聴聞記録へ入り、「少し古い」に縮約しない。`,
          `The statement “${propertyLocalized(item.statement, "en")}” is in evidence and may not be reduced to “a bit old”.`,
        );
    } else if (arbiter.id === "rinnosuke") {
      standing = detailed ? "traceable" : "inspect";
      note = detailed
        ? l(
          "名稱、磨損與申請人的說法至少有兩處可以互相比對；用途仍不能替物件決定。",
          "名称・摩耗・申請人陳述のうち二点以上が比較可能。ただし用途を物件に代わって決めない。",
          "Name, wear, and claimant account offer at least two comparisons; use still cannot be decided for the object.",
        )
        : l(
          "這份證據像價籤：很有自信，但沒有說明磨損、時間或由誰看見。",
          "この証拠は値札のように自信満々だが、摩耗・時刻・目撃者を示さない。",
          "This evidence resembles a price tag: confident, but silent on wear, time, and witness.",
        );
    } else if (arbiter.id === "akyuu") {
      standing = "contested";
      note = l(
        `本案跨 ${item.jurisdictions.length} 種管轄；最早記錄與最漂亮的表格不是同一份。所有訂正並列保存。`,
        `本件は${item.jurisdictions.length}種の管轄に跨る。最古記録と最も整った書式は同一でない。訂正は併記保存。`,
        `This file crosses ${item.jurisdictions.length} jurisdictions. The earliest record is not the neatest form; corrections remain side by side.`,
      );
    } else {
      standing = claim.acceptsConditions ? "appealable" : "blocked";
      note = claim.acceptsConditions
        ? l(
          "可以作出附條件暫行裁定；返還不消滅物件申訴，自主去向也不免除前保管人的責任。",
          "条件付暫定裁定は可能。返還は物件の不服申立を消さず、自主行先も前保管者の責任を免除しない。",
          "A conditional interim ruling is possible. Return does not erase the object's appeal; autonomy does not erase former custodial responsibility.",
        )
        : l(
          "申請人要求結果但拒絕條件；本席不准用一次領回把保養、使用與再次遺失的責任全部抹掉。",
          "申請人は結果を求め条件を拒否。本席は一度の受取で保守・使用・再紛失責任を消すことを認めない。",
          "The claimant wants an outcome without conditions; one collection may not erase duties of care, use, and repeat loss.",
        );
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
        author: locale === "ja" ? "付喪神物権仲裁所・傍聴席" : locale === "en" ? "Tsukumogami Property Tribunal · gallery" : "付喪神物權仲裁處・旁聽席",
        title: locale === "ja"
          ? `${propertyLocalized(item.name, locale)}：${label}`
          : locale === "en"
            ? `${propertyLocalized(item.name, locale)}: ${label}`
            : `${propertyLocalized(item.name, locale)}：${label}`,
        body: locale === "ja"
          ? `${claim.rulingNumber} は結論を出したが、物件の不服申立権と阿求の訂正紙は残った。`
          : locale === "en"
            ? `${claim.rulingNumber} reached an outcome; the object's appeal and Akyuu's correction slip remain.`
            : `${claim.rulingNumber} 已有結果；物件申訴權與阿求的訂正紙都還留著。`,
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
      : propertyLocalized(l("聽證中", "聴聞中", "In hearing"), locale),
  };
}
