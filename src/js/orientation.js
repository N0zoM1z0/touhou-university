import {
  orientationFirstStops,
  orientationLocalized,
  orientationNoticePlan,
  orientationNoticePlans,
  orientationSeason,
  orientationStopSignal,
  orientationStopSignals,
} from "../data/orientation.js";
import { transportModes } from "../data/routes.js";
import { mapPlaces } from "../data/services.js";
import { schools } from "../data/schools.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { navigateToDeepLink, registerDeepLink } from "./deep-links.js";
import { getLocale } from "./i18n.js";
import {
  activeOrientationDossier,
  completeOrientation,
  confirmOrientationArrival,
  confirmOrientationBoundary,
  orientationDossier,
  orientationEligibility,
  orientationStats,
  startOrientationDossier,
} from "./orientation-model.js";
import { printDocument } from "./print-document.js";
import { renderPreservingState } from "./render-state.js";
import { siteHref } from "./site-router.js";
import { showToast } from "./ui.js";

let root;
let selectedDossierId = null;

const copy = {
  "zh-Hant": {
    eyebrow: "FIRST BELL / 第一鐘・新生到着週",
    title: "先來報到。至於「普通學生」——本校沒有這個欄位。",
    lead: "帶著錄取評議來，確認你走得進哪一扇門、認得哪一種停止信號，再選一個真正想去的第一站。校方會保存你的選擇，也保存沒有消失的條件。",
    office: "NEW STUDENT ARRIVAL OFFICE",
    officeTitle: "新生到着室",
    window: "本次辦理",
    issued: "已開封",
    completed: "已響鐘",
    publicFile: "公開空白卷",
    publicLead: "任何人都可以先閱讀報到規則；只有這台裝置上已有正式錄取評議的人，才能把它寫進校園履歷。",
    status: "目前檔案狀態",
    identityMissing: "尚未建立 My TU 身分。先留下本機身分，既有申請和試卷不會被改動。",
    applicationMissing: "已有本機身分，尚無已提交申請。報到室不會把空白願書當成錄取通知。",
    reviewMissing: "申請已送達，教授聯合審查尚未留下結果。文已經想好標題，但這次必須等。",
    conditional: "目前是有條件錄取。你可以讀完報到規則，但第一鐘要等正式錄取版本；原條件不會被藏起來。",
    notAdmitted: "目前評議仍要求補件或面試。報到室會保留空白卷，不會提前把申請生改寫成新生。",
    admitted: "正式錄取版本已核對，可以開封本機報到卷。",
    goMyTu: "前往 My TU",
    goApplication: "開始入學申請",
    goAdmissions: "查看招生與試驗",
    openDossier: "開封我的報到卷",
    privacy: "通稱、申請內容與需求只留在這個瀏覽器；BBS 只看得到不含姓名的校務投影。",
    threeThings: "報到室只堅持三件事",
    threeLead: "不是集章競賽。每一欄都要在真的需要改道時派得上用場。",
    ruleOne: "帶對版本",
    ruleOneBody: "錄取、條件與少數意見分開保存；沒有一枚「歡迎」印章能把它們蓋掉。",
    ruleTwo: "認得退路",
    ruleTwoBody: "路線可以變，停止信號必須是你本人確實能辨認的一種。",
    ruleThree: "選第一站",
    ruleThreeBody: "完成報到不是得到徽章，而是得到一條真的能繼續走下去的校園路線。",
    dossier: "ARRIVAL FILE / 本機報到卷",
    dossierTitle: "這份卷宗只替你保存選擇，不替任何辦公室改口。",
    student: "報到人",
    school: "錄取學院",
    application: "申請卷",
    review: "評議卷",
    decision: "評議結果",
    question: "你帶進校門的問題",
    noQuestion: "申請卷沒有可顯示的問題文字；原卷仍保留。",
    admittedLabel: "正式錄取",
    stepOne: "01 / 錄取版本",
    stepOneTitle: "先確認校方准備迎接的是哪一個你。",
    stepOneBody: "阿求只引用原申請與評議編號，不把它們抄成一份更聽話的新資料。",
    stepTwo: "02 / 到校路線",
    stepTwoTitle: "從博麗門走到你的學院。",
    stepTwoBody: "選擇抵達方式；當值事件、校曆與正在運行的祭典可能讓最快的路今天不成立。",
    chooseMode: "選擇抵達方式",
    confirmArrival: "把這條路寫進報到卷",
    routeFiled: "到校路線已核對",
    minutes: "預計分鐘",
    walking: "其中步行",
    distance: "約計距離",
    routeClosed: "這種方式今天找不到完整路線。換一種方式，或先到校園地圖查看封路。",
    openMap: "打開當值校園地圖",
    stepThree: "03 / 停止與通知",
    stepThreeTitle: "選你本人認得的停止信號。",
    stepThreeBody: "再快的通知也可能送錯版本；因此停止信號與改道通知分開確認。",
    signal: "我能辨認的停止／退路信號",
    notice: "我會覆核的改道通知",
    confirmBoundary: "確認退路與通知",
    boundaryFiled: "退路欄已由本人確認",
    stepFour: "04 / 第一站",
    stepFourTitle: "第一鐘響後，你先往哪裡走？",
    stepFourBody: "這不是性格測驗。選擇只決定報到卷替你打開哪一扇真正存在的門。",
    firstStop: "選擇第一站",
    ringBell: "敲響第一鐘，封存報到卷",
    required: "請先選完這一欄。",
    arrivalSaved: "到校路線已寫入報到卷。",
    boundarySaved: "停止信號與改道通知已分欄保存。",
    completedToast: "第一鐘已響；你的第一站現在可以出發。",
    completeEyebrow: "MATRICULATION FILED / 到着記錄成立",
    completeTitle: "門沒有變得比較唯一；你已經知道該走哪一扇。",
    completeLead: "報到卷已進入 My TU 校園事件帳本。姓名沒有送上 BBS，原錄取條件也沒有被歡迎詞沖淡。",
    firstDestination: "第一站",
    stopSignal: "停止信號",
    noticePlan: "改道通知",
    filedAt: "第一鐘時間",
    print: "列印／另存正式到着票",
    depart: "前往第一站",
    openBbs: "看看 BBS 怎麼說",
    openAnother: "返回報到卷",
    records: "份報到卷",
    openFiles: "份尚未響鐘",
  },
  ja: {
    eyebrow: "FIRST BELL / 第一鐘・新入生到着週",
    title: "まずは到着手続を。『普通の学生』という欄は、本学にはありません。",
    lead: "合格審査を持参し、通れる門と自分で識別できる停止合図を確認して、最初の行先を一つ選びます。大学は選択を保存し、消えていない条件も保存します。",
    office: "NEW STUDENT ARRIVAL OFFICE", officeTitle: "新入生到着室", window: "受付期間", issued: "開封済み", completed: "第一鐘済み", publicFile: "公開空票",
    publicLead: "手続規則は誰でも読めます。学内履歴へ記録できるのは、この端末に正式な合格審査がある人だけです。",
    status: "現在のファイル状態", identityMissing: "My TU 身分が未作成です。先に端末内身分を作っても、既存の出願や答案は変わりません。",
    applicationMissing: "端末内身分はありますが、提出済み出願がありません。到着室は白紙の願書を合格通知として扱いません。",
    reviewMissing: "出願は到着済みですが、教員合同審査の結果がありません。文は見出しを用意しましたが、今回は待たせます。",
    conditional: "現在は条件付合格です。規則は読めますが、第一鐘は正式合格版を待ちます。条件は隠しません。",
    notAdmitted: "現在の審査は補足資料または面接を求めています。到着室は空票を残し、志願者を先回りで新入生に書き換えません。",
    admitted: "正式合格版を確認しました。端末内到着票を開封できます。", goMyTu: "My TU へ", goApplication: "入学出願を始める", goAdmissions: "入試・試験を見る", openDossier: "自分の到着票を開封",
    privacy: "通称・出願内容・必要条件はこのブラウザだけに保存。BBS には氏名を含まない学務上の投影だけが出ます。",
    threeThings: "到着室が譲らない三項目", threeLead: "スタンプ競争ではありません。実際の迂回時に使える欄だけを残します。",
    ruleOne: "版を間違えない", ruleOneBody: "合格・条件・少数意見を分けて保存。「歓迎」の印で上書きしません。",
    ruleTwo: "退路を識別する", ruleTwoBody: "経路は変わっても、停止合図は本人が確実に分かるものにします。",
    ruleThree: "最初の行先を選ぶ", ruleThreeBody: "手続完了で得るのはバッジではなく、実際に続いている学内経路です。",
    dossier: "ARRIVAL FILE / 端末内到着票", dossierTitle: "この票は選択を保存しますが、どの窓口の発言も書き換えません。",
    student: "到着者", school: "合格学部", application: "出願記録", review: "審査記録", decision: "審査結果", question: "門へ持ち込む問い", noQuestion: "表示できる問いの本文がありません。元の出願記録は残っています。", admittedLabel: "正式合格",
    stepOne: "01 / 合格版", stepOneTitle: "大学が迎えるのは、どの版のあなたか。", stepOneBody: "阿求は出願・審査番号だけを参照し、従順な第二の記録へ写し替えません。",
    stepTwo: "02 / 到着経路", stepTwoTitle: "博麗門から合格学部へ。", stepTwoBody: "到着方法を選びます。当番案件・学年暦・運行中の祭典によって、普段の最短路が今日は成立しないことがあります。",
    chooseMode: "到着方法", confirmArrival: "この経路を到着票へ記入", routeFiled: "到着経路確認済み", minutes: "所要分", walking: "うち徒歩", distance: "概算距離", routeClosed: "今日はこの方法で全経路を作れません。方法を変えるか、当番地図で閉鎖を確認してください。", openMap: "当番キャンパス地図を開く",
    stepThree: "03 / 停止と通知", stepThreeTitle: "本人が識別できる停止合図を選ぶ。", stepThreeBody: "速い通知ほど誤った版を届けることがあります。停止合図と迂回通知は別々に確認します。",
    signal: "識別できる停止・退路合図", notice: "自分で再確認する迂回通知", confirmBoundary: "退路と通知を確認", boundaryFiled: "退路欄を本人確認済み",
    stepFour: "04 / 最初の行先", stepFourTitle: "第一鐘の後、最初にどこへ？", stepFourBody: "性格診断ではありません。到着票が実在するどの扉を開くかだけを選びます。", firstStop: "最初の行先", ringBell: "第一鐘を鳴らし、到着票を保存",
    required: "この欄を選んでください。", arrivalSaved: "到着経路を記入しました。", boundarySaved: "停止合図と迂回通知を別欄で保存しました。", completedToast: "第一鐘が鳴りました。最初の行先へ進めます。",
    completeEyebrow: "MATRICULATION FILED / 到着記録成立", completeTitle: "門は唯一になっていません。それでも、通る門は分かりました。", completeLead: "到着票は My TU の学内イベント台帳へ入りました。氏名は BBS に送られず、合格条件も歓迎文で薄められていません。",
    firstDestination: "最初の行先", stopSignal: "停止合図", noticePlan: "迂回通知", filedAt: "第一鐘時刻", print: "正式到着票を印刷／PDF保存", depart: "最初の行先へ", openBbs: "BBS の反応を見る", openAnother: "到着票へ戻る", records: "件の到着票", openFiles: "件が第一鐘前",
  },
  en: {
    eyebrow: "FIRST BELL / NEW STUDENT ARRIVAL WEEK",
    title: "First, arrive. ‘Ordinary student’ is not a field on this form.",
    lead: "Bring the admission review, confirm which gate you can use and which stop signal you can recognise, then choose one real first destination. The university keeps your choice—and every condition that did not disappear.",
    office: "NEW STUDENT ARRIVAL OFFICE", officeTitle: "New Student Arrival Office", window: "Filing window", issued: "Opened", completed: "First Bell rung", publicFile: "Public blank file",
    publicLead: "Anyone may read the arrival rules. Only a person with a formal admission review on this device can place a file in the campus record.",
    status: "Current file status", identityMissing: "No My TU identity exists yet. Creating one will not alter earlier applications or examination records.",
    applicationMissing: "An on-device identity exists, but no application has been submitted. The Arrival Office will not treat a blank form as an admission letter.",
    reviewMissing: "The application arrived, but the joint faculty review has not issued a result. Aya has a headline ready; this time she must wait.",
    conditional: "This is a conditional admission. You may read the rules, but First Bell waits for the formally admitted edition. The conditions remain visible.",
    notAdmitted: "The current review still requires a supplement or interview. The office keeps a blank file; it will not rewrite an applicant as a newcomer in advance.",
    admitted: "The formal admission edition is verified. Your on-device arrival file may now be opened.", goMyTu: "Open My TU", goApplication: "Start an application", goAdmissions: "Admissions & examinations", openDossier: "Open my arrival file",
    privacy: "Names, application content, and needs remain in this browser. The BBS receives only a nameless institutional projection.",
    threeThings: "Three things the office will not waive", threeLead: "This is not a stamp hunt. Every field must still help when a route actually changes.",
    ruleOne: "Carry the right edition", ruleOneBody: "Admission, conditions, and minority opinions remain separate. A welcome stamp cannot cover them.",
    ruleTwo: "Recognise a way back", ruleTwoBody: "Routes may change. Your stop signal must be one you can personally recognise.",
    ruleThree: "Choose a first destination", ruleThreeBody: "Completion awards no generic badge; it opens a real route that continues into campus.",
    dossier: "ARRIVAL FILE / THIS DEVICE", dossierTitle: "This file preserves your choices; it does not rewrite any office into agreement.",
    student: "Arriving student", school: "Admitting school", application: "Application file", review: "Review file", decision: "Decision", question: "The question you bring through the gate", noQuestion: "No question text is available here; the source application remains intact.", admittedLabel: "Admitted",
    stepOne: "01 / ADMISSION EDITION", stepOneTitle: "First confirm which edition of you the university admitted.", stepOneBody: "Akyuu cites the source application and review. She does not copy them into a more obedient second record.",
    stepTwo: "02 / ARRIVAL ROUTE", stepTwoTitle: "Travel from Hakurei Gate to your school.", stepTwoBody: "Choose a mode. Duty incidents, the academic calendar, and a live festival may make the usual shortest route unavailable today.",
    chooseMode: "Arrival mode", confirmArrival: "File this route", routeFiled: "Arrival route confirmed", minutes: "Estimated minutes", walking: "Walking", distance: "Approx. distance", routeClosed: "This mode cannot form a complete route today. Choose another or inspect closures on the live map.", openMap: "Open the live campus map",
    stepThree: "03 / STOP & NOTICE", stepThreeTitle: "Choose a stop signal you can recognise yourself.", stepThreeBody: "The faster a notice travels, the more easily the wrong edition arrives. Stop signal and detour notice are confirmed separately.",
    signal: "Recognisable stop / exit signal", notice: "Detour notice I will verify", confirmBoundary: "Confirm exit and notice", boundaryFiled: "Exit field personally confirmed",
    stepFour: "04 / FIRST DESTINATION", stepFourTitle: "Where will you go after First Bell?", stepFourBody: "This is not a personality test. It only chooses which real door the arrival file opens next.", firstStop: "Choose a first destination", ringBell: "Ring First Bell and file arrival",
    required: "Complete this field first.", arrivalSaved: "The arrival route is now in the file.", boundarySaved: "Stop signal and detour notice were filed separately.", completedToast: "First Bell rang. Your first destination is open.",
    completeEyebrow: "MATRICULATION FILED / ARRIVAL RECORDED", completeTitle: "The gates are no more singular. You know which one to use.", completeLead: "The arrival file entered the My TU campus ledger. Your name did not go to the BBS, and welcome copy did not dilute the admission conditions.",
    firstDestination: "First destination", stopSignal: "Stop signal", noticePlan: "Detour notice", filedAt: "First Bell time", print: "Print / save formal arrival slip", depart: "Go to first destination", openBbs: "See what the BBS says", openAnother: "Return to arrival file", records: "arrival files", openFiles: "awaiting First Bell",
  },
};

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);
}

