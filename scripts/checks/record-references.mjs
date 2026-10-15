export function recordKeyReferences(source) {
  const keys = new Set();
  for (const match of source.matchAll(/["'](tu:[A-Za-z0-9:_-]+)["']/g)) {
    const prefix = source.slice(Math.max(0, match.index - 100), match.index);
    // DOM event names describe notifications, not durable browser records.
    if (/(?:new\s+CustomEvent|\.addEventListener|\.removeEventListener)\(\s*$/.test(prefix)) continue;
    if (!match[1].endsWith("change")) keys.add(match[1]);
  }
  return keys;
}
