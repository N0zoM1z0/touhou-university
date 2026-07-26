import {
  localRecordGroups,
  localRecordKinds,
  localRecordScopes,
} from "../data/local-records.js";
import { bindImeSafeInput } from "./ime-input.js";
import { getLocale } from "./i18n.js";
import {
  clearTouhouLocalData,
  collectLocalRecords,
  createLocalArchive,
  estimateLocalArchive,
  importLocalArchive,
  parseLocalArchive,
  removeLocalRecord,
  removeLocalRecords,
} from "./local-records-model.js";
import { renderPreservingState } from "./render-state.js";
import { showToast } from "./ui.js";

const copy = {
  "zh-Hant": {
    eyebrow: "LOCAL ARCHIVES / 本機資料櫃",
    title: "這台裝置替你保管了哪些校務紙張？",
    lead: "申請、選課、借書、診療與尚未交出的草稿都在這裡逐櫃列明。平時不會上傳；需要搬家時，再由你親手封箱。",
    offline: "本機閱覽",
    offlineLead: "普通使用時，卷宗只對目前瀏覽器設定檔與這個網站來源可見。",
    origin: "目前來源",
    writtenFiles: "已有卷宗",
    entries: "內容筆數",
    used: "檔案櫃占用",
    portable: "可封箱",
    allowance: "以常見 5 MiB localStorage 額度作參考；實際限制由瀏覽器決定。",
    originEstimate: "瀏覽器回報本來源已使用 {usage}／可用 {quota}；可能包含本網站其他儲存。",
    originUnknown: "瀏覽器沒有提供本來源總額度；上方仍是本校卷宗的 UTF-8 精確估算。",
    visibility: "誰看得見這些紙？",
    visibilityLead: "「本機」不是一個雲端帳號。不同瀏覽器、無痕視窗、裝置與網站來源彼此看不到。",
    export: "一鍵封箱匯出",
    exportLead: "匯出一份帶 SHA-256 封印的 JSON。短時分頁通行條不會裝箱。",
    exporting: "正在點算頁碼…",
    exported: "本機卷宗已封箱下載。",
    import: "匯入舊檔案箱",
    importLead: "先驗封印、格式與每個鍵，再讓你決定如何處理同名卷宗；驗證失敗時不會寫入任何資料。",
    chooseFile: "選擇 JSON 檔案",
    collision: "同名卷宗處理",
    preserve: "保留目前版本（推薦）",
    overwrite: "以匯入檔覆蓋同名卷宗",
    applyImport: "確認入櫃",
    imported: "已入櫃 {imported} 份；略過 {skipped} 份同名卷宗。",
    importReady: "封印通過：{count} 份卷宗，{size}",
    importConflicts: "{count} 份與目前卷宗同名",
    importUnknown: "{count} 份尚未列入本校目錄，但保留 tu: 校務前綴",
    importBlocked: "{count} 份短時或不可攜資料將略過",
    importSource: "封箱時間 {date} · 來源 {origin}",
    importReplaceWarning: "覆蓋只處理匯入檔裡的同名卷宗，不會刪除其他資料。",
    filter: "搜尋卷宗名稱或儲存鍵",
    presentOnly: "只看已有資料",
    showCatalogue: "查看全部登錄卷宗",
    hideCatalogue: "收起空白卷宗",
    noMatch: "沒有符合條件的卷宗。也可能是慧音剛把那一頁改成昨天。",
    stored: "已寫入",
    empty: "尚未寫入",
    item: "筆",
    items: "筆",
    view: "開卷查看",
    destroy: "銷毀",
    destroyGroup: "銷毀本櫃",
    destroyAll: "銷毀全部本校資料",
    destroyOneConfirm: "確定銷毀「{title}」？這個動作無法復原；可先匯出封箱。",
    destroyGroupConfirm: "確定銷毀「{title}」內 {count} 份已有卷宗？",
    destroyAllConfirm: "確定銷毀這個瀏覽器來源下全部 Touhou University 本機資料？身分、申請、成績、草稿與短時分頁資料都會消失。",
    destroyed: "已銷毀 {count} 份本機卷宗。",
    cabinetEmpty: "目前沒有可銷毀的卷宗。",
    rawTitle: "卷宗原文",
    storageKey: "儲存鍵",
    storageKind: "保存位置",
    persistent: "localStorage · 關閉分頁後保留",
    session: "sessionStorage · 本次分頁",
    bytes: "占用空間",
    scope: "可見範圍",
    close: "合卷",
    rawWarning: "這裡顯示的是實際保存內容；分享截圖或匯出檔案前請先檢查姓名、答案與診療紀錄。",
    integrity: "河童封箱機會驗證結構與封印，但不替外界來歷不明的檔案背書。",
    error: {
      "archive-size": "檔案為空或超過 8 MiB，門衛拒絕搬運。",
      "archive-json": "這不是可讀的 JSON 檔案箱。",
      "archive-format": "封箱格式或版本不屬於本校資料櫃。",
      "archive-records": "卷宗目錄缺失或數量異常。",
      "archive-record": "至少一份卷宗的鍵、位置或內容格式不合法。",
      "archive-checksum": "SHA-256 封印不一致；檔案可能被修改或沒有完整下載。",
      "archive-import": "匯入方式不合法。",
      "archive-storage": "目前瀏覽器拒絕開啟 localStorage。",
      "archive-quota": "瀏覽器空間不足；已撤回本次匯入，原卷宗保持不變。",
      unknown: "檔案櫃暫時無法完成這個動作。",
    },
  },
  ja: {
    eyebrow: "LOCAL ARCHIVES / 端末内資料棚",
    title: "この端末は、どの学務書類を預かっている？",
    lead: "出願、履修、貸出、診療、未提出の下書きを棚ごとに示します。通常は送信されず、引っ越す時だけ自分の手で箱詰めします。",
    offline: "端末内閲覧",
    offlineLead: "通常利用では、ファイルは現在のブラウザプロファイルとこのサイトのオリジンだけから見えます。",
    origin: "現在のオリジン",
    writtenFiles: "保存済み",
    entries: "内容件数",
    used: "資料棚の使用量",
    portable: "箱詰め可能",
    allowance: "一般的な 5 MiB の localStorage 枠を目安に表示。実際の上限はブラウザが決めます。",
    originEstimate: "ブラウザ報告：このオリジンは {usage}／{quota} を使用。サイトの他の保存領域を含む場合があります。",
    originUnknown: "オリジン全体の上限は取得できません。上記は本学ファイルの UTF-8 による正確な見積りです。",
    visibility: "この紙を見られるのは誰？",
    visibilityLead: "「端末内」はクラウドアカウントではありません。別のブラウザ、シークレット窓、端末、オリジンからは見えません。",
    export: "一括箱詰め・書き出し",
    exportLead: "SHA-256 封印付き JSON を書き出します。短時間のタブ通行票は箱に入りません。",
    exporting: "頁を数えています…",
    exported: "端末内ファイルを書き出しました。",
    import: "以前の資料箱を読み込む",
    importLead: "封印、形式、各キーを先に検査し、同名ファイルの扱いを選んでから保存します。検査失敗時は何も書き込みません。",
    chooseFile: "JSON ファイルを選択",
    collision: "同名ファイルの処理",
    preserve: "現在の版を保持（推奨）",
    overwrite: "読み込み側で同名ファイルを上書き",
    applyImport: "棚へ収める",
    imported: "{imported} 件を収納、同名 {skipped} 件をスキップしました。",
    importReady: "封印確認済み：{count} 件、{size}",
    importConflicts: "{count} 件が現在のファイルと同名",
    importUnknown: "{count} 件は未登録ですが tu: 学務接頭辞を保持",
    importBlocked: "{count} 件の短時間／持出不可データをスキップ",
    importSource: "箱詰め {date} · 出所 {origin}",
    importReplaceWarning: "上書きは読込箱の同名ファイルだけを置換し、他のデータは削除しません。",
    filter: "ファイル名または保存キーを検索",
    presentOnly: "保存済みだけ表示",
    showCatalogue: "登録済み全ファイルを見る",
    hideCatalogue: "空のファイルを閉じる",
    noMatch: "条件に合うファイルはありません。慧音がその頁を昨日へ移した可能性もあります。",
    stored: "保存済み",
    empty: "未保存",
    item: "件",
    items: "件",
    view: "開いて見る",
    destroy: "廃棄",
    destroyGroup: "この棚を廃棄",
    destroyAll: "本学の全端末内データを廃棄",
    destroyOneConfirm: "「{title}」を廃棄しますか？元に戻せません。先に箱詰め書き出しができます。",
    destroyGroupConfirm: "「{title}」にある {count} 件の保存済みファイルを廃棄しますか？",
    destroyAllConfirm: "このブラウザオリジンにある Touhou University の全端末内データを廃棄しますか？身分、出願、成績、下書き、短時間タブデータも消えます。",
    destroyed: "{count} 件の端末内ファイルを廃棄しました。",
    cabinetEmpty: "廃棄できるファイルはありません。",
    rawTitle: "ファイル原文",
    storageKey: "保存キー",
    storageKind: "保存場所",
    persistent: "localStorage · タブを閉じても保持",
    session: "sessionStorage · このタブのみ",
    bytes: "使用量",
    scope: "可視範囲",
    close: "閉じる",
    rawWarning: "実際の保存内容を表示しています。スクリーンショットや書出しファイルを共有する前に、氏名・解答・診療記録を確認してください。",
    integrity: "河童箱詰め機は構造と封印を検査しますが、外界由来の不明なファイルまで保証しません。",
    error: {
      "archive-size": "ファイルが空か 8 MiB を超えたため、門衛が運搬を拒否しました。",
      "archive-json": "読める JSON 資料箱ではありません。",
      "archive-format": "資料箱の形式または版が本学資料棚に対応していません。",
      "archive-records": "ファイル目録がないか、件数が異常です。",
      "archive-record": "少なくとも一件のキー、場所、内容形式が不正です。",
      "archive-checksum": "SHA-256 封印が一致しません。変更または不完全なダウンロードの可能性があります。",
      "archive-import": "読み込み方式が不正です。",
      "archive-storage": "ブラウザが localStorage を開くことを拒否しました。",
      "archive-quota": "空き容量不足です。今回の読込を撤回し、以前のファイルを維持しました。",
      unknown: "資料棚は現在この操作を完了できません。",
    },
  },
  en: {
    eyebrow: "LOCAL ARCHIVES / ON-DEVICE RECORDS CABINET",
    title: "Which campus papers is this device keeping for you?",
    lead: "Applications, courses, loans, care, and unfinished drafts are listed shelf by shelf. Nothing is uploaded during ordinary use; when moving, you seal the box yourself.",
    offline: "On-device reading room",
    offlineLead: "During ordinary use, files are visible only to this browser profile and this site's origin.",
    origin: "Current origin",
    writtenFiles: "Stored files",
    entries: "Content entries",
    used: "Cabinet usage",
    portable: "Portable files",
    allowance: "Gauge uses a common 5 MiB localStorage allowance as a reference; the browser sets the actual limit.",
    originEstimate: "Browser estimate: this origin uses {usage} of {quota}; this may include other site storage.",
    originUnknown: "The browser did not provide an origin-wide allowance; the figure above remains an exact UTF-8 estimate of university files.",
    visibility: "Who can see these papers?",
    visibilityLead: "“On-device” is not a cloud account. Other browsers, private windows, devices, and site origins cannot see it.",
    export: "Seal and export everything",
    exportLead: "Downloads a JSON box with a SHA-256 seal. Short-lived tab passes are never packed.",
    exporting: "Counting pages…",
    exported: "The on-device archive has been sealed and downloaded.",
    import: "Import an earlier archive box",
    importLead: "The seal, format, and every key are checked before you choose what happens to name collisions. A failed validation writes nothing.",
    chooseFile: "Choose JSON file",
    collision: "Name-collision policy",
    preserve: "Keep current version (recommended)",
    overwrite: "Overwrite same-name files from import",
    applyImport: "Place in cabinet",
    imported: "Filed {imported}; skipped {skipped} same-name files.",
    importReady: "Seal passed: {count} files, {size}",
    importConflicts: "{count} share a name with a current file",
    importUnknown: "{count} are not yet catalogued but retain the tu: campus prefix",
    importBlocked: "{count} short-lived or non-portable files will be skipped",
    importSource: "Packed {date} · origin {origin}",
    importReplaceWarning: "Overwrite replaces only same-name files present in the imported box; it does not delete anything else.",
    filter: "Search file title or storage key",
    presentOnly: "Stored files only",
    showCatalogue: "Show full registered catalogue",
    hideCatalogue: "Hide blank files",
    noMatch: "No file matches. Keine may also have reassigned that page to yesterday.",
    stored: "Stored",
    empty: "Not written",
    item: "entry",
    items: "entries",
    view: "Open file",
    destroy: "Destroy",
    destroyGroup: "Destroy this shelf",
    destroyAll: "Destroy all university data",
    destroyOneConfirm: "Destroy “{title}”? This cannot be undone; you can export the archive first.",
    destroyGroupConfirm: "Destroy {count} stored files in “{title}”?",
    destroyAllConfirm: "Destroy all Touhou University data under this browser origin? Identity, applications, grades, drafts, and short-lived tab data will disappear.",
    destroyed: "Destroyed {count} on-device files.",
    cabinetEmpty: "There are no files to destroy.",
    rawTitle: "Raw file",
    storageKey: "Storage key",
    storageKind: "Storage location",
    persistent: "localStorage · retained after closing the tab",
    session: "sessionStorage · this tab only",
    bytes: "Space used",
    scope: "Visibility",
    close: "Close file",
    rawWarning: "This is the actual stored content. Check names, answers, and medical records before sharing a screenshot or exported box.",
    integrity: "The kappa packing machine validates structure and seals; it does not vouch for mysterious files from the Outside World.",
    error: {
      "archive-size": "The file is empty or exceeds 8 MiB, so the gatekeeper refused it.",
      "archive-json": "This is not a readable JSON archive box.",
      "archive-format": "The archive format or version does not belong to this cabinet.",
      "archive-records": "The file catalogue is missing or contains an unreasonable number of records.",
      "archive-record": "At least one record has an invalid key, storage location, or value.",
      "archive-checksum": "The SHA-256 seal does not match; the file may be edited or incompletely downloaded.",
      "archive-import": "The import policy is invalid.",
      "archive-storage": "This browser refused access to localStorage.",
      "archive-quota": "The browser is out of space. This import was rolled back and current files were preserved.",
      unknown: "The records cabinet cannot complete that action right now.",
    },
  },
};

