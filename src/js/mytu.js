import { identityKinds, originKinds, committeeBySchool, reviewerCommentary, reviewers } from "../data/mytu.js";
import { schools } from "../data/schools.js";
import { campusLedger, recordCampusEvent, syncCampusLedger } from "./campus-ledger.js";
import {
  courseRegistrationSummary,
  initCourseDocumentDialog,
  renderCourseRegistration,
} from "./course-registration.js";
import { academicGradebook } from "./academic-model.js";
import { initAcademicDocumentDialog, renderAcademicWorkbench } from "./academic-work.js";
import { getLocale } from "./i18n.js";
import { printDocument } from "./print-document.js";
import { showToast } from "./ui.js";
import { safeDecodeFragment } from "./url-state.js";

const IDENTITY_KEY = "tu:identity";
const REVIEW_KEY = "tu:application:reviews";
const SELECTED_APPLICATION_KEY = "tu:mytu:selected-application";

const copy = {
  "zh-Hant": {
    eyebrow: "MY TU / 幻想鄉學籍中心",
    title: "同一台裝置上，留下一條真正的校園生命線。",
    lead: "把申請、考試、進校預約與發帖收進同一份本機學籍；資料不離開這個瀏覽器。",
    createTitle: "先建立你的本機校園身分",
    createLead: "已有的申請與成績不會被改動；建立身分後，它們會被編入同一份校園履歷。",
    found: "已找到可編入履歷的本機記錄",
    name: "姓名或通稱",
    kind: "種族／身分",
    origin: "來處",
    school: "志願學院",
    lunar: "滿月時需要低刺激、改道或其他安排",
    housing: "住宿、飛行翅展、使魔、水域或穿牆需求",
    housingPlaceholder: "可留白；之後仍能修改。",
    create: "建立 My TU 身分",
    save: "保存身分資料",
    edit: "編輯本機身分",
    cancel: "取消",
    privacy: "只儲存在這台裝置，不會上傳姓名、聯絡方式或申請內容。",
    identitySaved: "My TU 身分已保存在這台裝置。",
    localId: "本機學籍編號",
    stage: "目前階段",
    preferredSchool: "志願",
    recordSummary: "校園履歷摘要",
    applications: "入學申請",
    exams: "已完成試卷",
    visits: "進校預約",
    posts: "BBS 發帖",
    courses: "本學期課程",
    library: "借閱／預約",
    residential: "宿舍／換房",
    incidents: "事件研究／結案",
    academicRecords: "課業評量／答辯",
    medical: "診療／處方／康復",
    appraisals: "漂流物鑑定",
    recordsMode: "學籍首頁",
    courseMode: "選課與成績",
    academicMode: "作業、考試與答辯",
    drafts: "未完成",
    applicationReview: "教授聯合審查",
    reviewLead: "審查會讀取所選申請的研究問題、方法、需求與本機最佳考試成績，產生可再次開啟的校內評議。",
    reviewQuestion: "研究問題判讀",
    reviewMethod: "方法與證據判讀",
    reviewNeeds: "現場條件判讀",
    noDeclaredNeeds: "未另列現場需求；委員仍可能自行加註。",
    noApplication: "尚無已提交申請。先完成一份填報，教授才有東西可以爭論。",
    openApplication: "開始線上填報",
    chooseApplication: "選擇審查檔案",
    submitted: "提交",
    runReview: "召集教授聯合審查",
    reviewed: "評議完成",
    dossierScore: "檔案綜合判讀",
    examEvidence: "本機考試參考",
    noExam: "尚無考試成績",
    stanceApprove: "建議通過",
    stanceCondition: "附帶條件",
    stanceRevise: "要求補正",
    printDecision: "開啟可列印校務通知書",
    timeline: "校園事件帳本",
    timelineLead: "記錄發生、提交、訂正與被移除；刪除原始卡片不會假裝事件從未存在。",
    noEvents: "事件帳本尚無記錄。",
    contestedClosure: "紅線爭議案卷",
    next: "下一步",
    nextApplication: "提交一份入學申請，讓這個身分進入申請生階段。",
    nextReview: "把申請送入教授聯合審查；他們不保證彼此同意。",
    nextExam: "繼續考試或補交審查條件，讓錄取狀態向前推進。",
    goExam: "前往入學試驗",
    goGaokao: "前往幻想鄉統一學力試驗",
    outcome: {
      admitted: "正式錄取",
      conditional: "有條件錄取",
      supplement: "補交研究計畫",
      interview: "進入面試",
    },
    outcomeBody: {
      admitted: "評議同意直接進入新生報到；仍須遵守各研究室列出的現場條件。",
      conditional: "保留入學名額；完成指定方法補件與安全條件後轉為正式錄取。",
      supplement: "問題值得保留，但方法尚不足以識別主張。補件後由原委員會重審。",
      interview: "書面材料無法消除主要分歧；請在符卡式面試中說明取捨與停止條件。",
    },
    stages: {
      profile: "校園身分已建立",
      applicant: "申請生",
      conditional: "有條件錄取",
      admitted: "新生",
      supplement: "待補件申請生",
      interview: "面試候選人",
    },
    events: {
      "identity.created": "建立本機校園身分",
      "identity.updated": "更新本機身分資料",
      "application.submitted": "提交入學申請",
      "application.reviewed": "完成教授聯合審查",
      "application.deleted": "從本機申請檔案移除記錄",
      "visit.reserved": "登記進校預約",
      "visit.deleted": "從本機預約檔案移除記錄",
      "exam.completed": "完成入學試驗",
      "exam.deleted": "從本機試驗檔案移除成績",
      "gaokao.completed": "完成幻想鄉統一學力試驗",
      "gaokao.deleted": "從本機統一試驗檔案移除成績",
      "bbs.posted": "在校園 BBS 發帖",
      "course.enrolled": "加入本學期課表",
      "course.waitlisted": "加入課程候補",
      "course.dropped": "退選本學期課程",
      "course.waitlist.cancelled": "取消課程候補",
      "book.borrowed": "借出霧湖館藏",
      "book.renewed": "續借霧湖館藏",
      "book.returned": "歸還霧湖館藏",
      "book.held": "預約霧湖館藏",
      "book.hold.cancelled": "取消館藏預約",
      "housing.application.submitted": "提交住宿需求",
      "housing.offer.declined": "略過分房建議",
      "housing.assignment.accepted": "接受宿舍房間",
      "housing.change.requested": "提交換房請求",
      "housing.change.cancelled": "撤回換房請求",
      "incident.experiment.completed": "完成事件研究模擬",
      "incident.resolved": "結案並發布事件連動",
      "governance.vote.cast": "投下本機校務議事票",
      "academic.assignment.graded": "提交課程作業並完成判分",
      "academic.exam.started": "開始限時課程考試",
      "academic.exam.completed": "完成限時課程考試",
      "academic.project.submitted": "提交論文／符卡研究計畫",
      "academic.defence.completed": "完成論文／符卡答辯",
      "clinic.visit.checked-in": "完成校醫院分診掛號",
      "clinic.consultation.completed": "完成診察並開立處方",
      "clinic.prescription.dispensed": "領取校醫院處方",
      "clinic.dose.recorded": "記錄一次本機用藥",
      "clinic.therapy.started": "開始康復療法",
      "clinic.therapy.step.completed": "完成一項康復步驟",
      "clinic.therapy.completed": "完成康復療程",
      "appraisal.completed": "完成外界漂流物鑑定",
      "appraisal.catalogued": "將漂流物編入霧湖館藏",
    },
    document: {
      university: "幻想鄉立東方大學",
      office: "入學選拔聯合評議會",
      admission: "錄取通知書",
      decision: "選拔結果通知書",
      certifies: "茲通知下列申請人之 2026 秋季選拔結果",
      applicant: "申請人",
      application: "申請編號",
      review: "評議編號",
      school: "錄取／審查學院",
      result: "評議結果",
      conditions: "後續條件",
      issued: "發文日期",
      signatures: "聯合評議委員",
      verification: "本機驗證紋",
      footer: "本文件由 My TU 本機學籍中心依已保存的申請與評議生成；查驗時應同時核對申請編號與評議編號。",
      print: "列印／另存 PDF",
      close: "返回 My TU",
    },
  },
  ja: {
    eyebrow: "MY TU / 幻想郷学籍センター",
    title: "この端末に、一つのキャンパス人生を残す。",
    lead: "出願、試験、来校予約、投稿を一つの端末内学籍へ。データはこのブラウザから出ません。",
    createTitle: "端末内キャンパス身分を作成",
    createLead: "既存の出願や成績は変更せず、同じキャンパス履歴へ編入します。",
    found: "履歴へ編入できる端末内記録",
    name: "氏名・通称",
    kind: "種族／身分",
    origin: "出身",
    school: "志望学部",
    lunar: "満月時に低刺激・迂回その他の配慮が必要",
    housing: "住居、翼幅、使い魔、水域、壁抜け等の希望",
    housingPlaceholder: "空欄可。後から変更できます。",
    create: "My TU 身分を作成",
    save: "身分情報を保存",
    edit: "端末内身分を編集",
    cancel: "取消",
    privacy: "この端末だけに保存し、氏名・連絡先・出願内容を送信しません。",
    identitySaved: "My TU 身分をこの端末へ保存しました。",
    localId: "端末内学籍番号",
    stage: "現在段階",
    preferredSchool: "志望",
    recordSummary: "キャンパス履歴概要",
    applications: "入学出願",
    exams: "完了試験",
    visits: "来校予約",
    posts: "BBS 投稿",
    courses: "今学期の履修",
    library: "貸出／予約",
    residential: "学生寮／転室",
    incidents: "事案研究／終結",
    academicRecords: "課業評価／答弁",
    medical: "診療／処方／回復",
    appraisals: "漂流物鑑定",
    recordsMode: "学籍ホーム",
    courseMode: "履修・成績",
    academicMode: "課題・試験・答弁",
    drafts: "未完了",
    applicationReview: "教員合同審査",
    reviewLead: "選択した出願の問い・方法・希望と端末内最高試験成績を読み、再閲覧可能な学内評議を作成します。",
    reviewQuestion: "研究課題の読解",
    reviewMethod: "方法・証拠の読解",
    reviewNeeds: "現場条件の読解",
    noDeclaredNeeds: "現場希望の記載なし。委員による追記はあり得ます。",
    noApplication: "提出済み出願がありません。まず一件提出し、教員が議論できる材料を用意してください。",
    openApplication: "オンライン出願へ",
    chooseApplication: "審査ファイルを選択",
    submitted: "提出",
    runReview: "教員合同審査を招集",
    reviewed: "評議完了",
    dossierScore: "書類総合判定",
    examEvidence: "端末内試験資料",
    noExam: "試験成績なし",
    stanceApprove: "通過を推奨",
    stanceCondition: "条件付き",
    stanceRevise: "補正要求",
    printDecision: "印刷用学務通知を開く",
    timeline: "キャンパス事件台帳",
    timelineLead: "発生、提出、訂正、削除を記録。元カードを消しても出来事を無かったことにはしません。",
    noEvents: "事件台帳に記録はありません。",
    contestedClosure: "赤糸係争記録",
    next: "次の手続",
    nextApplication: "入学出願を提出し、この身分を志願者段階へ進めます。",
    nextReview: "出願を合同審査へ。教員同士の合意は保証されません。",
    nextExam: "試験または審査条件の補足を続け、合格状態を進めます。",
    goExam: "入学試験へ",
    goGaokao: "幻想郷統一試験へ",
    outcome: { admitted: "正式合格", conditional: "条件付合格", supplement: "研究計画補充", interview: "面接へ" },
    outcomeBody: {
      admitted: "評議は新入生手続への直接進行を承認。各研究室の現場条件は引き続き適用されます。",
      conditional: "入学枠を保留。指定の方法補充と安全条件を満たした後、正式合格へ移行します。",
      supplement: "問いは保存に値するが、方法が主張を識別できていません。補充後に同委員会が再審査します。",
      interview: "書面では主要な不一致を解消できません。スペルカード式面接で選択と停止条件を説明してください。",
    },
    stages: {
      profile: "キャンパス身分作成済",
      applicant: "志願者",
      conditional: "条件付合格",
      admitted: "新入生",
      supplement: "補充待ち志願者",
      interview: "面接候補者",
    },
    events: {
      "identity.created": "端末内キャンパス身分を作成",
      "identity.updated": "端末内身分情報を更新",
      "application.submitted": "入学出願を提出",
      "application.reviewed": "教員合同審査を完了",
      "application.deleted": "端末内出願ファイルから記録を削除",
      "visit.reserved": "来校予約を登録",
      "visit.deleted": "端末内予約ファイルから記録を削除",
      "exam.completed": "入学試験を完了",
      "exam.deleted": "端末内試験ファイルから成績を削除",
      "gaokao.completed": "幻想郷統一試験を完了",
      "gaokao.deleted": "端末内統一試験ファイルから成績を削除",
      "bbs.posted": "学内 BBS へ投稿",
      "course.enrolled": "今学期の時間割へ追加",
      "course.waitlisted": "科目補欠へ登録",
      "course.dropped": "今学期の履修を取消",
      "course.waitlist.cancelled": "科目補欠を取消",
      "book.borrowed": "霧の湖資料を貸出",
      "book.renewed": "霧の湖資料を更新",
      "book.returned": "霧の湖資料を返却",
      "book.held": "霧の湖資料を予約",
      "book.hold.cancelled": "資料予約を取消",
      "housing.application.submitted": "入寮希望を提出",
      "housing.offer.declined": "配室案を見送る",
      "housing.assignment.accepted": "学生寮の部屋を受諾",
      "housing.change.requested": "転室依頼を提出",
      "housing.change.cancelled": "転室依頼を撤回",
      "incident.experiment.completed": "事案研究シミュレーションを完了",
      "incident.resolved": "事案を終結し連動を公開",
      "governance.vote.cast": "端末内学務議事票を投票",
      "academic.assignment.graded": "授業課題を提出・採点",
      "academic.exam.started": "計時授業試験を開始",
      "academic.exam.completed": "計時授業試験を完了",
      "academic.project.submitted": "論文／スペルカード研究計画を提出",
      "academic.defence.completed": "論文／スペルカード答弁を完了",
      "clinic.visit.checked-in": "校医院トリアージ受付を完了",
      "clinic.consultation.completed": "診察完了・処方発行",
      "clinic.prescription.dispensed": "校医院処方を受取",
      "clinic.dose.recorded": "端末内服用を一回記録",
      "clinic.therapy.started": "回復療法を開始",
      "clinic.therapy.step.completed": "回復段階を一つ完了",
      "clinic.therapy.completed": "回復療法を完了",
      "appraisal.completed": "外界漂流物鑑定を完了",
      "appraisal.catalogued": "漂流物を霧の湖蔵書へ編入",
    },
    document: {
      university: "幻想郷立東方大学",
      office: "入学選抜合同評議会",
      admission: "合格通知書",
      decision: "選抜結果通知書",
      certifies: "下記志願者の2026年秋季選抜結果を通知します",
      applicant: "志願者",
      application: "出願番号",
      review: "評議番号",
      school: "合格／審査学部",
      result: "評議結果",
      conditions: "今後の条件",
      issued: "発行日",
      signatures: "合同評議委員",
      verification: "端末内検証紋",
      footer: "本書は My TU 端末内学籍センターが保存済み出願・評議から生成しました。照合時は出願番号と評議番号を確認してください。",
      print: "印刷／PDF保存",
      close: "My TU へ戻る",
    },
  },
  en: {
    eyebrow: "MY TU / STUDENT RECORDS",
    title: "Keep one continuous campus life on this device.",
    lead: "Applications, exams, visits, and posts become one on-device student record. Nothing leaves this browser.",
    createTitle: "Create your on-device campus identity",
    createLead: "Existing applications and scores stay unchanged; they will be compiled into the same campus history.",
    found: "On-device records ready to compile",
    name: "Name or known name",
    kind: "Species / identity",
    origin: "Origin",
    school: "Preferred school",
    lunar: "I need low-stimulus, rerouting, or other full-moon arrangements",
    housing: "Housing, wingspan, familiar, aquatic, or phasing needs",
    housingPlaceholder: "Optional; you can change this later.",
    create: "Create My TU identity",
    save: "Save identity",
    edit: "Edit on-device identity",
    cancel: "Cancel",
    privacy: "Stored only on this device. Names, contacts, and application content are not uploaded.",
    identitySaved: "My TU identity saved on this device.",
    localId: "On-device student number",
    stage: "Current stage",
    preferredSchool: "Preference",
    recordSummary: "Campus record summary",
    applications: "Applications",
    exams: "Completed exams",
    visits: "Campus visits",
    posts: "BBS posts",
    courses: "Current courses",
    library: "Loans / holds",
    residential: "Housing / transfers",
    incidents: "Incident studies / closures",
    academicRecords: "Coursework / defences",
    medical: "Care / prescriptions / recovery",
    appraisals: "Drift-object appraisals",
    recordsMode: "Student record",
    courseMode: "Courses & grades",
    academicMode: "Work, exams & defences",
    drafts: "Unfinished",
    applicationReview: "Joint faculty review",
    reviewLead: "The panel reads the selected question, method, needs, and best on-device exam result, then saves a reopenable internal review.",
    reviewQuestion: "Reading of the question",
    reviewMethod: "Reading of method and evidence",
    reviewNeeds: "Reading of field conditions",
    noDeclaredNeeds: "No field needs were declared; the panel may still attach its own.",
    noApplication: "No application has been submitted. Complete one first, so the faculty have something to disagree about.",
    openApplication: "Start online application",
    chooseApplication: "Choose dossier",
    submitted: "Submitted",
    runReview: "Convene joint faculty review",
    reviewed: "Review complete",
    dossierScore: "Dossier reading",
    examEvidence: "On-device exam evidence",
    noExam: "No exam score yet",
    stanceApprove: "Recommend admission",
    stanceCondition: "Conditions attached",
    stanceRevise: "Revision required",
    printDecision: "Open printable decision letter",
    timeline: "Campus event ledger",
    timelineLead: "Records events, submissions, corrections, and removals. Deleting a source card does not pretend the event never happened.",
    noEvents: "The event ledger is empty.",
    contestedClosure: "Red-thread contested file",
    next: "Next step",
    nextApplication: "Submit an application to move this identity into applicant status.",
    nextReview: "Send the application to joint review. Agreement among faculty is not guaranteed.",
    nextExam: "Continue exams or satisfy review conditions to advance the decision.",
    goExam: "Go to entrance exam",
    goGaokao: "Go to Gensokyo exam",
    outcome: { admitted: "Admitted", conditional: "Conditional Admission", supplement: "Research Plan Required", interview: "Proceed to Interview" },
    outcomeBody: {
      admitted: "The panel approves direct progression to new-student registration; each laboratory's field conditions still apply.",
      conditional: "A place is reserved. Complete the specified method revision and safety conditions to convert it to full admission.",
      supplement: "The question is worth keeping, but the method cannot yet identify the claim. The same panel will review a supplement.",
      interview: "The written dossier cannot resolve the central disagreement. Explain trade-offs and stop conditions in a spell-card interview.",
    },
    stages: {
      profile: "Campus identity created",
      applicant: "Applicant",
      conditional: "Conditional Admit",
      admitted: "New Student",
      supplement: "Supplement Pending",
      interview: "Interview Candidate",
    },
    events: {
      "identity.created": "Created on-device campus identity",
      "identity.updated": "Updated on-device identity",
      "application.submitted": "Submitted an application",
      "application.reviewed": "Completed joint faculty review",
      "application.deleted": "Removed a record from the on-device application file",
      "visit.reserved": "Reserved a campus visit",
      "visit.deleted": "Removed a record from the on-device visit file",
      "exam.completed": "Completed an entrance exam",
      "exam.deleted": "Removed a score from the on-device entrance-exam file",
      "gaokao.completed": "Completed the Gensokyo unified exam",
      "gaokao.deleted": "Removed a score from the on-device unified-exam file",
      "bbs.posted": "Published to Campus BBS",
      "course.enrolled": "Added a course to the term timetable",
      "course.waitlisted": "Joined a course waitlist",
      "course.dropped": "Dropped a current course",
      "course.waitlist.cancelled": "Left a course waitlist",
      "book.borrowed": "Borrowed library holding",
      "book.renewed": "Renewed library holding",
      "book.returned": "Returned library holding",
      "book.held": "Placed library hold",
      "book.hold.cancelled": "Cancelled library hold",
      "housing.application.submitted": "Submitted housing needs",
      "housing.offer.declined": "Passed on a room offer",
      "housing.assignment.accepted": "Accepted a residence room",
      "housing.change.requested": "Submitted a room-transfer request",
      "housing.change.cancelled": "Withdrew a room-transfer request",
      "incident.experiment.completed": "Completed an incident research simulation",
      "incident.resolved": "Closed a case and published linked reactions",
      "governance.vote.cast": "Cast an on-device governance vote",
      "academic.assignment.graded": "Submitted and graded course work",
      "academic.exam.started": "Started a timed course exam",
      "academic.exam.completed": "Completed a timed course exam",
      "academic.project.submitted": "Submitted a thesis / spell-card project",
      "academic.defence.completed": "Completed a thesis / spell-card defence",
      "clinic.visit.checked-in": "Completed campus-hospital triage check-in",
      "clinic.consultation.completed": "Completed consultation and received a prescription",
      "clinic.prescription.dispensed": "Collected a campus-hospital prescription",
      "clinic.dose.recorded": "Recorded one on-device dose",
      "clinic.therapy.started": "Started a recovery therapy",
      "clinic.therapy.step.completed": "Completed one recovery step",
      "clinic.therapy.completed": "Completed a recovery course",
      "appraisal.completed": "Completed an Outside drift-object appraisal",
      "appraisal.catalogued": "Catalogued a drift object at Misty Lake",
    },
    document: {
      university: "TOUHOU UNIVERSITY OF GENSOKYO",
      office: "Joint Admissions Review Council",
      admission: "LETTER OF ADMISSION",
      decision: "SELECTION DECISION",
      certifies: "Notice of the Autumn 2026 selection result for",
      applicant: "Applicant",
      application: "Application reference",
      review: "Review reference",
      school: "Admitting / reviewing school",
      result: "Decision",
      conditions: "Next conditions",
      issued: "Issued",
      signatures: "Joint reviewers",
      verification: "On-device verification weave",
      footer: "Generated by the My TU on-device student-record centre from the saved application and review. Verify both the application and review references.",
      print: "Print / Save PDF",
      close: "Back to My TU",
    },
  },
};

