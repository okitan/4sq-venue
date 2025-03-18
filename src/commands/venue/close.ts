import yargs from "yargs";

import { commonArgs, Extract } from "../../cli";
import { addFoursquareClientOptions } from "../../services/4sq";

export const command = "close [Options]";
export const description = "close venue";

export function builder<T>(yargs: yargs.Argv<T>) {
  return addFoursquareClientOptions(yargs).options({
    venueId: commonArgs.venueId,
    exec: commonArgs.exec,
  });
}

export async function handler({
  foursquareClient,
  venueId,
  exec,
}: yargs.Arguments<Extract<ReturnType<typeof builder>>>) {
  const venue = (await foursquareClient.getVenue({ venueId })).venue;

  if (!exec) {
    console.log(`If you like to close venue ${venue.name} (id: ${venue.id}), try --exec`);
    return;
  }

  const result = await foursquareClient.closeVenue({ venueId });
  console.log(`venue ${result.name} is flagged(${result.flags.count})`);
}