const app = document.querySelector("[data-local-records-app]");
const detailDialog = document.querySelector("[data-local-record-dialog]");
const detailBody = detailDialog?.querySelector("[data-local-record-detail]");
const groupById = new Map(localRecordGroups.map((group) => [group.id, group]));
let showEmpty = false;
let query = "";
let collision = "preserve";
let pendingArchive = null;
let renderSequence = 0;

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function fill(template, values) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

function text(value, locale) {
  return value?.[locale] || value?.["zh-Hant"] || "";
}

function formatBytes(bytes, locale) {
  const value = Number(bytes) || 0;
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value / 1024)} KiB`;
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value / (1024 * 1024))} MiB`;
}

function formatDate(value, locale) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function recordMatches(record, locale) {
  if (!query.trim()) return true;
  const needle = query.trim().toLocaleLowerCase(locale);
  return `${text(record.title, locale)} ${record.key}`.toLocaleLowerCase(locale).includes(needle);
}

function visibleRecords(records, locale) {
  const dreamPresent = records.some((record) => record.group === "dream" && record.present);
  return records.filter((record) => {
    if (record.group === "dream" && !dreamPresent) return false;
    if (!showEmpty && !record.present) return false;
    return recordMatches(record, locale);
  });
}

function usageSummary(summary, locale, c) {
  const reference = 5 * 1024 * 1024;
  const percent = Math.min(100, (summary.archiveBytes / reference) * 100);
  const originLine = summary.originUsage !== null && summary.originQuota
    ? fill(c.originEstimate, {
      usage: formatBytes(summary.originUsage, locale),
      quota: formatBytes(summary.originQuota, locale),
    })
    : c.originUnknown;
  return `
    <section class="local-usage" aria-labelledby="local-usage-title">
      <div class="local-usage-head">
        <div>
          <p>STORAGE DESK / ${escapeHtml(c.used)}</p>
          <h3 id="local-usage-title">${formatBytes(summary.archiveBytes, locale)}</h3>
        </div>
        <span>${percent.toFixed(percent < 1 ? 2 : 1)}%</span>
      </div>
      <div class="local-usage-track" aria-hidden="true"><span style="width:${Math.max(percent, summary.archiveBytes ? 0.35 : 0)}%"></span></div>
      <p>${escapeHtml(c.allowance)}</p>
      <small>${escapeHtml(originLine)}</small>
    </section>`;
}

