"use strict";

module.exports = {
  phoneExtractor: text => {
    const matched = text.match(/(\d{2,4})-?(\d{2,4})-?(\d{3,4})/);

    if (!matched) return "";
    return matched.slice(1, 4).join("");
  }
};