function formatDate(value, locale) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale === "zh-Hant" ? "zh-TW" : locale, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function outcomeLabel(outcome, c) {
  return outcome === "admitted" ? c.admittedLabel : outcome || "—";
}

function contextAction(context, c) {
  if (context.status === "identity-missing") return [c.goMyTu, "my-tu"];
  if (context.status === "application-missing") return [c.goApplication, "service-application"];
  if (["review-missing", "conditional"].includes(context.status)) return [c.goMyTu, "my-tu"];
  return [c.goAdmissions, "admissions"];
}

function preview(context, locale, c) {
  const [action, route] = contextAction(context, c);
  const statusText = c[context.status.replace(/-([a-z])/g, (_, character) => character.toUpperCase())] || c.notAdmitted;
  return `
    <section class="orientation-public-file" aria-labelledby="orientation-public-title">
      <div class="orientation-public-status">
        <p>${c.publicFile}</p>
        <h3 id="orientation-public-title">${c.status}</h3>
        <strong>${statusText}</strong>
        ${context.eligible ? "" : `<a class="button button-primary" href="${siteHref(route)}">${action}<span aria-hidden="true">→</span></a>`}
        <small>${c.privacy}</small>
      </div>
      <div class="orientation-rules">
        <header><p>THREE REQUIRED FIELDS</p><h3>${c.threeThings}</h3><span>${c.threeLead}</span></header>
        <ol>
          <li><b>01</b><div><h4>${c.ruleOne}</h4><p>${c.ruleOneBody}</p></div></li>
          <li><b>02</b><div><h4>${c.ruleTwo}</h4><p>${c.ruleTwoBody}</p></div></li>
          <li><b>03</b><div><h4>${c.ruleThree}</h4><p>${c.ruleThreeBody}</p></div></li>
        </ol>
      </div>
    </section>
    ${context.eligible ? `<button class="orientation-open-file" type="button" data-orientation-open><span>開</span><strong>${c.openDossier}</strong><small>${escapeHtml(context.application.id)} · ${escapeHtml(schools[context.review.school]?.name?.[locale] || schools[context.application.school]?.name?.[locale] || "")}</small></button>` : ""}
  `;
}

