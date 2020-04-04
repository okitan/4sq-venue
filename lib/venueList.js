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
      // 1st sort by its building name
      "scraped.bldg",
      "bldg",
      // 2nd sort by its level
      "scraped.level",
      "level",
      "crossStreet",
      // 3rd sort by its name
      "scraped.name",
      "name",
    ].reduce((result, e) => {
      return result || sort(a[e], b[e]);
    }, null) || 0
  );
};

class VenueList extends Array {
  findVenueIndex(venue, { ignore, guess = false } = {}) {
    // If we use this.findIndex(e => venue.equals(e))
    // lower priority checker like same name works and return invalid venue
    const index = [
      venue.hasSameId.bind(venue),
      venue.hasSameUrl.bind(venue),
      venue.hasSamePhone.bind(venue),
      venue.hasSameName.bind(venue),
    ].reduce((result, checker) => {
      return result > -1 ? result : this.findIndex((e) => checker(e, { ignore }));
    }, -1);

    if (index > -1) return index;

    if (guess) {
      const scores = this.map((e) => venue.getSimilarityOfName(e, { ignore }));

      const best = Math.max(...scores);
      if (best > 0.5) {
        // heuristic
        return scores.indexOf(best);
      }
    }

    return -1;
  }

  findVenue(venue, { ignore, guess = false } = {}) {
    return this[this.findVenueIndex(venue, { ignore, guess })];
  }

  // returns removed venue
  removeVenue(venue, { ignore, guess = false } = {}) {
    const index = this.findVenueIndex(venue, { ignore, guess });
    return index > -1 ? this.splice(index, 1)[0] : null;
  }
}

module.exports = {
  VenueList,
  // scrape
  updateScrapedVenues: (target, venues) => {
    const file = `venues/${target}/scraped.ltsv`;

    const formattedVenues = venues.map((e) => e.scraped.format()).sort(venueSorter);

    fs.writeFileSync(file, ltsv.format(formattedVenues) + "\n");
  },
  loadScrapedVenues: (target) => {
    return new VenueList(
      ...ltsv.parse(fs.readFileSync(`venues/${target}/scraped.ltsv`)).map((e) => createScrapedVenue(e))
    );
  },
  // link
  updateLinkedVenues: (target, venues) => {
    const file = `venues/${target}/linked.ltsv`;

    const formattedVenues = venues.map((e) => e.format()).sort(venueSorter);

    fs.writeFileSync(file, ltsv.format(formattedVenues) + "\n");
  },
  loadLinkedVenues: (target) => {
    return new VenueList(...ltsv.parse(fs.readFileSync(`venues/${target}/linked.ltsv`)).map((e) => new Venue(e)));
  },
  updateNotLinkedVenues: (target, venues) => {
    const file = `venues/${target}/notlinked.ltsv`;

    const formattedVenues = venues.map((e) => e.format()).sort(venueSorter);

    fs.writeFileSync(file, ltsv.format(formattedVenues) + "\n");
  },
  loadNotLinkedVenues: (target) => {
    return new VenueList(...ltsv.parse(fs.readFileSync(`venues/${target}/notlinked.ltsv`)).map((e) => new Venue(e)));
  },
  loadUnLinkedVenues: (target) => {
    return new VenueList(...ltsv.parse(fs.readFileSync(`venues/${target}/unlinked.ltsv`)).map((e) => new Venue(e)));
  },
  updateUnLinkedVenues: (target, venues) => {
    const file = `venues/${target}/unlinked.ltsv`;

    const formattedVenues = venues.map((e) => e.format()).sort(venueSorter);

    fs.writeFileSync(file, ltsv.format(formattedVenues) + "\n");
  },
  loadNoListVenues: (target) => {
    return new VenueList(...ltsv.parse(fs.readFileSync(`venues/${target}/nolist.ltsv`)).map((e) => new Venue(e)));
  },
};
