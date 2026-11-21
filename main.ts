// main.ts — hands the Vice Platinum guide in to make.fun.
// Copies app/ and screenshots/ from this repository into the output
// directory and writes dossier.json with the kit's buildDossier.
import { buildDossier } from "./vendor/makefun-frontend.ts";
import { cpSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const repoRoot = new URL(".", import.meta.url).pathname;
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

// Create the output dir if missing, then clear only its contents: the
// output dir itself may be a bind mount, so it must not be removed.
mkdirSync(outputDir, { recursive: true });
for (const child of readdirSync(outputDir)) {
  rmSync(join(outputDir, child), { recursive: true, force: true });
}

for (const folder of ["app", "screenshots"]) {
  cpSync(join(repoRoot, folder), join(outputDir, folder), { recursive: true });
}

const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outputDir, "dossier.json"), dossier);
console.log("wrote dossier.json: " + dossier.length + " bytes");
