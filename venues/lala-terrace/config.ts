import { Config, ScrapeConfig } from "../../src/config";

const config: Config = {
  id: "52ef1927498e945f59640219",
  name: "ららテラス武蔵小杉",
  subvenues: [],
  linker: {
    ignore: ["ららテラス", "武蔵小杉"],
  },
  // XXX: floor may be changed???a
  scraper: [113, 114, 115, 116].map(
    (floor, i): ScrapeConfig => {
      return {
        url: `https://mitsui-shopping-park.com/lalat-musashikosugi/shopguide/?floor=${floor}`,
        venues: {
          "ul.shop-guide-list-wrap li": {
            followLink: { selector: "a", property: "href" },
            name: { selector: ".brand__name" },
            phone: { selector: ".tel-link", nullable: true },
            level: i + 1,
          },
        },
      };
    }
  ),
};

export = config;
