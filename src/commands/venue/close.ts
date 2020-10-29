import yargs from "yargs";

import { Extract } from "../../cli";
import { addFoursquareClientOptions } from "../../services/4sq";

export const command = "close <venueId>";
export const description = "close venue";

export function builder<T>(yargs: yargs.Argv<T>) {
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
