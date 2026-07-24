import {
  diningMenus,
  exams,
  mapPlaces,
  roomAvailability,
  timetable,
} from "../data/services.js";
import { getLocale } from "./i18n.js";
import { showToast } from "./ui.js";

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
    acceptedBody: "請保存受理編號；入學相談室將依此安排下一階段。",
    newApplication: "填寫另一份申請",
    selectSchool: "請選擇",
    consent: "我確認以上內容可交由入學相談室進行選拔審查。",
    allBuildings: "所有館舍",
    building: "館舍",
    room: "房間",
    type: "類型",
    seats: "座位",
    freeUntil: "可用至",
    availableNow: "目前可用",
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
    menu: "品項",
    contents: "內容",
    price: "價格",
    note: "備註",
    time: "時間",
    course: "課程",
    instructor: "授課教師",
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
    selectSchool: "選択してください",
    consent: "上記内容を入学相談室が選抜審査に利用することを確認します。",
    allBuildings: "すべての施設",
    building: "施設",
    room: "部屋",
    type: "種別",
    seats: "席",
    freeUntil: "利用可能時刻",
    availableNow: "現在利用可",
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
    menu: "品名",
    contents: "内容",
    price: "価格",
    note: "備考",
    time: "時刻",
    course: "授業",
    instructor: "担当",
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
    selectSchool: "Select one",
    consent: "I confirm the Admissions Office may use this information for selection.",
    allBuildings: "All buildings",
    building: "Building",
    room: "Room",
    type: "Type",
    seats: "Seats",
    freeUntil: "Free until",
    availableNow: "Available now",
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
    menu: "Item",
    contents: "Contents",
    price: "Price",
    note: "Note",
    time: "Time",
    course: "Course",
    instructor: "Instructor",
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

const schools = {
  "zh-Hant": ["結界與異變研究院", "歷史記錄學院", "魔法理論與實作學院", "月都醫藥生命學院", "河童工程學院", "天狗新聞傳播學院", "信仰與共生政策學院"],
  ja: ["境界・異変研究院", "歴史記録学部", "魔法理論実践学部", "月都医薬生命学部", "河童工学部", "天狗新聞報道学部", "信仰・共生政策学部"],
  en: ["Boundaries & Incidents", "History & Records", "Magic Theory & Practice", "Lunar Medicine & Life", "Kappa Engineering", "Tengu Journalism", "Faith & Coexistence Policy"],
};

function localized(value, locale) {
  return typeof value === "object" ? value[locale] : value;
}

function reference(prefix) {
  const date = new Date();
  const stamp = `${date.getFullYear().toString().slice(-2)}${String(date.getMonth() + 1).padStart(2, "0")}`;
  return `TU-${prefix}-${stamp}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function initServices() {
  const dialog = document.querySelector("[data-service-dialog]");
  const content = dialog?.querySelector("[data-service-content]");
  let currentService = null;

  function setHeader(service) {
    const locale = getLocale();
    const [kicker, title, description] = copy[locale][service];
    dialog.querySelector("[data-service-kicker]").textContent = kicker;
    dialog.querySelector("[data-service-title]").textContent = title;
    dialog.querySelector("[data-service-description]").textContent = description;
  }

  function renderApplication() {
    const locale = getLocale();
    const c = copy[locale];
    const options = schools[locale].map((school) => `<option>${school}</option>`).join("");
    content.innerHTML = `
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
          <button class="button button-secondary" type="button" data-save-application>${c.save}</button>
          <button class="button button-primary" type="submit">${c.submit} <span>→</span></button>
        </div>
      </form>`;

    const form = content.querySelector("[data-application-form]");
    const draft = JSON.parse(window.localStorage.getItem("tu:application:draft") || "null");
    if (draft) {
      Object.entries(draft).forEach(([key, value]) => {
        const field = form.elements.namedItem(key);
        if (field && typeof value === "string") field.value = value;
      });
    }
    content.querySelector("[data-save-application]").addEventListener("click", () => {
      const values = Object.fromEntries(new FormData(form).entries());
      window.localStorage.setItem("tu:application:draft", JSON.stringify(values));
      showToast(c.saved);
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) {
        showToast(c.required);
        return;
      }
      const id = reference("A");
      const record = { id, submittedAt: new Date().toISOString(), ...Object.fromEntries(new FormData(form).entries()) };
      const submissions = JSON.parse(window.localStorage.getItem("tu:application:submissions") || "[]");
      submissions.push(record);
      window.localStorage.setItem("tu:application:submissions", JSON.stringify(submissions));
      window.localStorage.removeItem("tu:application:draft");
      content.innerHTML = `
        <div class="service-success">
          <span aria-hidden="true">✓</span>
          <p>ADMISSIONS 2026</p>
          <h3>${c.accepted}</h3>
          <strong>${id}</strong>
          <p>${c.acceptedBody}</p>
          <button class="button button-secondary" type="button" data-new-application>${c.newApplication}</button>
        </div>`;
      content.querySelector("[data-new-application]").addEventListener("click", renderApplication);
    });
  }

  function renderAvailability() {
    const locale = getLocale();
    const c = copy[locale];
    const buildings = [...new Set(roomAvailability.map((room) => room.building))];
    content.innerHTML = `
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
      list.innerHTML = roomAvailability
        .filter((room) => selected === "all" || room.building === selected)
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
    };
    select.addEventListener("change", renderRooms);
    renderRooms();
  }

  function renderVisit() {
    const locale = getLocale();
    const c = copy[locale];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    content.innerHTML = `
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
          <span>VISITOR PASS / OPEN CAMPUS 2026</span>
          <button class="button button-primary" type="submit">${c.reserve} <span>→</span></button>
        </div>
      </form>`;
    const form = content.querySelector("[data-visit-form]");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const id = reference("V");
      const record = { id, submittedAt: new Date().toISOString(), ...Object.fromEntries(new FormData(form).entries()) };
      const visits = JSON.parse(window.localStorage.getItem("tu:visits") || "[]");
      visits.push(record);
      window.localStorage.setItem("tu:visits", JSON.stringify(visits));
      content.innerHTML = `
        <div class="service-success">
          <span aria-hidden="true">門</span>
          <p>VISITOR PASS</p>
          <h3>${c.reserved}</h3>
          <strong>${id}</strong>
          <p>${c.reservedBody}</p>
        </div>`;
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
    content.innerHTML = renderTable([c.menu, c.contents, c.price, c.note], diningMenus[locale]);
  }

  function renderTimetable() {
    const locale = getLocale();
    const c = copy[locale];
    const rows = timetable.map(([time, course, room, instructor]) => [
      time,
      localized(course, locale),
      room,
      localized(instructor, locale),
    ]);
    content.innerHTML = renderTable([c.time, c.course, c.room, c.instructor], rows);
  }

  function renderExams() {
    const locale = getLocale();
    const c = copy[locale];
    const rows = exams.map((row) => row.map((cell) => localized(cell, locale)));
    content.innerHTML = renderTable([c.date, c.examination, c.venue, c.format], rows);
  }

  const renderers = {
    application: renderApplication,
    availability: renderAvailability,
    visit: renderVisit,
    dining: renderDining,
    timetable: renderTimetable,
    exams: renderExams,
  };

  function openService(service) {
    if (!renderers[service] || !dialog) return;
    currentService = service;
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
    openService(trigger.dataset.service);
  });
  document.querySelector("[data-service-close]")?.addEventListener("click", () => dialog?.close());
  window.addEventListener("tu:languagechange", () => {
    if (!currentService) return;
    setHeader(currentService);
    renderers[currentService]();
  });
}
