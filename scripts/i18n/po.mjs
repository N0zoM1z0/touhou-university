// Singular gettext catalogs, using UTF-8 strings and standard PO comments.
// Plural directives fail explicitly until the site has a plural-message API.
export function parsePo(source, filename = "catalog.po") {
  const entries = [];
  let entry = { comments: [], flags: [], obsolete: false };
  let active;
  const fail = (line, message) => { throw new Error(`${filename}:${line}: ${message}`); };
  const flush = () => {
    if (entry.msgid !== undefined) {
      if (entry.msgstr === undefined) fail(entry.line, "missing msgstr");
      entries.push(entry);
    } else if (entry.comments.length) {
      fail(entry.line || 1, "comments without a message");
    }
    entry = { comments: [], flags: [], obsolete: false };
    active = undefined;
  };
  for (const [index, raw] of source.replace(/^\uFEFF/, "").split(/\r?\n/).entries()) {
    const line = index + 1;
    let value = raw.trim();
    if (!value) { flush(); continue; }
    if (value.startsWith("#~")) {
      entry.obsolete = true;
      value = value.slice(2).trimStart();
    }
    if (value.startsWith("#")) {
      if (entry.msgstr !== undefined) flush();
      entry.line ??= line;
      entry.comments.push(value);
      if (value.startsWith("#,")) entry.flags.push(...value.slice(2).split(",").map((flag) => flag.trim()));
      continue;
    }
    const directive = /^(msgctxt|msgid|msgstr)\s+(".*")$/.exec(value);
    if (directive) {
      const [, field, quoted] = directive;
      if (entry.msgstr !== undefined && (field === "msgctxt" || field === "msgid")) flush();
      if (entry[field] !== undefined) fail(line, `duplicate ${field}`);
      try { entry[field] = JSON.parse(quoted); }
      catch { fail(line, `invalid quoted ${field}`); }
      entry.line ??= line;
      active = field;
    } else if (value.startsWith('"') && active) {
      try { entry[active] += JSON.parse(value); }
      catch { fail(line, "invalid continuation string"); }
    } else {
      fail(line, "unsupported PO directive; use msgctxt, msgid and singular msgstr");
    }
  }
  flush();
  return entries;
}

function quoted(field, value) {
  if (value.length <= 88 && !value.includes("\n")) return `${field} ${JSON.stringify(value)}`;
  const chunks = [];
  let remaining = value;
  while (remaining) {
    let end = Math.min(76, remaining.length);
    if (end < remaining.length) {
      const space = remaining.lastIndexOf(" ", end);
      if (space > 40) end = space + 1;
      // Never split a Unicode surrogate pair.
      if (/[\uD800-\uDBFF]/.test(remaining[end - 1])) end--;
    }
    chunks.push(JSON.stringify(remaining.slice(0, end)));
    remaining = remaining.slice(end);
  }
  return `${field} ""\n${chunks.join("\n")}`;
}

export function serializePo(entries, language, template = false) {
  const headerEntry = entries.find((entry) => entry.msgid === "" && !entry.msgctxt);
  const previousHeader = headerEntry?.msgstr || "";
  const metadata = new Map(previousHeader.split("\n").filter(Boolean).map((line) => {
    const colon = line.indexOf(":");
    return [line.slice(0, colon), line.slice(colon + 1).trim()];
  }));
  if (!metadata.has("Project-Id-Version")) metadata.set("Project-Id-Version", "Touhou University");
  metadata.set("Language", template ? "" : language);
  metadata.set("MIME-Version", "1.0");
  metadata.set("Content-Type", "text/plain; charset=UTF-8");
  metadata.set("Content-Transfer-Encoding", "8bit");
  const header = [...metadata].map(([key, value]) => `${key}: ${value}\n`).join("");
  const headerNotes = headerEntry?.comments.filter((line) => !line.startsWith("# Touhou University —")) || [];
  const blocks = [[`# Touhou University — ${template ? "translation template" : language}`, ...headerNotes, `msgid ""\nmsgstr ""\n${header.split(/(?<=\n)/).filter(Boolean).map((line) => JSON.stringify(line)).join("\n")}`].join("\n")];
  for (const entry of entries.filter((item) => item.msgctxt)) {
    const comments = [...entry.comments.filter((line) => !line.startsWith("#,"))];
    if (entry.flags?.length) comments.push(`#, ${[...new Set(entry.flags)].join(", ")}`);
    const lines = [...comments, quoted("msgctxt", entry.msgctxt), quoted("msgid", entry.msgid), quoted("msgstr", template ? "" : entry.msgstr)];
    blocks.push(entry.obsolete ? lines.map((line) => `#~ ${line}`).join("\n") : lines.join("\n"));
  }
  return blocks.join("\n\n") + "\n";
}

export function placeholders(value) {
  return [...value.matchAll(/\{([a-zA-Z][a-zA-Z0-9_]*)\}/g)].map((match) => match[1]).sort();
}

export function mergeCatalog(sourceEntries, translatedEntries) {
  const old = new Map(translatedEntries.filter((entry) => entry.msgctxt).map((entry) => [entry.msgctxt, entry]));
  const result = sourceEntries.filter((entry) => entry.msgctxt && !entry.obsolete).map((source) => {
    const previous = old.get(source.msgctxt);
    old.delete(source.msgctxt);
    const changed = previous && previous.msgid !== source.msgid;
    const notes = previous?.comments.filter((line) => !/^#[:.,|]/.test(line)) || [];
    return {
      ...source, obsolete: false,
      comments: [...notes, ...source.comments.filter((line) => /^#[:.]/.test(line)), ...(changed ? [`#| msgid ${JSON.stringify(previous.msgid)}`] : previous?.comments.filter((line) => line.startsWith("#|")) || [])],
      msgstr: previous?.msgstr || "",
      flags: [...new Set([...(previous?.flags || []), ...(changed ? ["fuzzy"] : [])])],
    };
  });
  const header = translatedEntries.find((entry) => entry.msgid === "" && !entry.msgctxt);
  return [...(header ? [header] : []), ...result, ...[...old.values()].map((entry) => ({ ...entry, obsolete: true }))];
}
