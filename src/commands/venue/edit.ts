import yargs from "yargs";

import { commonArgs, Extract } from "../../cli";
import { addFoursquareClientOptions } from "../../services/4sq";

export const command = "edit [Options]";
export const description = "edit venue";

export function builder<T>(yargs: yargs.Argv<T>) {
  return addFoursquareClientOptions(yargs).options({
    venueId: commonArgs.venueId,
    location: {
      type: "string",
      alias: "l",
      coerce: (location) => {
        const [lat, lng] = location.split(",");
        if (!lng) {
          console.error(`${location} is not lat,lng and ignored`);
          return "";
        }
        return `${lat},${lng}`;
      },
    },
    dryRun: commonArgs.dryRun,
  });
}

export async function handler({
  foursquareClient,
  venueId,
  dryRun,
  ...args
}: yargs.Arguments<Extract<ReturnType<typeof builder>>>) {
  const venue = (await foursquareClient.getVenue({ venueId })).venue;

  const actual: { [x: string]: string } = {};
  const options: { [x: string]: string } = {};

  if (args.location) {
    actual.venuell = `${venue.location.lat},${venue.location.lng}`;
    options.venuell = args.location;
  }

  console.log(`updating ${venue.name}`);
  Object.keys(options).forEach((key) => {
    console.log(`${key}: ${actual[key]} => ${options[key]}`);
  });

  if (!dryRun) {
    const result = await foursquareClient.updateVenue({ venueId, options });

    console.log(JSON.stringify(result, null, 2));
  }
}
