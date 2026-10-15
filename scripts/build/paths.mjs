import path from "node:path";
import { fileURLToPath } from "node:url";

export const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const sourceRoot = path.join(projectRoot, "src");
export const publicRoot = path.join(projectRoot, "public");
export const outputRoot = path.join(projectRoot, "dist");
