/**
 * Input masking utilities for form fields.
 */

/** Formats a raw string into dd.mm.yyyy as the user types. */
export function applyDateMask(raw: string): string {
  const digits = raw.replace(/\D/g, "").substring(0, 8);
  let result = "";
  for (let i = 0; i < digits.length; i++) {
    if (i === 2 || i === 4) result += ".";
    result += digits[i];
  }
  return result;
}

/** Strips non-numeric characters and limits to 5 digits (for measurements). */
export function applyNumericMask(raw: string): string {
  return raw.replace(/\D/g, "").substring(0, 5);
}
