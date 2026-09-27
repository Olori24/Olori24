import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const readme = readFileSync(resolve(root, "README.md"), "utf8");

const required = [
  "assets/portfolio-map.svg",
  "assets/ai-systems-architecture.svg",
  "assets/live-portfolio.svg"
];

const missing = required.filter(p => !existsSync(resolve(root, p)));
if (missing.length) {
  console.error("Missing required profile assets:");
  for (const p of missing) console.error(" -", p);
  process.exit(1);
}

for (const asset of required) {
  const svg = readFileSync(resolve(root, asset), "utf8");
  if (!svg.trim().startsWith("<svg")) {
    console.error(`Invalid SVG root: ${asset}`);
    process.exit(1);
  }
  if (svg.includes("<script")) {
    console.error(`Unexpected script element in profile SVG: ${asset}`);
    process.exit(1);
  }
  if (!readme.includes(asset)) {
    console.error(`README does not reference required asset: ${asset}`);
    process.exit(1);
  }
}

const forbidden = [
  /top\s*#?\s*[12]\b/i,
  /#1\s+(developer|engineer|github)/i,
  /best\s+on\s+github/i
];

for (const pattern of forbidden) {
  if (pattern.test(readme)) {
    console.error(`Unsupported ranking/vanity claim detected: ${pattern}`);
    process.exit(1);
  }
}

console.log("Profile validation passed.");
console.log(`Checked ${required.length} required assets and README positioning language.`);
