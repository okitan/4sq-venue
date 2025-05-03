import type yargs from "yargs";
import yeoman from "yeoman-environment";
import Generator from "yeoman-generator";

import { commonArgs, type Extract } from "../cli";
import { addFoursquareClientOptions, type FoursquareClient } from "../services/4sq";
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

type Argument = yargs.Arguments<Extract<ReturnType<typeof builder>>>;

export function handler(args: Argument) {
  // @ts-ignore: yeoman-environmentの型定義が古い
  const env = yeoman.createEnv();

  const generator = env.create(VenueGenerator, {
    arguments: [],
    options: {
      ...args,
      namespace: "venue",
    },
  });

  generator.run();
}

// @ts-ignore: yeoman-generatorの型定義が古い
export class VenueGenerator extends Generator<Argument> {
  venue?: Venue;
  subVenues: Venue[] = [];

  get foursquareClient(): FoursquareClient {
    return this.options.foursquareClient;
  }

  async initializing() {
    const options = this.options;

    // fetch venue
    this.venue = new Venue(await (await this.foursquareClient.getVenue({ venueId: options.venueId })).venue);

    // fetch subvenues
    this.subVenues = await Promise.all(
      options.subVenueId.map(async (id) => new Venue((await this.foursquareClient.getVenue({ venueId: id })).venue)),
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