function routeReceipt(dossier, locale, c) {
  if (!dossier.arrival) return "";
  const arrival = dossier.arrival;
  const path = arrival.path.map((id) => mapPlaces[id]?.name?.[locale] || id).join(" → ");
  return `
    <article class="orientation-route-receipt">
      <header><span>${transportModes[arrival.modeId].icon}</span><div><p>${c.routeFiled}</p><h4>${escapeHtml(transportModes[arrival.modeId].name[locale])}</h4></div></header>
      <strong>${escapeHtml(path)}</strong>
      <dl>
        <div><dt>${c.minutes}</dt><dd>${arrival.minutes}</dd></div>
        <div><dt>${c.walking}</dt><dd>${arrival.walkingMinutes}</dd></div>
        <div><dt>${c.distance}</dt><dd>${Math.round(arrival.distance / 10) * 10} m</dd></div>
      </dl>
    </article>`;
}

function radioCards(name, entries, selected, locale) {
  return entries.map((entry) => `
    <label class="orientation-choice ${selected === entry.id ? "selected" : ""}">
      <input type="radio" name="${name}" value="${entry.id}" ${selected === entry.id ? "checked" : ""} required>
      <span aria-hidden="true">${entry.glyph}</span>
      <strong>${escapeHtml(orientationLocalized(entry.name, locale))}</strong>
      <small>${escapeHtml(orientationLocalized(entry.detail, locale))}</small>
    </label>`).join("");
}

