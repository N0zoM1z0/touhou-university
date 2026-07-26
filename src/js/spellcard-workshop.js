import {
  spellCues,
  spellDefenceRounds,
  spellPattern,
  spellPatterns,
  spellReviewers,
  spellSounds,
  spellVenues,
} from "../data/spellcard-workshop.js";
import {
  assessSpellcard,
  clearSpellcardDraft,
  completeSpellcardDefence,
  defenceForDesign,
  reviseSpellcardDesign,
  saveSpellcardDesign,
  saveSpellcardDraft,
  spellConditions,
  spellRulings,
  spellcardDefence,
  spellcardDefencePanel,
  spellcardDefenceQuestions,
  spellcardDefences,
  spellcardDesign,
  spellcardDesigns,
  spellcardDraft,
  spellcardStats,
  workshopConditions,
} from "./spellcard-workshop-model.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { navigateToDeepLink, registerDeepLink } from "./deep-links.js";
import { getLocale } from "./i18n.js";
import { bindImeSafeInput } from "./ime-input.js";
import { printDocument } from "./print-document.js";
import { renderPreservingState } from "./render-state.js";
import { siteHref } from "./site-router.js";
import { showToast } from "./ui.js";
import { safeDecodeFragment } from "./url-state.js";

const copy = {
  "zh-Hant": {
    eyebrow: "SPELL-CARD DESIGN + ETHICS WORKSHOP",
    title: "符卡不是一張公平分數表。",
    lead: "先親自飛過你設計的規則，再聽六方各自不同意。靈夢看退路、魔理沙看表現與重現、文看觀眾、荷取看碰撞、永琳看刺激，霧湖妖精則拒絕讓整座場地只剩警報聲。",
    notice: "今日試演條件",
    designTab: "設計與試飛",
    archiveTab: "我的符卡檔案",
    archiveCounts: "份設計／份答辯",
    sandbox: "輕量試飛沙盒",
    sandboxLead: "方向鍵或 WASD 移動；按住 Shift 低速，亦可直接拖動畫面中的自機。",
    resetFlight: "重置試飛",
    pause: "暫停",
    resume: "繼續",
    collisions: "被彈",
    grazes: "擦彈",
    declaration: "宣言預兆中",
    flight: "試飛中",
    pattern: "彈幕骨架",
    venue: "試演場地",
    cue: "視覺提示",
    sound: "聲音提示",
    name: "符卡名稱",
    namePlaceholder: "例如：星符「第七條沒有被報導的退路」",
    speed: "彈速",
    density: "同屏密度",
    symmetry: "對稱性",
    randomness: "隨機幅度",
    declarationDelay: "宣言至第一波",
    corridorWidth: "安全走廊",
    changeFrequency: "變化頻率",
    duration: "持續時間",
    flashLevel: "附加閃爍",
    seedLock: "鎖定隨機種子與碰撞版本",
    stopSignal: "保留可辨識的停止手勢",
    audienceBriefing: "演出前給觀眾不含答案的提示",
    liveConditions: "把今日月相與校園事件帶入試演",
    fieldNote: "設計備忘",
    fieldPlaceholder: "記下你故意保留的風險、尚未採用的路線，或哪一處漂亮得可疑。",
    metrics: "互相不肯合併的測量",
    corridorMetric: "有效走廊",
    projectileMetric: "彈數預算",
    workloadMetric: "碰撞負荷",
    readabilityMetric: "可讀訊號",
    expressionMetric: "表現輪廓",
    reproducibilityMetric: "重現條件",
    fatigueMetric: "刺激／疲勞",
    units: "發",
    reviews: "六方工房批註",
    approve: "可試演",
    caution: "有條件",
    object: "反對公開",
    noSingleScore: "沒有總分。把反對意見平均掉，只會得到一份沒有人真正簽過名的結論。",
    autosaved: "草稿已保存在這台裝置",
    clear: "清空工作台",
    save: "封存這一版設計",
    nameRequired: "先替符卡命名；「未命名」不能在答辯時替你回答。",
    saved: "設計已封存，六方批註沒有被互相抵銷。",
    designFile: "符卡設計檔案",
    version: "版本來源",
    firstVersion: "第一版",
    created: "封存時間",
    conditionsAtSave: "封存環境",
    revise: "以此為底改一版",
    defend: "送入公開答辯",
    print: "列印／另存 PDF",
    openBbs: "查看連動 BBS",
    noDesigns: "這台裝置還沒有封存設計；草稿仍在工作台上。",
    allDesigns: "本機版本架",
    noDefence: "尚未公開答辯",
    defended: "已有答辯",
    publicDefence: "符卡倫理公開答辯",
    defenceLead: "三名答辯者不替彼此平均意見。第三席由目前最強烈的外部反對者取得。",
    majority: "多數裁定",
    minority: "少數／保留意見",
    conditions: "紅繩條件",
    answerAll: "三問都必須留下立場；沉默會保留草稿，但不構成答辯。",
    submitDefence: "提交三問，公開裁定",
    defenceSaved: "答辯已保存；多數意見與少數意見分開入檔。",
    voteApprove: "同意",
    voteConditional: "條件同意",
    voteReject: "反對",
    selectedAnswer: "你的答辯",
    documentTitle: "符卡倫理審查與設計檔案",
    documentNote: "本檔案由目前瀏覽器中的設計與答辯紀錄生成；紅繩條件不是裝飾。",
    backDesign: "返回設計台",
  },
  ja: {
    eyebrow: "SPELL-CARD DESIGN + ETHICS WORKSHOP",
    title: "スペルカードは、一枚の公平点ではない。",
    lead: "自分の規則をまず飛び、六者の不一致を聞く。霊夢は退路、魔理沙は表現と再現、文は観客、にとりは当たり、永琳は刺激、霧の湖妖精は会場から警報以外の音が消えることに反対する。",
    notice: "本日の試演条件",
    designTab: "設計・試飛",
    archiveTab: "私のスペル記録",
    archiveCounts: "設計／答弁",
    sandbox: "軽量試飛サンドボックス",
    sandboxLead: "方向キーまたは WASD で移動。Shift で低速、画面上の自機を直接ドラッグ可能。",
    resetFlight: "試飛をリセット",
    pause: "一時停止",
    resume: "再開",
    collisions: "被弾",
    grazes: "グレイズ",
    declaration: "宣言予告中",
    flight: "試飛中",
    pattern: "弾幕骨格",
    venue: "試演会場",
    cue: "視覚予告",
    sound: "音響予告",
    name: "スペルカード名",
    namePlaceholder: "例：星符「報じられなかった第七の退路」",
    speed: "弾速",
    density: "同時密度",
    symmetry: "対称性",
    randomness: "乱数幅",
    declarationDelay: "宣言から第一波",
    corridorWidth: "安全回廊",
    changeFrequency: "変化頻度",
    duration: "持続時間",
    flashLevel: "追加点滅",
    seedLock: "乱数種と当たり版を固定",
    stopSignal: "識別可能な停止合図を残す",
    audienceBriefing: "答えなしの予告を観客へ事前提示",
    liveConditions: "本日の月相と学内事案を試演へ反映",
    fieldNote: "設計備忘",
    fieldPlaceholder: "意図して残す危険、採らなかった経路、または美しすぎて疑わしい箇所を記録。",
    metrics: "合算を拒む測定",
    corridorMetric: "有効回廊",
    projectileMetric: "弾数予算",
    workloadMetric: "当たり負荷",
    readabilityMetric: "可読信号",
    expressionMetric: "表現輪郭",
    reproducibilityMetric: "再現条件",
    fatigueMetric: "刺激／疲労",
    units: "発",
    reviews: "六者工房注記",
    approve: "試演可",
    caution: "条件付",
    object: "公開反対",
    noSingleScore: "総合点はない。反対を平均すると、誰も署名していない結論だけが残る。",
    autosaved: "下書きはこの端末に保存済み",
    clear: "作業台を空にする",
    save: "この設計版を封印",
    nameRequired: "先にスペルカードを命名してください。「無題」は答弁で代答しません。",
    saved: "設計版を保存。六者の注記は相殺されていない。",
    designFile: "スペルカード設計記録",
    version: "版の出所",
    firstVersion: "初版",
    created: "保存時刻",
    conditionsAtSave: "保存環境",
    revise: "この版から改稿",
    defend: "公開答弁へ送る",
    print: "印刷／PDF保存",
    openBbs: "連動 BBS を見る",
    noDesigns: "この端末に保存設計はまだない。下書きは作業台に残っている。",
    allDesigns: "端末内の版棚",
    noDefence: "公開答弁なし",
    defended: "答弁済み",
    publicDefence: "スペルカード倫理公開答弁",
    defenceLead: "三名は互いの意見を平均しない。第三席は現在もっとも強く反対する外部者が取る。",
    majority: "多数裁定",
    minority: "少数／留保意見",
    conditions: "赤紐条件",
    answerAll: "三問すべてに立場を残すこと。沈黙は下書きを残すが、答弁にはならない。",
    submitDefence: "三問を提出し公開裁定",
    defenceSaved: "答弁を保存。多数意見と少数意見は別々に記録された。",
    voteApprove: "同意",
    voteConditional: "条件同意",
    voteReject: "反対",
    selectedAnswer: "あなたの答弁",
    documentTitle: "スペルカード倫理審査・設計記録",
    documentNote: "本記録は現在のブラウザ内の設計・答弁から生成。赤紐条件は装飾ではない。",
    backDesign: "設計台へ戻る",
  },
  en: {
    eyebrow: "SPELL-CARD DESIGN + ETHICS WORKSHOP",
    title: "A spell card is not one fairness score.",
    lead: "Fly your own rule, then hear six incompatible reviews. Reimu watches exits, Marisa expression and reproducibility, Aya the audience, Nitori collision stability, Eirin stimulation, while the Misty Lake fairies refuse to let the whole venue contain nothing but alarms.",
    notice: "Today's demonstration conditions",
    designTab: "Design & test-flight",
    archiveTab: "My spell-card files",
    archiveCounts: "designs / defences",
    sandbox: "Lightweight test-flight sandbox",
    sandboxLead: "Move with arrows or WASD, hold Shift for focus speed, or drag the player directly.",
    resetFlight: "Reset flight",
    pause: "Pause",
    resume: "Resume",
    collisions: "Hits",
    grazes: "Grazes",
    declaration: "Declaration cue",
    flight: "Test flight",
    pattern: "Danmaku frame",
    venue: "Demonstration venue",
    cue: "Visual cue",
    sound: "Sound cue",
    name: "Spell-card name",
    namePlaceholder: "Example: Star Sign “The Seventh Exit the Paper Missed”",
    speed: "Shot speed",
    density: "On-screen density",
    symmetry: "Symmetry",
    randomness: "Random variation",
    declarationDelay: "Declaration to wave one",
    corridorWidth: "Safe corridor",
    changeFrequency: "Change frequency",
    duration: "Duration",
    flashLevel: "Added flashing",
    seedLock: "Lock random seed and collision version",
    stopSignal: "Retain a recognisable stop signal",
    audienceBriefing: "Give the audience a solution-free cue beforehand",
    liveConditions: "Bring today's moon and campus incidents into the test",
    fieldNote: "Design memorandum",
    fieldPlaceholder: "Record an intentionally retained risk, a route not taken, or the part that looks suspiciously beautiful.",
    metrics: "Measurements that refuse to merge",
    corridorMetric: "Effective corridor",
    projectileMetric: "Shot budget",
    workloadMetric: "Collision load",
    readabilityMetric: "Readable signal",
    expressionMetric: "Expressive shape",
    reproducibilityMetric: "Reproduction",
    fatigueMetric: "Stimulus / fatigue",
    units: "shots",
    reviews: "Six workshop marginalia",
    approve: "May demonstrate",
    caution: "Conditional",
    object: "Objects to public use",
    noSingleScore: "There is no total score. Averaging objections produces a conclusion nobody actually signed.",
    autosaved: "Draft saved on this device",
    clear: "Clear the bench",
    save: "Archive this design version",
    nameRequired: "Name the spell card first. “Untitled” will not answer for you in a defence.",
    saved: "Design archived; six reviews were not allowed to cancel one another.",
    designFile: "Spell-card design file",
    version: "Version source",
    firstVersion: "First version",
    created: "Archived",
    conditionsAtSave: "Archive conditions",
    revise: "Revise from this version",
    defend: "Send to public defence",
    print: "Print / save PDF",
    openBbs: "Open linked BBS",
    noDesigns: "No design has been archived on this device. The draft remains on the bench.",
    allDesigns: "On-device version shelf",
    noDefence: "No public defence",
    defended: "Defended",
    publicDefence: "Public Spell-Card Ethics Defence",
    defenceLead: "Three examiners do not average one another. The strongest current external objection takes seat three.",
    majority: "Majority ruling",
    minority: "Minority / reserved opinion",
    conditions: "Red-cord conditions",
    answerAll: "Leave a position on all three questions. Silence preserves the draft; it is not a defence.",
    submitDefence: "Submit three answers for public ruling",
    defenceSaved: "Defence retained; majority and minority opinions entered separate fields.",
    voteApprove: "Approve",
    voteConditional: "Conditional",
    voteReject: "Object",
    selectedAnswer: "Your defence",
    documentTitle: "Spell-Card Ethics Review & Design File",
    documentNote: "Generated from design and defence records in this browser. Red-cord conditions are not decoration.",
    backDesign: "Return to design bench",
  },
};

