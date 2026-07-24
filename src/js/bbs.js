import { seededPosts } from "../data/community.js";
import { getLocale } from "./i18n.js";
import { openInfoDialog } from "./info-dialog.js";
import { showToast } from "./ui.js";

const labels = {
  "zh-Hant": {
    course: "課程",
    club: "社團",
    market: "交換",
    notice: "校務",
    justNow: "剛剛",
    minutes: "分鐘前",
    replies: "回覆",
    posted: "新帖已發佈至校園 BBS。",
    shuffled: "已從校園風聲中換了一批話題。",
    anonymous: "匿名學生",
    author: "發帖者",
    board: "板面",
    local: "儲存在這台裝置",
    online: "目前在線",
    topics: "本日主題",
    synced: "最後同步：剛剛",
    pinned: "置頂",
    status: "狀態",
  },
  ja: {
    course: "授業",
    club: "団体",
    market: "交換",
    notice: "学務",
    justNow: "たった今",
    minutes: "分前",
    replies: "返信",
    posted: "学内 BBS に投稿しました。",
    shuffled: "キャンパスの風から別の話題を読み込みました。",
    anonymous: "匿名学生",
    author: "投稿者",
    board: "板",
    local: "この端末に保存",
    online: "オンライン",
    topics: "本日のトピック",
    synced: "最終同期：たった今",
    pinned: "固定",
    status: "状態",
  },
  en: {
    course: "Courses",
    club: "Clubs",
    market: "Exchange",
    notice: "Campus",
    justNow: "just now",
    minutes: "minutes ago",
    replies: "Replies",
    posted: "Published to the Campus BBS.",
    shuffled: "A fresh set of topics arrived on the campus wind.",
    anonymous: "Anonymous Student",
    author: "Posted by",
    board: "Board",
    local: "Stored on this device",
    online: "Online now",
    topics: "Topics today",
    synced: "Last synced: just now",
    pinned: "Pinned",
    status: "Status",
  },
};

function randomIndex(maximum) {
  return crypto.getRandomValues(new Uint32Array(1))[0] % maximum;
}

function shuffle(values) {
  const copy = values.slice();
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const selected = randomIndex(index + 1);
    [copy[index], copy[selected]] = [copy[selected], copy[index]];
  }
  return copy;
}

export function initBbs() {
  const dialog = document.querySelector("[data-compose-dialog]");
  const form = document.querySelector("[data-bbs-form]");
  const list = document.querySelector("[data-bbs-list]");
  let activeFilter = "all";
  let selectedSeedIndexes = [];
  let currentOnline = 80 + randomIndex(81);
  let topicsToday = 55 + randomIndex(76);

  function chooseSeedPosts() {
    selectedSeedIndexes = [0, ...shuffle(seededPosts.slice(1).map((_, index) => index + 1)).slice(0, 8)];
    currentOnline = 80 + randomIndex(81);
    topicsToday = 55 + randomIndex(76);
  }

  function openPost(post) {
    const locale = getLocale();
    const l = labels[locale];
    openInfoDialog({
      kicker: `CAMPUS BBS · ${l[post.category].toUpperCase()}`,
      title: post.title,
      summary: post.body,
      meta: [
        l.author,
        post.author,
        l.board,
        l[post.category],
        l.replies,
        String(post.replies),
        l.status,
        post.local ? l.local : post.time,
      ],
    });
  }

  function createPostElement(post, { pinned = false } = {}) {
    const locale = getLocale();
    const l = labels[locale];
    const article = document.createElement("article");
    article.className = `bbs-row${pinned ? " pinned" : ""}${post.local ? " user-post" : ""}`;
    article.dataset.bbsCategory = post.category;
    if (post.local) article.dataset.userPost = "";

    const category = document.createElement("span");
    category.className = "bbs-category";
    category.textContent = l[post.category];
    const body = document.createElement("div");
    const title = document.createElement("p");
    if (pinned) {
      const pin = document.createElement("span");
      pin.className = "pin";
      pin.textContent = l.pinned;
      title.append(pin, " ");
    }
    title.append(post.title);
    const meta = document.createElement("small");
    meta.textContent = `${post.author}・${post.time}`;
    body.append(title, meta);
    const replies = document.createElement("span");
    replies.className = "bbs-replies";
    const count = document.createElement("b");
    count.textContent = String(post.replies);
    replies.append(count, ` ${l.replies}`);
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "bbs-row-trigger";
    trigger.setAttribute("aria-label", `${post.title} · ${l.author}: ${post.author}`);
    trigger.addEventListener("click", () => openPost(post));
    article.append(category, body, replies, trigger);
    return article;
  }

  function getRenderedPosts() {
    const locale = getLocale();
    const l = labels[locale];
    const userPosts = JSON.parse(window.localStorage.getItem("tu:bbs:posts") || "[]").map((post) => ({
      ...post,
      author: post.author,
      title: post.title,
      body: post.body,
      replies: 0,
      time: l.justNow,
      local: true,
    }));
    const seeds = selectedSeedIndexes.map((index, position) => {
      const [category, author, title, body, replies] = seededPosts[index];
      const minutes = 11 + ((index * 13) % 170);
      return {
        category,
        author: author[locale],
        title: title[locale],
        body: body[locale],
        replies,
        time: `${minutes} ${l.minutes}`,
        pinned: position === 0,
      };
    });
    return [...userPosts.reverse(), ...seeds];
  }

  function renderPosts() {
    if (!list) return;
    list.replaceChildren();
    getRenderedPosts().forEach((post) => {
      list.append(createPostElement(post, { pinned: post.pinned }));
    });
    applyFilter();
    updateStatus();
  }

  function applyFilter() {
    list?.querySelectorAll("[data-bbs-category]").forEach((post) => {
      post.hidden = activeFilter !== "all" && post.dataset.bbsCategory !== activeFilter;
    });
  }

  function updateStatus() {
    const l = labels[getLocale()];
    const online = document.querySelector("[data-bbs-online]");
    const topics = document.querySelector("[data-bbs-topics]");
    const sync = document.querySelector("[data-bbs-sync]");
    if (online) online.lastChild.textContent = ` ${l.online}：${currentOnline}`;
    if (topics) topics.textContent = `${l.topics}：${topicsToday}`;
    if (sync) sync.textContent = l.synced;
  }

  function updateComposeDefault() {
    const author = form?.elements.author;
    if (!author) return;
    const knownDefaults = Object.values(labels).map((localeLabels) => localeLabels.anonymous);
    if (knownDefaults.includes(author.value)) author.value = labels[getLocale()].anonymous;
  }

  document.querySelectorAll("[data-bbs-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.bbsFilter;
      document.querySelectorAll("[data-bbs-filter]").forEach((item) => item.classList.toggle("active", item === button));
      applyFilter();
    });
  });

  document.querySelector("[data-bbs-shuffle]")?.addEventListener("click", () => {
    chooseSeedPosts();
    renderPosts();
    showToast(labels[getLocale()].shuffled);
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
    renderPosts();
    showToast(labels[getLocale()].posted);
  });

  window.addEventListener("tu:languagechange", () => {
    renderPosts();
    updateComposeDefault();
  });
  chooseSeedPosts();
  renderPosts();
}
