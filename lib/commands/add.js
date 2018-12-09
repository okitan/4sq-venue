"use strict";

module.exports = {
  command: "add <target> [Options]",
  desc: "add target",
  builder: {
    venueId: {
      type: "string",
      desc: "foursquare parent venue id",
      alias: "venue",
      required: true
    },
    subVenueIds: {
      type: "array",
      desc: "foursquare parnet subvenue id",
      alias: "subVenues",
      default: []
    }
  }
};

const fs = require("fs");

const yeoman = require("yeoman-environment");
const Generator = require("yeoman-generator");

const { getVenue } = require("../4sqClient");

class VenueGenerator extends Generator {
  async initializing() {
    // fetch venue
    this.venue = await getVenue(this.options.venue);

    // fetch subvenues
    this.subVenues = await Promise.all(
      this.options.subVenues.map(id => getVenue(id))
    );
  }

  writing() {
    const target = this.options.target;
    // config.js
    this.fs.copyTpl(
      this.templatePath("config.js"),
      this.destinationPath(`venues/${target}/config.js`),
      {
        id: this.venue.id,
        name: this.venue.name,
        subVenues: this.subVenues.map(venue => {
          return { id: venue.id, name: venue.name };
        })
      }
    );

    this.spawnCommand("npx", [
      "prettier",
      "--write",
      this.destinationPath(`venues/${target}/config.js`)
    ]);

    // .circleci/config.yml
    const data = fs.readFileSync(
      this.destinationPath(".circleci/config.yml"),
      "utf-8"
    );
    let lines = data.split("\n");

    // adding scrape jobs
    const indexOfAddingScrape = lines.findIndex(line =>
      line.includes("DO_NOT_REMOVE:FOR_ADDING_SCRAPE")
    );
    const scrapeJobsEndIndex =
      lines
        .slice(indexOfAddingScrape + 1) // next of DO_NOT_REMOVE
        .findIndex(line => !line.trim().startsWith("-")) + indexOfAddingScrape;

    const scrapeTargets = lines.slice(
      indexOfAddingScrape + 1,
      scrapeJobsEndIndex + 1
    );

    if (!scrapeTargets.some(line => line.includes(`scrape-${target}`))) {
      lines = [
        ...lines.slice(0, indexOfAddingScrape + 1),
        ...scrapeTargets,
        `      - scrape: { target: ${target}, name: scrape-${target} }`,
        `      - commit: { target: ${target}, name: commit-scrape-${target}, requires: [scrape-${target}] }`,
        ...lines.slice(scrapeJobsEndIndex + 1)
      ];
    }

    // adding link jobs
    const indexOfAddingLink = lines.findIndex(line =>
      line.includes("DO_NOT_REMOVE:FOR_ADDING_LINK")
    );
    const linkJobsEndIndex =
      lines
        .slice(indexOfAddingLink + 1) // next of DO_NOT_REMOVE
        .findIndex(line => !line.trim().startsWith("-")) + indexOfAddingLink;

    const linkTargets = lines.slice(
      indexOfAddingLink + 1,
      linkJobsEndIndex + 1
    );

    if (!linkTargets.some(line => line.includes(`link-${target}`))) {
      lines = [
        ...lines.slice(0, indexOfAddingLink + 1),
        ...linkTargets,
        `      - link:   { target: ${target}, name: link-${target} }`,
        `      - commit: { target: ${target}, name: commit-link-${target}, requires: [link-${target}] }`,
        ...lines.slice(linkJobsEndIndex + 1)
      ];
    }

    this.fs.write(".circleci/config.yml", lines.join("\n"));
  }
}

module.exports.handler = async args => {
  const env = yeoman.createEnv();

  const generator = env.instantiate(VenueGenerator, { options: args });

  generator.run();
};