function arrivalStep(dossier, locale, c) {
  const selected = dossier.arrival?.modeId || "walk";
  return `
    <section class="orientation-step ${dossier.arrival ? "complete" : ""}" id="orientation-arrival">
      <header><p>${c.stepTwo}</p><div><h3>${c.stepTwoTitle}</h3><span>${c.stepTwoBody}</span></div>${dossier.arrival ? `<b>${c.routeFiled}</b>` : ""}</header>
      <form data-orientation-arrival-form>
        <fieldset><legend>${c.chooseMode}</legend><div class="orientation-mode-grid">
          ${Object.entries(transportModes).map(([id, mode]) => `
            <label class="orientation-mode ${selected === id ? "selected" : ""}">
              <input type="radio" name="modeId" value="${id}" ${selected === id ? "checked" : ""} required>
              <span>${mode.icon}</span><strong>${escapeHtml(mode.name[locale])}</strong><small>${escapeHtml(mode.notice[locale])}</small>
            </label>`).join("")}
        </div></fieldset>
        <button class="button button-primary" type="submit">${c.confirmArrival}<span aria-hidden="true">→</span></button>
        <a href="${siteHref("map")}">${c.openMap}</a>
      </form>
      ${routeReceipt(dossier, locale, c)}
    </section>`;
}

