import {
  courseByCode,
  courseCatalogue,
  courseDays,
  coursePeriods,
  courseTerm,
} from "../data/courses.js";
import { schools } from "../data/schools.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { getLocale } from "./i18n.js";
import { mutateAndRenderPreservingState, renderPreservingState } from "./render-state.js";
import { showToast } from "./ui.js";

const REGISTRATION_KEY = "tu:courses:registration";
const TRANSCRIPT_KEY = "tu:courses:transcript";
const IDENTITY_KEY = "tu:identity";

const copy = {
  "zh-Hant": {
    eyebrow: "MY TU / COURSE REGISTRATION",
    title: "把課選進生活裡，然後確認教室還在原來的位置。",
    lead: "搜尋七所學院的 35 門課；加退選、候補、先修與非普通衝堂都在這台裝置上即時判定。18 學分是提醒，不是結界。",
    records: "學籍首頁",
    registration: "選課與成績",
    term: "開放學期",
    credits: "已選學分",
    enrolled: "已選課",
    waitlisted: "候補中",
    local: "本機教務檔案",
    privacy: "選課與成績紀錄只保存在目前瀏覽器。",
    catalogue: "課程目錄",
    schedule: "我的課表",
    academicRecord: "成績與文件",
    search: "搜尋課號、課名、教師或奇怪警告",
    allSchools: "全部學院",
    allStates: "所有狀態",
    eligibleOnly: "目前可選（已即時計算先修與衝堂）",
    openOnly: "仍有名額",
    waitlistOnly: "已滿／可候補",
    applyFilters: "查詢",
    resultCount: "門符合條件",
    seats: "名額",
    seatsOpen: "可選",
    full: "已滿",
    noWaitlist: "不開放候補",
    prerequisite: "先修",
    noPrerequisite: "無",
    meeting: "上課",
    instructor: "教師",
    creditsLabel: "學分",
    selectCourse: "查看課程",
    add: "加入課表",
    joinWaitlist: "加入候補",
    drop: "退選",
    cancelWaitlist: "取消候補",
    selected: "已選",
    onWaitlist: "候補",
    waitlistPosition: "本機候補順位",
    missingIdentity: "建立 My TU 身分後即可選課；課程目錄仍可自由瀏覽。",
    createIdentity: "建立 My TU 身分",
    missingPrerequisite: "尚缺先修",
    conflict: "衝堂",
    creditLimit: "超過本學期 18 學分建議值",
    overloadWarning: "課表已進入彈幕密度區；教務處提醒你保留睡眠，但不會攔下這次選課。",
    overloadToast: "已加入課表。總學分超過建議值；選課成功，睡眠不保證。",
    registeredToast: "已加入課表。教室目前仍在登記的位置。",
    waitlistedToast: "課程已滿，已加入本機候補序列。",
    droppedToast: "已退選；教務處保留事件紀錄，但不再占用你的課表。",
    cancelledToast: "已取消候補。",
    unavailableToast: "本課滿班且不接受候補。",
    identityToast: "請先建立 My TU 身分。",
    boundaryWarning: "邊界相鄰：教務系統無法保證它不與任何課靠在一起。",
    emptyCatalogue: "沒有符合條件的課。試著少寫一點，或讓篩選器退一步。",
    emptySchedule: "課表還是空的。這在開學第一天看起來很自由，第二天通常比較慌。",
    enrolledCourses: "正式課表",
    waitlistCourses: "候補觀察席",
    weeklyGrid: "每週排課",
    lunarFootnote: "月相指定課依當月公告日上課；邊界相鄰課的時間由教師與教室共同解釋。",
    completed: "已完成課程",
    inProgress: "修讀中",
    noCompleted: "尚無已完成課程。本學期課程會以 IP（修讀中）列入成績紀錄。",
    assessments: "非學分試驗紀錄",
    noAssessments: "尚無可編入的入學或統一試驗成績。",
    standing: "學籍狀態",
    firstRegistration: "首次註冊／成績尚未結算",
    earnedCredits: "已獲學分",
    gpa: "平均點",
    confirmation: "選課確認單",
    transcript: "學業成績紀錄",
    openConfirmation: "開啟選課確認單",
    openTranscript: "開啟成績紀錄",
    documentBack: "返回選課系統",
    print: "列印／另存 PDF",
    documentUniversity: "幻想鄉立東方大學",
    registrar: "教務處・本機學籍櫃",
    student: "學生",
    studentId: "學籍編號",
    issued: "產生日期",
    status: "狀態",
    grade: "成績",
    codeCourse: "課號／課程",
    documentNote: "本文件依這台裝置上的學籍、選課與試驗紀錄生成。教室若在列印後移動，請以教室留下的最新公告為準。",
  },
  ja: {
    eyebrow: "MY TU / COURSE REGISTRATION",
    title: "授業を生活へ入れ、教室がまだ元の場所か確かめる。",
    lead: "七学部35科目を検索。追加・取消、補欠、前提科目、通常ではない重複まで端末内で即時判定。18単位は警告であって結界ではありません。",
    records: "学籍ホーム",
    registration: "履修・成績",
    term: "受付学期",
    credits: "履修単位",
    enrolled: "履修中",
    waitlisted: "補欠中",
    local: "端末内学務ファイル",
    privacy: "履修・成績記録はこのブラウザだけに保存されます。",
    catalogue: "科目一覧",
    schedule: "時間割",
    academicRecord: "成績・書類",
    search: "科目番号、名称、教員、妙な注意を検索",
    allSchools: "全学部",
    allStates: "全状態",
    eligibleOnly: "現在履修可（前提・重複を即時計算）",
    openOnly: "空席あり",
    waitlistOnly: "満員／補欠可",
    applyFilters: "検索",
    resultCount: "科目",
    seats: "定員",
    seatsOpen: "空席",
    full: "満員",
    noWaitlist: "補欠なし",
    prerequisite: "前提",
    noPrerequisite: "なし",
    meeting: "時間",
    instructor: "担当",
    creditsLabel: "単位",
    selectCourse: "科目を見る",
    add: "時間割へ追加",
    joinWaitlist: "補欠へ登録",
    drop: "履修取消",
    cancelWaitlist: "補欠取消",
    selected: "履修済",
    onWaitlist: "補欠",
    waitlistPosition: "端末内補欠順位",
    missingIdentity: "My TU身分を作成すると履修できます。科目一覧は自由に閲覧できます。",
    createIdentity: "My TU身分を作成",
    missingPrerequisite: "不足する前提",
    conflict: "時間重複",
    creditLimit: "学期推奨18単位を超えます",
    overloadWarning: "時間割は弾幕密度域です。教務課は睡眠を勧めますが履修を止めません。",
    overloadToast: "時間割へ追加しました。推奨単位超過。履修成功、睡眠は保証外です。",
    registeredToast: "時間割へ追加しました。教室は現在、登録地点にあります。",
    waitlistedToast: "満員のため端末内補欠列へ登録しました。",
    droppedToast: "履修を取り消しました。出来事は残りますが時間割から外れます。",
    cancelledToast: "補欠を取り消しました。",
    unavailableToast: "満員で補欠を受け付けません。",
    identityToast: "先にMy TU身分を作成してください。",
    boundaryWarning: "境界隣接：どの授業とも接しないことを学務システムは保証できません。",
    emptyCatalogue: "一致する科目がありません。語を短くするか絞り込みを戻してください。",
    emptySchedule: "時間割は空です。初日は自由に見え、二日目には大抵慌てます。",
    enrolledCourses: "正式時間割",
    waitlistCourses: "補欠観察席",
    weeklyGrid: "週間時間割",
    lunarFootnote: "月相指定科目は月間告知日に実施。境界隣接科目の時刻は教員と教室が共同解釈します。",
    completed: "修得済科目",
    inProgress: "履修中",
    noCompleted: "修得済科目はありません。今学期分はIP（履修中）として成績記録へ載ります。",
    assessments: "単位外試験記録",
    noAssessments: "編入可能な入試・統一試験成績はありません。",
    standing: "学籍状態",
    firstRegistration: "初回登録／成績未確定",
    earnedCredits: "修得単位",
    gpa: "平均点",
    confirmation: "履修確認書",
    transcript: "学業成績記録",
    openConfirmation: "履修確認書を開く",
    openTranscript: "成績記録を開く",
    documentBack: "履修システムへ戻る",
    print: "印刷／PDF保存",
    documentUniversity: "幻想郷立東方大学",
    registrar: "教務課・端末内学籍庫",
    student: "学生",
    studentId: "学籍番号",
    issued: "発行日",
    status: "状態",
    grade: "成績",
    codeCourse: "科目番号／科目",
    documentNote: "本書はこの端末の学籍・履修・試験記録から生成されます。印刷後に教室が移動した場合は教室の最新掲示を優先してください。",
  },
  en: {
    eyebrow: "MY TU / COURSE REGISTRATION",
    title: "Put classes into your life—then check the rooms stayed put.",
    lead: "Search 35 courses across seven schools. Add/drop, waitlists, prerequisites, and unusual collisions are resolved on this device. Eighteen credits is advice, not a barrier.",
    records: "Student record",
    registration: "Courses & grades",
    term: "Open term",
    credits: "Selected credits",
    enrolled: "Enrolled",
    waitlisted: "Waitlisted",
    local: "On-device registrar file",
    privacy: "Course and grade records stay in this browser.",
    catalogue: "Course catalogue",
    schedule: "My timetable",
    academicRecord: "Grades & documents",
    search: "Search code, title, instructor, or odd warning",
    allSchools: "All schools",
    allStates: "All states",
    eligibleOnly: "Eligible now (live prerequisites & collisions)",
    openOnly: "Seats available",
    waitlistOnly: "Full / waitlist",
    applyFilters: "Search",
    resultCount: "matching courses",
    seats: "Capacity",
    seatsOpen: "open",
    full: "Full",
    noWaitlist: "No waitlist",
    prerequisite: "Prerequisite",
    noPrerequisite: "None",
    meeting: "Meets",
    instructor: "Instructor",
    creditsLabel: "Credits",
    selectCourse: "View course",
    add: "Add to timetable",
    joinWaitlist: "Join waitlist",
    drop: "Drop course",
    cancelWaitlist: "Leave waitlist",
    selected: "Enrolled",
    onWaitlist: "Waitlist",
    waitlistPosition: "Local waitlist position",
    missingIdentity: "Create a My TU identity to register. The catalogue remains open to browse.",
    createIdentity: "Create My TU identity",
    missingPrerequisite: "Missing prerequisite",
    conflict: "Collision",
    creditLimit: "Above the suggested 18-credit load",
    overloadWarning: "Your timetable has entered danmaku density. The registrar recommends sleep but will not block registration.",
    overloadToast: "Added. Your load is above the suggestion; registration succeeded, sleep is not guaranteed.",
    registeredToast: "Added to your timetable. The room remains at its registered location for now.",
    waitlistedToast: "The class is full; you joined the on-device waitlist.",
    droppedToast: "Course dropped. The event remains on record but leaves your timetable.",
    cancelledToast: "Waitlist place cancelled.",
    unavailableToast: "This full course does not accept a waitlist.",
    identityToast: "Create a My TU identity first.",
    boundaryWarning: "Boundary-adjacent: the registrar cannot promise this course touches no other class.",
    emptyCatalogue: "No courses match. Try fewer words or loosen a filter.",
    emptySchedule: "Your timetable is empty. This feels free on day one and usually alarming on day two.",
    enrolledCourses: "Official timetable",
    waitlistCourses: "Waitlist observation desk",
    weeklyGrid: "Weekly timetable",
    lunarFootnote: "Lunar courses meet on monthly notice dates. Instructors and rooms jointly interpret boundary-adjacent times.",
    completed: "Completed courses",
    inProgress: "In progress",
    noCompleted: "No completed courses yet. Current classes appear as IP (in progress) on the academic record.",
    assessments: "Non-credit assessments",
    noAssessments: "No entrance or unified examination results are available to include.",
    standing: "Academic standing",
    firstRegistration: "First registration / grades pending",
    earnedCredits: "Earned credits",
    gpa: "Grade average",
    confirmation: "Registration confirmation",
    transcript: "Academic record",
    openConfirmation: "Open registration confirmation",
    openTranscript: "Open academic record",
    documentBack: "Back to registration",
    print: "Print / save PDF",
    documentUniversity: "Gensokyo Municipal Touhou University",
    registrar: "Registrar · On-device record cabinet",
    student: "Student",
    studentId: "Student ID",
    issued: "Generated",
    status: "Status",
    grade: "Grade",
    codeCourse: "Code / course",
    documentNote: "Generated from the identity, registration, and assessment records on this device. If a room moves after printing, follow the room's latest notice.",
  },
};

