import { spawn } from "node:child_process";
import { watch } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = process.env.PORT || "4173";
let timer;

function build() {
  const child = spawn(process.execPath, ["scripts/build.mjs"], {
    cwd: root,
    stdio: "inherit",
  });
  child.on("exit", (code) => {
    if (code) console.error(`Build exited with code ${code}`);
  });
}

build();

const watcher = watch(path.join(root, "src"), { recursive: true }, () => {
  clearTimeout(timer);
  timer = setTimeout(build, 120);
});

const server = spawn("python3", ["-m", "http.server", port, "--bind", "127.0.0.1"], {
  cwd: root,
  stdio: "inherit",
});

console.log(`Watching src/ and serving http://127.0.0.1:${port}`);

function stop() {
  watcher.close();
  server.kill("SIGINT");
}

process.on("SIGINT", stop);
process.on("SIGTERM", stop);
