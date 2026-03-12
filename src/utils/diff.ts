import type { DiffSummary } from "../types/index.js";
import { normalizeLineEndings } from "./file.js";

export function createDiffSummary(
  actual: string,
  expected: string
): DiffSummary | null {
  const actualLines = normalizeLineEndings(actual).split("\n");
  const expectedLines = normalizeLineEndings(expected).split("\n");

  if (actualLines.join("\n") === expectedLines.join("\n")) {
    return null;
  }

  let prefix = 0;

  while (
    prefix < actualLines.length &&
    prefix < expectedLines.length &&
    actualLines[prefix] === expectedLines[prefix]
  ) {
    prefix += 1;
  }

  let actualSuffix = actualLines.length - 1;
  let expectedSuffix = expectedLines.length - 1;

  while (
    actualSuffix >= prefix &&
    expectedSuffix >= prefix &&
    actualLines[actualSuffix] === expectedLines[expectedSuffix]
  ) {
    actualSuffix -= 1;
    expectedSuffix -= 1;
  }

  const contextStart = Math.max(prefix - 2, 0);
  const expectedSnippet = expectedLines.slice(
    contextStart,
    Math.min(expectedSuffix + 3, expectedLines.length)
  );
  const actualSnippet = actualLines.slice(
    contextStart,
    Math.min(actualSuffix + 3, actualLines.length)
  );

  return {
    firstDifferenceLine: prefix + 1,
    message: `README differs starting at line ${prefix + 1}.`,
    expectedSnippet,
    actualSnippet
  };
}
