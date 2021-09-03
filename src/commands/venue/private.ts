import yargs from "yargs";

import { commonArgs, Extract } from "../../cli";
import { addFoursquareClientOptions } from "../../services/4sq";

export const command = "private [Options]";
export const description = "private venue";

export function builder<T>(yargs: yargs.Argv<T>) {
  return addFoursquareClientOptions(yargs).options({ venueId: commonArgs.venueId, dryRun: commonArgs.dryRun });
}

export async function handler({
  foursquareClient,
  venueId,
  dryRun,
}: yargs.Arguments<Extract<ReturnType<typeof builder>>>) {
  const venue = (await foursquareClient.getVenue({ venueId })).venue;

  if (dryRun) {
    console.log(`venue ${venue.name} (id: ${venue.id}) can be private. try --no-dry-run`);
  } else {
    const result = await foursquareClient.privateVenue({ venueId });

    console.log(`venue ${result.name} is flagged(${result.flags.count})`);
  }
}
