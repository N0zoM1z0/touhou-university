import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

export function referenceUpdater(root) {
  const cache = new Map();
  let shellFiles;
  async function read(relative) {
    if (!cache.has(relative)) cache.set(relative, readFile(path.join(root, relative), "utf8"));
    return cache.get(relative);
  }
  async function shellSources() {
    if (!shellFiles) {
      shellFiles = ["site.config.mjs", "scripts/build/pages.mjs"];
      for (const directory of ["src/sections", "src/templates", "src/js"]) {
        for (const item of await readdir(path.join(root, directory))) {
          if (/\.(html|js)$/.test(item)) shellFiles.push(`${directory}/${item}`);
        }
      }
    }
    return shellFiles;
  }
  return async (scope, entry) => {
    const binding = entry.msgctxt.startsWith("text:")
      ? entry.msgctxt.slice(5) : /^tree:([^#]+)/.exec(entry.msgctxt)?.[1];
    if (!binding) return;
    const previous = entry.comments.find((line) => line.startsWith("#:"))?.match(/^#:\s+([^\s]+?):\d+/)?.[1];
    const owner = /^(data|ui)\//.test(scope)
      ? `src/${scope.startsWith("ui/") ? "js" : "data"}/${scope.slice(scope.indexOf("/") + 1)}.js` : previous;
    const candidates = scope.startsWith("shell/") ? await shellSources() : owner ? [owner] : [];
    const references = [];
    for (const file of candidates) {
      const source = await read(file);
      const positions = [source.indexOf(JSON.stringify(binding)), source.indexOf(`'${binding}'`), source.indexOf(`i18n:${binding} `)].filter((position) => position >= 0);
      if (!positions.length) continue;
      references.push(`${file}:${source.slice(0, Math.min(...positions)).split("\n").length}`);
      if (references.length === 4) break;
    }
    if (!references.length && owner) references.push(`${owner}:1`);
    entry.comments = [...entry.comments.filter((line) => !line.startsWith("#:")), ...(references.length ? [`#: ${references.join(" ")}`] : [])];
  };
}
