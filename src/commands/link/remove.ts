import yargs from "yargs";

import { Extract } from "../../cli";
import { guessTargetFromBranchName } from "../../util";
import { Venue } from "../../venue";
import { loadLinkedVenues, loadNotLinkedVenues, updateLinkedVenues, updateNotLinkedVenues } from "../../venueList";

export const command = "remove";
export const description = "remove link";

export function builder(yargs: yargs.Argv) {
  return yargs.options({
    target: {
      type: "string",
      default: guessTargetFromBranchName(),
      demandOption: true,
    },
    name: {
      type: "string",
      alias: "n",
      array: true,
      demandOption: true,
    },
  });
}

export function handler({ target, name: names }: yargs.Arguments<Extract<ReturnType<typeof builder>>>) {
  if (!target) throw `target should not be null`; // never

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
