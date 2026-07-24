const l = (zh, ja, en) => ({ "zh-Hant": zh, ja, en });

export const transportModes = {
  walk: {
    icon: "徒",
    name: l("人里步行", "里道徒歩", "Village Walk"),
    summary: l("全路網・不等車", "全路網・待ち時間なし", "All paths · no waiting"),
    notice: l(
      "時間以一般人類平地步速估算；山路與竹林已另加緩衝。",
      "一般的な人間の歩行速度を基準とし、山道と竹林には余裕時間を加算しています。",
      "Based on an average human walking pace, with extra time included for mountain and bamboo paths.",
    ),
  },
  broom: {
    icon: "箒",
    name: l("魔法掃帚", "魔法の箒", "Magic Broom"),
    summary: l("停泊點空路＋步行接駁", "駐箒所の空路＋徒歩", "Berth airways + walking"),
    notice: l(
      "掃帚只能在霧湖、境界、七曜與妖怪山停泊；博麗門前低空禁飛，最後一段常常仍要走。",
      "箒の駐機は霧の湖・境界・七曜・妖怪の山のみ。博麗門前は低空飛行禁止のため、最後は歩くことがあります。",
      "Brooms may berth only at Misty Lake, Boundary, Seven-Day, and Youkai Mountain. Low flight is banned at Hakurei Gate, so the last leg may still be on foot.",
    ),
  },
  tengu: {
    icon: "風",
    name: l("天狗急行風路", "天狗急行風路", "Tengu Express Windway"),
    summary: l("固定風站＋整點候風", "固定風駅＋毎正時", "Fixed wind stops + hourly wait"),
    notice: l(
      "急行只停境界講堂、稗田史料館與妖怪山；錯過旗號就別追，天狗會把追車拍成新聞。",
      "急行は境界講堂・稗田史料館・妖怪の山のみ停車。旗を逃して追うと、その姿が天狗の記事になります。",
      "Express windways stop only at Boundary Hall, Hieda Archives, and Youkai Mountain. Do not chase a missed flag unless you want to become tengu news.",
    ),
  },
  rabbit: {
    icon: "兎",
    name: l("竹林月兔接駁", "竹林月兎シャトル", "Moon-Rabbit Shuttle"),
    summary: l("只停境界講堂／永遠亭", "境界講堂／永遠亭のみ", "Boundary Hall / Eientei only"),
    notice: l(
      "兔車只往返境界講堂與永遠亭診療所；其餘路段請步行。急診時，時刻表會假裝自己從沒存在過。",
      "兎車は境界講堂と永遠亭診療所の往復のみ。ほかは徒歩です。救急時には時刻表が最初から無かったことになります。",
      "Rabbit carts run only between Boundary Hall and Eientei Clinic; every other leg is on foot. During emergencies, the timetable pretends it never existed.",
    ),
  },
};

// Walking roads are the common layer shared by every itinerary.
// Tuple: from, to, minutes, localized name, approximate metres.
export const campusEdges = [
  ["gate", "library", 8, l("霧湖南岸步道", "霧の湖南岸道", "South Misty Lake path"), 575],
  ["gate", "boundary", 12, l("朱繩中央路", "朱縄中央路", "Vermilion Cord Walk"), 860],
  ["library", "boundary", 7, l("湖畔書架坡", "湖畔書架坂", "Lakeside Stack Slope"), 505],
  ["library", "history", 11, l("人里北書路", "人里北書路", "North Village Book Road"), 790],
  ["boundary", "history", 8, l("編年石板道", "編年石畳", "Chronicle Stoneway"), 575],
  ["boundary", "magic", 10, l("七曜迴廊", "七曜回廊", "Seven-Day Arcade"), 720],
  ["boundary", "clinic", 17, l("竹林三息路", "竹林三呼吸路", "Three-Breath Bamboo Way"), 1225],
  ["history", "clinic", 14, l("稗田東門道", "稗田東門道", "Hieda East Gate Road"), 1010],
  ["history", "kappa", 12, l("山麓記錄路", "山麓記録路", "Foothill Record Road"), 865],
  ["magic", "clinic", 9, l("月影實驗徑", "月影実験径", "Moonshadow Lab Path"), 650],
  ["magic", "kappa", 14, l("瀑布送材線", "滝資材線", "Waterfall Supply Line"), 1010],
  ["clinic", "kappa", 13, l("竹山聯絡道", "竹山連絡道", "Bamboo–Mountain Link"), 935],
];

// Mode-specific edges are real network links, not multipliers applied after a
// walking route has already been chosen. Their times include ordinary boarding
// or berthing; walking edges remain available as first/last-mile connections.
export const transitEdges = {
  broom: [
    ["library", "boundary", 4, l("霧湖—境界低空燈線", "霧湖—境界低空灯線", "Misty Lake–Boundary lamp airway"), 620],
    ["boundary", "magic", 5, l("七曜北側掃帚廊", "七曜北側箒廊", "Seven-Day north broom corridor"), 780],
    ["library", "kappa", 9, l("湖山長距停箒線", "湖山長距離駐箒線", "Lake–Mountain long broomway"), 1580],
    ["boundary", "kappa", 7, l("朱繩山風停箒線", "朱縄山風駐箒線", "Vermilion Mountain broomway"), 1320],
    ["magic", "kappa", 6, l("瀑布上空送材線", "滝上空資材線", "Waterfall aerial supply line"), 1040],
  ],
  tengu: [
    ["boundary", "history", 5, l("第一風站・編年線", "第一風駅・編年線", "Wind Stop One · Chronicle Line"), 640],
    ["history", "kappa", 6, l("第二風站・山腹線", "第二風駅・山腹線", "Wind Stop Two · Mountain Line"), 1120],
    ["boundary", "kappa", 8, l("急行直達・山頂旗線", "急行直通・山頂旗線", "Express · Summit Flag Line"), 1450],
  ],
  rabbit: [
    ["boundary", "clinic", 6, l("境界—永遠亭月兔專線", "境界—永遠亭月兎専用線", "Boundary–Eientei Moon-Rabbit Line"), 1190],
  ],
};

function addEdge(graph, [from, to, minutes, name, metres], kind) {
  if (!graph.has(from)) graph.set(from, []);
  if (!graph.has(to)) graph.set(to, []);
  graph.get(from).push({ to, minutes, name, metres, kind });
  graph.get(to).push({ to: from, minutes, name, metres, kind });
}

export function findCampusRoute(from, to, modeId) {
  if (from === to) {
    return { path: [from], edges: [], walkingMinutes: 0, minutes: 0, distance: 0, requestedMode: modeId };
  }

  const requestedMode = transportModes[modeId] ? modeId : "walk";
  const graph = new Map();
  campusEdges.forEach((edge) => addEdge(graph, edge, "walk"));
  (transitEdges[requestedMode] || []).forEach((edge) => addEdge(graph, edge, requestedMode));

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
    edges.unshift({ ...step.edge, from: step.node, to: cursor });
    cursor = step.node;
  }

  return {
    path,
    edges,
    requestedMode,
    minutes: distances.get(to),
    walkingMinutes: edges.filter((edge) => edge.kind === "walk").reduce((sum, edge) => sum + edge.minutes, 0),
    distance: edges.reduce((sum, edge) => sum + edge.metres, 0),
  };
}
