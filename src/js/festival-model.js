import {
  festivalAidPlan,
  festivalFairyZone,
  festivalFoodCourt,
  festivalGatePlan,
  festivalIncident,
  festivalIncidentPool,
  festivalKind,
  festivalKinds,
  festivalLocalized,
  festivalMusicPlan,
  festivalPower,
  festivalPressPlan,
  festivalReviewDesks,
  festivalRoute,
  festivalStage,
} from "../data/festival.js";
import { campusLunarPhase } from "../data/campus-time.js";
import { liveCampusSnapshot } from "../data/live-campus.js";

const DRAFT_KEY = "tu:festival:draft";
const PLAN_KEY = "tu:festival:plans";
const OPERATION_KEY = "tu:festival:operations";
const MAX_RECORDS = 40;
const l = (zhHant, ja, en) => ({ "zh-Hant": zhHant, ja, en });

const outcomeLabels = Object.freeze({
  cleared: l("准予開祭", "開祭許可", "Cleared to open"),
  conditional: l("附條件許可", "条件付許可", "Conditional permit"),
  contested: l("爭議性許可", "係争許可", "Contested permit"),
  revision: l("退回重排", "再編成要求", "Return for replanning"),
  live: l("祭典運行中", "祭典運行中", "Festival live"),
  closed: l("已結祭", "閉祭済み", "Festival closed"),
});

const stanceLabels = Object.freeze({
  clear: l("放行", "通行", "Clear"),
  condition: l("條件", "条件", "Condition"),
  contest: l("異議", "異議", "Contest"),
  revise: l("退回", "差戻し", "Revise"),
});

function storage() {
  return typeof window === "undefined" ? null : window.localStorage;
}

function readJson(key, fallback) {
  try {
    const value = JSON.parse(storage()?.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  storage()?.setItem(key, JSON.stringify(value));
}

function emit(action, detail = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("tu:festivalchange", { detail: { action, ...detail } }));
}

function text(value, maximum = 1200) {
  return String(value ?? "").trim().slice(0, maximum);
}

function dateValue(value, fallback = new Date().toISOString()) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
}

function known(value, records, fallback) {
  return records.some(({ id }) => id === value) ? value : fallback;
}

