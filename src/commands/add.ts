import yargs from "yargs";
import yeoman from "yeoman-environment";
import Generator from "yeoman-generator";

import { commonArgs, Extract } from "../cli";
import { addFoursquareClientOptions, FoursquareClient } from "../services/4sq";
import { Venue } from "../venue";

export const command = "add [Options]";
export const description = "add venue config";

export function builder<T>(yargs: yargs.Argv<T>) {
  return addFoursquareClientOptions(yargs).options({
    target: {
      type: "string",
      alias: "t",
      demandOption: true,
    },
    venueId: {
      ...commonArgs.venueId,
      desc: "foursquare parent venue id",
    },
    subVenueId: {
      type: "string",
      array: true,
      desc: "foursquare parnet subvenue id",
      alias: "subVenues",
      default: [],
    },
  });
}

export function handler(args: yargs.Arguments<Extract<ReturnType<typeof builder>>>) {
  const env = yeoman.createEnv();

  const generator = env.instantiate(VenueGenerator, { arguments: [], options: args });

  generator.run();
}

export class VenueGenerator extends Generator {
  venue?: Venue;
  subVenues: Venue[] = [];

  get foursquareClient(): FoursquareClient {
    return this.options.foursquareClient;
  }

  async initializing() {
    const options = this.options as yargs.Arguments<Extract<ReturnType<typeof builder>>>;

    // fetch venue
    this.venue = new Venue(await (await this.foursquareClient.getVenue({ venueId: options.venueId })).venue);

    // fetch subvenues
    this.subVenues = await Promise.all(
      options.subVenueId.map(async (id) => new Venue((await this.foursquareClient.getVenue({ venueId: id })).venue))
    );
  }

  writing() {
    if (!this.venue) throw `no venue assigned`; //never

    const { target } = this.options as yargs.Arguments<Extract<ReturnType<typeof builder>>>;

    // config
    const configPath = this.destinationPath(`venues/${target}/config.ts`);

    this.fs.copyTpl(this.templatePath("config.ts"), configPath, {
      id: this.venue.id,
      name: this.venue.name,
      subVenues: this.subVenues.map((venue) => {
        return { id: venue.id, name: venue.name };
      }),
    });
    this.spawnCommand("npx", ["prettier", "--write", configPath]);

    // TODO: .github/scheduled-{link,scrape}.yml
  }
}
