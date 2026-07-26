export function campusDayKey(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function campusTimeBand(date = new Date()) {
  const hour = date.getHours() + date.getMinutes() / 60;
  if (hour < 6) return "night";
  if (hour < 11) return "morning";
  if (hour < 14.5) return "midday";
  if (hour < 18) return "afternoon";
  if (hour < 21.5) return "evening";
  return "night";
}

export function campusTimeSlot(date = new Date()) {
  return Math.floor((date.getHours() * 60 + date.getMinutes()) / 180) % 8;
}

export function campusLunarPhase(date = new Date()) {
  const synodic = 29.530588853;
  const epoch = Date.UTC(2000, 0, 6, 18, 14);
  const age = (((date.getTime() - epoch) / 86_400_000) % synodic + synodic) % synodic;
  return Math.round((age / synodic) * 8) % 8;
}