const app = document.querySelector("[data-mytu-app]");
const documentDialog = document.querySelector("[data-mytu-document-dialog]");
const documentBody = documentDialog?.querySelector("[data-mytu-document]");
let editingIdentity = false;
let openDocumentApplicationId = null;
let academicWorkbenchCleanup = null;

function readJson(key, fallback) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || "null");
    return value ?? fallback;
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

function hashValue(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function localStudentId(name, createdAt) {
  const date = new Date(createdAt);
  const stamp = `${String(date.getFullYear()).slice(-2)}${String(date.getMonth() + 1).padStart(2, "0")}`;
  return `TU-S-${stamp}-${hashValue(`${name}:${createdAt}`).toString(36).slice(0, 5).toUpperCase().padEnd(5, "0")}`;
}

function formatDate(value, locale, withTime = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "long" }).format(date);
}

function allRecords() {
  const applications = readJson("tu:application:submissions", []);
  const reviews = readJson(REVIEW_KEY, []);
  const visits = readJson("tu:visits", []);
  const entranceExams = readJson("tu:exam:history", []);
  const unifiedExams = readJson("tu:gaokao:attempts", []);
  const posts = readJson("tu:bbs:posts", []);
  const libraryLoans = readJson("tu:library:loans", []);
  const libraryHolds = readJson("tu:library:holds", []);
  const housingApplications = readJson("tu:housing:applications", []);
  const housingAssignments = readJson("tu:housing:assignments", []);
  const housingChanges = readJson("tu:housing:room-changes", []);
  const incidentExperiments = readJson("tu:incidents:experiments", []);
  const incidentResolutions = readJson("tu:incidents:resolutions", []);
  const academicSubmissions = readJson("tu:academics:submissions", []);
  const academicExamAttempts = readJson("tu:academics:exam-attempts", []);
  const academicDefences = readJson("tu:academics:defences", []);
  const clinicVisits = readJson("tu:clinic:visits", []);
  const clinicPrescriptions = readJson("tu:clinic:prescriptions", []);
  const clinicPlans = readJson("tu:clinic:care-plans", []);
  const appraisalRecords = readJson("tu:appraisal:records", []);
  const appraisalDrafts = readJson("tu:appraisal:drafts", {});
  const examCount = entranceExams.length + unifiedExams.length;
  const drafts = Number(Boolean(readJson("tu:application:draft", null))) +
    Number(Boolean(readJson("tu:visit:draft", null))) +
    Number(Boolean(readJson("tu:gaokao:draft", null)));
  const housingDraft = Number(Boolean(readJson("tu:housing:draft", null)));
  const clinicDraft = Number(Boolean(readJson("tu:clinic:triage-draft", null)));
  const courseSummary = courseRegistrationSummary();
  const academicBook = academicGradebook();
  const activeLibrary = (Array.isArray(libraryLoans) ? libraryLoans : []).filter((record) => record.status === "active").length
    + (Array.isArray(libraryHolds) ? libraryHolds : []).filter((record) => record.status === "active").length;
  const activeHousing = (Array.isArray(housingAssignments) ? housingAssignments : []).filter((record) => record.status === "active").length
    + (Array.isArray(housingChanges) ? housingChanges : []).filter((record) => record.status === "under-review").length;
  return {
    applications,
    reviews,
    visits,
    entranceExams,
    unifiedExams,
    posts,
    examCount,
    drafts: drafts + housingDraft + clinicDraft
      + Object.keys(appraisalDrafts && typeof appraisalDrafts === "object" && !Array.isArray(appraisalDrafts) ? appraisalDrafts : {}).length,
    courseSummary,
    activeLibrary,
    housingApplications,
    activeHousing,
    incidentRecords: (Array.isArray(incidentExperiments) ? incidentExperiments : []).length
      + (Array.isArray(incidentResolutions) ? incidentResolutions : []).length,
    academicRecords: (Array.isArray(academicSubmissions) ? academicSubmissions : []).length
      + (Array.isArray(academicExamAttempts) ? academicExamAttempts : []).length
      + (Array.isArray(academicDefences) ? academicDefences : []).length,
    academicAverage: academicBook.average,
    activeClinic: (Array.isArray(clinicVisits) ? clinicVisits : []).filter((record) => record.status === "waiting").length
      + (Array.isArray(clinicPrescriptions) ? clinicPrescriptions : []).filter((record) => ["issued", "dispensed"].includes(record.status)).length
      + (Array.isArray(clinicPlans) ? clinicPlans : []).filter((record) => record.status === "active").length,
    appraisalRecords: Array.isArray(appraisalRecords) ? appraisalRecords.length : 0,
  };
}