function boundaryStep(dossier, locale, c) {
  if (!dossier.arrival) return "";
  return `
    <section class="orientation-step ${dossier.boundary ? "complete" : ""}" id="orientation-boundary">
      <header><p>${c.stepThree}</p><div><h3>${c.stepThreeTitle}</h3><span>${c.stepThreeBody}</span></div>${dossier.boundary ? `<b>${c.boundaryFiled}</b>` : ""}</header>
      <form data-orientation-boundary-form>
        <fieldset><legend>${c.signal}</legend><div class="orientation-choice-grid">
          ${radioCards("signalId", orientationStopSignals, dossier.boundary?.signalId, locale)}
        </div></fieldset>
        <fieldset><legend>${c.notice}</legend><div class="orientation-choice-grid">
          ${radioCards("noticeId", orientationNoticePlans, dossier.boundary?.noticeId, locale)}
        </div></fieldset>
        <button class="button button-primary" type="submit">${c.confirmBoundary}<span aria-hidden="true">→</span></button>
      </form>
    </section>`;
}

function firstStopStep(dossier, locale, c) {
  if (!dossier.boundary) return "";
  return `
    <section class="orientation-step orientation-first-stop" id="orientation-first-bell">
      <header><p>${c.stepFour}</p><div><h3>${c.stepFourTitle}</h3><span>${c.stepFourBody}</span></div></header>
      <form data-orientation-complete-form>
        <fieldset><legend>${c.firstStop}</legend><div class="orientation-first-grid">
          ${radioCards("firstStopId", orientationFirstStops, dossier.firstStopId, locale)}
        </div></fieldset>
        <button class="orientation-bell" type="submit"><span aria-hidden="true">鐘</span><strong>${c.ringBell}</strong><i aria-hidden="true"></i></button>
      </form>
    </section>`;
}

