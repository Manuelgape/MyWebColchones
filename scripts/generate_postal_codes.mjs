import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

function generateCodes(prefix) {
  const start = prefix * 1000;
  const end = start + 1000;
  const codes = [];
  for (let code = start; code < end; code += 1) {
    codes.push(String(code).padStart(5, "0"));
  }
  return codes;
}

const codes = [...generateCodes(37), ...generateCodes(49)].sort();
const output = resolve(process.cwd(), "data", "postal_codes.json");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, JSON.stringify(codes, null, 2), "ascii");