function bestExam(records, locale, c) {
  const entrance = records.entranceExams
    .filter((record) => Number.isFinite(record.percent))
    .sort((a, b) => b.percent - a.percent)[0];
  const unified = records.unifiedExams
    .filter((record) => Number.isFinite(record.score))
    .sort((a, b) => b.score - a.score)[0];
  const evidence = [];
  if (entrance) evidence.push(`${entrance.percent}%`);
  if (unified) evidence.push(`${String(unified.difficultyId || "normal").toUpperCase()} ${unified.score}/${unified.total || 150}`);
  return evidence.length ? evidence.join(" · ") : c.noExam;
}

function dossierScore(application, records) {
  const entranceBest = Math.max(0, ...records.entranceExams.map((record) => Number(record.percent) || 0));
  const unifiedBest = Math.max(
    0,
    ...records.unifiedExams.map((record) => ((Number(record.score) || 0) / (Number(record.total) || 150)) * 100),
  );
  const question = Math.min(12, String(application.question || "").trim().length / 8);
  const method = Math.min(12, String(application.method || "").trim().length / 8);
  const evidence = Math.max(entranceBest, unifiedBest) * 0.2;
  const needs = String(application.needs || "").trim() ? 3 : 0;
  return Math.min(100, Math.round(52 + question + method + evidence + needs));
}