let activeTab = "catalogue";
let activeCourse = "BIS-101";
let filterQuery = "";
let filterSchool = "all";
let filterState = "all";
let positionedRoute = "";

function readJson(key, fallback) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function registration() {
  const raw = readJson(REGISTRATION_KEY, null);
  if (Array.isArray(raw)) return { schema: 1, term: courseTerm.id, entries: raw };
  if (!raw || !Array.isArray(raw.entries)) return { schema: 1, term: courseTerm.id, entries: [] };
  return { schema: 1, term: raw.term || courseTerm.id, entries: raw.entries.filter((entry) => courseByCode(entry.courseCode)) };
}

function transcript() {
  const raw = readJson(TRANSCRIPT_KEY, []);
  return Array.isArray(raw) ? raw.filter((entry) => courseByCode(entry.courseCode)) : [];
}

function saveRegistration(value) {
  value.updatedAt = new Date().toISOString();
  window.localStorage.setItem(REGISTRATION_KEY, JSON.stringify(value));
}

function formatDate(value, locale, withTime = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "long" }).format(date);
}

function meeting(course, locale) {
  const [start, end] = coursePeriods[course.period];
  return `${courseDays[course.day][locale]} · ${start}–${end} · ${course.room}`;
}

function currentEntry(code, records = registration()) {
  return records.entries.find((entry) => entry.courseCode === code);
}

