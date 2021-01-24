import ora from "ora";
import yargs from "yargs";

import { Extract } from "../cli";
import { loadConfig } from "../config";
import { scrape, ScrapedProperties } from "../scraper";
import { Venue } from "../venue";
import { updateScrapedVenues, VenueList } from "../venueList";

export const command = "scrape <target> [Options]";
export const description = "scrape venues";

export function builder<T>(yargs: yargs.Argv<T>) {
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

// handler cannot be async
export function handler(args: Parameters<typeof _handler>[0]) {
  _handler(args).catch((err) => {
    console.error(err);
    process.exit(129);
  });
}

export async function _handler({ target }: yargs.Arguments<Extract<ReturnType<typeof builder>>>) {
  const config = loadConfig(target);

  const results: ScrapedProperties[] = [];
  // scrape not in pararelle
  for (const scrapeConfig of config.scraper) {
    const spinner = ora().start();

    try {
      if ("fetch" in scrapeConfig) {
        spinner.text = "start fetchinging api";

        const result = await scrapeConfig.fetch();
        results.push(...result);

        spinner.succeed(["Scraped", `${result.length} venues found`].join("\n"));
      } else {
        spinner.text = `Scraping ${scrapeConfig.url}`;

        const result = await scrape({
          ...scrapeConfig,
          notify: (message) => {
            spinner.text = [`Scraping ${scrapeConfig.url}`, message].join("\n");
          },
        });
        results.push(...result);

        spinner.succeed([`Scraped ${scrapeConfig.url}`, `${result.length} venues found`].join("\n"));
      }
    } catch (err) {
      spinner.fail([`Scrape errors against ${JSON.stringify(scrapeConfig)}`, err].join("\n"));
      throw err;
    }
  }

  updateScrapedVenues(target, new VenueList(...results.map((e) => Venue.fromScraped(e))));
}
