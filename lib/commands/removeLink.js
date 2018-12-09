"use strict";

module.exports = {
  command: "removeLink <target> [Options]",
  desc: "check link result",
  builder: {
    debug: {
      default: false,
      boolean: true
    },
    name: {
      type: "string",
      array: true
    }
  }
};

const { createScrapedVenue, Venue } = require("../venue");

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
  args.name.forEach(name => {
    const linkedVenue = linkedVenues.removeVenue(new Venue({ name }), {
      guess: true
    });

    const scrapedVenue = createScrapedVenue(linkedVenue.scraped);
    linkedVenue.scraped = {};

    notLinkedVenues.push(scrapedVenue, linkedVenue);
  });

  updateLinkedVenues(target, linkedVenues);
  updateNotLinkedVenues(target, notLinkedVenues);
};