function completedCodes() {
  return new Set(transcript().filter((entry) => entry.status !== "failed" && entry.grade !== "F").map((entry) => entry.courseCode));
}

function prerequisiteCodes(records = registration()) {
  return new Set([
    ...completedCodes(),
    ...records.entries.filter((entry) => entry.status === "enrolled").map((entry) => entry.courseCode),
  ]);
}

function selectedCredits(records = registration()) {
  return records.entries
    .filter((entry) => entry.status === "enrolled")
    .reduce((sum, entry) => sum + (courseByCode(entry.courseCode)?.credits || 0), 0);
}

function conflictsFor(course, records = registration()) {
  return records.entries
    .filter((entry) => entry.status === "enrolled" && entry.courseCode !== course.code)
    .map((entry) => courseByCode(entry.courseCode))
    .filter((other) =>
      (course.day === other.day && course.period === other.period) ||
      course.conflictsWith?.includes(other.code) ||
      other.conflictsWith?.includes(course.code),
    );
}

function eligibility(course, records = registration()) {
  const eligiblePrerequisites = prerequisiteCodes(records);
  const missing = course.prerequisites.filter((code) => !eligiblePrerequisites.has(code));
  const conflicts = conflictsFor(course, records);
  const overLimit = selectedCredits(records) + course.credits > courseTerm.creditLimit;
  return { missing, conflicts, overLimit };
}

