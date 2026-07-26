const LEDGER_KEY = "tu:campus:ledger";
const STATE_KEY = "tu:phantasm:state";
const PROJECT_KEY = "tu:academics:projects";
const DEFENCE_KEY = "tu:academics:defences";

const seals = [
  ["coursework", "academic.assignment.graded"],
  ["governance", "governance.vote.cast"],
  ["incident", "incident.resolved"],
  ["housing", "housing.offer.declined"],
  ["course", "course.dropped"],
];

function readJson(key, fallback) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export function phantasmGateProgress() {
  const events = readJson(LEDGER_KEY, []);
  const projects = readJson(PROJECT_KEY, []);
  const defences = readJson(DEFENCE_KEY, []);
  const status = seals.map(([id, type]) => ({
    id,
    met: events.some((event) => event?.type === type),
  }));
  status.push({
    id: "unused-route",
    met: projects.some((project) =>
      String(project?.unusedRoute || "").trim().length >= 18
      && defences.some((defence) => defence?.projectId === project.id)),
  });
  const count = status.filter((seal) => seal.met).length;
  return { count, total: status.length, eligible: count === status.length, seals: status };
}

export function phantasmGateState() {
  const value = readJson(STATE_KEY, {});
  return {
    unlockedAt: value?.unlockedAt || null,
    wakeCount: Math.max(0, Number(value?.wakeCount) || 0),
    residueIndex: Math.max(0, Number(value?.residueIndex) || 0) % 4,
  };
}

export function phantasmGateHint(locale = "zh-Hant") {
  const progress = phantasmGateProgress();
  const state = phantasmGateState();
  const text = progress.count === 0
    ? {
      "zh-Hant": "鐘樓維修單：第一至第八格已核對；第九格不必填。",
      ja: "鐘楼修繕票：第一〜第八欄確認済み。第九欄は記入不要。",
      en: "Bell-tower repair slip: boxes one through eight verified; box nine need not be completed.",
    }
    : progress.count < 3
      ? {
        "zh-Hant": `課表背面有 ${progress.count} 枚印章透了過來；教務處說紙太薄。`,
        ja: `時間割の裏から印が${progress.count}個透けている。学務は紙が薄いだけだと言う。`,
        en: `${progress.count} seals show through the back of the timetable; Academic Affairs blames thin paper.`,
      }
      : progress.count < progress.total
        ? {
          "zh-Hant": `點名簿多了第九行，又被劃掉；目前有 ${progress.count} 個筆跡不肯消失。`,
          ja: `点呼簿に九行目が増え、また消された。現在${progress.count}筆跡が消去を拒む。`,
          en: `A ninth roll-call row appeared and was crossed out; ${progress.count} marks currently refuse erasure.`,
        }
        : state.unlockedAt
          ? {
            "zh-Hant": "第九節仍在點名。夢境校務處否認這是一個入口。",
            ja: "第九時限は点呼中。夢学務室は入口であることを否認。",
            en: "Ninth period is taking attendance. Dream Affairs denies this is an entrance.",
          }
          : {
            "zh-Hant": "第九節點名簿已齊；最後一行的教室欄只寫了「反面」。",
            ja: "第九時限の点呼簿が揃った。最終行の教室欄は「裏面」。",
            en: "The ninth-period roll is complete. The final room field says only “reverse side.”",
          };
  return {
    text: text[locale] || text["zh-Hant"],
    href: progress.eligible ? "phantasm.html#phantasm-campus" : null,
    progress,
    unlocked: Boolean(state.unlockedAt),
  };
}
