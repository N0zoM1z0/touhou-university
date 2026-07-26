import { seededPosts } from "../data/community.js";
import { getLocale } from "./i18n.js";
import { openInfoDialog } from "./info-dialog.js";
import { showToast } from "./ui.js";
import { closeDeepLink, navigateToDeepLink, registerDeepLink } from "./deep-links.js";
import { recordCampusEvent } from "./campus-ledger.js";
import { incidentCommunityPosts } from "./incident-model.js";
import { siteHref } from "./site-router.js";
import { liveCampusSnapshot, seededPostCreatedAt } from "../data/live-campus.js";
import { governanceCommunityPosts } from "./governance-model.js";
import { academicCommunityPosts } from "./academic-model.js";
import { clinicCommunityPosts } from "./clinic-model.js";
import { appraisalCommunityPosts } from "./appraisal-model.js";
import { spellcardCommunityPosts } from "./spellcard-workshop-model.js";

const labels = {
  "zh-Hant": {
    course: "課程",
    club: "社團",
    market: "交換",
    notice: "校務",
    justNow: "剛剛",
    minutes: "分鐘前",
    hours: "小時前",
    days: "天前",
    replies: "回覆",
    posted: "新帖已發佈至校園 BBS。",
    shuffled: "已從校園風聲中換了一批話題。",
    anonymous: "匿名學生",
    author: "發帖者",
    board: "板面",
    local: "儲存在這台裝置",
    online: "目前在線",
    topics: "本日主題",
    synced: "最後同步",
    pinned: "置頂",
    status: "狀態",
    mine: "我的發帖",
    localSaved: "本機保存",
    postsUnit: "篇",
    noPosts: "這個板面暫時沒有帖子。",
    noLocalPosts: "這台裝置還沒有發帖；發佈後會保存在這裡。",
    incidentLinked: "事件連動",
    contestedFile: "紅線爭議案卷",
    governanceLinked: "議事鐘連動",
    academicLinked: "答辯連動",
    clinicLinked: "校醫院連動",
    appraisalLinked: "漂流物鑑定連動",
    spellcardLinked: "符卡答辯連動",
    openCase: "查看結案案卷",
    openGovernance: "查看校務提案",
    openAcademic: "查看答辯與成績",
    openClinic: "查看診療與處方",
    openAppraisal: "查看漂流物案卷",
    openSpellcard: "查看符卡設計與答辯",
  },
  ja: {
    course: "授業",
    club: "団体",
    market: "交換",
    notice: "学務",
    justNow: "たった今",
    minutes: "分前",
    hours: "時間前",
    days: "日前",
    replies: "返信",
    posted: "学内 BBS に投稿しました。",
    shuffled: "キャンパスの風から別の話題を読み込みました。",
    anonymous: "匿名学生",
    author: "投稿者",
    board: "板",
    local: "この端末に保存",
    online: "オンライン",
    topics: "本日のトピック",
    synced: "最終同期",
    pinned: "固定",
    status: "状態",
    mine: "自分の投稿",
    localSaved: "端末保存",
    postsUnit: "件",
    noPosts: "この板にはまだ投稿がありません。",
    noLocalPosts: "この端末からの投稿はまだありません。投稿後はここに保存されます。",
    incidentLinked: "事案連動",
    contestedFile: "赤糸係争記録",
    governanceLinked: "議事鐘連動",
    academicLinked: "答弁連動",
    clinicLinked: "校医院連動",
    appraisalLinked: "漂流物鑑定連動",
    spellcardLinked: "スペルカード答弁連動",
    openCase: "終結記録を見る",
    openGovernance: "学務提案を見る",
    openAcademic: "答弁・成績を見る",
    openClinic: "診療・処方を見る",
    openAppraisal: "漂流物記録を見る",
    openSpellcard: "設計・答弁を見る",
  },
  en: {
    course: "Courses",
    club: "Clubs",
    market: "Exchange",
    notice: "Campus",
    justNow: "just now",
    minutes: "minutes ago",
    hours: "hours ago",
    days: "days ago",
    replies: "Replies",
    posted: "Published to the Campus BBS.",
    shuffled: "A fresh set of topics arrived on the campus wind.",
    anonymous: "Anonymous Student",
    author: "Posted by",
    board: "Board",
    local: "Stored on this device",
    online: "Online now",
    topics: "Topics today",
    synced: "Last synced",
    pinned: "Pinned",
    status: "Status",
    mine: "My Posts",
    localSaved: "Saved locally",
    postsUnit: "posts",
    noPosts: "There are no posts on this board yet.",
    noLocalPosts: "Nothing has been posted from this device yet. New posts will be saved here.",
    incidentLinked: "Incident-linked",
    contestedFile: "Red-thread contested file",
    governanceLinked: "Governance-linked",
    academicLinked: "Defence-linked",
    clinicLinked: "Hospital-linked",
    appraisalLinked: "Drift-appraisal-linked",
    spellcardLinked: "Spell-card-defence-linked",
    openCase: "Open closure record",
    openGovernance: "Open governance proposal",
    openAcademic: "Open defence & grades",
    openClinic: "Open care & prescriptions",
    openAppraisal: "Open drift-object file",
    openSpellcard: "Open design & defence",
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

function readStored(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}

function relativeTime(createdAt, localeLabels) {
  const elapsed = Math.max(0, Date.now() - new Date(createdAt).getTime());
  const minutes = Math.floor(elapsed / 60_000);
  if (!Number.isFinite(minutes) || minutes < 1) return localeLabels.justNow;
  if (minutes >= 1_440) return `${Math.floor(minutes / 1_440)} ${localeLabels.days}`;
  if (minutes >= 60) return `${Math.floor(minutes / 60)} ${localeLabels.hours}`;
  return `${minutes} ${localeLabels.minutes}`;
}

function linkedPostAction(post, l) {
  if (post.incidentId) {
    return {
      label: l.openCase,
      handler: () => window.location.assign(siteHref(`incident-case-${post.incidentId}`)),
    };
  }
  if (post.governanceId) {
    return {
      label: l.openGovernance,
      handler: () => window.location.assign(siteHref("governance")),
    };
  }
  if (post.academicRoute) {
    return {
      label: l.openAcademic,
      handler: () => window.location.assign(siteHref(post.academicRoute)),
    };
  }
  if (post.clinicRoute) {
    return {
      label: l.openClinic,
      handler: () => window.location.assign(siteHref(post.clinicRoute)),
    };
  }
  if (post.appraisalRoute) {
    return {
      label: l.openAppraisal,
      handler: () => window.location.assign(siteHref(post.appraisalRoute)),
    };
  }
  if (post.spellcardRoute) {
    return {
      label: l.openSpellcard,
      handler: () => window.location.assign(siteHref(post.spellcardRoute)),
    };
  }
  return undefined;
}

function linkedPostLabel(post, l) {
  if (post.contested) return l.contestedFile;
  if (post.governance) return l.governanceLinked;
  if (post.academic) return l.academicLinked;
  if (post.clinic) return l.clinicLinked;
  if (post.appraisal) return l.appraisalLinked;
  if (post.spellcard) return l.spellcardLinked;
  return l.incidentLinked;
}

export function initBbs() {
  const dialog = document.querySelector("[data-compose-dialog]");
  const form = document.querySelector("[data-bbs-form]");
  const list = document.querySelector("[data-bbs-list]");
  let activeFilter = "all";
  let selectedSeedIndexes = [];
  let currentOnline = 80 + randomIndex(81);
  let topicsToday = 55 + randomIndex(76);
  let draftTimer;
  let clockTimer;

  function chooseSeedPosts() {
    selectedSeedIndexes = [0, ...shuffle(seededPosts.slice(1).map((_, index) => index + 1)).slice(0, 8)];
    const state = liveCampusSnapshot();
    currentOnline = state.online;
    topicsToday = state.topics;
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
        post.contested ? l.contestedFile : post.local ? l.local : post.time,
      ],
      action: linkedPostAction(post, l),
    });
  }

  function createPostElement(post, { pinned = false } = {}) {
    const locale = getLocale();
    const l = labels[locale];
    const article = document.createElement("article");
    article.className = `bbs-row${pinned ? " pinned" : ""}${post.local ? " user-post" : ""}${post.incidentId ? " incident-post" : ""}${post.contested ? " contested-post" : ""}${post.governance ? " governance-post" : ""}${post.academic ? " academic-post" : ""}${post.clinic ? " clinic-post" : ""}${post.appraisal ? " appraisal-post" : ""}${post.spellcard ? " spellcard-post" : ""}`;
    article.dataset.bbsCategory = post.category;
    article.dataset.bbsId = post.id;
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
    if (post.generated) {
      const linked = document.createElement("span");
      linked.className = "incident-linked";
      linked.textContent = linkedPostLabel(post, l);
      title.append(linked, " ");
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
    trigger.addEventListener("click", () => navigateToDeepLink(`bbs-${post.id}`));
    article.append(category, body, replies, trigger);
    return article;
  }

  function getRenderedPosts() {
    const locale = getLocale();
    const l = labels[locale];
    const userPosts = readStored("tu:bbs:posts", []).map((post) => ({
      ...post,
      author: post.author,
      title: post.title,
      body: post.body,
      replies: 0,
      time: relativeTime(post.createdAt, l),
      local: true,
    }));
    const seeds = selectedSeedIndexes.map((index, position) => {
      const [category, author, title, body, replies] = seededPosts[index];
      const createdAt = seededPostCreatedAt(index, position);
      return {
        id: `seed-${index}`,
        category,
        author: author[locale],
        title: title[locale],
        body: body[locale],
        replies,
        createdAt,
        time: relativeTime(createdAt, l),
        pinned: position === 0,
      };
    });
    const incidentPosts = incidentCommunityPosts(locale).map((post) => ({
      ...post,
      time: relativeTime(post.createdAt, l),
    }));
    const governancePosts = governanceCommunityPosts(locale).map((post) => ({
      ...post,
      time: relativeTime(post.createdAt, l),
    }));
    const academicPosts = academicCommunityPosts(locale).map((post) => ({
      ...post,
      time: relativeTime(post.createdAt, l),
    }));
    const clinicPosts = clinicCommunityPosts(locale).map((post) => ({
      ...post,
      time: relativeTime(post.createdAt, l),
    }));
    const appraisalPosts = appraisalCommunityPosts(locale).map((post) => ({
      ...post,
      time: relativeTime(post.createdAt, l),
    }));
    const spellcardPosts = spellcardCommunityPosts(locale).map((post) => ({
      ...post,
      time: relativeTime(post.createdAt, l),
    }));
    return [...userPosts.reverse(), ...spellcardPosts, ...appraisalPosts, ...clinicPosts, ...academicPosts, ...governancePosts, ...incidentPosts, ...seeds];
  }

  function findPost(id) {
    const rendered = getRenderedPosts().find((post) => post.id === id);
    if (rendered) return rendered;
    const seedIndex = Number(String(id).replace(/^seed-/, ""));
    if (!Number.isInteger(seedIndex) || !seededPosts[seedIndex]) return null;
    const locale = getLocale();
    const l = labels[locale];
    const [category, author, title, body, replies] = seededPosts[seedIndex];
    const createdAt = seededPostCreatedAt(seedIndex, 0);
    return {
      id,
      category,
      author: author[locale],
      title: title[locale],
      body: body[locale],
      replies,
      createdAt,
      time: relativeTime(createdAt, l),
    };
  }

  function renderPosts() {
    if (!list) return;
    list.replaceChildren();
    getRenderedPosts().forEach((post) => {
      list.append(createPostElement(post, { pinned: post.pinned }));
    });
    const empty = document.createElement("p");
    empty.className = "bbs-empty";
    empty.dataset.bbsEmpty = "";
    empty.hidden = true;
    list.append(empty);
    applyFilter();
    updateStatus();
  }

  function applyFilter() {
    const posts = [...(list?.querySelectorAll("[data-bbs-category]") || [])];
    posts.forEach((post) => {
      post.hidden =
        activeFilter !== "all" &&
        (activeFilter === "mine" ? !post.hasAttribute("data-user-post") : post.dataset.bbsCategory !== activeFilter);
    });
    const empty = list?.querySelector("[data-bbs-empty]");
    if (empty) {
      empty.textContent = activeFilter === "mine" ? labels[getLocale()].noLocalPosts : labels[getLocale()].noPosts;
      empty.hidden = posts.some((post) => !post.hidden);
    }
  }

  function updateStatus() {
    const l = labels[getLocale()];
    const online = document.querySelector("[data-bbs-online]");
    const topics = document.querySelector("[data-bbs-topics]");
    const sync = document.querySelector("[data-bbs-sync]");
    const local = document.querySelector("[data-bbs-local]");
    const savedPosts = readStored("tu:bbs:posts", []).length;
    if (online) online.lastChild.textContent = ` ${l.online}：${currentOnline}`;
    if (topics) topics.textContent = `${l.topics}：${topicsToday}`;
    if (sync) {
      const time = new Intl.DateTimeFormat(getLocale(), { hour: "2-digit", minute: "2-digit" }).format(new Date());
      sync.textContent = `${l.synced}：${time}`;
    }
    if (local) local.textContent = `${l.localSaved}：${savedPosts} ${l.postsUnit}`;
  }

  function updateComposeDefault() {
    const author = form?.elements.author;
    if (!author) return;
    const knownDefaults = Object.values(labels).map((localeLabels) => localeLabels.anonymous);
    if (knownDefaults.includes(author.value)) author.value = labels[getLocale()].anonymous;
  }

  function setActiveFilter(filter) {
    activeFilter = filter;
    document.querySelectorAll("[data-bbs-filter]").forEach((item) => {
      const selected = item.dataset.bbsFilter === filter;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    applyFilter();
  }

  function saveComposeDraft() {
    if (!form) return;
    const values = Object.fromEntries(new FormData(form).entries());
    if (!values.title && !values.body && !values.author) {
      window.localStorage.removeItem("tu:bbs:draft");
      return;
    }
    window.localStorage.setItem("tu:bbs:draft", JSON.stringify(values));
  }

  function restoreComposeDraft() {
    const draft = readStored("tu:bbs:draft", null);
    if (!draft || !form) return;
    Object.entries(draft).forEach(([name, value]) => {
      const field = form.elements.namedItem(name);
      if (field && typeof value === "string") field.value = value;
    });
  }

  document.querySelectorAll("[data-bbs-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      setActiveFilter(button.dataset.bbsFilter);
    });
  });

  document.querySelector("[data-bbs-shuffle]")?.addEventListener("click", () => {
    chooseSeedPosts();
    renderPosts();
    showToast(labels[getLocale()].shuffled);
  });
  document.querySelector("[data-bbs-compose]")?.addEventListener("click", () => {
    restoreComposeDraft();
    dialog?.showModal();
  });
  document.querySelector("[data-compose-close]")?.addEventListener("click", () => dialog?.close());
  form?.addEventListener("input", () => {
    window.clearTimeout(draftTimer);
    draftTimer = window.setTimeout(saveComposeDraft, 220);
  });
  form?.addEventListener("change", saveComposeDraft);
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    window.clearTimeout(draftTimer);
    const values = Object.fromEntries(new FormData(form).entries());
    const post = { id: `post-${Date.now()}`, createdAt: new Date().toISOString(), ...values };
    const posts = readStored("tu:bbs:posts", []);
    posts.push(post);
    window.localStorage.setItem("tu:bbs:posts", JSON.stringify(posts.slice(-50)));
    recordCampusEvent(
      "bbs.posted",
      { postId: post.id, category: post.category, title: post.title },
      { id: `bbs.posted:${post.id}`, timestamp: post.createdAt },
    );
    window.localStorage.removeItem("tu:bbs:draft");
    form.reset();
    form.elements.author.value = labels[getLocale()].anonymous;
    dialog?.close();
    renderPosts();
    setActiveFilter("mine");
    showToast(labels[getLocale()].posted);
  });

  window.addEventListener("tu:languagechange", () => {
    renderPosts();
    updateComposeDefault();
  });
  window.addEventListener("tu:incidentchange", renderPosts);
  window.addEventListener("tu:governancechange", renderPosts);
  window.addEventListener("tu:academicchange", renderPosts);
  window.addEventListener("tu:clinicchange", renderPosts);
  window.addEventListener("tu:appraisalchange", renderPosts);
  window.addEventListener("tu:spellcardchange", renderPosts);
  chooseSeedPosts();
  renderPosts();
  clockTimer = window.setInterval(() => {
    const state = liveCampusSnapshot();
    currentOnline = state.online;
    topicsToday = state.topics;
    renderPosts();
  }, 60_000);
  window.addEventListener("pagehide", () => window.clearInterval(clockTimer), { once: true });
  const infoDialog = document.querySelector("[data-info-dialog]");
  registerDeepLink("bbs-", {
    anchor: "#bbs",
    dialog: infoDialog,
    open(id) {
      const post = findPost(id);
      if (post) openPost(post);
    },
    close() {
      if (infoDialog?.open) infoDialog.close();
    },
  });
  infoDialog?.addEventListener("close", () => closeDeepLink("bbs-", "#bbs"));
}