function canRegister(course, records = registration()) {
  if (currentEntry(course.code, records)) return false;
  const result = eligibility(course, records);
  if (result.missing.length || result.conflicts.length) return false;
  return openSeats(course, records) > 0 || !course.noWaitlist;
}

function openSeats(course, records = registration()) {
  const local = currentEntry(course.code, records)?.status === "enrolled" ? 1 : 0;
  return Math.max(0, course.capacity - course.occupied - local);
}

function statusText(entry, c) {
  if (!entry) return "";
  if (entry.status === "waitlisted") return `${c.onWaitlist} · ${c.waitlistPosition} ${entry.position || 1}`;
  return c.selected;
}

function actionFor(course, locale, c, records) {
  const identity = readJson(IDENTITY_KEY, null);
  const entry = currentEntry(course.code, records);
  if (entry?.status === "enrolled") return `<button class="course-action danger" type="button" data-course-drop="${course.code}">${c.drop}</button>`;
  if (entry?.status === "waitlisted") return `<button class="course-action danger" type="button" data-course-drop="${course.code}">${c.cancelWaitlist}</button>`;
  if (!identity) return `<a class="course-action" href="mytu.html#my-tu">${c.createIdentity}</a>`;
  const result = eligibility(course, records);
  const disabledReason = result.missing.length
    ? `${c.missingPrerequisite}: ${result.missing.join(", ")}`
    : result.conflicts.length
      ? `${c.conflict}: ${result.conflicts.map((item) => item.code).join(", ")}`
      : "";
  if (disabledReason) return `<button class="course-action" type="button" disabled title="${escapeHtml(disabledReason)}">${escapeHtml(disabledReason)}</button>`;
  const seats = openSeats(course, records);
  if (!seats && course.noWaitlist) return `<button class="course-action" type="button" disabled>${c.noWaitlist}</button>`;
  return `<button class="course-action" type="button" data-course-add="${course.code}">${seats ? c.add : c.joinWaitlist}</button>`;
}

function renderCourseDetail(course, locale, c, records) {
  const entry = currentEntry(course.code, records);
  const result = eligibility(course, records);
  const seats = openSeats(course, records);
  return `
    <aside class="course-detail" style="--school-accent:${schools[course.schoolId].accent}">
      <header>
        <p>${escapeHtml(course.school[locale])}</p>
        <code>${course.code}</code>
        <h3>${escapeHtml(course.title[locale])}</h3>
        ${entry ? `<span class="course-status" data-status="${entry.status}">${statusText(entry, c)}</span>` : ""}
      </header>
      <dl>
        <div><dt>${c.instructor}</dt><dd>${escapeHtml(course.instructor[locale])}</dd></div>
        <div><dt>${c.meeting}</dt><dd>${escapeHtml(meeting(course, locale))}</dd></div>
        <div><dt>${c.creditsLabel}</dt><dd>${course.credits}</dd></div>
        <div><dt>${c.seats}</dt><dd>${seats ? `${seats} ${c.seatsOpen}` : c.full} · ${course.occupied}/${course.capacity}</dd></div>
        <div><dt>${c.prerequisite}</dt><dd>${course.prerequisites.length ? course.prerequisites.join(", ") : c.noPrerequisite}</dd></div>
      </dl>
      <blockquote>${escapeHtml(course.note[locale])}</blockquote>
      ${course.boundaryAdjacent ? `<p class="course-boundary-note">※ ${c.boundaryWarning}</p>` : ""}
      ${result.missing.length && !entry ? `<p class="course-blocker">${c.missingPrerequisite}: <strong>${result.missing.join(", ")}</strong></p>` : ""}
      ${result.conflicts.length && !entry ? `<p class="course-blocker">${c.conflict}: <strong>${result.conflicts.map((item) => item.code).join(", ")}</strong></p>` : ""}
      ${result.overLimit && !entry ? `<p class="course-overload-note">※ ${c.overloadWarning}</p>` : ""}
      ${actionFor(course, locale, c, records)}
    </aside>`;
}

