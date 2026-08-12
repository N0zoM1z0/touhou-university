import { mapPlaces } from "../data/services.js";
import {
  liveCampusSnapshot,
  liveDiningMenu,
  liveExamSchedule,
  liveFacilityBoard,
  liveRoomAvailability,
  liveTimetable,
} from "../data/live-campus.js";
import { schools as schoolCatalogues } from "../data/schools.js";
import { getLocale } from "./i18n.js";
import { showToast } from "./ui.js";
import { closeDeepLink, navigateToDeepLink, registerDeepLink } from "./deep-links.js";
import { recordCampusEvent } from "./campus-ledger.js";

const copy = {
  "zh-Hant": {
    application: ["ONLINE APPLICATION / 2026", "線上入學申請", "申請可分次儲存。提交後會取得一組校內受理編號。"],
    availability: ["ROOM FINDER / LIVE", "館舍空閒查詢", "依館舍查看目前可使用的教室、研討室與工房。"],
    visit: ["CAMPUS VISIT / RESERVATION", "進校預約", "選擇抵達方式與日期；外界訪客由博麗門統一核驗。"],
    dining: ["DINING / TODAY", "今日食堂菜單", "供應內容可能依採集、月相與夜雀演出時刻微調。"],
    timetable: ["ACADEMIC AFFAIRS / CLASSES", "今日排課", "共同校區課程表。場地變動會於開課前一刻鐘更新。"],
    exams: ["ACADEMIC AFFAIRS / EXAMS", "考試日程", "請同時確認場地規則與可攜資料；飛行考生需預留停泊時間。"],
    name: "姓名或通稱",
    origin: "現居地",
    identity: "種族／身分",
    school: "志願學院",
    contact: "聯絡方式",
    question: "你想帶進校園的問題",
    method: "你準備如何觀察它",
    needs: "住宿、飲食、月相或安全需求",
    save: "儲存草稿",
    submit: "提交申請",
    saved: "草稿已儲存在這台裝置。",
    accepted: "申請已受理",
    acceptedBody: "請妥善保留受理編號；招生諮詢室將依此安排下一階段。",
    newApplication: "填寫另一份申請",
    myApplications: "我的申請",
    localRecords: "本機申請記錄",
    localRecordsLead: "申請與草稿只保存在這台裝置，不會同步到其他瀏覽器。",
    noApplications: "這台裝置還沒有已提交的申請。",
    backToForm: "返回申請表",
    submitted: "已提交",
    submittedOn: "提交時間",
    applicationDetail: "查看申請內容",
    deleteRecord: "刪除本機記錄",
    deleteConfirm: "確定要從這台裝置刪除此申請記錄嗎？",
    recordDeleted: "已刪除這台裝置上的申請記錄。",
    draftPresent: "有一份自動儲存的草稿",
    formAutoSave: "填寫內容會自動儲存在這台裝置。",
    selectedSchool: "已從學院目錄帶入志願；仍可在表單中更改。",
    recordsUnit: "份已提交",
    selectSchool: "請選擇",
    consent: "我確認以上內容可交由招生諮詢室進行選拔審查。",
    allBuildings: "所有館舍",
    building: "館舍",
    room: "房間",
    type: "類型",
    seats: "座位",
    freeUntil: "可用至",
    availableNow: "目前可用",
    liveFacilities: "此刻館舍開放板",
    hoursLabel: "開放時間",
    openNow: "開放中",
    closedNow: "目前閉館",
    seatsFree: "空位",
    noRooms: "這個時段沒有可直接占用的房間；請查看上方閉館與降載通告，或等下一次校鐘。",
    reading: "閱覽室",
    classroom: "教室",
    seminar: "研討室",
    lab: "實驗室",
    workshop: "工房",
    visitor: "訪客姓名",
    party: "同行人數",
    date: "到訪日期",
    route: "抵達入口",
    visitNeeds: "通行與協助需求",
    reserve: "送出預約",
    reserved: "進校預約已登記",
    reservedBody: "請在預約時間前一刻鐘抵達入口，並出示下列通行編號。",
    saveVisit: "儲存預約草稿",
    visitSaved: "進校預約草稿已保存在這台裝置。",
    myVisits: "我的進校預約",
    visitRecords: "本機進校記錄",
    visitRecordsLead: "預約與草稿只保存在這台裝置，不會同步到其他瀏覽器。",
    noVisits: "這台裝置還沒有已提交的進校預約。",
    backToVisit: "返回預約表",
    newVisit: "再預約一次",
    visitDetail: "查看通行需求",
    deleteVisit: "刪除本機預約",
    deleteVisitConfirm: "確定要從這台裝置刪除此進校預約嗎？",
    visitDeleted: "已刪除這台裝置上的進校預約。",
    visitDraftPresent: "有一份自動儲存的預約草稿",
    visitAutoSave: "填寫內容會自動儲存在這台裝置。",
    visitRecordsUnit: "份已預約",
    menu: "品項",
    contents: "內容",
    price: "價格",
    note: "備註",
    time: "時間",
    course: "課程",
    instructor: "授課教師",
    change: "現場變更",
    examination: "考試",
    venue: "場地",
    format: "形式",
    required: "請完成所有必填欄位。",
    hakureiGate: "博麗門（步行）",
    mountainGate: "妖怪山門（山地通行）",
    mistyPier: "霧湖碼頭（水路）",
    skyBerth: "境界講堂屋頂（空路）",
  },
  ja: {
    application: ["ONLINE APPLICATION / 2026", "オンライン入学出願", "途中保存できます。提出後、学内受付番号が発行されます。"],
    availability: ["ROOM FINDER / LIVE", "施設空き状況", "現在利用できる教室、演習室、工房を施設別に確認します。"],
    visit: ["CAMPUS VISIT / RESERVATION", "来校予約", "到着方法と日付を選択。外界からの来訪者は博麗門で確認します。"],
    dining: ["DINING / TODAY", "本日の食堂メニュー", "採集、月相、夜雀の演奏時刻により内容が変わる場合があります。"],
    timetable: ["ACADEMIC AFFAIRS / CLASSES", "本日の時間割", "共同キャンパスの時間割。教室変更は開始15分前までに更新されます。"],
    exams: ["ACADEMIC AFFAIRS / EXAMS", "試験日程", "会場規則と持込資料を確認し、飛行者は停泊時間も確保してください。"],
    name: "氏名・通称",
    origin: "現住所",
    identity: "種族／身分",
    school: "志望学部",
    contact: "連絡先",
    question: "キャンパスへ持ち込みたい問い",
    method: "どのように観察しますか",
    needs: "住居・食事・月相・安全上の希望",
    save: "下書き保存",
    submit: "出願する",
    saved: "下書きをこの端末に保存しました。",
    accepted: "出願を受け付けました",
    acceptedBody: "受付番号を保存してください。入学相談室が次の選抜を案内します。",
    newApplication: "別の出願を書く",
    myApplications: "自分の出願",
    localRecords: "この端末の出願記録",
    localRecordsLead: "出願と下書きはこの端末だけに保存され、他のブラウザへ同期されません。",
    noApplications: "この端末には提出済みの出願がまだありません。",
    backToForm: "出願フォームへ戻る",
    submitted: "提出済み",
    submittedOn: "提出日時",
    applicationDetail: "出願内容を見る",
    deleteRecord: "端末の記録を削除",
    deleteConfirm: "この端末から出願記録を削除しますか？",
    recordDeleted: "この端末の出願記録を削除しました。",
    draftPresent: "自動保存された下書きがあります",
    formAutoSave: "入力内容はこの端末へ自動保存されます。",
    selectedSchool: "学部案内から志望先を入力しました。フォーム内で変更できます。",
    recordsUnit: "件提出済み",
    selectSchool: "選択してください",
    consent: "上記内容を入学相談室が選抜審査に利用することを確認します。",
    allBuildings: "すべての施設",
    building: "施設",
    room: "部屋",
    type: "種別",
    seats: "席",
    freeUntil: "利用可能時刻",
    availableNow: "現在利用可",
    liveFacilities: "現在の施設開館板",
    hoursLabel: "開館時間",
    openNow: "開館中",
    closedNow: "現在閉館",
    seatsFree: "空席",
    noRooms: "この時間に直接利用できる部屋はありません。上の休館・減載告知を確認するか、次の校鐘をお待ちください。",
    reading: "閲覧室",
    classroom: "教室",
    seminar: "演習室",
    lab: "実験室",
    workshop: "工房",
    visitor: "来訪者名",
    party: "同行人数",
    date: "来校日",
    route: "到着入口",
    visitNeeds: "通行・支援の希望",
    reserve: "予約を送信",
    reserved: "来校予約を登録しました",
    reservedBody: "予約時刻の15分前に入口へ到着し、次の通行番号を提示してください。",
    saveVisit: "予約下書きを保存",
    visitSaved: "来校予約の下書きをこの端末へ保存しました。",
    myVisits: "自分の来校予約",
    visitRecords: "この端末の来校記録",
    visitRecordsLead: "予約と下書きはこの端末だけに保存され、他のブラウザへ同期されません。",
    noVisits: "この端末には提出済みの来校予約がありません。",
    backToVisit: "予約フォームへ戻る",
    newVisit: "別の来校を予約",
    visitDetail: "通行希望を見る",
    deleteVisit: "端末の予約を削除",
    deleteVisitConfirm: "この端末から来校予約を削除しますか。",
    visitDeleted: "この端末の来校予約を削除しました。",
    visitDraftPresent: "自動保存された予約下書きがあります",
    visitAutoSave: "入力内容はこの端末へ自動保存されます。",
    visitRecordsUnit: "件予約済み",
    menu: "品名",
    contents: "内容",
    price: "価格",
    note: "備考",
    time: "時刻",
    course: "授業",
    instructor: "担当",
    change: "現場変更",
    examination: "試験",
    venue: "会場",
    format: "形式",
    required: "必須項目をすべて入力してください。",
    hakureiGate: "博麗門（徒歩）",
    mountainGate: "妖怪山門（山道）",
    mistyPier: "霧の湖桟橋（水路）",
    skyBerth: "境界講堂屋上（空路）",
  },
  en: {
    application: ["ONLINE APPLICATION / 2026", "Online Application", "Save in stages. Submission creates an internal application reference."],
    availability: ["ROOM FINDER / LIVE", "Room Availability", "Find classrooms, seminar rooms, and workshops currently available by building."],
    visit: ["CAMPUS VISIT / RESERVATION", "Campus Visit Reservation", "Choose your arrival route and date. Outside World visitors are checked at Hakurei Gate."],
    dining: ["DINING / TODAY", "Today's Dining Menu", "Offerings may shift with foraging, lunar phase, and night-sparrow performance times."],
    timetable: ["ACADEMIC AFFAIRS / CLASSES", "Today's Class Schedule", "Shared-campus timetable. Room changes are posted fifteen minutes before class."],
    exams: ["ACADEMIC AFFAIRS / EXAMS", "Examination Schedule", "Check venue rules and permitted materials; flying candidates should allow berthing time."],
    name: "Name or known name",
    origin: "Current residence",
    identity: "Species / identity",
    school: "Preferred school",
    contact: "Contact",
    question: "The question you want to bring",
    method: "How you plan to observe it",
    needs: "Housing, food, lunar, or safety needs",
    save: "Save draft",
    submit: "Submit application",
    saved: "Draft saved on this device.",
    accepted: "Application received",
    acceptedBody: "Keep this reference; the Admissions Office will use it for the next stage.",
    newApplication: "Start another application",
    myApplications: "My Applications",
    localRecords: "Applications on this device",
    localRecordsLead: "Applications and drafts stay in this browser and do not sync to other devices.",
    noApplications: "No applications have been submitted from this device yet.",
    backToForm: "Back to application",
    submitted: "Submitted",
    submittedOn: "Submitted",
    applicationDetail: "View application details",
    deleteRecord: "Delete local record",
    deleteConfirm: "Delete this application record from this device?",
    recordDeleted: "Application record deleted from this device.",
    draftPresent: "An autosaved draft is available",
    formAutoSave: "Your entries are autosaved on this device.",
    selectedSchool: "Your choice from the school catalogue is preselected; you may still change it.",
    recordsUnit: "submitted",
    selectSchool: "Select one",
    consent: "I confirm the Admissions Office may use this information for selection.",
    allBuildings: "All buildings",
    building: "Building",
    room: "Room",
    type: "Type",
    seats: "Seats",
    freeUntil: "Free until",
    availableNow: "Available now",
    liveFacilities: "Live facility board",
    hoursLabel: "Opening hours",
    openNow: "Open now",
    closedNow: "Currently closed",
    seatsFree: "places free",
    noRooms: "No room is directly available in this period. Check the closure and load notices above, or wait for the next bell.",
    reading: "Reading room",
    classroom: "Classroom",
    seminar: "Seminar room",
    lab: "Laboratory",
    workshop: "Workshop",
    visitor: "Visitor name",
    party: "Party size",
    date: "Visit date",
    route: "Arrival gate",
    visitNeeds: "Access and assistance needs",
    reserve: "Reserve visit",
    reserved: "Campus visit registered",
    reservedBody: "Arrive fifteen minutes early and present the following passage reference.",
    saveVisit: "Save visit draft",
    visitSaved: "Visit draft saved on this device.",
    myVisits: "My Campus Visits",
    visitRecords: "Campus visits on this device",
    visitRecordsLead: "Reservations and drafts stay in this browser and do not sync to other devices.",
    noVisits: "No campus visit has been submitted from this device.",
    backToVisit: "Back to visit form",
    newVisit: "Reserve another visit",
    visitDetail: "View access needs",
    deleteVisit: "Delete local reservation",
    deleteVisitConfirm: "Delete this campus-visit reservation from this device?",
    visitDeleted: "Campus-visit reservation deleted from this device.",
    visitDraftPresent: "An autosaved visit draft is available",
    visitAutoSave: "Your entries are autosaved on this device.",
    visitRecordsUnit: "reserved",
    menu: "Item",
    contents: "Contents",
    price: "Price",
    note: "Note",
    time: "Time",
    course: "Course",
    instructor: "Instructor",
    change: "Live change",
    examination: "Examination",
    venue: "Venue",
    format: "Format",
    required: "Please complete all required fields.",
    hakureiGate: "Hakurei Gate (walk)",
    mountainGate: "Youkai Mountain Gate (mountain)",
    mistyPier: "Misty Lake Pier (water)",
    skyBerth: "Boundary Hall Roof (air)",
  },
};

