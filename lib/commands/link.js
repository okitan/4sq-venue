"use strict";

module.exports = {
  command: "link <target> [Options]",
  desc: "link scraped venues to foursquare venues",
  builder: {},
};

const { getChildren } = require("../4sqClient");
const { linkVenues } = require("../linker");
const {
  VenueList,
  loadLinkedVenues,
  updateLinkedVenues,
  loadScrapedVenues,
  loadUnLinkedVenues,
  updateUnLinkedVenues,
  loadNoListVenues,
  updateNotLinkedVenues,
} = require("../../src/venueList");

module.exports.handler = async ({ target, ...args }) => {
  const config = require(`../../venues/${target}/config`);

  const scrapedVenues = loadScrapedVenues(target);

  const foursquareVenues = (
    await Promise.all(
      [config.id, ...(config.subvenues || []).map((e) => e.id)].map(async (id) => {
        const children = await getChildren(id);
        return children;
      })
    )
  ).reduce((result, e) => {
    // Promise.all(flatmap) also returns array of array, so I don't use flatmap
    result.push(...e);
    return result;
  }, new VenueList());

  const noListVenues = (() => {
    try {
      return loadNoListVenues(target);
    } catch (err) {
      return new VenueList();
    }
  })();

  const previousResult = (() => {
    try {
      return loadLinkedVenues(target);
    } catch (err) {
      return new VenueList();
    }
  })();

  const previousUnLinkedVenues = (() => {
    try {
      return loadUnLinkedVenues(target);
    } catch (err) {
      return new VenueList();
    }
  })();

  const [linkedVenues, notLinkedVenues, unLinkedVenues] = linkVenues(
    scrapedVenues,
    foursquareVenues,
    noListVenues,
    previousResult,
    previousUnLinkedVenues,
    { ignore: config.linker.ignore }
  );

  console.log(`linked: ${linkedVenues.length}`);
  console.log(`no links: ${notLinkedVenues.length}`);
  console.log(`closed: ${unLinkedVenues.length}`);

  updateLinkedVenues(target, linkedVenues);
  updateNotLinkedVenues(target, notLinkedVenues);
  updateUnLinkedVenues(target, unLinkedVenues);
};