function renderCatalogue(locale, c, records) {
  const query = filterQuery.toLocaleLowerCase();
  const courses = courseCatalogue.filter((course) => {
    if (filterSchool !== "all" && course.schoolId !== filterSchool) return false;
    const seats = openSeats(course, records);
    if (filterState === "eligible" && !canRegister(course, records)) return false;
    if (filterState === "open" && !seats) return false;
    if (filterState === "waitlist" && seats) return false;
    if (!query) return true;
    const haystack = [course.code, ...Object.values(course.title), ...Object.values(course.instructor), ...Object.values(course.note)].join(" ").toLocaleLowerCase();
    return haystack.includes(query);
  });
  const selected = courses.find((course) => course.code === activeCourse) || courses[0] || courseCatalogue[0];
  return `
    <section class="course-catalogue">
      <form class="course-filters" data-course-filter-form>
        <label><span>${c.search}</span><input type="search" name="query" value="${escapeHtml(filterQuery)}" placeholder="${c.search}" data-preserve-focus="course-query"></label>
        <label><span class="visually-hidden">${c.allSchools}</span><select name="school" data-preserve-focus="course-school">
          <option value="all">${c.allSchools}</option>
          ${Object.entries(schools).map(([id, school]) => `<option value="${id}" ${filterSchool === id ? "selected" : ""}>${escapeHtml(school.name[locale])}</option>`).join("")}
        </select></label>
        <label><span class="visually-hidden">${c.allStates}</span><select name="state" data-preserve-focus="course-state">
          <option value="all">${c.allStates}</option>
          <option value="eligible" ${filterState === "eligible" ? "selected" : ""}>${c.eligibleOnly}</option>
          <option value="open" ${filterState === "open" ? "selected" : ""}>${c.openOnly}</option>
          <option value="waitlist" ${filterState === "waitlist" ? "selected" : ""}>${c.waitlistOnly}</option>
        </select></label>
        <button type="submit">${c.applyFilters}</button>
      </form>
      <p class="course-result-count"><strong>${courses.length}</strong> ${c.resultCount}</p>
      <div class="course-catalogue-layout">
        <div class="course-list" role="list" data-preserve-scroll="course-list">
          ${courses.length ? courses.map((course) => {
            const entry = currentEntry(course.code, records);
            const seats = openSeats(course, records);
            return `
              <button type="button" role="listitem" class="${course.code === selected.code ? "is-active" : ""}" data-course-select="${course.code}" style="--school-accent:${schools[course.schoolId].accent}">
                <span><code>${course.code}</code><small>${course.credits} ${c.creditsLabel}</small></span>
                <strong>${escapeHtml(course.title[locale])}</strong>
                <p>${escapeHtml(course.instructor[locale])} · ${escapeHtml(courseDays[course.day][locale])} ${coursePeriods[course.period][0]}</p>
                <i data-seat-state="${seats ? "open" : "full"}">${entry ? statusText(entry, c) : seats ? `${seats} ${c.seatsOpen}` : c.full}</i>
              </button>`;
          }).join("") : `<p class="course-empty">${c.emptyCatalogue}</p>`}
        </div>
        ${courses.length ? renderCourseDetail(selected, locale, c, records) : ""}
      </div>
    </section>`;
}

function renderSchedule(locale, c, records) {
  const enrolled = records.entries.map((entry) => ({ entry, course: courseByCode(entry.courseCode) })).filter(({ entry }) => entry.status === "enrolled");
  const waitlisted = records.entries.map((entry) => ({ entry, course: courseByCode(entry.courseCode) })).filter(({ entry }) => entry.status === "waitlisted");
  return `
    <section class="course-schedule">
      <header><p>${c.weeklyGrid}</p><h3>${c.enrolledCourses}</h3></header>
      ${enrolled.length ? `<div class="course-week-grid">${enrolled
        .sort((a, b) => Object.keys(courseDays).indexOf(a.course.day) - Object.keys(courseDays).indexOf(b.course.day) || a.course.period.localeCompare(b.course.period))
        .map(({ course }) => `
          <article data-day="${course.day}" style="--school-accent:${schools[course.schoolId].accent}">
            <time>${escapeHtml(courseDays[course.day][locale])}<strong>${coursePeriods[course.period][0]}</strong></time>
            <div><code>${course.code}</code><h4>${escapeHtml(course.title[locale])}</h4><p>${escapeHtml(course.room)} · ${escapeHtml(course.instructor[locale])}</p></div>
            <button type="button" data-course-drop="${course.code}" aria-label="${c.drop} ${course.code}">×</button>
          </article>`).join("")}</div>` : `<p class="course-empty">${c.emptySchedule}</p>`}
      <p class="course-schedule-note">※ ${c.lunarFootnote}</p>
      <div class="course-waitlist">
        <h3>${c.waitlistCourses}</h3>
        ${waitlisted.length ? waitlisted.map(({ entry, course }) => `
          <article><div><code>${course.code}</code><strong>${escapeHtml(course.title[locale])}</strong><span>${c.waitlistPosition} ${entry.position || 1}</span></div><button type="button" data-course-drop="${course.code}">${c.cancelWaitlist}</button></article>`).join("") : `<p>—</p>`}
      </div>
    </section>`;
}

