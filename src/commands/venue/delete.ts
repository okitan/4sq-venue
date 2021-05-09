import yargs from "yargs";

import { commonArgs, Extract } from "../../cli";
import { addFoursquareClientOptions } from "../../services/4sq";
import { DetailedFoursquareVenue } from "../../types/4sq/resource";

export const command = "delete [Options]";
export const description = "delete venue";

export function builder<T>(yargs: yargs.Argv<T>) {
  return addFoursquareClientOptions(yargs).options({ venueId: commonArgs.venueId, dryRun: commonArgs.dryRun });
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
