import allowedCodes from "@/data/postal_codes.json";

const allowedSet = new Set<string>(allowedCodes);

export function isAllowedPostalCode(value: string) {
  return allowedSet.has(value);
}