function gradePoint(grade) {
  return { "A+": 4.3, A: 4, "A-": 3.7, "B+": 3.3, B: 3, "B-": 2.7, "C+": 2.3, C: 2, D: 1, F: 0 }[grade];
}

function recordMetrics(records) {
  const completed = transcript();
  const graded = completed.filter((entry) => Number.isFinite(gradePoint(entry.grade)));
  const earned = completed.filter((entry) => entry.grade !== "F").reduce((sum, entry) => sum + (courseByCode(entry.courseCode)?.credits || 0), 0);
  const points = graded.reduce((sum, entry) => sum + gradePoint(entry.grade) * (courseByCode(entry.courseCode)?.credits || 0), 0);
  const credits = graded.reduce((sum, entry) => sum + (courseByCode(entry.courseCode)?.credits || 0), 0);
  return { completed, earned, gpa: credits ? (points / credits).toFixed(2) : "—", current: records.entries.filter((entry) => entry.status === "enrolled") };
}

function assessmentRows(locale) {
  const entrance = readJson("tu:exam:history", []).map((entry) => ({
    id: entry.id || "ENTRANCE",
    result: `${Number(entry.percent) || 0}%`,
    date: entry.completedAt,
  }));
  const unified = readJson("tu:gaokao:attempts", []).map((entry) => ({
    id: `${String(entry.difficultyId || "normal").toUpperCase()} · ${String(entry.trackId || "")}`,
    result: `${Number(entry.score) || 0}/${Number(entry.total) || 150}`,
    date: entry.completedAt,
  }));
  return [...entrance, ...unified].slice(-6).reverse().map((entry) => `<li><strong>${escapeHtml(entry.id)}</strong><span>${escapeHtml(entry.result)} · ${formatDate(entry.date, locale)}</span></li>`).join("");
}

function renderAcademicRecord(locale, c, records) {
  const metrics = recordMetrics(records);
  return `
    <section class="course-record">
      <div class="course-record-summary">
        <article><span>${c.standing}</span><strong>${c.firstRegistration}</strong></article>
        <article><span>${c.earnedCredits}</span><strong>${metrics.earned}</strong></article>
        <article><span>${c.gpa}</span><strong>${metrics.gpa}</strong></article>
        <article><span>${c.inProgress}</span><strong>${metrics.current.length}</strong></article>
      </div>
      <div class="course-record-columns">
        <section>
          <header><p>ACADEMIC COURSEWORK</p><h3>${c.completed}</h3></header>
          ${metrics.completed.length ? `<table><thead><tr><th>${c.codeCourse}</th><th>${c.creditsLabel}</th><th>${c.grade}</th></tr></thead><tbody>${metrics.completed.map((entry) => {
            const course = courseByCode(entry.courseCode);
            return `<tr><td><code>${course.code}</code> ${escapeHtml(course.title[locale])}</td><td>${course.credits}</td><td>${escapeHtml(entry.grade || "P")}</td></tr>`;
          }).join("")}</tbody></table>` : `<p class="course-empty">${c.noCompleted}</p>`}
        </section>
        <section>
          <header><p>NON-CREDIT DOSSIER</p><h3>${c.assessments}</h3></header>
          <ul class="course-assessments">${assessmentRows(locale) || `<li>${c.noAssessments}</li>`}</ul>
        </section>
      </div>
      <footer>
        <button class="button button-secondary" type="button" data-course-document="confirmation">${c.openConfirmation}</button>
        <button class="button button-primary" type="button" data-course-document="transcript">${c.openTranscript} <span aria-hidden="true">↗</span></button>
      </footer>
    </section>`;
}

