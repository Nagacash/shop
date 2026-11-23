/**
 * Package macOS VST3 + AU from your local Plug-Ins folders into private/digital (not in git).
 *
 * Defaults match a typical local install; override with env:
 *   NAGA_GLUE_V2_VST3_SRC, NAGA_GLUE_V2_AU_SRC
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PLUGIN_DIST_DIR, PLUGIN_PUBLIC_RELEASE_DIR } from "@/lib/audio/plugin-files";
import { copyFileSync } from "node:fs";

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

  const env = { ...process.env, COPYFILE_DISABLE: "1" };
  execFileSync("ditto", [VST3_SRC, path.join(STAGE, "Naga Glue Vol. 2.vst3")], { stdio: "inherit", env });
  execFileSync("ditto", [AU_SRC, path.join(STAGE, "Naga Glue Vol. 2.component")], {
    stdio: "inherit",
    env,
  });
  execFileSync("find", [STAGE, "-name", "._*", "-delete"], { stdio: "inherit" });

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
  execFileSync("find", [STAGE, "-name", "._*", "-delete"], { stdio: "inherit" });
  execFileSync("zip", ["-r", "-X", OUT_ZIP, ".", "-x", "*/._*", "-x", "._*"], { cwd: STAGE, stdio: "inherit" });
  rmSync(STAGE, { recursive: true, force: true });

  mkdirSync(PLUGIN_PUBLIC_RELEASE_DIR, { recursive: true });
  const PUBLIC_ZIP = path.join(PLUGIN_PUBLIC_RELEASE_DIR, "naga-glue-vol-2-macos-vst3-au.zip");
  copyFileSync(OUT_ZIP, PUBLIC_ZIP);

  console.log(`[package-naga-glue-vol2-mac] wrote ${OUT_ZIP}`);
  console.log(`[package-naga-glue-vol2-mac] copied deploy zip → ${PUBLIC_ZIP}`);
}

main();