function localized(value, locale) {
  return typeof value === "object" ? value[locale] : value;
}

function readStored(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function resolveSchoolId(value) {
  if (schoolCatalogues[value]) return value;
  const normalized = String(value || "").replace(/^School of /, "");
  return (
    Object.entries(schoolCatalogues).find(([, school]) =>
      Object.values(school.name).some((name) => name === value || name.replace(/^School of /, "") === normalized),
    )?.[0] || ""
  );
}

function schoolName(value, locale) {
  const id = resolveSchoolId(value);
  return schoolCatalogues[id]?.name[locale] || value || "—";
}

function reference(prefix) {
  const date = new Date();
  const stamp = `${date.getFullYear().toString().slice(-2)}${String(date.getMonth() + 1).padStart(2, "0")}`;
  return `TU-${prefix}-${stamp}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function initServices() {
  const dialog = document.querySelector("[data-service-dialog]");
  const content = dialog?.querySelector("[data-service-content]");
  const serviceAnchor = document.querySelector("#services") ? "#services" : document.querySelector("#map") ? "#map" : "#main";
  let currentService = null;
  let currentApplicationSchool = null;
  let applicationView = "form";
  let visitView = "form";

  function setHeader(service) {
    const locale = getLocale();
    const [kicker, title, description] = copy[locale][service];
    dialog.querySelector("[data-service-kicker]").textContent = kicker;
    dialog.querySelector("[data-service-title]").textContent = title;
    dialog.querySelector("[data-service-description]").textContent = description;
  }

  function renderApplication() {
    applicationView = "form";
    const locale = getLocale();
    const c = copy[locale];
    const submissions = readStored("tu:application:submissions", []);
    const draft = readStored("tu:application:draft", null);
    const options = Object.entries(schoolCatalogues)
      .map(([id, school]) => `<option value="${id}">${school.name[locale]}</option>`)
      .join("");
    content.innerHTML = `
      <div class="application-local-bar">
        <div>
          <p>ON THIS DEVICE</p>
          <strong>${submissions.length} ${c.recordsUnit}${draft ? ` · ${c.draftPresent}` : ""}</strong>
        </div>
        <button type="button" data-application-records>
          ${c.myApplications} <span>${submissions.length}</span>
        </button>
      </div>
      ${
        currentApplicationSchool
          ? `<div class="application-school-context">
              <span aria-hidden="true">${schoolCatalogues[currentApplicationSchool]?.glyph || "願"}</span>
              <p><strong>${schoolCatalogues[currentApplicationSchool]?.name[locale] || ""}</strong>${c.selectedSchool}</p>
            </div>`
          : ""
      }
      <form class="campus-form application-form" data-application-form>
        <label>${c.name}<input name="name" maxlength="60" required autocomplete="name"></label>
        <label>${c.contact}<input name="contact" maxlength="90" required autocomplete="email"></label>
        <label>${c.origin}<input name="origin" maxlength="80" required></label>
        <label>${c.identity}<input name="identity" maxlength="60" required></label>
        <label class="form-span">${c.school}
          <select name="school" required><option value="">${c.selectSchool}</option>${options}</select>
        </label>
        <label class="form-span">${c.question}<textarea name="question" rows="4" maxlength="1000" required></textarea></label>
        <label class="form-span">${c.method}<textarea name="method" rows="3" maxlength="700" required></textarea></label>
        <label class="form-span">${c.needs}<textarea name="needs" rows="2" maxlength="500"></textarea></label>
        <label class="form-span form-consent"><input type="checkbox" name="consent" required><span>${c.consent}</span></label>
        <div class="form-actions form-span">
          <span>${c.formAutoSave}</span>
          <button class="button button-secondary" type="button" data-save-application>${c.save}</button>
          <button class="button button-primary" type="submit">${c.submit} <span>→</span></button>
        </div>
      </form>`;

    const form = content.querySelector("[data-application-form]");
    if (draft) {
      Object.entries(draft).forEach(([key, value]) => {
        const field = form.elements.namedItem(key);
        if (!field || typeof value !== "string") return;
        if (field.type === "checkbox") field.checked = value === "yes" || value === "on";
        else if (key === "school") field.value = resolveSchoolId(value);
        else field.value = value;
      });
    }
    if (currentApplicationSchool && schoolCatalogues[currentApplicationSchool]) {
      form.elements.school.value = currentApplicationSchool;
    }

    let autosaveTimer;
    const saveDraft = ({ notify = false } = {}) => {
      const values = Object.fromEntries(new FormData(form).entries());
      values.consent = form.elements.consent.checked ? "yes" : "";
      window.localStorage.setItem("tu:application:draft", JSON.stringify(values));
      if (notify) showToast(c.saved);
    };
    form.addEventListener("input", () => {
      window.clearTimeout(autosaveTimer);
      autosaveTimer = window.setTimeout(saveDraft, 220);
    });
    form.addEventListener("change", () => saveDraft());
    content.querySelector("[data-save-application]").addEventListener("click", () => {
      saveDraft({ notify: true });
    });
    content.querySelector("[data-application-records]").addEventListener("click", renderApplicationRecords);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) {
        showToast(c.required);
        return;
      }
      window.clearTimeout(autosaveTimer);
      const id = reference("A");
      const record = { id, submittedAt: new Date().toISOString(), ...Object.fromEntries(new FormData(form).entries()) };
      const storedSubmissions = readStored("tu:application:submissions", []);
      storedSubmissions.push(record);
      window.localStorage.setItem("tu:application:submissions", JSON.stringify(storedSubmissions.slice(-30)));
      window.localStorage.removeItem("tu:application:draft");
      recordCampusEvent(
        "application.submitted",
        { applicationId: id, school: record.school },
        { id: `application.submitted:${id}`, timestamp: record.submittedAt },
      );
      content.innerHTML = `
        <div class="service-success">
          <span aria-hidden="true">✓</span>
          <p>ADMISSIONS 2026</p>
          <h3>${c.accepted}</h3>
          <strong>${id}</strong>
          <p>${c.acceptedBody}</p>
          <div class="service-success-actions">
            <button class="button button-secondary" type="button" data-application-records>${c.myApplications}</button>
            <button class="button button-primary" type="button" data-new-application>${c.newApplication}</button>
          </div>
        </div>`;
      content.querySelector("[data-new-application]").addEventListener("click", renderApplication);
      content.querySelector("[data-application-records]").addEventListener("click", renderApplicationRecords);
    });
  }

  function renderApplicationRecords() {
    applicationView = "records";
    const locale = getLocale();
    const c = copy[locale];
    const submissions = readStored("tu:application:submissions", []);
    const draft = readStored("tu:application:draft", null);
    const formatDate = (value) => {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return "—";
      return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(date);
    };
    content.innerHTML = `
      <section class="application-records">
        <header>
          <div>
            <p>ON THIS DEVICE / LOCAL RECORDS</p>
            <h3>${c.localRecords}</h3>
            <span>${c.localRecordsLead}</span>
          </div>
          <button class="button button-secondary" type="button" data-back-application>${c.backToForm}</button>
        </header>
        ${
          draft
            ? `<button class="application-draft-card" type="button" data-back-application>
                <span>✎</span>
                <div><small>AUTOSAVED DRAFT</small><strong>${c.draftPresent}</strong></div>
                <i aria-hidden="true">→</i>
              </button>`
            : ""
        }
        <div class="application-record-list">
          ${
            submissions.length
              ? submissions
                  .slice()
                  .reverse()
                  .map(
                    (record) => `
                      <article class="application-record-card" data-application-record="${escapeHtml(record.id)}">
                        <header>
                          <div><span>${c.submitted}</span><strong>${escapeHtml(record.id)}</strong></div>
                          <time datetime="${escapeHtml(record.submittedAt)}">${formatDate(record.submittedAt)}</time>
                        </header>
                        <dl>
                          <div><dt>${c.name}</dt><dd>${escapeHtml(record.name)}</dd></div>
                          <div><dt>${c.school}</dt><dd>${escapeHtml(schoolName(record.school, locale))}</dd></div>
                        </dl>
                        <details>
                          <summary>${c.applicationDetail}</summary>
                          <div class="application-record-detail">
                            <p><span>${c.question}</span>${escapeHtml(record.question)}</p>
                            <p><span>${c.method}</span>${escapeHtml(record.method)}</p>
                            ${record.needs ? `<p><span>${c.needs}</span>${escapeHtml(record.needs)}</p>` : ""}
                          </div>
                        </details>
                        <button type="button" class="application-record-delete" data-delete-application="${escapeHtml(record.id)}">
                          ${c.deleteRecord}
                        </button>
                      </article>`,
                  )
                  .join("")
              : `<p class="application-records-empty">${c.noApplications}</p>`
          }
        </div>
      </section>`;
    content.querySelectorAll("[data-back-application]").forEach((button) => {
      button.addEventListener("click", renderApplication);
    });
    content.querySelectorAll("[data-delete-application]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!window.confirm(c.deleteConfirm)) return;
        const next = readStored("tu:application:submissions", []).filter(
          (record) => record.id !== button.dataset.deleteApplication,
        );
        window.localStorage.setItem("tu:application:submissions", JSON.stringify(next));
        recordCampusEvent(
          "application.deleted",
          { applicationId: button.dataset.deleteApplication },
          { id: `application.deleted:${button.dataset.deleteApplication}:${Date.now()}` },
        );
        renderApplicationRecords();
        showToast(c.recordDeleted);
      });
    });
  }

  function renderAvailability() {
    const locale = getLocale();
    const c = copy[locale];
    const facilities = liveFacilityBoard(locale);
    const roomAvailability = liveRoomAvailability();
    const buildings = [...new Set(roomAvailability.map((room) => room.building))];
    content.innerHTML = `
      <section class="facility-live-board">
        <header><p>LIVE CAMPUS / ${facilities[0]?.snapshotKey || ""}</p><h3>${c.liveFacilities}</h3></header>
        <div>${facilities.map((facility) => `
          <article data-open="${facility.open}">
            <span>${facility.open ? c.openNow : c.closedNow}</span>
            <h4>${mapPlaces[facility.id].name[locale]}</h4>
            <dl>
              <div><dt>${c.hoursLabel}</dt><dd>${facility.hours}</dd></div>
              <div><dt>${c.seatsFree}</dt><dd>${facility.availableSeats} / ${facility.capacity}</dd></div>
            </dl>
            <p>${escapeHtml(facility.note)}</p>
          </article>`).join("")}</div>
      </section>
      <div class="room-controls">
        <label>${c.building}
          <select data-room-building>
            <option value="all">${c.allBuildings}</option>
            ${buildings.map((id) => `<option value="${id}">${mapPlaces[id].name[locale]}</option>`).join("")}
          </select>
        </label>
        <span><i></i>${c.availableNow}</span>
      </div>
      <div class="room-list" data-room-list></div>`;
    const list = content.querySelector("[data-room-list]");
    const select = content.querySelector("[data-room-building]");
    const renderRooms = () => {
      const selected = select.value;
      const rooms = roomAvailability
        .filter((room) => room.available && (selected === "all" || room.building === selected))
        .map(
          (room) => `
            <article class="room-card">
              <div><span>${mapPlaces[room.building].name[locale]}</span><strong>${room.code}</strong></div>
              <dl>
                <div><dt>${c.type}</dt><dd>${c[room.kind]}</dd></div>
                <div><dt>${c.seats}</dt><dd>${room.seats}</dd></div>
                <div><dt>${c.freeUntil}</dt><dd>${room.freeUntil}</dd></div>
              </dl>
            </article>`,
        )
        .join("");
      list.innerHTML = rooms || `<p class="room-list-empty">${c.noRooms}</p>`;
    };
    select.addEventListener("change", renderRooms);
    renderRooms();
  }

  function renderVisit() {
    visitView = "form";
    const locale = getLocale();
    const c = copy[locale];
    const nextLocalDay = new Date();
    nextLocalDay.setDate(nextLocalDay.getDate() + 1);
    const tomorrow = [
      nextLocalDay.getFullYear(),
      String(nextLocalDay.getMonth() + 1).padStart(2, "0"),
      String(nextLocalDay.getDate()).padStart(2, "0"),
    ].join("-");
    const visits = readStored("tu:visits", []);
    const draft = readStored("tu:visit:draft", null);
    content.innerHTML = `
      <div class="application-local-bar">
        <div>
          <p>ON THIS DEVICE</p>
          <strong>${visits.length} ${c.visitRecordsUnit}${draft ? ` · ${c.visitDraftPresent}` : ""}</strong>
        </div>
        <button type="button" data-visit-records>
          ${c.myVisits} <span>${visits.length}</span>
        </button>
      </div>
      <form class="campus-form" data-visit-form>
        <label>${c.visitor}<input name="name" maxlength="60" required autocomplete="name"></label>
        <label>${c.contact}<input name="contact" maxlength="90" required></label>
        <label>${c.party}<input name="party" type="number" min="1" max="12" value="1" required></label>
        <label>${c.date}<input name="date" type="date" min="${tomorrow}" required></label>
        <label class="form-span">${c.route}
          <select name="route" required>
            <option value="hakurei">${c.hakureiGate}</option>
            <option value="mountain">${c.mountainGate}</option>
            <option value="pier">${c.mistyPier}</option>
            <option value="sky">${c.skyBerth}</option>
          </select>
        </label>
        <label class="form-span">${c.visitNeeds}<textarea name="needs" rows="3" maxlength="500"></textarea></label>
        <div class="form-actions form-span">
          <span>${c.visitAutoSave}</span>
          <button class="button button-secondary" type="button" data-save-visit>${c.saveVisit}</button>
          <button class="button button-primary" type="submit">${c.reserve} <span>→</span></button>
        </div>
      </form>`;
    const form = content.querySelector("[data-visit-form]");
    if (draft) {
      Object.entries(draft).forEach(([key, value]) => {
        const field = form.elements.namedItem(key);
        if (field && typeof value === "string") field.value = value;
      });
    }
    let autosaveTimer;
    const saveVisitDraft = ({ notify = false } = {}) => {
      const values = Object.fromEntries(new FormData(form).entries());
      window.localStorage.setItem("tu:visit:draft", JSON.stringify(values));
      if (notify) showToast(c.visitSaved);
    };
    form.addEventListener("input", () => {
      window.clearTimeout(autosaveTimer);
      autosaveTimer = window.setTimeout(saveVisitDraft, 220);
    });
    form.addEventListener("change", () => saveVisitDraft());
    content.querySelector("[data-save-visit]").addEventListener("click", () => saveVisitDraft({ notify: true }));
    content.querySelector("[data-visit-records]").addEventListener("click", renderVisitRecords);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) {
        showToast(c.required);
        return;
      }
      window.clearTimeout(autosaveTimer);
      const id = reference("V");
      const record = { id, submittedAt: new Date().toISOString(), ...Object.fromEntries(new FormData(form).entries()) };
      const storedVisits = readStored("tu:visits", []);
      storedVisits.push(record);
      window.localStorage.setItem("tu:visits", JSON.stringify(storedVisits.slice(-30)));
      window.localStorage.removeItem("tu:visit:draft");
      recordCampusEvent(
        "visit.reserved",
        { visitId: id, route: record.route, date: record.date },
        { id: `visit.reserved:${id}`, timestamp: record.submittedAt },
      );
      content.innerHTML = `
        <div class="service-success">
          <span aria-hidden="true">門</span>
          <p>VISITOR PASS</p>
          <h3>${c.reserved}</h3>
          <strong>${id}</strong>
          <p>${c.reservedBody}</p>
          <div class="service-success-actions">
            <button class="button button-secondary" type="button" data-visit-records>${c.myVisits}</button>
            <button class="button button-primary" type="button" data-new-visit>${c.newVisit}</button>
          </div>
        </div>`;
      content.querySelector("[data-visit-records]").addEventListener("click", renderVisitRecords);
      content.querySelector("[data-new-visit]").addEventListener("click", renderVisit);
    });
  }

  function renderVisitRecords() {
    visitView = "records";
    const locale = getLocale();
    const c = copy[locale];
    const visits = readStored("tu:visits", []);
    const draft = readStored("tu:visit:draft", null);
    const routeNames = {
      hakurei: c.hakureiGate,
      mountain: c.mountainGate,
      pier: c.mistyPier,
      sky: c.skyBerth,
    };
    const formatDate = (value, withTime = false) => {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return "—";
      return new Intl.DateTimeFormat(locale, withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "long" }).format(date);
    };
    content.innerHTML = `
      <section class="application-records visit-records">
        <header>
          <div>
            <p>ON THIS DEVICE / VISITOR PASSES</p>
            <h3>${c.visitRecords}</h3>
            <span>${c.visitRecordsLead}</span>
          </div>
          <button class="button button-secondary" type="button" data-back-visit>${c.backToVisit}</button>
        </header>
        ${
          draft
            ? `<button class="application-draft-card" type="button" data-back-visit>
                <span>✎</span>
                <div><small>AUTOSAVED DRAFT</small><strong>${c.visitDraftPresent}</strong></div>
                <i aria-hidden="true">→</i>
              </button>`
            : ""
        }
        <div class="application-record-list">
          ${
            visits.length
              ? visits
                  .slice()
                  .reverse()
                  .map(
                    (record) => `
                      <article class="application-record-card" data-visit-record="${escapeHtml(record.id)}">
                        <header>
                          <div><span>${c.submitted}</span><strong>${escapeHtml(record.id)}</strong></div>
                          <time datetime="${escapeHtml(record.submittedAt)}">${formatDate(record.submittedAt, true)}</time>
                        </header>
                        <dl>
                          <div><dt>${c.visitor}</dt><dd>${escapeHtml(record.name)}</dd></div>
                          <div><dt>${c.date}</dt><dd>${formatDate(`${record.date}T12:00:00`)}</dd></div>
                          <div><dt>${c.party}</dt><dd>${escapeHtml(record.party)}</dd></div>
                          <div><dt>${c.route}</dt><dd>${escapeHtml(routeNames[record.route] || record.route || "—")}</dd></div>
                        </dl>
                        ${
                          record.needs
                            ? `<details>
                                <summary>${c.visitDetail}</summary>
                                <div class="application-record-detail"><p><span>${c.visitNeeds}</span>${escapeHtml(record.needs)}</p></div>
                              </details>`
                            : ""
                        }
                        <button type="button" class="application-record-delete" data-delete-visit="${escapeHtml(record.id)}">
                          ${c.deleteVisit}
                        </button>
                      </article>`,
                  )
                  .join("")
              : `<p class="application-records-empty">${c.noVisits}</p>`
          }
        </div>
      </section>`;
    content.querySelectorAll("[data-back-visit]").forEach((button) => {
      button.addEventListener("click", renderVisit);
    });
    content.querySelectorAll("[data-delete-visit]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!window.confirm(c.deleteVisitConfirm)) return;
        const next = readStored("tu:visits", []).filter((record) => record.id !== button.dataset.deleteVisit);
        window.localStorage.setItem("tu:visits", JSON.stringify(next));
        recordCampusEvent(
          "visit.deleted",
          { visitId: button.dataset.deleteVisit },
          { id: `visit.deleted:${button.dataset.deleteVisit}:${Date.now()}` },
        );
        renderVisitRecords();
        showToast(c.visitDeleted);
      });
    });
  }

  function renderTable(headers, rows) {
    return `
      <div class="table-scroll">
        <table class="campus-table">
          <thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead>
          <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
      </div>`;
  }

  function renderDining() {
    const locale = getLocale();
    const c = copy[locale];
    const state = liveCampusSnapshot();
    content.innerHTML = `
      <p class="service-live-note"><i></i>${state.weather[locale]} · ${state.activeEvents.map((event) => event.rule[locale]).join(" · ")}</p>
      ${renderTable([c.menu, c.contents, c.price, c.note], liveDiningMenu(locale))}`;
  }

  function renderTimetable() {
    const locale = getLocale();
    const c = copy[locale];
    content.innerHTML = renderTable([c.time, c.course, c.room, c.instructor, c.change], liveTimetable(locale));
  }

  function renderExams() {
    const locale = getLocale();
    const c = copy[locale];
    content.innerHTML = renderTable([c.date, c.examination, c.venue, c.format], liveExamSchedule(locale));
  }

  const renderers = {
    application: renderApplication,
    availability: renderAvailability,
    visit: renderVisit,
    dining: renderDining,
    timetable: renderTimetable,
    exams: renderExams,
  };

  function openService(service, { applicationSchool = null } = {}) {
    if (!renderers[service] || !dialog) return;
    currentService = service;
    if (service === "application") {
      currentApplicationSchool = resolveSchoolId(applicationSchool);
      applicationView = "form";
    }
    if (service === "visit") visitView = "form";
    setHeader(service);
    renderers[service]();
    if (!dialog.open) dialog.showModal();
  }

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-service]");
    if (!trigger) return;
    event.preventDefault();
    const prospectusDialog = document.querySelector("[data-prospectus-dialog]");
    if (prospectusDialog?.open) prospectusDialog.close();
    const schoolSuffix = trigger.dataset.applicationSchool ? `--${trigger.dataset.applicationSchool}` : "";
    navigateToDeepLink(`service-${trigger.dataset.service}${schoolSuffix}`);
  });
  registerDeepLink("service-", {
    anchor: serviceAnchor,
    dialog,
    open(value) {
      const [service, applicationSchool] = value.split("--");
      openService(service, { applicationSchool });
    },
    close() {
      if (dialog?.open) dialog.close();
    },
  });
  document.querySelector("[data-service-close]")?.addEventListener("click", () => {
    closeDeepLink("service-", serviceAnchor);
  });
  dialog?.addEventListener("close", () => closeDeepLink("service-", serviceAnchor));
  window.addEventListener("tu:languagechange", () => {
    if (!currentService) return;
    const openApplicationForm = content?.querySelector("[data-application-form]");
    if (openApplicationForm) {
      const values = Object.fromEntries(new FormData(openApplicationForm).entries());
      values.consent = openApplicationForm.elements.consent.checked ? "yes" : "";
      window.localStorage.setItem("tu:application:draft", JSON.stringify(values));
    }
    const openVisitForm = content?.querySelector("[data-visit-form]");
    if (openVisitForm) {
      window.localStorage.setItem(
        "tu:visit:draft",
        JSON.stringify(Object.fromEntries(new FormData(openVisitForm).entries())),
      );
    }
    setHeader(currentService);
    if (currentService === "application" && applicationView === "records") renderApplicationRecords();
    else if (currentService === "visit" && visitView === "records") renderVisitRecords();
    else renderers[currentService]();
  });
}
