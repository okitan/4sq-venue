import fs from "fs";
import { format, parse } from "ltsv";

import { format as formatScraped } from "./ltsv";
import { ScrapedProperties } from "./scraper";
import { Venue } from "./venue";

export class VenueList extends Array<Venue> {
  findVenueIndex(venue: Venue, { ignore = [], guess = false }: { ignore?: string[]; guess?: boolean } = {}) {
    // If we use this.findIndex(e => venue.equals(e))
    // lower priority checker like same name works and return invalid venue
    const index = [
      venue.hasSameId.bind(venue),
      venue.hasSameUrl.bind(venue),
      venue.hasSamePhone.bind(venue),
      venue.hasSameName.bind(venue),
    ].reduce((result, checker) => {
      return result > -1 ? result : this.findIndex((e) => checker(e, { ignore }));
    }, -1);

    if (index > -1) return index;

    if (guess) {
      const scores = this.map((e) => venue.getSimilarityOfName(e, { ignore }));

      const best = Math.max(...scores);
      if (best > 0.5) {
        // heuristic
        return scores.indexOf(best);
      }
    }

    return -1;
  }

  findVenue(venue: Venue, { ignore = [], guess = false }: { ignore?: string[]; guess?: boolean } = {}) {
    return this[this.findVenueIndex(venue, { ignore, guess })];
  }

  // returns removed venue
  removeVenue(venue: Venue, { ignore = [], guess = false }: { ignore?: string[]; guess?: boolean } = {}) {
    const index = this.findVenueIndex(venue, { ignore, guess });
    return index > -1 ? this.splice(index, 1)[0] : null;
  }

  get sorted(): VenueList {
    return new VenueList(...this.sort(VenueList.sorter));
  }

  static sorter(a: Venue, b: Venue): number {
    return (
      // 0th 4sq venue first
      -VenueList.sortNumber(a.id?.length || 0, b.id?.length || 0) ||
      // 1st bldg
      VenueList.sortString(a.scraped?.bldg, b.scraped?.bldg) ||
      // 2nd level
      VenueList.sortNumber(a.scraped?.level, b.scraped?.level) ||
      // 3rd bldg + level
      VenueList.sortString(a.crossStreet, b.crossStreet) ||
      // name is the last
      VenueList.sortString(a.scraped?.name, b.scraped?.name) ||
      VenueList.sortString(a.name, b.name)
    );
  }

  static sortString(_a?: string, _b?: string): number {
    const a = _a ?? "";
    const b = _b ?? "";

    if (a < b) return -1;
    if (a > b) return 1;

    return 0;
  }

  static sortNumber(_a?: number, _b?: number): number {
    // blank should be last
    const a = _a ?? Infinity;
    const b = _b ?? Infinity;

    if (a < b) return -1;
    if (a > b) return 1;

    return 0;
  }
}

// scrape
export function updateScrapedVenues(target: string, venues: VenueList): void {
  const file = `venues/${target}/scraped.ltsv`;

  const formattedVenues = venues.sorted
    .map((e) => e.scraped)
    .filter((e): e is ScrapedProperties => Boolean(e))
    .map((e) => formatScraped(e));

  fs.writeFileSync(file, format(formattedVenues) + "\n");
}
export function loadScrapedVenues(target: string) {
  return new VenueList(
    // level is converted to string in ltsv (it makes type error) and we should create another method
    ...parse(fs.readFileSync(`venues/${target}/scraped.ltsv`).toString()).map((e) => Venue.fromScraped(e as any))
  );
}

// link
export function updateLinkedVenues(target: string, venues: VenueList): void {
  const file = `venues/${target}/linked.ltsv`;

  const formattedVenues = venues.sorted.map((e) => e.format());

  fs.writeFileSync(file, format(formattedVenues) + "\n");
}
export function loadLinkedVenues(target: string) {
  return new VenueList(
    ...parse(fs.readFileSync(`venues/${target}/linked.ltsv`).toString()).map((e) => new Venue(e as any))
  );
}
export function updateNotLinkedVenues(target: string, venues: VenueList): void {
  const file = `venues/${target}/notlinked.ltsv`;

  const formattedVenues = venues.sorted.map((e) => e.format());

  fs.writeFileSync(file, format(formattedVenues) + "\n");
}
export function loadNotLinkedVenues(target: string) {
  return new VenueList(
    ...parse(fs.readFileSync(`venues/${target}/notlinked.ltsv`).toString()).map((e) => new Venue(e as any))
  );
}
export function loadUnLinkedVenues(target: string) {
  return new VenueList(
    ...parse(fs.readFileSync(`venues/${target}/unlinked.ltsv`).toString()).map((e) => new Venue(e as any))
  );
}
export function updateUnLinkedVenues(target: string, venues: VenueList): void {
  const file = `venues/${target}/unlinked.ltsv`;

  const formattedVenues = venues.sorted.map((e) => e.format());

  fs.writeFileSync(file, format(formattedVenues) + "\n");
}

// no list is updated manually
export function loadNoListVenues(target: string) {
  return new VenueList(
    ...parse(fs.readFileSync(`venues/${target}/nolist.ltsv`).toString()).map((e) => new Venue(e as any))
  );
}