let root;
let mode = "design";
let selectedDesignId = null;
let selectedDefenceId = null;
let currentDraft;
let draftTimer = 0;
let clockTimer = 0;
let teardownSandbox = null;
let message = "";

function localized(value, locale = getLocale()) {
  return value?.[locale] ?? value?.["zh-Hant"] ?? value ?? "";
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value, locale = getLocale()) {
  const date = new Date(value);
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function selectOptions(records, selected, locale) {
  return records.map((record) => (
    `<option value="${record.id}" ${record.id === selected ? "selected" : ""}>${escapeHtml(localized(record.name, locale))}</option>`
  )).join("");
}

function rangeField(name, label, value, minimum, maximum, step = 1) {
  return `
    <label class="spell-range">
      <span>${label}<output data-spell-output="${name}">${value}</output></span>
      <input type="range" name="${name}" min="${minimum}" max="${maximum}" step="${step}" value="${value}">
    </label>`;
}

function metricPanel(assessment, c) {
  const m = assessment.metrics;
  return `
    <div class="spell-metric-grid" data-spell-metrics>
      <article><span>${c.corridorMetric}</span><strong>${m.effectiveCorridor}%</strong></article>
      <article><span>${c.projectileMetric}</span><strong>${m.projectileBudget}<small>${c.units}</small></strong></article>
      <article><span>${c.workloadMetric}</span><strong>${m.workload}</strong></article>
      <article><span>${c.readabilityMetric}</span><strong>${m.readability}</strong></article>
      <article><span>${c.expressionMetric}</span><strong>${m.expression}</strong></article>
      <article><span>${c.reproducibilityMetric}</span><strong>${m.reproducibility}</strong></article>
      <article><span>${c.fatigueMetric}</span><strong>${m.fatigue}</strong></article>
    </div>`;
}

function reviewerPanel(assessment, locale, c) {
  return `
    <div class="spell-review-grid" data-spell-reviews>
      ${assessment.reviews.map((review, index) => {
        const reviewer = spellReviewers[review.reviewerId];
        return `
          <article class="spell-review spell-review-${review.stance} spell-review-${index + 1}">
            <header><i aria-hidden="true">${reviewer.glyph}</i><div><strong>${escapeHtml(localized(reviewer.name, locale))}</strong><span>${escapeHtml(localized(reviewer.role, locale))}</span></div><b>${c[review.stance]}</b></header>
            <p>${escapeHtml(localized(reviewer.responses[review.stance], locale))}</p>
          </article>`;
      }).join("")}
    </div>`;
}

function liveStrip(locale, c) {
  const status = workshopConditions(locale);
  const moon = ["●", "◔", "◑", "◕", "○", "◕", "◑", "◔"][status.phase] || "◌";
  return `
    <aside class="spell-live-strip" data-spell-live>
      <span>${c.notice}</span><strong>${moon} ${escapeHtml(status.dayKey)} · ${escapeHtml(status.shift)}</strong>
      <p>${escapeHtml(status.notice)}</p>
    </aside>`;
}

function shell(content, locale, c) {
  const stats = spellcardStats();
  return `
    <header class="spell-workshop-hero">
      <div>
        <p>${c.eyebrow}</p>
        <h2>${c.title}</h2>
        <span>${c.lead}</span>
      </div>
      <blockquote><b>SC / RULE 07</b>${c.noSingleScore}</blockquote>
    </header>
    ${liveStrip(locale, c)}
    <nav class="spell-workshop-tabs" aria-label="${escapeHtml(c.title)}">
      <button type="button" data-spell-tab="design" aria-pressed="${mode === "design"}"><span>01</span><strong>${c.designTab}</strong></button>
      <button type="button" data-spell-tab="archive" aria-pressed="${mode === "archive" || mode === "defence"}"><span>02</span><strong>${c.archiveTab}</strong><b>${stats.designs} / ${stats.defences} ${c.archiveCounts}</b></button>
    </nav>
    <span class="section-route-anchor" id="spellcard-records" aria-hidden="true"></span>
    <div class="spell-workshop-view" data-spell-view>${content}</div>`;
}

function designView(locale, c) {
  currentDraft = currentDraft || spellcardDraft();
  const assessment = assessSpellcard(currentDraft);
  return `
    <article class="spell-design-bench" data-spell-design-bench>
      <section class="spell-sandbox-panel">
        <header><div><p>SANDBOX / MAX 72 SHOTS</p><h3>${c.sandbox}</h3></div><span>${c.sandboxLead}</span></header>
        <div class="spell-sandbox-stage">
          <canvas data-spell-canvas tabindex="0" aria-label="${escapeHtml(c.sandboxLead)}"></canvas>
          <div class="spell-sandbox-status">
            <span data-spell-flight-state>${c.declaration}</span>
            <b>${c.collisions} <i data-spell-hits>0</i></b>
            <b>${c.grazes} <i data-spell-grazes>0</i></b>
          </div>
          <div class="spell-sandbox-actions">
            <button type="button" data-spell-reset-flight>${c.resetFlight}</button>
            <button type="button" data-spell-pause>${c.pause}</button>
          </div>
        </div>
        ${metricPanel(assessment, c)}
      </section>
      <form class="spell-design-form" data-spell-design-form>
        <header><p>DESIGN REGISTER / AUTOSAVE</p><h3>${escapeHtml(localized(assessment.pattern.name, locale))}</h3><span data-spell-pattern-note>${escapeHtml(localized(assessment.pattern.premise, locale))}</span></header>
        ${message ? `<p class="spell-message" role="status">${escapeHtml(message)}</p>` : ""}
        <label class="spell-name-field">${c.name}
          <input type="text" name="spellName" maxlength="80" value="${escapeHtml(currentDraft.spellName)}" placeholder="${escapeHtml(c.namePlaceholder)}" data-preserve-focus="spell-name">
        </label>
        <div class="spell-select-grid">
          <label>${c.pattern}<select name="patternId">${selectOptions(spellPatterns, currentDraft.patternId, locale)}</select></label>
          <label>${c.venue}<select name="venueId">${selectOptions(spellVenues, currentDraft.venueId, locale)}</select></label>
          <label>${c.cue}<select name="cueId">${selectOptions(spellCues, currentDraft.cueId, locale)}</select></label>
          <label>${c.sound}<select name="soundId">${selectOptions(spellSounds, currentDraft.soundId, locale)}</select></label>
        </div>
        <div class="spell-context-notes">
          <p data-spell-venue-note>${escapeHtml(localized(assessment.venue.note, locale))}</p>
          <p data-spell-cue-note>${escapeHtml(localized(assessment.cue.note, locale))}</p>
          <p data-spell-sound-note>${escapeHtml(localized(assessment.sound.note, locale))}</p>
        </div>
        <div class="spell-range-grid">
          ${rangeField("speed", c.speed, currentDraft.speed, 1, 5)}
          ${rangeField("density", c.density, currentDraft.density, 1, 5)}
          ${rangeField("symmetry", c.symmetry, currentDraft.symmetry, 0, 4)}
          ${rangeField("randomness", c.randomness, currentDraft.randomness, 0, 4)}
          ${rangeField("declarationDelay", c.declarationDelay, currentDraft.declarationDelay, 0.4, 3, 0.1)}
          ${rangeField("corridorWidth", c.corridorWidth, currentDraft.corridorWidth, 12, 56)}
          ${rangeField("changeFrequency", c.changeFrequency, currentDraft.changeFrequency, 1, 5)}
          ${rangeField("duration", c.duration, currentDraft.duration, 15, 90)}
          ${rangeField("flashLevel", c.flashLevel, currentDraft.flashLevel, 0, 3)}
        </div>
        <div class="spell-check-grid">
          <label><input type="checkbox" name="seedLock" ${currentDraft.seedLock ? "checked" : ""}><span>${c.seedLock}</span></label>
          <label><input type="checkbox" name="stopSignal" ${currentDraft.stopSignal ? "checked" : ""}><span>${c.stopSignal}</span></label>
          <label><input type="checkbox" name="audienceBriefing" ${currentDraft.audienceBriefing ? "checked" : ""}><span>${c.audienceBriefing}</span></label>
          <label><input type="checkbox" name="liveConditions" ${currentDraft.liveConditions ? "checked" : ""}><span>${c.liveConditions}</span></label>
        </div>
        <label class="spell-note-field">${c.fieldNote}
          <textarea name="fieldNote" rows="4" maxlength="800" placeholder="${escapeHtml(c.fieldPlaceholder)}" data-preserve-focus="spell-note">${escapeHtml(currentDraft.fieldNote)}</textarea>
        </label>
        <footer>
          <span><i aria-hidden="true">✓</i>${c.autosaved}</span>
          <button type="button" class="button button-secondary" data-spell-clear>${c.clear}</button>
          <button type="submit" class="button button-primary">${c.save} <span aria-hidden="true">→</span></button>
        </footer>
      </form>
      <section class="spell-review-board">
        <header><div><p>CONFLICTING REVIEW / 6 DESKS</p><h3>${c.reviews}</h3></div><span>${c.noSingleScore}</span></header>
        ${reviewerPanel(assessment, locale, c)}
      </section>
    </article>`;
}

function designSummary(design, locale, c, { compact = false } = {}) {
  const defence = defenceForDesign(design.id);
  return `
    <article class="spell-design-file${compact ? " is-compact" : ""}" ${compact ? "" : `id="spellcard-design-${design.id}"`} data-spell-design-file="${design.id}">
      <header>
        <div><p>${design.id}</p><h3>${escapeHtml(design.draft.spellName)}</h3><span>${escapeHtml(localized(spellPatterns.find((item) => item.id === design.draft.patternId)?.name, locale))}</span></div>
        <b>${defence ? `${c.defended} · ${escapeHtml(localized(spellRulings[defence.ruling], locale))}` : c.noDefence}</b>
      </header>
      ${compact ? "" : `
        <dl class="spell-file-meta">
          <div><dt>${c.created}</dt><dd>${formatDate(design.createdAt, locale)}</dd></div>
          <div><dt>${c.version}</dt><dd>${design.revisionOf || c.firstVersion}</dd></div>
          <div><dt>${c.conditionsAtSave}</dt><dd>${escapeHtml(design.live?.dayKey || "—")} · ${escapeHtml(localized(spellVenues.find((item) => item.id === design.draft.venueId)?.name, locale))}</dd></div>
        </dl>
        ${metricPanel({ metrics: design.metrics }, c)}
        <section class="spell-file-reviews"><h4>${c.reviews}</h4>${reviewerPanel({ reviews: design.reviews }, locale, c)}</section>
        <blockquote>${escapeHtml(design.draft.fieldNote || localized(spellPatterns.find((item) => item.id === design.draft.patternId)?.premise, locale))}</blockquote>
        <footer data-print-exclude>
          <button type="button" class="button button-secondary" data-spell-revise="${design.id}">${c.revise}</button>
          <button type="button" class="button button-primary" data-spell-defend="${defence?.id || design.id}">${defence ? c.defended : c.defend} <span aria-hidden="true">→</span></button>
          <button type="button" class="spell-paper-button" data-spell-print="${design.id}">${c.print}</button>
        </footer>`}
    </article>`;
}

function archiveView(locale, c) {
  const designs = spellcardDesigns().slice().reverse();
  const selected = selectedDesignId ? spellcardDesign(selectedDesignId) : designs[0];
  return `
    <section class="spell-archive">
      <header><div><p>LOCAL VERSION SHELF</p><h3>${c.allDesigns}</h3></div><span>${designs.length} ${c.archiveCounts}</span></header>
      ${designs.length ? `
        <div class="spell-version-shelf" data-preserve-scroll="spell-version-shelf">
          ${designs.map((design) => `<button type="button" data-spell-open-design="${design.id}" aria-pressed="${selected?.id === design.id}"><span>${design.id}</span><strong>${escapeHtml(design.draft.spellName)}</strong><small>${formatDate(design.createdAt, locale)}</small></button>`).join("")}
        </div>
        ${selected ? designSummary(selected, locale, c) : ""}`
        : `<p class="spell-empty">${c.noDesigns}</p>`}
    </section>`;
}

function panelHeader(panel, locale, c) {
  return `
    <div class="spell-defence-panel">
      ${panel.map((id, index) => {
        const reviewer = spellReviewers[id];
        return `<article><i>${reviewer.glyph}</i><span>0${index + 1}</span><strong>${escapeHtml(localized(reviewer.name, locale))}</strong><small>${escapeHtml(localized(reviewer.role, locale))}</small></article>`;
      }).join("")}
    </div>
    <p class="spell-defence-lead">${c.defenceLead}</p>`;
}

function defenceQuestion(round, key, locale, c, selected = "") {
  return `
    <fieldset class="spell-defence-round">
      <legend><span>${escapeHtml(localized(round.role, locale))}</span><strong>${escapeHtml(localized(round.prompt, locale))}</strong></legend>
      <div>
        ${round.choices.map((choice) => `
          <label>
            <input type="radio" name="${key}" value="${choice.id}" ${choice.id === selected ? "checked" : ""}>
            <span><strong>${escapeHtml(localized(choice.label, locale))}</strong><small>${escapeHtml(localized(choice.note, locale))}</small></span>
          </label>`).join("")}
      </div>
    </fieldset>`;
}

function defenceResult(record, design, locale, c) {
  const rounds = spellcardDefenceQuestions(design);
  const panel = record.panel;
  const answerKeys = ["rule", "reproducibility", "external"];
  const dissent = record.dissentReviewerId ? spellReviewers[record.dissentReviewerId] : null;
  return `
    <article class="spell-defence-record" id="spellcard-defence-${record.id}" data-spell-defence-record="${record.id}">
      <header>
        <div><p>${c.documentTitle} · ${record.id}</p><h3>${escapeHtml(design.draft.spellName)}</h3><span>${formatDate(record.createdAt, locale)}</span></div>
        <b class="spell-ruling spell-ruling-${record.ruling}">${escapeHtml(localized(spellRulings[record.ruling], locale))}</b>
      </header>
      ${panelHeader(panel, locale, c)}
      <section class="spell-vote-record">
        <h4>${c.majority}</h4>
        ${record.votes.map((item) => {
          const reviewer = spellReviewers[item.reviewerId];
          const label = item.vote === "approve" ? c.voteApprove : item.vote === "conditional" ? c.voteConditional : c.voteReject;
          return `<p><strong>${escapeHtml(localized(reviewer.name, locale))}</strong><span>${label}</span></p>`;
        }).join("")}
      </section>
      <section class="spell-answer-record">
        ${rounds.map((round, index) => {
          const answer = round.choices.find((choice) => choice.id === record.answers[answerKeys[index]]);
          return `<article><span>0${index + 1} · ${c.selectedAnswer}</span><strong>${escapeHtml(localized(answer?.label, locale))}</strong><p>${escapeHtml(localized(answer?.note, locale))}</p></article>`;
        }).join("")}
      </section>
      <section class="spell-condition-record">
        <h4>${c.conditions}</h4>
        <ol>${record.conditionIds.map((id) => `<li>${escapeHtml(localized(spellConditions[id], locale))}</li>`).join("") || `<li>${escapeHtml(localized(spellConditions.version, locale))}</li>`}</ol>
      </section>
      <blockquote class="spell-dissent">
        <span>${c.minority}</span>
        <strong>${dissent ? escapeHtml(localized(dissent.name, locale)) : escapeHtml(localized(spellReviewers.fairies.name, locale))}</strong>
        <p>${dissent
          ? escapeHtml(localized(dissent.responses[design.reviews.find((item) => item.reviewerId === record.dissentReviewerId)?.stance || "caution"], locale))
          : escapeHtml(localized(spellReviewers.fairies.responses.caution, locale))}</p>
      </blockquote>
      <p class="spell-document-note">${c.documentNote}</p>
      <footer data-print-exclude>
        <button type="button" class="button button-secondary" data-spell-open-design="${design.id}">${c.designFile}</button>
        <button type="button" class="button button-primary" data-spell-print="${design.id}" data-spell-print-defence="${record.id}">${c.print}</button>
        <a class="spell-paper-button" href="${siteHref("bbs")}">${c.openBbs}</a>
      </footer>
    </article>`;
}

function defenceView(locale, c) {
  const completed = selectedDefenceId ? spellcardDefence(selectedDefenceId) : null;
  const design = spellcardDesign(completed?.designId || selectedDesignId);
  if (!design) return `<p class="spell-empty">${c.noDesigns}</p>`;
  if (completed) return defenceResult(completed, design, locale, c);
  const existing = defenceForDesign(design.id);
  if (existing) {
    selectedDefenceId = existing.id;
    return defenceResult(existing, design, locale, c);
  }
  const panel = spellcardDefencePanel(design);
  const rounds = spellcardDefenceQuestions(design);
  return `
    <article class="spell-defence-dais" id="spellcard-defence-${design.id}">
      <header><div><p>PUBLIC VIVA / THREE SEATS</p><h3>${c.publicDefence}</h3></div><strong>${escapeHtml(design.draft.spellName)}</strong></header>
      ${panelHeader(panel, locale, c)}
      ${message ? `<p class="spell-message" role="status">${escapeHtml(message)}</p>` : ""}
      <form data-spell-defence-form="${design.id}">
        ${defenceQuestion(rounds[0], "rule", locale, c)}
        ${defenceQuestion(rounds[1], "reproducibility", locale, c)}
        ${defenceQuestion(rounds[2], "external", locale, c)}
        <footer><span>${c.answerAll}</span><button type="submit" class="button button-primary">${c.submitDefence} <span aria-hidden="true">→</span></button></footer>
      </form>
    </article>`;
}

function render({ preserveWindow = true } = {}) {
  if (!root) return;
  teardownSandbox?.();
  teardownSandbox = null;
  const locale = getLocale();
  const c = copy[locale] || copy["zh-Hant"];
  const content = mode === "design" ? designView(locale, c) : mode === "defence" ? defenceView(locale, c) : archiveView(locale, c);
  renderPreservingState(root, () => {
    root.innerHTML = shell(content, locale, c);
  }, { preserveWindow });
  bindControls();
  if (mode === "design") {
    const canvas = root.querySelector("[data-spell-canvas]");
    if (canvas) teardownSandbox = startSandbox(canvas, () => assessSpellcard(currentDraft), c);
  }
}

function formDraft(form) {
  const data = new FormData(form);
  return {
    ...currentDraft,
    spellName: data.get("spellName"),
    patternId: data.get("patternId"),
    venueId: data.get("venueId"),
    cueId: data.get("cueId"),
    soundId: data.get("soundId"),
    speed: data.get("speed"),
    density: data.get("density"),
    symmetry: data.get("symmetry"),
    randomness: data.get("randomness"),
    declarationDelay: data.get("declarationDelay"),
    corridorWidth: data.get("corridorWidth"),
    changeFrequency: data.get("changeFrequency"),
    duration: data.get("duration"),
    flashLevel: data.get("flashLevel"),
    seedLock: data.has("seedLock"),
    stopSignal: data.has("stopSignal"),
    audienceBriefing: data.has("audienceBriefing"),
    liveConditions: data.has("liveConditions"),
    fieldNote: data.get("fieldNote"),
  };
}

function scheduleDraftSave() {
  window.clearTimeout(draftTimer);
  draftTimer = window.setTimeout(() => {
    currentDraft = saveSpellcardDraft(currentDraft);
  }, 180);
}

function updateWorkbench(form) {
  currentDraft = formDraft(form);
  scheduleDraftSave();
  const locale = getLocale();
  const c = copy[locale] || copy["zh-Hant"];
  const assessment = assessSpellcard(currentDraft);
  const metric = root.querySelector("[data-spell-metrics]");
  const reviews = root.querySelector("[data-spell-reviews]");
  if (metric) metric.outerHTML = metricPanel(assessment, c);
  if (reviews) reviews.outerHTML = reviewerPanel(assessment, locale, c);
  const notes = {
    "[data-spell-pattern-note]": localized(assessment.pattern.premise, locale),
    "[data-spell-venue-note]": localized(assessment.venue.note, locale),
    "[data-spell-cue-note]": localized(assessment.cue.note, locale),
    "[data-spell-sound-note]": localized(assessment.sound.note, locale),
  };
  Object.entries(notes).forEach(([selector, value]) => {
    const target = root.querySelector(selector);
    if (target) target.textContent = value;
  });
  form.querySelectorAll("[data-spell-output]").forEach((output) => {
    output.textContent = form.elements[output.dataset.spellOutput]?.value || "";
  });
}

function setStaticMode(nextMode, hash) {
  mode = nextMode;
  selectedDesignId = null;
  selectedDefenceId = null;
  message = "";
  render({ preserveWindow: false });
  navigateToDeepLink(hash);
}

function finishDesign(record, c) {
  recordCampusEvent(
    "spellcard.design.saved",
    {
      designId: record.id,
      spellName: record.draft.spellName,
      patternId: record.draft.patternId,
      revisionOf: record.revisionOf,
    },
    { id: `spellcard.design.saved:${record.id}`, timestamp: record.createdAt },
  );
  selectedDesignId = record.id;
  mode = "archive";
  message = "";
  navigateToDeepLink(`spellcard-design-${record.id}`);
  showToast(c.saved);
}

function finishDefence(record, design, c) {
  recordCampusEvent(
    "spellcard.defence.completed",
    {
      defenceId: record.id,
      designId: design.id,
      spellName: design.draft.spellName,
      ruling: record.ruling,
      dissentReviewerId: record.dissentReviewerId,
    },
    { id: `spellcard.defence.completed:${record.id}`, timestamp: record.createdAt },
  );
  selectedDesignId = design.id;
  selectedDefenceId = record.id;
  mode = "defence";
  message = "";
  navigateToDeepLink(`spellcard-defence-${record.id}`);
  showToast(c.defenceSaved);
}

function printableFile(designId, defenceId, locale, c) {
  const design = spellcardDesign(designId);
  if (!design) return null;
  const wrapper = document.createElement("article");
  wrapper.className = "spell-print-document";
  wrapper.innerHTML = `
    <header><p>TOUHOU UNIVERSITY · SC-ETHICS</p><h1>${escapeHtml(c.documentTitle)}</h1><strong>${escapeHtml(design.draft.spellName)}</strong></header>
    ${designSummary(design, locale, c)}
    ${defenceId && spellcardDefence(defenceId) ? defenceResult(spellcardDefence(defenceId), design, locale, c) : `<p>${c.noDefence}</p>`}
    <footer><p>${c.documentNote}</p><span>${formatDate(new Date().toISOString(), locale)}</span></footer>`;
  return wrapper;
}

function bindDesignForm(c) {
  const form = root.querySelector("[data-spell-design-form]");
  if (!form) return;
  const name = form.elements.spellName;
  const note = form.elements.fieldNote;
  bindImeSafeInput(name, () => updateWorkbench(form));
  bindImeSafeInput(note, () => updateWorkbench(form));
  form.querySelectorAll("select, input[type='range'], input[type='checkbox']").forEach((control) => {
    control.addEventListener("input", () => updateWorkbench(form));
    control.addEventListener("change", () => updateWorkbench(form));
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    window.clearTimeout(draftTimer);
    currentDraft = saveSpellcardDraft(formDraft(form));
    const result = saveSpellcardDesign(currentDraft);
    if (result.error === "name") {
      message = c.nameRequired;
      name.focus();
      return;
    }
    finishDesign(result.record, c);
  });
  root.querySelector("[data-spell-clear]")?.addEventListener("click", () => {
    currentDraft = clearSpellcardDraft();
    message = "";
    render();
  });
}

function bindControls() {
  const locale = getLocale();
  const c = copy[locale] || copy["zh-Hant"];
  root.querySelector('[data-spell-tab="design"]')?.addEventListener("click", () => {
    currentDraft = spellcardDraft();
    setStaticMode("design", "spellcard-workshop");
  });
  root.querySelector('[data-spell-tab="archive"]')?.addEventListener("click", () => setStaticMode("archive", "spellcard-records"));
  bindDesignForm(c);
  root.querySelectorAll("[data-spell-open-design]").forEach((button) => {
    button.addEventListener("click", () => navigateToDeepLink(`spellcard-design-${button.dataset.spellOpenDesign}`));
  });
  root.querySelectorAll("[data-spell-revise]").forEach((button) => {
    button.addEventListener("click", () => {
      currentDraft = reviseSpellcardDesign(button.dataset.spellRevise);
      setStaticMode("design", "spellcard-workshop");
    });
  });
  root.querySelectorAll("[data-spell-defend]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.spellDefend;
      const completed = spellcardDefence(id);
      navigateToDeepLink(`spellcard-defence-${completed ? completed.id : id}`);
    });
  });
  root.querySelector("[data-spell-defence-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const result = completeSpellcardDefence(form.dataset.spellDefenceForm, {
      rule: data.get("rule"),
      reproducibility: data.get("reproducibility"),
      external: data.get("external"),
    });
    if (result.error) {
      message = c.answerAll;
      render();
      return;
    }
    finishDefence(result.record, result.design, c);
  });
  root.querySelectorAll("[data-spell-print]").forEach((button) => {
    button.addEventListener("click", () => {
      const file = printableFile(button.dataset.spellPrint, button.dataset.spellPrintDefence, locale, c);
      if (file) printDocument(file, { title: `${c.documentTitle} · ${spellcardDesign(button.dataset.spellPrint)?.draft.spellName}` });
    });
  });
}

