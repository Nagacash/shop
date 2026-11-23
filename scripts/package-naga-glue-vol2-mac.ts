/**
 * Package macOS VST3 + AU from your local Plug-Ins folders into private/digital (not in git).
 *
 * Defaults match a typical local install; override with env:
 *   NAGA_GLUE_V2_VST3_SRC, NAGA_GLUE_V2_AU_SRC
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PLUGIN_DIST_DIR } from "@/lib/audio/plugin-files";

const VST3_SRC =
  process.env.NAGA_GLUE_V2_VST3_SRC?.trim() ??
  path.join(process.env.HOME ?? "", "Library/Audio/Plug-Ins/VST3/Naga Glue Vol. 2.vst3");
const AU_SRC =
  process.env.NAGA_GLUE_V2_AU_SRC?.trim() ??
  path.join(process.env.HOME ?? "", "Library/Audio/Plug-Ins/Components/Naga Glue Vol. 2.component");

const OUT_ZIP = path.join(PLUGIN_DIST_DIR, "naga-glue-vol-2-macos-vst3-au.zip");
const STAGE = path.join(PLUGIN_DIST_DIR, ".stage-naga-glue-vol2-mac");

function main() {
  rmSync(STAGE, { recursive: true, force: true });
  mkdirSync(STAGE, { recursive: true });
  mkdirSync(PLUGIN_DIST_DIR, { recursive: true });

  execFileSync("ditto", [VST3_SRC, path.join(STAGE, "Naga Glue Vol. 2.vst3")], { stdio: "inherit" });
  execFileSync("ditto", [AU_SRC, path.join(STAGE, "Naga Glue Vol. 2.component")], { stdio: "inherit" });

  writeFileSync(
    path.join(STAGE, "INSTALL.txt"),
    `Naga Glue Vol. 2 — macOS install

1. Quit your DAW.
2. Copy "Naga Glue Vol. 2.vst3" to:
   ~/Library/Audio/Plug-Ins/VST3/
3. Copy "Naga Glue Vol. 2.component" to:
   ~/Library/Audio/Plug-Ins/Components/
4. Rescan plugins in your DAW.

If macOS shows "unidentified developer", right-click the plugin → Open once.
`,
  );

  rmSync(OUT_ZIP, { force: true });
  execFileSync("zip", ["-r", OUT_ZIP, "."], { cwd: STAGE, stdio: "inherit" });
  rmSync(STAGE, { recursive: true, force: true });

  console.log(`[package-naga-glue-vol2-mac] wrote ${OUT_ZIP}`);
}

main();