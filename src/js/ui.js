import { getLocale } from "./i18n.js";

const toast = document.querySelector("[data-toast]");
let toastTimer;

export function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3400);
}

function closeOnBackdrop(dialog) {
  dialog?.addEventListener("click", (event) => {
    // A click on the backdrop targets the dialog itself. Coordinate-based
    // detection also sees native <select> popovers as outside clicks on some
    // browsers, which used to close the whole form after choosing an option.
    if (event.target === dialog) dialog.close();
  });
}

export function initUI() {
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const prospectusDialog = document.querySelector("[data-prospectus-dialog]");
  const activePage = document.body.dataset.page;
  const activeFile = {
    home: "index.html",
    academics: "academics.html",
    admissions: "admissions.html",
    research: "research.html",
    campus: "campus.html",
    mytu: "mytu.html",
    library: "library.html",
    housing: "housing.html",
  }[activePage];
  document.querySelectorAll(".desktop-nav a, .mobile-menu nav a, .header-mytu").forEach((link) => {
    const matches = activeFile && link.getAttribute("href")?.startsWith(activeFile);
    if (matches) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  function setMenu(open) {
    menuToggle?.setAttribute("aria-expanded", String(open));
    const copy = {
      "zh-Hant": open ? "關閉選單" : "開啟選單",
      ja: open ? "メニューを閉じる" : "メニューを開く",
      en: open ? "Close menu" : "Open menu",
    };
    menuToggle?.setAttribute("aria-label", copy[getLocale()]);
    if (mobileMenu) mobileMenu.hidden = !open;
    document.body.classList.toggle("menu-open", open);
  }

  menuToggle?.addEventListener("click", () => {
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
  });
  mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

  const updateHeader = () => header?.classList.toggle("is-fixed", window.scrollY > 80);
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  document.querySelectorAll(".school-row").forEach((row) => {
    row.style.setProperty("--row-accent", row.dataset.accent);
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -30px" },
  );
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

  function revealCurrentHash() {
    if (!window.location.hash) return;
    const target = document.querySelector(window.location.hash);
    if (!target) return;
    target.classList.add("is-visible");
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
        const updateCounter = (now) => {
          const progress = Math.min((now - started) / duration, 1);
          target.textContent = Math.round(finalValue * (1 - Math.pow(1 - progress, 3)));
          if (progress < 1) requestAnimationFrame(updateCounter);
        };
        requestAnimationFrame(updateCounter);
        observer.unobserve(target);
      });
    },
    { threshold: 0.7 },
  );
  document.querySelectorAll("[data-count]").forEach((counter) => counterObserver.observe(counter));

  document.querySelectorAll(".accordion details").forEach((details) => {
    details.addEventListener("toggle", () => {
      if (!details.open) return;
      document.querySelectorAll(".accordion details").forEach((item) => {
        if (item !== details) item.open = false;
      });
    });
  });

  document.querySelectorAll("[data-prospectus]").forEach((button) => {
    button.addEventListener("click", () => prospectusDialog?.showModal());
  });
  document.querySelectorAll("[data-prospectus-close]").forEach((button) => {
    button.addEventListener("click", () => prospectusDialog?.close());
  });
  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const copy = {
        "zh-Hant": "已複製入學相談室地址：admissions@touhou.university",
        ja: "入学相談室のアドレスをコピーしました：admissions@touhou.university",
        en: "Admissions address copied: admissions@touhou.university",
      };
      navigator.clipboard?.writeText("admissions@touhou.university");
      showToast(copy[getLocale()]);
    });
  });

  document.querySelectorAll("dialog").forEach(closeOnBackdrop);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menuToggle.focus();
    }
  });
}
