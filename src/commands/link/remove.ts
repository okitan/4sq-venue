import yargs from "yargs";

import { commonArgs } from "../../commonArgs.ts";
import type { Extract } from "../../commonArgs.ts";
import { Venue } from "../../venue.ts";
import { loadLinkedVenues, loadNotLinkedVenues, updateLinkedVenues, updateNotLinkedVenues } from "../../venueList.ts";

export const command = "remove [Options]";
export const description = "remove link";

export function builder<T>(yargs: yargs.Argv<T>) {
  return yargs.options({
    target: commonArgs.targetWithCompletion,
    name: {
      type: "string",
      alias: "n",
      array: true,
      demandOption: true,
    },
  });
}

export function handler({ target, name: names }: yargs.Arguments<Extract<ReturnType<typeof builder>>>) {
  const linkedVenues = loadLinkedVenues(target);
  const notLinkedVenues = loadNotLinkedVenues(target);

  // console.log(notLinkedVenues);
  names.forEach((name) => {
    const linkedVenue = linkedVenues.removeVenue(new Venue({ name }), { guess: true });

    if (!linkedVenue || !linkedVenue.scraped) throw `no venue found for ${name}`;

    const scrapedVenue = Venue.fromScraped(linkedVenue.scraped);
    linkedVenue.scraped = undefined;

    notLinkedVenues.push(scrapedVenue, linkedVenue);
  });

  updateLinkedVenues(target, linkedVenues);
  updateNotLinkedVenues(target, notLinkedVenues);
}
