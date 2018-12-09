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

class VenueList extends Array {
  findVenueIndex(venue, { ignore, guess = false } = {}) {
    const index = this.findIndex(e => venue.equals(e, { ignore }));

    if (index > -1) return index;

    if (guess) {
      const scores = this.map(e => venue.getSimilarityOfName(e, { ignore }));

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
    return this.splice(this.findVenueIndex(venue, { ignore, guess }), 1)[0];
  }
}

module.exports = {
  VenueList,
  // scrape
  updateScrapedVenues: (target, venues) => {
    const file = `venues/${target}/scraped.ltsv`;

    const formattedVenues = venues
      .map(e => e.formatScraped())
      .sort(venueSorter);

    fs.writeFileSync(file, ltsv.format(formattedVenues) + "\n");
  },
  loadScrapedVenues: target => {
    return new VenueList(
      ...ltsv.parse(fs.readFileSync(`venues/${target}/scraped.ltsv`)).map(e => {
        return createScrapedVenue(e);
      })
    );
  },
  // link
  updateLinkedVenues: (target, venues) => {
    const file = `venues/${target}/linked.ltsv`;

    const formattedVenues = venues.map(e => e.format()).sort(venueSorter);

    fs.writeFileSync(file, ltsv.format(formattedVenues) + "\n");
  },
  loadLinkedVenues: target => {
    return new VenueList(
      ...ltsv.parse(fs.readFileSync(`venues/${target}/linked.ltsv`)).map(e => {
        return new Venue(e);
      })
    );
  },
  updateNotLinkedVenues: (target, venues) => {
    const file = `venues/${target}/notlinked.ltsv`;

    const formattedVenues = venues.map(e => e.format()).sort(venueSorter);

    fs.writeFileSync(file, ltsv.format(formattedVenues) + "\n");
  },
  loadNotLinkedVenues: target => {
    return new VenueList(
      ...ltsv
        .parse(fs.readFileSync(`venues/${target}/notlinked.ltsv`))
        .map(e => {
          return new Venue(e);
        })
    );
  },
  updateUnLinkedVenues: (target, venues) => {
    const file = `venues/${target}/unlinked.ltsv`;

    const formattedVenues = venues.map(e => e.format()).sort(venueSorter);

    fs.writeFileSync(file, ltsv.format(formattedVenues) + "\n");
  },
  loadNoListVenues: target => {
    return new VenueList(
      ...ltsv.parse(fs.readFileSync(`venues/${target}/nolist.ltsv`)).map(e => {
        return new Venue(e);
      })
    );
  }
};
