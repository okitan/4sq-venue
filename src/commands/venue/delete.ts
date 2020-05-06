import yargs from "yargs";

import { Extract } from "../../cli";
import { addFoursquareClientOptions } from "../../services/4sq";
import { DetailedFoursquareVenue } from "../../types/4sq/resource";

export const command = "delete <venueId>";
export const description = "delete venue";

export function builder(yargs: yargs.Argv) {
  return addFoursquareClientOptions(yargs)
    .positional("venueId", {
      type: "string",
      demandOption: true,
    })
    .options({
      dryRun: {
        type: "boolean",
        default: true,
        demandOption: true,
      },
    });
}

export async function handler({
  foursquareClient,
  venueId,
  dryRun,
}: yargs.Arguments<Extract<ReturnType<typeof builder>>>) {
  const venue = (await foursquareClient.getVenue({ venueId })).venue;

  if (canDelete(venue)) {
    if (dryRun) {
      console.log(`venue ${venue.name} (id: ${venue.id}) can be deleted. try --no-dry-run`);
    } else {
      // DELETE
      const result = await foursquareClient.deleteVenue({ venueId });

      console.log(`venue ${result.name} is flagged(${result.flags.count})`);
    }
  } else {
    console.error(`venue ${venue.name} (id: ${venue.id}) already have something. try merge`);
  }
}

function canDelete(venue: DetailedFoursquareVenue): boolean {
  return !(
    venue.likes.count ||
    venue.beenHere.count ||
    venue.photos.count ||
    venue.reasons.count ||
    venue.tips.count ||
    venue.listed.count
  );
}
