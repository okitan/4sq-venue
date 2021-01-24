import { Config, ScrapeConfig } from "../../src/config";
import { phoneExtractor } from "../../src/modifier";

const config: Config = {
  id: "50966024e4b0ad0d96424f52",
  name: "武蔵小杉東急スクエア",
  subvenues: [{ id: "516f70a7e4b0ae9eea0f8d97", name: "東急フードショースライス" }],
  linker: {
    ignore: ["武蔵小杉", "東急スクエア", "東急フードショースライス"],
  },
  scraper: [1, 2, 3, 4, 5].map(
    (e): ScrapeConfig => {
      return {
        url: `https://www.kosugi-square.com/floor/?floor=${e}f`,
        venues: {
          ".article-list li": {
            name: { selector: ".shopname" },
            phone: { selector: ".tel", modifier: phoneExtractor },
            url: { selector: "a", property: "href" },
            level: e,
          },
        },
      };
    }
  ),
};

module.exports.scraper = [
  ...[1, 2, 3, 4, 5].map((e) => {
    return {
      url: `https://www.kosugi-square.com/floor/?fcd=${e}`,
      venues: {
        ".floorlistInner li": {
          name: { selector: ".floorlist__txt--shopname" },
          phone: { selector: ".floorlist__txt--tel", nullable: true },
          url: { selector: "a", property: "href", nullable: true },
          level: e,
        },
      },
    };
  }),
];

export = config;
