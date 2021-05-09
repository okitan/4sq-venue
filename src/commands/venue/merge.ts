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
    .options({ dryRun: commonArgs.dryRun });
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
  mergerId,
  mergeeId,
  dryRun,
}: yargs.Arguments<Extract<ReturnType<typeof builder>>>) {
  const merger = (await foursquareClient.getVenue({ venueId: mergerId })).venue;
  const mergee = (await foursquareClient.getVenue({ venueId: mergeeId })).venue;

  if (dryRun) {
    console.log(`merging ${merger.name} with ${mergee.name}. try --no-dry-run`);
  } else {
    const result = await foursquareClient.mergeVenue({ mergerId, mergeeId });
    console.log(`venue ${result.name} is flagged(${result.flags.count})`);
  }
}