function applicationReviewRemarks(application, committee) {
  const lenses = ["question", "method", "needs"];
  return committee.map((memberId, index) => {
    const lens = lenses[index % lenses.length];
    const source = String(application[lens] || "").trim();
    return {
      memberId,
      lens,
      excerpt: source.slice(0, 220),
      commentary: reviewerCommentary[memberId]?.[lens] || reviewers[memberId]?.note,
    };
  });
}

function outcomeFor(score) {
  if (score >= 84) return "admitted";
  if (score >= 65) return "conditional";
  if (score >= 53) return "supplement";
  return "interview";
}

function reviewFor(applicationId, records) {
  return records.reviews.find((review) => review.applicationId === applicationId);
}

function stageFor(identity, records) {
  if (!identity) return "profile";
  const latestApplication = records.applications.at(-1);
  if (!latestApplication) return "profile";
  return reviewFor(latestApplication.id, records)?.outcome || "applicant";
}

function schoolName(id, locale) {
  return schools[id]?.name?.[locale] || id || "—";
}

function identityForm(identity, records, locale, c) {
  const source = identity || records.applications.at(-1) || {};
  const preferredSchool = identity?.preferredSchool || source.school || "boundary";
  const name = identity?.name || source.name || "";
  return `
    <header class="mytu-heading">
      <div><p>${c.eyebrow}</p><h2>${identity ? c.edit : c.createTitle}</h2></div>
      <p>${identity ? c.privacy : c.createLead}</p>
    </header>
    <div class="mytu-onboarding">
      <aside>
        <span aria-hidden="true">學</span>
        <p>${c.found}</p>
        <strong>${records.applications.length + records.examCount + records.visits.length + records.posts.length}</strong>
        <dl>
          <div><dt>${c.applications}</dt><dd>${records.applications.length}</dd></div>
          <div><dt>${c.exams}</dt><dd>${records.examCount}</dd></div>
          <div><dt>${c.visits}</dt><dd>${records.visits.length}</dd></div>
          <div><dt>${c.posts}</dt><dd>${records.posts.length}</dd></div>
        </dl>
      </aside>
      <form class="mytu-profile-form" data-mytu-profile-form>
        <label>${c.name}<input name="name" maxlength="60" required value="${escapeHtml(name)}"></label>
        <label>${c.kind}<select name="kind">${Object.entries(identityKinds).map(([id, label]) => `<option value="${id}" ${id === (identity?.kind || "human") ? "selected" : ""}>${label[locale]}</option>`).join("")}</select></label>
        <label>${c.origin}<select name="origin">${Object.entries(originKinds).map(([id, label]) => `<option value="${id}" ${id === (identity?.origin || "gensokyo") ? "selected" : ""}>${label[locale]}</option>`).join("")}</select></label>
        <label>${c.school}<select name="preferredSchool">${Object.entries(schools).map(([id, school]) => `<option value="${id}" ${id === preferredSchool ? "selected" : ""}>${school.name[locale]}</option>`).join("")}</select></label>
        <label class="mytu-check"><input type="checkbox" name="lunar" ${identity?.lunar ? "checked" : ""}><span>${c.lunar}</span></label>
        <label class="mytu-wide">${c.housing}<textarea name="housing" rows="3" maxlength="500" placeholder="${c.housingPlaceholder}">${escapeHtml(identity?.housing || source.needs || "")}</textarea></label>
        <footer>
          <span>${c.privacy}</span>
          ${identity ? `<button class="button button-secondary" type="button" data-mytu-cancel>${c.cancel}</button>` : ""}
          <button class="button button-primary" type="submit">${identity ? c.save : c.create} <span aria-hidden="true">→</span></button>
        </footer>
      </form>
    </div>`;
}

