import mdiff from "mdiff";

export function isEqualName(a?: string, b?: string, { ignore = [] }: { ignore?: string[] } = {}) {
  if (!a || !b || a.length === 0 || b.length === 0) return false;

  const regexp = new RegExp(ignore.join("|"), "g");

  const aName = a.toLowerCase().replace(regexp, "").trim();

  const bName = b.toLowerCase().replace(regexp, "").trim();

  // if name matches ignore in whole, do exact equality check
  if (aName.length === 0 || bName.length === 0) return a.toLowerCase() === b.toLowerCase();

  return aName === bName;
}

// more than 5 characters matched is required
export function getSimilarity(a?: string, b?: string, { ignore = [] }: { ignore?: string[] } = {}) {
  if (!a || !b || a.length === 0 || b.length === 0) return 0;

  const regexp = new RegExp(ignore.join("|"), "g");

  const aName = a.toLowerCase().replace(regexp, "").trim();
  const bName = b.toLowerCase().replace(regexp, "").trim();

  if (a.length === 0 || bName.length === 0) return 0;

  const minLength = Math.min(aName.length, bName.length, 5);
  const lcs = mdiff(aName, bName).getLcs();
  if (!lcs) return 0;

  return lcs.length >= minLength ? Math.max(lcs.length / aName.length, lcs.length / bName.length) : 0;
}