function visibilityCards(records, locale, c) {
  const activeScopes = new Set(["device", "interface"]);
  records.filter((record) => record.present).forEach((record) => activeScopes.add(record.scope));
  return `
    <section class="local-visibility">
      <header><p>VISIBILITY / ORIGIN</p><h3>${escapeHtml(c.visibility)}</h3><span>${escapeHtml(c.visibilityLead)}</span></header>
      <div>
        ${[...activeScopes].map((scope) => `
          <article>
            <b>${scope === "device" ? "LOCAL" : scope === "interface" ? "UI" : scope === "dream" ? "REVERSE" : "SESSION"}</b>
            <p>${escapeHtml(text(localRecordScopes[scope], locale))}</p>
          </article>`).join("")}
      </div>
    </section>`;
}

function importDesk(locale, c) {
  const preview = pendingArchive
    ? `
      <div class="local-import-preview">
        <strong>${escapeHtml(fill(c.importReady, {
          count: pendingArchive.records.length,
          size: formatBytes(pendingArchive.bytes, locale),
        }))}</strong>
        <p>${escapeHtml(fill(c.importSource, {
          date: formatDate(pendingArchive.exportedAt, locale),
          origin: pendingArchive.origin || "—",
        }))}</p>
        <ul>
          <li>${escapeHtml(fill(c.importConflicts, { count: pendingArchive.conflicts }))}</li>
          <li>${escapeHtml(fill(c.importUnknown, { count: pendingArchive.unknown }))}</li>
          ${pendingArchive.blocked ? `<li>${escapeHtml(fill(c.importBlocked, { count: pendingArchive.blocked }))}</li>` : ""}
        </ul>
        <button class="button button-primary" type="button" data-archive-import-apply>${escapeHtml(c.applyImport)}</button>
      </div>`
    : "";
  return `
    <section class="local-transfer-grid">
      <article class="local-export-card">
        <span class="local-transfer-mark" aria-hidden="true">封</span>
        <p>EXPORT / SHA-256</p>
        <h3>${escapeHtml(c.export)}</h3>
        <span>${escapeHtml(c.exportLead)}</span>
        <button class="button button-primary" type="button" data-archive-export>${escapeHtml(c.export)}</button>
      </article>
      <article class="local-import-card">
        <span class="local-transfer-mark" aria-hidden="true">受</span>
        <p>IMPORT / INSPECTION</p>
        <h3>${escapeHtml(c.import)}</h3>
        <span>${escapeHtml(c.importLead)}</span>
        <label class="local-file-picker">
          <span>${escapeHtml(c.chooseFile)}</span>
          <input type="file" accept=".json,application/json" data-archive-import-file>
        </label>
        <label class="local-collision-select">
          <span>${escapeHtml(c.collision)}</span>
          <select data-archive-collision>
            <option value="preserve" ${collision === "preserve" ? "selected" : ""}>${escapeHtml(c.preserve)}</option>
            <option value="overwrite" ${collision === "overwrite" ? "selected" : ""}>${escapeHtml(c.overwrite)}</option>
          </select>
        </label>
        <small>${escapeHtml(c.importReplaceWarning)}</small>
        ${preview}
      </article>
    </section>`;
}

