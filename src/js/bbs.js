import { getLocale } from "./i18n.js";
import { showToast } from "./ui.js";

const labels = {
  "zh-Hant": {
    course: "課程",
    club: "社團",
    market: "交換",
    notice: "校務",
    justNow: "剛剛",
    replies: "回覆",
    posted: "新帖已發佈至校園 BBS。",
    anonymous: "匿名學生",
  },
  ja: {
    course: "授業",
    club: "団体",
    market: "交換",
    notice: "学務",
    justNow: "たった今",
    replies: "返信",
    posted: "学内 BBS に投稿しました。",
    anonymous: "匿名学生",
  },
  en: {
    course: "Courses",
    club: "Clubs",
    market: "Exchange",
    notice: "Campus",
    justNow: "just now",
    replies: "Replies",
    posted: "Published to the Campus BBS.",
    anonymous: "Anonymous Student",
  },
};

export function initBbs() {
  const dialog = document.querySelector("[data-compose-dialog]");
  const form = document.querySelector("[data-bbs-form]");
  const list = document.querySelector("[data-bbs-list]");
  let activeFilter = "all";

  function createPostElement(post) {
    const locale = getLocale();
    const article = document.createElement("article");
    article.className = "bbs-row user-post";
    article.dataset.bbsCategory = post.category;
    article.dataset.userPost = post.id;

    const category = document.createElement("span");
    category.className = "bbs-category";
    category.textContent = labels[locale][post.category];
    const body = document.createElement("div");
    const title = document.createElement("p");
    title.textContent = post.title;
    const meta = document.createElement("small");
    meta.textContent = `${post.author}・${labels[locale].justNow}`;
    body.append(title, meta);
    const replies = document.createElement("span");
    replies.className = "bbs-replies";
    const count = document.createElement("b");
    count.textContent = "0";
    replies.append(count, ` ${labels[locale].replies}`);
    article.append(category, body, replies);
    return article;
  }

  function renderUserPosts() {
    list?.querySelectorAll("[data-user-post]").forEach((node) => node.remove());
    const posts = JSON.parse(window.localStorage.getItem("tu:bbs:posts") || "[]");
    posts.slice().reverse().forEach((post) => list?.prepend(createPostElement(post)));
    applyFilter();
  }

  function updateComposeDefault() {
    const author = form?.elements.author;
    if (!author) return;
    const knownDefaults = Object.values(labels).map((localeLabels) => localeLabels.anonymous);
    if (knownDefaults.includes(author.value)) author.value = labels[getLocale()].anonymous;
  }

  function applyFilter() {
    list?.querySelectorAll("[data-bbs-category]").forEach((post) => {
      post.hidden = activeFilter !== "all" && post.dataset.bbsCategory !== activeFilter;
    });
  }

  document.querySelectorAll("[data-bbs-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.bbsFilter;
      document.querySelectorAll("[data-bbs-filter]").forEach((item) => item.classList.toggle("active", item === button));
      applyFilter();
    });
  });

  document.querySelector("[data-bbs-compose]")?.addEventListener("click", () => dialog?.showModal());
  document.querySelector("[data-compose-close]")?.addEventListener("click", () => dialog?.close());
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form).entries());
    const post = { id: `post-${Date.now()}`, createdAt: new Date().toISOString(), ...values };
    const posts = JSON.parse(window.localStorage.getItem("tu:bbs:posts") || "[]");
    posts.push(post);
    window.localStorage.setItem("tu:bbs:posts", JSON.stringify(posts));
    form.reset();
    form.elements.author.value = labels[getLocale()].anonymous;
    dialog?.close();
    renderUserPosts();
    showToast(labels[getLocale()].posted);
  });

  window.addEventListener("tu:languagechange", () => {
    renderUserPosts();
    updateComposeDefault();
  });
  renderUserPosts();
}
