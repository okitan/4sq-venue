import yargs from "yargs";

import { commonArgs, Extract } from "../../cli";
import { addFoursquareClientOptions } from "../../services/4sq";

export const command = "merge <mergerId> <mergeeId> [Options]";
export const description = "merge venues";

export function builder<T>(yargs: yargs.Argv<T>) {
  return addFoursquareClientOptions(yargs)
    .positional("mergerId", {
      type: "string",
      demandOption: true,
    })
    .positional("mergeeId", {
      type: "string",
      demandOption: true,
    })
    .options({ exec: commonArgs.exec });
}

export async function handler({
  foursquareClient,
  mergerId,
  mergeeId,
  exec,
}: yargs.Arguments<Extract<ReturnType<typeof builder>>>) {
  const merger = (await foursquareClient.getVenue({ venueId: mergerId })).venue;
  const mergee = (await foursquareClient.getVenue({ venueId: mergeeId })).venue;

  if (!exec) {
    console.log(`If you like to merge ${merger.name} with ${mergee.name}. try --exec`);
    return;
  }

  const result = await foursquareClient.mergeVenue({ mergerId, mergeeId });
  console.log(`venue ${result.name} is flagged(${result.flags.count})`);
}
