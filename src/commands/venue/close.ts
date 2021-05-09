import yargs from "yargs";

import { commonArgs, Extract } from "../../cli";
import { addFoursquareClientOptions } from "../../services/4sq";

export const command = "close [Options]";
export const description = "close venue";

export function builder<T>(yargs: yargs.Argv<T>) {
  return addFoursquareClientOptions(yargs).options({ venueId: commonArgs.venueId, dryRun: commonArgs.dryRun });
}

// handler cannot be async
export function handler(args: Parameters<typeof _handler>[0]) {
  _handler(args).catch((err) => {
    console.error(err);
    process.exit(129);
  });
}

export async function _handler({
  foursquareClient,
  venueId,
  dryRun,
}: yargs.Arguments<Extract<ReturnType<typeof builder>>>) {
  const venue = (await foursquareClient.getVenue({ venueId })).venue;

  if (dryRun) {
    console.log(`If you exactly close venue ${venue.name} (id: ${venue.id}), try --no-dry-run`);
  } else {
    const result = await foursquareClient.closeVenue({ venueId });

    console.log(`venue ${result.name} is flagged(${result.flags.count})`);
  }
}
