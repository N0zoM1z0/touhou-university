const l = (zh, ja, en) => ({ "zh-Hant": zh, ja, en });

export const transportModes = {
  walk: {
    icon: "徒",
    name: l("人里步行", "里道徒歩", "Village Walk"),
    summary: l("最穩定・無轉乘", "最も安定・乗換なし", "Steady · no transfer"),
    factor: 1,
    transfer: 0,
    notice: l(
      "時間以一般人類平地步速估算；山路與竹林已另加緩衝。",
      "一般的な人間の歩行速度を基準とし、山道と竹林には余裕時間を加算しています。",
      "Based on an average human walking pace, with extra time included for mountain and bamboo paths.",
    ),
  },
  broom: {
    icon: "箒",
    name: l("魔法掃帚", "魔法の箒", "Magic Broom"),
    summary: l("自由空路・需停泊", "自由空路・駐箒必要", "Free flight · berth required"),
    factor: 0.42,
    transfer: 2,
    notice: l(
      "低空飛行請保持在紅白引導燈之上；七曜塔紅燈亮起時改走北側。",
      "低空飛行は紅白誘導灯より上を維持。七曜塔の赤灯点灯時は北側へ迂回してください。",
      "Stay above the red-and-white guide lamps; detour north whenever Seven-Day Laboratory shows a red lamp.",
    ),
  },
  tengu: {
    icon: "風",
    name: l("天狗急行風路", "天狗急行風路", "Tengu Express Windway"),
    summary: l("最快・候風 3 分", "最速・風待ち3分", "Fastest · 3 min wind wait"),
    factor: 0.27,
    transfer: 3,
    notice: l(
      "風路依整點旗號發車；未持飛行證者會獲配安全腰帶，新聞稿不算行李。",
      "風路は毎正時の旗で出発。飛行証のない乗客には安全帯を貸与し、新聞原稿は手荷物に数えません。",
      "Windways depart on the hour flag. Riders without flight permits receive a safety harness; news copy does not count as luggage.",
    ),
  },
  rabbit: {
    icon: "兎",
    name: l("竹林月兔接駁", "竹林月兎シャトル", "Moon-Rabbit Shuttle"),
    summary: l("地面接駁・診療所優先", "地上便・診療所優先", "Ground shuttle · clinic priority"),
    factor: 0.64,
    transfer: 4,
    notice: l(
      "兔車在境界講堂與永遠亭診療所停靠；急診時段可能先讓醫療乘客上車。",
      "兎車は境界講堂と永遠亭診療所に停車。救急時間帯は医療利用者が優先されます。",
      "Rabbit carts stop at Boundary Hall and Eientei Clinic. Medical riders may board first during emergency periods.",
    ),
  },
};

export const campusEdges = [
  ["gate", "library", 8, l("霧湖南岸步道", "霧の湖南岸道", "South Misty Lake path")],
  ["gate", "boundary", 12, l("朱繩中央路", "朱縄中央路", "Vermilion Cord Walk")],
  ["library", "boundary", 7, l("湖畔書架坡", "湖畔書架坂", "Lakeside Stack Slope")],
  ["library", "history", 11, l("人里北書路", "人里北書路", "North Village Book Road")],
  ["boundary", "history", 8, l("編年石板道", "編年石畳", "Chronicle Stoneway")],
  ["boundary", "magic", 10, l("七曜迴廊", "七曜回廊", "Seven-Day Arcade")],
  ["boundary", "clinic", 17, l("竹林三息路", "竹林三呼吸路", "Three-Breath Bamboo Way")],
  ["history", "clinic", 14, l("稗田東門道", "稗田東門道", "Hieda East Gate Road")],
  ["history", "kappa", 14, l("山麓記錄路", "山麓記録路", "Foothill Record Road")],
  ["magic", "clinic", 9, l("月影實驗徑", "月影実験径", "Moonshadow Lab Path")],
  ["magic", "kappa", 14, l("瀑布送材線", "滝資材線", "Waterfall Supply Line")],
  ["clinic", "kappa", 13, l("竹山聯絡道", "竹山連絡道", "Bamboo–Mountain Link")],
];

export function findCampusRoute(from, to, modeId) {
  if (from === to) return { path: [from], edges: [], walkingMinutes: 0, minutes: 0, distance: 0 };
  const mode = transportModes[modeId] || transportModes.walk;
  const graph = new Map();

  for (const [start, end, minutes, name] of campusEdges) {
    if (!graph.has(start)) graph.set(start, []);
    if (!graph.has(end)) graph.set(end, []);
    graph.get(start).push({ to: end, minutes, name });
    graph.get(end).push({ to: start, minutes, name });
  }

  const distances = new Map([[from, 0]]);
  const previous = new Map();
  const unvisited = new Set(graph.keys());

  while (unvisited.size) {
    let current = null;
    let best = Number.POSITIVE_INFINITY;
    for (const node of unvisited) {
      const distance = distances.get(node) ?? Number.POSITIVE_INFINITY;
      if (distance < best) {
        best = distance;
        current = node;
      }
    }
    if (!current || current === to) break;
    unvisited.delete(current);
    for (const edge of graph.get(current) || []) {
      if (!unvisited.has(edge.to)) continue;
      const nextDistance = best + edge.minutes;
      if (nextDistance < (distances.get(edge.to) ?? Number.POSITIVE_INFINITY)) {
        distances.set(edge.to, nextDistance);
        previous.set(edge.to, { node: current, edge });
      }
    }
  }

  if (!previous.has(to)) return null;
  const path = [to];
  const edges = [];
  let cursor = to;
  while (cursor !== from) {
    const step = previous.get(cursor);
    path.unshift(step.node);
    edges.unshift({ ...step.edge, from: step.node });
    cursor = step.node;
  }
  const walkingMinutes = distances.get(to);
  const minutes = Math.max(1, Math.ceil(walkingMinutes * mode.factor + mode.transfer));
  return {
    path,
    edges,
    walkingMinutes,
    minutes,
    distance: Math.round(walkingMinutes * 72),
  };
}
