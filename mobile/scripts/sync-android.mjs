import { copyFileSync, existsSync, lstatSync, rmSync, symlinkSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const mobileRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const androidRoot = join(mobileRoot, "android");
const appAlias = join(androidRoot, "app");
const consumerModule = join(androidRoot, "consumer");
const adminModule = join(androidRoot, "admin");

if (existsSync(appAlias)) {
  const existing = lstatSync(appAlias);
  if (!existing.isSymbolicLink()) {
    throw new Error("android/app already exists and is not the temporary consumer alias");
  }
  rmSync(appAlias);
}

try {
  symlinkSync(consumerModule, appAlias, "junction");

  const command = process.platform === "win32" ? "npx.cmd" : "npx";
  const result = spawnSync(command, ["cap", "sync", "android"], {
    cwd: mobileRoot,
    stdio: "inherit",
  });

  if (result.error) throw result.error;
  if (result.status !== 0) process.exitCode = result.status ?? 1;

  if (!process.exitCode && existsSync(adminModule)) {
    if (existsSync(join(consumerModule, "capacitor.build.gradle"))) {
      copyFileSync(
        join(consumerModule, "capacitor.build.gradle"),
        join(adminModule, "capacitor.build.gradle")
      );
    }
    if (existsSync(join(consumerModule, "src/main/assets/capacitor.plugins.json"))) {
      copyFileSync(
        join(consumerModule, "src/main/assets/capacitor.plugins.json"),
        join(adminModule, "src/main/assets/capacitor.plugins.json")
      );
    }
  }
} finally {
  if (existsSync(appAlias) && lstatSync(appAlias).isSymbolicLink()) {
    rmSync(appAlias);
  }
}