function completedFile(dossier, context, locale, c) {
  const firstStop = orientationFirstStops.find(({ id }) => id === dossier.firstStopId);
  const signal = orientationStopSignal(dossier.boundary.signalId);
  const notice = orientationNoticePlan(dossier.boundary.noticeId);
  const destination = mapPlaces[dossier.arrival.destinationId];
  return `
    <section class="orientation-complete" id="orientation-dossier-${dossier.id}">
      <div class="orientation-complete-copy">
        <p>${c.completeEyebrow}</p><h3>${c.completeTitle}</h3><span>${c.completeLead}</span>
        <div class="orientation-complete-actions">
          <a class="button button-primary" href="${siteHref(firstStop.route)}">${c.depart}<span aria-hidden="true">→</span></a>
          <button class="button button-secondary" type="button" data-orientation-print>${c.print}</button>
          <a href="${siteHref("bbs")}">${c.openBbs}</a>
        </div>
      </div>
      <article class="orientation-arrival-document" data-orientation-document>
        <header><div><small>幻想鄉立東方大學</small><strong>TOUHOU UNIVERSITY</strong></div><span>東</span></header>
        <p>FIRST BELL 2026 / NEW STUDENT ARRIVAL</p>
        <h4>${escapeHtml(orientationLocalized(orientationSeason.title, locale))}</h4>
        <dl>
          <div><dt>${c.student}</dt><dd>${escapeHtml(context.identity?.name || dossier.identityId)}</dd></div>
          <div><dt>${c.school}</dt><dd>${escapeHtml(schools[dossier.schoolId]?.name?.[locale] || dossier.schoolId)}</dd></div>
          <div><dt>${c.firstDestination}</dt><dd>${escapeHtml(orientationLocalized(firstStop.name, locale))}</dd></div>
          <div><dt>${c.routeFiled}</dt><dd>${escapeHtml(destination?.name?.[locale] || dossier.arrival.destinationId)} · ${dossier.arrival.minutes} min</dd></div>
          <div><dt>${c.stopSignal}</dt><dd>${escapeHtml(orientationLocalized(signal.name, locale))}</dd></div>
          <div><dt>${c.noticePlan}</dt><dd>${escapeHtml(orientationLocalized(notice.name, locale))}</dd></div>
          <div><dt>${c.filedAt}</dt><dd>${escapeHtml(formatDate(dossier.completedAt, locale))}</dd></div>
        </dl>
        <footer><code>${escapeHtml(dossier.id)}</code><b>到</b></footer>
      </article>
    </section>`;
}

