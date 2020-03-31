"use strict";

const mdiff = require("mdiff").default;

const isEqualName = (a, b, { ignore = [] } = {}) => {
  if (!a || !b || a.length === 0 || b.length === 0) return false;

  const regexp = new RegExp(ignore.join("|"), "g");

  const aName = a.toLowerCase().replace(regexp, "").trim();

  const bName = b.toLowerCase().replace(regexp, "").trim();

  // if name matches ignore in whole, do exact equality check
  if (aName.length === 0 || bName.length === 0)
    return a.toLowerCase() === b.toLowerCase();

  return aName === bName;
};

// more than 5 characters matched is required
const getSimilarity = (a, b, { ignore = [] } = {}) => {
  if (!a || !b || a.length === 0 || b.length === 0) return false;

  const regexp = new RegExp(ignore.join("|"), "g");

  const aName = a.toLowerCase().replace(regexp, "").trim();
  const bName = b.toLowerCase().replace(regexp, "").trim();

  if (a.length === 0 || bName.length === 0) return 0;

  const minLength = Math.min(aName.length, bName.length, 5);
  const lcs = mdiff(aName, bName).getLcs();

  return lcs.length >= minLength
    ? Math.max(lcs.length / aName.length, lcs.length / bName.length)
    : 0;
};

module.exports = {
  isEqualName,
  getSimilarity,
};