function projectilePosition(kind, index, count, time, assessment) {
  const lane = index / Math.max(1, count - 1);
  const speed = 0.055 + assessment.draft.speed * 0.018;
  const phase = (time * speed + index * 0.037) % 1;
  if (kind === "orbit") {
    const angle = lane * Math.PI * 2 + time * (0.28 + assessment.draft.randomness * 0.035) * (index % 2 ? 1 : -1);
    const radius = 0.08 + phase * 0.62;
    return { x: 0.5 + Math.cos(angle) * radius, y: 0.28 + Math.sin(angle) * radius * 0.72 };
  }
  if (kind === "fan") {
    const angle = -1.15 + lane * 2.3 + Math.sin(time + index) * assessment.draft.randomness * 0.018;
    return { x: 0.5 + Math.sin(angle) * phase * 0.68, y: 0.08 + Math.cos(angle) * phase * 0.9 };
  }
  if (kind === "lattice") {
    const columns = 9;
    const column = index % columns;
    const row = Math.floor(index / columns);
    const offset = Math.sin(time * assessment.draft.changeFrequency * 0.5 + row) * 0.045 * assessment.draft.randomness;
    return { x: 0.08 + column / (columns - 1) * 0.84 + offset, y: (phase + row * 0.13) % 1.08 - 0.04 };
  }
  if (kind === "wave") {
    const side = index % 2;
    return {
      x: side ? phase : 1 - phase,
      y: 0.12 + lane * 0.78 + Math.sin(time * 1.4 + index * 0.7) * 0.055,
    };
  }
  const folded = phase < 0.5 ? phase * 2 : 2 - phase * 2;
  return {
    x: (index % 2 ? folded : 1 - folded),
    y: 0.08 + lane * 0.84 + Math.sin(time + index) * 0.02 * assessment.draft.randomness,
  };
}

