import { spawn } from "node:child_process";
import { mkdirSync, watch } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = process.env.PORT || "4173";
let timer;
let building;
let pending = false;
let stopping = false;

function build() {
  if (building) { pending = true; return; }
  building = spawn(process.execPath, ["scripts/build.mjs"], {
    cwd: root,
    stdio: "inherit",
  });
  building.on("exit", (code) => {
    building = undefined;
    if (code) console.error(`Build exited with code ${code}`);
    if (pending && !stopping) { pending = false; build(); }
  });
}

mkdirSync(path.join(root, "dist"), { recursive: true });
build();

function changed(filename) {
  if (String(filename).startsWith("generated/") || String(filename).endsWith(".pot")) return;
  clearTimeout(timer);
  timer = setTimeout(build, 120);
}

const watchers = [
  ...["src", "locales", "public"].map((directory) => watch(path.join(root, directory), { recursive: true }, (_, filename) => changed(filename))),
  watch(path.join(root, "site.config.mjs"), () => changed("site.config.mjs")),
];

const server = spawn("python3", ["-m", "http.server", port, "--bind", "127.0.0.1"], {
  cwd: path.join(root, "dist"),
  stdio: "inherit",
});

console.log(`Watching src/, locales/, public/ and site.config.mjs; serving http://127.0.0.1:${port}`);

function stop() {
  stopping = true;
  clearTimeout(timer);
  watchers.forEach((watcher) => watcher.close());
  building?.kill("SIGTERM");
  server.kill("SIGINT");
}

process.on("SIGINT", stop);
process.on("SIGTERM", stop);
