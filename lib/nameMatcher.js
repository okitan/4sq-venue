"use strict";

const mdiff = require("mdiff").default;

const isEqualName = (a, b) => {
  if (!a || !b || a.length === 0 || b.length === 0) return false;

  return (
    a.toLowerCase().includes(b.toLowerCase()) ||
    b.toLowerCase().includes(a.toLowerCase())
  );
};

// more than 5 characters matched is required
const getSimilarity = (a, b) => {
  if (!a || !b || a.length === 0 || b.length === 0) return false;

  const minLength = Math.min(a.length, b.length, 5);
  const lcs = mdiff(a.toLowerCase(), b.toLowerCase()).getLcs();

  return lcs.length >= minLength
    ? Math.max(lcs.length / a.length, lcs.length / b.length)
    : 0;
};

module.exports = {
  isEqualName,
  getSimilarity
};
