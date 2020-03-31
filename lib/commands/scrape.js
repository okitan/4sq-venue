"use strict";

module.exports = {
  command: "scrape <target> [Options]",
  desc: "scrape venues",
  builder: {},
};

const fs = require("fs");

const ora = require("ora");

const { updateScrapedVenues } = require("../venueList");
const { scrape } = require("../scraper");

module.exports.handler = async ({ target, ...args }) => {
  const configFile = `../../venues/${target}/config.js`;

  // TODO: error handling
  const config = require(configFile);
  const targets = config.scraper || [];

  const results = [];
  // scrape not in pararelle
  for (const { url, options, venues, fetch } of targets) {
    let spinner;
    try {
      if (fetch) {
        spinner = ora("start fetchinging api");
        const result = await fetch();
        results.push(...result);

        spinner.succeed(
          ["Scraped", `${result.length} venues found`].join("\n")
        );
      } else {
        // start scraping
        spinner = ora(`Scraping ${url}`).start();

        const result = await scrape(url, venues, options, (message) => {
          spinner.text = [`Scraping ${url}`, message].join("\n");
        });

        results.push(...result);

        spinner.succeed(
          [`Scraped ${url}`, `${result.length} venues found`].join("\n")
        );
      }
    } catch (err) {
      if (spinner) spinner.fail([`Scrape ${url}`, err].join("\n"));
      throw err;
    }
  }

  updateScrapedVenues(target, results);
};