function renderReview(application, review, records, locale, c) {
  if (!application) {
    return `
      <section class="mytu-review mytu-review-empty">
        <div><p>ADMISSIONS COUNCIL</p><h3>${c.applicationReview}</h3><span>${c.noApplication}</span></div>
        <a class="button button-primary" href="index.html#service-application">${c.openApplication} <span aria-hidden="true">→</span></a>
      </section>`;
  }
  const examEvidence = bestExam(records, locale, c);
  if (!review) {
    return `
      <section class="mytu-review">
        <header>
          <div><p>ADMISSIONS COUNCIL / UNREAD DOSSIER</p><h3>${c.applicationReview}</h3><span>${c.reviewLead}</span></div>
          <b>${escapeHtml(application.id)}</b>
        </header>
        <div class="mytu-review-source">
          <div><span>${c.preferredSchool}</span><strong>${escapeHtml(schoolName(application.school, locale))}</strong></div>
          <div><span>${c.examEvidence}</span><strong>${escapeHtml(examEvidence)}</strong></div>
        </div>
        <button class="button button-primary" type="button" data-mytu-review="${escapeHtml(application.id)}">${c.runReview} <span aria-hidden="true">→</span></button>
      </section>`;
  }
  return `
    <section class="mytu-review has-decision">
      <header>
        <div><p>ADMISSIONS COUNCIL / ${escapeHtml(review.id)}</p><h3>${c.applicationReview}</h3><span>${c.reviewLead}</span></div>
        <b>${c.reviewed}</b>
      </header>
      <div class="mytu-decision">
        <span>${c.dossierScore} · ${review.score}/100</span>
        <h4>${c.outcome[review.outcome]}</h4>
        <p>${c.outcomeBody[review.outcome]}</p>
      </div>
      <div class="mytu-reviewers">
        ${review.committee.map((memberId, index) => {
          const member = reviewers[memberId];
          const stance = member.stance === "approve" ? c.stanceApprove : member.stance === "condition" ? c.stanceCondition : c.stanceRevise;
          const remark = review.remarks?.[index] || applicationReviewRemarks(application, review.committee)[index];
          const lensLabel = remark.lens === "question" ? c.reviewQuestion : remark.lens === "method" ? c.reviewMethod : c.reviewNeeds;
          const excerpt = remark.excerpt || c.noDeclaredNeeds;
          const commentary = remark.commentary?.[locale] || member.note[locale];
          return `
            <article>
              <header><div><strong>${member.name[locale]}</strong><span>${member.role[locale]}</span></div><i data-stance="${member.stance}">${stance}</i></header>
              <blockquote><small>${lensLabel}</small><q>${escapeHtml(excerpt)}</q></blockquote>
              <p>「${escapeHtml(commentary)}」</p>
            </article>`;
        }).join("")}
      </div>
      <footer>
        <span>${c.examEvidence}: <strong>${escapeHtml(review.examEvidence || examEvidence)}</strong></span>
        <button class="button button-primary" type="button" data-mytu-document-open="${escapeHtml(application.id)}">${c.printDecision} <span aria-hidden="true">↗</span></button>
      </footer>
    </section>`;
}

