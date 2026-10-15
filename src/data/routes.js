import { text as catalogText } from "../generated/i18n/data/routes.js";

export const transportModes = {
  walk: {
    icon: "徒",
    name: catalogText("transportModes.walk.name"),
    summary: catalogText("transportModes.walk.summary"),
    notice: catalogText("transportModes.walk.notice"),
  },
  broom: {
    icon: "箒",
    name: catalogText("transportModes.broom.name"),
    summary: catalogText("transportModes.broom.summary"),
    notice: catalogText("transportModes.broom.notice"),
  },
  tengu: {
    icon: "風",
    name: catalogText("transportModes.tengu.name"),
    summary: catalogText("transportModes.tengu.summary"),
    notice: catalogText("transportModes.tengu.notice"),
  },
  rabbit: {
    icon: "兎",
    name: catalogText("transportModes.rabbit.name"),
    summary: catalogText("transportModes.rabbit.summary"),
    notice: catalogText("transportModes.rabbit.notice"),
  },
};

// Walking roads are the common layer shared by every itinerary.
// Tuple: from, to, minutes, localized name, approximate metres.
export const campusEdges = [
  ["gate", "library", 8, catalogText("campusEdges.0.3"), 575],
  ["gate", "boundary", 12, catalogText("campusEdges.1.3"), 860],
  ["library", "boundary", 7, catalogText("campusEdges.2.3"), 505],
  ["library", "history", 11, catalogText("campusEdges.3.3"), 790],
  ["boundary", "history", 8, catalogText("campusEdges.4.3"), 575],
  ["boundary", "magic", 10, catalogText("campusEdges.5.3"), 720],
  ["boundary", "clinic", 17, catalogText("campusEdges.6.3"), 1225],
  ["history", "clinic", 14, catalogText("campusEdges.7.3"), 1010],
  ["history", "kappa", 12, catalogText("campusEdges.8.3"), 865],
  ["magic", "clinic", 9, catalogText("campusEdges.9.3"), 650],
  ["magic", "kappa", 14, catalogText("campusEdges.10.3"), 1010],
  ["clinic", "kappa", 13, catalogText("campusEdges.11.3"), 935],
];

// Mode-specific edges are real network links, not multipliers applied after a
// walking route has already been chosen. Their times include ordinary boarding
// or berthing; walking edges remain available as first/last-mile connections.
export const transitEdges = {
  broom: [
    ["library", "boundary", 4, catalogText("transitEdges.broom.0.3"), 620],
    ["boundary", "magic", 5, catalogText("transitEdges.broom.1.3"), 780],
    ["library", "kappa", 9, catalogText("transitEdges.broom.2.3"), 1580],
    ["boundary", "kappa", 7, catalogText("transitEdges.broom.3.3"), 1320],
    ["magic", "kappa", 6, catalogText("transitEdges.broom.4.3"), 1040],
  ],
  tengu: [
    ["boundary", "history", 5, catalogText("transitEdges.tengu.0.3"), 640],
    ["history", "kappa", 6, catalogText("transitEdges.tengu.1.3"), 1120],
    ["boundary", "kappa", 8, catalogText("transitEdges.tengu.2.3"), 1450],
  ],
  rabbit: [
    ["boundary", "clinic", 6, catalogText("transitEdges.rabbit.0.3"), 1190],
  ],
};

function routeEdgeKey(from, to) {
  return [from, to].sort().join("--");
}

function addEdge(graph, [from, to, minutes, name, metres], kind, rules = {}) {
  const key = routeEdgeKey(from, to);
  if (rules.closedEdges?.includes(key)) return;
  if (rules.closedModes?.includes(kind)) return;
  if (kind !== "walk" && rules.closedTransitNodes?.some((node) => node === from || node === to)) return;
  const adjustedMinutes = minutes + (rules.modeDelay?.[kind] || 0) + (rules.edgeDelay?.[key] || 0);
  if (!graph.has(from)) graph.set(from, []);
  if (!graph.has(to)) graph.set(to, []);
  graph.get(from).push({ to, minutes: adjustedMinutes, baseMinutes: minutes, name, metres, kind });
  graph.get(to).push({ to: from, minutes: adjustedMinutes, baseMinutes: minutes, name, metres, kind });
}

export function findCampusRoute(from, to, modeId, rules = {}) {
  if (from === to) {
    return { path: [from], edges: [], walkingMinutes: 0, minutes: 0, distance: 0, requestedMode: modeId };
  }

  const requestedMode = transportModes[modeId] ? modeId : "walk";
  const graph = new Map();
  campusEdges.forEach((edge) => addEdge(graph, edge, "walk", rules));
  (transitEdges[requestedMode] || []).forEach((edge) => addEdge(graph, edge, requestedMode, rules));

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
