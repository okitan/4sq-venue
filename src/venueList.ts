import fs from "fs";
import { format, parse } from "ltsv";

import { ScrapedVenue } from "./scrapedVenue";
import { createScrapedVenue, Venue } from "./venue";

class VenueList extends Array<Venue> {
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
    // console.log(this);
    return new VenueList(...this.sort(VenueList.sorter));
  }

  static sorter(a: Venue, b: Venue): number {
    return (
      // 1st bldg
      VenueList.sort(a.scraped.bldg, b.scraped.bldg) ||
      // 2nd level
      VenueList.sort(a.scraped.level, b.scraped.level) ||
      // 3rd bldg + level
      VenueList.sort(a.crossStreet, b.crossStreet) ||
      // name is the last
      VenueList.sort(a.scraped.name, b.scraped.name) ||
      VenueList.sort(a.name, b.name)
    );
  }

  static sort<T extends string | number>(a?: T, b?: T): number {
    if (!a || !b) return 0;

    if (a < b) return -1;
    if (a > b) return 1;

    return 0;
  }
}

module.exports = {
  VenueList,
  // scrape
  updateScrapedVenues: (target: string, venues: VenueList) => {
    const file = `venues/${target}/scraped.ltsv`;

    const formattedVenues = venues.sorted
      .map((e) => e.scraped)
      .filter((e): e is ScrapedVenue => typeof e.format === "function")
      .map((e) => e.format());

    fs.writeFileSync(file, format(formattedVenues) + "\n");
  },
  loadScrapedVenues: (target: string) => {
    return new VenueList(
      ...parse(fs.readFileSync(`venues/${target}/scraped.ltsv`).toString()).map((e) => createScrapedVenue(e as any))
    );
  },
  // link
  updateLinkedVenues: (target: string, venues: VenueList) => {
    const file = `venues/${target}/linked.ltsv`;

    const formattedVenues = venues.sorted.map((e) => e.format());

    fs.writeFileSync(file, format(formattedVenues) + "\n");
  },
  loadLinkedVenues: (target: string) => {
    return new VenueList(
      ...parse(fs.readFileSync(`venues/${target}/linked.ltsv`).toString()).map((e) => new Venue(e as any))
    );
  },
  updateNotLinkedVenues: (target: string, venues: VenueList) => {
    const file = `venues/${target}/notlinked.ltsv`;

    const formattedVenues = venues.sorted.map((e) => e.format());

    fs.writeFileSync(file, format(formattedVenues) + "\n");
  },
  loadNotLinkedVenues: (target: string) => {
    return new VenueList(
      ...parse(fs.readFileSync(`venues/${target}/notlinked.ltsv`).toString()).map((e) => new Venue(e as any))
    );
  },
  loadUnLinkedVenues: (target: string) => {
    return new VenueList(
      ...parse(fs.readFileSync(`venues/${target}/unlinked.ltsv`).toString()).map((e) => new Venue(e as any))
    );
  },
  updateUnLinkedVenues: (target: string, venues: VenueList) => {
    const file = `venues/${target}/unlinked.ltsv`;

    const formattedVenues = venues.sorted.map((e) => e.format());

    fs.writeFileSync(file, format(formattedVenues) + "\n");
  },
  loadNoListVenues: (target: string) => {
    return new VenueList(
      ...parse(fs.readFileSync(`venues/${target}/nolist.ltsv`).toString()).map((e) => new Venue(e as any))
    );
  },
};