function eventLabel(event, locale, c) {
  const base = c.events[event.type] || event.type;
  const payload = event.payload || {};
  if (event.type === "application.submitted" || event.type === "application.reviewed") {
    return `${base} · ${payload.applicationId || ""}`;
  }
  if (event.type === "exam.completed") return `${base} · ${Number(payload.percent) || 0}%`;
  if (event.type === "gaokao.completed") {
    return `${base} · ${String(payload.difficultyId || "normal").toUpperCase()} ${Number(payload.score) || 0}/${Number(payload.total) || 150}`;
  }
  if (event.type === "visit.reserved") return `${base} · ${payload.date || ""}`;
  if (event.type === "bbs.posted") return `${base} · ${payload.title || ""}`;
  if (event.type.startsWith("course.")) return `${base} · ${payload.courseCode || ""}`;
  if (event.type.startsWith("book.")) return `${base} · ${payload.callNumber || payload.holdingId || ""}`;
  if (event.type.startsWith("housing.")) return `${base} · ${payload.roomId || payload.applicationId || payload.requestId || ""}`;
  if (event.type.startsWith("incident.")) {
    const disposition = payload.disposition === "contested" ? ` · ${c.contestedClosure}` : "";
    return `${base} · ${payload.caseId || ""}${payload.quality ? ` · ${payload.quality}/100` : ""}${disposition}`;
  }
  if (event.type === "governance.vote.cast") return `${base} · ${payload.proposalId || ""}`;
  if (event.type === "academic.assignment.graded") {
    return `${base} · ${payload.courseCode || payload.assignmentId || ""} · ${Number(payload.percent) || 0}%`;
  }
  if (event.type === "academic.exam.started") return `${base} · ${payload.examId || ""}`;
  if (event.type === "academic.exam.completed") return `${base} · ${Number(payload.percent) || 0}%`;
  if (event.type === "academic.project.submitted") return `${base} · ${payload.projectId || ""}`;
  if (event.type === "academic.defence.completed") {
    return `${base} · ${payload.projectId || ""} · ${Number(payload.percent) || 0}%`;
  }
  if (event.type.startsWith("clinic.")) {
    return `${base} · ${payload.visitId || payload.prescriptionId || payload.planId || ""}`;
  }
  if (event.type.startsWith("appraisal.")) {
    const disposition = payload.disposition === "contested" ? ` · ${c.contestedClosure}` : "";
    return `${base} · ${payload.objectId || payload.appraisalId || ""}${disposition}`;
  }
  return base;
}

function renderTimeline(locale, c) {
  const events = campusLedger().slice().reverse().slice(0, 10);
  return `
    <section class="mytu-ledger">
      <header><div><p>LOCAL EVENT STREAM</p><h3>${c.timeline}</h3></div><span>${c.timelineLead}</span></header>
      <ol>
        ${events.length ? events.map((event) => `
          <li>
            <span aria-hidden="true"></span>
            <div><strong>${escapeHtml(eventLabel(event, locale, c))}</strong><time datetime="${escapeHtml(event.timestamp)}">${formatDate(event.timestamp, locale, true)}</time></div>
            <code>${escapeHtml(event.id)}</code>
          </li>`).join("") : `<li class="empty">${c.noEvents}</li>`}
      </ol>
    </section>`;
}

