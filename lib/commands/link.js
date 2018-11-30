"use strict";

module.exports = {
  command: "link <target> [Options]",
  desc: "link scraped venues to foursquare venues",
  builder: {}
};

const { getChildren } = require("../4sqClient");
const { linkVenues } = require("../linker");
const { loadLinkedVenues, loadScrapedVenues } = require("../venueList");

module.exports.handler = async ({ target, ...args }) => {
  const configFile = `../../venues/${target}/config.js`;

  // TODO: error handling
  const config = require(configFile);

  const scrapedVenues = loadScrapedVenues(target);

  const foursquareVenues = (await Promise.all(
    [config.id, ...(config.subvenues || []).map(e => e.id)].map(async id => {
      const children = await getChildren(id);
      return children;
    })
  )).reduce((result, e) => {
    // Promise.all(flatmap) also returns array of array, so I don't use flatmap
    return [...result, ...e];
  }, []);

  const previousResult = (() => {
    try {
      return loadLinkedVenues(target);
    } catch (err) {
      return [];
    }
  })();

  // console.log(scrapedVenues.length);
  // console.log(foursquareVenues.length);
  // console.log(previousResult.length);

  const [linkedVenues, notLinkedVenues, unLinkedVenues] = linkVenues(
    scrapedVenues,
    foursquareVenues,
    previousResult
  );
};
