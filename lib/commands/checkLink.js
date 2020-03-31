"use strict";

module.exports = {
  command: "checkLink <target> [Options]",
  desc: "check link result",
  builder: {},
};

const { loadLinkedVenues } = require("../venueList");
const { getSimilarity } = require("../nameMatcher");

module.exports.handler = async ({ target, ...args }) => {
  const linkedVenues = loadLinkedVenues(target);

  console.table(
    linkedVenues.map(({ id, name, scraped }) => {
      return {
        url: `https://foursquare.com/v/${id}`,
        score:
          Math.max(
            getSimilarity(name, scraped.name),
            getSimilarity(name, scraped.altName)
          ) > 0.7
            ? "⭕"
            : "x",
        name,
        scraped: scraped.name,
        alt: scraped.altName,
      };
    })
  );
};
