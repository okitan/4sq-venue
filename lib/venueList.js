"use strict";

const fs = require("fs");

const ltsv = require("ltsv");

const { Venue, createScrapedVenue } = require("./venue");

const venueSorter = (a, b) => {
  // 1st sort by level
  if (a["scraped.level"] < b["scraped.level"]) {
    return -1;
  } else if (a["scraped.level"] > b["scraped.level"]) {
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

module.exports = {
  // scrape
  updateScrapedVenues: (target, venues) => {
    const file = `venues/${target}/scraped.ltsv`;

    const formattedVenues = venues
      .map(e => e.formatScraped())
      .sort(venueSorter);

    fs.writeFileSync(file, ltsv.format(formattedVenues) + "\n");
  },
  loadScrapedVenues: target => {
    return ltsv
      .parse(fs.readFileSync(`venues/${target}/scraped.ltsv`))
      .map(e => {
        return createScrapedVenue(e);
      });
  },
  // link
  updateLinkedVenues: (target, venues) => {
    const file = `venues/${target}/linked.ltsv`;

    const formattedVenues = venues.map(e => e.format()).sort(venueSorter);

    fs.writeFileSync(file, ltsv.format(formattedVenues) + "\n");
  },
  loadLinkedVenues: target => {
    return ltsv
      .parse(fs.readFileSync(`venues/${target}/linked.ltsv`))
      .map(e => {
        return new Venue(e);
      });
  },
  updateNotLinkedVenues: (target, venues) => {
    const file = `venues/${target}/notlinked.ltsv`;

    const formattedVenues = venues.map(e => e.format()).sort(venueSorter);

    fs.writeFileSync(file, ltsv.format(formattedVenues) + "\n");
  },
  updateUnLinkedVenues: (target, venues) => {
    const file = `venues/${target}/unlinked.ltsv`;

    const formattedVenues = venues.map(e => e.format()).sort(venueSorter);

    fs.writeFileSync(file, ltsv.format(formattedVenues) + "\n");
  }
};
