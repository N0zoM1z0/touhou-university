import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { outputRoot, publicRoot, sourceRoot } from "./paths.mjs";

export async function preparePublication() {
  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputRoot, { recursive: true });
  await cp(publicRoot, outputRoot, { recursive: true });
}

export async function copyRuntime() {
  // Keep the published module URLs stable, without shipping authoring HTML,
  // stylesheet parts, PO sources, build tools or internal research notes.
  for (const directory of ["js", "data", "generated"]) {
    await cp(path.join(sourceRoot, directory), path.join(outputRoot, "src", directory), { recursive: true });
  }
}