function documentRows(mode, locale, c, records) {
  const metrics = recordMetrics(records);
  if (mode === "confirmation") {
    const entries = records.entries.map((entry) => ({ entry, course: courseByCode(entry.courseCode) }));
    return entries.length ? entries.map(({ entry, course }) => `<tr><td><code>${course.code}</code> ${escapeHtml(course.title[locale])}</td><td>${course.credits}</td><td>${entry.status === "enrolled" ? c.selected : `${c.onWaitlist} #${entry.position || 1}`}</td></tr>`).join("") : `<tr><td colspan="3">—</td></tr>`;
  }
  const completed = metrics.completed.map((entry) => {
    const course = courseByCode(entry.courseCode);
    return `<tr><td><code>${course.code}</code> ${escapeHtml(course.title[locale])}</td><td>${course.credits}</td><td>${escapeHtml(entry.grade || "P")}</td></tr>`;
  });
  const current = metrics.current.map((entry) => {
    const course = courseByCode(entry.courseCode);
    return `<tr><td><code>${course.code}</code> ${escapeHtml(course.title[locale])}</td><td>${course.credits}</td><td>IP</td></tr>`;
  });
  return [...completed, ...current].join("") || `<tr><td colspan="3">—</td></tr>`;
}

function openDocument(mode, locale, c, records) {
  const dialog = document.querySelector("[data-course-document-dialog]");
  const body = dialog?.querySelector("[data-course-document-body]");
  const identity = readJson(IDENTITY_KEY, null);
  if (!dialog || !body || !identity) {
    showToast(c.identityToast);
    return;
  }
  const metrics = recordMetrics(records);
  body.innerHTML = `
    <header><div class="course-document-crest">東</div><div><p>${c.documentUniversity}</p><span>${c.registrar}</span></div><code>${identity.id}</code></header>
    <section class="course-document-title"><p>${courseTerm.label[locale]}</p><h2>${mode === "confirmation" ? c.confirmation : c.transcript}</h2></section>
    <dl><div><dt>${c.student}</dt><dd>${escapeHtml(identity.name)}</dd></div><div><dt>${c.studentId}</dt><dd>${escapeHtml(identity.id)}</dd></div><div><dt>${c.issued}</dt><dd>${formatDate(new Date().toISOString(), locale)}</dd></div><div><dt>${c.status}</dt><dd>${mode === "confirmation" ? `${selectedCredits(records)}/${courseTerm.creditLimit} ${c.creditsLabel}` : `${c.gpa} ${metrics.gpa}`}</dd></div></dl>
    <table><thead><tr><th>${c.codeCourse}</th><th>${c.creditsLabel}</th><th>${mode === "confirmation" ? c.status : c.grade}</th></tr></thead><tbody>${documentRows(mode, locale, c, records)}</tbody></table>
    <p class="course-document-note">${c.documentNote}</p>`;
  dialog.querySelectorAll("[data-course-document-close]").forEach((button) => {
    button.setAttribute("aria-label", c.documentBack);
    if (!button.classList.contains("dialog-close")) button.textContent = c.documentBack;
  });
  const print = dialog.querySelector("[data-course-document-print]");
  if (print) print.firstChild.textContent = `${c.print} `;
  if (!dialog.open) dialog.showModal();
}

function addCourse(code, locale, c) {
  const identity = readJson(IDENTITY_KEY, null);
  if (!identity) {
    showToast(c.identityToast);
    window.location.hash = "my-tu";
    return false;
  }
  const course = courseByCode(code);
  const records = registration();
  if (!course || currentEntry(code, records)) return false;
  const result = eligibility(course, records);
  if (result.missing.length) {
    showToast(`${c.missingPrerequisite}: ${result.missing.join(", ")}`);
    return false;
  }
  if (result.conflicts.length) {
    showToast(`${c.conflict}: ${result.conflicts.map((item) => item.code).join(", ")}`);
    return false;
  }
  const now = new Date().toISOString();
  const seats = openSeats(course, records);
  if (!seats && course.noWaitlist) {
    showToast(c.unavailableToast);
    return false;
  }
  const status = seats ? "enrolled" : "waitlisted";
  const entry = { courseCode: code, status, createdAt: now };
  if (status === "waitlisted") entry.position = Math.max(1, course.occupied - course.capacity + 1);
  records.entries.push(entry);
  saveRegistration(records);
  recordCampusEvent(
    status === "enrolled" ? "course.enrolled" : "course.waitlisted",
    { courseCode: code, term: courseTerm.id, credits: course.credits, position: entry.position },
    { id: `course.${status}:${courseTerm.id}:${code}`, timestamp: now },
  );
  showToast(status === "enrolled"
    ? selectedCredits(records) > courseTerm.creditLimit ? c.overloadToast : c.registeredToast
    : c.waitlistedToast);
  return true;
}

function dropCourse(code, c) {
  const records = registration();
  const entry = currentEntry(code, records);
  if (!entry) return false;
  const now = new Date().toISOString();
  records.entries = records.entries.filter((item) => item.courseCode !== code);
  saveRegistration(records);
  recordCampusEvent(
    entry.status === "enrolled" ? "course.dropped" : "course.waitlist.cancelled",
    { courseCode: code, term: courseTerm.id },
    { id: `course.${entry.status === "enrolled" ? "dropped" : "waitlist.cancelled"}:${courseTerm.id}:${code}:${now}`, timestamp: now },
  );
  showToast(entry.status === "enrolled" ? c.droppedToast : c.cancelledToast);
  return true;
}

function bind(app, rerender) {
  const locale = getLocale();
  const c = copy[locale];
  const rerenderCurrent = () => renderPreservingState(app, rerender, { preserveWindow: true });
  const rerenderInPlace = (courseCode, action) => {
    if (courseCode) activeCourse = courseCode;
    mutateAndRenderPreservingState(app, action, rerender, { preserveWindow: true });
  };
  app.querySelectorAll("[data-course-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      activeTab = button.dataset.courseTab;
      rerenderCurrent();
    });
  });
  app.querySelector("[data-course-filter-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    filterQuery = String(values.get("query") || "").trim();
    filterSchool = String(values.get("school") || "all");
    filterState = String(values.get("state") || "all");
    rerenderCurrent();
  });
  app.querySelector("[data-course-filter-form]")?.addEventListener("change", (event) => {
    if (!event.target.matches("select")) return;
    const form = event.currentTarget;
    filterQuery = String(form.elements.query.value || "").trim();
    filterSchool = form.elements.school.value || "all";
    filterState = form.elements.state.value || "all";
    rerenderCurrent();
  });
  app.querySelectorAll("[data-course-select]").forEach((button) => {
    button.addEventListener("click", () => {
      rerenderInPlace(button.dataset.courseSelect);
    });
  });
  app.querySelectorAll("[data-course-add]").forEach((button) => {
    button.addEventListener("click", () => rerenderInPlace(button.dataset.courseAdd, () => addCourse(button.dataset.courseAdd, locale, c)));
  });
  app.querySelectorAll("[data-course-drop]").forEach((button) => {
    button.addEventListener("click", () => rerenderInPlace(button.dataset.courseDrop, () => dropCourse(button.dataset.courseDrop, c)));
  });
  app.querySelectorAll("[data-course-document]").forEach((button) => {
    button.addEventListener("click", () => openDocument(button.dataset.courseDocument, locale, c, registration()));
  });
}