function hashValue(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function makeId(prefix, now, sequence) {
  return `${prefix}-${now.getTime().toString(36).toUpperCase()}-${String(sequence).padStart(2, "0")}`;
}

function firstAprilFullMoon(now = new Date()) {
  const year = now.getMonth() > 3 ? now.getFullYear() + 1 : now.getFullYear();
  for (let day = 1; day <= 30; day += 1) {
    const candidate = new Date(year, 3, day, 18, 0, 0, 0);
    if (campusLunarPhase(candidate) === 4) return candidate;
  }
  return new Date(year, 3, 8, 18, 0, 0, 0);
}

export function defaultFestivalDraft(now = new Date()) {
  return {
    schema: 1,
    kindId: "spring-lantern",
    title: "",
    startsAt: firstAprilFullMoon(now).toISOString(),
    routeId: "three-faith-loop",
    stageId: "lake-bank",
    altitude: 45,
    density: 3,
    cueSeconds: 2.2,
    visitorCapacity: 480,
    powerId: "mixed-grid",
    foodCourtId: "village-court",
    fairyZoneId: "lake-lawn",
    aidPlanId: "dual-station",
    gatePlanId: "rotating",
    pressPlanId: "aya-live",
    musicPlanId: "prismriver-evening",
    rainPlan: true,
    debrisCrew: true,
    independentCounter: true,
    stopRule: "三次木鐘、紅白燈同亮，所有符卡立即停止，最近的值班者先開退路再問理由。",
    rainRule: "雨線越過朱繩或能見度低於兩座燈籠時，熄滅低空光路並轉入屋簷節目。",
    accessibilityNote: "地面保留無閃光路線；大型翼展由山側分流，精神感知者可領取低刺激節目表。",
    organiserNote: "",
    updatedAt: now.toISOString(),
  };
}

export function normalizeFestivalDraft(value = {}, now = new Date()) {
  const fallback = defaultFestivalDraft(now);
  return {
    schema: 1,
    kindId: known(value.kindId, festivalKinds, fallback.kindId),
    title: text(value.title, 140),
    startsAt: dateValue(value.startsAt, fallback.startsAt),
    routeId: festivalRoute(value.routeId).id,
    stageId: festivalStage(value.stageId).id,
    altitude: [20, 45, 80].includes(Number(value.altitude)) ? Number(value.altitude) : fallback.altitude,
    density: Math.max(1, Math.min(5, Number(value.density) || fallback.density)),
    cueSeconds: Math.max(0, Math.min(6, Number(value.cueSeconds) || 0)),
    visitorCapacity: Math.max(120, Math.min(1200, Number(value.visitorCapacity) || fallback.visitorCapacity)),
    powerId: festivalPower(value.powerId).id,
    foodCourtId: festivalFoodCourt(value.foodCourtId).id,
    fairyZoneId: festivalFairyZone(value.fairyZoneId).id,
    aidPlanId: festivalAidPlan(value.aidPlanId).id,
    gatePlanId: festivalGatePlan(value.gatePlanId).id,
    pressPlanId: festivalPressPlan(value.pressPlanId).id,
    musicPlanId: festivalMusicPlan(value.musicPlanId).id,
    rainPlan: Boolean(value.rainPlan),
    debrisCrew: Boolean(value.debrisCrew),
    independentCounter: Boolean(value.independentCounter),
    stopRule: text(value.stopRule || fallback.stopRule),
    rainRule: text(value.rainRule || fallback.rainRule),
    accessibilityNote: text(value.accessibilityNote || fallback.accessibilityNote),
    organiserNote: text(value.organiserNote),
    updatedAt: dateValue(value.updatedAt, now.toISOString()),
  };
}

export function festivalDraft() {
  return normalizeFestivalDraft(readJson(DRAFT_KEY, defaultFestivalDraft()));
}

export function saveFestivalDraft(value, now = new Date()) {
  const draft = normalizeFestivalDraft({ ...value, updatedAt: now.toISOString() }, now);
  writeJson(DRAFT_KEY, draft);
  emit("draft-saved");
  return draft;
}

export function resetFestivalDraft(now = new Date()) {
  const draft = defaultFestivalDraft(now);
  writeJson(DRAFT_KEY, draft);
  emit("draft-reset");
  return draft;
}

function deskFinding(deskId, stance, finding, conditions = []) {
  return { deskId, stance, finding, conditions };
}

function operationalMetrics(draft) {
  const startsAt = new Date(draft.startsAt);
  const route = festivalRoute(draft.routeId);
  const stage = festivalStage(draft.stageId);
  const power = festivalPower(draft.powerId);
  const food = festivalFoodCourt(draft.foodCourtId);
  const fairies = festivalFairyZone(draft.fairyZoneId);
  const aid = festivalAidPlan(draft.aidPlanId);
  const gate = festivalGatePlan(draft.gatePlanId);
  const press = festivalPressPlan(draft.pressPlanId);
  const music = festivalMusicPlan(draft.musicPlanId);
  const live = liveCampusSnapshot(startsAt);
  const phase = campusLunarPhase(startsAt);
  const hardCapacity = Math.min(route.capacity, stage.capacity, food.capacity);
  const expectedAttendance = Math.max(
    80,
    Math.min(
      draft.visitorCapacity,
      hardCapacity,
      Math.round(draft.visitorCapacity * (0.68 + press.reach * 0.05)),
    ),
  );
  const powerLoad = Math.round(
    stage.power
      + draft.density * 9
      + draft.visitorCapacity / 34
      + fairies.drift * 3
      + music.noise * 4
      + (draft.altitude === 80 ? 8 : 0),
  );
  const clinicArrivals = Math.max(
    1,
    Math.ceil(
      expectedAttendance / 120
      + draft.density * 1.5
      + ([3, 4, 5].includes(phase) ? 5 : 0)
      + music.noise
      + fairies.drift
      + stage.clinic
      - aid.capacity / 8,
    ),
  );
  const routeDelay = route.delay
    + gate.dispute * 2
    + live.activeEvents.reduce((total, event) => total + (event.severity === "high" ? 3 : 1), 0);
  return {
    startsAt: startsAt.toISOString(),
    phase,
    live,
    expectedAttendance,
    hardCapacity,
    powerLoad,
    powerCapacity: power.capacity,
    backupCapacity: power.backup,
    clinicArrivals,
    aidCapacity: aid.capacity,
    routeDelay,
    volunteers: Math.ceil(expectedAttendance / 48) + draft.density * 2 + fairies.drift,
    lanternRecovery: draft.density * 24 + fairies.drift * 7,
    endAt: new Date(startsAt.getTime() + music.endOffset * 60_000).toISOString(),
  };
}

function reimuReview(draft, metrics) {
  if (draft.cueSeconds < 1.2 || (draft.altitude === 20 && draft.density >= 4)) {
    return deskFinding(
      "reimu",
      "revise",
      l("預兆比彈幕先消失；喊停時觀眾只會看到已經發生的事。", "予兆が弾幕より先に消える。停止時に見えるのは既に起きたことだけ。", "The warning vanishes before the danmaku; by the stop signal, spectators can only see what already happened."),
      [l("把預兆延長到至少 1.2 秒，或降低低空密度。", "予兆を1.2秒以上にするか低空密度を下げる。", "Extend the cue to at least 1.2 seconds or lower low-altitude density.")],
    );
  }
  if (draft.visitorCapacity > metrics.hardCapacity) {
    return deskFinding(
      "reimu",
      draft.visitorCapacity > metrics.hardCapacity * 1.18 ? "revise" : "condition",
      l("申報人數大於路線、舞台或食堂中最窄的一處。", "申告人数が経路・舞台・食堂の最狭部を超える。", "Declared attendance exceeds the narrowest of route, stage, or food court."),
      [l(`現場同時容量以 ${metrics.hardCapacity} 為上限。`, `同時収容は${metrics.hardCapacity}を上限。`, `Cap concurrent attendance at ${metrics.hardCapacity}.`)],
    );
  }
  if (draft.stopRule.length < 20) {
    return deskFinding(
      "reimu",
      "condition",
      l("停止規則還不能印成一句現場會照做的話。", "停止規則が現場で実行できる一文になっていない。", "The stopping rule is not yet one sentence the field can follow."),
      [l("寫出訊號、誰先行動與先開哪條退路。", "合図・最初の担当・最初に開く退路を記す。", "Name the signal, first actor, and first exit to open.")],
    );
  }
  return deskFinding("reimu", "clear", l("預兆、停止與實體退路能被同一張告示說清楚。", "予兆・停止・物理退路を一枚の掲示で説明できる。", "Cue, stop, and physical exit fit on one notice."));
}

function nitoriReview(draft, metrics) {
  if (metrics.powerLoad > metrics.powerCapacity + metrics.backupCapacity) {
    return deskFinding(
      "nitori",
      "revise",
      l("主網與備援一起算仍不夠，這不是靠多貼一層河童膠帶能變出的容量。", "主系統と予備を足しても不足。河童テープを重ねても容量は増えない。", "Main and backup combined are insufficient; another layer of kappa tape does not create capacity."),
      [l("降低密度、觀眾容量或晚場負載。", "密度・来場者・夜公演負荷を下げる。", "Lower density, attendance, or evening load.")],
    );
  }
  if (draft.powerId === "mini-reactors") {
    return deskFinding(
      "nitori",
      "contest",
      l("輸出餘裕很大，試作爐卻沒有完成公開負載測試；工程桌拒絕把容量等同可靠。", "出力余裕は大きいが、試作炉は公開負荷試験未完。容量を信頼性と同一視しない。", "Output margin is large, but prototype reactors lack a public load test; capacity is not reliability."),
      [l("保留逐爐切離權與不依賴同型爐的照明備援。", "炉ごとの切離し権と異型照明予備を確保。", "Retain per-reactor isolation and lighting backup of a different type.")],
    );
  }
  if (metrics.powerLoad > metrics.powerCapacity || draft.powerId === "moriya-grid") {
    return deskFinding(
      "nitori",
      "condition",
      l("系統可運轉，但備援或供電署名會在開祭後變成主辦權問題。", "運転可能だが、予備電源や給電署名が開祭後に主催権問題となる。", "The system can run, but backup or power credit becomes an ownership question after opening."),
      [l("共同記錄每次切換，不得只保留祭典日最高輸出。", "全切替を共同記録し、祭日最高出力だけを残さない。", "Jointly record every switchover, not only the festival-day peak.")],
    );
  }
  return deskFinding("nitori", "clear", l("主網、備援、回收工具與值班人都在同一張圖上。", "主系統・予備・回収工具・当番が同じ図にある。", "Main grid, backup, recovery tools, and duty names share one diagram."));
}

function eirinReview(draft, metrics) {
  if (metrics.clinicArrivals > metrics.aidCapacity || (draft.density === 5 && draft.cueSeconds < 2)) {
    return deskFinding(
      "eirin",
      "revise",
      l("預估候診已超過急救站容量，或者最高密度沒有足夠預兆。", "予測受診が救護容量を超えるか、最高密度に十分な予兆がない。", "Expected presentations exceed medical capacity, or maximum density lacks sufficient cueing."),
      [l("增加雙站、降低密度或限制同時入場。", "二站化・密度低下・同時入場制限を行う。", "Add dual stations, reduce density, or cap concurrent entry.")],
    );
  }
  if ([3, 4, 5].includes(metrics.phase) && draft.aidPlanId !== "dual-station" && draft.visitorCapacity >= 500) {
    return deskFinding(
      "eirin",
      "condition",
      l("近滿月的大型活動只設一站，竹林轉送與波長反應會共用同一條隊伍。", "満月近くの大型行事で一站のみ。竹林搬送と波長反応が同じ列を使う。", "A large near-full-moon event with one station makes bamboo transfers and wavelength reactions share one queue."),
      [l("加設門前初篩，鈴仙不兼任交通引導。", "門前一次判定を追加し、鈴仙は交通誘導を兼任しない。", "Add gate screening; Reisen must not double as traffic guide.")],
    );
  }
  return deskFinding("eirin", "clear", l("急救容量、月相負荷與最近停止人員已一起列入。", "救護容量・月相負荷・最寄り停止担当を同時に計上。", "Medical capacity, lunar load, and nearest stopping staff are counted together."));
}

function ayaReview(draft) {
  if (draft.pressPlanId === "aya-live") {
    return deskFinding(
      "aya",
      "condition",
      l("文已預先排好「盛大開幕」；她同意保留訂正版位，沒有同意空著頭版。", "文は「盛大開幕」を組版済み。訂正版の場所は残すが、一面を空ける同意はない。", "Aya has already typeset “Grand Opening.” She agrees to reserve correction space, not to leave the front page empty."),
      [l("每份提前號外必須帶許可版本號與可見訂正欄。", "先行号外には許可版番号と可視訂正欄を付す。", "Every early extra must carry the permit version and a visible correction field.")],
    );
  }
  if (draft.pressPlanId === "notice-only") {
    return deskFinding(
      "aya",
      "contest",
      l("沒有搶跑風險，也幾乎沒有讓人里訪客得知改道的方法。", "先走りはないが、里の来訪者が迂回を知る方法もほぼない。", "There is no early-reporting risk and almost no way for village visitors to learn reroutes."),
      [l("至少指定一名會追著被搬走木板跑的通報員。", "運び去られた木札を追う広報員を最低一名指定。", "Assign at least one messenger who will chase a carried-away noticeboard.")],
    );
  }
  return deskFinding("aya", "clear", l("兩份標題互相校對；晚一鐘仍在正式開門之前。", "二見出しが相互校正し、一鐘遅れでも正式開門前。", "Two headlines check each other; one bell late is still before formal opening."));
}

function faithReview(draft) {
  const gate = festivalGatePlan(draft.gatePlanId);
  if (gate.dispute > 0) {
    return deskFinding(
      "faith",
      "contest",
      l(`${festivalLocalized(gate.claimant)}取得唯一正門後，另外兩方拒絕把它只當交通標誌。`, `${festivalLocalized(gate.claimant, "ja")}が唯一正門を得ると、他二者は交通標識だけとは認めない。`, `${festivalLocalized(gate.claimant, "en")} receives the sole gate; the other two parties refuse to treat it as mere signage.`),
      [l("把正門署名、供電、募捐與舞台時段拆成四張不同的紙。", "正門署名・給電・寄進・舞台時間を四枚へ分離。", "Separate gate credit, power, donations, and stage time into four papers.")],
    );
  }
  return deskFinding("faith", "clear", l("輪值讓每一方都能短暫宣稱唯一，並在下一鐘被實際撤回。", "輪番で各者が短時間だけ唯一を名乗り、次鐘で実際に撤回される。", "Rotation lets each party briefly claim uniqueness and actually withdraws it at the next bell."));
}

function residenceReview(draft) {
  const music = festivalMusicPlan(draft.musicPlanId);
  const fairies = festivalFairyZone(draft.fairyZoneId);
  if (draft.musicPlanId === "ghost-afterhours") {
    return deskFinding(
      "residence",
      "contest",
      l("宿舍已收到不經空氣傳播的噪音投訴；『窗戶沒震』不是共享負擔的停止規則。", "空気伝播しない騒音申立て済み。「窓が揺れない」は共有負担の停止規則ではない。", "The residence has received a noise complaint without airborne transmission; “the windows did not shake” is not a stopping rule for shared burden."),
      [l("把深夜曲目、夢境回聲與牆內照片的停止權分開列出。", "深夜曲・夢反響・壁内写真の停止権を別記。", "List separate stopping rights for late music, dream echo, and photographs inside walls.")],
    );
  }
  if (fairies.drift >= 4 || music.noise >= 2) {
    return deskFinding(
      "residence",
      "condition",
      l("場地或聲音可能離開申報位置；共同夜桌要求一名會追上去的值班者。", "会場か音が申告位置を離れ得る。共同夜机は追跡当番を要求。", "The venue or sound may leave its filed location; the night desk requires a duty person able to follow."),
      [l("每一校鐘重新確認妖精區與宿舍側聲景。", "校鐘ごとに妖精区と寮側音景を再確認。", "Reconfirm the fairy zone and residence-side soundscape every bell.")],
    );
  }
  return deskFinding("residence", "clear", l("演出在夜桌輪值結束前收束，妖精區也有可追蹤的地面。", "夜当番終了前に公演が収まり、妖精区にも追跡可能な地面がある。", "The programme ends before night duty, and the fairy zone has trackable ground."));
}

export function assessFestivalPlan(value = {}, locale = "zh-Hant") {
  const draft = normalizeFestivalDraft(value);
  const metrics = operationalMetrics(draft);
  const opinions = [
    reimuReview(draft, metrics),
    nitoriReview(draft, metrics),
    eirinReview(draft, metrics),
    ayaReview(draft),
    faithReview(draft),
    residenceReview(draft),
  ];
  let outcome = "cleared";
  if (opinions.some(({ stance }) => stance === "revise")) outcome = "revision";
  else if (opinions.some(({ stance }) => stance === "contest")) outcome = "contested";
  else if (opinions.some(({ stance }) => stance === "condition")) outcome = "conditional";
  return {
    draft,
    metrics,
    opinions,
    outcome,
    programme: buildFestivalProgramme(draft, locale),
  };
}

function normalizeOpinion(value = {}) {
  const deskId = festivalReviewDesks.some(({ id }) => id === value.deskId) ? value.deskId : festivalReviewDesks[0].id;
  const stance = stanceLabels[value.stance] ? value.stance : "revise";
  return {
    deskId,
    stance,
    finding: value.finding && typeof value.finding === "object" ? value.finding : l(text(value.finding), text(value.finding), text(value.finding)),
    conditions: Array.isArray(value.conditions) ? value.conditions.slice(0, 5) : [],
  };
}

function normalizePlan(value = {}) {
  if (!value?.id) return null;
  const assessment = assessFestivalPlan(value.draft || value);
  return {
    schema: 1,
    id: text(value.id, 120),
    createdAt: dateValue(value.createdAt),
    status: ["issued", "superseded"].includes(value.status) ? value.status : "issued",
    outcome: outcomeLabels[value.outcome] ? value.outcome : assessment.outcome,
    draft: assessment.draft,
    metrics: value.metrics && typeof value.metrics === "object" ? { ...assessment.metrics, ...value.metrics } : assessment.metrics,
    opinions: (Array.isArray(value.opinions) ? value.opinions : assessment.opinions).map(normalizeOpinion),
    programme: Array.isArray(value.programme) ? value.programme : assessment.programme,
  };
}

function normalizeResponse(value = {}) {
  const incident = festivalIncident(value.incidentId);
  const response = incident?.responses.find(({ id }) => id === value.responseId);
  if (!incident || !response) return null;
  return {
    incidentId: incident.id,
    responseId: response.id,
    resolvedAt: dateValue(value.resolvedAt),
    effects: response.effects,
  };
}

function normalizeOperation(value = {}) {
  if (!value?.id || !value?.planId) return null;
  return {
    schema: 1,
    id: text(value.id, 120),
    planId: text(value.planId, 120),
    status: ["live", "closed"].includes(value.status) ? value.status : "live",
    role: ["organiser", "volunteer", "observer"].includes(value.role) ? value.role : "volunteer",
    openedAt: dateValue(value.openedAt),
    closedAt: value.closedAt ? dateValue(value.closedAt) : null,
    scenarioIds: (Array.isArray(value.scenarioIds) ? value.scenarioIds : []).filter((id) => festivalIncident(id)).slice(0, 4),
    responses: (Array.isArray(value.responses) ? value.responses : []).map(normalizeResponse).filter(Boolean),
    report: value.report && typeof value.report === "object" ? value.report : null,
  };
}

export function festivalPlans() {
  const values = readJson(PLAN_KEY, []);
  return (Array.isArray(values) ? values : []).map(normalizePlan).filter(Boolean);
}

export function festivalPlan(id) {
  return festivalPlans().find((entry) => entry.id === id) || null;
}

export function festivalOperations() {
  const values = readJson(OPERATION_KEY, []);
  return (Array.isArray(values) ? values : []).map(normalizeOperation).filter(Boolean);
}

export function festivalOperation(id) {
  return festivalOperations().find((entry) => entry.id === id) || null;
}

export function submitFestivalPlan(value, now = new Date(), locale = "zh-Hant") {
  const assessment = assessFestivalPlan(value, locale);
  const plans = festivalPlans();
  const plan = normalizePlan({
    id: makeId("TU-FEST-P", now, plans.length + 1),
    createdAt: now.toISOString(),
    status: "issued",
    outcome: assessment.outcome,
    draft: assessment.draft,
    metrics: assessment.metrics,
    opinions: assessment.opinions,
    programme: assessment.programme,
  });
  plans.push(plan);
  writeJson(PLAN_KEY, plans.slice(-MAX_RECORDS));
  saveFestivalDraft(plan.draft, now);
  emit("plan-issued", { planId: plan.id, outcome: plan.outcome });
  return plan;
}

function scenarioIdsForPlan(plan) {
  const ids = [];
  const add = (id) => {
    if (festivalIncident(id) && !ids.includes(id)) ids.push(id);
  };
  if (plan.draft.pressPlanId === "aya-live") add("aya-early-opening");
  if (["moriya-grid", "mixed-grid", "mini-reactors"].includes(plan.draft.powerId)) add("power-votive-plaques");
  add("fairy-lantern-drift");
  if (plan.draft.musicPlanId !== "sunset-only") add("prismriver-airless-noise");
  if (plan.metrics.phase === 4) add("full-moon-book-flock");
  if (plan.metrics.live.seed % 4 === 3 || plan.draft.rainPlan) add("rain-border-pocket");
  if (plan.draft.gatePlanId !== "rotating") add("gate-claimants");
  const remaining = festivalIncidentPool
    .map(({ id }) => id)
    .filter((id) => !ids.includes(id))
    .sort((a, b) => hashValue(`${plan.id}:${a}`) - hashValue(`${plan.id}:${b}`));
  remaining.forEach(add);
  return ids.slice(0, 4);
}

export function startFestivalOperation(planId, { role = "volunteer", acknowledged = false } = {}, now = new Date()) {
  const plan = festivalPlan(planId);
  if (!plan) return { error: "missing-plan" };
  if (plan.outcome === "revision") return { error: "revision-blocked", plan };
  if (["conditional", "contested"].includes(plan.outcome) && !acknowledged) {
    return { error: "conditions-not-acknowledged", plan };
  }
  const operations = festivalOperations();
  const existing = operations.find((entry) => entry.planId === planId && entry.status === "live");
  if (existing) return { operation: existing, plan };
  const operation = normalizeOperation({
    id: makeId("TU-FEST-LIVE", now, operations.length + 1),
    planId,
    status: "live",
    role,
    openedAt: now.toISOString(),
    scenarioIds: scenarioIdsForPlan(plan),
    responses: [],
  });
  operations.push(operation);
  writeJson(OPERATION_KEY, operations.slice(-MAX_RECORDS));
  emit("festival-opened", { planId, operationId: operation.id });
  return { operation, plan };
}

export function respondFestivalIncident(operationId, incidentId, responseId, now = new Date()) {
  const operations = festivalOperations();
  const index = operations.findIndex(({ id }) => id === operationId);
  if (index < 0 || operations[index].status !== "live") return null;
  const incident = festivalIncident(incidentId);
  const response = incident?.responses.find(({ id }) => id === responseId);
  if (!incident || !response || !operations[index].scenarioIds.includes(incident.id)) return null;
  const responseRecord = normalizeResponse({
    incidentId,
    responseId,
    resolvedAt: now.toISOString(),
  });
  operations[index] = normalizeOperation({
    ...operations[index],
    responses: [...operations[index].responses.filter((entry) => entry.incidentId !== incidentId), responseRecord],
  });
  writeJson(OPERATION_KEY, operations);
  emit("incident-resolved", { operationId, incidentId, responseId });
  return operations[index];
}

function sumEffects(operation) {
  return operation.responses.reduce((total, entry) => {
    Object.entries(entry.effects || {}).forEach(([key, value]) => {
      if (typeof value === "number") total[key] = (total[key] || 0) + value;
    });
    return total;
  }, { delay: 0, attendance: 0, clinic: 0, power: 0, dispute: 0 });
}

function reportFor(operation, plan, now = new Date()) {
  const effects = sumEffects(operation);
  const unresolved = operation.scenarioIds.filter((id) => !operation.responses.some((entry) => entry.incidentId === id));
  const attendance = Math.max(0, plan.metrics.expectedAttendance + effects.attendance);
  const clinicArrivals = Math.max(0, plan.metrics.clinicArrivals + effects.clinic);
  const delay = Math.max(0, plan.metrics.routeDelay + effects.delay);
  const powerPeak = Math.max(0, plan.metrics.powerLoad + effects.power);
  const headline = effects.dispute >= 4
    ? l("境界開學祭成功產生三扇唯一正門，交通室拒絕選出最唯一的一扇", "境界開学祭、三つの唯一正門を生成。交通室は最も唯一な門を選ばず", "Boundary festival produces three sole main gates; Transit refuses to choose the solest")
    : clinicArrivals > plan.metrics.aidCapacity
      ? l("春季燈會完成閉幕，永遠亭要求把候診隊伍列入下屆節目表", "春季灯会閉幕、永遠亭は待合列を次回番組へ記載要求", "Lantern festival closes; Eientei asks next programme to list the waiting queue")
      : l("燈火按版本熄滅；未解決異議與回收燈籠一起留到明早", "灯は版どおり消灯。未解決異議と回収灯籠は明朝へ", "Lights close by version; unresolved objections and recovered lanterns wait for morning");
  return {
    createdAt: now.toISOString(),
    resolved: operation.responses.length,
    unresolved,
    attendance,
    clinicArrivals,
    delay,
    powerPeak,
    disputes: effects.dispute,
    headline,
    routeReleased: true,
  };
}

export function closeFestivalOperation(operationId, now = new Date()) {
  const operations = festivalOperations();
  const index = operations.findIndex(({ id }) => id === operationId);
  if (index < 0 || operations[index].status !== "live") return { error: "missing-operation" };
  const operation = operations[index];
  if (operation.responses.length < operation.scenarioIds.length) {
    return { error: "unresolved-incidents", operation };
  }
  const plan = festivalPlan(operation.planId);
  if (!plan) return { error: "missing-plan" };
  const report = reportFor(operation, plan, now);
  operations[index] = normalizeOperation({
    ...operation,
    status: "closed",
    closedAt: now.toISOString(),
    report,
  });
  writeJson(OPERATION_KEY, operations);
  emit("festival-closed", { operationId, planId: plan.id });
  return { operation: operations[index], plan };
}

export function activeFestivalOperation() {
  return festivalOperations().slice().reverse().find(({ status }) => status === "live") || null;
}

export function festivalRouteOverlay() {
  const operation = activeFestivalOperation();
  if (!operation) {
    return {
      active: false,
      closedModes: [],
      closedEdges: [],
      closedTransitNodes: [],
      modeDelay: {},
      edgeDelay: {},
      notices: [],
    };
  }
  const plan = festivalPlan(operation.planId);
  if (!plan) return { active: false, closedModes: [], closedEdges: [], closedTransitNodes: [], modeDelay: {}, edgeDelay: {}, notices: [] };
  const route = festivalRoute(plan.draft.routeId);
  const closedEdges = [...route.closedEdges];
  operation.responses.forEach((entry) => {
    const response = festivalIncident(entry.incidentId)?.responses.find(({ id }) => id === entry.responseId);
    if (response?.effects?.closeExtraEdge) closedEdges.push(response.effects.closeExtraEdge);
  });
  const lowAir = plan.draft.altitude === 20 && plan.draft.density >= 4;
  return {
    active: true,
    operationId: operation.id,
    planId: plan.id,
    closedModes: lowAir ? ["broom"] : [],
    closedEdges: [...new Set(closedEdges)],
    closedTransitNodes: plan.draft.density === 5 ? [festivalFoodCourt(plan.draft.foodCourtId).routeNode] : [],
    modeDelay: { tengu: 2, rabbit: plan.metrics.phase === 4 ? 3 : 0 },
    edgeDelay: Object.fromEntries(route.path.slice(0, -1).map((node, index) => [
      [node, route.path[index + 1]].sort().join("--"),
      2,
    ])),
    notices: [
      l("祭典遊行與攤位封路已加入路線計算。", "祭典行列・屋台規制を経路計算へ反映。", "Festival procession and stall closures are included in routing."),
      l(`${festivalLocalized(festivalKind(plan.draft.kindId).name)}正在運行。`, `${festivalLocalized(festivalKind(plan.draft.kindId).name, "ja")}運行中。`, `${festivalLocalized(festivalKind(plan.draft.kindId).name, "en")} is live.`),
    ],
  };
}

export function festivalClinicPressure() {
  const operation = activeFestivalOperation();
  if (!operation) return { active: false, points: 0, expected: 0 };
  const plan = festivalPlan(operation.planId);
  if (!plan) return { active: false, points: 0, expected: 0 };
  const effects = sumEffects(operation);
  const expected = Math.max(0, plan.metrics.clinicArrivals + effects.clinic);
  return {
    active: true,
    operationId: operation.id,
    points: Math.ceil(expected / 2),
    expected,
  };
}

export function buildFestivalProgramme(value, locale = "zh-Hant") {
  const draft = normalizeFestivalDraft(value);
  const start = new Date(draft.startsAt);
  const item = (offset, title, place) => ({
    at: new Date(start.getTime() + offset * 60_000).toISOString(),
    title,
    place,
  });
  const kind = festivalKind(draft.kindId);
  const stage = festivalStage(draft.stageId);
  const food = festivalFoodCourt(draft.foodCourtId);
  const fairies = festivalFairyZone(draft.fairyZoneId);
  return [
    item(-35, l("志工點名、退路步測與第四盞燈重新編號", "当番点呼・退路歩測・第四灯再番号", "Volunteer roll, exit walk, and fourth-lantern renumbering"), festivalRoute(draft.routeId).name),
    item(0, l(`${festivalLocalized(kind.name)}開門鐘`, `${festivalLocalized(kind.name, "ja")}開門鐘`, `${festivalLocalized(kind.name, "en")} opening bell`), festivalGatePlan(draft.gatePlanId).name),
    item(35, l("妖精低空試演與觀眾預兆練習", "妖精低空試演・観客予兆練習", "Fairy low-altitude rehearsal and audience cue practice"), fairies.name),
    item(80, l("夜雀食堂、河童原型攤與人里長桌", "夜雀食堂・河童試作屋台・里の長卓", "Night Sparrow kitchen, kappa prototypes, and village tables"), food.name),
    item(130, l("暮色符卡競演：每一規則都有可見出口", "黄昏スペル競演：全規則に見える出口", "Twilight spell-card exhibition: every rule has a visible exit"), stage.name),
    item(190, l("回收燈線、訂正號外與第一輪宿舍靜夜", "灯回収・訂正号外・寮の第一静夜", "Lantern recovery, correction extra, and first residence quiet watch"), festivalMusicPlan(draft.musicPlanId).name),
  ].map((entry) => ({
    ...entry,
    title: festivalLocalized(entry.title, locale),
    place: festivalLocalized(entry.place, locale),
  }));
}

export function festivalCommunityPosts(locale = "zh-Hant") {
  const plans = festivalPlans();
  const operations = festivalOperations();
  return plans.slice(-6).reverse().flatMap((plan, index) => {
    const operation = operations.find((entry) => entry.planId === plan.id);
    const kindName = festivalLocalized(festivalKind(plan.draft.kindId).name, locale);
    const outcome = festivalLocalized(outcomeLabels[plan.outcome], locale);
    const route = operation ? `festival-operation-${operation.id}` : `festival-plan-${plan.id}`;
    const base = [{
      id: `festival-permit-${plan.id}`,
      category: "notice",
      author: locale === "ja" ? "祭典共同運営室" : locale === "en" ? "Joint Festival Operations Room" : "祭典共同營運室",
      title: locale === "ja"
        ? `${kindName}：${outcome}`
        : locale === "en"
          ? `${kindName}: ${outcome}`
          : `${kindName}：${outcome}`,
      body: locale === "ja"
        ? "六つの机の条件と異議は別紙のまま。正門・電源・救護・退路を平均していません。"
        : locale === "en"
          ? "Conditions and objections from six desks remain separate. Gate, power, aid, and exits were not averaged."
          : "六桌條件與異議仍分紙保留；正門、供電、急救與退路沒有被平均。",
      replies: 11 + index,
      createdAt: plan.createdAt,
      generated: true,
      festival: true,
      festivalRoute: route,
    }];
    if (!operation) return base;
    if (operation.status === "closed" && operation.report) {
      base.unshift({
        id: `festival-report-${operation.id}`,
        category: "club",
        author: locale === "ja" ? "文々。閉祭号外" : locale === "en" ? "Bunbunmaru Closing Extra" : "文文。閉祭號外",
        title: festivalLocalized(operation.report.headline, locale),
        body: locale === "ja"
          ? `来場 ${operation.report.attendance}、救護 ${operation.report.clinicArrivals}、遅延 ${operation.report.delay}分。異議は翌朝へ繰越。`
          : locale === "en"
            ? `${operation.report.attendance} attended; ${operation.report.clinicArrivals} medical presentations; ${operation.report.delay} minutes delay. Objections carry into morning.`
            : `到場 ${operation.report.attendance}、急救 ${operation.report.clinicArrivals}、延誤 ${operation.report.delay} 分；異議留到明早。`,
        replies: 24 + operation.report.disputes,
        createdAt: operation.closedAt,
        generated: true,
        festival: true,
        festivalRoute: route,
      });
    } else {
      base.unshift({
        id: `festival-live-${operation.id}`,
        category: "notice",
        author: locale === "ja" ? "祭典現場線" : locale === "en" ? "Festival Field Wire" : "祭典現場線",
        title: locale === "ja" ? `${kindName}運行中` : locale === "en" ? `${kindName} is live` : `${kindName}運行中`,
        body: locale === "ja"
          ? `現場案件 ${operation.responses.length}/${operation.scenarioIds.length}。地図の迂回と永遠亭負荷は現在の運行票を参照。`
          : locale === "en"
            ? `Field cases ${operation.responses.length}/${operation.scenarioIds.length}. Map detours and Eientei load now read this operations slip.`
            : `現場事件 ${operation.responses.length}/${operation.scenarioIds.length}；地圖改道與永遠亭負荷正讀取這張現場執行單。`,
        replies: 17 + operation.responses.length,
        createdAt: operation.openedAt,
        generated: true,
        festival: true,
        festivalRoute: route,
      });
    }
    return base;
  });
}

export function festivalStats() {
  const plans = festivalPlans();
  const operations = festivalOperations();
  return {
    plans: plans.length,
    live: operations.filter(({ status }) => status === "live").length,
    closed: operations.filter(({ status }) => status === "closed").length,
    responses: operations.reduce((sum, operation) => sum + operation.responses.length, 0),
  };
}

export const festivalStorageKeys = Object.freeze({
  draft: DRAFT_KEY,
  plans: PLAN_KEY,
  operations: OPERATION_KEY,
});

export { outcomeLabels as festivalOutcomeLabels, stanceLabels as festivalStanceLabels };
