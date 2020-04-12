import yargs from "yargs";

import { Extract } from "../../cli";
import { guessTargetFromBranchName } from "../../util";
import { Venue } from "../../venue";
import { loadLinkedVenues, loadNotLinkedVenues, updateLinkedVenues, updateNotLinkedVenues } from "../../venueList";

export const command = "add";
export const description = "add link manually";

export function builder(yargs: yargs.Argv) {
  return yargs.options({
    target: {
      type: "string",
      default: guessTargetFromBranchName(),
      demandOption: true,
    },
    foursquareName: {
      type: "string",
      alias: "f",
      demandOption: true,
    },
    scrapedName: {
      type: "string",
      alias: "s",
      demandOption: true,
    },
  });
}

export function handler({ target, foursquareName, scrapedName }: yargs.Arguments<Extract<ReturnType<typeof builder>>>) {
  if (!target) throw `target should not be null`; // never

  const linkedVenues = loadLinkedVenues(target);
  const notLinkedVenues = loadNotLinkedVenues(target);

  const foursquareVenue = notLinkedVenues.removeVenue(new Venue({ name: foursquareName }), { guess: true });
  const scrapedVenue = notLinkedVenues.removeVenue(new Venue({ name: scrapedName }), { guess: true });

  if (!foursquareVenue) throw `no foursquare venue found for ${foursquareName}`;
  if (!scrapedVenue) throw `no scraped venue found for ${scrapedName}`;

  console.table({
    foursquare: foursquareVenue.name,
    scraped: scrapedVenue.scraped?.name,
  });

  foursquareVenue.scraped = scrapedVenue.scraped;
  linkedVenues.push(foursquareVenue);

  updateLinkedVenues(target, linkedVenues);
  updateNotLinkedVenues(target, notLinkedVenues);
}