function renderDashboard(identity, records, locale, c) {
  const selectedStored = window.localStorage.getItem(SELECTED_APPLICATION_KEY);
  const selectedApplication = records.applications.find((record) => record.id === selectedStored) || records.applications.at(-1);
  const review = selectedApplication ? reviewFor(selectedApplication.id, records) : null;
  const stage = stageFor(identity, records);
  return `
    <header class="mytu-heading">
      <div><p>${c.eyebrow}</p><h2>${c.title}</h2></div>
      <p>${c.lead}</p>
    </header>
    <nav class="mytu-mode-nav" aria-label="My TU">
      <a href="mytu.html#my-tu" aria-current="page">${c.recordsMode}</a>
      <a href="mytu.html#course-registration">${c.courseMode}<span>${records.courseSummary.enrolled + records.courseSummary.waitlisted}</span></a>
      <a href="mytu.html#academic-work">${c.academicMode}<span>${records.academicRecords}</span></a>
    </nav>
    <div class="mytu-dashboard">
      <section class="mytu-id-card">
        <div class="mytu-id-crest" aria-hidden="true"><span>東</span></div>
        <div class="mytu-id-copy">
          <p>${c.localId}</p>
          <h3>${escapeHtml(identity.name)}</h3>
          <code>${escapeHtml(identity.id)}</code>
          <dl>
            <div><dt>${c.stage}</dt><dd>${c.stages[stage]}</dd></div>
            <div><dt>${c.kind}</dt><dd>${identityKinds[identity.kind]?.[locale] || identity.kind}</dd></div>
            <div><dt>${c.origin}</dt><dd>${originKinds[identity.origin]?.[locale] || identity.origin}</dd></div>
            <div><dt>${c.preferredSchool}</dt><dd>${escapeHtml(schoolName(identity.preferredSchool, locale))}</dd></div>
          </dl>
        </div>
        <button type="button" data-mytu-edit>${c.edit}</button>
      </section>
      <section class="mytu-summary">
        <header><p>ON THIS DEVICE</p><h3>${c.recordSummary}</h3></header>
        <div>
          <a href="index.html#service-application"><span>${c.applications}</span><strong>${records.applications.length}</strong></a>
          <a href="admissions.html#entrance-exam"><span>${c.exams}</span><strong>${records.examCount}</strong></a>
          <a href="index.html#service-visit"><span>${c.visits}</span><strong>${records.visits.length}</strong></a>
          <a href="campus.html#bbs"><span>${c.posts}</span><strong>${records.posts.length}</strong></a>
          <a href="mytu.html#course-registration"><span>${c.courses}</span><strong>${records.courseSummary.enrolled}</strong></a>
          <a href="library.html#library"><span>${c.library}</span><strong>${records.activeLibrary}</strong></a>
          <a href="housing.html#housing-account"><span>${c.residential}</span><strong>${records.activeHousing}</strong></a>
          <a href="incidents.html#incident-records"><span>${c.incidents}</span><strong>${records.incidentRecords}</strong></a>
          <a href="mytu.html#academic-grades"><span>${c.academicRecords}</span><strong>${records.academicAverage ?? "—"}</strong></a>
          <a href="clinic.html#clinic-account"><span>${c.medical}</span><strong>${records.activeClinic}</strong></a>
          <a href="library.html#appraisal-records"><span>${c.appraisals}</span><strong>${records.appraisalRecords}</strong></a>
          <span><small>${c.drafts}</small><b>${records.drafts}</b></span>
        </div>
      </section>
    </div>
    ${
      records.applications.length > 1
        ? `<label class="mytu-application-select">${c.chooseApplication}
            <select data-mytu-application-select>${records.applications.slice().reverse().map((record) => `<option value="${escapeHtml(record.id)}" ${record.id === selectedApplication?.id ? "selected" : ""}>${escapeHtml(record.id)} · ${escapeHtml(schoolName(record.school, locale))} · ${formatDate(record.submittedAt, locale)}</option>`).join("")}</select>
          </label>`
        : ""
    }
    ${renderReview(selectedApplication, review, records, locale, c)}
    <div class="mytu-lower">
      ${renderTimeline(locale, c)}
      <aside class="mytu-next">
        <p>NEXT ACTION</p>
        <h3>${c.next}</h3>
        <span>${stage === "profile" ? c.nextApplication : stage === "applicant" ? c.nextReview : c.nextExam}</span>
        <a class="button button-secondary" href="admissions.html#entrance-exam">${c.goExam}</a>
        <a class="button button-primary" href="admissions.html#gaokao">${c.goGaokao} <span aria-hidden="true">→</span></a>
      </aside>
    </div>`;
}

function createReview(application, records) {
  const score = dossierScore(application, records);
  const outcome = outcomeFor(score);
  const committee = committeeBySchool[application.school] || committeeBySchool.boundary;
  const reviewedAt = new Date().toISOString();
  const id = `TU-R-${hashValue(`${application.id}:${application.school}`).toString(36).slice(0, 6).toUpperCase().padEnd(6, "0")}`;
  const review = {
    schema: 1,
    id,
    applicationId: application.id,
    school: application.school,
    score,
    outcome,
    committee,
    remarks: applicationReviewRemarks(application, committee),
    examEvidence: bestExam(records, getLocale(), copy[getLocale()]),
    reviewedAt,
  };
  const reviews = readJson(REVIEW_KEY, []);
  reviews.push(review);
  window.localStorage.setItem(REVIEW_KEY, JSON.stringify(reviews.slice(-40)));
  recordCampusEvent(
    "application.reviewed",
    { applicationId: application.id, reviewId: id, school: application.school, outcome },
    { id: `application.reviewed:${application.id}`, timestamp: reviewedAt },
  );
  return review;
}

function verificationMosaic(value) {
  const seed = hashValue(value);
  return Array.from({ length: 121 }, (_, index) => {
    const x = index % 11;
    const y = Math.floor(index / 11);
    const corner = (x < 3 && y < 3) || (x > 7 && y < 3) || (x < 3 && y > 7);
    const bit = corner ? x % 2 === 0 || y % 2 === 0 : ((seed >>> (index % 29)) ^ (index * 17)) & 1;
    return `<i class="${bit ? "on" : ""}"></i>`;
  }).join("");
}

