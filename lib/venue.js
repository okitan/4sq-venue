"use strict";

const { isEqualName, getSimilarity } = require("./nameMatcher");
// const

class Venue {
  constructor({ id, name, parentVenueId, crossStreet, scraped, ...rest }) {
    this.id = id;
    this.name = name;
    this.parentVenueId = parentVenueId;
    this.crossStreet = crossStreet;

    this.scraped = scraped || {};
    Object.entries(rest).forEach(([key, value]) => {
      if (key.startsWith("scraped.")) {
        this.scraped[key.split(".")[1]] = value;
      }
    });

    this.rest = rest;
  }

  get venueKeys() {
    return ["id", "parentVenueId", "name", "crossStreet"];
  }

  get scrapedKeys() {
    return ["name", "altName", "level", "phone", "url"];
  }

  get nameCandidates() {
    return [this.name, this.scraped.name, this.scraped.altName].filter(
      e => e && e.length > 0
    );
  }

  hasSameName(other) {
    return this.nameCandidates.some(a => {
      return other.nameCandidates.some(b => isEqualName(a, b));
    });
  }

  equals(other) {
    return (
      // matches with foursquare info
      (this.id && this.id === other.id) ||
      // matches with scraped info
      (this.scraped.url && this.scraped.url === other.scraped.url) ||
      // (this.scraped.phone && this.scraped.phone === other.scraped.phone) // phone number may be duplicated
      // matches with name (not reliable)
      this.hasSameName(other)
    );
  }

  getSimilarityOfName(other) {
    return Math.max(
      ...this.nameCandidates.map(a => {
        return Math.max(other.nameCandidates.map(b => getSimilarity(a, b)));
      })
    );
  }

  // formatter
  format() {
    const object = this.venueKeys.reduce((object, e) => {
      object[e] = this[e] || "";
      return object;
    }, {});

    this.scrapedKeys.forEach(e => {
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
  createScrapedVenue: data => {
    return new Venue({ scraped: data });
  }
};
