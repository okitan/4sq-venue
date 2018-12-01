"use strict";

const fs = require("fs");

const ltsv = require("ltsv");

const { Venue, createScrapedVenue } = require("./venue");

const sort = (a, b) => {
  if (a < b) return -1;
  if (a > b) return 1;

  return;
};

const venueSorter = (a, b) => {
  return (
    [
      // 1st sort by its level
      "scraped.level",
      "level",
      "crossStreet",
      // 2nd sort by its name
      "scraped.name",
      "name"
    ].reduce((result, e) => {
      return result || sort(a[e], b[e]);
    }, null) || 0
  );
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
