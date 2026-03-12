import path from "node:path";
import fg from "fast-glob";
import type { LicenseInfo, PackageManifest } from "../types/index.js";
import { readTextIfExists } from "../utils/file.js";

export async function collectLicense(
  cwd: string,
  packageManifest: PackageManifest | null
): Promise<LicenseInfo> {
  if (
    typeof packageManifest?.license === "string" &&
    packageManifest.license.length > 0
  ) {
    return {
      spdx: packageManifest.license,
      source: "package.json"
    };
  }

  const matches = await fg(["LICENSE*", "license*"], {
    cwd,
    onlyFiles: true,
    deep: 1
  });
  const licenseFile = matches.sort((left, right) =>
    left.localeCompare(right)
  )[0];

  if (!licenseFile) {
    return {
      spdx: "UNLICENSED",
      source: "unknown"
    };
  }

  const content = (await readTextIfExists(path.join(cwd, licenseFile))) ?? "";
  const spdx = detectSpdx(content);

  return {
    spdx,
    source: "license-file",
    file: licenseFile
  };
}

function detectSpdx(content: string): string {
  if (/mit license/i.test(content)) {
    return "MIT";
  }

  if (/apache license/i.test(content)) {
    return "Apache-2.0";
  }

  if (/gnu general public license/i.test(content)) {
    return "GPL-3.0-or-later";
  }

  if (/bsd 3-clause/i.test(content)) {
    return "BSD-3-Clause";
  }

  return "UNLICENSED";
}
