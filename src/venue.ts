import { LtsvRecord } from "ltsv";

import { getSimilarity, isEqualName } from "./nameMatcher";
import { format, parse, ScrapedProperties } from "./scraper";

type VenueProperties = {
  id?: string;
  name?: string;
  parentVenueId?: string;
  crossStreet?: string;
};

export class Venue implements VenueProperties {
  id?: string;
  name?: string;
  parentVenueId?: string;
  crossStreet?: string;

  // TODO: scraped? is better
  scraped: ScrapedProperties;
  rest: { [x: string]: unknown };

  constructor({
    id,
    name,
    parentVenueId,
    crossStreet,
    scraped,
    ...rest
  }: VenueProperties & { [x: string]: unknown; scraped: ScrapedProperties }) {
    this.id = id;
    this.name = name;
    this.parentVenueId = parentVenueId;
    this.crossStreet = crossStreet;

    this.scraped = parse(scraped || (rest as LtsvRecord));
    this.rest = rest;
  }

  static get keys(): ReadonlyArray<keyof VenueProperties> {
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

  getSimilarityOfName(other: Venue, { ignore = [] }: { ignore?: string[] } = {}) {
    return Math.max(
      ...this.nameCandidates.flatMap((a) => other.nameCandidates.map((b) => getSimilarity(a, b, { ignore })))
    );
  }

  format() {
    const object = Venue.keys.reduce((object, e) => {
      object[e] = this[e] || "";
      return object;
    }, {} as LtsvRecord);

    if (Object.keys(this.scraped).length) Object.assign(object, format(this.scraped, { cascade: true }));

    return object;
  }
}

export function createScrapedVenue(data: ScrapedProperties) {
  return new Venue({ scraped: data });
}
