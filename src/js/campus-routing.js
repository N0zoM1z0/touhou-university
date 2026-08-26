import { liveCampusSnapshot } from "../data/live-campus.js";
import { festivalRouteOverlay } from "./festival-model.js";

export function campusRoutingState(date = new Date()) {
  const state = liveCampusSnapshot(date);
  const festival = festivalRouteOverlay();
  const calendarEvents = state.calendar.activeEvents.map((event) => ({
    id: event.id,
    glyph: event.glyph,
    title: event.title,
    rule: event.impacts.transport,
  }));
  if (!festival.active) {
    return {
      ...state,
      activeEvents: [...state.activeEvents, ...calendarEvents],
    };
  }
  return {
    ...state,
    routeRules: {
      closedModes: [...new Set([...state.routeRules.closedModes, ...festival.closedModes])],
      closedEdges: [...new Set([...state.routeRules.closedEdges, ...festival.closedEdges])],
      closedTransitNodes: [...new Set([...state.routeRules.closedTransitNodes, ...festival.closedTransitNodes])],
      modeDelay: Object.fromEntries(
        [...new Set([...Object.keys(state.routeRules.modeDelay), ...Object.keys(festival.modeDelay)])]
          .map((key) => [key, (state.routeRules.modeDelay[key] || 0) + (festival.modeDelay[key] || 0)]),
      ),
      edgeDelay: Object.fromEntries(
        [...new Set([...Object.keys(state.routeRules.edgeDelay), ...Object.keys(festival.edgeDelay)])]
          .map((key) => [key, (state.routeRules.edgeDelay[key] || 0) + (festival.edgeDelay[key] || 0)]),
      ),
    },
    activeEvents: [
      ...state.activeEvents,
      ...calendarEvents,
      {
        id: festival.operationId,
        glyph: "祭",
        rule: festival.notices[0],
      },
    ],
  };
}
