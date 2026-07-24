import { mkdir, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  gaokaoDifficulties,
  gaokaoMeta,
  gaokaoQuestionsFor,
  gaokaoSubjects,
  gaokaoTracks,
} from "../src/data/gaokao.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "downloads", "gaokao");
const locales = ["zh-Hant", "ja", "en"];

const labels = {
  "zh-Hant": {
    title: "幻想鄉統一學力試驗",
    paper: "試題本",
    answers: "參考答案與評分說明",
    candidate: "考生姓名",
    number: "准考證號",
    duration: "考試時間",
    total: "滿分 150 分",
    instruction: "所有題目均為單選題。材料框屬於題目；除非另有說明，月相、時間、路線與版本均以材料框為準，不讀取網站即時狀態。請把答案填在另紙，列印前確認組別、難度與頁碼。",
    print: "列印／另存 PDF",
    answer: "答案",
    explanation: "解析",
    marks: "分",
    source: "題目材料 · 獨立條件",
    minutes: "分鐘",
    generated: "本檔可完全離線閱讀；題號、選項順序與線上模擬一致。",
  },
  ja: {
    title: "幻想郷統一高等試験",
    paper: "問題冊子",
    answers: "参考解答・採点説明",
    candidate: "受験者氏名",
    number: "受験番号",
    duration: "試験時間",
    total: "満点 150点",
    instruction: "全問単一選択。資料枠も問題の一部。別記がない限り月相・時刻・経路・版は資料枠に従い、サイトの現在状態は参照しない。解答は別紙へ記入し、印刷前に区分・難度・頁を確認すること。",
    print: "印刷／PDF保存",
    answer: "解答",
    explanation: "解説",
    marks: "点",
    source: "問題資料 · 独立条件",
    minutes: "分",
    generated: "完全オフラインで閲覧可能。問題番号と選択肢順はオンライン模試と共通です。",
  },
  en: {
    title: "Gensokyo Unified Examination",
    paper: "Question Paper",
    answers: "Reference Answers & Marking Notes",
    candidate: "Candidate name",
    number: "Candidate number",
    duration: "Time allowed",
    total: "Maximum: 150 marks",
    instruction: "All items are single-choice. Source boxes are part of the question. Unless stated otherwise, lunar phase, time, route, and version come only from the source box, not the site's live state. Record answers separately and confirm track, difficulty, and page order.",
    print: "Print / Save as PDF",
    answer: "Answer",
    explanation: "Explanation",
    marks: "marks",
    source: "Source dossier · independent conditions",
    minutes: "minutes",
    generated: "This file works fully offline. Question IDs and option order match the online simulation.",
  },
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function render(trackId, difficultyId, locale, answerKey) {
  const track = gaokaoTracks[trackId];
  const difficulty = gaokaoDifficulties[difficultyId];
  const c = labels[locale];
  const questions = gaokaoQuestionsFor(trackId, difficultyId);
  const body = track.subjects.map((subjectId, subjectIndex) => {
    const subject = gaokaoSubjects[subjectId];
    const subjectQuestions = questions.filter((question) => question.subjectId === subjectId);
    const marks = subjectQuestions.reduce((sum, question) => sum + question.points, 0);
    return `
      <section>
        <header><span>${String(subjectIndex + 1).padStart(2, "0")} / ${subject.code}</span><h2>${escapeHtml(subject.name[locale])}</h2><p>${escapeHtml(subject.note[locale])}</p><b>${marks} ${c.marks}</b></header>
        ${subjectQuestions.map((question, index) => `
          <article>
            <h3><span>${question.id}</span>${index + 1}. ${escapeHtml(question.prompt[locale])}<small>${question.points} ${c.marks}</small></h3>
            ${question.evidence ? `<div class="source"><b>${c.source}</b><pre>${escapeHtml(question.evidence[locale])}</pre></div>` : ""}
            <ol type="A">${question.options.map((option) => `<li>${escapeHtml(option[locale])}</li>`).join("")}</ol>
            ${answerKey ? `<div class="key"><strong>${c.answer}: ${String.fromCharCode(65 + question.answer)}</strong><p><b>${c.explanation}</b>${escapeHtml(question.explanation[locale])}</p></div>` : ""}
          </article>`).join("")}
      </section>`;
  }).join("");
  return `<!doctype html>
<html lang="${locale}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${c.title} · ${difficulty.label} · ${track.name[locale]} · ${answerKey ? c.answers : c.paper}</title>
  <style>
    :root{font-family:system-ui,-apple-system,"Noto Sans TC","Noto Sans JP",sans-serif;color:#18222e;background:#ded6ca}
    *{box-sizing:border-box}body{margin:0}.toolbar{position:sticky;top:0;z-index:2;display:flex;padding:12px 5vw;align-items:center;justify-content:space-between;color:#fff;background:#172536}
    .toolbar button{padding:8px 12px;color:#172536;border:0;background:#f5ead8;font-weight:700;cursor:pointer}
    main{width:min(900px,calc(100% - 24px));margin:24px auto;padding:55px 68px;background:#fffdf7;box-shadow:0 18px 60px #2920152b}
    .cover{min-height:740px;padding:80px 45px;border:4px double #18222e;text-align:center;break-after:page}.cover>p{letter-spacing:.2em}.cover h1{margin:78px 0 15px;font-family:serif;font-size:44px}.cover h2{color:#8e2f37;font-family:serif;font-size:26px}.cover h3{margin:8px 0;font-size:16px;letter-spacing:.16em}
    .cover dl{margin:62px auto 30px;max-width:560px;text-align:left}.cover dl div{display:grid;padding:12px;grid-template-columns:150px 1fr;border-bottom:1px solid #18222e}.cover dd{margin:0}
    .cover .instruction{padding:18px;border:1px solid #999;text-align:left;line-height:1.7}.cover footer{margin-top:50px;color:#666;font-size:11px}
    section{padding-top:40px;break-before:page}section>header{position:relative;border-top:4px double #18222e;border-bottom:1px solid #18222e}section>header span{font-size:11px;font-weight:800;letter-spacing:.12em}section>header h2{margin:8px 0 3px;font-family:serif;font-size:28px}section>header p{margin:0 0 13px;color:#666}section>header>b{position:absolute;right:0;bottom:13px;color:#8e2f37}
    article{padding:28px 0;border-bottom:1px solid #ddd;break-inside:avoid}article h3{display:grid;margin:0;grid-template-columns:58px 1fr auto;gap:8px;font-family:serif;font-size:16px;line-height:1.65}article h3>span{color:#8e2f37;font:800 10px system-ui}article h3 small{font:700 10px system-ui;color:#8e2f37}article ol{margin:15px 0 0 70px;padding-left:25px}article li{padding:5px;line-height:1.55}
    .source{margin:16px 0 3px 70px;padding:14px 17px;border:1px solid #b7a992;background:#f5eee1}.source>b{font-size:9px;letter-spacing:.12em;color:#8e2f37}.source pre{margin:8px 0 0;white-space:pre-wrap;font:12px/1.65 serif}
    .key{margin:18px 0 0 70px;padding:14px 17px;border-left:4px solid #56756b;background:#edf2ed}.key>strong{color:#8e2f37}.key p{margin:8px 0 0;line-height:1.6}.key p b{margin-right:9px}
    @media(max-width:650px){main{padding:30px 20px}.cover{min-height:0;padding:45px 18px}.cover h1{margin-top:55px;font-size:32px}article h3{grid-template-columns:52px 1fr}article h3 small{grid-column:2}article ol,.source,.key{margin-left:10px}}
    @media print{body{background:#fff}.toolbar{display:none}main{width:auto;margin:0;padding:0;box-shadow:none}.cover{min-height:95vh}@page{size:A4;margin:16mm}}
  </style>
</head>
<body>
  <div class="toolbar"><span>${gaokaoMeta.edition} · ${difficulty.label} · ${track.name[locale]} · ${answerKey ? c.answers : c.paper}</span><button onclick="window.print()">${c.print}</button></div>
  <main>
    <header class="cover">
      <p>${gaokaoMeta.edition} · ${gaokaoMeta.year}</p>
      <h1>${c.title}</h1>
      <h2>${track.name[locale]} · ${answerKey ? c.answers : c.paper}</h2>
      <h3>${difficulty.label}</h3>
      <dl><div><dt>${c.candidate}</dt><dd>____________________________</dd></div><div><dt>${c.number}</dt><dd>____________________________</dd></div><div><dt>${c.duration}</dt><dd>${Math.round(difficulty.duration / 60)} ${c.minutes} · ${c.total}</dd></div></dl>
      <p class="instruction">${c.instruction}</p>
      <footer>${c.generated}</footer>
    </header>
    ${body}
  </main>
</body>
</html>`;
}

await mkdir(output, { recursive: true });
for (const filename of await readdir(output)) {
  if (/^gke-.*\.html$/u.test(filename)) await unlink(path.join(output, filename));
}

let count = 0;
for (const locale of locales) {
  for (const difficultyId of Object.keys(gaokaoDifficulties)) {
    for (const trackId of Object.keys(gaokaoTracks)) {
      for (const answerKey of [false, true]) {
        const suffix = answerKey ? "answers" : "paper";
        const filename = `${gaokaoMeta.edition.toLowerCase()}-${locale}-${difficultyId}-${trackId}-${suffix}.html`;
        const document = render(trackId, difficultyId, locale, answerKey).replace(/[ \t]+$/gmu, "");
        await writeFile(path.join(output, filename), document, "utf8");
        count += 1;
      }
    }
  }
}
console.log(`Built ${count} offline Gensokyo examination files.`);