function recordRow(record, locale, c) {
  const kind = text(localRecordKinds[record.kind], locale);
  return `
    <article class="local-record-row ${record.present ? "is-present" : "is-empty"}">
      <div class="local-record-status" aria-hidden="true">${record.present ? "●" : "○"}</div>
      <div class="local-record-main">
        <div>
          <h4>${escapeHtml(text(record.title, locale))}</h4>
          <code>${escapeHtml(record.key)}</code>
        </div>
        <p>
          <span>${escapeHtml(kind)}</span>
          <span>${record.storage === "session" ? "sessionStorage" : "localStorage"}</span>
          <span>${escapeHtml(record.present ? c.stored : c.empty)}</span>
        </p>
      </div>
      <div class="local-record-numbers">
        <strong>${record.present ? record.entries : "—"}</strong>
        <span>${record.present ? `${escapeHtml(c.items)} · ${formatBytes(record.bytes, locale)}` : escapeHtml(c.empty)}</span>
      </div>
      <div class="local-record-actions">
        <button type="button" data-record-view="${escapeHtml(record.key)}" data-record-storage="${record.storage}" ${record.present ? "" : "disabled"}>${escapeHtml(c.view)}</button>
        <button class="is-danger" type="button" data-record-delete="${escapeHtml(record.key)}" data-record-storage="${record.storage}" ${record.present ? "" : "disabled"}>${escapeHtml(c.destroy)}</button>
      </div>
    </article>`;
}

