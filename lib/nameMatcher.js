"use strict";

const mdiff = require("mdiff").default;

const isEqualName = (a, b, { ignore = [] } = {}) => {
  if (!a || !b || a.length === 0 || b.length === 0) return false;

  const regexp = new RegExp(ignore.join("|"), "g");

  const aName = a.toLowerCase().replace(regexp, "");
  const bName = b.toLowerCase().replace(regexp, "");

  return aName.includes(bName) || bName.includes(aName);
};

// more than 5 characters matched is required
const getSimilarity = (a, b, { ignore = [] } = {}) => {
  if (!a || !b || a.length === 0 || b.length === 0) return false;
  // console.log(ignore);
  const regexp = new RegExp(ignore.join("|"), "g");

  const aName = a.toLowerCase().replace(regexp, "");
  const bName = b.toLowerCase().replace(regexp, "");

  const minLength = Math.min(aName.length, bName.length, 5);
  const lcs = mdiff(aName, bName).getLcs();

  return lcs.length >= minLength
    ? Math.max(lcs.length / aName.length, lcs.length / bName.length)
    : 0;
};

module.exports = {
  isEqualName,
  getSimilarity
};
