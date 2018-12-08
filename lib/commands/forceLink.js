"use strict";

module.exports = {
  command: "forceLink <target> [Options]",
  desc: "check link result",
  builder: {
    debug: {
      default: false,
      boolean: true
    },
    name: {
      typs: "string"
    },
    foursquareName: {
      type: "string"
    },
    scrapedName: {
      type: "string"
    }
  }
};

const { Venue } = require("../venue");
const {
  loadLinkedVenues,
  loadNotLinkedVenues,
  updateLinkedVenues,
  updateNotLinkedVenues
} = require("../venueList");

module.exports.handler = async ({ target, ...args }) => {
  const linkedVenues = loadLinkedVenues(target);
  const notLinkedVenues = loadNotLinkedVenues(target);

  // console.log(notLinkedVenues);
  const foursquareVenue = notLinkedVenues.removeVenue(
    new Venue({
      name: args.foursquareName || args.name
    }),
    { guess: true }
  );

  const scrapedVenue = notLinkedVenues.removeVenue(
    new Venue({
      name: args.scrapedName || args.name
    }),
    { guess: true }
  );

  console.table({
    foursquare: foursquareVenue.name,
    scraped: scrapedVenue.scraped.name
  });

  foursquareVenue.scraped = scrapedVenue.scraped;
  linkedVenues.push(foursquareVenue);

  updateLinkedVenues(target, linkedVenues);
  updateNotLinkedVenues(target, notLinkedVenues);
};