function dossierView(dossier, context, locale, c) {
  if (dossier.status === "matriculated") return completedFile(dossier, context, locale, c);
  const school = schools[dossier.schoolId];
  return `
    <section class="orientation-dossier" id="orientation-dossier-${dossier.id}">
      <header><div><p>${c.dossier}</p><h3>${c.dossierTitle}</h3></div><span><small>${c.status}</small><b>${c.issued}</b><code>${escapeHtml(dossier.id)}</code></span></header>
      <section class="orientation-admission-edition">
        <div><p>${c.stepOne}</p><h3>${c.stepOneTitle}</h3><span>${c.stepOneBody}</span></div>
        <article>
          <dl>
            <div><dt>${c.student}</dt><dd>${escapeHtml(context.identity?.name || dossier.identityId)}</dd></div>
            <div><dt>${c.school}</dt><dd>${escapeHtml(school?.name?.[locale] || dossier.schoolId)}</dd></div>
            <div><dt>${c.application}</dt><dd><code>${escapeHtml(dossier.applicationId)}</code></dd></div>
            <div><dt>${c.review}</dt><dd><code>${escapeHtml(dossier.reviewId)}</code></dd></div>
            <div><dt>${c.decision}</dt><dd><strong>${escapeHtml(outcomeLabel(dossier.admissionOutcome, c))}</strong></dd></div>
          </dl>
          <blockquote><small>${c.question}</small>${escapeHtml(context.application?.question || c.noQuestion)}</blockquote>
        </article>
      </section>
      ${arrivalStep(dossier, locale, c)}
      ${boundaryStep(dossier, locale, c)}
      ${firstStopStep(dossier, locale, c)}
    </section>`;
}

function render() {
  if (!root) return;
  const locale = getLocale();
  const c = copy[locale];
  const context = orientationEligibility();
  const active = selectedDossierId ? orientationDossier(selectedDossierId) : activeOrientationDossier();
  const dossier = active && context.identity?.id === active.identityId ? active : null;
  const stats = orientationStats();
  renderPreservingState(root, () => {
    root.innerHTML = `
      <div class="orientation-body">
        <header class="orientation-hero">
          <div><p>${c.eyebrow}</p><h2>${c.title}</h2><span>${c.lead}</span></div>
          <aside><p>${c.office}</p><strong>${c.officeTitle}</strong><dl><div><dt>${c.window}</dt><dd>${escapeHtml(orientationLocalized(orientationSeason.window, locale))}</dd></div><div><dt>${c.records}</dt><dd>${stats.total}</dd></div><div><dt>${c.openFiles}</dt><dd>${stats.open}</dd></div></dl><i>一</i></aside>
        </header>
        ${dossier ? dossierView(dossier, context, locale, c) : preview(context, locale, c)}
        <p class="orientation-privacy">${c.privacy}</p>
      </div>`;
  }, { preserveWindow: true });
}

function recordOpened(dossier) {
  recordCampusEvent("orientation.dossier.opened", {
    dossierId: dossier.id,
    identityId: dossier.identityId,
    applicationId: dossier.applicationId,
    schoolId: dossier.schoolId,
  }, { id: `orientation.dossier.opened:${dossier.id}`, timestamp: dossier.createdAt });
}

