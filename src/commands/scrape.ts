import ora from "ora";
import yargs from "yargs";

import { Extract } from "../cli";
import { scrape, ScrapedProperties } from "../scraper";
import { Venue } from "../venue";
import { updateScrapedVenues, VenueList } from "../venueList";

export const command = "scrape <target> [Options]";
export const description = "scrape venues";

export function builder<T extends yargs.Argv>(yargs: T) {
  return (
    yargs
      // TODO: inject target by its branch name
      .positional("target", {
        type: "string",
        description: "venue name",
        demandOption: true,
      })
  );
}

export async function handler({ target }: yargs.Arguments<Extract<ReturnType<typeof builder>>>) {
  const config = require(`../../venues/${target}/config`);
  const targets = config.scraper || [];

  const results: ScrapedProperties[] = [];
  // scrape not in pararelle
  for (const { url, options, venues, fetch } of targets) {
    const spinner = ora().start();

    try {
      if (fetch) {
        spinner.text = "start fetchinging api";
        const result = await fetch();
        results.push(...result);

        spinner.succeed(["Scraped", `${result.length} venues found`].join("\n"));
      } else {
        // start scraping
        spinner.text = `Scraping ${url}`;

        const result = await scrape({
          url,
          venues,
          options,
          notify: (message) => {
            spinner.text = [`Scraping ${url}`, message].join("\n");
          },
        });

        results.push(...result);

        spinner.succeed([`Scraped ${url}`, `${result.length} venues found`].join("\n"));
      }
    } catch (err) {
      spinner.fail([`Scrape ${url}`, err].join("\n"));
      throw err;
    }
  }

  updateScrapedVenues(target, new VenueList(...results.map((e) => Venue.fromScraped(e))));
}
