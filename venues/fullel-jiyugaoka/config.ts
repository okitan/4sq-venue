import { Config, ScrapeConfig } from "../../src/types/config";

const config: Config = {
  id: "4ddee63c1fc70c691ef7fda3",
  name: "フレル・ウィズ 自由が丘",
  subvenues: [],
  linker: {
    ignore: ["フレル・ウィズ", "自由が丘", "東急"],
  },
  scraper: [1, 2, 3].map(
    // Now there are no venues on 4th floor
    (level): ScrapeConfig => {
      return {
        url: `http://www.fullel.com/jiyugaoka/shopguide/?floor=${level}f`,
        venues: {
          ".shop-box": {
            followLink: { selector: "a", property: "href" },
            name: { selector: ".shop-name" },
            phone: { selector: "xpath/.//p[contains(text(), '電話番号')]/following-sibling::div/a" },
            level,
          },
        },
      };
    },
  ),
};

export = config;
