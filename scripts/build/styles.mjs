import { readFile } from "node:fs/promises";
import path from "node:path";

export function stylesheetReferences(source) {
  return [...source.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/g)]
    .map((match) => match[1] ?? match[2] ?? match[3].trim());
}

// Keep stylesheet order explicit in a tiny source manifest. The published
// bundles remain ordinary CSS; no browser @import requests are introduced.
export async function readStylesheet(file, stylesRoot, parents = []) {
  const absolute = path.resolve(file);
  const relative = path.relative(path.resolve(stylesRoot), absolute);
  if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(`Stylesheet escapes src/styles/: ${file}`);
  if (parents.includes(absolute)) throw new Error(`Circular stylesheet include: ${[...parents, absolute].join(" → ")}`);
  const source = await readFile(absolute, "utf8");
  const pattern = /^\/\*\s*@include\s+([^\s]+)\s*\*\/[ \t]*(?:\r?\n)?/gm;
  let result = "";
  let offset = 0;
  for (const match of source.matchAll(pattern)) {
    result += source.slice(offset, match.index);
    result += await readStylesheet(path.resolve(path.dirname(absolute), match[1]), stylesRoot, [...parents, absolute]);
    offset = match.index + match[0].length;
  }
  return result + source.slice(offset);
}
