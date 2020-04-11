import yargs from "yargs";

import { Extract } from "../cli";
import { linkVenues } from "../linker";
import { addFoursquareClientOptions } from "../services/4sq";
import { Config } from "../types/config";
import { Venue } from "../venue";
import {
  loadLinkedVenues,
  loadNoListVenues,
  loadScrapedVenues,
  loadUnLinkedVenues,
  updateLinkedVenues,
  updateNotLinkedVenues,
  updateUnLinkedVenues,
  VenueList,
} from "../venueList";

export const command = "link <target> [Options]";
export const description = "link scraped venues to foursquare venues";

export function builder<T extends yargs.Argv>(yargs: T) {
  return (
    addFoursquareClientOptions(yargs)
      // TODO: inject target by its branch name
      .positional("target", {
        type: "string",
        description: "venue name",
        demandOption: true,
      })
  );
}

export async function handler({ foursquareClient, target }: yargs.Arguments<Extract<ReturnType<typeof builder>>>) {
  const config = require(`../../venues/${target}/config`) as Config;

  const scrapedVenues = loadScrapedVenues(target);

  const foursquareVenues = (
    await Promise.all(
      [config.id, ...(config.subvenues || []).map((e) => e.id)].map(async (id) => {
        const response = await foursquareClient.getVenueChildren({ venueId: id });

        return response.children.groups
          .flatMap((group) => group.items)
          .map((venue) => Venue.from(venue, { parentVenueId: id }));
      })
    )
  ).reduce<VenueList>((result, e) => {
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

  const [linkedVenues, notLinkedVenues, unLinkedVenues] = linkVenues({
    scrapedVenues,
    foursquareVenues,
    noListVenues,
    previousResult,
    previousUnLinkedVenues,
    ignore: config.linker.ignore,
  });

  console.log(`linked: ${linkedVenues.length}`);
  console.log(`no links: ${notLinkedVenues.length}`);
  console.log(`closed: ${unLinkedVenues.length}`);

  updateLinkedVenues(target, linkedVenues);
  updateNotLinkedVenues(target, notLinkedVenues);
  updateUnLinkedVenues(target, unLinkedVenues);
}