function recordShelves(records, locale, c) {
  const visible = visibleRecords(records, locale);
  const shelves = localRecordGroups.map((group) => {
    const groupRecords = visible.filter((record) => record.group === group.id);
    if (!groupRecords.length) return "";
    const present = groupRecords.filter((record) => record.present);
    const bytes = present.reduce((total, record) => total + record.bytes, 0);
    return `
      <section class="local-record-shelf" data-record-shelf="${group.id}">
        <header>
          <span aria-hidden="true">${escapeHtml(group.mark)}</span>
          <div>
            <p>${escapeHtml(text(group.title, locale))}</p>
            <h3>${present.length} / ${groupRecords.length} · ${formatBytes(bytes, locale)}</h3>
            <small>${escapeHtml(text(group.note, locale))}</small>
          </div>
          ${present.length ? `<button type="button" data-group-delete="${group.id}">${escapeHtml(c.destroyGroup)}</button>` : ""}
        </header>
        <div>${groupRecords.map((record) => recordRow(record, locale, c)).join("")}</div>
      </section>`;
  }).join("");
  return shelves || `<p class="local-record-empty">${escapeHtml(c.noMatch)}</p>`;
}

function renderMarkup(summary, locale, c) {
  const allRecords = collectLocalRecords();
  return `
    <header class="local-records-hero">
      <div>
        <p>${escapeHtml(c.eyebrow)}</p>
        <h2>${escapeHtml(c.title)}</h2>
        <span>${escapeHtml(c.lead)}</span>
      </div>
      <aside>
        <b>${escapeHtml(c.offline)}</b>
        <p>${escapeHtml(c.offlineLead)}</p>
        <small>${escapeHtml(c.origin)} · ${escapeHtml(window.location.origin)}</small>
      </aside>
    </header>
    <div class="local-records-stats">
      <article><span>${escapeHtml(c.writtenFiles)}</span><strong>${summary.presentCount}</strong></article>
      <article><span>${escapeHtml(c.entries)}</span><strong>${summary.entryCount}</strong></article>
      <article><span>${escapeHtml(c.used)}</span><strong>${formatBytes(summary.archiveBytes, locale)}</strong></article>
      <article><span>${escapeHtml(c.portable)}</span><strong>${summary.portableCount}</strong></article>
    </div>
    ${usageSummary(summary, locale, c)}
    ${visibilityCards(allRecords, locale, c)}
    ${importDesk(locale, c)}
    <section class="local-catalogue" id="local-record-catalogue" aria-labelledby="local-catalogue-title">
      <header>
        <div><p>CATALOGUE / TU:*</p><h3 id="local-catalogue-title">${escapeHtml(c.writtenFiles)}</h3></div>
        <div class="local-catalogue-tools">
          <label><span class="visually-hidden">${escapeHtml(c.filter)}</span><input type="search" value="${escapeHtml(query)}" placeholder="${escapeHtml(c.filter)}" data-record-filter data-preserve-focus="record-filter"></label>
          <button type="button" data-record-toggle-empty>${escapeHtml(showEmpty ? c.hideCatalogue : c.showCatalogue)}</button>
        </div>
      </header>
      ${recordShelves(allRecords, locale, c)}
    </section>
    <footer class="local-records-danger">
      <div><p>DEACCESSION / RED STAMP</p><strong>${escapeHtml(c.destroyAll)}</strong><span>${escapeHtml(c.integrity)}</span></div>
      <button type="button" data-archive-clear>${escapeHtml(c.destroyAll)}</button>
    </footer>`;
}