function startSandbox(canvas, assessmentGetter, c) {
  const context = canvas.getContext("2d", { alpha: false });
  const player = { x: 0.5, y: 0.82 };
  const keys = new Set();
  let hits = 0;
  let grazes = 0;
  let lastHit = 0;
  let lastGraze = 0;
  let started = performance.now();
  let lastFrame = 0;
  let manuallyPaused = false;
  let visible = true;
  let active = true;
  let frame = 0;
  let dragging = false;

  const resize = () => {
    const box = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.max(320, Math.round(box.width * ratio));
    const height = Math.max(300, Math.round(box.height * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  };

  const reset = () => {
    hits = 0;
    grazes = 0;
    player.x = 0.5;
    player.y = 0.82;
    started = performance.now();
    root.querySelector("[data-spell-hits]").textContent = "0";
    root.querySelector("[data-spell-grazes]").textContent = "0";
  };

  const moveFromPointer = (event) => {
    const box = canvas.getBoundingClientRect();
    player.x = Math.min(0.97, Math.max(0.03, (event.clientX - box.left) / box.width));
    player.y = Math.min(0.97, Math.max(0.05, (event.clientY - box.top) / box.height));
  };

  const draw = (now) => {
    if (!active) return;
    frame = window.requestAnimationFrame(draw);
    if (manuallyPaused || !visible || document.hidden || now - lastFrame < 33) return;
    const delta = Math.min(0.05, (now - lastFrame) / 1000 || 0);
    lastFrame = now;
    resize();
    const assessment = assessmentGetter();
    const elapsed = (now - started) / 1000;
    const cycle = Math.max(6, 11 - assessment.draft.changeFrequency);
    const cycleTime = elapsed % cycle;
    const declaration = cycleTime < assessment.draft.declarationDelay;
    const focus = keys.has("Shift");
    const moveSpeed = (focus ? 0.17 : 0.34) * delta;
    if (keys.has("ArrowLeft") || keys.has("a")) player.x -= moveSpeed;
    if (keys.has("ArrowRight") || keys.has("d")) player.x += moveSpeed;
    if (keys.has("ArrowUp") || keys.has("w")) player.y -= moveSpeed;
    if (keys.has("ArrowDown") || keys.has("s")) player.y += moveSpeed;
    player.x = Math.min(0.97, Math.max(0.03, player.x));
    player.y = Math.min(0.97, Math.max(0.05, player.y));

    const width = canvas.width;
    const height = canvas.height;
    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#111d2b");
    gradient.addColorStop(1, "#271b25");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "rgba(226, 197, 132, .14)";
    context.lineWidth = 1;
    for (let ring = 1; ring < 5; ring += 1) {
      context.beginPath();
      context.arc(width / 2, height * 0.28, ring * Math.min(width, height) * 0.105, 0, Math.PI * 2);
      context.stroke();
    }

    const corridor = assessment.metrics.effectiveCorridor / 100;
    const corridorCentre = 0.5 + Math.sin(elapsed * assessment.draft.changeFrequency * 0.36) * assessment.draft.randomness * 0.018;
    context.fillStyle = "rgba(224, 204, 156, .08)";
    context.fillRect((corridorCentre - corridor / 2) * width, 0, corridor * width, height);
    context.strokeStyle = "rgba(224, 204, 156, .35)";
    context.setLineDash([7, 8]);
    context.strokeRect((corridorCentre - corridor / 2) * width, 0, corridor * width, height);
    context.setLineDash([]);

    const status = root.querySelector("[data-spell-flight-state]");
    if (status) status.textContent = declaration ? c.declaration : c.flight;
    const bulletPositions = [];
    if (declaration) {
      const progress = Math.min(1, Math.max(0, cycleTime / Math.max(0.4, assessment.draft.declarationDelay)));
      context.strokeStyle = `rgba(222, 72, 82, ${0.25 + progress * 0.65})`;
      context.lineWidth = 2 + assessment.draft.flashLevel;
      context.beginPath();
      context.arc(width / 2, height * 0.28, progress * Math.min(width, height) * 0.31, 0, Math.PI * 2);
      context.stroke();
    } else {
      const count = assessment.metrics.projectileBudget;
      for (let index = 0; index < count; index += 1) {
        const point = projectilePosition(assessment.pattern.kind, index, count, elapsed, assessment);
        const inCorridor = Math.abs(point.x - corridorCentre) < corridor / 2;
        if (inCorridor) point.x += (point.x < corridorCentre ? -1 : 1) * corridor * 0.62;
        if (point.x < -0.05 || point.x > 1.05 || point.y < -0.05 || point.y > 1.05) continue;
        bulletPositions.push(point);
        const radius = 2.7 + assessment.draft.density * 0.55;
        context.fillStyle = index % 3 === 0 ? "#e9c27b" : index % 3 === 1 ? "#c84b5b" : "#7fb6cf";
        context.beginPath();
        context.arc(point.x * width, point.y * height, radius, 0, Math.PI * 2);
        context.fill();
        if (assessment.draft.flashLevel > 1) {
          context.strokeStyle = "rgba(255,255,255,.22)";
          context.beginPath();
          context.arc(point.x * width, point.y * height, radius + 3 + assessment.draft.flashLevel, 0, Math.PI * 2);
          context.stroke();
        }
      }
    }

    const px = player.x * width;
    const py = player.y * height;
    let nearest = Infinity;
    bulletPositions.forEach((point) => {
      const distance = Math.hypot(point.x * width - px, point.y * height - py);
      nearest = Math.min(nearest, distance);
    });
    if (nearest < 9 && now - lastHit > 430) {
      hits += 1;
      lastHit = now;
      root.querySelector("[data-spell-hits]").textContent = String(hits);
    } else if (nearest < 24 && now - lastGraze > 190) {
      grazes += 1;
      lastGraze = now;
      root.querySelector("[data-spell-grazes]").textContent = String(grazes);
    }

    context.fillStyle = "#fff8df";
    context.beginPath();
    context.arc(px, py, focus ? 4 : 5.5, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "#d84150";
    context.lineWidth = 2;
    context.beginPath();
    context.arc(px, py, focus ? 7 : 10, 0, Math.PI * 2);
    context.stroke();
    if (focus) {
      context.fillStyle = "#d84150";
      context.beginPath();
      context.arc(px, py, 2.1, 0, Math.PI * 2);
      context.fill();
    }
  };

  const keyDown = (event) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "w", "a", "s", "d", "Shift"].includes(event.key)) return;
    keys.add(event.key);
    if (event.key.startsWith("Arrow") || event.key === " ") event.preventDefault();
  };
  const keyUp = (event) => keys.delete(event.key);
  canvas.addEventListener("keydown", keyDown);
  canvas.addEventListener("keyup", keyUp);
  canvas.addEventListener("pointerdown", (event) => {
    dragging = true;
    canvas.setPointerCapture(event.pointerId);
    moveFromPointer(event);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (dragging) moveFromPointer(event);
  });
  canvas.addEventListener("pointerup", () => { dragging = false; });
  root.querySelector("[data-spell-reset-flight]")?.addEventListener("click", reset);
  root.querySelector("[data-spell-pause]")?.addEventListener("click", (event) => {
    manuallyPaused = !manuallyPaused;
    event.currentTarget.textContent = manuallyPaused ? c.resume : c.pause;
  });
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  }, { threshold: 0.05 });
  observer.observe(canvas);
  frame = window.requestAnimationFrame(draw);
  return () => {
    active = false;
    window.cancelAnimationFrame(frame);
    observer.disconnect();
    canvas.removeEventListener("keydown", keyDown);
    canvas.removeEventListener("keyup", keyUp);
  };
}