function bind() {
  root.addEventListener("change", (event) => {
    const card = event.target.closest(".orientation-choice, .orientation-mode");
    if (!card) return;
    const group = card.parentElement;
    group?.querySelectorAll(".selected").forEach((entry) => entry.classList.remove("selected"));
    card.classList.add("selected");
  });
  root.addEventListener("click", (event) => {
    if (event.target.closest("[data-orientation-open]")) {
      const result = startOrientationDossier();
      if (!result.dossier) return;
      selectedDossierId = result.dossier.id;
      recordOpened(result.dossier);
      render();
      navigateToDeepLink(`orientation-dossier-${result.dossier.id}`);
      return;
    }
    if (event.target.closest("[data-orientation-print]")) {
      const documentElement = root.querySelector("[data-orientation-document]");
      if (documentElement) printDocument(documentElement, { title: `${selectedDossierId || activeOrientationDossier()?.id} · First Bell` });
    }
  });
  root.addEventListener("submit", (event) => {
    const dossier = selectedDossierId ? orientationDossier(selectedDossierId) : activeOrientationDossier();
    if (!dossier) return;
    const locale = getLocale();
    const c = copy[locale];
    if (event.target.matches("[data-orientation-arrival-form]")) {
      event.preventDefault();
      const modeId = new FormData(event.target).get("modeId");
      const result = confirmOrientationArrival(dossier.id, modeId);
      if (!result.dossier) {
        showToast(c.routeClosed);
        return;
      }
      recordCampusEvent("orientation.arrival.confirmed", {
        dossierId: dossier.id,
        modeId: result.dossier.arrival.modeId,
        destinationId: result.dossier.arrival.destinationId,
      }, {
        id: `orientation.arrival.confirmed:${dossier.id}`,
        timestamp: result.dossier.arrival.confirmedAt,
        causationId: `orientation.dossier.opened:${dossier.id}`,
      });
      showToast(c.arrivalSaved);
      render();
      navigateToDeepLink("orientation-boundary");
      return;
    }
    if (event.target.matches("[data-orientation-boundary-form]")) {
      event.preventDefault();
      const form = new FormData(event.target);
      const result = confirmOrientationBoundary(dossier.id, { signalId: form.get("signalId"), noticeId: form.get("noticeId") });
      if (!result.dossier) {
        showToast(c.required);
        return;
      }
      recordCampusEvent("orientation.boundary.confirmed", {
        dossierId: dossier.id,
        signalId: result.dossier.boundary.signalId,
        noticeId: result.dossier.boundary.noticeId,
      }, {
        id: `orientation.boundary.confirmed:${dossier.id}`,
        timestamp: result.dossier.boundary.confirmedAt,
        causationId: `orientation.arrival.confirmed:${dossier.id}`,
      });
      showToast(c.boundarySaved);
      render();
      navigateToDeepLink("orientation-first-bell");
      return;
    }
    if (event.target.matches("[data-orientation-complete-form]")) {
      event.preventDefault();
      const firstStopId = new FormData(event.target).get("firstStopId");
      const result = completeOrientation(dossier.id, firstStopId);
      if (!result.dossier || result.error) {
        showToast(c.required);
        return;
      }
      recordCampusEvent("orientation.matriculated", {
        dossierId: dossier.id,
        schoolId: result.dossier.schoolId,
        firstStopId: result.dossier.firstStopId,
      }, {
        id: `orientation.matriculated:${dossier.id}`,
        timestamp: result.dossier.completedAt,
        causationId: `orientation.boundary.confirmed:${dossier.id}`,
      });
      showToast(c.completedToast);
      render();
      navigateToDeepLink(`orientation-dossier-${dossier.id}`);
    }
  });
}

export function initOrientation() {
  root = document.querySelector("[data-orientation-app]");
  if (!root) return;
  selectedDossierId = activeOrientationDossier()?.id || null;
  bind();
  registerDeepLink("orientation-dossier-", {
    anchor: () => root,
    open(id) {
      if (!orientationDossier(id)) return;
      selectedDossierId = id;
      render();
    },
  });
  window.addEventListener("tu:languagechange", render);
  render();
}
