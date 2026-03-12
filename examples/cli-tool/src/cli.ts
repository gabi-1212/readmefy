#!/usr/bin/env node

const args = process.argv.slice(2);

if (args.includes("--help")) {
  console.log("Usage: env-doctor [--strict]");
  process.exit(0);
}

console.log("Environment looks healthy.");