function initialState() {
  const route = safeDecodeFragment();
  if (route.startsWith("spellcard-design-")) {
    const id = route.slice("spellcard-design-".length);
    if (spellcardDesign(id)) {
      mode = "archive";
      selectedDesignId = id;
      return;
    }
  }
  if (route.startsWith("spellcard-defence-")) {
    const id = route.slice("spellcard-defence-".length);
    const defence = spellcardDefence(id);
    const design = defence ? spellcardDesign(defence.designId) : spellcardDesign(id);
    if (design) {
      mode = "defence";
      selectedDesignId = design.id;
      selectedDefenceId = defence?.id || null;
      return;
    }
  }
  mode = route === "spellcard-records" ? "archive" : "design";
}

function leaveFocusedSpellcardRoute({ route = "" } = {}) {
  if (/^spellcard-(?:pattern|design|defence)-/.test(route)) return;
  const nextMode = route === "spellcard-records" ? "archive" : "design";
  if (mode === nextMode && !selectedDesignId && !selectedDefenceId) return;
  mode = nextMode;
  selectedDesignId = null;
  selectedDefenceId = null;
  message = "";
  currentDraft = spellcardDraft();
  render({ preserveWindow: false });
}

export function initSpellcardWorkshop() {
  root = document.querySelector("[data-spellcard-workshop]");
  if (!root) return;
  currentDraft = spellcardDraft();
  initialState();
  render({ preserveWindow: false });
  registerDeepLink("spellcard-pattern-", {
    anchor: root,
    historyGroup: "spellcard-workshop-focus",
    position: "always",
    open(id) {
      if (!spellPattern(id)) return;
      mode = "design";
      selectedDesignId = null;
      selectedDefenceId = null;
      currentDraft = { ...currentDraft, patternId: id };
      render({ preserveWindow: false });
    },
    close: leaveFocusedSpellcardRoute,
  });
  registerDeepLink("spellcard-design-", {
    anchor: (route) => document.getElementById(route) || root,
    historyGroup: "spellcard-workshop-focus",
    position: "always",
    open(id) {
      if (!spellcardDesign(id)) return;
      mode = "archive";
      selectedDesignId = id;
      selectedDefenceId = null;
      render({ preserveWindow: false });
    },
    close: leaveFocusedSpellcardRoute,
  });
  registerDeepLink("spellcard-defence-", {
    anchor: (route) => document.getElementById(route) || root,
    historyGroup: "spellcard-workshop-focus",
    position: "always",
    open(id) {
      const defence = spellcardDefence(id);
      const design = defence ? spellcardDesign(defence.designId) : spellcardDesign(id);
      if (!design) return;
      mode = "defence";
      selectedDesignId = design.id;
      selectedDefenceId = defence?.id || null;
      render({ preserveWindow: false });
    },
    close: leaveFocusedSpellcardRoute,
  });
  window.addEventListener("tu:languagechange", () => render());
  clockTimer = window.setInterval(() => {
    const locale = getLocale();
    const c = copy[locale] || copy["zh-Hant"];
    const next = document.createElement("div");
    next.innerHTML = liveStrip(locale, c);
    root.querySelector("[data-spell-live]")?.replaceWith(next.firstElementChild);
  }, 60_000);
  window.addEventListener("pagehide", () => {
    window.clearInterval(clockTimer);
    window.clearTimeout(draftTimer);
    teardownSandbox?.();
  }, { once: true });
}
