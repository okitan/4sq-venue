"use strict";

const { isEqualName, getSimilarity } = require("./nameMatcher");
const { ScrapedVenue } = require("../src/scrapedVenue");

const flatmap = require("flatmap");

class Venue {
  constructor({ id, name, parentVenueId, crossStreet, scraped, ...rest }) {
    this.id = id;
    this.name = name;
    this.parentVenueId = parentVenueId;
    this.crossStreet = crossStreet;

    this.scraped = scraped ? ScrapedVenue.create(scraped) : ScrapedVenue.create(rest);

    this.rest = rest;
  }

  get venueKeys() {
    return ["id", "parentVenueId", "name", "crossStreet"];
  }

  get scrapedKeys() {
    return ["name", "altName", "bldg", "level", "phone", "url"];
  }

  get nameCandidates() {
    return [this.name, this.scraped.name, this.scraped.altName].filter((e) => e && e.length > 0);
  }

  // check equality and similarity
  equals(other, { ignore } = {}) {
    return (
      // matches with foursquare info
      this.hasSameId(other) ||
      // matches with scraped info
      this.hasSameUrl(other) ||
      this.hasSamePhone(other) ||
      // matches with name (not reliable)
      this.hasSameName(other, { ignore })
    );
  }

  hasSameId(other) {
    return this.id && this.id === other.id;
  }

  hasSameUrl(other) {
    return this.scraped.url && this.scraped.url === other.scraped.url;
  }

  hasSamePhone(other) {
    return this.scraped.phone && this.scraped.phone === other.scraped.phone;
  }

  hasSameName(other, { ignore } = {}) {
    return this.nameCandidates.some((a) => {
      return other.nameCandidates.some((b) => isEqualName(a, b, { ignore }));
    });
  }

  getSimilarityOfName(other, { ignore } = {}) {
    return Math.max(
      ...flatmap(this.nameCandidates, (a) => {
        return other.nameCandidates.map((b) => getSimilarity(a, b, { ignore }));
      })
    );
  }

  // formatter
  format() {
    const object = this.venueKeys.reduce((object, e) => {
      object[e] = this[e] || "";
      return object;
    }, {});

    this.scrapedKeys.forEach((e) => {
      object[`scraped.${e}`] = this.scraped[e] || "";
    });

    return object;
  }

  formatScraped() {
    return this.scrapedKeys.reduce((object, e) => {
      object[e] = this.scraped[e] || "";
      return object;
    }, {});
  }
}

module.exports = {
  Venue,
  createScrapedVenue: (data) => {
    return new Venue({ scraped: data });
  },
};