export function courseRegistrationSummary() {
  const records = registration();
  return {
    enrolled: records.entries.filter((entry) => entry.status === "enrolled").length,
    waitlisted: records.entries.filter((entry) => entry.status === "waitlisted").length,
    credits: selectedCredits(records),
  };
}

export function renderCourseRegistration(app, rerender) {
  const locale = getLocale();
  const c = copy[locale];
  const records = registration();
  const summary = courseRegistrationSummary();
  const identity = readJson(IDENTITY_KEY, null);
  const routeCode = decodeURIComponent(window.location.hash.slice(1)).match(/^course-(.+)$/)?.[1];
  if (routeCode && courseByCode(routeCode) && positionedRoute !== routeCode) {
    activeCourse = routeCode;
    activeTab = "catalogue";
  }
  if (!routeCode) positionedRoute = "";
  app.innerHTML = `
    <header class="course-heading">
      <div><p>${c.eyebrow}</p><h2>${c.title}</h2></div>
      <p>${c.lead}</p>
    </header>
    <nav class="mytu-mode-nav" aria-label="My TU">
      <a href="mytu.html#my-tu">${c.records}</a>
      <a href="mytu.html#course-registration" aria-current="page">${c.registration}</a>
    </nav>
    <div class="course-term-strip">
      <div><span>${c.term}</span><strong>${courseTerm.label[locale]}</strong><small>${courseTerm.addDeadline[locale]} · ${courseTerm.dropDeadline[locale]}</small></div>
      <dl>
        <div><dt>${c.credits}</dt><dd>${summary.credits}<small> / ${courseTerm.creditLimit}*</small></dd></div>
        <div><dt>${c.enrolled}</dt><dd>${summary.enrolled}</dd></div>
        <div><dt>${c.waitlisted}</dt><dd>${summary.waitlisted}</dd></div>
      </dl>
      <p><strong>${c.local}</strong><span>${summary.credits > courseTerm.creditLimit ? c.overloadWarning : c.privacy}</span></p>
    </div>
    ${!identity ? `<aside class="course-identity-notice"><p>${c.missingIdentity}</p><a class="button button-primary" href="mytu.html#my-tu">${c.createIdentity} <span aria-hidden="true">→</span></a></aside>` : ""}
    <div class="course-tabs" role="tablist">
      <button type="button" role="tab" aria-selected="${activeTab === "catalogue"}" data-course-tab="catalogue">${c.catalogue}<span>35</span></button>
      <button type="button" role="tab" aria-selected="${activeTab === "schedule"}" data-course-tab="schedule">${c.schedule}<span>${summary.enrolled}</span></button>
      <button type="button" role="tab" aria-selected="${activeTab === "record"}" data-course-tab="record">${c.academicRecord}<span>${transcript().length}</span></button>
    </div>
    <div class="course-panel" role="tabpanel">
      ${activeTab === "catalogue" ? renderCatalogue(locale, c, records) : activeTab === "schedule" ? renderSchedule(locale, c, records) : renderAcademicRecord(locale, c, records)}
    </div>`;
  bind(app, rerender);
  if (routeCode && positionedRoute !== routeCode) {
    positionedRoute = routeCode;
    window.requestAnimationFrame(() => document.querySelector("#my-tu")?.scrollIntoView({ block: "start" }));
  }
}

export function initCourseDocumentDialog() {
  const dialog = document.querySelector("[data-course-document-dialog]");
  if (!dialog || dialog.dataset.bound === "true") return;
  dialog.dataset.bound = "true";
  dialog.querySelectorAll("[data-course-document-close]").forEach((button) => button.addEventListener("click", () => dialog.close()));
  dialog.querySelector("[data-course-document-print]")?.addEventListener("click", () => window.print());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}