async function render({ preserveWindow = true } = {}) {
  if (!app) return;
  const sequence = ++renderSequence;
  const summary = await estimateLocalArchive();
  if (sequence !== renderSequence) return;
  const locale = getLocale();
  const c = copy[locale];
  renderPreservingState(
    app,
    () => {
      app.innerHTML = renderMarkup(summary, locale, c);
    },
    { preserveWindow },
  );
  bindControls();
}

function archiveFilename() {
  return `touhou-university-local-archive-${new Date().toISOString().slice(0, 10)}.json`;
}

function downloadArchive(archive) {
  const blob = new Blob([`${JSON.stringify(archive, null, 2)}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = archiveFilename();
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function archiveMessage(error, c) {
  return c.error[error?.code] || c.error.unknown;
}

function openRecord(key, storageName) {
  const locale = getLocale();
  const c = copy[locale];
  const record = collectLocalRecords().find((candidate) => (
    candidate.key === key && candidate.storage === storageName
  ));
  if (!record?.present || !detailBody || !detailDialog) return;
  const pretty = typeof record.value === "string"
    ? record.value
    : JSON.stringify(record.value, null, 2);
  detailBody.innerHTML = `
    <header>
      <div><p>${escapeHtml(c.rawTitle)}</p><h2>${escapeHtml(text(record.title, locale))}</h2></div>
      <button type="button" data-record-dialog-close aria-label="${escapeHtml(c.close)}">×</button>
    </header>
    <div class="local-record-detail-meta">
      <div><span>${escapeHtml(c.storageKey)}</span><code>${escapeHtml(record.key)}</code></div>
      <div><span>${escapeHtml(c.storageKind)}</span><strong>${escapeHtml(record.storage === "session" ? c.session : c.persistent)}</strong></div>
      <div><span>${escapeHtml(c.bytes)}</span><strong>${formatBytes(record.bytes, locale)}</strong></div>
      <div><span>${escapeHtml(c.scope)}</span><strong>${escapeHtml(text(localRecordScopes[record.scope], locale))}</strong></div>
    </div>
    <p class="local-record-raw-warning">${escapeHtml(c.rawWarning)}</p>
    <pre tabindex="0">${escapeHtml(pretty)}</pre>
    <footer>
      <button type="button" data-record-dialog-close>${escapeHtml(c.close)}</button>
      <button class="button button-secondary" type="button" data-detail-delete="${escapeHtml(record.key)}" data-record-storage="${record.storage}">${escapeHtml(c.destroy)}</button>
    </footer>`;
  detailBody.querySelectorAll("[data-record-dialog-close]").forEach((button) => {
    button.addEventListener("click", () => detailDialog.close());
  });
  detailBody.querySelector("[data-detail-delete]")?.addEventListener("click", () => {
    deleteOne(record);
    detailDialog.close();
  });
  detailDialog.showModal();
}

function deleteOne(record) {
  const locale = getLocale();
  const c = copy[locale];
  const title = text(record.title, locale);
  if (!window.confirm(fill(c.destroyOneConfirm, { title }))) return;
  const removed = removeLocalRecord(record.key, record.storage) ? 1 : 0;
  showToast(removed ? fill(c.destroyed, { count: removed }) : c.cabinetEmpty);
  render();
}

function bindControls() {
  const locale = getLocale();
  const c = copy[locale];
  const filter = app.querySelector("[data-record-filter]");
  bindImeSafeInput(filter, () => {
    query = filter.value;
    render();
  }, { debounce: 80 });

  app.querySelector("[data-record-toggle-empty]")?.addEventListener("click", () => {
    showEmpty = !showEmpty;
    render();
  });

  app.querySelector("[data-archive-export]")?.addEventListener("click", async (event) => {
    const button = event.currentTarget;
    button.disabled = true;
    button.textContent = c.exporting;
    try {
      downloadArchive(await createLocalArchive());
      showToast(c.exported);
    } catch (error) {
      showToast(archiveMessage(error, c));
    } finally {
      button.disabled = false;
      button.textContent = c.export;
    }
  });

  app.querySelector("[data-archive-import-file]")?.addEventListener("change", async (event) => {
    const [file] = event.currentTarget.files || [];
    if (!file) return;
    try {
      pendingArchive = await parseLocalArchive(await file.text());
      showToast(fill(c.importReady, {
        count: pendingArchive.records.length,
        size: formatBytes(pendingArchive.bytes, locale),
      }));
    } catch (error) {
      pendingArchive = null;
      showToast(archiveMessage(error, c));
    }
    render();
  });

  app.querySelector("[data-archive-collision]")?.addEventListener("change", (event) => {
    collision = event.currentTarget.value;
  });

  app.querySelector("[data-archive-import-apply]")?.addEventListener("click", () => {
    if (!pendingArchive) return;
    try {
      const result = importLocalArchive(pendingArchive, { collision });
      pendingArchive = null;
      showToast(fill(c.imported, result));
      render();
    } catch (error) {
      showToast(archiveMessage(error, c));
    }
  });

  app.querySelectorAll("[data-record-view]").forEach((button) => {
    button.addEventListener("click", () => openRecord(
      button.dataset.recordView,
      button.dataset.recordStorage,
    ));
  });

  app.querySelectorAll("[data-record-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      const record = collectLocalRecords().find((candidate) => (
        candidate.key === button.dataset.recordDelete
        && candidate.storage === button.dataset.recordStorage
      ));
      if (record) deleteOne(record);
    });
  });

  app.querySelectorAll("[data-group-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      const records = collectLocalRecords({ includeEmpty: false })
        .filter((record) => record.group === button.dataset.groupDelete);
      const group = groupById.get(button.dataset.groupDelete);
      if (!records.length || !group) return;
      if (!window.confirm(fill(c.destroyGroupConfirm, {
        title: text(group.title, locale),
        count: records.length,
      }))) return;
      const removed = removeLocalRecords(records);
      showToast(fill(c.destroyed, { count: removed }));
      render();
    });
  });

  app.querySelector("[data-archive-clear]")?.addEventListener("click", () => {
    if (!collectLocalRecords({ includeEmpty: false }).length) {
      showToast(c.cabinetEmpty);
      return;
    }
    if (!window.confirm(c.destroyAllConfirm)) return;
    const removed = clearTouhouLocalData();
    pendingArchive = null;
    showToast(fill(c.destroyed, { count: removed }));
    render({ preserveWindow: false });
  });
}

export function initLocalRecords() {
  if (!app) return;
  detailDialog?.addEventListener("click", (event) => {
    if (event.target === detailDialog) detailDialog.close();
  });
  window.addEventListener("tu:languagechange", () => render());
  window.addEventListener("storage", (event) => {
    if (event.key?.startsWith("tu:")) render();
  });
  render({ preserveWindow: false });
}
