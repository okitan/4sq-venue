import type { Arguments, Argv } from "yargs";

import { commonArgs, type Extract } from "../../commonArgs.ts";
import { linkVenues } from "../../linker.ts";
import { addFoursquareClientOptions } from "../../services/4sq.ts";
import type { Config } from "../../types/config.ts";
import type { FoursquareVenue } from "../../types/4sq/resource.ts";
import { Venue } from "../../venue.ts";
import {
  loadLinkedVenues,
  loadNoListVenues,
  loadScrapedVenues,
  loadUnLinkedVenues,
  updateLinkedVenues,
  updateNotLinkedVenues,
  updateUnLinkedVenues,
  VenueList,
} from "../../venueList.ts";

export const command = "update [Options]";
export const description = "link scraped venues to foursquare venues";

export function builder<T>(yargs: Argv<T>) {
  return addFoursquareClientOptions(yargs).options({ target: commonArgs.targetWithCompletion });
}

export async function handler({ foursquareClient, target }: Arguments<Extract<ReturnType<typeof builder>>>) {
  const config: Config = (await import(`../../../venues/${target}/config.ts`)).default;

  const scrapedVenues = loadScrapedVenues(target);

  const foursquareVenues = (
    await Promise.all(
      [config, ...config.subvenues].map(async (parentVenue) => {
        const response = await foursquareClient.getVenueChildren({ venueId: parentVenue.id });

        return response.children.groups
          .flatMap((group: { items: FoursquareVenue[] }) => group.items)
          .map((venue: FoursquareVenue) => Venue.fromFoursquare(venue, { parentVenueId: parentVenue.id }));
      }),
    )
  ).reduce<VenueList>((result, venues: Venue[]) => {
    // Promise.all(flatmap) also returns array of array, so I don't use flatmap
    result.push(...venues);
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
