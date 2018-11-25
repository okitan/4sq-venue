"use strict";

const fs = require("fs");

const ltsv = require("ltsv");

const venueSorter = (a, b) => {
  // 1st sort by level
  if (a.level < b.level) {
    return -1;
  } else if (a.level > b.level) {
    return 1;
  }
  // 2nd sort by name
  if (a.name < b.name) {
    return -1;
  } else if (a.name > b.name) {
    return 1;
  }
  return 0;
};

const formatVenue = venue => {
  return ["name", "level", "phone", "url"].reduce((object, e) => {
    object[e] = venue[e] || "";
    return object;
  }, {});
};

module.exports = {
  updateScrapedVenues: (target, venues) => {
    const file = `venues/${target}/scraped.ltsv`;

    const formattedVenues = venues.map(formatVenue).sort(venueSorter);

    fs.writeFileSync(file, ltsv.format(formattedVenues) + "\n");
  }
};
