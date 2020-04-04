import { LtsvRecord } from "ltsv";

import { Properties, ScrapedVenue } from "./scrapedVenue";

const { isEqualName, getSimilarity } = require("../lib/nameMatcher");

type VenueProperties = {
  id?: string;
  name?: string;
  parentVenueId?: string;
  crossStreet?: string;
};

class Venue implements VenueProperties {
  id?: string;
  name?: string;
  parentVenueId?: string;
  crossStreet?: string;

  // TODO: scraped? is better
  scraped: ScrapedVenue | { [x: string]: undefined };
  rest: { [x: string]: unknown };

  constructor({
    id,
    name,
    parentVenueId,
    crossStreet,
    scraped,
    ...rest
  }: VenueProperties & { [x: string]: unknown; scraped: Properties }) {
    this.id = id;
    this.name = name;
    this.parentVenueId = parentVenueId;
    this.crossStreet = crossStreet;

    this.scraped = scraped ? new ScrapedVenue(scraped) : ScrapedVenue.parse(rest as LtsvRecord);
    this.rest = rest;
  }

  get venueKeys(): ReadonlyArray<keyof VenueProperties> {
    return ["id", "parentVenueId", "name", "crossStreet"];
  }

  get nameCandidates() {
    return [this.name, this.scraped.name, this.scraped.altName].filter((e) => e);
  }

  // check equality and similarity
  equals(other: Venue, { ignore = [] }: { ignore?: string[] } = {}) {
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

  hasSameId(other: Venue) {
    return this.id && this.id === other.id;
  }

  hasSameUrl(other: Venue) {
    return this.scraped.url && this.scraped.url === other.scraped.url;
  }

  hasSamePhone(other: Venue) {
    return this.scraped.phone && this.scraped.phone === other.scraped.phone;
  }

  hasSameName(other: Venue, { ignore = [] }: { ignore?: string[] } = {}) {
    return this.nameCandidates.some((a) => {
      return other.nameCandidates.some((b) => isEqualName(a, b, { ignore }));
    });
  }

  getSimilarityOfName(other: Venue, { ignore = false }: { ignore?: boolean } = {}) {
    return Math.max(
      ...this.nameCandidates.flatMap((a) => other.nameCandidates.map((b) => getSimilarity(a, b, { ignore })))
    );
  }

  format() {
    const object = this.venueKeys.reduce((object, e) => {
      object[e] = this[e] || "";
      return object;
    }, {} as LtsvRecord);

    if ("format" in this.scraped && typeof this.scraped.format === "function")
      Object.assign(object, this.scraped.format({ cascade: true }));

    return object;
  }
}

module.exports = {
  Venue,
  createScrapedVenue: (data: Properties) => {
    return new Venue({ scraped: data });
  },
};
