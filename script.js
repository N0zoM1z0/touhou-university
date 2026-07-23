const facultyProfiles = {
  reimu: {
    field: "INCIDENT STUDIES / 異變應對",
    name: "博麗 靈夢",
    role: "異變應對實務教授・博麗神社巫女",
    canon:
      "人類巫女，居於幻想鄉邊界的博麗神社，也是系列中最主要的異變解決者之一。擅長結界、淨化與直覺性的現場判斷。",
    au:
      "主持「異變現場不升級原則」與符卡式答辯課。她評分很直接：先找到真正的問題，再決定要不要出手。",
  },
  yukari: {
    field: "BOUNDARY GOVERNANCE / 結界治理",
    name: "八雲 紫",
    role: "結界研究創院教授・幻想鄉賢者",
    canon:
      "操縱境界的妖怪，與幻想鄉的維持及長期規劃密切相關。她優雅、間接而富策略性，但不應被描寫為全知。",
    au:
      "講授邊界拓撲、制度風險與外界物件漂移。課程最難的一點，是確認「沒有出現」究竟代表缺席、遺忘，還是刻意保留。",
  },
  keine: {
    field: "HISTORY & MEMORY / 歷史記憶",
    name: "上白澤 慧音",
    role: "歷史記錄學院院長・寺子屋教師",
    canon:
      "人里教師與守護者；在不同形態下與吞噬、創造歷史的能力相關。她重視職責，也對人類友善。",
    au:
      "把歷史能力放進嚴格的史料倫理框架，要求學生先區分『曾經發生』、『被記錄』與『被允許記得』。",
  },
  patchouli: {
    field: "ELEMENTAL MAGIC / 元素魔法",
    name: "帕秋莉・諾蕾姬",
    role: "元素理論教授・紅魔館圖書館學者",
    canon:
      "長居紅魔館圖書館的魔法使，以元素魔法與大量知識見長。其專業不應被簡化成單純的圖書管理或體弱笑話。",
    au:
      "負責七曜元素、魔導書批判校勘與封閉環境實驗。借閱她的參考書前，必須先交出完整的歸還條件。",
  },
  marisa: {
    field: "APPLIED MAGIC / 應用魔法",
    name: "霧雨 魔理沙",
    role: "應用魔法教授・普通的魔法使",
    canon:
      "人類魔法使、實驗者與異變解決者。高出力光與星系魔法很具代表性；她的能力來自持續學習與練習，而非毫不費力。",
    au:
      "開設『失敗要能重現』實驗課。學生不只要做出強力魔法，還要寫下它為什麼成功、哪裡危險，以及下次如何不同。",
  },
  eirin: {
    field: "LUNAR MEDICINE / 月都醫藥",
    name: "八意 永琳",
    role: "月都醫藥生命學院院長・永遠亭藥師",
    canon:
      "永遠亭的醫藥大師，能製作各種藥物，並向人類與妖怪提供藥品；也具有月都背景與廣博知識。",
    au:
      "主持跨種族藥理與公共衛生。校規特別強調：醫療權威、長壽與能力優勢都不能代替患者的知情同意。",
  },
  nitori: {
    field: "KAPPA ENGINEERING / 河童工學",
    name: "河城 荷取",
    role: "河童工程學院院長・水利技師",
    canon:
      "妖怪山的河童工程師與商人，對機械、工具與技術產品抱有高度興趣，也具備實際製作能力。",
    au:
      "要求所有原型在『會動』之外，再通過防水、維修與非妖力使用者測試。警告標籤是作業的一部分。",
  },
  aya: {
    field: "JOURNALISM / 新聞傳播",
    name: "射命丸 文",
    role: "天狗新聞傳播學院院長・《文文。新聞》記者",
    canon:
      "鴉天狗記者，使用相機與記事本，速度快、社交靈活，也會積極塑造報導角度。她的新聞是重要但有立場的在世界資料。",
    au:
      "負責採訪、攝影與消息來源課程。學生必須練習訂正傷害、辨認標題誘惑，並理解『能拍到』不等於『可以刊登』。",
  },
};

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const facultyDialog = document.querySelector("[data-faculty-dialog]");
const prospectusDialog = document.querySelector("[data-prospectus-dialog]");
const toast = document.querySelector("[data-toast]");

let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

function setMenu(open) {
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "關閉選單" : "開啟選單");
  mobileMenu.hidden = !open;
  document.body.classList.toggle("menu-open", open);
}

menuToggle?.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

function updateHeader() {
  header?.classList.toggle("is-fixed", window.scrollY > 80);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

document.querySelectorAll(".school-row").forEach((row) => {
  row.style.setProperty("--row-accent", row.dataset.accent);
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -30px" },
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

function revealCurrentHash() {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  if (!target) return;
  if (target.classList.contains("reveal")) target.classList.add("is-visible");
  target.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

revealCurrentHash();
window.addEventListener("hashchange", revealCurrentHash);

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = entry.target;
      const finalValue = Number(target.dataset.count);
      const started = performance.now();
      const duration = 1100;

      function updateCounter(now) {
        const progress = Math.min((now - started) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        target.textContent = Math.round(finalValue * eased);
        if (progress < 1) requestAnimationFrame(updateCounter);
      }

      requestAnimationFrame(updateCounter);
      observer.unobserve(target);
    });
  },
  { threshold: 0.7 },
);

document.querySelectorAll("[data-count]").forEach((counter) => counterObserver.observe(counter));

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => {
      item.classList.toggle("active", item === button);
    });
    document.querySelectorAll(".faculty-card").forEach((card) => {
      const visible = category === "all" || card.dataset.category === category;
      card.classList.toggle("is-hidden", !visible);
    });
  });
});

document.querySelectorAll("[data-faculty]").forEach((button) => {
  button.addEventListener("click", () => {
    const profile = facultyProfiles[button.dataset.faculty];
    if (!profile || !facultyDialog) return;
    facultyDialog.querySelector("[data-dialog-field]").textContent = profile.field;
    facultyDialog.querySelector("[data-dialog-name]").textContent = profile.name;
    facultyDialog.querySelector("[data-dialog-role]").textContent = profile.role;
    facultyDialog.querySelector("[data-dialog-canon]").textContent = profile.canon;
    facultyDialog.querySelector("[data-dialog-au]").textContent = profile.au;
    facultyDialog.showModal();
  });
});

document.querySelector("[data-dialog-close]")?.addEventListener("click", () => {
  facultyDialog.close();
});

document.querySelectorAll("[data-prospectus]").forEach((button) => {
  button.addEventListener("click", () => prospectusDialog?.showModal());
});

document.querySelector("[data-prospectus-close]")?.addEventListener("click", () => {
  prospectusDialog.close();
});

document.querySelector("[data-prospectus-jump]")?.addEventListener("click", () => {
  prospectusDialog.close();
  showToast("已帶你前往 2026 招生流程。");
});

[facultyDialog, prospectusDialog].forEach((dialog) => {
  dialog?.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    const inside =
      event.clientX >= bounds.left &&
      event.clientX <= bounds.right &&
      event.clientY >= bounds.top &&
      event.clientY <= bounds.bottom;
    if (!inside) dialog.close();
  });
});

document.querySelectorAll(".accordion details").forEach((details) => {
  details.addEventListener("toggle", () => {
    if (!details.open) return;
    document.querySelectorAll(".accordion details").forEach((item) => {
      if (item !== details) item.open = false;
    });
  });
});

document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showToast("這是虛構校務信箱，不會收集或寄送任何資料。");
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    menuToggle.focus();
  }
});