function renderDocument(applicationId) {
  if (!documentBody) return;
  const locale = getLocale();
  const c = copy[locale];
  const records = allRecords();
  const application = records.applications.find((record) => record.id === applicationId);
  const review = reviewFor(applicationId, records);
  const identity = readJson(IDENTITY_KEY, null);
  if (!application || !review) return;
  const d = c.document;
  const admitted = ["admitted", "conditional"].includes(review.outcome);
  documentBody.innerHTML = `
    <header>
      <div class="mytu-document-crest" aria-hidden="true"><span>東</span></div>
      <div><p>${d.university}</p><span>${d.office}</span></div>
      <code>${escapeHtml(review.id)}</code>
    </header>
    <section class="mytu-document-title">
      <p>ADMISSIONS · AUTUMN 2026</p>
      <h2>${admitted ? d.admission : d.decision}</h2>
      <span>${d.certifies}</span>
      <strong>${escapeHtml(application.name || identity?.name || "—")}</strong>
    </section>
    <dl class="mytu-document-facts">
      <div><dt>${d.applicant}</dt><dd>${escapeHtml(application.name || identity?.name || "—")}</dd></div>
      <div><dt>${d.application}</dt><dd>${escapeHtml(application.id)}</dd></div>
      <div><dt>${d.review}</dt><dd>${escapeHtml(review.id)}</dd></div>
      <div><dt>${d.school}</dt><dd>${escapeHtml(schoolName(application.school, locale))}</dd></div>
      <div><dt>${d.result}</dt><dd>${c.outcome[review.outcome]}</dd></div>
      <div><dt>${d.issued}</dt><dd>${formatDate(review.reviewedAt, locale)}</dd></div>
    </dl>
    <section class="mytu-document-condition">
      <p>${d.conditions}</p>
      <h3>${c.outcomeBody[review.outcome]}</h3>
    </section>
    <footer>
      <div>
        <p>${d.signatures}</p>
        <ul>${review.committee.map((id) => `<li><strong>${reviewers[id].name[locale]}</strong><span>${reviewers[id].role[locale]}</span></li>`).join("")}</ul>
      </div>
      <div class="mytu-verification"><span>${d.verification}</span><div>${verificationMosaic(`${application.id}:${review.id}`)}</div><code>${escapeHtml(identity?.id || "STUDENT-LOCAL")}</code></div>
    </footer>
    <p class="mytu-document-note">${d.footer}</p>`;
  documentDialog.querySelectorAll("[data-mytu-document-close]").forEach((button) => {
    button.setAttribute("aria-label", d.close);
    if (!button.classList.contains("dialog-close")) button.textContent = d.close;
  });
  const print = documentDialog.querySelector("[data-mytu-print]");
  print.firstChild.textContent = `${d.print} `;
}

function bind() {
  if (!app) return;
  const identity = readJson(IDENTITY_KEY, null);
  app.querySelector("[data-mytu-profile-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    const now = new Date().toISOString();
    const next = {
      schema: 1,
      id: identity?.id || localStudentId(values.name, now),
      createdAt: identity?.createdAt || now,
      updatedAt: now,
      name: values.name,
      kind: values.kind,
      origin: values.origin,
      preferredSchool: values.preferredSchool,
      lunar: event.currentTarget.elements.lunar.checked,
      housing: values.housing || "",
    };
    window.localStorage.setItem(IDENTITY_KEY, JSON.stringify(next));
    recordCampusEvent(
      identity ? "identity.updated" : "identity.created",
      { identityId: next.id, preferredSchool: next.preferredSchool },
      { id: `${identity ? "identity.updated" : "identity.created"}:${next.id}:${identity ? now : "initial"}`, timestamp: now },
    );
    editingIdentity = false;
    showToast(copy[getLocale()].identitySaved);
    render();
  });
  app.querySelector("[data-mytu-edit]")?.addEventListener("click", () => {
    editingIdentity = true;
    render();
  });
  app.querySelector("[data-mytu-cancel]")?.addEventListener("click", () => {
    editingIdentity = false;
    render();
  });
  app.querySelector("[data-mytu-review]")?.addEventListener("click", (event) => {
    const records = allRecords();
    const application = records.applications.find((record) => record.id === event.currentTarget.dataset.mytuReview);
    if (!application || reviewFor(application.id, records)) return;
    createReview(application, records);
    render();
  });
  app.querySelector("[data-mytu-application-select]")?.addEventListener("change", (event) => {
    window.localStorage.setItem(SELECTED_APPLICATION_KEY, event.currentTarget.value);
    render();
  });
  app.querySelector("[data-mytu-document-open]")?.addEventListener("click", (event) => {
    openDocumentApplicationId = event.currentTarget.dataset.mytuDocumentOpen;
    renderDocument(openDocumentApplicationId);
    if (!documentDialog.open) documentDialog.showModal();
  });
}

function render() {
  if (!app) return;
  syncCampusLedger();
  const locale = getLocale();
  const c = copy[locale];
  const identity = readJson(IDENTITY_KEY, null);
  const records = allRecords();
  const route = safeDecodeFragment();
  if (route.startsWith("academic-")) {
    editingIdentity = false;
    academicWorkbenchCleanup?.();
    academicWorkbenchCleanup = renderAcademicWorkbench(app);
    return;
  }
  academicWorkbenchCleanup?.();
  academicWorkbenchCleanup = null;
  if (route === "course-registration" || route.startsWith("course-")) {
    editingIdentity = false;
    renderCourseRegistration(app, render);
    return;
  }
  app.innerHTML = editingIdentity || !identity
    ? identityForm(identity, records, locale, c)
    : renderDashboard(identity, records, locale, c);
  bind();
  if (documentDialog?.open && openDocumentApplicationId) renderDocument(openDocumentApplicationId);
}

export function initMyTu() {
  if (!app) return;
  syncCampusLedger();
  initCourseDocumentDialog();
  initAcademicDocumentDialog();
  documentDialog?.querySelectorAll("[data-mytu-document-close]").forEach((button) => {
    button.addEventListener("click", () => documentDialog.close());
  });
  documentDialog?.querySelector("[data-mytu-print]")?.addEventListener("click", () => {
    printDocument(documentBody, { title: documentBody?.querySelector("h1, h2")?.textContent || document.title });
  });
  window.addEventListener("tu:ledgerchange", render);
  window.addEventListener("tu:languagechange", render);
  window.addEventListener("hashchange", () => {
    if (
      window.location.hash === "#my-tu"
      || window.location.hash === "#course-registration"
      || window.location.hash.startsWith("#course-")
      || window.location.hash.startsWith("#academic-")
    ) render();
  });
  render();
}
